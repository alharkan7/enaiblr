'use server';

import { eq, desc } from 'drizzle-orm';
import { publications } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { CalendarIcon, UserIcon } from "lucide-react"
import Link from "next/link";
import Image from "next/image";
import BlogHeader from "../../components/header"
import { getRandomGradient } from "../../components/GradientCover";

interface Publication {
  id: string;
  title: string;
  excerpt?: string | null;
  createdAt: Date;
  author: string;
  category?: string | null;
  content: string;
  cover?: string | null;
  updatedAt?: Date | null;
  slug: string | null; // assuming slug gets transformed to non-null (or adjust accordingly)
  userId: string;
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  // Await the params before using them
  const { category } = await params;

  const posts: Publication[] = await db
    .select()
    .from(publications)
    .where(eq(publications.category, category))
    .orderBy(desc(publications.createdAt));

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent capitalize">
          {category}
        </h1>
        <p className="text-xl text-muted-foreground mt-4">No publications found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <BlogHeader />
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent capitalize">
          {category}
        </h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Explore our publications in the {category} category
        </p>
      </header>

      {/* Regular Posts */}
      <section className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/publications/${post.slug}`}>
              <div className="group h-full bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                {post.cover ? (
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className={`relative w-full aspect-[16/9] ${getRandomGradient()} transition-transform duration-300 group-hover:scale-105`} />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-3">
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
                  </div>
                  {post.excerpt && (
                    <p className="text-muted-foreground mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}