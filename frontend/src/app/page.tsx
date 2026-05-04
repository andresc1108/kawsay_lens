'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SpinnerIcon } from '@/components/ui/Icons';

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? '/dashboard' : '/auth/login');
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <SpinnerIcon size={22} className="text-muted" />
    </div>
  );
}
