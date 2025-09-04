import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {

   const { id } = await context.params;
  
  try {
    await dbConnect();
    
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
 
    
    // Find note and verify ownership
    const note = await Note.findOne({ _id: id, userId: decoded.userId });
    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    
    // Delete note
    await Note.findByIdAndDelete(id);
    
    return NextResponse.json(
      { message: 'Note deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete note error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}