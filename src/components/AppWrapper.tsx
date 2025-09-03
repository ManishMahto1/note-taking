'use client';

import { SessionProvider } from 'next-auth/react';
import Navbar from './Navbar';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <Navbar />
        {children}
      </SessionProvider>
    </>
  );
}