'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type SubscriptionPlan = 'free' | 'pro';

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!session?.user?.id) {
      setPlan('free');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscription');
      const data = await response.json();
      setPlan(data.plan);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      setPlan('free'); // Default to free on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [session?.user?.id]);

  useEffect(() => {
    // Check for subscription success in URL and refresh
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('subscription') === 'success') {
        refreshSubscription();
      }
    }
  }, []);

  const refreshSubscription = async () => {
    setIsLoading(true);
    await fetchSubscription();
  };

  return (
    <SubscriptionContext.Provider value={{ plan, isLoading, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
