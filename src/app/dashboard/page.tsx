'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  // New note state
  const [newNote, setNewNote] = useState({
    title: '',
    content: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch user data and notes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user data
        const userResponse = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          throw new Error('Failed to fetch user data');
        }
        
        // Fetch notes
        const notesResponse = await fetch('/api/notes', {
          credentials: 'include',
        });
        
        if (notesResponse.ok) {
          const notesData = await notesResponse.json();
          setNotes(notesData.notes || []);
        }
        
      } catch (error) {
        setError('Failed to load data');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newNote),
      });

      const result = await response.json();

      if (response.ok) {
        setNotes([result.note, ...notes]);
        setNewNote({ title: '', content: '' });
        setShowCreateForm(false);
      } else {
        setError(result.error || 'Failed to create note');
      }
    } catch (error) {
      setError('Failed to create note');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    setDeletingNoteId(id);
    setError('');

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setNotes(notes.filter(note => note._id !== id));
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to delete note');
      }
    } catch (error) {
      setError('Failed to delete note');
    } finally {
      setDeletingNoteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/logo.svg"
              alt="HD Logo"
              className="w-8 h-8"
              width={32}
              height={32}
            />
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-blue-600 hover:text-blue-800 font-medium underline"
          >
            Sign Out
          </button>
        </header>

        {/* Welcome Card */}
        {user && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Welcome back, {user.name}!
            </h2>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600 mt-2">
              You have {notes.length} note{notes.length !== 1 ? 's' : ''}
            </p>
          </section>
        )}

        {/* Create Note Button */}
        {!showCreateForm && (
          <div className="mb-6">
           
              <button
               onClick={() => setShowCreateForm(true)}
             
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-lg transition-all duration-300 ease-in-out disabled:opacity-600 cursor-pointer"
            >
              
                <div className="flex items-center justify-center">
                  Create Note
                </div>
              
            </button>
          </div>
        )}

        {/* Create Note Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Note</h3>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  placeholder="Write your note content..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Note'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewNote({ title: '', content: '' });
                    setError('');
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notes List */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Notes</h3>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {notes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No notes yet. Create your first note!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-lg shadow-xl p-5 hover:shadow-lg  border-2 border-gray-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-gray-900 truncate">
                      {note.title}
                    </h4>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      disabled={deletingNoteId === note._id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      title="Delete note"
                    >
                      {deletingNoteId === note._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        '🗑️'
                      )}
                    </button>
                  </div>
                  <p className="text-gray-600 mb-3 whitespace-pre-wrap">
                    {note.content.length > 150 ? `${note.content.substring(0, 150)}...` : note.content}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {formatDate(note.createdAt)}
                  </p>
                  {note.updatedAt !== note.createdAt && (
                    <p className="text-xs text-gray-400">
                      Updated: {formatDate(note.updatedAt)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;