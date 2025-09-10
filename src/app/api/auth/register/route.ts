import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const db = await dbConnect();

    // Skip database operations during build time if connection is not available
    if (!db) {
      return NextResponse.json(
        { message: 'Database not available during build' },
        { status: 503 }
      );
    }

    const { email, password, name } = await req.json();

    // Validaciones
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Crear usuario
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim()
    });

    await user.save();

    return NextResponse.json(
      { message: 'Usuario creado exitosamente' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
