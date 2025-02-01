import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { createPublication } from '@/lib/db/post-queries';

export async function POST(request: Request) {
  try {
    const session = await auth();
    console.log('Session:', session);
    
    if (!session?.user?.id) {
      console.log('No session or user ID');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Received data:', body);

    const publication = await createPublication({
      title: body.title,
      excerpt: body.excerpt,
      author: body.author,
      category: body.category,
      content: body.content,
      userId: session.user.id,
      cover: body.cover
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