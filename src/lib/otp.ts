// src/lib/otp.ts (server-side only)
import { randomInt } from "crypto";

export function generateOtp() {
  return randomInt(100000, 999999).toString();
}

export function verifyOtp(storedOtp: string, inputOtp: string) {
  return storedOtp === inputOtp;
}
