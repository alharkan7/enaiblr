'use client';

import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useMemo } from 'react';

import { cn } from '@/lib/utils';

import { products, type Product, type ProductId } from '../products';
import { GridParticles } from './grid-particles';
import { GridLines } from './grid-lines';
import { GridShapes } from './grid-shapes';
import { WaitlistDialog } from './waitlist-dialog';

function useVirtualRef(desktopRef: React.RefObject<HTMLElement | null>, mobileRef: React.RefObject<HTMLElement | null>) {
  return useMemo(
    () =>
      ({
        get current() {
          const d = desktopRef.current;
          if (d && d.offsetParent !== null) return d;
          const m = mobileRef.current;
          if (m && m.offsetParent !== null) return m;
          return null;
        },
      }) as unknown as React.RefObject<HTMLElement>,
    [desktopRef, mobileRef],
  );
}

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
  const mographDesktopRef = useRef<HTMLLIElement>(null);
  const mographMobileRef = useRef<HTMLButtonElement>(null);
  const beeblioDesktopRef = useRef<HTMLLIElement>(null);
  const beeblioMobileRef = useRef<HTMLButtonElement>(null);
  const bibieDesktopRef = useRef<HTMLLIElement>(null);
  const bibieMobileRef = useRef<HTMLButtonElement>(null);

  const mographRef = useVirtualRef(mographDesktopRef, mographMobileRef);
  const beeblioRef = useVirtualRef(beeblioDesktopRef, beeblioMobileRef);
  const bibieRef = useVirtualRef(bibieDesktopRef, bibieMobileRef);

  const leaveTimer = useRef<number>(0);



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
      <GridLines active={activeId === 'beeblio'} targetRef={beeblioRef} />
      <GridShapes active={activeId === 'untitled'} targetRef={bibieRef} />

      {/* --- Mobile Layout (Tabs) --- */}
      <div className="relative z-10 flex flex-col md:hidden" data-product-card="">
        {/* Tabs Row */}
        <div className="relative z-10 flex w-full flex-wrap gap-2 sm:gap-4 -ml-3">
          {products.map((product) => {
            const isActive = activeId === product.id;
            return (
              <button
                key={product.id}
                ref={
                  product.id === 'mograph'
                    ? mographMobileRef
                    : product.id === 'beeblio'
                    ? beeblioMobileRef
                    : bibieMobileRef
                }
                onClick={() => {
                  onActiveIdChange(isActive ? null : product.id);
                }}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-1.5 text-base font-medium transition-colors outline-none',
                  isActive ? 'text-white' : 'text-foreground hover:text-[var(--tab-hover-color)]'
                )}
                style={{ '--tab-hover-color': `var(--c-${product.id})` } as React.CSSProperties}
              >
                {/* Connected Background overlapping the gap */}
                <div
                  className={cn(
                    'absolute inset-0 -bottom-2 -z-10 rounded-t-2xl transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    isActive ? 'opacity-100' : 'opacity-0'
                  )}
                  style={{ backgroundColor: `var(--c-${product.id})` }}
                >
                  {/* Left Inverted Curve (skip for Mograph since it's flush left) */}
                  {product.id !== 'mograph' && (
                    <div
                      className="absolute -left-3 bottom-0 h-3 w-3 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at top left, transparent 12px, var(--c-${product.id}) 12.5px)`,
                      }}
                    />
                  )}
                  {/* Right Inverted Curve */}
                  <div
                    className="absolute -right-3 bottom-0 h-3 w-3 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, transparent 12px, var(--c-${product.id}) 12.5px)`,
                    }}
                  />
                </div>
                <span>{product.name}</span>
                <ArrowUpRight className="size-4" strokeWidth={1.75} />
              </button>
            );
          })}
        </div>

        {/* Content Box Stack */}
        <div className="relative z-0 mt-2 grid -mx-3">
          {products.map((product) => {
            const isActive = activeId === product.id;
            return (
              <div
                key={`box-${product.id}`}
                className={cn(
                  'col-start-1 row-start-1 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  product.id === 'mograph' ? 'rounded-3xl rounded-tl-none' : 'rounded-3xl',
                  isActive
                    ? 'grid grid-rows-[1fr] opacity-100 shadow-xl z-10 pointer-events-auto'
                    : 'grid grid-rows-[0fr] opacity-0 z-0 pointer-events-none'
                )}
                style={{ backgroundColor: `var(--c-${product.id})` }}
              >
                <div className="min-h-0">
                  <div
                    className="flex h-full cursor-pointer flex-col px-3 py-6 pt-8 text-white outline-none"
                    onClick={() => openProduct(product)}
                  >
                    <p className="text-xl font-medium leading-snug tracking-tight opacity-90 sm:text-2xl">
                      {product.description}
                    </p>
                    <div className="mt-8 flex w-full items-center justify-start">
                      {product.statusText ? (
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm tracking-wide text-white/80 pointer-events-none">
                            {product.statusText}
                          </span>
                          <span className="text-sm text-white/40 pointer-events-none">|</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openProduct(product);
                            }}
                            className="text-sm font-medium tracking-wide outline-none hover:opacity-80 transition-opacity underline decoration-dotted underline-offset-4"
                          >
                            {product.actionText}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProduct(product);
                          }}
                          className="text-sm font-medium tracking-wide outline-none hover:opacity-80 transition-opacity underline decoration-dotted underline-offset-4"
                        >
                          {product.actionText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Desktop Layout --- */}
      <ul className="relative z-10 hidden flex-row items-stretch gap-3 md:flex">
        {products.map((product) => {
          const isActive = activeId === product.id;

          return (
            <li
              key={product.id}
              ref={
                product.id === 'mograph'
                  ? mographDesktopRef
                  : product.id === 'beeblio'
                  ? beeblioDesktopRef
                  : bibieDesktopRef
              }
              data-product-card=""
              className={cn(
                'min-w-0 transition-[flex-grow,flex-basis] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] min-h-[240px]',
                isActive && 'flex-[2.1]',
                !isActive && activeId && 'flex-[0.75]',
                !activeId && 'flex-1',
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
                  'relative flex h-full w-full cursor-pointer flex-col rounded-2xl border-2 border-border bg-background p-6 pt-16 text-left outline-none transition-all duration-500',
                  isActive && 'text-white border-transparent',
                )}
                style={isActive ? { backgroundColor: `var(--c-${product.id})` } : undefined}
                onPointerUp={(event) => {
                  if (event.target instanceof Element && event.target.closest('[data-arrow]')) {
                    return;
                  }
                  if (event.pointerType === 'mouse') {
                    openProduct(product);
                    return;
                  }
                  onActiveIdChange(isActive ? null : product.id);
                }}
              >
                {product.statusText && (
                  <span
                    className={cn(
                      'absolute left-6 top-6 flex h-10 items-center text-xs tracking-wide transition-colors duration-500',
                      isActive ? 'text-white/65' : 'text-muted-foreground',
                    )}
                  >
                    {product.statusText}
                  </span>
                )}
                <button
                  type="button"
                  data-arrow=""
                  aria-label={
                    product.href ? `Open ${product.name}` : `Notify me about ${product.name}`
                  }
                  className={cn(
                    'absolute right-6 top-6 flex size-10 items-center justify-center rounded-full border-2 border-current transition-transform duration-500',
                    isActive && 'translate-x-0.5 -translate-y-0.5',
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    openProduct(product);
                  }}
                >
                  <ArrowUpRight className="size-5" strokeWidth={1.75} />
                </button>
                <div className="mt-auto pt-0">
                  <div
                    className={cn(
                      'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      isActive ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
                    )}
                  >
                    <div className="overflow-hidden">
                      <h2 className="pb-[0.18em] pr-2 text-5xl font-medium leading-none tracking-tight">
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
                      <p className="pb-[0.12em] text-3xl font-medium leading-snug tracking-tight">
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
