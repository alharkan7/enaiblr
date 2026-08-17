'use client';

import { cn } from '@/lib/utils';

import { heroWords, productById, type ProductId } from '../products';

function HeroWord({
  productId,
  text,
  activeId,
}: {
  productId: ProductId;
  text: string;
  activeId: ProductId | null;
}) {
  const product = productById(productId);
  const Icon = product.icon;
  const isActive = activeId === productId;
  const dimmed = activeId !== null && !isActive;

  return (
    <span
      className={cn(
        'inline-flex items-baseline transition-opacity duration-500',
        dimmed && 'opacity-35',
      )}
      style={{ color: `var(--c-${productId})` }}
    >
      <span
        className={cn(
          'grid transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isActive ? 'grid-cols-[1.15em]' : 'grid-cols-[0fr]',
        )}
      >
        <span className="flex overflow-hidden">
          <Icon
            aria-hidden
            className="mr-[0.28em] size-[0.82em] shrink-0 translate-y-[0.08em]"
            strokeWidth={1.75}
          />
        </span>
      </span>
      <span>{text}</span>
    </span>
  );
}

export function HeroLine({ activeId }: { activeId: ProductId | null }) {
  const learning = heroWords[0];
  const research = heroWords[1];
  const creative = heroWords[2];

  const dimmed = activeId !== null;

  return (
    <h1 className="shrink-0 text-[2rem] font-medium leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
      <span className="block md:inline">
        we make{' '}
        <HeroWord productId={learning.productId} text={learning.text} activeId={activeId} />
        <span className={cn('transition-opacity duration-500', dimmed && 'opacity-35')}>,</span>
      </span>{' '}
      <span className="block md:inline">
        <HeroWord productId={research.productId} text={research.text} activeId={activeId} />
        <span className={cn('transition-opacity duration-500', dimmed && 'opacity-35')}>, and</span>
      </span>{' '}
      <span className="block md:inline">
        <HeroWord productId={creative.productId} text={creative.text} activeId={activeId} />{' '}
        tools
      </span>
    </h1>
  );
}
