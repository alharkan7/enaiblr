import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/app/(auth)/auth';
import { getAffiliateTransactions } from '@/lib/db/affiliate-queries';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pass the user ID directly to get their transactions
    const transactions = await getAffiliateTransactions(session.user.id);
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching affiliate transactions:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
