import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';
import { validate } from '@/lib/reservation';

export const dynamic = 'force-dynamic';

// Create a reservation (public)
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) return NextResponse.json({ error: 'validation', fields: result.errors }, { status: 422 });

  try {
    const ev = await prisma.event.findFirst({ where: { id: result.data.eventId, published: true, startsAt: { gt: new Date() } } });
    if (!ev) return NextResponse.json({ error: 'validation', fields: { eventId: 'errEvent' } }, { status: 422 });
    const r = await prisma.reservation.create({ data: result.data });
    return NextResponse.json({ id: r.id }, { status: 201 });
  } catch (e) {
    console.error('reservation create failed', e);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}

// List reservations (admin only): Authorization: Bearer <ADMIN_TOKEN>
export async function GET(req: Request) {
  const token = process.env.ADMIN_TOKEN;
  const bearer = !!token && req.headers.get('authorization') === `Bearer ${token}`;
  if (!bearer && !(await isAdmin())) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const items = await prisma.reservation.findMany({ include: { event: { select: { title: true, startsAt: true } } }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ items });
}
