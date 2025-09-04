import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateOTP } from '@/lib/otp';
import { sendEmail, generateLoginOTPEmailTemplate } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please sign up first.' },
        { status: 404 }
      );
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email first. Check your inbox for the verification OTP.' },
        { status: 401 }
      );
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    
    // Send OTP via email
    try {
      const emailTemplate = generateLoginOTPEmailTemplate(otp, user.name);
      await sendEmail({
        to: email,
        subject: 'Your Login OTP - HD App',
        html: emailTemplate,
      });
      
      console.log(`Login OTP email sent to ${email}`);
      
      return NextResponse.json(
        { message: 'OTP sent to your email. Please check your inbox.' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Request login OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}