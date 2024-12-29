import '../globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Voice Creator',
  description: 'Turn Any Text into Human Voice with High Fidelity and Fast Processing',
  openGraph: {
    title: 'AI Voice Creator',
    description: 'Turn Any Text into Human Voice with High Fidelity and Fast Processing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Voice Creator',
    description: 'Turn Any Text into Human Voice with High Fidelity and Fast Processing',
  }
}

export default function VoiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}