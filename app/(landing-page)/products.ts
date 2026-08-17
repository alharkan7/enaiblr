import { Clapperboard, FlaskConical, GraduationCap, type LucideIcon } from 'lucide-react';

export type ProductId = 'mograph' | 'beeblio' | 'untitled';

export type Product = {
  id: ProductId;
  name: string;
  description: string;
  href: string | null;
  word: 'learning' | 'research' | 'creative';
  icon: LucideIcon;
  color: string;
  colorDark: string;
};

export const products: Product[] = [
  {
    id: 'mograph',
    name: 'Mograph',
    description: 'Create motion graphics in seconds.',
    href: 'https://mograph.enaiblr.org',
    word: 'creative',
    icon: Clapperboard,
    color: '#bf5d3b',
    colorDark: '#ea855c',
  },
  {
    id: 'beeblio',
    name: 'Beeblio',
    description: 'Democratizing research automation.',
    href: null,
    word: 'research',
    icon: FlaskConical,
    color: '#3a8fa0',
    colorDark: '#5cb8c4',
  },
  {
    id: 'untitled',
    name: 'Bibie',
    description: 'The home-schooling tools & games.',
    href: null,
    word: 'learning',
    icon: GraduationCap,
    color: '#c1842f',
    colorDark: '#e4b45d',
  },
];

export const heroWords = [
  { key: 'learning', productId: 'untitled' as const, text: 'learning' },
  { key: 'research', productId: 'beeblio' as const, text: 'research' },
  { key: 'creative', productId: 'mograph' as const, text: 'creative' },
] as const;

export function productById(id: ProductId) {
  return products.find((product) => product.id === id)!;
}
