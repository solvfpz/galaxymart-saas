import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import crypto from 'crypto';

function sortObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }
  const sortedKeys = Object.keys(obj).sort();
  const result: any = {};
  for (const key of sortedKeys) {
    result[key] = sortObject(obj[key]);
  }
  return result;
}

async function processOrderDelivery(order: any) {
  const orderId = typeof order === 'string' ? order : String(order._id || order.id);
  
  let freshOrder = await Order.findById(orderId);
  if (!freshOrder) {
    console.error(`processOrderDelivery: Order not found for id=${orderId}`);
    return [];
  }

  if (Array.isArray(freshOrder.deliveredSerials) && freshOrder.deliveredSerials.length > 0) {
    console.log(`processOrderDelivery: Order ${orderId} already has delivered serials:`, freshOrder.deliveredSerials);
    return freshOrder.deliveredSerials;
  }

  const product = await Product.findById(freshOrder.productId);
  if (!product) {
    console.error(`processOrderDelivery: Product not found for id=${freshOrder.productId}`);
    return [];
  }

  const availableSerials = Array.isArray(product.serials) ? product.serials : [];
  const quantity = freshOrder.quantity || 1;

  console.log(`processOrderDelivery: product.serials=`, availableSerials);
  console.log(`processOrderDelivery: quantity needed=`, quantity);

  if (availableSerials.length < quantity) {
    console.warn(`processOrderDelivery: Not enough serials for order ${orderId}. Have ${availableSerials.length}, need ${quantity}`);
    return [];
  }

  const deliveredSerials = availableSerials.slice(0, quantity);
  const remainingSerials = availableSerials.slice(quantity);

  console.log(`processOrderDelivery: Will deliver:`, deliveredSerials);
  console.log(`processOrderDelivery: Will remain:`, remainingSerials);

  product.serials = remainingSerials;
  product.stock = remainingSerials.length;
  product.markModified('serials');
  await product.save();

  freshOrder.deliveredSerials = deliveredSerials;
  freshOrder.markModified('deliveredSerials');
  await freshOrder.save();

  console.log(`processOrderDelivery: SUCCESS - Delivered ${quantity} serials for order ${orderId}:`, deliveredSerials);
  console.log(`processOrderDelivery: Remaining stock for product ${product._id}: ${product.stock}`);

  return deliveredSerials;
}

async function deductStock(productId: string, quantity: number) {
  const product = await Product.findById(productId);
  if (!product) {
    console.warn(`deductStock: Product not found for id=${productId}`);
    return;
  }
  const newStock = Math.max(0, product.stock - quantity);
  await Product.findByIdAndUpdate(productId, { $set: { stock: newStock } });
  console.log(`deductStock: Reduced stock from ${product.stock} to ${newStock} for product ${productId}`);
}

export async function POST(req: Request) {
  try {
    console.log('NOWPayments webhook: Received request');

    const rawBody = await req.text();
    console.log('NOWPayments webhook: Raw body received');

    const sig = req.headers.get('x-nowpayments-sig');
    console.log('NOWPayments webhook: Signature header:', sig ? 'present' : 'missing');

    if (!sig) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    console.log('NOWPayments webhook: Secret loaded:', secret ? 'yes (' + secret.length + ' chars)' : 'no');

    if (!secret) {
      console.error('NOWPayments webhook: NOWPAYMENTS_IPN_SECRET environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let body: any;
    try {
      body = JSON.parse(rawBody);
      console.log('NOWPayments webhook: JSON parsed successfully');
    } catch (parseErr: any) {
      console.error('NOWPayments webhook: JSON parse error:', parseErr.message, 'Raw body:', rawBody);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const sortedBody = sortObject(body);
    const sortedBodyStr = JSON.stringify(sortedBody);

    console.log('NOWPayments webhook: Sorted body for HMAC:', sortedBodyStr);

    const hmac = crypto
      .createHmac('sha512', secret.trim())
      .update(sortedBodyStr)
      .digest('hex');

    console.log('NOWPayments webhook: Calculated HMAC:', hmac);
    console.log('NOWPayments webhook: Received signature:', sig);
    console.log('NOWPayments webhook: Signatures match:', hmac === sig);

    if (hmac !== sig) {
      console.warn('NOWPayments webhook: Invalid signature - calculated:', hmac, 'received:', sig);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('NOWPayments webhook: Signature verified successfully');

    await dbConnect();
    console.log('NOWPayments webhook: Database connected');

    const paymentStatus = body.payment_status;
    const paymentId = body.payment_id ? String(body.payment_id) : null;
    const orderId = body.order_id;

    console.log('NOWPayments webhook: payment_status:', paymentStatus);
    console.log('NOWPayments webhook: payment_id:', paymentId);
    console.log('NOWPayments webhook: order_id:', orderId);

    if (!paymentStatus || !paymentId) {
      return NextResponse.json({ error: 'Missing payment data' }, { status: 400 });
    }

    let order = null;
    if (orderId) {
      console.log('NOWPayments webhook: Looking up order by _id:', orderId);
      order = await Order.findById(orderId);
    }
    if (!order) {
      console.log('NOWPayments webhook: Looking up order by nowPaymentId:', paymentId);
      order = await Order.findOne({ nowPaymentId: paymentId });
    }
    if (!order) {
      console.warn(`NOWPayments webhook: order not found for payment_id=${paymentId}, order_id=${orderId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('NOWPayments webhook: Found order:', order._id, 'current status:', order.status);

    if (['confirmed', 'delivered', 'manual'].includes(order.status) && order.deliveredSerials?.length > 0) {
      console.log('NOWPayments webhook: Order already processed and delivered, skipping duplicate webhook');
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    switch (paymentStatus) {
      case 'waiting':
        if (order.status === 'pending') break;
        order.status = 'pending';
        console.log('NOWPayments webhook: Setting order status to pending');
        break;

      case 'confirming':
      case 'confirmed':
      case 'finished':
        if (['confirmed', 'delivered', 'manual'].includes(order.status) && order.deliveredSerials?.length > 0) {
          console.log('NOWPayments webhook: Order already confirmed with delivered serials, skipping');
          break;
        }

        order.status = 'confirmed';
        order.paymentStatus = 'paid';
        if (body.pay_amount !== undefined && body.pay_amount !== null) {
          order.payAmount = parseFloat(body.pay_amount);
          order.ltcAmount = parseFloat(body.pay_amount);
        }
        if (body.pay_address) {
          order.payAddress = body.pay_address;
          order.walletAddress = body.pay_address;
        }
        if (body.txid) {
          order.txId = body.txid;
          console.log('NOWPayments webhook: Setting txId:', body.txid);
        }

        console.log(`NOWPayments webhook: Saving order status changes first...`);
        await order.save();

        console.log(`NOWPayments webhook: Treating status="${paymentStatus}" as confirmed/paid, processing delivery`);
        
        await processOrderDelivery(order);
        break;

      case 'failed':
      case 'expired':
        order.status = 'failed';
        order.paymentStatus = 'unpaid';
        console.log('NOWPayments webhook: Setting order status to failed');
        break;

      default:
        console.warn(`NOWPayments webhook: unknown status "${paymentStatus}" for payment ${paymentId}`);
        break;
    }

    console.log('NOWPayments webhook: Saving order...');
    await order.save();
    console.log('NOWPayments webhook: Order saved successfully');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('NOWPayments webhook FATAL ERROR:');
    console.error('  Message:', error?.message || String(error));
    console.error('  Stack:', error?.stack || 'No stack trace');
    console.error('  Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
