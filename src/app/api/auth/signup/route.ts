import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import otp from '@/lib/otp';

export async function POST(req: Request) {
  await dbConnect();
  const { name, dob, email } = await req.json();
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');
    const otpCode = otp.generateOtp();
    await User.create({ name, dob, email, otp: otpCode, otpExpiry: new Date(Date.now() + 10 * 60 * 1000) });
    // Send OTP via email (implement email service)
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}