import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

async function processOrderDelivery(order: any) {
  const orderId = typeof order === 'string' ? order : String(order._id || order.id);
  
  let freshOrder = await Order.findById(orderId);
  if (!freshOrder) {
    console.error(`orders processOrderDelivery: Order not found for id=${orderId}`);
    return [];
  }

  if (Array.isArray(freshOrder.deliveredSerials) && freshOrder.deliveredSerials.length > 0) {
    console.log(`orders processOrderDelivery: Order ${orderId} already has delivered serials`);
    return freshOrder.deliveredSerials;
  }

  const product = await Product.findById(freshOrder.productId);
  if (!product) {
    console.error(`orders processOrderDelivery: Product not found for id=${freshOrder.productId}`);
    return [];
  }

  const availableSerials = Array.isArray(product.serials) ? product.serials : [];
  const quantity = freshOrder.quantity || 1;

  if (availableSerials.length < quantity) {
    console.warn(`orders processOrderDelivery: Not enough serials for order ${orderId}. Have ${availableSerials.length}, need ${quantity}`);
    return [];
  }

  const deliveredSerials = availableSerials.slice(0, quantity);
  const remainingSerials = availableSerials.slice(quantity);

  product.serials = remainingSerials;
  product.stock = remainingSerials.length;
  product.markModified('serials');
  await product.save();

  freshOrder.deliveredSerials = deliveredSerials;
  freshOrder.markModified('deliveredSerials');
  await freshOrder.save();

  console.log(`orders processOrderDelivery: SUCCESS - Delivered ${quantity} serials for order ${orderId}:`, deliveredSerials);

  return deliveredSerials;
}

async function restoreSerials(order: any) {
  if (!Array.isArray(order.deliveredSerials) || order.deliveredSerials.length === 0) {
    return;
  }

  const product = await Product.findById(order.productId);
  if (!product) {
    console.error(`restoreSerials: Product not found for id=${order.productId}`);
    return;
  }

  product.serials = [...order.deliveredSerials, ...(Array.isArray(product.serials) ? product.serials : [])];
  product.stock = product.serials.length;
  product.markModified('serials');
  await product.save();

  console.log(`restoreSerials: Restored ${order.deliveredSerials.length} serials for product ${order.productId}`);
}

async function adjustStockOnStatusChange(order: any, oldStatus: string, newStatus: string) {
  if (oldStatus === newStatus) return;

  const wasFinalized = ['confirmed', 'delivered', 'manual'].includes(oldStatus);
  const isFinalized = ['confirmed', 'delivered', 'manual'].includes(newStatus);

  if (!wasFinalized && isFinalized) {
    await processOrderDelivery(order);
  } else if (wasFinalized && !isFinalized) {
    await restoreSerials(order);
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
        await adjustStockOnStatusChange(order, oldStatus, body.status);
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

    if (['confirmed', 'delivered', 'manual'].includes(order.status)) {
      await restoreSerials(order);
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error deleting order" }, { status: 500 });
  }
}
