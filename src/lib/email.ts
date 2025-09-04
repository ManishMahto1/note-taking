import nodemailer from 'nodemailer';

// Create transporter with Gmail service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Notes App <noreply@notesapp.com>',
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export function generateOTPEmailTemplate(otp: string, name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #4f46e5;
          text-align: center;
          letter-spacing: 5px;
          margin: 20px 0;
          padding: 15px;
          background: #fff;
          border: 2px dashed #e5e7eb;
          border-radius: 8px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Notes App</h1>
        <p>Your Verification Code</p>
      </div>
      <div class="content">
        <h2>Hello ${name},</h2>
        <p>Thank you for signing up! Use the following OTP code to verify your email address:</p>
        
        <div class="otp-code">${otp}</div>
        
        <p>This code will expire in 10 minutes. If you didn't request this code, please ignore this email.</p>
        
        <p>Best regards,<br>The Notes App Team</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Notes App. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

export function generateLoginOTPEmailTemplate(otp: string, name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #4f46e5;
          text-align: center;
          letter-spacing: 5px;
          margin: 20px 0;
          padding: 15px;
          background: #fff;
          border: 2px dashed #e5e7eb;
          border-radius: 8px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>HD App</h1>
        <p>Your Login Verification Code</p>
      </div>
      <div class="content">
        <h2>Hello ${name},</h2>
        <p>Use the following OTP code to sign in to your account:</p>
        
        <div class="otp-code">${otp}</div>
        
        <p>This code will expire in 10 minutes. If you didn't request this code, please ignore this email.</p>
        
        <p>Best regards,<br>The HD App Team</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} HD App. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}