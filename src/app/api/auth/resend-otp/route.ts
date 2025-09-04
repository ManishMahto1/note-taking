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
        { error: 'User not found' },
        { status: 404 }
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
        subject: 'New Login OTP - HD App',
        html: emailTemplate,
      });
      
      //console.log(`New login OTP email sent to ${email}`);
      
      return NextResponse.json(
        { message: 'New OTP sent to your email' },
        { status: 200 }
      );
    } catch (emailError) {
     // console.error('Failed to send OTP email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}