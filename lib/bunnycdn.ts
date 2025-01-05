import { Buffer } from 'buffer';

// Get environment variables with fallbacks
const STORAGE_ZONE_NAME = process.env.BUNNYCDN_STORAGE_ZONE || '';
const STORAGE_HOSTNAME = process.env.BUNNYCDN_STORAGE_HOST || '';
const STORAGE_PASSWORD = process.env.BUNNYCDN_STORAGE_PASSWORD || '';
const CDN_HOSTNAME = process.env.BUNNYCDN_CDN_HOST || '';

// Validate environment variables at runtime, not build time
const validateConfig = () => {
  if (!STORAGE_ZONE_NAME) throw new Error('BUNNYCDN_STORAGE_ZONE is required');
  if (!STORAGE_HOSTNAME) throw new Error('BUNNYCDN_STORAGE_HOST is required');
  if (!STORAGE_PASSWORD) throw new Error('BUNNYCDN_STORAGE_PASSWORD is required');
  if (!CDN_HOSTNAME) throw new Error('BUNNYCDN_CDN_HOST is required');
};

export async function uploadToBunny(filename: string, buffer: ArrayBuffer) {
  // Only validate when actually uploading
  validateConfig();
  
  const url = `https://${STORAGE_HOSTNAME}/${STORAGE_ZONE_NAME}/${filename}`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'AccessKey': STORAGE_PASSWORD,
        'Content-Type': 'application/octet-stream',
      },
      body: Buffer.from(buffer),
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    // Return CDN URL
    return `https://${CDN_HOSTNAME}/${filename}`;
  } catch (error) {
    console.error('BunnyCDN upload error:', error);
    throw error;
  }
}

export async function deleteFromBunny(filename: string) {
  // Only validate when actually deleting
  validateConfig();
  
  const url = `https://${STORAGE_HOSTNAME}/${STORAGE_ZONE_NAME}/${filename}`;
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'AccessKey': STORAGE_PASSWORD,
      },
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('BunnyCDN delete error:', error);
    throw error;
  }
}
