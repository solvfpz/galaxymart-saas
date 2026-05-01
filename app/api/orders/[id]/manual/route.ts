import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'manual_paid' },
      { new: true, runValidators: true }
    ).populate('productId');

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order marked as manually paid',
      order
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Error updating order status' },
      { status: 500 }
    );
  }
}
