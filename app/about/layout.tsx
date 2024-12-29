import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Enaiblr - Platform AI All-in-One',
  description: 'Akses Seluruh AI Tanpa Batas dalam Satu Platform dengan Harga Terjangkau'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className={cn(inter.className, 'min-h-screen bg-background')}>
        {children}
      </div>
  );
}