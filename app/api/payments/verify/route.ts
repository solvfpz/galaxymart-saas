import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

async function releaseReservedStock(productId: string, quantity: number) {
  await Product.findByIdAndUpdate(productId, {
    $inc: { reservedStock: -quantity }
  });
}

async function consumeReservedStock(productId: string, quantity: number) {
  await Product.findByIdAndUpdate(productId, {
    $inc: { stock: -quantity, reservedStock: -quantity }
  });
}

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
    const wasPending = order.status === 'pending';

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

        if (wasPending) {
          await releaseReservedStock(String(order.productId), order.quantity);
        }
      }
      return NextResponse.json({
        success: true,
        status: 'expired',
        message: 'Invoice has expired',
      });
    }

    if (['delivered', 'confirmed', 'manual'].includes(order.status)) {
      if (wasPending) {
        await consumeReservedStock(String(order.productId), order.quantity);
        order.status = order.status;
        order.paymentStatus = 'paid';
        await order.save();
      }

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
