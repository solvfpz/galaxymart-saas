import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

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

    const { code } = await req.json().catch(() => ({}));

    if (!code) {
      return NextResponse.json({ success: false, message: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid or inactive coupon code' }, { status: 404 });
    }

    // Check expiry
    const now = new Date();
    if (new Date(coupon.expiryDate) < now) {
      return NextResponse.json({ success: false, message: 'This coupon has expired' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Coupon validated successfully',
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
      }
    });
  } catch (error: any) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
