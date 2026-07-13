import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

// GET /api/admin/feedback - list all feedback with stats
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const rating = searchParams.get('rating') || '';

    const query: any = { deleted: { $ne: true } };

    if (status && status !== 'all') query.status = status;
    if (rating) query.rating = Number(rating);
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { productName: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
      ];
    }

    const [reviews, total, approved, pending] = await Promise.all([
      Review.find(query).sort({ createdAt: -1 }).lean(),
      Review.countDocuments({ deleted: { $ne: true } }),
      Review.countDocuments({ status: 'approved', deleted: { $ne: true } }),
      Review.countDocuments({ status: 'pending', deleted: { $ne: true } }),
    ]);

    const allRatings = await Review.find({ deleted: { $ne: true } }).select('rating').lean();
    const avgRating =
      allRatings.length > 0
        ? (allRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / allRatings.length).toFixed(1)
        : '0.0';

    return NextResponse.json({
      success: true,
      reviews,
      stats: { total, approved, pending, avgRating },
    });
  } catch (error: any) {
    console.error('[Admin Feedback GET]', error);
    return NextResponse.json({ success: false, message: 'Error fetching feedback' }, { status: 500 });
  }
}
