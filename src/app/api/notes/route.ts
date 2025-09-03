import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';
import { getToken } from 'next-auth/jwt';

export async function GET(req: Request) {
  await dbConnect();
  const token = await getToken({ req });
  if (!token?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const notes = await Note.find({ userId: token.id });
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  await dbConnect();
  const token = await getToken({ req });
  if (!token?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { title, content } = await req.json();
  const note = await Note.create({ userId: token.id, title, content });
  return NextResponse.json(note);
}