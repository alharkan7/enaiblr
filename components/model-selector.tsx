'use client';

import { startTransition, useMemo, useOptimistic, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSubscription } from '@/contexts/subscription-context';
import { InfinityIcon } from 'lucide-react';

import { saveModelId } from '@/app/(chat)/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { models } from '@/lib/ai/models';
import { cn } from '@/lib/utils';

import { CheckCircleFillIcon, ChevronDownIcon } from './icons';

export function ModelSelector({
  selectedModelId,
  className,
}: {
  selectedModelId: string;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { plan } = useSubscription();
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId);

  const selectedModel = useMemo(
    () => models.find((model) => model.id === optimisticModelId),
    [optimisticModelId],
  );

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          asChild
          className={cn(
            'w-auto data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
            className,
          )}
        >
          <Button variant="outline" className="md:px-2 md:h-[34px]">
            {selectedModel?.label}
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-auto">
          {models.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onClick={async () => {
                startTransition(async () => {
                  setOptimisticModelId(model.id);
                  await saveModelId(model.id);
                  setOpen(false);

                  if (pathname !== '/chat') {
                    router.push('/chat');
                    router.refresh();
                  }
                });
              }}
              className={cn(
                'flex items-center justify-between relative',
                model.id === optimisticModelId && 'bg-accent'
              )}
            >
              <div className="flex flex-col gap-1 items-start">
                {model.label}
                {model.description && (
                  <div className="text-xs text-muted-foreground">
                    {model.description}
                  </div>
                )}
              </div>
              
              {model.id === optimisticModelId && (
                <div className="text-foreground dark:text-foreground">
                  <CheckCircleFillIcon />
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
            <AlertDialogDescription>
              This model is only available to Pro users. Upgrade now to unlock all pro models and features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              router.push('/payment');
              setShowUpgradeDialog(false);
            }}>
              Upgrade to Pro
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
