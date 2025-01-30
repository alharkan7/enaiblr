import Link from "next/link"
import { getBlogPosts } from "@/lib/blog"
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CategoriesList from "./components/categories-list"

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  readingTime?: string
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const featuredPost = posts[0]
  const regularPosts = posts.slice(1)

  return (
    <div className="space-y-16">
      {/* Featured Post */}
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Blog
        </h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Explore our latest thoughts, insights, and stories about AI, technology, and innovation.
        </p>
        <div className="mt-8">
          <CategoriesList />
        </div>
      </header>
      <section>
        <Link href={`/blog/${featuredPost.slug}`}>
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <time>
                    {new Date(featuredPost.date).toLocaleDateString("en-US", {
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
                {featuredPost.readingTime && (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>{featuredPost.readingTime}</span>
                  </div>
                )}
              </div>
              <h2 className="text-3xl font-bold group-hover:text-primary transition-colors mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-muted-foreground text-lg mb-6">{featuredPost.excerpt}</p>
              <Button variant="outline" className="group-hover:bg-primary group-hover:text-white transition-colors">
                Read More
              </Button>
            </div>
          </Card>
        </Link>
      </section>

      {/* Regular Posts Grid */}
      <section className="grid gap-8 md:grid-cols-2">
        {regularPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
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
                </div>
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-3">
                  {post.title}
                </h2>
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </div>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  )
}