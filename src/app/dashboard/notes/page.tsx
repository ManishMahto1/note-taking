'use client';

import { useState } from 'react';
import NoteForm from '@/components/notes/NoteForm';
import NotesList from '@/components/notes/NotesList';
import { useNotes } from '@/hooks/useNotes'; // Placeholder hook

export default function NotesPage() {
  const { notes, loading, error, createNote, deleteNote } = useNotes();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="p-4">
      <button onClick={() => setIsFormOpen(true)} className="bg-blue-500 text-white p-2 rounded">
        Create Note
      </button>
      <NoteForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={createNote} />
      <NotesList notes={notes} onDelete={deleteNote} loading={loading} error={error} />
    </div>
  );
}