import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { updateOrder, upsertStat, type OrderStatus } from '@/lib/store';

const STATUSES: OrderStatus[] = ['pending_payment', 'payment_review', 'queued', 'running', 'completed', 'cancelled'];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { id } = await params;
  const b = await req.json().catch(() => ({}));

  if (b.stat) {
    const date = String(b.stat.date ?? '');
    const views = Number(b.stat.views);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(views) || views < 0)
      return NextResponse.json({ error: 'invalid_stat' }, { status: 422 });
    const spend = b.stat.spend === '' || b.stat.spend == null ? undefined : Number(b.stat.spend);
    const o = await upsertStat(id, { date, views: Math.round(views), spend });
    return o ? NextResponse.json(o) : NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const patch: Record<string, unknown> = {};
  if (b.status !== undefined) {
    if (!STATUSES.includes(b.status)) return NextResponse.json({ error: 'invalid_status' }, { status: 422 });
    patch.status = b.status;
  }
  if (b.adminNote !== undefined) patch.adminNote = String(b.adminNote).slice(0, 500);
  if (b.startViews !== undefined) patch.startViews = Math.max(0, Math.round(Number(b.startViews)));
  const o = await updateOrder(id, patch);
  return o ? NextResponse.json(o) : NextResponse.json({ error: 'not_found' }, { status: 404 });
}
