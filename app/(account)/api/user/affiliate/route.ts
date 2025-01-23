import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/app/(auth)/auth';
import { 
  getAffiliateByUserId, 
  generateUniqueAffiliateCode, 
  createAffiliate,
  updateAffiliateCode 
} from '@/lib/db/affiliate-queries';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingAffiliate = await getAffiliateByUserId(session.user.id);

    if (existingAffiliate) {
      return NextResponse.json({ code: existingAffiliate.code });
    }

    // Generate new code and create affiliate
    const newCode = await generateUniqueAffiliateCode(session.user.email);
    const newAffiliate = await createAffiliate(session.user.id, newCode);

    return NextResponse.json({ code: newAffiliate.code });
  } catch (error) {
    console.error('Error handling affiliate request:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await req.json();
    
    // Validate code format
    if (!code || code.length !== 7) {
      return NextResponse.json({ error: "Invalid code format" }, { status: 400 });
    }

    try {
      // Update affiliate code
      const updated = await updateAffiliateCode(session.user.id, code);
      return NextResponse.json({ code: updated.code });
    } catch (error) {
      if (error instanceof Error && error.message === "Code already taken") {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating affiliate code:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
