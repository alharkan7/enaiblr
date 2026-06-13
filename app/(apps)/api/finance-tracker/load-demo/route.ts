import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { db } from '@/lib/db';
import { ftExpenses, ftIncomes, ftBudgets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getOrCreateFtUser } from '@/lib/db/queries';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getOrCreateFtUser(session.user.id!, session.user.email);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const userId = user.id;

    // Delete existing data to ensure a clean demo state
    await db.delete(ftExpenses).where(eq(ftExpenses.userId, userId));
    await db.delete(ftIncomes).where(eq(ftIncomes.userId, userId));
    await db.delete(ftBudgets).where(eq(ftBudgets.userId, userId));

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const formatDate = (day: number) => {
      return new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    };

    // Insert Demo Incomes
    await db.insert(ftIncomes).values([
      { userId, amount: '15000000', category: 'Gaji', date: formatDate(1), description: 'Gaji Bulanan' },
      { userId, amount: '2500000', category: 'Lain-lain', date: formatDate(10), description: 'Bonus Proyek' },
    ]);

    // Insert Demo Expenses
    await db.insert(ftExpenses).values([
      { userId, amount: '3500000', category: 'Makanan', date: formatDate(3), description: 'Belanja Dapur' },
      { userId, amount: '1200000', category: 'Transportasi', date: formatDate(5), description: 'Bensin & Tol' },
      { userId, amount: '2000000', category: 'Hiburan', date: formatDate(12), description: 'Nonton & Makan di luar' },
      { userId, amount: '500000', category: 'Tagihan', date: formatDate(15), description: 'Listrik & Air' },
      { userId, amount: '800000', category: 'Pakaian', date: formatDate(18), description: 'Beli Sepatu' },
      { userId, amount: '300000', category: 'Kesehatan', date: formatDate(20), description: 'Vitamin & Obat' },
      { userId, amount: '1000000', category: 'Edukasi', date: formatDate(22), description: 'Kursus Online' },
    ]);

    // Insert Demo Budget
    await db.insert(ftBudgets).values([
      { userId, amount: '10000000', date: formatDate(1), timestamp: new Date() },
    ]);

    return NextResponse.json({ message: 'Demo data loaded successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error loading demo data:', error);
    return NextResponse.json({ error: 'Failed to load demo data' }, { status: 500 });
  }
}
