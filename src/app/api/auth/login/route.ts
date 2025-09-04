import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { isOTPValid } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, otp, rememberMe } = await request.json();
   // console.log('Login attempt:', { email, otp: otp ? 'provided' : 'missing', rememberMe });

    if (!email || !otp) {
      console.log('Missing email or OTP');
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      console.log('User not verified:', email);
      return NextResponse.json(
        { error: 'Please verify your email first' },
        { status: 401 }
      );
    }

    // Verify OTP
   /*  console.log('Stored OTP:', user.otp);
    console.log('OTP Expiry:', user.otpExpiry);
    console.log('Current time:', new Date()); */
    
    if (!user.otp || !user.otpExpiry || !isOTPValid(otp, user.otp, user.otpExpiry)) {
      //console.log('Invalid OTP - provided:', otp, 'stored:', user.otp);
     // console.log('OTP expired?:', user.otpExpiry && new Date() > user.otpExpiry);
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      );
    }

    // Clear OTP after successful login
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate token
    const token = generateToken({ userId: user._id.toString(), email: user.email });

    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );

    // Set cookie with appropriate expiration
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    //console.log('Login successful for:', email);
    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}