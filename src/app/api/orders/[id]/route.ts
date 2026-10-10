import { NextResponse } from 'next/server';
import { getOrder, publicView } from '@/lib/store';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id.toUpperCase());
  if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json(publicView(order));
}
