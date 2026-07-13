import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

async function processOrderDelivery(order: any) {
  const orderId = typeof order === 'string' ? order : String(order._id || order.id);
  
  let freshOrder = await Order.findById(orderId);
  if (!freshOrder) {
    console.error(`verify-manual processOrderDelivery: Order not found for id=${orderId}`);
    return [];
  }

  if (Array.isArray(freshOrder.deliveredSerials) && freshOrder.deliveredSerials.length > 0) {
    console.log(`verify-manual processOrderDelivery: Order ${orderId} already has delivered serials`);
    return freshOrder.deliveredSerials;
  }

  const product = await Product.findById(freshOrder.productId);
  if (!product) {
    console.error(`verify-manual processOrderDelivery: Product not found for id=${freshOrder.productId}`);
    return [];
  }

  const availableSerials = Array.isArray(product.serials) ? product.serials : [];
  const quantity = freshOrder.quantity || 1;

  if (availableSerials.length < quantity) {
    console.warn(`verify-manual processOrderDelivery: Not enough serials for order ${orderId}. Have ${availableSerials.length}, need ${quantity}`);
    return [];
  }

  const deliveredSerials = availableSerials.slice(0, quantity);
  const remainingSerials = availableSerials.slice(quantity);

  product.serials = remainingSerials;
  product.stock = remainingSerials.length;
  product.markModified('serials');
  await product.save();

  freshOrder.deliveredSerials = deliveredSerials;
  freshOrder.markModified('deliveredSerials');
  await freshOrder.save();

  console.log(`verify-manual processOrderDelivery: SUCCESS - Delivered ${quantity} serials for order ${orderId}:`, deliveredSerials);

  return deliveredSerials;
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { txId, paymentId } = await req.json();
    if (!txId || !paymentId) {
      return NextResponse.json({ success: false, message: 'Missing txId or paymentId' }, { status: 400 });
    }

    const existing = await Order.findOne({ txId });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Transaction already used for another order' }, { status: 400 });
    }

    const order = await Order.findOne({ paymentId });
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (['confirmed', 'delivered', 'manual'].includes(order.status) && order.deliveredSerials?.length > 0) {
      return NextResponse.json({ success: true, message: 'Order already confirmed' });
    }

    const extractedTxId = txId.includes('/') ? txId.split('/').filter(Boolean).pop() : txId;

    const bcyUrl = `https://api.blockcypher.com/v1/ltc/main/txs/${extractedTxId}`;
    const bcyRes = await fetch(bcyUrl);
    if (!bcyRes.ok) {
      return NextResponse.json({ success: false, message: 'Failed to fetch transaction data' }, { status: 400 });
    }
    const bcyData = await bcyRes.json();

    const outputMatches = bcyData.outputs?.some((out: any) => out.addresses?.includes(order.walletAddress));
    if (!outputMatches) {
      return NextResponse.json({ success: false, message: 'Transaction sent to wrong address' }, { status: 400 });
    }

    const expectedLitoshis = Math.round(order.ltcAmount * 1e8);
    const tolerance = 1000;
    const amountMatches = bcyData.outputs?.some((out: any) => Math.abs(out.value - expectedLitoshis) <= tolerance);
    if (!amountMatches) {
      return NextResponse.json({ success: false, message: `Amount does not match, expected ${order.ltcAmount} LTC` }, { status: 400 });
    }

    const txTime = new Date(bcyData.received);
    if (txTime < order.createdAt || txTime > new Date(order.expiresAt)) {
      return NextResponse.json({ success: false, message: 'Transaction time outside allowed window' }, { status: 400 });
    }

    order.status = 'confirmed';
    order.paymentStatus = 'paid';
    order.txId = extractedTxId;
    await order.save();
    await processOrderDelivery(order);

    return NextResponse.json({ success: true, message: 'Transaction verified and order confirmed' });
  } catch (error) {
    console.error('Manual verification error:', error);
    return NextResponse.json({ success: false, message: 'Server error during verification' }, { status: 500 });
  }
}
