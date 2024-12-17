'use client';

import { startTransition, useMemo, useOptimistic, useState, useEffect } from 'react';

import { saveModelId } from '@/app/(chat)/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { models } from '@/lib/ai/models';
import { cn } from '@/lib/utils';

import { CheckCircleFillIcon, ChevronDownIcon } from './icons';

export function ModelSelector({
  selectedModelId,
  className,
  disabled,
}: {
  selectedModelId: string;
  disabled?: boolean;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticModelId, setOptimisticModelId] = useState(selectedModelId);

  // Use useEffect to sync with localStorage
  useEffect(() => {
    const storedModelId = localStorage.getItem('model-id');
    if (storedModelId) {
      setOptimisticModelId(storedModelId);
    }
  }, []);

  const selectedModel = useMemo(
    () => models.find((model) => model.id === optimisticModelId),
    [optimisticModelId],
  );

  const handleModelChange = (modelId: string) => {
    setOpen(false);
    setOptimisticModelId(modelId);
    localStorage.setItem('model-id', modelId);
    startTransition(() => {
      saveModelId(modelId);
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        disabled={disabled}
      >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a model"
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          {selectedModel?.label}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[100px]">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => handleModelChange(model.id)}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={model.id === optimisticModelId}
          >
            <div className="flex flex-col gap-1 items-start">
              {model.label}
              {model.description && (
                <div className="text-xs text-muted-foreground">
                  {model.description}
                </div>
              )}
            </div>
            <div className="text-primary dark:text-primary-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCircleFillIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
