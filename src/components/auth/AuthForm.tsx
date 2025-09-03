'use client';

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import GoogleAuthButton from './GoogleAuthButton';
import { signupSchema, loginSchema } from '@/utils/validation';

export default function AuthForm({ type, onSubmit, error }: { type: 'signup' | 'login'; onSubmit: (data: any) => void; error: string | null }) {
  const [formData, setFormData] = useState({ name: '', dob: '', email: '', otp: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = type === 'signup' ? signupSchema : loginSchema;
    try {
      schema.parse(formData);
      onSubmit({ ...formData, email: formData.email });
    } catch  {
      // Error handled by parent
      console.log("signlin failed");
      
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{type === 'signup' ? 'Sign up' : 'Sign In'}</h1>
      <p className="text-gray-500">{type === 'signup' ? 'Sign up to enjoy the feature of HD' : 'Please login to continue to your account.'}</p>
      {type === 'signup' && (
        <>
          <Input placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input type="date" placeholder="Date of Birth" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
        </>
      )}
      <Input placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <Button type="submit">{type === 'signup' ? 'Get OTP' : 'Sign In'}</Button>
      <GoogleAuthButton />
      {error && <ErrorMessage message={error} />}
      <p className="text-gray-500">
        {type === 'signup' ? 'Already have an account?' : 'Need an account?'}{' '}
        <a href={type === 'signup' ? '/auth/login' : '/auth/signup'} className="text-blue-500">
          {type === 'signup' ? 'Sign in' : 'Create one'}
        </a>
      </p>
    </form>
  );
}