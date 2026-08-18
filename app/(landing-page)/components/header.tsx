'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { BackstoryModal } from './backstory-modal';

export function LandingHeader({ backstoryContent }: { backstoryContent: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isBackstoryOpen, setIsBackstoryOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize from URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('backstory') === 'true' || params.has('backstory')) {
      setIsBackstoryOpen(true);
    }
  }, []);

  const openBackstory = () => {
    setIsBackstoryOpen(true);
    const url = new URL(window.location.href);
    url.searchParams.set('backstory', 'true');
    window.history.replaceState({}, '', url);
  };

  const closeBackstory = () => {
    setIsBackstoryOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('backstory');
    window.history.replaceState({}, '', url);
  };

  const toggleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const ThemeIcon = !mounted || theme === 'system' ? Laptop : theme === 'dark' ? Moon : Sun;

  return (
    <>
      <header className="relative z-10 shrink-0 px-5 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-8 sm:py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={openBackstory}
            className="hover:text-foreground border-b border-dotted border-muted-foreground hover:border-foreground transition-colors"
          >
            Backstory
          </button>
          
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            aria-label="Toggle theme"
          >
            <span>Theme</span>
            <ThemeIcon className="size-3" />
          </button>
        </div>
      </header>

      <BackstoryModal 
        isOpen={isBackstoryOpen} 
        onClose={closeBackstory} 
        content={backstoryContent} 
      />
    </>
  );
}
