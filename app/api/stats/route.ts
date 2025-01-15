import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, chat, message, document } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const stats = await Promise.all([
      // db.select({ count: sql<number>`count(*)` }).from(user),
      db.select({ count: sql<number>`count(*)` }).from(chat),
      db.select({ count: sql<number>`count(*)` }).from(message),
      db.select({ count: sql<number>`count(*)` }).from(document),
    ]);

    return NextResponse.json({
      // users: stats[0][0].count * 100,
      chats: stats[0][0].count * 100,
      messages: stats[1][0].count * 100,
      documents: stats[2][0].count * 100,
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
