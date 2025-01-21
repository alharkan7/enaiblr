import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, subscription } from '@/lib/db/schema';
import { and, eq, sql, gte, ne } from 'drizzle-orm';

export async function GET() {
  try {
    // Get the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get daily registration counts for all users and pro users
    const registrations = await db.select({
      date: sql<string>`${user.createdAt}::date::text`,
      total_users: sql<number>`count(${user.id})`,
      pro_users: sql<number>`
        count(DISTINCT CASE 
          WHEN ${subscription.userId} IS NOT NULL 
          AND ${subscription.plan} != 'free'
          AND ${subscription.validUntil} > NOW() 
          THEN ${user.id} 
        END)
      `
    })
    .from(user)
    .leftJoin(subscription, eq(user.id, subscription.userId))
    .where(gte(user.createdAt, thirtyDaysAgo))
    .groupBy(sql`${user.createdAt}::date`)
    .orderBy(sql`${user.createdAt}::date`);

    // Transform the data to include free users count
    const formattedData = registrations.map(day => ({
      date: day.date,
      'Pro Users': day.pro_users,
      'Free Users': day.total_users - day.pro_users
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching registration stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration stats' },
      { status: 500 }
    );
  }
}
