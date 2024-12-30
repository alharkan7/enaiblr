'use client';

import * as React from 'react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Menu, X, Infinity as InfinityIcon, Search, MessageSquareDashed, Globe, Zap, WandSparkles, FileAudio, Speech, FileText } from 'lucide-react';
import { AppsGridUserNav } from '@/components/ui/apps-grid-user-nav';
import type { User } from 'next-auth';

const apps = [
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
];

interface AppsGridProps {
  trigger: React.ReactNode;
  user?: User;
}

export function AppsGrid({ trigger, user }: AppsGridProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end">
        <TooltipProvider>
          <div className="grid grid-cols-3 gap-2">
            {apps.map((app) => {
              const Icon = app.icon;
              const AppButton = (
                <Button
                  variant="ghost"
                  className="h-[92px] w-[92px] flex flex-col items-center justify-center gap-3 hover:bg-muted rounded-2xl"
                  asChild
                >
                  <Link href={`/${app.slug}`}>
                    <Icon className="w-12 h-12 text-foreground" />
                    <span className="text-xs font-medium truncate max-w-[80px]">{app.name}</span>
                  </Link>
                </Button>
              );

              return (
                <Tooltip key={app.slug} delayDuration={200}>
                  <TooltipTrigger asChild>
                    {AppButton}
                  </TooltipTrigger>
                  <TooltipContent>
                    {app.description || app.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
        {user && (
          <div className="mt-4 pt-4 border-t border-border">
            <AppsGridUserNav user={user} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}