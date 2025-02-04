import { notFound } from "next/navigation"
import Link from "next/link"
import { CalendarIcon, UserIcon, FolderIcon, PencilIcon } from "lucide-react"
import { auth } from "@/app/(auth)/auth"
import { Button } from "@/components/ui/button"
import BlogHeader from "../components/header"
import Image from "next/image"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') ?? [];

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
  params: Promise<{ slug: string }>
}

export default async function Publication({ params }: PageProps) {
  const { slug } = await params;
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
  console.log('Publication data from API:', post);
  console.log('Author value:', post.author);

  if (!post) {
    notFound()
  }

  return (
    <>
      <BlogHeader />
      <article className="min-h-screen">
        {post.cover && (
          <div className="relative w-full h-[50vh] mb-8">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
          </div>
        )}

        <div className="container mx-auto px-4 py-8 max-w-4xl relative">
          {isAdmin && (
            <Link
              href={`/publish/${post.slug}`}
              className="absolute top-0 right-4 no-underline"
            >
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <PencilIcon className="w-4 h-4" />
              </Button>
            </Link>
          )}

          <div className="prose prose-zinc dark:prose-invert mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground not-prose mb-8">

              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <time>
                  {new Date(post.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).replace(",", "")}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>{post.author || 'Enaiblr'}</span>
              </div>
              {post.category && (
                <div className="flex items-center gap-2">
                  <FolderIcon className="w-4 h-4" />
                  <Link href={`/publications/category/${post.category}`}>
                    <span className="hover:text-primary transition-colors capitalize">
                      {post.category}
                    </span>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-8 prose dark:prose-invert max-w-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            <div className="not-prose mt-16 border-t pt-8">
              <Link
                href="/publications"
                className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2"
              >
                ← Back to all posts
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}