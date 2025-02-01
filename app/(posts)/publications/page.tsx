import Link from "next/link"
import { CalendarIcon, ClockIcon, UserIcon, FolderIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CategoriesList from "./components/categories-list"

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

export default async function PublicationsPage() {
  const response = await fetch(`${process.env.APP_URL}/api/publications`, {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch publications: ${response.statusText}`)
  }

  const posts: Publication[] = await response.json()
  
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Publications
        </h1>
        <p className="text-xl text-muted-foreground mt-4">No publications found.</p>
      </div>
    )
  }

  const featuredPost = posts[0]
  const regularPosts = posts.slice(1)

  return (
    <div className="space-y-16">
      {/* Featured Post */}
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Publications
        </h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Explore our latest thoughts, insights, and stories about AI, technology, and innovation.
        </p>
        <div className="mt-8">
          <CategoriesList />
        </div>
      </header>
      <section>
        <Link href={`/publications/${featuredPost.slug}`}>
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <time>
                    {new Date(featuredPost.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  <span>{featuredPost.author}</span>
                </div>
                {featuredPost.category && (
                  <div className="flex items-center gap-2">
                    <FolderIcon className="w-4 h-4" />
                    <Link href={`/publications/category/${featuredPost.category}`}>
                      <span className="hover:text-primary transition-colors">
                        {featuredPost.category}
                      </span>
                    </Link>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h2>
              {featuredPost.excerpt && (
                <p className="text-muted-foreground mt-2">{featuredPost.excerpt}</p>
              )}
            </div>
          </Card>
        </Link>
      </section>

      {/* Regular Posts */}
      <section className="grid gap-8 md:grid-cols-2">
        {regularPosts.map((post: Publication) => (
          <Link key={post.id} href={`/publications/${post.slug}`}>
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
      </section>
    </div>
  )
}