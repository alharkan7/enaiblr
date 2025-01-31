import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostsByCategory, getCategories } from "@/lib/publications"
import { Card } from "@/components/ui/card"
import { CalendarIcon, UserIcon, ClockIcon } from "lucide-react"

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    category,
  }))
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const posts = await getPostsByCategory(resolvedParams.category)

  if (!posts.length) {
    notFound()
  }

  return (
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
              <div className="p-6">
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <time>
                      {new Date(post.date).toLocaleDateString("en-US", {
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
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>{post.readingTime}</span>
                  </div>
                </div>
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-3">
                  {post.title}
                </h2>
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
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
  )
}
