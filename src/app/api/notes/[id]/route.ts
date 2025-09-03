import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';
import { getToken } from 'next-auth/jwt';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const token = await getToken({ req });
  if (!token?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await Note.findOneAndDelete({ _id: params.id, userId: token.id });
  return NextResponse.json({ success: true });
}