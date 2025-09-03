'use client';

import { useState } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { loginSchema } from '@/utils/validation';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: { email: string }) => {
    try {
      const validatedData = loginSchema.parse(data);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });
      if (!res.ok) throw new Error('Login failed');
      window.location.href = `/auth/verify-otp?email=${data.email}`;
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return <AuthForm type="login" onSubmit={handleSubmit} error={error} />;
}