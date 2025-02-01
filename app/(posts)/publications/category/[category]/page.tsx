import { notFound } from "next/navigation"
import Link from "next/link"
import { getCategories } from "@/lib/publications"
import { Card } from "@/components/ui/card"
import { CalendarIcon, UserIcon } from "lucide-react"

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
  const response = await fetch(
    `${process.env.APP_URL}/api/publications/category/${resolvedParams.category}`,
    { next: { revalidate: 3600 } }
  )
  const posts = await response.json()

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
        {posts.map((post:any) => (
          <Link key={post.id} href={`/publications/${post.id}`}>
            <Card className="h-full group hover:shadow-md transition-all duration-300">
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
  )
}
