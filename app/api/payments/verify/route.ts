import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

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

    // 1. Check for Expiration
    const now = new Date();
    if (order.status !== 'confirmed' && new Date(order.expiresAt) < now) {
      if (order.status !== 'expired') {
        order.status = 'expired';
        await order.save();
      }
      return NextResponse.json({ 
        success: true, 
        status: 'expired',
        message: 'Invoice has expired'
      });
    }

    // In a real implementation, you would check the blockchain here
    // for transactions sent to order.walletAddress with amount >= order.ltcAmount
    
    // For demo/simulated verification:
    // If order was created more than 30 seconds ago, simulate a confirmation
    const secondsSinceCreation = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
    
    if (order.status === 'confirmed') {
       return NextResponse.json({ 
        success: true, 
        status: 'confirmed',
        receivedAmount: order.ltcAmount,
        txHash: '0x8b7670c63c7a4e83bed207205773f6448e89f2a1b1c2d3e4f5g6h7i8j9k0l1m'
      });
    }

    if (secondsSinceCreation > 60) { // Simulate confirm after 60s
      order.status = 'confirmed';
      await order.save();
      return NextResponse.json({ 
        success: true, 
        status: 'confirmed',
        receivedAmount: order.ltcAmount,
        txHash: '0x8b7670c63c7a4e83bed207205773f6448e89f2a1b1c2d3e4f5g6h7i8j9k0l1m'
      });
    }

    return NextResponse.json({ 
      success: true, 
      status: 'pending',
      receivedAmount: 0,
      ltcAmountRequired: order.ltcAmount
    });

  } catch (error: any) {
    console.error('Payment Verify Error:', error);
    return NextResponse.json({ success: false, message: 'Error verifying payment' }, { status: 500 });
  }
}
