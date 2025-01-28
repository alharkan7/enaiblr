import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/app/(auth)/auth';
import { getAffiliateTransactions } from '@/lib/db/affiliate-queries';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the affiliate code from query params
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: "Affiliate code is required" }, { status: 400 });
    }

    // Pass the user ID directly instead of looking it up through affiliate code
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
