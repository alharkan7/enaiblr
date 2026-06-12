import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Japanese Flashcards',
  description: 'Simple Japanese Hiragana & Katakana Flashcards',
}

export default function JapaneseFlashcardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}