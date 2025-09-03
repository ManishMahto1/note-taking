'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import OtpInput from '@/components/auth/OtpInput';

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (otp: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) throw new Error('Invalid OTP');
      window.location.href = '/dashboard';
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return <OtpInput email={email || ''} onSubmit={handleVerify} error={error} />;
}