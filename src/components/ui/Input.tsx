import { InputHTMLAttributes } from 'react';

export default function Input({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="border p-2 rounded w-full" {...props} />;
}