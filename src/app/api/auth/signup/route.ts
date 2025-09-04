import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateOTP } from '@/lib/otp';
import { sendEmail, generateOTPEmailTemplate } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, dob } = await request.json();
    console.log('Signup request:', { name, email, dob });
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    console.log('Generated OTP:', otp);
    
    // Create user without password
    const user = await User.create({
      name,
      email,
      dob,
      otp,
      otpExpiry,
    });
    
    console.log('User created:', user._id);
    
    // Send OTP via email
    try {
      const emailTemplate = generateOTPEmailTemplate(otp, name);
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - HD App',
        html: emailTemplate,
      });
      
      console.log(`OTP email sent to ${email}`);
      
      return NextResponse.json(
        { 
          message: 'OTP sent to your email. Please verify to complete registration.',
          otpSent: true
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      
      // Delete the user if email fails
      await User.findByIdAndDelete(user._id);
      
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Signup error details:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}



/* import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { generateOTP } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, password } = await request.json();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpiry,
    });
    
    // In a real app, you would send the OTP via email
    console.log(`OTP for ${email}: ${otp}`);
    
    // Generate token
    const token = generateToken({ userId: user._id.toString(), email: user.email });
    
    const response = NextResponse.json(
      { message: 'User created successfully. Please verify your email.' },
      { status: 201 }
    );
    
    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
    
    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} */