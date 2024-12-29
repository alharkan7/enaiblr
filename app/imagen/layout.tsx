import '../globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Image Creator',
  description: 'Free AI HD Image Creator. No Limits but Limitless Styles. Custom Resolution. Visualize Your Imagination Now.',
  openGraph: {
    title: 'AI Image Creator',
    description: 'Free AI HD Image Creator. No Limits but Limitless Styles. Custom Resolution. Visualize Your Imagination Now.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Image Creator',
    description: 'Free AI HD Image Creator. No Limits but Limitless Styles. Custom Resolution. Visualize Your Imagination Now.',
  }
}

export default function ImagenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}