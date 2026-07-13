import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import crypto from 'crypto';
import Settings from '@/models/Settings';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const { productId, productDetails } = body;

    if (!productId || !productDetails) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const priceStr = String(product.price);
    const priceValue = typeof product.price === 'string'
      ? parseFloat(priceStr.replace('$', ''))
      : product.price;
      
    const quantity = parseInt(productDetails.quantity) || 1;

    if (product.stock < quantity) {
      return NextResponse.json({ success: false, message: 'Not enough stock available' }, { status: 400 });
    }

    let totalPrice = priceValue * quantity;

    if (productDetails.coupon) {
      const coupon = await Coupon.findOne({ 
        code: productDetails.coupon.toUpperCase(), 
        active: true 
      });

      if (coupon) {
        const now = new Date();
        if (new Date(coupon.expiryDate) > now) {
          const discountAmount = (totalPrice * coupon.discount) / 100;
          totalPrice -= discountAmount;
        }
      }
    }

    const finalUsdAmount = parseFloat(totalPrice.toFixed(2));

    let ltcPrice = 0;
    try {
      const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
      const priceData = await priceRes.json();
      ltcPrice = priceData.litecoin.usd;
    } catch (error) {
      console.error('CoinGecko API Error:', error);
      return NextResponse.json({ success: false, message: 'Unable to fetch crypto price, try again' }, { status: 503 });
    }

    if (!ltcPrice) {
      return NextResponse.json({ success: false, message: 'Unable to fetch crypto price, try again' }, { status: 503 });
    }

    const finalLtcAmount = parseFloat((finalUsdAmount / ltcPrice).toFixed(8));

    const paymentId = `INV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const settings = await Settings.findOne({});
    const walletAddress = settings?.ltcWalletAddress || 'LcWvG5K8PqX8H5Vn7x3mZ2Y6z4N9eB1cQ';
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const order = await Order.create({
      productId,
      customerEmail: productDetails.email,
      status: 'pending',
      quantity,
      amount: finalUsdAmount,
      usdAmount: finalUsdAmount,
      ltcAmount: finalLtcAmount,
      ltcPriceAtTime: ltcPrice,
      paymentId,
      walletAddress,
      expiresAt
    });

    return NextResponse.json({
      success: true,
      orderId: String(order._id),
      paymentId: order.paymentId,
      ltcAmount: order.ltcAmount,
      usdAmount: order.usdAmount,
      walletAddress: order.walletAddress,
      expiresAt: order.expiresAt,
      createdAt: order.createdAt,
      crypto: 'LTC',
      productName: product.name,
      productImage: product.image
    }, { status: 201 });

  } catch (error: any) {
    console.error('Payment Create Error:', error);
    return NextResponse.json({ success: false, message: 'Error creating payment' }, { status: 500 });
  }
}
