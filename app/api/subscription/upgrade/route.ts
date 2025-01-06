import { auth } from '@/app/(auth)/auth';
import { updateSubscriptionToPro } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await updateSubscriptionToPro(session.user.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update subscription:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
