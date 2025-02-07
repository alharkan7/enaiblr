'use client';
import { ChevronDown, CircleUserRound, Sun, Moon, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import type { User } from 'next-auth';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';


export function DashboardSidebarUserNav({ user, collapsed }: { user: User; collapsed?: boolean }) {
  const { setTheme, theme } = useTheme();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={`h-10 w-full justify-start gap-2 ${collapsed ? 'px-2' : ''}`}>
            <Image
              src={user.image || `https://avatar.vercel.sh/${user.email}`}
              alt={user.email ?? 'User Avatar'}
              width={24}
              height={24}
              className="rounded-full"
            />
            {!collapsed && (
              <>
                <span className="truncate">{user?.email}</span>
                <ChevronDown className="ml-auto size-4" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-full min-w-[200px]"
        >
          <DropdownMenuItem asChild>
            <Link
              href="/account/profile"
              className="w-full cursor-pointer flex items-center gap-2"
            >
              <CircleUserRound className="h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer flex items-center gap-2"
            onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {`${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href="mailto:mail@enaiblr.org"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full cursor-pointer flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Contact Help
            </a>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
