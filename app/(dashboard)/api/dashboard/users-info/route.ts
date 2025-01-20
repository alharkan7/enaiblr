import { NextResponse } from 'next/server';
import { getPaginatedUsers } from '@/lib/db/admin-queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '25');
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  try {
    const data = await getPaginatedUsers(
      page, 
      limit, 
      sort as 'email' | 'name' | 'phone' | 'createdAt',
      order as 'asc' | 'desc'
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
