import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { publications } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  context: { params: { slug: string } }
): Promise<NextResponse> {
  try {
    const publication = await db
      .select()
      .from(publications)
      .where(sql`${publications.slug} = ${context.params.slug}`)
      .limit(1)

    if (!publication.length) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    return NextResponse.json(publication[0])
  } catch (error) {
    console.error('Failed to fetch publication:', error)
    return NextResponse.json({ error: 'Failed to fetch publication' }, { status: 500 })
  }
}