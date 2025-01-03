import { auth } from '@/app/(auth)/auth';
import { getUserSubscriptionStatus } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ plan: 'free' });
    }

    const status = await getUserSubscriptionStatus(session.user.id);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    return NextResponse.json({ plan: 'free' });
  }
}
