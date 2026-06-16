import { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 ${className}`}
      {...props}
    />
  );
}
