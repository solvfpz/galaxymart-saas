import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Payment, { PaymentStatus } from '@/models/Payment';

export async function processOrderDelivery(orderId: string): Promise<string[]> {
  await dbConnect();

  const freshOrder = await Order.findById(orderId);
  if (!freshOrder) {
    console.error(`processOrderDelivery: Order not found for id=${orderId}`);
    return [];
  }

  if (Array.isArray(freshOrder.deliveredSerials) && freshOrder.deliveredSerials.length > 0) {
    console.log(`processOrderDelivery: Order ${orderId} already has delivered serials`);
    return freshOrder.deliveredSerials;
  }

  const product = await Product.findById(freshOrder.productId);
  if (!product) {
    console.error(`processOrderDelivery: Product not found for id=${freshOrder.productId}`);
    return [];
  }

  const availableSerials = Array.isArray(product.serials) ? product.serials : [];
  const quantity = freshOrder.quantity || 1;

  if (availableSerials.length < quantity) {
    console.warn(`processOrderDelivery: Not enough serials for order ${orderId}. Have ${availableSerials.length}, need ${quantity}`);
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

  console.log(`processOrderDelivery: SUCCESS - Delivered ${quantity} serials for order ${orderId}`);

  return deliveredSerials;
}

export async function restoreSerials(orderId: string) {
  await dbConnect();

  const order = await Order.findById(orderId);
  if (!order || !Array.isArray(order.deliveredSerials) || order.deliveredSerials.length === 0) {
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

export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus,
  extra: Record<string, any> = {}
): Promise<void> {
  await dbConnect();

  const update: Record<string, any> = {
    payment_status: status,
    last_checked_at: new Date(),
    ...extra,
  };

  if (!extra.provider_response) {
    delete update.provider_response;
  }

  const payment = await Payment.findOneAndUpdate(
    { payment_id: paymentId },
    { $set: update },
    { new: true }
  );

  if (!payment) {
    console.error(`updatePaymentStatus: Payment not found for payment_id=${paymentId}`);
    return;
  }

  const orderUpdate: Record<string, any> = {};
  switch (status) {
    case 'confirmed':
    case 'manual_paid':
      orderUpdate.status = 'confirmed';
      orderUpdate.paymentStatus = 'paid';
      if (extra.tx_hash) orderUpdate.txId = extra.tx_hash;
      break;
    case 'delivered':
    case 'manual_delivered':
      orderUpdate.status = 'delivered';
      orderUpdate.paymentStatus = 'paid';
      break;
    case 'expired':
      orderUpdate.status = 'expired';
      orderUpdate.paymentStatus = 'unpaid';
      break;
    case 'failed':
      orderUpdate.status = 'failed';
      orderUpdate.paymentStatus = 'unpaid';
      break;
    case 'waiting':
      orderUpdate.status = 'detected';
      break;
    case 'confirming':
      orderUpdate.status = 'detected';
      break;
  }

  if (Object.keys(orderUpdate).length > 0) {
    await Order.findByIdAndUpdate(payment.order_id, { $set: orderUpdate });
  }

  if (status === 'confirmed' || status === 'manual_paid') {
    const order = await Order.findById(payment.order_id);
    if (order && (!Array.isArray(order.deliveredSerials) || order.deliveredSerials.length === 0)) {
      await processOrderDelivery(String(payment.order_id));
    }
  }
}

export async function markOrderDelivered(orderId: string): Promise<void> {
  await dbConnect();

  const order = await Order.findById(orderId);
  if (!order) return;

  order.status = 'delivered';
  order.paymentStatus = 'paid';
  await order.save();

  await Payment.findOneAndUpdate(
    { order_id: orderId },
    {
      $set: {
        payment_status: 'delivered',
        delivered_at: new Date(),
        last_checked_at: new Date(),
      },
    }
  );
}
