import { NextResponse } from 'next/server';
import { auth } from "@/app/(auth)/auth";
import GoogleProvider from "next-auth/providers/google";
import { getOrCreateFtUser, getFtUserByUserId, createFtExpense, updateFtExpense, deleteFtExpense, createFtIncome, updateFtIncome, deleteFtIncome, createFtBudget, upsertFtBudget, deleteFtBudget, updateUserCategories, updateUserBudget } from '@/lib/db/queries';

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: any) {
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

// GET - Retrieve user's custom categories
export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({
        message: 'Unauthorized',
        error: 'You must be logged in to access categories'
      }, { status: 401 });
    }

    const user = await getOrCreateFtUser(session.user.id!, session.user.email!);

    if (!user) {
      return NextResponse.json({
        message: 'User not found',
        error: 'User account not found'
      }, { status: 404 });
    }

    // Parse categories from database (stored as JSON strings)
    const expenseCategories = user.expenseCategories || [];
    const incomeCategories = user.incomeCategories || [];

    return NextResponse.json({
      message: 'Categories retrieved successfully',
      expenseCategories: expenseCategories,
      incomeCategories: incomeCategories
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting user categories:', error);
    return NextResponse.json({
      message: 'Error retrieving categories',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT - Update user's custom categories
export async function PUT(req: Request) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({
        message: 'Unauthorized',
        error: 'You must be logged in to update categories'
      }, { status: 401 });
    }

    const user = await getOrCreateFtUser(session.user.id!, session.user.email);
    if (!user) {
      return NextResponse.json({
        message: 'User not found',
        error: 'User account not found'
      }, { status: 404 });
    }

    const body = await req.json();
    const { expenseCategories, incomeCategories } = body;

    // Validate input
    if (!Array.isArray(expenseCategories) || !Array.isArray(incomeCategories)) {
      return NextResponse.json({
        message: 'Invalid input',
        error: 'Both expenseCategories and incomeCategories must be arrays'
      }, { status: 400 });
    }

    // Update user categories in database
    const updatedUser = await updateUserCategories(user.userId!,
      expenseCategories,
      incomeCategories
    );

    return NextResponse.json({
      message: 'Categories updated successfully',
      expenseCategories: updatedUser.expenseCategories,
      incomeCategories: updatedUser.incomeCategories
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating user categories:', error);
    return NextResponse.json({
      message: 'Error updating categories',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
