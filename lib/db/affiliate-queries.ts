import 'server-only';
import { eq, and, not, desc } from 'drizzle-orm';
import { db } from './';
import { affiliate, user, transactions } from './schema';

export async function getAffiliateByUserId(userId: string) {
  try {
    const results = await db.select().from(affiliate).where(eq(affiliate.userId, userId));
    return results[0];
  } catch (error) {
    console.error('Failed to get affiliate from database');
    throw error;
  }
}

export async function getAffiliateByCode(code: string) {
  try {
    const results = await db.select().from(affiliate).where(eq(affiliate.code, code));
    return results[0];
  } catch (error) {
    console.error('Failed to get affiliate from database');
    throw error;
  }
}

export async function createAffiliate(userId: string, code: string) {
  try {
    // Check if code is already taken
    const existing = await getAffiliateByCode(code);
    if (existing) {
      throw new Error("Code already taken");
    }

    const [newAffiliate] = await db.insert(affiliate)
      .values({
        userId,
        code,
        createdAt: new Date(),
      })
      .returning();
    return newAffiliate;
  } catch (error) {
    if (error instanceof Error && error.message === "Code already taken") {
      throw error;
    }
    console.error('Failed to create affiliate');
    throw new Error("Failed to create affiliate");
  }
}

export async function updateAffiliateCode(userId: string, code: string) {
  try {
    // Check if code is already taken by another user
    const existing = await db.select()
      .from(affiliate)
      .where(and(
        eq(affiliate.code, code),
        not(eq(affiliate.userId, userId)) // Make sure it's not the current user's code
      ));

    if (existing.length > 0) {
      throw new Error("Code already taken");
    }

    const [updated] = await db
      .update(affiliate)
      .set({ code })
      .where(eq(affiliate.userId, userId))
      .returning();
    return updated;
  } catch (error) {
    if (error instanceof Error && error.message === "Code already taken") {
      throw error;
    }
    console.error('Failed to update affiliate code');
    throw new Error("Failed to update affiliate code");
  }
}

// Helper function to generate unique affiliate code
export async function generateUniqueAffiliateCode(email: string): Promise<string> {
  const generateCode = (email: string): string => {
    const prefix = email.substring(0, 4).toUpperCase();
    const number = Math.floor(Math.random() * 900) + 100; // generates 3 digit number
    return `${prefix}${number}`;
  };

  let code: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10; // Prevent infinite loop
  
  while (!isUnique && attempts < maxAttempts) {
    code = generateCode(email);
    const existing = await getAffiliateByCode(code);
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error("Failed to generate unique code after multiple attempts");
  }

  return code!;
}

export type AffiliateTransaction = {
  email: string;
  date: Date;
  amount: number;
  status: string;
}

export async function getAffiliateTransactions(userId: string): Promise<AffiliateTransaction[]> {
  try {
    const results = await db
      .select({
        email: user.email,
        date: transactions.createdAt,
        amount: transactions.commission,
        status: transactions.status,
      })
      .from(transactions)
      .innerJoin(user, eq(transactions.userId, user.id))
      .where(
        and(
          eq(transactions.affiliator, userId),
          eq(transactions.status, 'success')
        )
      )
      .orderBy(desc(transactions.createdAt));

    return results.map(result => ({
      ...result,
      amount: Number(result.amount) || 0, // Convert numeric to number, default to 0 if null
    }));
  } catch (error) {
    console.error('Error getting affiliate transactions:', error);
    throw error;
  }
}
