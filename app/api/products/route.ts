import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
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
    
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error fetching products" }, { status: 500 });
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

    const body = await req.json();
    const allowedDurations = ['1 Month', '3 Months', 'Lifetime'];
    const duration = allowedDurations.includes(body.duration) ? body.duration : 'Lifetime';

    const productPayload = {
      name: body.name,
      price: body.price,
      description: body.description,
      image: body.image,
      duration: duration
    };

    const product = await Product.create(productPayload);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error creating product" }, { status: 400 });
  }
}
