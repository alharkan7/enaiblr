'use client'

import Link from 'next/link';
import { apps } from '@/config/apps';
import AppsFooter from '@/components/apps-footer';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function Page() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="fixed top-4 right-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`
            w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-700
            relative transition-colors duration-500 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-primary
          `}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          <div
            className={`
              absolute top-1 left-1
              w-6 h-6 rounded-full
              transform transition-transform duration-500 ease-in-out
              flex items-center justify-center
              bg-white dark:bg-slate-800
              ${theme === 'dark' ? 'translate-x-8' : 'translate-x-0'}
            `}
          >
            <Sun className="h-4 w-4 text-yellow-500 absolute rotate-0 scale-100 transition-all duration-500 dark:rotate-90 dark:scale-0" />
            <Moon className="h-4 w-4 text-slate-300 absolute rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          </div>
          <span className="sr-only">Toggle theme</span>
        </button>
      </div>
      <main className="flex-1 container mx-auto px-4 pt-16 pb-8 flex items-center justify-center">
        <div className="w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold tracking-tighter mb-4 text-foreground">
              en<span className="text-primary">ai</span>blr
            </h1>
            <p className="text-muted-foreground">Unlimited AI Platform</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 max-w-6xl mx-auto">
            {apps.map((app) => {
              const Icon = app.icon
              return (
                <Link
                  key={app.slug}
                  href={`/${app.slug}`}
                  className="group relative flex flex-col items-center p-4 md:p-6 bg-card hover:bg-accent rounded-xl border border-border transition-colors"
                >
                  <div className="mb-3 md:mb-4 p-2 rounded-lg bg-muted group-hover:bg-accent-foreground/10 transition-colors">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h2 className="text-sm md:text-lg font-semibold text-center text-foreground">{app.name}</h2>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      <AppsFooter />
    </div>
  )
}