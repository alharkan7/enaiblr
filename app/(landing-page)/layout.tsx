import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'enaiblr - Learning, Research, and Creative Tools Maker',
  },
  description: 'We make learning, research, and creative tools.',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
