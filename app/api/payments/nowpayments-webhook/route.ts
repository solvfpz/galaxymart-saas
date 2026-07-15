import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Payment from '@/models/Payment';
import { processOrderDelivery } from '@/lib/delivery';
import crypto from 'crypto';

function sortObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sortObject);
  const sortedKeys = Object.keys(obj).sort();
  const result: any = {};
  for (const key of sortedKeys) {
    result[key] = sortObject(obj[key]);
  }
  return result;
}

function truncate(str: string, n: number): string {
  return str.length <= n ? str : str.slice(0, n) + '...';
}

async function logIpnEvent(payment: any, event: string, body: any, sig: string, order: any) {
  console.log(`[IPN] ${event} | payment_id=${payment?.payment_id || '?'} | order_id=${order?._id || '?'} | tx=${body.txid || 'none'}`);
}

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    console.log('[IPN] Webhook received');

    const rawBody = await req.text();
    const sig = req.headers.get('x-nowpayments-sig');

    if (!sig) {
      console.warn('[IPN] Missing signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const secret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!secret) {
      console.error('[IPN] NOWPAYMENTS_IPN_SECRET not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let body: any;
    try {
      body = JSON.parse(rawBody);
    } catch {
      console.warn('[IPN] Invalid JSON body');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const sortedBody = sortObject(body);
    const sortedBodyStr = JSON.stringify(sortedBody);

    const hmac = crypto
      .createHmac('sha512', secret.trim())
      .update(sortedBodyStr)
      .digest('hex');

    if (hmac !== sig) {
      console.warn('[IPN] Invalid HMAC signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('[IPN] Signature verified successfully');

    await dbConnect();

    const paymentStatus = body.payment_status;
    const nowpaymentsPaymentId = body.payment_id ? String(body.payment_id) : null;
    const orderId = body.order_id;
    const txHash = body.txid || null;
    const confirmations = parseInt(body.confirmations || '0', 10);
    const actuallyPaid = body.actually_paid ? parseFloat(body.actually_paid) : undefined;
    const payAmount = body.pay_amount ? parseFloat(body.pay_amount) : undefined;

    console.log(`[IPN] status=${paymentStatus} payment_id=${nowpaymentsPaymentId} order_id=${orderId} tx=${txHash} confs=${confirmations}`);

    if (!paymentStatus || !nowpaymentsPaymentId) {
      console.warn('[IPN] Missing payment_status or payment_id in webhook payload');
      return NextResponse.json({ error: 'Missing payment data' }, { status: 400 });
    }

    // ── Find payment ────────────────────────────────────────────────────
    let payment = await Payment.findOne({ nowpayments_payment_id: nowpaymentsPaymentId });
    if (!payment) {
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          payment = await Payment.findOne({ order_id: order._id });
        }
      }
    }
    if (!payment) {
      // Try by invoice_id/order_id
      if (orderId) {
        payment = await Payment.findOne({ invoice_id: orderId });
      }
    }

    let order: any = null;
    if (payment) {
      order = await Order.findById(payment.order_id);
    } else if (orderId) {
      order = await Order.findById(orderId);
    }

    if (!payment && !order) {
      console.warn(`[IPN] No matching payment or order found for payment_id=${nowpaymentsPaymentId}, order_id=${orderId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!payment && order) {
      // Create Payment doc if it doesn't exist (recovery path)
      payment = await Payment.create({
        payment_id: order.paymentId || `INV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        order_id: order._id,
        invoice_id: order.paymentId,
        pay_address: order.payAddress || order.walletAddress,
        pay_amount: order.payAmount || order.ltcAmount,
        pay_currency: 'ltc',
        price_amount: order.usdAmount,
        price_currency: 'usd',
        payment_status: 'pending',
        nowpayments_payment_id: nowpaymentsPaymentId,
        created_at: new Date(),
        last_checked_at: new Date(),
      });
      console.log(`[IPN] Created missing Payment doc for order ${order._id}`);
    }

    // ── Duplicate detection ─────────────────────────────────────────────
    if (payment && payment.ipn_processed && txHash && payment.tx_hash === txHash) {
      payment.duplicate_ipn_count = (payment.duplicate_ipn_count || 0) + 1;
      await payment.save();
      console.log(`[IPN] Duplicate webhook for tx=${txHash}, count=${payment.duplicate_ipn_count}`);
      await logIpnEvent(payment, 'DUPLICATE_SKIPPED', body, sig, order);
      return NextResponse.json({ success: true, message: 'Already processed' });
    }

    await logIpnEvent(payment, 'PROCESSING', body, sig, order);

    // ── Build update payload ────────────────────────────────────────────
    const paymentUpdate: Record<string, any> = {
      provider_response: body,
      last_checked_at: new Date(),
    };

    const orderUpdate: Record<string, any> = {};

    if (txHash) {
      paymentUpdate.tx_hash = txHash;
      if (!payment?.tx_hash) {
        orderUpdate.txId = txHash;
      }
    }
    if (confirmations > 0) {
      paymentUpdate.confirmation_count = confirmations;
    }
    if (actuallyPaid !== undefined) {
      paymentUpdate.actually_paid = actuallyPaid;
    }
    if (payAmount !== undefined) {
      paymentUpdate.paid_amount = payAmount;
    }

    // ── Status mapping ──────────────────────────────────────────────────
    let shouldDeliver = false;

    switch (paymentStatus) {
      case 'waiting': {
        paymentUpdate.payment_status = 'waiting';
        paymentUpdate.paid_at = new Date();
        orderUpdate.status = 'detected';
        orderUpdate.paymentStatus = 'unpaid';
        break;
      }
      case 'confirming': {
        paymentUpdate.payment_status = 'confirming';
        paymentUpdate.confirmation_count = confirmations;
        orderUpdate.status = 'detected';
        break;
      }
      case 'confirmed':
      case 'finished': {
        paymentUpdate.payment_status = 'confirmed';
        paymentUpdate.confirmed_at = new Date();
        paymentUpdate.tx_hash = txHash;
        paymentUpdate.ipn_processed = true;
        paymentUpdate.ipn_processed_at = new Date();
        orderUpdate.status = 'confirmed';
        orderUpdate.paymentStatus = 'paid';
        if (txHash) orderUpdate.txId = txHash;
        shouldDeliver = true;
        break;
      }
      case 'expired': {
        paymentUpdate.payment_status = 'expired';
        paymentUpdate.expired_at = new Date();
        orderUpdate.status = 'expired';
        orderUpdate.paymentStatus = 'unpaid';
        break;
      }
      case 'failed': {
        paymentUpdate.payment_status = 'failed';
        paymentUpdate.expired_at = new Date();
        orderUpdate.status = 'failed';
        orderUpdate.paymentStatus = 'unpaid';
        break;
      }
      default: {
        console.warn(`[IPN] Unknown status: ${paymentStatus}`);
        break;
      }
    }

    // ── Save to Payment model ───────────────────────────────────────────
    if (payment) {
      await Payment.findByIdAndUpdate(payment._id, { $set: paymentUpdate });
      console.log(`[IPN] Payment ${payment._id} updated to ${paymentUpdate.payment_status || 'unchanged'}`);
    }

    // ── Save to Order model ─────────────────────────────────────────────
    if (order && Object.keys(orderUpdate).length > 0) {
      const prevStatus = order.status;
      await Order.findByIdAndUpdate(order._id, { $set: orderUpdate });
      console.log(`[IPN] Order ${order._id} status: ${prevStatus} -> ${orderUpdate.status || 'unchanged'}`);

      if (prevStatus === 'confirmed' && orderUpdate.status === 'confirmed') {
        console.log(`[IPN] Order ${order._id} was already confirmed, skipping delivery`);
        shouldDeliver = false;
      }
    }

    if (shouldDeliver && payment) {
      console.log(`[IPN] Triggering delivery for order ${payment.order_id}`);
      try {
        const serials = await processOrderDelivery(String(payment.order_id));
        if (serials.length > 0) {
          // Update payment status to delivered
          await Payment.findByIdAndUpdate(payment._id, {
            $set: {
              payment_status: 'delivered',
              delivered_at: new Date(),
              last_checked_at: new Date(),
            },
          });
          await Order.findByIdAndUpdate(payment.order_id, {
            $set: { status: 'delivered' },
          });
        }
      } catch (delErr: any) {
        console.error(`[IPN] Delivery failed for order ${payment.order_id}:`, delErr.message);
      }
    }

    const elapsed = Date.now() - startTime;
    console.log(`[IPN] Completed in ${elapsed}ms`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[IPN] FATAL ERROR:', error?.message || String(error));
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
