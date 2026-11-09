import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Upcoming published events (public)
export async function GET() {
  const items = await prisma.event.findMany({
    where: { published: true, startsAt: { gt: new Date() } },
    orderBy: { startsAt: 'asc' },
    select: { id: true, title: true, startsAt: true, location: true, priceGold: true, priceSilver: true, priceRed: true },
  });
  return NextResponse.json({ items });
}
