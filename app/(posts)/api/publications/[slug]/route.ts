import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { publications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const publication = await db
      .select()
      .from(publications)
      .where(eq(publications.slug, params.slug))
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