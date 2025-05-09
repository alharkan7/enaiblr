import '@/app/globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Chat',
  description: 'Free AI Chat without Limits. Chat with Images.',
  openGraph: {
    title: 'AI Chat',
    description: 'Free AI Chat without Limits. Chat with Images.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chat',
    description: 'Free AI Chat without Limits. Chat with Images.',
  }
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}