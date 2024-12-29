import '../globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat with PDF and Docs',
  description: 'Chat with any PDFs or Docs for Research and Analysis',
  openGraph: {
    title: 'Chat with PDF and Docs',
    description: 'Chat with any PDFs or Docs for Research and Analysis',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chat with PDF and Docs',
    description: 'Chat with any PDFs or Docs for Research and Analysis',
  }
}

export default function FilechatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}