import { Hammer, FileAudio, FileText, Globe, InfinityIcon, MessageSquareDashed, Search, Speech, WandSparkles, Zap, LucideIcon } from 'lucide-react'

export interface AppConfig {
  name: string
  icon: LucideIcon
  slug: string
  description: string
  type: 'free' | 'pro'
}

export const apps: AppConfig[] = [
  {
    name: 'Unlimited AI Chat',
    icon: InfinityIcon,
    slug: 'chat',
    description: 'Unlimited AI Access & File Upload. Saved History & Foldering',
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
    name: 'AI Tools Search',
    icon: Search,
    slug: 'search',
    description: 'Find the Best AI Tools on the Internet',
    type: 'pro'
  },
  {
    name: 'Private PDF Chat',
    icon: FileText,
    slug: 'filechat',
    description: 'Private Chat with Documents. No File Copy is Saved',
    type: 'free'
  },
  {
    name: 'Incognito Chat',
    icon: MessageSquareDashed,
    slug: 'incognito',
    description: 'Private Chat with AI; No Text is Saved',
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
    name: 'Audio Transcriber',
    icon: FileAudio,
    slug: 'transcribe',
    description: 'Turn Audio into Text; Useful for Interview Transcription',
    type: 'pro'
  },
  {
    name: 'Natural AI Voice',
    icon: Speech,
    slug: 'voice',
    description: 'Turn Any Text into Audio in Natural, Human-like Voice',
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
    name: 'More Apps',
    icon: Hammer,
    slug: 'tools',
    description: 'Explore More Free Apps to Play or Be Productive',
    type: 'free'
  }
]
