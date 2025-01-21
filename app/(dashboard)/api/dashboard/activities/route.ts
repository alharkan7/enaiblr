import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, subscription, chat, message, document, folder } from '@/lib/db/schema';
import { and, eq, sql, gte, ne } from 'drizzle-orm';

export async function GET() {
  try {
    // Get the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get daily activities for pro users and free users
    const activities = await db
      .select({
        date: sql<string>`${chat.createdAt}::date::text`,
        pro_chats: sql<number>`
          COUNT(DISTINCT CASE 
            WHEN EXISTS (
              SELECT 1 FROM ${subscription}
              WHERE ${subscription.userId} = ${chat.userId}
              AND ${subscription.plan} != 'free'
              AND ${subscription.validUntil} > NOW()
            )
            THEN ${chat.id}
          END)`,
        free_chats: sql<number>`
          COUNT(DISTINCT CASE 
            WHEN NOT EXISTS (
              SELECT 1 FROM ${subscription}
              WHERE ${subscription.userId} = ${chat.userId}
              AND ${subscription.plan} != 'free'
              AND ${subscription.validUntil} > NOW()
            )
            THEN ${chat.id}
          END)`,
        pro_messages: sql<number>`
          COUNT(DISTINCT CASE 
            WHEN EXISTS (
              SELECT 1 FROM ${subscription}
              WHERE ${subscription.userId} = ${chat.userId}
              AND ${subscription.plan} != 'free'
              AND ${subscription.validUntil} > NOW()
            )
            THEN ${message.id}
          END)`,
        free_messages: sql<number>`
          COUNT(DISTINCT CASE 
            WHEN NOT EXISTS (
              SELECT 1 FROM ${subscription}
              WHERE ${subscription.userId} = ${chat.userId}
              AND ${subscription.plan} != 'free'
              AND ${subscription.validUntil} > NOW()
            )
            THEN ${message.id}
          END)`,
        pro_documents: sql<number>`
          COUNT(DISTINCT CASE 
            WHEN EXISTS (
              SELECT 1 FROM ${subscription}
              WHERE ${subscription.userId} = ${document.userId}
              AND ${subscription.plan} != 'free'
              AND ${subscription.validUntil} > NOW()
            )
            THEN ${document.id}
          END)`,
        free_documents: sql<number>`
          COUNT(DISTINCT CASE 
            WHEN NOT EXISTS (
              SELECT 1 FROM ${subscription}
              WHERE ${subscription.userId} = ${document.userId}
              AND ${subscription.plan} != 'free'
              AND ${subscription.validUntil} > NOW()
            )
            THEN ${document.id}
          END)`,
        pro_folders: sql<number>`
          COUNT(DISTINCT CASE 
            WHEN EXISTS (
              SELECT 1 FROM ${subscription}
              WHERE ${subscription.userId} = ${folder.userId}
              AND ${subscription.plan} != 'free'
              AND ${subscription.validUntil} > NOW()
            )
            THEN ${folder.id}
          END)`,
        free_folders: sql<number>`
          COUNT(DISTINCT CASE 
            WHEN NOT EXISTS (
              SELECT 1 FROM ${subscription}
              WHERE ${subscription.userId} = ${folder.userId}
              AND ${subscription.plan} != 'free'
              AND ${subscription.validUntil} > NOW()
            )
            THEN ${folder.id}
          END)`,
      })
      .from(chat)
      .leftJoin(message, eq(message.chatId, chat.id))
      .leftJoin(document, eq(document.userId, chat.userId))
      .leftJoin(folder, eq(folder.userId, chat.userId))
      .where(gte(chat.createdAt, thirtyDaysAgo))
      .groupBy(sql`${chat.createdAt}::date`)
      .orderBy(sql`${chat.createdAt}::date`);

    // Transform the data into two separate series for pro and free users
    const formattedData = {
      proUsers: activities.map(day => ({
        date: day.date,
        'Chats': day.pro_chats,
        'Messages': day.pro_messages,
        'Documents': day.pro_documents,
        'Folders': day.pro_folders
      })),
      freeUsers: activities.map(day => ({
        date: day.date,
        'Chats': day.free_chats,
        'Messages': day.free_messages,
        'Documents': day.free_documents,
        'Folders': day.free_folders
      }))
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity stats' },
      { status: 500 }
    );
  }
}
