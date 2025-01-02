'use client';

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button 
        className="w-16 h-8 rounded-full border border-black dark:border-white bg-slate-200 dark:bg-slate-700 relative"
        aria-label="Toggle theme"
      />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`
        w-16 h-8 rounded-full border border-black dark:border-white
        bg-slate-200 dark:bg-slate-700
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
  )
}
