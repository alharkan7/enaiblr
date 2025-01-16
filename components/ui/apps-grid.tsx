'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { AppsGridUserNav } from '@/components/ui/apps-grid-user-nav';
import type { User } from 'next-auth';
import { apps, type AppConfig } from '@/config/apps';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/contexts/subscription-context';
import { LayoutGrid } from 'lucide-react';

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
  const [isLoaded, setIsLoaded] = React.useState(false);

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
      // Reduced delay for better responsiveness
      const timer = setTimeout(() => setShowTooltips(true), 0);
      return () => clearTimeout(timer);
    } else {
      setShowTooltips(false);
    }
  }, [isOpen]);

  // Mark as loaded on mount
  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <TooltipProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent 
          className="w-[320px] p-2" 
          align="end" 
          onPointerDownOutside={(e: Event) => {
            if (e.target instanceof Element && e.target.closest('.apps-grid-content')) {
              e.preventDefault();
            }
          }}
          // Add a fade-in animation
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.15s ease-in-out'
          }}
        >
          <div className="apps-grid-content grid grid-cols-3 max-h-[310px] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
            {[{
              icon: LayoutGrid,
              name: 'Home',
              slug: 'apps',
              type: 'free' as const,
              description: 'Return to Apps Home'
            } satisfies AppConfig, ...apps].map((app) => {
              const Icon = app.icon;
              return (
                <Tooltip key={app.slug}>
                  <TooltipTrigger asChild disabled={!showTooltips}>
                    <Button
                      variant="ghost"
                      className="relative h-[100px] w-[100px] flex flex-col items-center justify-center gap-3 hover:bg-muted rounded-2xl"
                      onClick={() => handleAppClick(app.type, app.slug)}
                    >
                      {/* {app.type === 'pro' && plan === 'free' && (
                        <span className="absolute top-0 right-1 text-[7px] font-medium text-primary bg-primary/10 rounded-lg px-1">
                          PRO
                        </span>
                      )} */}
                      <Icon className="size-12 text-foreground" />
                      <div className="w-full h-8 flex items-start">
                        <span className="text-xs font-medium line-clamp-2 text-center whitespace-normal break-words w-full">{app.name}</span>
                      </div>
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
            <div className="mt-2 pt-2 border-t border-border">
              <AppsGridUserNav user={user} isPro={apps.some(app => app.type === 'pro')} />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
