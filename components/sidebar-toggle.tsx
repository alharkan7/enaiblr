import type { ComponentProps } from 'react';

import { type SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

import { SidebarLeftIcon } from './icons';
import { Button } from './ui/button';

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const button = (
    <Button
      onClick={toggleSidebar}
      variant="outline"
      className="md:px-2 md:h-fit"
    >
      <SidebarLeftIcon size={16} />
    </Button>
  );

  // Don't render tooltip on mobile to avoid touch event delays
  if (isMobile) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {button}
      </TooltipTrigger>
      <TooltipContent align="start">Toggle Sidebar</TooltipContent>
    </Tooltip>
  );
}
