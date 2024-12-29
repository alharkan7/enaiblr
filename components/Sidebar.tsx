'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { apps } from '@/config/apps'

// Module-level variable to persist across route changes
let hasShownSidebarInSession = false;

interface SidebarProps {
}

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // First useEffect for auto-opening on homepage
  useEffect(() => {
    if (pathname === '/' && !hasShownSidebarInSession) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        hasShownSidebarInSession = true;
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Second useEffect for handling click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        buttonRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-full p-2 bg-background border shadow-sm"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div
        ref={sidebarRef}
        className={cn(
          'fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-background border-r',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="space-y-2 mt-12">
            {apps.map((app) => {
              const Icon = app.icon
              const isActive = pathname === `/${app.slug}`
              return (
                <Link
                  key={app.slug}
                  href={`/${app.slug}`}
                  className={cn(
                    'flex items-center p-2 rounded-lg hover:bg-accent',
                    isActive && 'bg-accent outline outline-2 outline-blue-600'
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="ml-3">{app.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
