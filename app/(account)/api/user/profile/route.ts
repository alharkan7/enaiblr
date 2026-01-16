import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { updateUserProfile } from '@/lib/db/queries';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const { name, phone, password, geminiApiKey } = data;

    // If password is provided, hash it
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user profile
    await updateUserProfile(session.user.email, {
      name,
      phone,
      password: hashedPassword,
      geminiApiKey,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    return new NextResponse('Error processing request', { status: 500 });
  }
}
