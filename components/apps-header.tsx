'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { AppGridIcon } from './icons';
import { AppsGrid } from './ui/apps-grid';

interface AppsHeaderProps {
  title?: React.ReactNode;
  leftButton?: React.ReactNode;
}

export function AppsHeader({ title, leftButton }: AppsHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 bg-background py-1.5 px-2 md:px-2">
      <div className="relative flex items-center max-w-4xl mx-auto">
        {leftButton && (
          <div className="absolute left-0">
            {leftButton}
          </div>
        )}
        {title ? (
          <>
            <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
              <div className="text-xl font-semibold">
                {title}
              </div>
            </div>
            <div className="ml-auto">
              <AppsGrid
                trigger={
                  <Button
                    variant="outline"
                    className="md:px-2 px-2 md:h-fit"
                  >
                    <AppGridIcon size={14} />
                    <span className="hidden md:inline ml-2">Apps</span>
                  </Button>
                }
                user={session?.user}
              />
            </div>
          </>
        ) : (
          <div className="ml-auto">
            <AppsGrid
              trigger={
                <Button
                  variant="outline"
                  className="md:px-2 px-2 md:h-fit"
                >
                  <AppGridIcon size={14} />
                  <span className="hidden md:inline ml-2">Apps</span>
                </Button>
              }
              user={session?.user}
            />
          </div>
        )}
      </div>
    </header>
  );
}
