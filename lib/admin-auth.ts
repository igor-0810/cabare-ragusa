import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'admin_session';

function sign(): string | null {
  const secret = process.env.ADMIN_TOKEN;
  if (!secret) return null;
  return createHmac('sha256', secret).update('cabaret-admin-session').digest('hex');
}

function safeEq(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(input: string) {
  const secret = process.env.ADMIN_TOKEN;
  return !!secret && safeEq(input, secret);
}

export async function isAdmin() {
  const expected = sign();
  const got = (await cookies()).get(COOKIE)?.value;
  return !!expected && !!got && safeEq(got, expected);
}

export async function startSession() {
  const v = sign();
  if (!v) return;
  (await cookies()).set(COOKIE, v, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}
