'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input }  from '@/components/ui/Input';
import { MailIcon, LockIcon, AlertIcon } from '@/components/ui/Icons';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router     = useRouter();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/dashboard');
    } catch (err: any) {
      const map: Record<string, string> = {
        'auth/user-not-found':  'No existe una cuenta con ese correo.',
        'auth/wrong-password':  'Contraseña incorrecta.',
        'auth/invalid-email':   'Correo inválido.',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
      };
      setError(map[err.code] ?? 'Error al iniciar sesión. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 flex flex-col gap-7">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 relative">
          <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </div>
        <div className="text-center">
          <h1 className="text-grad font-display font-extrabold text-xl tracking-widest">KAWSAY-LENS</h1>
          <p className="text-[10px] text-muted tracking-widest mt-0.5 uppercase">Sistema de Análisis Ocular</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose/8 border border-rose/25 text-rose text-sm">
          <AlertIcon size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<MailIcon size={15} />}
          required
          autoComplete="email"
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<LockIcon size={15} />}
          required
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link href="/auth/forgot-password"
            className="text-xs text-muted hover:text-cyan transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" loading={loading} fullWidth size="lg" className="mt-1">
          Iniciar Sesión
        </Button>
      </form>

      {/* Register link */}
      <p className="text-center text-xs text-muted">
        ¿No tienes cuenta?{' '}
        <Link href="/auth/register" className="text-cyan hover:text-cyan/80 font-medium transition-colors">
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}
