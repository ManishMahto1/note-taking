'use client';

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';

export default function OtpInput({ email, onSubmit, error }: { email: string; onSubmit: (otp: string) => void; error: string | null }) {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Verify OTP</h1>
      <Input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <Button type="submit">Verify</Button>
      <a href={`/auth/${email.includes('@') ? 'login' : 'signup'}?email=${email}`} className="text-blue-500">Resend OTP</a>
      {error && <ErrorMessage message={error} />}
    </form>
  );
}