import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Enaiblr - Unlimited AI Platform',
  description: 'Akses Seluruh AI Tanpa Batas dalam Satu Platform dengan Harga Terjangkau'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className={cn(
        inter.className,
        'min-h-screen',
        'bg-white',
        // Base text colors
        '[&_p]:!text-black [&_h1]:!text-black [&_h2]:!text-black [&_h3]:!text-black',
        // Special text handling
        '[&_span:not([class*="text-"],[class*="gradient"])]:!text-black',
        '[&_.text-muted-foreground]:!text-gray-500',
        '[&_.text-foreground]:!text-black',
        // Button handling
        '[&_button:not([class*="text-"]):not([class*="bg-"],[class*="gradient"])]:!text-black',
        '[&_button[class*="variant-outline"]]:!text-black',
        // Background handling
        '[&_.bg-background]:!bg-white',
        '[&_.bg-background/80]:!bg-white/80',
        // Force light theme
        '[&_.dark]:!bg-white [&_.dark]:!text-black',
        // Link handling
        '[&_a:not([class*="text-"]):not(button *)]:!text-black'
      )}>
        {children}
      </div>
  );
}