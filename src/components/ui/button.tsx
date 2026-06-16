import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  const variantClasses =
    variant === 'outline'
      ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
      : variant === 'ghost'
      ? 'bg-transparent text-slate-600 hover:bg-slate-100'
      : 'bg-sky-600 text-white hover:bg-sky-700';
  const sizeClasses = size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-sm sm:text-base';

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
