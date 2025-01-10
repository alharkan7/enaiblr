'use client';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import type { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useSubscription } from '@/contexts/subscription-context';

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
              className="rounded-full"
            />
            <span>Get Enaiblr Pro</span>
            <ArrowRight className="ml-auto size-4" />
          </Button>
          <DropdownMenuSeparator className="mb-1 mt-2"/>
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
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {`${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild 
          // disabled={isPro && plan === 'free'}
          >
            <a
              href="https://wa.me/+6281280077690"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full cursor-pointer"
            >
              Contact Help
              {/* {isPro && plan === 'free' && (
                <span className="absolute right-2 text-[7px] font-medium text-primary bg-primary/10 rounded-lg px-1">
                  PRO
                </span>
              )} */}
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <button
              type="button"
              className="w-full cursor-pointer"
              onClick={() => {
                signOut({
                  callbackUrl: '/apps',
                  redirect: true
                });
              }}
            >
              Sign Out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
