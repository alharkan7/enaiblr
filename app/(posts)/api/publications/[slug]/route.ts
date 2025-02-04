import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { publications } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  context: unknown
): Promise<NextResponse> {
  // Use a type assertion to get the params object
  const { params } = context as { params: { slug: string } }

  try {
    console.log('Fetching publication with slug:', params.slug);
    const publication = await db
      .select({
        id: publications.id,
        createdAt: publications.createdAt,
        title: publications.title,
        excerpt: publications.excerpt,
        author: publications.author,
        category: publications.category,
        content: publications.content,
        cover: publications.cover,
        updatedAt: publications.updatedAt,
        slug: publications.slug,
        userId: publications.userId
      })
      .from(publications)
      .where(sql`${publications.slug} = ${params.slug}`)
      .limit(1);

    console.log('Raw database result:', publication);

    if (!publication.length) {
      return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
    }

    console.log('Found publication:', publication[0]);
    return NextResponse.json(publication[0])
  } catch (error) {
    console.error('Failed to fetch publication:', error)
    return NextResponse.json({ error: 'Failed to fetch publication' }, { status: 500 })
  }
}