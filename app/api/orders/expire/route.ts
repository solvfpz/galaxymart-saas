import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST() {
  try {
    await dbConnect();

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const expiredOrders = await Order.find({
      status: 'pending',
      expiresAt: { $lt: fifteenMinutesAgo }
    });

    for (const order of expiredOrders) {
      order.status = 'expired';
      order.paymentStatus = 'unpaid';
      await order.save();

      await Product.findByIdAndUpdate(order.productId, {
        $inc: { reservedStock: -order.quantity }
      });
    }

    return NextResponse.json({
      success: true,
      expiredCount: expiredOrders.length,
      orderIds: expiredOrders.map(o => String(o._id))
    });
  } catch (error: any) {
    console.error('Auto-expire error:', error);
    return NextResponse.json({ success: false, message: 'Failed to expire orders' }, { status: 500 });
  }
}
