import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

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
    
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error fetching coupons" }, { status: 500 });
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

    const coupon = await Coupon.create(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error creating coupon" }, { status: 500 });
  }
}
