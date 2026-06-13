import { NextResponse } from 'next/server';
import { auth } from "@/app/(auth)/auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from '@/lib/db';
import { ftExpenses, ftIncomes, ftBudgets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getOrCreateFtUser, getFtUserByUserId, createFtExpense, updateFtExpense, deleteFtExpense, createFtIncome, updateFtIncome, deleteFtIncome, createFtBudget, upsertFtBudget, deleteFtBudget, updateUserCategories, updateUserBudget } from '@/lib/db/queries';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({
        message: 'Unauthorized',
        error: 'You must be logged in to fetch budget data'
      }, { status: 401 });
    }

    // Get user from database
    const user = await getOrCreateFtUser(session.user.id!, session.user.email!);
    if (!user) {
      return NextResponse.json({
        message: 'User not found',
        error: 'Your account could not be found in the database'
      }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Fetch budgets from database
    const budgets = await getFtUserByUserId(user.userId!).then(u => db.select().from(ftBudgets).where(eq(ftBudgets.userId, u.id)));

    return NextResponse.json({
      budgets,
      message: budgets.length > 0 ? 'Budget data fetched successfully' : 'No budget data found'
    });

  } catch (error: any) {
    console.error('Error fetching budget data:', error);

    return NextResponse.json({
      message: 'Error fetching budget data',
      errorType: 'DATABASE_ERROR',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
