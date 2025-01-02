'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { AppsGridUserNav } from '@/components/ui/apps-grid-user-nav';
import type { User } from 'next-auth';
import { apps } from '@/config/apps';

interface AppsGridProps {
  trigger: React.ReactNode;
  user?: User;
}

export function AppsGrid({ trigger, user }: AppsGridProps) {
  const handleAppClick = (slug: string) => {
    window.location.href = `/${slug}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end" onPointerDownOutside={(e) => {
        // Prevent closing when clicking inside the popover
        if (e.target instanceof Element && e.target.closest('.apps-grid-content')) {
          e.preventDefault();
        }
      }}>
        <TooltipProvider>
          <div className="apps-grid-content grid grid-cols-3 gap-2">
            {apps.map((app) => {
              const Icon = app.icon;
              const AppButton = (
                <Button
                  variant="ghost"
                  className="h-[92px] w-[92px] flex flex-col items-center justify-center gap-3 hover:bg-muted rounded-2xl"
                  onClick={() => handleAppClick(app.slug)}
                >
                  <Icon className="size-12 text-foreground" />
                  <span className="text-xs font-medium truncate max-w-[80px]">{app.name}</span>
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