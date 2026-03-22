import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    try {
      await dbConnect();
    } catch (dbError) {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }
    
    const { id } = await params;
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error fetching product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    try {
      await dbConnect();
    } catch (dbError) {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });

    const allowedDurations = ['1 Month', '3 Months', 'Lifetime'];
    const duration = allowedDurations.includes(body.duration) ? body.duration : 'Lifetime';

    const updatePayload = {
      name: body.name,
      price: body.price,
      description: body.description,
      image: body.image,
      duration: duration
    };

    const product = await Product.findByIdAndUpdate(id, updatePayload, { new: true, runValidators: true });
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error updating product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    try {
      await dbConnect();
    } catch (dbError) {
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 503 }
      );
    }

    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error deleting product" }, { status: 500 });
  }
}
