'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input }  from '@/components/ui/Input';
import { MailIcon, LockIcon, UserIcon, AlertIcon, CheckIcon } from '@/components/ui/Icons';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router      = useRouter();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name.trim());
      setDone(true);
    } catch (err: any) {
      const map: Record<string, string> = {
        'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
        'auth/invalid-email':        'Correo inválido.',
        'auth/weak-password':        'Contraseña muy débil. Usa al menos 6 caracteres.',
      };
      setError(map[err.code] ?? 'Error al crear cuenta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="card p-8 flex flex-col gap-6 items-center text-center">
        <div className="w-16 h-16 relative">
          <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain', mixBlendMode: 'multiply' }} />
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald/10 border border-emerald/30 flex items-center justify-center">
          <CheckIcon size={22} className="text-emerald" />
        </div>
        <div>
          <h2 className="text-grad font-extrabold text-lg">¡Cuenta creada!</h2>
          <p className="text-muted text-sm mt-2 max-w-xs">
            Te enviamos un correo de verificación a <span className="text-white font-medium">{email}</span>.
            Verifica tu cuenta y luego inicia sesión.
          </p>
        </div>
        <Button fullWidth onClick={() => router.replace('/auth/login')}>
          Ir al inicio de sesión
        </Button>
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
          <p className="text-[10px] text-muted tracking-widest mt-0.5 uppercase">Crear cuenta</p>
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
          label="Nombre completo"
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<UserIcon size={15} />}
          required
          autoComplete="name"
        />
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
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<LockIcon size={15} />}
          required
          autoComplete="new-password"
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="Repite tu contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          icon={<LockIcon size={15} />}
          required
          autoComplete="new-password"
          error={confirm && password !== confirm ? 'Las contraseñas no coinciden' : undefined}
        />

        <Button type="submit" loading={loading} fullWidth size="lg" className="mt-1">
          Crear cuenta
        </Button>
      </form>

      {/* Login link */}
      <p className="text-center text-xs text-muted">
        ¿Ya tienes cuenta?{' '}
        <Link href="/auth/login" className="text-cyan hover:text-cyan/80 font-medium transition-colors">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
