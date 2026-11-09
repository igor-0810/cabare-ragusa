'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { checkPassword, endSession, isAdmin, startSession } from '@/lib/admin-auth';

async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login');
}

export async function login(_: unknown, fd: FormData) {
  if (!checkPassword(String(fd.get('password') ?? ''))) return { error: 'Погрешна лозинка.' };
  await startSession();
  redirect('/admin');
}

export async function logout() {
  await endSession();
  redirect('/admin/login');
}

const optInt = (v: FormDataEntryValue | null) => {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isInteger(n) && n >= 0 ? n : null;
};
const optStr = (v: FormDataEntryValue | null, max: number) => String(v ?? '').trim().slice(0, max) || null;

export async function createEvent(_: unknown, fd: FormData) {
  await requireAdmin();
  const title = String(fd.get('title') ?? '').trim().slice(0, 160);
  const startsAt = new Date(String(fd.get('startsAt') ?? ''));
  if (title.length < 2) return { error: 'Внеси наслов.' };
  if (isNaN(startsAt.getTime())) return { error: 'Внеси валиден датум и час.' };

  await prisma.event.create({
    data: {
      title,
      startsAt,
      location: optStr(fd.get('location'), 200),
      description: optStr(fd.get('description'), 1000),
      priceGold: optInt(fd.get('priceGold')),
      priceSilver: optInt(fd.get('priceSilver')),
      priceRed: optInt(fd.get('priceRed')),
      published: fd.get('published') === 'on',
    },
  });
  revalidatePath('/admin');
  return { ok: true };
}

export async function togglePublished(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get('id'));
  const ev = await prisma.event.findUnique({ where: { id } });
  if (ev) await prisma.event.update({ where: { id }, data: { published: !ev.published } });
  revalidatePath('/admin');
}

export async function deleteEvent(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get('id'));
  // Only events without reservations can be removed (FK is RESTRICT)
  const n = await prisma.reservation.count({ where: { eventId: id } });
  if (n === 0) await prisma.event.delete({ where: { id } });
  revalidatePath('/admin');
}

export async function setStatus(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get('id'));
  const status = String(fd.get('status'));
  if (!['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) return;
  await prisma.reservation.update({ where: { id }, data: { status: status as 'PENDING' } });
  revalidatePath('/admin');
}
