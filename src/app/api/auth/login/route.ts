import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import {generateOtp} from '@/lib/otp';

export async function POST(req: Request) {
  await dbConnect();
  const { email } = await req.json();
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    const otpCode = generateOtp();
    user.otp = otpCode;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    // Send OTP via email (implement email service)
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}