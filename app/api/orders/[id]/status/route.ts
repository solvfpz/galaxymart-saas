import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Payment from '@/models/Payment';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const [order, payment] = await Promise.all([
      Order.findById(id).populate('productId').lean(),
      Payment.findOne({ order_id: id }).lean(),
    ]);

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const now = new Date();

    // Auto-expire if past expiry
    if (
      order.status === 'pending' &&
      order.expiresAt &&
      new Date(order.expiresAt) < now
    ) {
      await Order.findByIdAndUpdate(id, {
        $set: { status: 'expired', paymentStatus: 'unpaid' },
      });

      if (payment) {
        await Payment.findOneAndUpdate(
          { order_id: id },
          { $set: { payment_status: 'expired', expired_at: now, last_checked_at: now } }
        );
      }

      return NextResponse.json({
        success: true,
        status: 'expired',
        message: 'Invoice has expired',
        payment: null,
      });
    }

    // Determine status from Payment (source of truth) or fallback to Order
    const paymentStatus = payment?.payment_status || null;
    const effectiveStatus = paymentStatus
      ? paymentStatus === 'manual_paid'
        ? 'confirmed'
        : paymentStatus === 'manual_delivered'
          ? 'delivered'
          : paymentStatus === 'waiting' || paymentStatus === 'confirming'
            ? 'detected'
            : paymentStatus
      : order.status;

    const isFinal = ['delivered', 'confirmed'].includes(effectiveStatus as string);
    const isTerminal = ['expired', 'failed'].includes(effectiveStatus as string);

    let product: any = null;
    let deliveredItems: string[] = [];
    let instructions = '';

    if (isFinal) {
      product = order.productId || (order.productId ? await Product.findById(order.productId).lean() : null);
      deliveredItems = order.deliveredSerials && Array.isArray(order.deliveredSerials)
        ? order.deliveredSerials
        : [];
      instructions = product?.instructions || product?.description || '';
    }

    const response: Record<string, any> = {
      success: true,
      orderId: id,
      productName: order.productId?.name || '',
      customerEmail: order.customerEmail,
      paymentId: order.paymentId,
      usdAmount: order.usdAmount,
      ltcAmount: order.ltcAmount,
      payAddress: payment?.pay_address || order.payAddress || order.walletAddress,
      payAmount: payment?.pay_amount || order.payAmount || order.ltcAmount,
      status: effectiveStatus,
      expiresAt: order.expiresAt,
      createdAt: order.createdAt,
      isFinal,
      isTerminal,
      payment,
      deliveredItems,
      instructions,
    };

    if (payment) {
      response.txHash = payment.tx_hash;
      response.confirmationCount = payment.confirmation_count;
      response.paidAmount = payment.paid_amount || payment.actually_paid;
      response.paidAt = payment.paid_at;
      response.confirmedAt = payment.confirmed_at;
      response.deliveredAt = payment.delivered_at;
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[Order Status] Error:', error?.message || error);
    return NextResponse.json({ success: false, message: 'Error fetching order status' }, { status: 500 });
  }
}
