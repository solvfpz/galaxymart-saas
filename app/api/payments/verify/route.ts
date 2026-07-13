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

    if (
      order.status === 'pending' &&
      new Date(order.expiresAt) < now
    ) {
      order.status = 'expired';
      order.paymentStatus = 'unpaid';
      await order.save();

      return NextResponse.json({
        success: true,
        status: 'expired',
        message: 'Invoice has expired',
      });
    }

    if (['delivered', 'confirmed', 'manual'].includes(order.status)) {
      const product = await Product.findById(order.productId).lean() as any;
      
      const deliveredItems = order.deliveredSerials && order.deliveredSerials.length > 0 
        ? order.deliveredSerials 
        : [];

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
      status: order.status,
      receivedAmount: 0,
      ltcAmountRequired: order.ltcAmount,
    });

  } catch (error: any) {
    console.error('Payment Verify Error:', error);
    return NextResponse.json({ success: false, message: 'Error verifying payment' }, { status: 500 });
  }
}
