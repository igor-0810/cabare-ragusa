import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { ReserveForm } from './ReserveForm';

export const dynamic = 'force-dynamic';

export default async function ReservePage() {
  const events = await prisma.event.findMany({
    where: { published: true, startsAt: { gt: new Date() } },
    orderBy: { startsAt: 'asc' },
    select: { id: true, title: true, startsAt: true },
  });
  return (
    <Suspense>
      <ReserveForm events={events.map((e) => ({ id: e.id, title: e.title, startsAt: e.startsAt.toISOString() }))} />
    </Suspense>
  );
}
