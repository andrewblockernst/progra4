import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasMongodbUri: Boolean(process.env.MONGODB_URI),
    hasNextauthSecret: Boolean(process.env.NEXTAUTH_SECRET),
    nodeEnv: process.env.NODE_ENV,
  });
}
