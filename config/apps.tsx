import { Search, MessageSquare, Globe, Zap, BookOpen, Wallet, FlaskConical, WandSparkles, FileAudio, Speech, FileText } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface AppConfig {
  name: string
  icon: LucideIcon
  slug: string
}

export const apps: AppConfig[] = [
  { name: 'AI Tools Search', icon: Search, slug: 'search' },
  { name: 'Disposable AI Chat', icon: MessageSquare, slug: 'incognito' },
  { name: 'Image Creator', icon: WandSparkles, slug: 'imagen' },
  { name: 'Chat with Docs', icon: FileText, slug: 'filechat' },
  { name: 'Web Chat', icon: Globe, slug: 'web' },
  { name: 'Paper to Flashcard', icon: Zap, slug: 'paper-flashcard' },
  { name: 'Audio Transcription', icon: FileAudio, slug: 'transcribe' },
  { name: 'Text to Voice', icon: Speech, slug: 'voice' },
]
