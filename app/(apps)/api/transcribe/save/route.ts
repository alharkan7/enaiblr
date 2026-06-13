import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appTranscribe } from '@/lib/db/schema';
import { auth } from '@/app/(auth)/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { language, transcription } = await request.json();

    if (!transcription) {
      return NextResponse.json({ error: 'Missing transcription data' }, { status: 400 });
    }

    await db.insert(appTranscribe).values({
      userId,
      language,
      transcription,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save transcription error:', error);
    return NextResponse.json({ error: 'Failed to save transcription' }, { status: 500 });
  }
}
