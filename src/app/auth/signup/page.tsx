'use client';

import { useState } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { signupSchema } from '@/utils/validation';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { name: string; dob: string; email: string }) => {
    try {
      const validatedData = signupSchema.parse(data);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });
      if (!res.ok) throw new Error('Signup failed');
      window.location.href = `/auth/verify-otp?email=${data.email}`;
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return <AuthForm type="signup" onSubmit={handleSubmit} error={error} />;
}