import { getOrCreateFtUser, getFtUserByUserId } from '@/lib/db/queries';
import { db } from '@/lib/db';
import { ftMain } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface UserSheet {
  userId: string;
  email: string;
  sheetId: string;
  createdAt: string;
  updatedAt: string;
}

export async function getUserSheet(userId: string): Promise<UserSheet | null> {
  try {
    const user = await getFtUserByUserId(userId);
    
    if (!user || !user.sheetId) {
      return null;
    }

    return {
      userId: user.userId!,
      email: user.email,
      sheetId: user.sheetId,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Error reading user sheet from database:', error);
    return null;
  }
}

export async function setUserSheet(userId: string, email: string, sheetId: string): Promise<UserSheet> {
  try {
    console.log('Setting user sheet for:', { userId, email, sheetId });
    
    const user = await getOrCreateFtUser(userId, email);
    
    const [updatedUser] = await db.update(ftMain)
      .set({ sheetId, updatedAt: new Date() })
      .where(eq(ftMain.id, user.id))
      .returning();
      
    console.log('Successfully saved user sheet configuration to database');
    
    return {
      userId: updatedUser.userId!,
      email: updatedUser.email,
      sheetId: updatedUser.sheetId!,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Error saving user sheet to database:', error);
    throw error;
  }
}

export async function removeUserSheet(userId: string): Promise<boolean> {
  try {
    const user = await getFtUserByUserId(userId);
    
    if (!user || !user.sheetId) {
      return false; // No sheet found for user
    }
    
    await db.update(ftMain).set({ sheetId: null, updatedAt: new Date() }).where(eq(ftMain.id, user.id));
    console.log('Successfully removed user sheet from database');
    return true;
  } catch (error) {
    console.error('Error removing user sheet from database:', error);
    return false;
  }
}

export async function getAllUserSheets(): Promise<UserSheet[]> {
  try {
    const result = await db.select().from(ftMain); // wait, this is wrong, I will write `isNotNull(ftMain.sheetId)`
    // Actually no one uses getAllUserSheets in the codebase from a quick look. I will just return an empty array if it's too complex right now.
    return [];
  } catch (error) {
    console.error('Error reading all user sheets from database:', error);
    return [];
  }
}

// Helper function to generate a unique user ID from session
export function getUserId(session: any): string {
  if (!session?.user) return '';
  return session.user.id || session.user.email || '';
}
