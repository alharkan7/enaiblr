import { NextResponse } from 'next/server';
import { updateUserProfile } from '@/lib/db/queries';
import { hash } from 'bcrypt-ts';

export async function PUT(request: Request) {
  try {
    const { email, ...data } = await request.json();
    
    // Hash password if it's being updated
    if (data.password) {
      data.password = await hash(data.password, 10);
    }

    const result = await updateUserProfile(email, data);
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
