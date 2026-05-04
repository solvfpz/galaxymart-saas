import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

async function adjustStockOnStatusChange(productId: string, quantity: number, oldStatus: string, newStatus: string) {
  if (oldStatus === newStatus) return;

  const updates: Record<string, number> = {};

  const wasReserved = oldStatus === 'pending' || oldStatus === 'expired';
  const wasConsumed = oldStatus === 'confirmed' || oldStatus === 'delivered' || oldStatus === 'manual';

  const isReserved = newStatus === 'pending' || newStatus === 'expired';
  const isConsumed = newStatus === 'confirmed' || newStatus === 'delivered' || newStatus === 'manual';

  if (wasReserved && !wasConsumed) {
    updates.reservedStock = -(quantity);
  } else if (wasConsumed && !wasReserved) {
    updates.stock = quantity;
  }

  if (isConsumed && !wasConsumed) {
    updates.stock = (updates.stock || 0) - quantity;
    updates.reservedStock = (updates.reservedStock || 0) - quantity;
  } else if (isReserved && !wasReserved) {
    updates.reservedStock = (updates.reservedStock || 0) + quantity;
  }

  if (Object.keys(updates).length > 0) {
    await Product.findByIdAndUpdate(productId, { $inc: updates });
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

    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });

    const updateData: Record<string, unknown> = {};
    const oldStatus = order.status;

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

      if (oldStatus !== body.status) {
        await adjustStockOnStatusChange(String(order.productId), order.quantity, oldStatus, body.status);
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, { $set: updateData }, { new: true });
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

    if (order.status === 'pending' || order.status === 'expired') {
      await Product.findByIdAndUpdate(order.productId, { $inc: { reservedStock: -order.quantity } });
    } else {
      await Product.findByIdAndUpdate(order.productId, { $inc: { stock: order.quantity } });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error deleting order" }, { status: 500 });
  }
}
