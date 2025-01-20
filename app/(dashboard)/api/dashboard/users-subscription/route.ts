import { NextResponse } from 'next/server';
import { getPaginatedSubscriptions } from '@/lib/db/admin-queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '25');
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  try {
    const data = await getPaginatedSubscriptions(
      page, 
      limit,
      sort as 'email' | 'createdAt' | 'plan' | 'validUntil',
      order as 'asc' | 'desc'
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}