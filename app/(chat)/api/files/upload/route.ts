import { NextResponse } from 'next/server';
import { z } from 'zod';
import { models } from '@/lib/ai/models';

import { auth } from '@/app/(auth)/auth';
import { uploadToBunny } from '@/lib/bunnycdn';
import { optimizeFile } from '@/lib/optimize';

// Common document types
const documentTypes = [
  'application/pdf',
  'text/plain',
  'application/x-javascript, text/javascript',
  'application/x-python, text/x-python',
  'text/html',
  'text/css',
  'text/md',
  'text/csv',
  'text/xml',
  'text/rtf',
];

// Image types
const imageTypes = ['image/jpeg', 'image/png', 'image/webp']

// Initial size limit increased since we'll optimize images
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'File size should be less than 10MB',
    }),
  modelId: z.string(),
}).refine((data) => {
  const model = models.find((m) => m.id === data.modelId);
  if (!model) return false;

  if (model.capabilities.files) {
    return documentTypes.includes(data.file.type) || imageTypes.includes(data.file.type);
  } else if (model.capabilities.images) {
    return imageTypes.includes(data.file.type);
  }
  return false;
}, {
  message: 'Invalid allowed file type. Please change the AI model.',
  path: ['file'],
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;
    const modelId = formData.get('modelId') as string;

    if (!file || !modelId) {
      return NextResponse.json({ error: 'Missing file or modelId' }, { status: 400 });
    }

    const validatedFile = await FileSchema.safeParseAsync({
      file,
      modelId,
    });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(', ');

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get filename and optimize file
    const originalFilename = (formData.get('file') as File).name;
    const { buffer: optimizedBuffer, type: optimizedType } = await optimizeFile(file, originalFilename);

    // Update filename extension for WebP converted images
    const filename = optimizedType === 'image/webp'
      ? originalFilename.replace(/\.[^/.]+$/, '.webp')
      : originalFilename;

    try {
      const data = await uploadToBunny(filename, optimizedBuffer);

      return NextResponse.json({
        url: data,
        pathname: filename,
        contentType: optimizedType,
        originalName: originalFilename
      });
    } catch (error) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
