import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kawsay-Lens · IA para la Salud Ocular',
  description: 'Sistema académico de análisis visual ocular en tiempo real con MediaPipe y estructuras de datos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-kl-deep text-white antialiased">
        {children}
      </body>
    </html>
  );
}
