// filepath: src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

const reviewSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

export async function GET() {
  await dbConnect();
  const reviews = await Review.find().populate('userId');
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { bookId, rating, comment } = reviewSchema.parse(body);

    await dbConnect();
    const review = new Review({ userId: session.user.id, bookId, rating, comment });
    await review.save();
    return NextResponse.json(review);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}