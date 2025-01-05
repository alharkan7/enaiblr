import { NextResponse } from 'next/server';
import { z } from 'zod';
import { models } from '@/lib/ai/models';

import { auth } from '@/app/(auth)/auth';
import { uploadToBunny } from '@/lib/bunnycdn';

// Common document types
const documentTypes = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
];

// Image types
const imageTypes = ['image/jpeg', 'image/png']

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
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
  message: 'Invalid file type. Please change the AI model.',
  path: ['file'], // This shows the error on the file field
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

    // Get filename from formData since Blob doesn't have name property
    const filename = (formData.get('file') as File).name;
    const fileBuffer = await file.arrayBuffer();

    try {
      const data = await uploadToBunny(filename, fileBuffer);

      // Determine content type based on file extension if not available
      let contentType = file.type;
      if (!contentType) {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') contentType = 'application/pdf';
        else if (ext === 'txt') contentType = 'text/plain';
        else if (ext === 'doc') contentType = 'application/msword';
        else if (ext === 'docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (ext === 'xls') contentType = 'application/vnd.ms-excel';
        else if (ext === 'xlsx') contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        else if (ext === 'ppt') contentType = 'application/vnd.ms-powerpoint';
        else if (ext === 'pptx') contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
        else if (ext === 'png') contentType = 'image/png';
        else contentType = 'application/octet-stream';
      }

      return NextResponse.json({
        url: data,
        pathname: filename,
        contentType: contentType
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
