import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

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

    const updateData: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (body.status === 'manual') {
        updateData.status = 'manual';
        updateData.paymentStatus = 'paid';
      } else if (body.status === 'confirmed') {
        updateData.status = 'confirmed';
        updateData.paymentStatus = 'paid';
      } else if (body.status === 'delivered') {
        updateData.status = 'delivered';
      } else if (body.status === 'expired') {
        updateData.status = 'expired';
        updateData.paymentStatus = 'unpaid';
      } else if (body.status === 'pending') {
        updateData.status = 'pending';
        updateData.paymentStatus = 'unpaid';
      } else {
        updateData.status = body.status;
      }
    }

    const order = await Order.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    return NextResponse.json({ success: true, order });
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
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error deleting order" }, { status: 500 });
  }
}
