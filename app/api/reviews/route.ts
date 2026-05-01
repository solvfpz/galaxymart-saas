import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

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
    
    const query = productId ? { productId } : {};
    
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .lean();
      
    // Mask emails and format response
    const formattedReviews = reviews.map((r: any) => ({
      ...r,
      email: maskEmail(r.email),
      reviewText: r.comment, // Map for frontend compatibility
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
    
    if (!body.email || !body.comment || !body.rating || !body.productId) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    if (body.comment.length < 10) {
      return NextResponse.json({ success: false, message: 'Comment must be at least 10 characters' }, { status: 400 });
    }
    
    // Check for existing review
    const existing = await Review.findOne({ 
      productId: body.productId, 
      email: body.email.toLowerCase() 
    });
    
    if (existing) {
      return NextResponse.json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      }, { status: 400 });
    }
    
    const review = await Review.create({
      productId: body.productId,
      email: body.email.toLowerCase(),
      rating: body.rating,
      comment: body.comment,
    });
    
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Error creating review" }, { status: 500 });
  }
}
