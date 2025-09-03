'use client';

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function NoteForm({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (title: string, content: string) => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, content);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <Button onClick={handleSubmit}>Create</Button>
        <Button onClick={onClose} className="ml-2">Cancel</Button>
      </div>
    </div>
  );
}