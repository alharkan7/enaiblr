import { Storage } from '@google-cloud/storage';
import 'server-only';

// Initialize the Google Cloud Storage client
// It supports either GOOGLE_CREDENTIALS_JSON (preferred for Vercel) or GOOGLE_APPLICATION_CREDENTIALS (file path)
const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;

let storageOptions: any = { projectId };

if (credentialsJson) {
  try {
    storageOptions.credentials = JSON.parse(credentialsJson);
  } catch (error) {
    console.error('Failed to parse GOOGLE_CREDENTIALS_JSON environment variable.', error);
  }
} else if (keyFilename) {
  storageOptions.keyFilename = keyFilename;
}

if (!projectId || (!keyFilename && !credentialsJson)) {
  console.warn(
    'Missing GCS environment variables. Please check GOOGLE_CLOUD_PROJECT and either GOOGLE_CREDENTIALS_JSON or GOOGLE_APPLICATION_CREDENTIALS.'
  );
}

// In Next.js development mode, avoid creating multiple instances of the Storage client
// during Hot Module Replacement (HMR).
const globalForGCS = global as unknown as { storage: Storage | undefined };

export const storage =
  globalForGCS.storage ??
  new Storage(storageOptions);

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
