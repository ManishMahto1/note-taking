'use client';

import { signIn } from 'next-auth/react';

export default function GoogleAuthButton() {
  return (
    <button onClick={() => signIn('google')} className="bg-red-500 text-white p-2 rounded w-full">
      Sign in with Google
    </button>
  );
}