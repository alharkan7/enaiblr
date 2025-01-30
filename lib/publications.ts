import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

const POSTS_PATH = path.join(process.cwd(), "content/publications")

// Average reading speed (words per minute)
const WORDS_PER_MINUTE = 200

function calculateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / WORDS_PER_MINUTE)
  return `${minutes} min read`
}

export interface Publication {
  slug: string
  title: string
  excerpt: string
  date: string
  content: string
  author: string
  readingTime: string
  category: string
}

export async function getPublications(): Promise<Publication[]> {
  const files = fs.readdirSync(POSTS_PATH)
  
  const posts = await Promise.all(
    files
      .filter((file) => /\.mdx?$/.test(file))
      .map(async (file) => {
        const filePath = path.join(POSTS_PATH, file)
        const source = fs.readFileSync(filePath, "utf8")
        const { data, content } = matter(source)
        
        const processedContent = await remark()
          .use(html)
          .use(remarkGfm)
          .process(content)
        
        return {
          slug: file.replace(/\.mdx?$/, ""),
          title: data.title,
          excerpt: data.excerpt,
          date: data.date.toISOString(),
          content: processedContent.toString(),
          author: data.author,
          readingTime: calculateReadingTime(content),
          category: data.category || 'Uncategorized'
        }
      })
  )

  return posts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()))
}

export async function getPublication(slug: string): Promise<Publication | null> {
  try {
    const filePath = path.join(POSTS_PATH, `${slug}.mdx`)
    console.log("Attempting to read publications:", { filePath, exists: fs.existsSync(filePath) })
    const source = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(source)

    const processedContent = await remark()
      .use(html)
      .use(remarkGfm)
      .process(content)

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date.toISOString(),
      content: processedContent.toString(),
      author: data.author,
      readingTime: calculateReadingTime(content),
      category: data.category || 'Uncategorized'
    }
  } catch (error) {
    console.error("Error reading publication post:", { slug, error })
    return null
  }
}

export async function getCategories(): Promise<string[]> {
  const posts = await getPublications()
  const categories = new Set(posts.map(post => post.category))
  return Array.from(categories).sort()
}

export async function getPostsByCategory(category: string): Promise<Publication[]> {
  const posts = await getPublications()
  return posts.filter(post => post.category === category)
}
