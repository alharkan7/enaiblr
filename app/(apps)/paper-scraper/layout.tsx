import '@/app/globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paper Scraper',
  description: 'Science Paper Web Scraper with Advanced Filters',
  openGraph: {
    title: 'Paper Scraper',
    description: 'Science Paper Web Scraper with Advanced Filters',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paper Scraper',
    description: 'Science Paper Web Scraper with Advanced Filters',
  }
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}