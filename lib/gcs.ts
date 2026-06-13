import { Storage } from '@google-cloud/storage';
import 'server-only';

// Initialize the Google Cloud Storage client
// It automatically picks up GOOGLE_APPLICATION_CREDENTIALS and GOOGLE_CLOUD_PROJECT
// from the environment variables, but we can be explicit here as well.
const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!projectId || !keyFilename) {
  console.warn(
    'Missing GCS environment variables. Please check GOOGLE_CLOUD_PROJECT and GOOGLE_APPLICATION_CREDENTIALS.'
  );
}

// In Next.js development mode, avoid creating multiple instances of the Storage client
// during Hot Module Replacement (HMR).
const globalForGCS = global as unknown as { storage: Storage | undefined };

export const storage =
  globalForGCS.storage ??
  new Storage({
    projectId,
    keyFilename,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForGCS.storage = storage;
}

// Helper to easily get the configured bucket
export const getBucket = () => {
  const bucketName = process.env.GOOGLE_CLOUD_BUCKET;
  if (!bucketName) {
    throw new Error('GOOGLE_CLOUD_BUCKET environment variable is not set');
  }
  return storage.bucket(bucketName);
};
