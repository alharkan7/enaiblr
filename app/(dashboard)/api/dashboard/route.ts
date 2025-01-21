import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, subscription } from '@/lib/db/schema';
import { and, eq, sql, ne } from 'drizzle-orm';

export async function GET() {
  try {
    const [totalUsers, proUsers] = await Promise.all([
      // Get total users
      db.select({ count: sql<number>`count(*)` }).from(user),
      // Get pro users (with valid subscription)
      db.select({ count: sql<number>`count(distinct ${subscription.userId})` })
        .from(subscription)
        .where(and(
          ne(subscription.plan, 'free'),
          sql`${subscription.validUntil} > NOW()`
        ))
    ]);

    const stats = {
      totalUsers: totalUsers[0].count,
      proUsers: proUsers[0].count,
      freeUsers: totalUsers[0].count - proUsers[0].count
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
