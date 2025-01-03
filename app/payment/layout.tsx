import '../globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upgrade to Pro',
  description: 'Upgrade your account to access premium features',
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}