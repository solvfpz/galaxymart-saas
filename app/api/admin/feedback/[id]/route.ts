import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

// PATCH /api/admin/feedback/[id] - update status
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const allowed = ['pending', 'approved', 'hidden'];
    if (body.status && !allowed.includes(body.status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    const updated = await Review.findByIdAndUpdate(
      id,
      { $set: { status: body.status } },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error: any) {
    console.error('[Admin Feedback PATCH]', error);
    return NextResponse.json({ success: false, message: 'Error updating feedback' }, { status: 500 });
  }
}

// DELETE /api/admin/feedback/[id] - soft delete
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get('permanent') === 'true';

    if (permanent) {
      await Review.findByIdAndDelete(id);
    } else {
      await Review.findByIdAndUpdate(id, { $set: { deleted: true } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Admin Feedback DELETE]', error);
    return NextResponse.json({ success: false, message: 'Error deleting feedback' }, { status: 500 });
  }
}
