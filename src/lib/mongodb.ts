import mongoose from 'mongoose';

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

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
    // Skip database connection during build time if MONGODB_URI is not set
    if (!MONGODB_URI) {
        console.warn('MONGODB_URI not found, skipping database connection during build');
        return null;
    }

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
