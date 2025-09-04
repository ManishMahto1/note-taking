export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isOTPValid(otp: string, storedOtp: string, otpExpiry: Date): boolean {
  // Add debug logs
  console.log('Validating OTP - input:', otp, 'stored:', storedOtp);
  console.log('Expiry time:', otpExpiry, 'Current time:', new Date());
  
  if (otp !== storedOtp) {
    console.log('OTP mismatch');
    return false;
  }
  
  if (new Date() > otpExpiry) {
    console.log('OTP expired');
    return false;
  }
  
  console.log('OTP is valid');
  return true;
}


