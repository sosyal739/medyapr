import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { listOrders } from '@/lib/store';

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json(await listOrders());
}
