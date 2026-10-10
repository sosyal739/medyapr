import { timingSafeEqual } from 'crypto';

/** ADMIN_PASSWORD .env.local'da tanımlı olmalı; tanımsızsa admin kapalı. */
export function isAdmin(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const got = req.headers.get('x-admin-key') ?? '';
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
