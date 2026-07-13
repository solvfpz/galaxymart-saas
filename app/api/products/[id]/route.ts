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

    const existingProduct = await Product.findById(id);
    if (!existingProduct) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

    const allowedDurations = ['1 Month', '3 Months', 'Lifetime'];
    const duration = allowedDurations.includes(body.duration) ? body.duration : 'Lifetime';
    
    const deliverableType = body.deliverableType || existingProduct.deliverableType;
    const serials = body.serials !== undefined ? body.serials : existingProduct.serials;
    
    let stock: number | undefined;
    if (body.serials !== undefined || body.deliverableType === 'Serials') {
      if (deliverableType === 'Serials') {
        stock = serials.length;
      }
    }
    if (body.stock !== undefined && deliverableType !== 'Serials') {
      stock = Math.max(0, body.stock);
    }

    const updatePayload: any = {
      name: body.name !== undefined ? body.name : existingProduct.name,
      price: body.price !== undefined ? body.price : existingProduct.price,
      description: body.description !== undefined ? body.description : existingProduct.description,
      instructions: body.instructions !== undefined ? (body.instructions || '') : existingProduct.instructions,
      image: body.image !== undefined ? body.image : existingProduct.image,
      duration,
      deliverableType,
      serials,
      webhookUrl: body.webhookUrl !== undefined ? (body.webhookUrl || '') : existingProduct.webhookUrl,
      deliveryMethod: body.deliveryMethod || existingProduct.deliveryMethod || 'Random',
      visibility: body.visibility || existingProduct.visibility || 'Public',
      currency: body.currency || existingProduct.currency || 'USD'
    };

    if (stock !== undefined) {
      updatePayload.stock = stock;
    }

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
