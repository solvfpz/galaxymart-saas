import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product'; 

export async function GET() {
  try {
    try {
      await dbConnect();
    } catch (dbError) {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }
    
    const orders = await Order.find({})
      .populate('productId')
      .sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error fetching orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    try {
      await dbConnect();
    } catch (dbError) {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });

    const order = await Order.create(body);
    
    // Reduce stock if applicable
    if (body.productId) {
      await Product.findByIdAndUpdate(body.productId, { $inc: { stock: -1 } });
    }
    
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error creating order" }, { status: 500 });
  }
}
