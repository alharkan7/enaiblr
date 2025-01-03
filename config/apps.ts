import { FileAudio, FileText, Globe, InfinityIcon, MessageSquareDashed, Search, Speech, WandSparkles, Zap } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface AppConfig {
  name: string
  icon: LucideIcon
  slug: string
  description: string
  type: string
}

export const apps: AppConfig[] = [
  {
    name: 'Enaiblr AI',
    icon: InfinityIcon,
    slug: '',
    description: 'Unlimited AI Access & File Upload. Saved History & Foldering',
    type: 'pro'
  },
  {
    name: 'AI Search',
    icon: Search,
    slug: 'search',
    description: 'Find the Best AI Tools on the Internet',
    type: 'pro'
  },
  {
    name: 'Image Creator',
    icon: WandSparkles,
    slug: 'imagen',
    description: 'Create Unlimited Image in HD Quality & Limitless Styles',
    type: 'free'
  },
  {
    name: 'Doc Chat',
    icon: FileText,
    slug: 'filechat',
    description: 'Private Chat with Documents. No File Copy is Saved',
    type: 'free'
  },
  {
    name: 'Web Chat',
    icon: Globe,
    slug: 'web',
    description: 'Search Up-to-date Info from the Internet via Chat Interface',
    type: 'pro'
  },
  {
    name: 'Paper Flashcard',
    icon: Zap,
    slug: 'paper-flashcard',
    description: 'Turn any Science Paper into Flashcard for Easy Reading',
    type: 'free'
  },
  {
    name: 'Transcriber',
    icon: FileAudio,
    slug: 'transcribe',
    description: 'Turn Audio into Text; Useful for Interview Transcription',
    type: 'pro'
  },
  {
    name: 'Text to Voice',
    icon: Speech,
    slug: 'voice',
    description: 'Turn Any Text into Audio in Natural, Human-like Voice',
    type: 'pro'
  },
  {
    name: 'Incognito Chat',
    icon: MessageSquareDashed,
    slug: 'incognito',
    description: 'Private Chat with AI; No Text is Saved',
    type: 'free'
  },
]
