import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const MONGODB_URI: string = process.env.MONGODB_URI;

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    // Usar caché en desarrollo para evitar múltiples conexiones
    if (cached!.conn) {
        return cached!.conn;
    }

    // Si no hay promesa, crear una nueva
    if (!cached!.promise) {
        const opts = {
            bufferCommands: false, // Desactivar el almacenamiento en búfer
        };

        cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (error) {
        cached!.promise = null;
        throw error;
    }

    return cached!.conn;
}

export default connectDB;
