import { FileAudio, FileText, Globe, InfinityIcon, MessageSquareDashed, Search, Speech, WandSparkles, Zap } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface AppConfig {
  name: string
  icon: LucideIcon
  slug: string
  description: string
}

export const apps: AppConfig[] = [
  {
    name: 'Enaiblr AI',
    icon: InfinityIcon,
    slug: '',
    description: ''
  },
  {
    name: 'AI Search',
    icon: Search,
    slug: 'search',
    description: ''
  },
  {
    name: 'Image Creator',
    icon: WandSparkles,
    slug: 'imagen',
    description: ''
  },
  {
    name: 'Doc Chat',
    icon: FileText,
    slug: 'filechat',
    description: ''
  },
  {
    name: 'Web Chat',
    icon: Globe,
    slug: 'web',
    description: ''
  },
  {
    name: 'Paper Flashcard',
    icon: Zap,
    slug: 'paper-flashcard',
    description: ''
  },
  {
    name: 'Transcriber',
    icon: FileAudio,
    slug: 'transcribe',
    description: ''
  },
  {
    name: 'Text to Voice',
    icon: Speech,
    slug: 'voice',
    description: ''
  },
  {
    name: 'Incognito Chat',
    icon: MessageSquareDashed,
    slug: 'incognito',
    description: ''
  },
]
