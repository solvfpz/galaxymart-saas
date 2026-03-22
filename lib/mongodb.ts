import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI environment variable is not defined.');
}

/** 
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections from growing exponentially during API calls.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    console.error('MongoDB Connection Error: MONGODB_URI is missing.');
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('--- MongoDB: Attempting to connect... ---');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((err) => {
      console.error('MongoDB connection error:', err.message);
      cached.promise = null; // Reset promise so it can be retried
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error: any) {
    console.error('MongoDB Connection Failed:', error.message);
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;
