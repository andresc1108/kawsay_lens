'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SpinnerIcon, EyeIcon } from '@/components/ui/Icons';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base">
        <div className="flex items-center gap-3 text-cyan">
          <EyeIcon size={24} />
          <span className="font-bold tracking-widest text-sm uppercase">Kawsay-Lens</span>
        </div>
        <SpinnerIcon size={20} className="text-muted" />
      </div>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}
