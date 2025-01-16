import '@/app/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Enaiblr Pro',
  description: 'Unlimited Access to All AI Models, Document & Image Uploads, Saved History, Chat Organizer (Foldering, Pins), AI Document Creator, and AI Python Programmer',
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