import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, password, name } = await req.json();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({ email, password: hashedPassword, name });
  await user.save();
  return NextResponse.json({ message: 'User created' });
}