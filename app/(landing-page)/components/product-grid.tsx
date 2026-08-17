'use client';

import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import { products, type Product, type ProductId } from '../products';
import { GridParticles } from './grid-particles';
import { WaitlistDialog } from './waitlist-dialog';

export function ProductGrid({
  activeId,
  onActiveIdChange,
  waitlist,
  onWaitlistChange,
}: {
  activeId: ProductId | null;
  onActiveIdChange: (id: ProductId | null) => void;
  waitlist: Product | null;
  onWaitlistChange: (product: Product | null) => void;
}) {
  const mographRef = useRef<HTMLLIElement>(null);
  const leaveTimer = useRef<number>(0);

  useEffect(() => {
    if (!activeId) return;

    function onPointerDown(event: PointerEvent) {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('[data-product-card]')) return;
      if (event.pointerType === 'mouse') return;
      onActiveIdChange(null);
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [activeId, onActiveIdChange]);

  useEffect(() => {
    return () => window.clearTimeout(leaveTimer.current);
  }, []);

  function openProduct(product: Product) {
    if (product.href) {
      window.location.assign(product.href);
      return;
    }
    onWaitlistChange(product);
  }

  return (
    <div className="relative mt-5 md:mt-12">
      <GridParticles active={activeId === 'mograph'} targetRef={mographRef} />
      <ul className="relative z-10 flex flex-col gap-2 md:flex-row md:items-stretch md:gap-3">
        {products.map((product) => {
          const isActive = activeId === product.id;

          return (
            <li
              key={product.id}
              ref={product.id === 'mograph' ? mographRef : undefined}
              data-product-card=""
              className={cn(
                'min-w-0 transition-[flex] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:min-h-[240px]',
                isActive && 'md:flex-[2.1]',
                !isActive && activeId && 'md:flex-[0.75]',
                !activeId && 'md:flex-1',
              )}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'mouse') return;
                window.clearTimeout(leaveTimer.current);
                onActiveIdChange(product.id);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== 'mouse') return;
                window.clearTimeout(leaveTimer.current);
                leaveTimer.current = window.setTimeout(() => {
                  onActiveIdChange(null);
                }, 80);
              }}
            >
              <div
                className={cn(
                  'relative flex h-full w-full cursor-pointer flex-col rounded-md border border-border bg-background p-3.5 text-left outline-none transition-colors duration-500 md:p-6 md:pt-16',
                  isActive && 'text-white',
                )}
                style={isActive ? { backgroundColor: `var(--c-${product.id})` } : undefined}
                onPointerUp={(event) => {
                  if (event.pointerType === 'mouse') return;
                  if (event.target instanceof Element && event.target.closest('[data-arrow]')) {
                    return;
                  }
                  onActiveIdChange(isActive ? null : product.id);
                }}
              >
                {!product.href && (
                  <span
                    className={cn(
                      'absolute left-3.5 top-3.5 flex h-8 items-center text-xs tracking-wide transition-colors duration-500 md:left-4 md:top-4 md:h-10',
                      isActive ? 'text-white/65' : 'text-muted-foreground',
                    )}
                  >
                    Coming soon
                  </span>
                )}
                <button
                  type="button"
                  data-arrow=""
                  aria-label={
                    product.href ? `Open ${product.name}` : `Notify me about ${product.name}`
                  }
                  className={cn(
                    'absolute right-3.5 top-3.5 flex size-8 items-center justify-center rounded-full border border-current transition-transform duration-500 md:right-4 md:top-4 md:size-10',
                    isActive && 'translate-x-0.5 -translate-y-0.5',
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    openProduct(product);
                  }}
                >
                  <ArrowUpRight className="size-4 md:size-5" strokeWidth={1.75} />
                </button>
                <div className="mt-11 md:mt-auto">
                  <div
                    className={cn(
                      'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      isActive ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
                    )}
                  >
                    <div className="overflow-hidden">
                      <h2 className="pb-[0.18em] pr-12 text-2xl font-medium leading-none tracking-tight sm:text-4xl md:pr-2 md:text-5xl">
                        {product.name}
                      </h2>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-[0.12em] text-lg font-medium leading-snug tracking-tight sm:text-2xl md:text-3xl">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <WaitlistDialog product={waitlist} onClose={() => onWaitlistChange(null)} />
    </div>
  );
}
