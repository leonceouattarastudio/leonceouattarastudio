import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Leonce Ouattara Studio - Expert IT & Solutions Digitales',
  description: 'Portfolio professionnel de Leonce Ouattara - Expert en développement web, solutions digitales pour hôtellerie, immobilier et entrepreneurs.',
  keywords: 'développeur web, expert IT, Next.js, React, portfolio, solutions digitales',
  authors: [{ name: 'Leonce Ouattara' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${spaceGrotesk.className} bg-[#0A0A0B] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}