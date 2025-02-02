import Link from "next/link";
import Image from "next/image";
import CategoriesList from "./components/categories-list";
import { db } from "@/lib/db";
import { publications } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { CalendarIcon, UserIcon, FolderIcon } from "lucide-react"
import CategoryButton from './components/CategoryButton';

interface Publication {
  id: string;
  title: string;
  excerpt?: string | null;
  createdAt: Date; // now a Date
  author: string;
  category?: string | null;
  content: string;
  cover?: string | null;
  updatedAt?: Date | null; // now a Date or null
  slug: string | null; // allow nullable
  userId: string;
}

export default async function PublicationsPage() {
  // Query the database directly
  const posts: Publication[] = await db
    .select()
    .from(publications)
    .orderBy(desc(publications.createdAt));

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Publications
        </h1>
        <p className="text-xl text-muted-foreground mt-4">No publications found.</p>
      </div>
    );
  }

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="space-y-16">
      {/* Featured Post */}
      <header className="text-center mb-16 pt-12">
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
        <div className="group">
          <Link href={`/publications/${featuredPost.slug}`}>
            <div className="overflow-hidden hover:shadow-lg transition-all duration-300">
              {featuredPost.cover && (
                <div className="relative w-full h-[400px]">
                  <Image
                    src={featuredPost.cover}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
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
                      <CategoryButton category={featuredPost.category} />
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
            </div>
          </Link>
        </div>
      </section>

      {/* Regular Posts */}
      <section className="grid gap-8 md:grid-cols-2">
        {regularPosts.map((post) => (
          <Link key={post.slug} href={`/publications/${post.slug}`}>
            <div className="h-full group hover:shadow-md transition-all duration-300">
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
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}