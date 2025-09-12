import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const db = await dbConnect();

    // Skip database operations during build time if connection is not available
    if (!db) {
      return NextResponse.json({ message: 'Database not available during build' });
    }

    console.log('Conexión exitosa a MongoDB');

    // Insertar un usuario de prueba (solo para demo; en producción, usa registro seguro)
    const testUser = new User({
      email: 'andrewnaitor@gmail.com',
      password: 'andrew123', 
      name: 'AndrewnAitor',
    });
    await testUser.save();
    console.log('Usuario insertado:', testUser);

    return NextResponse.json({ message: 'Conexión exitosa y usuario insertado', user: testUser });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error conectando a la DB' }, { status: 500 });
  }
}