import { notFound } from "next/navigation"
import Link from "next/link"
import { CalendarIcon, UserIcon, FolderIcon, PencilIcon } from "lucide-react"
import { auth } from "@/app/(auth)/auth"
import { Button } from "@/components/ui/button"
import { use } from "react"

const ADMIN_EMAILS = ['raihankalla@gmail.com', 'alharkan7@gmail.com', 'enaiblr@gmail.com']

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

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Publication({ params }: PageProps) {
  const { slug } = use(params);
  const session = await auth();
  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  const response = await fetch(
    `${process.env.APP_URL}/api/publications/${slug}`,
    { next: { revalidate: 3600 } }
  )

  if (!response.ok) {
    if (response.status === 404) {
      notFound()
    }
    throw new Error(`Failed to fetch publication: ${response.statusText}`)
  }

  const post: Publication = await response.json()

  if (!post) {
    notFound()
  }

  return (
    <article className="prose prose-zinc dark:prose-invert mx-auto relative">
      {isAdmin && (
        <Link 
          href={`/publish/${post.slug}`}
          className="absolute top-0 right-0 no-underline"
        >
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <PencilIcon className="w-4 h-4" />
          </Button>
        </Link>
      )}
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
