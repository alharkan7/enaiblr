import Link from "next/link";
import Image from "next/image";
import CategoriesList from "./components/categories-list";
import { db } from "@/lib/db";
import { publications } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { CalendarIcon, UserIcon, FolderIcon } from "lucide-react"
import CategoryButton from './components/CategoryButton';
import { getRandomGradient } from "./components/GradientCover";

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

      {/* Featured Post */}
      <section className="container mx-auto px-4">
        <div className="group bg-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
          <Link href={`/publications/${featuredPost.slug}`}>
            <div className="md:grid md:grid-cols-5 gap-6">
              {featuredPost.cover ? (
                <div className="relative w-full aspect-[16/9] md:col-span-3 md:aspect-auto">
                  <Image
                    src={featuredPost.cover}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </div>
              ) : (
                <div className={`relative w-full aspect-[16/9] md:col-span-3 md:aspect-auto ${getRandomGradient()} transition-transform duration-300 group-hover:scale-105`} />
              )}
              <div className="p-8 md:col-span-2 flex flex-col justify-center">

                <h2 className="text-3xl font-bold group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <time>
                      {new Date(featuredPost.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).replace(",", "")}
                    </time>
                  </div>
                </div>
                {featuredPost.excerpt && (
                  <p className="text-muted-foreground mt-4 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Regular Posts */}
      <section className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {regularPosts.map((post) => (
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
                        {new Date(featuredPost.createdAt).toLocaleDateString("id-ID", {
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