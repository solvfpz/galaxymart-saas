import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Payment from '@/models/Payment';
import { updatePaymentStatus, processOrderDelivery } from '@/lib/delivery';
import axios from 'axios';
import crypto from 'crypto';

const VERIFIABLE_STATUSES = ['pending', 'waiting', 'confirming'];
const NP_API_URL = process.env.NOWPAYMENTS_API_URL || 'https://api.nowpayments.io/v1';
const NP_API_KEY = process.env.NOWPAYMENTS_API_KEY || '';

export async function POST() {
  const startTime = Date.now();
  const results: any[] = [];

  try {
    await dbConnect();

    // Find all orders with non-terminal Payment statuses
    const payments = await Payment.find({
      payment_status: { $in: VERIFIABLE_STATUSES },
    }).limit(50);

    console.log(`[AutoVerify] Found ${payments.length} payments to verify`);

    if (payments.length === 0) {
      return NextResponse.json({ success: true, verified: 0, elapsed: Date.now() - startTime });
    }

    for (const payment of payments) {
      const result: any = {
        payment_id: payment.payment_id,
        status: payment.payment_status,
        action: 'none',
      };

      try {
        if (!payment.nowpayments_payment_id) {
          result.action = 'skipped_no_np_id';
          results.push(result);
          continue;
        }

        // Check expiry first
        const order = await Order.findById(payment.order_id);
        if (order && order.expiresAt && new Date(order.expiresAt) < new Date() && payment.payment_status === 'pending') {
          await updatePaymentStatus(payment.payment_id, 'expired', {
            expired_at: new Date(),
            last_checked_at: new Date(),
          });
          result.action = 'expired';
          result.detail = 'auto-expired';
          console.log(`[AutoVerify] Auto-expired payment ${payment.payment_id}`);
          results.push(result);
          continue;
        }

        // Query NOWPayments API for payment status
        const npRes = await axios.get(`${NP_API_URL}/payment/${payment.nowpayments_payment_id}`, {
          headers: { 'x-api-key': NP_API_KEY },
          timeout: 10000,
        });

        const npData = npRes.data;
        const npStatus = npData.payment_status;
        const npTxHash = npData.txid || npData.tx_hash || null;
        const npConfirmations = parseInt(npData.confirmations || '0', 10);
        const npActuallyPaid = npData.actually_paid ? parseFloat(npData.actually_paid) : undefined;

        if (!npStatus || npStatus === payment.payment_status) {
          // No change
          await Payment.findByIdAndUpdate(payment._id, {
            $set: { last_checked_at: new Date() },
          });
          result.action = 'no_change';
          result.np_status = npStatus;
          results.push(result);
          continue;
        }

        // Map NOWPayments status to our status
        let newStatus: string | null = null;
        const extra: Record<string, any> = {
          last_checked_at: new Date(),
          provider_response: npData,
        };

        switch (npStatus) {
          case 'waiting':
            newStatus = 'waiting';
            extra.paid_at = new Date();
            break;
          case 'confirming':
            newStatus = 'confirming';
            extra.confirmation_count = npConfirmations;
            if (npTxHash) extra.tx_hash = npTxHash;
            break;
          case 'confirmed':
          case 'finished':
            newStatus = 'confirmed';
            extra.confirmed_at = new Date();
            extra.ipn_processed = true;
            extra.ipn_processed_at = new Date();
            if (npTxHash) extra.tx_hash = npTxHash;
            if (npActuallyPaid !== undefined) extra.actually_paid = npActuallyPaid;
            break;
          case 'expired':
            newStatus = 'expired';
            extra.expired_at = new Date();
            break;
          case 'failed':
            newStatus = 'failed';
            extra.expired_at = new Date();
            break;
        }

        if (newStatus && newStatus !== payment.payment_status) {
          await updatePaymentStatus(payment.payment_id, newStatus as any, extra);
          result.action = 'updated';
          result.old_status = payment.payment_status;
          result.new_status = newStatus;
          console.log(`[AutoVerify] ${payment.payment_id}: ${payment.payment_status} -> ${newStatus}`);

          // If confirmed and serials not yet delivered, deliver now
          if (newStatus === 'confirmed') {
            try {
              const serials = await processOrderDelivery(String(payment.order_id));
              if (serials.length > 0) {
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
                result.delivery = 'success';
                console.log(`[AutoVerify] Delivered ${serials.length} serials for ${payment.payment_id}`);
              }
            } catch (delErr: any) {
              result.delivery = 'failed';
              console.error(`[AutoVerify] Delivery failed for ${payment.payment_id}:`, delErr.message);
            }
          }
        } else {
          await Payment.findByIdAndUpdate(payment._id, {
            $set: { last_checked_at: new Date() },
          });
          result.action = 'no_change';
        }
      } catch (npErr: any) {
        result.action = 'error';
        result.error = npErr.message;
        // Update last_checked_at even on error
        await Payment.findByIdAndUpdate(payment._id, {
          $set: { last_checked_at: new Date() },
        }).catch(() => {});
      }

      results.push(result);
    }

    const elapsed = Date.now() - startTime;
    console.log(`[AutoVerify] Completed in ${elapsed}ms, ${results.length} payments checked`);

    return NextResponse.json({
      success: true,
      verified: results.length,
      updated: results.filter(r => r.action === 'updated').length,
      expired: results.filter(r => r.action === 'expired').length,
      results,
      elapsed,
    });
  } catch (error: any) {
    console.error('[AutoVerify] FATAL:', error?.message || error);
    return NextResponse.json({ success: false, message: error?.message }, { status: 500 });
  }
}
