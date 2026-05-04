'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { LogOutIcon, UserIcon } from '@/components/ui/Icons';

export function Header() {
  const { user, logOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-6
      bg-base/80 backdrop-blur-md border-b border-rim">

      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 relative flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Kawsay-Lens"
            fill
            style={{ objectFit: 'contain', mixBlendMode: 'multiply' }}
          />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-grad font-extrabold text-sm tracking-tight">KAWSAY-LENS</span>
          <span className="text-[10px] text-muted tracking-widest uppercase hidden sm:block">
            Análisis Ocular
          </span>
        </div>
      </div>

      {/* User + logout */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg
          bg-surface border border-rim text-subtle text-xs">
          <UserIcon size={12} />
          <span className="max-w-[140px] truncate">{user?.displayName || user?.email}</span>
        </div>

        <button
          onClick={logOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted
            hover:text-rose hover:bg-rose/8 border border-transparent hover:border-rose/20
            transition-all duration-200"
          title="Cerrar sesión"
        >
          <LogOutIcon size={13} />
          <span className="hidden sm:block">Salir</span>
        </button>
      </div>
    </header>
  );
}
