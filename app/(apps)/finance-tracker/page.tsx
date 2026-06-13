import { auth } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import FinanceTrackerClient from './client-page';

export default async function FinanceTrackerPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/finance-tracker');
  }

  return <FinanceTrackerClient initialSession={session} />;
}
