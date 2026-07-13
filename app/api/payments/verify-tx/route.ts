import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

async function processOrderDelivery(order: any) {
  const orderId = typeof order === 'string' ? order : String(order._id || order.id);
  
  let freshOrder = await Order.findById(orderId);
  if (!freshOrder) {
    console.error(`verify-tx processOrderDelivery: Order not found for id=${orderId}`);
    return [];
  }

  if (Array.isArray(freshOrder.deliveredSerials) && freshOrder.deliveredSerials.length > 0) {
    console.log(`verify-tx processOrderDelivery: Order ${orderId} already has delivered serials:`, freshOrder.deliveredSerials);
    return freshOrder.deliveredSerials;
  }

  const product = await Product.findById(freshOrder.productId);
  if (!product) {
    console.error(`verify-tx processOrderDelivery: Product not found for id=${freshOrder.productId}`);
    return [];
  }

  const availableSerials = Array.isArray(product.serials) ? product.serials : [];
  const quantity = freshOrder.quantity || 1;

  console.log(`verify-tx processOrderDelivery: product.serials=`, availableSerials);
  console.log(`verify-tx processOrderDelivery: quantity needed=`, quantity);

  if (availableSerials.length < quantity) {
    console.warn(`verify-tx processOrderDelivery: Not enough serials for order ${orderId}. Have ${availableSerials.length}, need ${quantity}`);
    return [];
  }

  const deliveredSerials = availableSerials.slice(0, quantity);
  const remainingSerials = availableSerials.slice(quantity);

  console.log(`verify-tx processOrderDelivery: Will deliver:`, deliveredSerials);
  console.log(`verify-tx processOrderDelivery: Will remain:`, remainingSerials);

  product.serials = remainingSerials;
  product.stock = remainingSerials.length;
  product.markModified('serials');
  await product.save();

  freshOrder.deliveredSerials = deliveredSerials;
  freshOrder.markModified('deliveredSerials');
  await freshOrder.save();

  console.log(`verify-tx processOrderDelivery: SUCCESS - Delivered ${quantity} serials for order ${orderId}:`, deliveredSerials);

  return deliveredSerials;
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { txid, orderId } = await req.json();
    if (!txid || !orderId) {
      return NextResponse.json({ success: false, message: 'Missing txid or orderId' }, { status: 400 });
    }

    const match = txid.match(/([a-fA-F0-9]{64})/);
    if (!match) {
      return NextResponse.json({ success: false, message: 'Invalid transaction ID format' }, { status: 400 });
    }
    const extractedTxId = match[1];

    let order = await Order.findById(orderId).catch(() => null);
    if (!order) {
      order = await Order.findOne({ paymentId: orderId });
    }
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (['confirmed', 'delivered', 'manual'].includes(order.status) && order.deliveredSerials?.length > 0) {
      return NextResponse.json({ success: true, message: 'Order already confirmed' });
    }

    const existing = await Order.findOne({ txId: extractedTxId, _id: { $ne: order._id } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Transaction already used for another order' }, { status: 400 });
    }

    let txData: any = null;

    try {
      const token = process.env.BLOCKCYPHER_TOKEN ? `?token=${process.env.BLOCKCYPHER_TOKEN}` : '';
      const bcyUrl = `https://api.blockcypher.com/v1/ltc/main/txs/${extractedTxId}${token}`;
      const bcyRes = await fetch(bcyUrl, { signal: AbortSignal.timeout(10000) });
      if (bcyRes.ok) {
        txData = await bcyRes.json();
      } else {
        console.warn(`BlockCypher returned ${bcyRes.status} for tx ${extractedTxId}`);
      }
    } catch (err) {
      console.warn('BlockCypher fetch failed:', err);
    }

    if (!txData) {
      try {
        const bcUrl = `https://api.blockchair.com/litecoin/transactions?q=hash(${extractedTxId})`;
        const bcRes = await fetch(bcUrl, { signal: AbortSignal.timeout(10000) });
        if (bcRes.ok) {
          const bcJson = await bcRes.json();
          const raw = bcJson.data?.[extractedTxId];
          if (raw) {
            txData = {
              outputs: (raw.outputs || []).map((o: any) => ({
                addresses: [o.recipient],
                value: o.value,
              })),
              received: raw.time ? new Date(raw.time * 1000).toISOString() : null,
            };
          }
        } else {
          console.warn(`Blockchair returned ${bcRes.status} for tx ${extractedTxId}`);
        }
      } catch (err) {
        console.warn('Blockchair fallback failed:', err);
      }
    }

    if (!txData) {
      return NextResponse.json({ success: false, message: 'Failed to fetch transaction data' }, { status: 400 });
    }

    const outputAddresses = (txData.outputs || []).flatMap((out: any) => out.addresses || []);
    if (!outputAddresses.includes(order.walletAddress)) {
      return NextResponse.json({ success: false, message: 'Transaction sent to wrong address' }, { status: 400 });
    }

    const expectedLitoshis = Math.round(order.ltcAmount * 1e8);
    const tolerance = 1000;
    const amountMatches = (txData.outputs || []).some((out: any) => Math.abs(out.value - expectedLitoshis) <= tolerance);
    if (!amountMatches) {
      return NextResponse.json({ success: false, message: `Amount does not match, expected ${order.ltcAmount} LTC` }, { status: 400 });
    }

    if (txData.received) {
      const txTime = new Date(txData.received);
      if (txTime < new Date(order.createdAt!) || txTime > new Date(order.expiresAt)) {
        return NextResponse.json({ success: false, message: 'Transaction time outside allowed window' }, { status: 400 });
      }
    }

    order.status = 'confirmed';
    order.paymentStatus = 'paid';
    order.txId = extractedTxId;
    await order.save();
    await processOrderDelivery(order);

    return NextResponse.json({ success: true, message: 'Transaction verified and order confirmed' });
  } catch (error) {
    console.error('Transaction verification error:', error);
    return NextResponse.json({ success: false, message: 'Server error during verification' }, { status: 500 });
  }
}
