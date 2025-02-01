import { notFound } from "next/navigation"
import Link from "next/link"
import { CalendarIcon, UserIcon, ClockIcon, FolderIcon } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Publication({ params }: PageProps) {
  const resolvedParams = await params;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/publications/${resolvedParams.id}`,
    { next: { revalidate: 3600 } }
  )
  const post = await response.json()

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
        {post.category && (
          <div className="flex items-center gap-2">
            <FolderIcon className="w-4 h-4" />
            <Link href={`/publications/category/${post.category}`}>
              <span className="hover:text-primary transition-colors">
                {post.category}
              </span>
            </Link>
          </div>
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
