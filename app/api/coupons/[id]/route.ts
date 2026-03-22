import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

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
    const coupon = await Coupon.findById(id);
    if (!coupon) return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error fetching coupon" }, { status: 500 });
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

    const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!coupon) return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error updating coupon" }, { status: 500 });
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
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error deleting coupon" }, { status: 500 });
  }
}
