import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    await dbConnect();
    const settings = await Settings.findOne({});
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { ltcWalletAddress } = await req.json();
    if (!ltcWalletAddress) {
      return NextResponse.json({ success: false, message: 'LTC Wallet Address is required' }, { status: 400 });
    }

    await dbConnect();
    let settings = await Settings.findOne({});
    if (settings) {
      settings.ltcWalletAddress = ltcWalletAddress;
      await settings.save();
    } else {
      settings = await Settings.create({ ltcWalletAddress });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
