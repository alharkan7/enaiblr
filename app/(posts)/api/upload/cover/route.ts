import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { uploadToBunny } from '@/lib/bunnycdn';
import sharp from 'sharp';

const MAX_WIDTH = 1920; // Maximum width for cover image
const MAX_HEIGHT = 1080; // Maximum height for cover image

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
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
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat('webp', { quality: 80 })
      .toBuffer();

    // Upload to BunnyCDN
    const fileName = `publications/cover-${Date.now()}.webp`;
    const url = await uploadToBunny(fileName, processedBuffer);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading cover:', error);
    return new NextResponse('Error processing request', { status: 500 });
  }
}
