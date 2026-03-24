import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { signJwtToken } from '@/lib/auth';

export async function POST(req: Request) {
  console.log('--- Login API Called ---');
  try {
    try {
      await connectDB();
    } catch (dbError: any) {
      console.error('--- Login API: Failed to connect to MongoDB ---');
      return NextResponse.json(
        { success: false, message: "Database connection failed. Check your IP whitelist in MongoDB Atlas." },
        { status: 503 }
      );
    }
    
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // --- Seeding logic (ensures admin exists) ---
    try {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await Admin.create({
          email: 'admin@example.com',
          passwordHash: hashedPassword,
        });
        console.log('--- Database Seeded: Created default admin (admin@example.com / password123) ---');
      }
    } catch (seedError: any) {
      console.error('Login API: Error during admin check/seeding:', seedError.message);
    }

    // --- Authentication logic ---
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      console.log(`Login Failed: No admin found with email ${email}`);
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      console.log(`Login Failed: Password mismatch for ${email}`);
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await signJwtToken({ email: admin.email, sub: admin._id.toString() });

    console.log(`--- Login SUCCESS: ${email} ---`);
    const response = NextResponse.json(
      { success: true, message: 'Logged in successfully' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('--- Critical Login API Error ---');
    console.error(error.message);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
