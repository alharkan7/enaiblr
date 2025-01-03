'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/contexts/subscription-context';

export function ProGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { plan, isLoading } = useSubscription();

  useEffect(() => {
    // Only redirect after subscription status is loaded
    if (!isLoading && plan === 'free') {
      // Redirect to apps page with error
      const redirectUrl = new URL('/apps', window.location.href);
      redirectUrl.searchParams.set('error', 'pro_required');
      router.replace(redirectUrl.toString());
    }
  }, [plan, isLoading, router]);

  // Show nothing while loading or if user is free (will be redirected)
  if (isLoading || plan === 'free') {
    return null;
  }

  // Show content only to pro users
  return <>{children}</>;
}
