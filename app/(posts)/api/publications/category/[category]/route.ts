import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { publications } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const publicationsByCategory = await db
      .select()
      .from(publications)
      .where(eq(publications.category, params.category))
      .orderBy(desc(publications.createdAt))

    return NextResponse.json(publicationsByCategory)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch publications by category' },
      { status: 500 }
    )
  }
}
