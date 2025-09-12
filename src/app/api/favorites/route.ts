import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import { z } from 'zod';

const favoriteSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ message: 'Database not available' });
    }

    const favorites = await Favorite.find({ userId: session.user.id });
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { bookId } = favoriteSchema.parse(body);

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    // Verificar si ya existe el favorito
    const existingFavorite = await Favorite.findOne({
      userId: session.user.id,
      bookId
    });

    if (existingFavorite) {
      return NextResponse.json({ message: 'Book already in favorites' }, { status: 400 });
    }

    const favorite = new Favorite({
      userId: session.user.id,
      bookId
    });
    await favorite.save();

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const db = await dbConnect();
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    await Favorite.findOneAndDelete({
      userId: session.user.id,
      bookId
    });

    return NextResponse.json({ message: 'Favorite removed' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}
