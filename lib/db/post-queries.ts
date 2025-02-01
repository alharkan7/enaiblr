import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from './';
import { publications, type Publication } from './schema';
import { randomUUID } from 'crypto';

export async function createPublication(data: {
  title: string;
  excerpt?: string;
  author: string;
  category?: string;
  content: string;
  userId: string;
  cover?: string;
}) {
  try {
    console.log('Creating publication with data:', data);
    const now = new Date();
    const [publication] = await db
      .insert(publications)
      .values({
        id: randomUUID(),
        createdAt: now,
        ...data
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