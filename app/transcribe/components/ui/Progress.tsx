import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

export function Progress({ value }: { value: number }) {
  return (
    <ProgressPrimitive.Root
      className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200"
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-blue-600 transition-all"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}