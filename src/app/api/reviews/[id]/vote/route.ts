import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { voteType } = await req.json();
    if (!['up', 'down'].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    const review = await Review.findById(id);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Initialize userVotes if it doesn't exist
    if (!review.userVotes) {
      review.userVotes = {};
    }

    // Initialize upvotes and downvotes if they don't exist
    if (typeof review.upvotes !== 'number') {
      review.upvotes = 0;
    }
    if (typeof review.downvotes !== 'number') {
      review.downvotes = 0;
    }

    const previousVote = review.userVotes[session.user.id];

    // Remove previous vote if exists
    if (previousVote === 'up') review.upvotes--;
    if (previousVote === 'down') review.downvotes--;

    // Add new vote if different from previous
    if (previousVote !== voteType) {
      if (voteType === 'up') review.upvotes++;
      if (voteType === 'down') review.downvotes++;
      review.userVotes[session.user.id] = voteType;
    } else {
      // Remove vote if clicking same vote
      delete review.userVotes[session.user.id];
    }

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
    });
  } catch (error) {
    console.error('Error voting on review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
