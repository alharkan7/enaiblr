import { auth } from '@/app/(auth)/auth';
import { updateSubscriptionToPro, getPaymentToken, markTokenAsUsed } from '@/lib/db/queries';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get token from request body
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Payment token is required' },
        { status: 400 }
      );
    }

    // Get token regardless of status
    const [paymentToken] = await getPaymentToken(token);

    if (!paymentToken) {
      return NextResponse.json(
        { error: 'Invalid payment token' },
        { status: 400 }
      );
    }

    // Verify token belongs to the user
    if (paymentToken.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Invalid payment token' },
        { status: 400 }
      );
    }

    // If token is already used but belongs to the user, return success
    if (paymentToken.status === 'used') {
      return NextResponse.json({ success: true });
    }

    // Mark token as used and upgrade subscription
    await markTokenAsUsed(token);
    await updateSubscriptionToPro(session.user.id, paymentToken.packageName);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
