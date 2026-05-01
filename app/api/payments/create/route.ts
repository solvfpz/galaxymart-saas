import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const { productId, productDetails } = body;

    if (!productId || !productDetails) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch Product and Calculate Raw Price
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    // Product.price might be a string like "$2.49" or a number
    const priceStr = String(product.price);
    const priceValue = typeof product.price === 'string'
      ? parseFloat(priceStr.replace('$', ''))
      : product.price;
      
    const quantity = parseInt(productDetails.quantity) || 1;
    let totalPrice = priceValue * quantity;

    // 2. Validate Coupon and Apply Discount (Server-side)
    if (productDetails.coupon) {
      const coupon = await Coupon.findOne({ 
        code: productDetails.coupon.toUpperCase(), 
        active: true 
      });

      if (coupon) {
        const now = new Date();
        if (new Date(coupon.expiryDate) > now) {
          // Assuming coupon.discount is a percentage (e.g., 10 for 10% off)
          const discountAmount = (totalPrice * coupon.discount) / 100;
          totalPrice -= discountAmount;
        }
      }
    }

    // 3. Final USD Amount (Round to 2 decimal places)
    const finalUsdAmount = parseFloat(totalPrice.toFixed(2));

    // 4. Fetch Real-time LTC Price
    let ltcPrice = 0;
    try {
      const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd');
      const priceData = await priceRes.json();
      ltcPrice = priceData.litecoin.usd;
    } catch (error) {
      console.error('CoinGecko API Error:', error);
      // Fallback for demo if API fails, but in production we should error out
      return NextResponse.json({ success: false, message: 'Unable to fetch crypto price, try again' }, { status: 503 });
    }

    if (!ltcPrice) {
      return NextResponse.json({ success: false, message: 'Unable to fetch crypto price, try again' }, { status: 503 });
    }

    // 5. Calculate Crypto Amount
    const finalLtcAmount = parseFloat((finalUsdAmount / ltcPrice).toFixed(8));

    // 6. Generate Payment Details
    const paymentId = `INV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const walletAddress = 'LcWvG5K8PqX8H5Vn7x3mZ2Y6z4N9eB1cQ'; // Placeholder LTC Address
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // 7. Create Order (Lock Price)
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

    // Reduce stock by quantity
    await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });

    // 8. Return to Frontend
    return NextResponse.json({
      success: true,
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
