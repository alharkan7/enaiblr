'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { type Product, type ProductId } from '../products';
import { HeroLine } from './hero-line';
import { ProductGrid } from './product-grid';
import { LAUNCH_NOTIFY_KEY, registeredToast } from './waitlist-dialog';

export function LandingView() {
  const [activeId, setActiveId] = useState<ProductId | null>(null);
  const [waitlist, setWaitlist] = useState<Product | null>(null);
  const { status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return;

    // 1. Check URL parameters (most robust after OAuth/auth redirects)
    const params = new URLSearchParams(window.location.search);
    const waitlistParam = params.get('waitlist');
    
    if (waitlistParam) {
      setTimeout(() => {
        registeredToast(waitlistParam);
      }, 300);
      // Clean up the URL parameter cleanly without a page reload
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }

    // 2. Fallback to sessionStorage for local transitions
    const name = sessionStorage.getItem(LAUNCH_NOTIFY_KEY);
    if (!name) return;
    sessionStorage.removeItem(LAUNCH_NOTIFY_KEY);
    setTimeout(() => {
      registeredToast(name);
    }, 300);
  }, [status]);

  return (
    <div className="flex flex-1 min-h-0 flex-col justify-center md:flex-none md:min-h-fit md:justify-start">
      <HeroLine activeId={activeId} />
      <ProductGrid
        activeId={activeId}
        onActiveIdChange={setActiveId}
        waitlist={waitlist}
        onWaitlistChange={setWaitlist}
      />
    </div>
  );
}
