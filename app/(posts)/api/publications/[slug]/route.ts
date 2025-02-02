import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { publications } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

type Props = {
  params: { slug: string }
}

export async function GET(
  _request: NextRequest,
  props: Props
): Promise<NextResponse> {
  try {
    const publication = await db
      .select()
      .from(publications)
      .where(eq(publications.slug, props.params.slug))
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