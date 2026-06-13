import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { getBucket } from '@/lib/gcs';
import { updateUserAvatar } from '@/lib/db/queries';
import sharp from 'sharp';

const MAX_SIZE = 512; // Maximum dimension for avatar

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 });
    }

    // Convert to buffer for processing
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process image with sharp
    const processedBuffer = await sharp(buffer)
      .resize(MAX_SIZE, MAX_SIZE, {
        fit: 'cover',
        position: 'center'
      })
      .toFormat('webp', { quality: 80 })
      .toBuffer();

    // Upload to GCS
    const fileName = `avatar-${Date.now()}.webp`;
    const filepath = `enaiblr/avatars/${fileName}`;
    const bucket = getBucket();
    await bucket.file(filepath).save(processedBuffer, {
      contentType: 'image/webp',
    });
    const url = `https://storage.googleapis.com/${bucket.name}/${filepath}`;

    // Update user avatar in database
    await updateUserAvatar(session.user.email, url);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error updating avatar:', error);
    return new NextResponse('Error processing request', { status: 500 });
  }
}
