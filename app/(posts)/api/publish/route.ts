import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { createPublication } from '@/lib/db/post-queries';

// Add this function to convert title to slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    // console.log('Session:', session);
    
    if (!session?.user?.id) {
      // console.log('No session or user ID');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    // console.log('Received data:', body);

    // Generate slug from title if not provided
    const slug = body.slug?.trim() || generateSlug(body.title);

    const publication = await createPublication({
      title: body.title,
      excerpt: body.excerpt,
      author: body.author,
      category: body.category,
      content: body.content,
      userId: session.user.id,
      cover: body.cover,
      slug: slug // Add the slug
    });

    console.log('Created publication:', publication);
    return NextResponse.json(publication);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create publication' },
      { status: 500 }
    );
  }
}