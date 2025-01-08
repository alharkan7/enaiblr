'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { AppsGridUserNav } from '@/components/ui/apps-grid-user-nav';
import type { User } from 'next-auth';
import { apps } from '@/config/apps';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/contexts/subscription-context';

interface AppsGridProps {
  trigger: React.ReactNode;
  user?: User;
  useHardReload?: boolean;
}

export function AppsGrid({ trigger, user, useHardReload = false }: AppsGridProps) {
  const router = useRouter();
  const { plan } = useSubscription();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showTooltips, setShowTooltips] = React.useState(false);

  const handleAppClick = (type: 'free' | 'pro', slug: string) => {
    if (useHardReload) {
      window.location.href = `/${slug}`;
    } else {
      router.push(`/${slug}`, { scroll: false });
    }
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      // Delay enabling tooltips to prevent them from showing immediately when popover opens
      const timer = setTimeout(() => setShowTooltips(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowTooltips(false);
    }
  }, [isOpen]);

  return (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-4" align="end" onPointerDownOutside={(e: Event) => {
          // Prevent closing when clicking inside the popover
          if (e.target instanceof Element && e.target.closest('.apps-grid-content')) {
            e.preventDefault();
          }
        }}>
          <div className="apps-grid-content grid grid-cols-3 gap-2">
            {apps.map((app) => {
              const Icon = app.icon;
              return (
                <Tooltip key={app.slug}>
                  <TooltipTrigger asChild disabled={!showTooltips}>
                    <Button
                      variant="ghost"
                      className="relative h-[92px] w-[92px] flex flex-col items-center justify-center gap-3 hover:bg-muted rounded-2xl"
                      onClick={() => handleAppClick(app.type, app.slug)}
                    >
                      {app.type === 'pro' && plan === 'free' && (
                        <span className="absolute top-0 right-1 text-[7px] font-medium text-primary bg-primary/10 rounded-lg px-1">
                          PRO
                        </span>
                      )}
                      <Icon className="size-12 text-foreground" />
                      <span className="text-xs font-medium truncate max-w-[80px]">{app.name}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {app.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          {user && (
            <div className="mt-4 pt-4 border-t border-border">
              <AppsGridUserNav user={user} isPro={apps.some(app => app.type === 'pro')} />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
