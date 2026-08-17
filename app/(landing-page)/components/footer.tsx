'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function LandingFooter() {
  const year = new Date().getFullYear();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <footer className="relative z-10 shrink-0 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 text-xs text-muted-foreground">
        <a href="mailto:mail@enaiblr.org" className="hover:text-foreground">
          mail@enaiblr.org
        </a>
        <p>© {year} enaiblr</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="hover:text-foreground"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {mounted ? (isDark ? 'Light' : 'Dark') : 'Theme'}
          </button>
          <span aria-hidden>|</span>
          <a
            href="https://apps.raihankalla.id"
            className="hover:text-foreground"
          >
            Apps
          </a>
        </div>
      </div>
    </footer>
  );
}
