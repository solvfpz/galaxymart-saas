import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Payment from '@/models/Payment';
import { processOrderDelivery, restoreSerials, updatePaymentStatus, markOrderDelivered } from '@/lib/delivery';
import axios from 'axios';

async function adjustStockOnStatusChange(order: any, oldStatus: string, newStatus: string) {
  if (oldStatus === newStatus) return;

  const wasFinalized = ['confirmed', 'delivered', 'manual', 'manual_paid', 'manual_delivered'].includes(oldStatus);
  const isFinalized = ['confirmed', 'delivered', 'manual', 'manual_paid', 'manual_delivered'].includes(newStatus);

  if (!wasFinalized && isFinalized) {
    await processOrderDelivery(String(order._id));
  } else if (wasFinalized && !isFinalized) {
    await restoreSerials(String(order._id));
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const order = await Order.findById(id).populate('productId');
    if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error fetching order" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });

    const order = await Order.findById(id).populate('productId');
    if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });

    const oldStatus = order.status;

    // ═══════════════════════════════════════════════════════════
    // Admin Recovery Actions
    // ═══════════════════════════════════════════════════════════

    // ─── Mark as Paid (manual_paid) ──────────────────────────
    if (body.action === 'mark_paid' || body.status === 'manual_paid') {
      await Payment.findOneAndUpdate(
        { order_id: id },
        {
          $set: {
            payment_status: 'manual_paid',
            paid_at: new Date(),
            confirmed_at: new Date(),
            last_checked_at: new Date(),
            ipn_processed: true,
            ipn_processed_at: new Date(),
          },
        },
        { upsert: true }
      );

      const serials = await processOrderDelivery(id);
      order.status = 'delivered';
      order.paymentStatus = 'paid';
      await order.save();

      if (serials.length > 0) {
        await Payment.findOneAndUpdate(
          { order_id: id },
          { $set: { payment_status: 'delivered', delivered_at: new Date() } }
        );
        order.status = 'delivered';
        await order.save();
      }

      const updated = await Order.findById(id).populate('productId');
      return NextResponse.json({ success: true, message: 'Marked as paid', order: updated });
    }

    // ─── Mark as Delivered ───────────────────────────────────
    if (body.action === 'mark_delivered' || body.status === 'manual_delivered') {
      await markOrderDelivered(id);

      await Payment.findOneAndUpdate(
        { order_id: id },
        {
          $set: {
            payment_status: 'manual_delivered',
            delivered_at: new Date(),
            last_checked_at: new Date(),
          },
        },
        { upsert: true }
      );

      const updated = await Order.findById(id).populate('productId');
      return NextResponse.json({ success: true, message: 'Marked as delivered', order: updated });
    }

    // ─── Expire Order ────────────────────────────────────────
    if (body.action === 'expire' || body.status === 'expired') {
      await Order.findByIdAndUpdate(id, {
        $set: { status: 'expired', paymentStatus: 'unpaid' },
      });

      await Payment.findOneAndUpdate(
        { order_id: id },
        {
          $set: {
            payment_status: 'expired',
            expired_at: new Date(),
            last_checked_at: new Date(),
          },
        }
      );

      const updated = await Order.findById(id).populate('productId');
      return NextResponse.json({ success: true, message: 'Order expired', order: updated });
    }

    // ─── Recheck Blockchain (NOWPayments) ────────────────────
    if (body.action === 'recheck') {
      const payment = await Payment.findOne({ order_id: id });
      let npData = null;

      if (payment?.nowpayments_payment_id) {
        try {
          const npRes = await axios.get(
            `${process.env.NOWPAYMENTS_API_URL || 'https://api.nowpayments.io/v1'}/payment/${payment.nowpayments_payment_id}`,
            { headers: { 'x-api-key': process.env.NOWPAYMENTS_API_KEY || '' }, timeout: 10000 }
          );
          npData = npRes.data;

          if (npData.payment_status === 'confirmed' || npData.payment_status === 'finished') {
            await updatePaymentStatus(payment.payment_id, 'confirmed', {
              tx_hash: npData.txid || payment.tx_hash,
              confirmed_at: new Date(),
              ipn_processed: true,
              ipn_processed_at: new Date(),
              provider_response: npData,
            });
          } else if (npData.payment_status === 'expired' || npData.payment_status === 'failed') {
            await updatePaymentStatus(payment.payment_id, npData.payment_status as any, {
              expired_at: new Date(),
              provider_response: npData,
            });
          }
        } catch (npErr: any) {
          console.error(`[Recheck] NOWPayments API error:`, npErr.message);
        }
      }

      // Try manual TX recheck via order txId
      if (payment?.tx_hash) {
        try {
          const bcypherRes = await fetch(`https://api.blockcypher.com/v1/ltc/main/txs/${payment.tx_hash}`);
          if (bcypherRes.ok) {
            const txData = await bcypherRes.json();
            npData = { ...(npData || {}), blockcypher: { confirmations: txData.confirmations, total: txData.total } };
          }
        } catch {}
      }

      const updated = await Order.findById(id).populate('productId');
      return NextResponse.json({
        success: true,
        message: 'Recheck completed',
        order: updated,
        nowpayments: npData,
      });
    }

    // ─── Refund (restore serials, mark as refunded) ──────────
    if (body.action === 'refund') {
      if (Array.isArray(order.deliveredSerials) && order.deliveredSerials.length > 0) {
        await restoreSerials(id);
      }

      order.status = 'failed';
      order.paymentStatus = 'unpaid';
      order.deliveredSerials = [];
      await order.save();

      await Payment.findOneAndUpdate(
        { order_id: id },
        {
          $set: {
            payment_status: 'failed',
            expired_at: new Date(),
            last_checked_at: new Date(),
          },
        }
      );

      const updated = await Order.findById(id).populate('productId');
      return NextResponse.json({ success: true, message: 'Order refunded', order: updated });
    }

    // ─── Standard Status Changes (backward compatible) ───────
    const updateData: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (body.status === 'manual') {
        updateData.status = 'manual';
        updateData.paymentStatus = 'paid';
        await Payment.findOneAndUpdate(
          { order_id: id },
          { $set: { payment_status: 'manual_paid', paid_at: new Date(), last_checked_at: new Date() } },
          { upsert: true }
        );
      } else if (body.status === 'confirmed') {
        updateData.status = 'confirmed';
        updateData.paymentStatus = 'paid';
      } else if (body.status === 'delivered') {
        updateData.status = 'delivered';
      } else if (body.status === 'expired') {
        updateData.status = 'expired';
        updateData.paymentStatus = 'unpaid';
        await Payment.findOneAndUpdate(
          { order_id: id },
          { $set: { payment_status: 'expired', expired_at: new Date(), last_checked_at: new Date() } }
        );
      } else if (body.status === 'pending') {
        updateData.status = 'pending';
        updateData.paymentStatus = 'unpaid';
        await Payment.findOneAndUpdate(
          { order_id: id },
          { $set: { payment_status: 'pending', last_checked_at: new Date() } }
        );
      } else {
        updateData.status = body.status;
      }

      if (oldStatus !== body.status) {
        await adjustStockOnStatusChange(order, oldStatus, body.status);
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, { $set: updateData }, { new: true }).populate('productId');
    if (!updatedOrder) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('ORDER UPDATE ERROR:', error?.message || error);
    return NextResponse.json({ success: false, message: 'Failed to update order status' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });

    if (['confirmed', 'delivered', 'manual', 'manual_paid', 'manual_delivered'].includes(order.status)) {
      await restoreSerials(String(order._id));
    }

    await Payment.deleteOne({ order_id: id });

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error deleting order" }, { status: 500 });
  }
}
