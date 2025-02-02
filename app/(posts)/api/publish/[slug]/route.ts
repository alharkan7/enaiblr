import { NextResponse } from 'next/server'
import { auth } from '@/app/(auth)/auth'
import { db } from '@/lib/db'
import { publications } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') ?? [];

export async function GET(request: Request, context: unknown) {
  // Extract params from the context after type assertion.
  const { params } = context as { params: { slug: string } }
  
  try {
    const session = await auth()
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const [publication] = await db
      .select()
      .from(publications)
      .where(sql`${publications.slug} = ${params.slug}`)

    if (!publication) {
      return new NextResponse('Not found', { status: 404 })
    }

    return NextResponse.json(publication)
  } catch (error) {
    console.error('Failed to fetch publication:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(request: Request, context: unknown) {
  // Extract params from the context after type assertion.
  const { params } = context as { params: { slug: string } }

  try {
    const session = await auth()
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const body = await request.json()
    const [publication] = await db
      .update(publications)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(sql`${publications.slug} = ${params.slug}`)
      .returning()

    return NextResponse.json(publication)
  } catch (error) {
    console.error('Failed to update publication:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}