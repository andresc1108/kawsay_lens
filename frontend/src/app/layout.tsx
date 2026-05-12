import type { Metadata } from 'next';
import { Oxanium, Figtree } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kawsay-Lens · IA para la Salud Ocular',
  description: 'Sistema de análisis visual ocular en tiempo real con inteligencia artificial',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${oxanium.variable} ${figtree.variable}`}>
      <body className="bg-base text-white antialiased font-body">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
