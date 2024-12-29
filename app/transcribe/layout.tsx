import '../globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Audio Transcriber',
  description: 'Transcribe Any Audio into Text with High Accuracy and Speed',
  openGraph: {
    title: 'AI Audio Transcriber',
    description: 'Transcribe Any Audio into Text with High Accuracy and Speed',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Audio Transcriber',
    description: 'Transcribe Any Audio into Text with High Accuracy and Speed',
  }
}

export default function TranscribeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}