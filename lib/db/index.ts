import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Use connection string from environment variable
const connectionString = process.env.DATABASE_URL!;

// Create postgres connection
// prepare: false is CRITICAL for Vercel Serverless environments connecting to Neon/PgBouncer pooler
export const client = postgres(connectionString, { prepare: false });

// Create drizzle database instance
export const db = drizzle(client);
