import '../globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Search AI',
  description: 'Chat with the Web for accurate and up-to-date information.',
  openGraph: {
    title: 'Web Search AI',
    description: 'Chat with the Web for accurate and up-to-date information.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Search AI',
    description: 'Chat with the Web for accurate and up-to-date information.',
  }
}

export default function WebSearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}