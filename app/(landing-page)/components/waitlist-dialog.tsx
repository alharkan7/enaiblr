'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const LAUNCH_NOTIFY_KEY = 'launchNotify';

export function registeredToast(name: string) {
  toast.success(`You're registered. We'll notify you when ${name} launches.`);
}

export function WaitlistDialog({
  product,
  onClose,
}: {
  product: { name: string } | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const { status } = useSession();

  return (
    <DialogPrimitive.Root
      open={product !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-background p-6 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <DialogPrimitive.Title className="pr-10 text-2xl font-medium leading-tight tracking-tight">
            Sign up to get notified
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Create an account to get notified when {product?.name} launches.
          </DialogPrimitive.Description>
          <button
            type="button"
            className="mt-6 h-11 w-full rounded-md border border-border bg-background text-sm font-medium tracking-tight transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
            disabled={status === 'loading'}
            onClick={() => {
              if (!product) return;
              if (status === 'authenticated') {
                registeredToast(product.name);
                onClose();
                return;
              }
              sessionStorage.setItem(LAUNCH_NOTIFY_KEY, product.name);
              router.push('/login?callbackUrl=/');
            }}
          >
            Continue
          </button>
          <DialogPrimitive.Close className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground">
            <X className="size-4" strokeWidth={1.75} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
