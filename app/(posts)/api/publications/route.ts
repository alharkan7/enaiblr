import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { publications } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const allPublications = await db
      .select()
      .from(publications)
      .orderBy(desc(publications.createdAt))

    return NextResponse.json(allPublications)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch publications' },
      { status: 500 }
    )
  }
}
