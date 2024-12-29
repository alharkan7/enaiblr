import { Inter } from 'next/font/google';
import '@/app/globals.css';
import './styles/animations.css';
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Paper to Flashcards',
  description: 'Turn any Science Paper PDF into Flashcards for Quick Learning and Easy Understanding',
  openGraph: {
    title: 'Paper to Flashcards',
    description: 'Turn any Science Paper PDF into Flashcards for Quick Learning and Easy Understanding',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paper to Flashcards',
    description: 'Turn any Science Paper PDF into Flashcards for Quick Learning and Easy Understanding',
  }
};

export default function PaperFlashcardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className={`${inter.className} min-h-screen bg-gradient-to-r from-blue-100 to-white`}>
        {children}
      </div>
  );
}