import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export const runtime = 'nodejs';

export async function getDashboardSummary() {
  const [clients, payments, expenses, packages, bookings] = await Promise.all([
    prisma.client.count(),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.package.count(),
    prisma.booking.count(),
  ]);

  return {
    clients,
    packages,
    bookings,
    totalIncome: Number(payments._sum.amount ?? 0),
    totalExpenses: Number(expenses._sum.amount ?? 0),
    profit: Number(payments._sum.amount ?? 0) - Number(expenses._sum.amount ?? 0)
  };
}

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export default prisma;
