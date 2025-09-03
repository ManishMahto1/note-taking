import Button from '../ui/Button';

export default function NoteCard({ title, onDelete }: { title: string; onDelete: () => void }) {
  return (
    <div className="p-2 border rounded flex justify-between items-center">
      <p>{title}</p>
      <Button onClick={onDelete} className="text-red-500">🗑️</Button>
    </div>
  );
}