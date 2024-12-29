'use client';

import * as React from 'react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Menu, X, Search, MessageSquareDashed, Globe, Zap, WandSparkles, FileAudio, Speech, FileText } from 'lucide-react';

const apps = [
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
    name: 'Swipe Paper',
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
}

export function AppsGrid({ trigger }: AppsGridProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end">
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
                  <Icon className="size-8 text-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">{app.name}</span>
                </Link>
              </Button>
            );

            return app.description ? (
              <Tooltip key={app.slug}>
                <TooltipTrigger asChild>
                  {AppButton}
                </TooltipTrigger>
                <TooltipContent>{app.description}</TooltipContent>
              </Tooltip>
            ) : (
              <div key={app.slug}>{AppButton}</div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}