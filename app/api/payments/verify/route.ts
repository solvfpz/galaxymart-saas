import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json({ success: false, message: 'Missing paymentId' }, { status: 400 });
    }

    const order = await Order.findOne({ paymentId });
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const now = new Date();

    // ✅ Auto-expire if past deadline and not already paid/confirmed
    if (
      order.status !== 'confirmed' &&
      order.status !== 'manual' &&
      order.status !== 'delivered' &&
      new Date(order.expiresAt) < now
    ) {
      if (order.status !== 'expired') {
        order.status = 'expired';
        order.paymentStatus = 'unpaid';
        await order.save();
      }
      return NextResponse.json({
        success: true,
        status: 'expired',
        message: 'Invoice has expired',
      });
    }

    // For all paid statuses, fetch product data for delivery details
    if (['delivered', 'confirmed', 'manual'].includes(order.status)) {
      const product = await Product.findById(order.productId).lean() as any;
      const deliveredItems: string[] = product?.serials?.slice(0, order.quantity) ?? [];
      return NextResponse.json({
        success: true,
        status: order.status,
        receivedAmount: order.ltcAmount,
        orderId: String(order._id),
        productId: String(order.productId),
        customerEmail: order.customerEmail,
        deliveredItems,
        instructions: product?.instructions || product?.description || '',
        productName: product?.name ?? '',
      });
    }

    // pending — still waiting for real payment
    return NextResponse.json({
      success: true,
      status: 'pending',
      receivedAmount: 0,
      ltcAmountRequired: order.ltcAmount,
    });

  } catch (error: any) {
    console.error('Payment Verify Error:', error);
    return NextResponse.json({ success: false, message: 'Error verifying payment' }, { status: 500 });
  }
}
