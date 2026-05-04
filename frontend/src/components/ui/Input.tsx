import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:   string;
  error?:   string;
  icon?:    React.ReactNode;
}

export function Input({ label, error, icon, type, className = '', ...rest }: InputProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const inputType  = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] font-semibold text-subtle uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          className={`
            w-full bg-surface border rounded-xl text-sm text-white placeholder-muted
            py-3 transition-all duration-200 outline-none
            ${icon ? 'pl-10 pr-4' : 'px-4'}
            ${isPassword ? 'pr-10' : ''}
            ${error
              ? 'border-rose/40 focus:border-rose/70'
              : 'border-rim focus:border-cyan/40 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.08)]'
            }
            ${className}
          `}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-subtle transition-colors"
          >
            {show ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-[11px] text-rose">{error}</p>}
    </div>
  );
}
