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
  const redactedUri = MONGODB_URI ? MONGODB_URI.replace(/:([^@]+)@/, ":****@") : "MISSING";
  
  if (cached.conn) {
    console.log('--- MongoDB: Using cached connection ---');
    return cached.conn;
  }

  if (!MONGODB_URI) {
    console.error('MongoDB Connection Error: MONGODB_URI is missing.');
    console.log('Environment Debug:', {
      hasUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV
    });
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log(`--- MongoDB: Attempting to connect to: ${redactedUri} ---`);
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((err) => {
      console.error('--- MongoDB Connection Exception ---');
      console.error('Error Code:', err.code);
      console.error('Error Message:', err.message);
      
      if (err.message.includes('Could not connect to any servers')) {
        console.error('FIX: Whitelist your current IP address in MongoDB Atlas.');
      }
      
      cached.promise = null; // Reset promise so it can be retried
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error: any) {
    cached.promise = null;
    throw error;
  }
}

// Alias for convenience
export const connectDB = dbConnect;
export default dbConnect;
