import { auth } from '@/app/(auth)/auth';
import { getUserSubscriptionStatus } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { plan: 'free', validUntil: null, error: 'No session' },
        { status: 401 }
      );
    }

    const status = await getUserSubscriptionStatus(session.user.id);
    
    if (!status) {
      return NextResponse.json(
        { plan: 'free', validUntil: null, error: 'Failed to fetch subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    return NextResponse.json(
      { 
        plan: 'free', 
        validUntil: null, 
        error: error instanceof Error ? error.message : 'Unknown error',
        shouldRetry: true 
      },
      { status: 500 }
    );
  }
}
