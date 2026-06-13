import { NextResponse } from 'next/server';
import { getBucket } from '@/lib/gcs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    
    try {
      const bucket = getBucket();
      const fileName = `filechat-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filepath = `enaiblr/filechat/${fileName}`;
      
      await bucket.file(filepath).save(Buffer.from(arrayBuffer), {
        contentType: file.type || 'application/octet-stream',
      });
      
      return NextResponse.json({ success: true, filepath });
    } catch (gcsError) {
      console.error('Failed to upload to GCS:', gcsError);
      return NextResponse.json({ error: 'GCS Upload failed' }, { status: 500 });
    }

  } catch (error) {
    console.error('Filechat upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
