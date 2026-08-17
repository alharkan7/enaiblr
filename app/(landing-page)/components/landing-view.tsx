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
    const name = sessionStorage.getItem(LAUNCH_NOTIFY_KEY);
    if (!name) return;
    sessionStorage.removeItem(LAUNCH_NOTIFY_KEY);
    registeredToast(name);
  }, [status]);

  return (
    <div className="flex flex-col">
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
