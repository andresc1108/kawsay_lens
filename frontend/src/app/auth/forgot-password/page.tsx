'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input }  from '@/components/ui/Input';
import { MailIcon, AlertIcon, CheckIcon, ChevLeftIcon } from '@/components/ui/Icons';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      const map: Record<string, string> = {
        'auth/user-not-found': 'No existe una cuenta con ese correo.',
        'auth/invalid-email':  'Correo inválido.',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
      };
      setError(map[err.code] ?? 'Error al enviar el correo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="card p-8 flex flex-col gap-6 items-center text-center">
        <div className="w-16 h-16 relative">
          <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </div>
        <div className="w-12 h-12 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center">
          <CheckIcon size={22} className="text-cyan" />
        </div>
        <div>
          <h2 className="text-grad font-extrabold text-lg">Revisa tu correo</h2>
          <p className="text-muted text-sm mt-2 max-w-xs">
            Enviamos las instrucciones para restablecer tu contraseña a{' '}
            <span className="text-white font-medium">{email}</span>.
          </p>
        </div>
        <Link href="/auth/login" className="w-full">
          <Button variant="secondary" fullWidth icon={<ChevLeftIcon size={14} />}>
            Volver al inicio de sesión
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-8 flex flex-col gap-7">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 relative">
          <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </div>
        <div className="text-center">
          <h1 className="text-grad font-display font-extrabold text-xl tracking-widest">KAWSAY-LENS</h1>
          <p className="text-[10px] text-muted tracking-widest mt-0.5 uppercase">Restablecer contraseña</p>
        </div>
      </div>

      <p className="text-sm text-muted text-center -mt-2">
        Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

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

        <Button type="submit" loading={loading} fullWidth size="lg">
          Enviar enlace de restablecimiento
        </Button>
      </form>

      {/* Back link */}
      <p className="text-center text-xs text-muted">
        <Link href="/auth/login" className="text-cyan hover:text-cyan/80 font-medium transition-colors inline-flex items-center gap-1">
          <ChevLeftIcon size={12} />
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
}
