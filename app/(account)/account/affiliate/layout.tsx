import '@/app/globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate',
  description: 'Affiliate',
}

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}