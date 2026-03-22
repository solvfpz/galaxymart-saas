import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { signJwtToken } from '@/lib/auth';

export async function POST(req: Request) {
  console.log('--- Login API Called ---');
  try {
    try {
      await dbConnect();
    } catch (dbError: any) {
      console.error('Login API: Database connection failed');
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
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

    // Seed logic: If no admin exists, create a default one
    try {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await Admin.create({
          email: 'admin@example.com',
          passwordHash: hashedPassword,
        });
        console.log('Seeded default admin account: admin@example.com / password123');
      }
    } catch (seedError) {
      console.error('Error checking/seeding admin:', seedError);
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log(`Login Failed: User ${email} not found`);
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      console.log(`Login Failed: Incorrect password for ${email}`);
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await signJwtToken({ email: admin.email, sub: admin._id.toString() });

    console.log(`Login Successful: ${email}`);
    const response = NextResponse.json(
      { success: true, message: 'Logged in successfully' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: true, // Always true for modern browsers/Next.js
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login API Error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
