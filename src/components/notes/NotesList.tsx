import NoteCard from './NoteCard';
import Loader from '../ui/Loader';
import ErrorMessage from '../ui/ErrorMessage';

export default function NotesList({ notes, onDelete, loading, error }: { notes: any[]; onDelete: (id: string) => void; loading: boolean; error: string | null }) {
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <NoteCard key={note._id} title={note.title} onDelete={() => onDelete(note._id)} />
      ))}
    </div>
  );
}