'use client';

import type { User } from 'next-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useSWRConfig } from 'swr';

import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { mutate } = useSWRConfig();
  const pathname = usePathname();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/apps"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold pl-0 hover:bg-muted rounded-md cursor-pointer">
                Enaiblr
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit hidden md:flex"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/chat');
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end" side="bottom">New Chat</TooltipContent>
            </Tooltip>
            <Button
              variant="ghost"
              type="button"
              className="p-2 h-fit md:hidden"
              onClick={() => {
                setOpenMobile(false);
                router.push('/chat');
                router.refresh();
              }}
            >
              <PlusIcon />
            </Button>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>
        {/* {user && <SidebarUserNav user={user} />} */}
      </SidebarFooter>
    </Sidebar>
  );
}
