import sharp from 'sharp';

const MAX_IMAGE_WIDTH = 1920;
const IMAGE_QUALITY = 80;

export async function optimizeFile(
  file: Blob,
  filename: string
): Promise<{ buffer: Buffer; size: number; type: string }> {
  const isImage = file.type.startsWith('image/');
  
  if (!isImage) {
    // For non-image files, just return the buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    return {
      buffer,
      size: buffer.length,
      type: file.type
    };
  }

  // For images, optimize using sharp
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Only resize if width is larger than MAX_IMAGE_WIDTH
    if (metadata.width && metadata.width > MAX_IMAGE_WIDTH) {
      image.resize(MAX_IMAGE_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Convert to WebP for better compression
    const optimizedBuffer = await image
      .webp({ quality: IMAGE_QUALITY })
      .toBuffer();

    return {
      buffer: optimizedBuffer,
      size: optimizedBuffer.length,
      type: 'image/webp'
    };
  } catch (error) {
    console.error('Image optimization failed:', error);
    // Fallback to original file if optimization fails
    const buffer = Buffer.from(await file.arrayBuffer());
    return {
      buffer,
      size: buffer.length,
      type: file.type
    };
  }
}
