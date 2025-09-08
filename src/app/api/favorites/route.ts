import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

const favoriteSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
});

export async function GET() {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const favorites = await Favorite.find({ userId: session.user.id });
  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bookId } = favoriteSchema.parse(body);

    await dbConnect();

    // Check if already exists
    const existing = await Favorite.findOne({ userId: session.user.id, bookId });
    if (existing) {
      return NextResponse.json({ error: 'Already in favorites' }, { status: 400 });
    }

    const favorite = new Favorite({ userId: session.user.id, bookId });
    await favorite.save();
    return NextResponse.json(favorite);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');
    if (!bookId) {
      return NextResponse.json({ error: 'Book ID required' }, { status: 400 });
    }

    await dbConnect();
    await Favorite.findOneAndDelete({ userId: session.user.id, bookId });
    return NextResponse.json({ message: 'Removed from favorites' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
