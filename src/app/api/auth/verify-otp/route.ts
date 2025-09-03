import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signJwt } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const { email, otp: inputOtp } = await req.json();
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== inputOtp || new Date() > user.otpExpiry) throw new Error('Invalid or expired OTP');
    const token = signJwt({ id: user._id });
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}