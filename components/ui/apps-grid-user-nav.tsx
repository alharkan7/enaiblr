'use client';
import { ChevronDown, ArrowRight, CircleUserRound, CircleHelp, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import type { User } from 'next-auth';
import { useTheme } from 'next-themes';
import { useSubscription } from '@/contexts/subscription-context';
import Link from 'next/link';
import { WhatsAppIcon } from '../icons';
import { MessageSquare } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';

export function AppsGridUserNav({ user, isPro = false }: { user: User; isPro?: boolean }) {
  const { setTheme, theme } = useTheme();
  const { plan } = useSubscription();
  const router = useRouter();

  return (
    <div>
      {plan === 'free' && (
        <>
          <Button
            variant="ghost"
            className="outline outline-primary outline-1 h-10 w-full justify-start gap-2 text-primary hover:text-primary"
            onClick={() => router.push('/payment')}
          >
            <Image
              src="/favicon.ico"
              alt="Enaiblr Logo"
              width={24}
              height={24}
              className="rounded-lg"
            />
            <span>Get Enaiblr Pro</span>
            <ArrowRight className="ml-auto size-4" />
          </Button>
          <DropdownMenuSeparator className="mb-1 mt-2" />
        </>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 w-full justify-start gap-2">
            <Image
              src={user.image || `https://avatar.vercel.sh/${user.email}`}
              alt={user.email ?? 'User Avatar'}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="truncate">{user?.email}</span>
            <ChevronDown className="ml-auto size-4" />
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
