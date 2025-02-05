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
  const [lastSuccessfulPlan, setLastSuccessfulPlan] = useState<SubscriptionPlan | null>(null);

  const fetchSubscription = async () => {
    if (!session?.user?.id) {
      setPlan('free');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscription');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Update both current and last successful plan
      setPlan(data.plan);
      setLastSuccessfulPlan(data.plan);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      
      // Only default to free if we've never successfully fetched a plan
      // Otherwise keep the last known good plan
      if (lastSuccessfulPlan) {
        setPlan(lastSuccessfulPlan);
      } else {
        setPlan('free');
      }
      
      // Retry after 30 seconds on error
      setTimeout(() => {
        fetchSubscription();
      }, 30000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
    
    // Set up periodic refresh every 5 minutes
    const intervalId = setInterval(() => {
      fetchSubscription();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
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
