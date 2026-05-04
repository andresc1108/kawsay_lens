import React from 'react';
import { SpinnerIcon } from './Icons';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  icon?:     React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   'bg-grad-brand text-white shadow-glow-sm hover:shadow-glow-v',
  secondary: 'bg-surface border border-rim text-subtle hover:border-cyan/30 hover:text-white',
  ghost:     'text-subtle hover:text-white hover:bg-white/[0.04]',
  danger:    'bg-rose/10 border border-rose/25 text-rose hover:bg-rose/20',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-sm gap-2',
};

export function Button({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold tracking-wide rounded-xl
        transition-all duration-200 select-none
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {loading ? <SpinnerIcon size={14} /> : icon}
      {children}
    </button>
  );
}
