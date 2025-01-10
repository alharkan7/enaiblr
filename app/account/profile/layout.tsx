import '@/app/globals.css';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Account Settings',
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}