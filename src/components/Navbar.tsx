'use client'; // Ensure this is present

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname.includes('/auth')) return null;

  return (
    <nav className="p-4 flex justify-between items-center bg-white shadow">
      <h1>HD</h1>
      {session && <button onClick={() => signOut()} className="text-blue-500">Sign Out</button>}
    </nav>
  );
}