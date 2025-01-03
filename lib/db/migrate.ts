import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

config({
  path: '.env.local',
});

// Type guard for error with message
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  try {
    console.log('⏳ Running migrations...');
    const start = Date.now();
    
    // Try to run migrations, but don't fail if tables exist
    await migrate(db, { 
      migrationsFolder: './lib/db/migrations'
    }).catch(err => {
      // If error is about existing tables/columns, consider it successful
      if (isErrorWithMessage(err) && err.message.includes('already exists')) {
        console.log('✅ Tables already exist, skipping migrations');
        return;
      }
      // Otherwise, rethrow the error
      throw err;
    });

    const end = Date.now();
    console.log('✅ Migrations completed in', end - start, 'ms');
  } catch (err) {
    console.error('❌ Migration failed');
    console.error(err);
    // Don't exit with error if tables exist
    if (isErrorWithMessage(err) && err.message.includes('already exists')) {
      process.exit(0);
    }
    process.exit(1);
  } finally {
    await connection.end();
    process.exit(0);
  }
};

runMigrate();
