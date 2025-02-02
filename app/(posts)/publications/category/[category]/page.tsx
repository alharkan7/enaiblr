import { eq, desc } from 'drizzle-orm';
import { publications } from '@/lib/db/schema';
import { db } from '@/lib/db';

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
  slug: string | null; // allow null
  userId: string;
}

interface PageProps {
  params: { category: string };
}

export default async function CategoryPage({ params }: PageProps) {
  // Query the database directly for publications with the given category
  const posts: Publication[] = await db
    .select()
    .from(publications)
    .where(eq(publications.category, params.category))
    .orderBy(desc(publications.createdAt));

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold">
          Category: {params.category}
        </h1>
        <p className="text-xl text-muted-foreground mt-4">
          No publications found.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Render your publications by category here */}
      <h1>Category: {params.category}</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          {/* Render other post details */}
        </div>
      ))}
    </div>
  );
}