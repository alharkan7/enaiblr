import { db } from '@/lib/db'
import { publications } from '@/lib/db/schema'
import { desc, sql } from 'drizzle-orm'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

// Average reading speed (words per minute)
const WORDS_PER_MINUTE = 200

function calculateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / WORDS_PER_MINUTE)
  return `${minutes} min read`
}

export interface Publication {
  slug: string | null
  title: string
  excerpt: string | null
  createdAt: string
  content: string
  author: string
  readingTime: string
  category: string | null
  updatedAt: string | null
  cover: string | null
  id: string
  userId: string
}

export async function getPublications(): Promise<Publication[]> {
  const posts = await db
    .select()
    .from(publications)
    .orderBy(desc(publications.createdAt))

  return posts
    .filter((post): post is typeof post & { slug: string } => post.slug !== null)
    .map(post => ({
      ...post,
      readingTime: calculateReadingTime(post.content),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt?.toISOString() || null
    }))
}

export async function getPublication(slug: string): Promise<Publication | null> {
  try {
    const [post] = await db
      .select()
      .from(publications)
      .where(sql`${publications.slug} = ${slug}`)

    if (!post || !post.slug) return null

    const processedContent = await remark()
      .use(html)
      .use(remarkGfm)
      .process(post.content)

    return {
      ...post,
      content: processedContent.toString(),
      readingTime: calculateReadingTime(post.content),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt?.toISOString() || null
    }
  } catch (error) {
    console.error("Error reading publication:", { slug, error })
    return null
  }
}

export async function getCategories(): Promise<string[]> {
  const result = await db
    .select({ category: publications.category })
    .from(publications)
    .where(sql`${publications.category} IS NOT NULL`)
    .groupBy(publications.category)
    .orderBy(publications.category)

  return result
    .map(row => row.category)
    .filter((category): category is string => category !== null)
}

export async function getPostsByCategory(category: string): Promise<Publication[]> {
  const posts = await db
    .select()
    .from(publications)
    .where(sql`${publications.category} = ${category}`)
    .orderBy(desc(publications.createdAt))

  return posts
    .filter((post): post is typeof post & { slug: string } => post.slug !== null)
    .map(post => ({
      ...post,
      readingTime: calculateReadingTime(post.content),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt?.toISOString() || null
    }))
}
