import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sg',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Kawsay-Lens · IA para la Salud Ocular',
  description: 'Sistema de análisis visual ocular en tiempo real con inteligencia artificial',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={spaceGrotesk.variable}>
      <body className="bg-base text-white antialiased font-[family-name:var(--font-sg)]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
