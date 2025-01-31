import { notFound } from "next/navigation"
import Link from "next/link"
import { getPublication } from "@/lib/publications"
import { CalendarIcon, UserIcon, ClockIcon, FolderIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function Publication({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const post = await getPublication(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="prose prose-zinc dark:prose-invert mx-auto">
      <h1>{post.title}</h1>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground not-prose mb-8">
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
        <Link href={`/publications/category/${post.category}`}>
          <Badge variant="secondary" className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground">
            <FolderIcon className="w-3 h-3" />
            {post.category}
          </Badge>
        </Link>
      </div>
      <div 
        className="mt-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="not-prose mt-16">
        <Link 
          href="/publications"
          className="text-primary hover:underline"
        >
          ← Back to all posts
        </Link>
      </div>
    </article>
  )
}
