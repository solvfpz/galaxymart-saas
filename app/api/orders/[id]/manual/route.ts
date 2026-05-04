import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const oldStatus = order.status;
    const quantity = order.quantity;

    order.status = 'manual';
    order.paymentStatus = 'paid';
    await order.save();

    if (oldStatus === 'pending') {
      await Product.findByIdAndUpdate(order.productId, {
        $inc: { stock: -quantity, reservedStock: -quantity }
      });
    } else if (oldStatus === 'expired') {
      await Product.findByIdAndUpdate(order.productId, {
        $inc: { stock: -quantity, reservedStock: -quantity }
      });
    } else if (oldStatus === 'confirmed' || oldStatus === 'delivered') {
    }

    return NextResponse.json({
      success: true,
      message: 'Order marked as manually paid',
      order: await Order.findById(id).populate('productId')
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
