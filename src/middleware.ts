/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { verifyJwt } from './lib/auth';

export function middleware(req: { cookies: { get: (arg0: string) => any; }; }) {
  const token = req.cookies.get('token');
  if (!token) return NextResponse.redirect('/auth/login');
  try {
    verifyJwt(token);
  } catch {
    return NextResponse.redirect('/auth/login');
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};