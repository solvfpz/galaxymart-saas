import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';

const maskEmail = (email: string) => {
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user}****@${domain}`;
  return `${user.substring(0, 2)}****@${domain}`;
};

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    
    const query: any = { status: 'approved', deleted: { $ne: true } };
    if (productId) query.productId = productId;
    
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .lean();
      
    const formattedReviews = reviews.map((r: any) => ({
      ...r,
      email: maskEmail(r.email),
      reviewText: r.comment,
      starRating: r.rating,
    }));
      
    const totalCount = formattedReviews.length;
    const averageRating = totalCount > 0 
      ? formattedReviews.reduce((sum, rev) => sum + rev.starRating, 0) / totalCount 
      : 0;
      
    return NextResponse.json({ 
      success: true, 
      reviews: formattedReviews,
      stats: {
        totalCount,
        averageRating: averageRating.toFixed(1)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Error fetching reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.email || !body.comment || !body.rating || !body.productId || !body.orderId) {
      return NextResponse.json({ success: false, message: 'Missing required fields (email, comment, rating, productId, orderId)' }, { status: 400 });
    }

    if (body.comment.length < 10) {
      return NextResponse.json({ success: false, message: 'Comment must be at least 10 characters' }, { status: 400 });
    }

    // Validate order exists and is eligible for review
    const order = await Order.findById(body.orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const eligibleStatuses = ['confirmed', 'delivered', 'manual'];
    if (!eligibleStatuses.includes(order.status)) {
      return NextResponse.json({ success: false, message: 'Order must be confirmed or delivered to leave a review' }, { status: 400 });
    }

    // Single duplicate check: orderId only (same customer can review 10 different orders of same product)
    const existing = await Review.findOne({ orderId: body.orderId });
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        message: 'You have already reviewed this order' 
      }, { status: 400 });
    }
    
    const review = await Review.create({
      productId: body.productId,
      productName: body.productName || '',
      orderId: body.orderId,
      email: body.email.toLowerCase(),
      rating: body.rating,
      comment: body.comment,
      status: 'pending',
    });
    
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        message: 'You have already reviewed this order' 
      }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Error creating review" }, { status: 500 });
  }
}
