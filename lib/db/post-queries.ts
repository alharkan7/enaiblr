import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from './';
import { publicationsSub, publications, type Publication } from './schema';
import { randomUUID } from 'crypto';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type CreatePublicationInput = {
  title: string;
  excerpt?: string;
  author: string;
  category?: string;
  content: string;
  userId: string;
  cover?: string;
  slug?: string;
};

export async function createPublication(data: CreatePublicationInput) {
  try {
    console.log('Creating publication with data:', data);
    const now = new Date();
    const slug = data.slug || generateSlug(data.title);
    
    const [publication] = await db
      .insert(publications)
      .values({
        id: randomUUID(),
        createdAt: now,
        ...data,
        slug // Override any provided slug or use generated one
      })
      .returning();
    console.log('Publication created:', publication);
    return publication;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function getPublicationById(id: string) {
  try {
    console.log('Getting publication by id:', id);
    const [publication] = await db
      .select()
      .from(publications)
      .where(eq(publications.id, id));
    console.log('Publication retrieved:', publication);
    return publication;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function updatePublication(
  id: string,
  data: Partial<Omit<Publication, 'id' | 'createdAt' | 'userId'>>
) {
  try {
    console.log('Updating publication with id:', id, 'and data:', data);
    const [publication] = await db
      .update(publications)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(publications.id, id))
      .returning();
    console.log('Publication updated:', publication);
    return publication;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function getUserPublications(userId: string): Promise<Publication[]> {
  try {
    console.log('Getting publications for user with id:', userId);
    const userPublications = await db
      .select()
      .from(publications)
      .where(eq(publications.userId, userId))
      .orderBy(publications.createdAt);
    console.log('Publications retrieved:', userPublications);
    return userPublications;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

export async function createPublicationsSub(email: string) {
  try {
    return await db.insert(publicationsSub)
      .values({
        id: randomUUID(),
        createdAt: new Date(),
        email,
      })
      .returning();
  } catch (error) {
    console.error('Failed to create publication subscription');
    throw error;
  }
}