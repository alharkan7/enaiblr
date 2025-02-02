import { notFound } from "next/navigation"
import Link from "next/link"
import { getCategories } from "@/lib/publications"
import { Card } from "@/components/ui/card"
import { CalendarIcon, UserIcon } from "lucide-react"
import BlogHeader from "../../components/header"
import Image from "next/image"

interface PageProps {
  params: Promise<{ category: string }>
}

interface Publication {
  id: string
  title: string
  excerpt?: string | null
  createdAt: string
  author: string
  category?: string | null
  content: string
  cover?: string | null
  updatedAt?: string | null
  slug: string
  userId: string
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    category,
  }))
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const response = await fetch(`${process.env.APP_URL}/api/publications?category=${resolvedParams.category}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch publications: ${response.statusText}`)
  }

  const posts: Publication[] = await response.json()

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold">Category: {resolvedParams.category}</h1>
        <p className="text-xl text-muted-foreground mt-4">No publications found.</p>
      </div>
    )
  }

  return (
    <>
      <BlogHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <header className="text-center">
            <h2 className="text-3xl font-bold">
              Category: {resolvedParams.category}
            </h2>
            <p className="text-muted-foreground mt-2">
              {posts.length} post{posts.length === 1 ? "" : "s"}
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.slug} href={`/publications/${post.slug}`}>
                <Card className="h-full group hover:shadow-md transition-all duration-300">
                  {post.cover && (
                    <div className="relative w-full h-[200px]">
                      <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <time>
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <h3 className="font-bold group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-muted-foreground mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/publications"
              className="text-primary hover:underline"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
