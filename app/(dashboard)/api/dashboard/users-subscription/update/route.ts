import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, subscription } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PUT(request: Request) {
  try {
    const { email, plan, validUntil, createdAt } = await request.json();

    // First get the user id
    const [userData] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, email));

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update the subscription
    const result = await db
      .update(subscription)
      .set({
        plan,
        validUntil: validUntil ? new Date(validUntil) : null,
        createdAt: new Date(createdAt),
      })
      .where(eq(subscription.userId, userData.id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to update subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
