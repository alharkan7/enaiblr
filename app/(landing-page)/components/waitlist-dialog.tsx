'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { LogoGoogle } from '@/components/icons';

export const LAUNCH_NOTIFY_KEY = 'launchNotify';

export function registeredToast(name: string) {
  toast(`You're on the list`, {
    description: `We'll notify you when ${name} launches.`,
  });
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
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-border bg-background p-6 md:rounded-2xl md:p-8 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          <div className="flex items-center justify-between gap-4">
            <DialogPrimitive.Title className="text-2xl font-medium leading-tight tracking-tight">
              Sign up to get notified
            </DialogPrimitive.Title>
            <DialogPrimitive.Close className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-border text-muted-foreground transition-colors hover:text-foreground">
              <X className="size-4" strokeWidth={1.75} />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="sr-only">
            Create an account to get notified when {product?.name} launches.
          </DialogPrimitive.Description>
          <button
            type="button"
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-background text-sm font-medium tracking-tight transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
            disabled={status === 'loading'}
            onClick={() => {
              if (!product) return;
              if (status === 'authenticated') {
                registeredToast(product.name);
                onClose();
                return;
              }
              sessionStorage.setItem(LAUNCH_NOTIFY_KEY, product.name);
              const callbackUrl = `/?waitlist=${encodeURIComponent(product.name)}`;
              signIn('google', { callbackUrl });
            }}
          >
            <LogoGoogle size={16} />
            Continue with Google
          </button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
