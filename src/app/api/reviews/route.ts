// filepath: src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

const reviewSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get('bookId');

  try {
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ message: 'Database not available' });
    }

    let reviews;
    let formattedReviews;

    if (bookId) {
      // Si se especifica bookId, devolver todas las reseñas para ese libro (públicas)
      reviews = await Review.find({ bookId }).sort({ createdAt: -1 });

      formattedReviews = reviews.map(review => ({
        id: review._id.toString(),
        bookId: review.bookId,
        userName: review.userName || 'Usuario Anónimo',
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        upvotes: review.upvotes || 0,
        downvotes: review.downvotes || 0,
        userVotes: review.userVotes || {}
      }));
    } else {
      // Si no hay bookId, devolver solo las reseñas del usuario autenticado (para perfil)
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      reviews = await Review.find({ userId: session.user.id }).sort({ createdAt: -1 });

      formattedReviews = reviews.map(review => ({
        id: review._id.toString(),
        bookId: review.bookId,
        userName: review.userName || 'Usuario Anónimo',
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        upvotes: review.upvotes || 0,
        downvotes: review.downvotes || 0,
        userVotes: review.userVotes || {}
      }));
    }

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bookId, rating, comment } = reviewSchema.parse(body);

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const review = new Review({
      userId: session.user.id,
      bookId,
      rating,
      comment,
      userName: session.user.name || 'Usuario Anónimo',
      upvotes: 0,
      downvotes: 0,
      userVotes: {}
    });

    await review.save();
    return NextResponse.json({
      id: review._id.toString(),
      bookId: review.bookId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      upvotes: review.upvotes,
      downvotes: review.downvotes,
      userVotes: review.userVotes
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.issues
      }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}