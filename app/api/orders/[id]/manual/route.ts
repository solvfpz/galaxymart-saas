import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

async function processOrderDelivery(order: any) {
  const orderId = typeof order === 'string' ? order : String(order._id || order.id);
  
  let freshOrder = await Order.findById(orderId);
  if (!freshOrder) {
    console.error(`manual processOrderDelivery: Order not found for id=${orderId}`);
    return [];
  }

  if (Array.isArray(freshOrder.deliveredSerials) && freshOrder.deliveredSerials.length > 0) {
    console.log(`manual processOrderDelivery: Order ${orderId} already has delivered serials`);
    return freshOrder.deliveredSerials;
  }

  const product = await Product.findById(freshOrder.productId);
  if (!product) {
    console.error(`manual processOrderDelivery: Product not found for id=${freshOrder.productId}`);
    return [];
  }

  const availableSerials = Array.isArray(product.serials) ? product.serials : [];
  const quantity = freshOrder.quantity || 1;

  if (availableSerials.length < quantity) {
    console.warn(`manual processOrderDelivery: Not enough serials for order ${orderId}. Have ${availableSerials.length}, need ${quantity}`);
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

  console.log(`manual processOrderDelivery: SUCCESS - Delivered ${quantity} serials for order ${orderId}:`, deliveredSerials);

  return deliveredSerials;
}

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
    const alreadyDelivered = order.deliveredSerials?.length > 0;

    order.status = 'manual';
    order.paymentStatus = 'paid';
    await order.save();

    if (!alreadyDelivered && !['confirmed', 'delivered', 'manual'].includes(oldStatus)) {
      await processOrderDelivery(order);
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
