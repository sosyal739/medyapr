import { NextResponse } from 'next/server';
import { CURRENCIES, FORMATS, REGIONS, quote, parseYouTubeId, clampViews, type Currency, type Format, type Region } from '@/lib/pricing';
import { createOrder } from '@/lib/store';

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }

  const videoUrl = String(b.videoUrl ?? '').trim();
  const videoId = parseYouTubeId(videoUrl);
  const email = String(b.email ?? '').trim().toLowerCase();
  const name = String(b.name ?? '').trim().slice(0, 80);
  const contact = String(b.contact ?? '').trim().slice(0, 80) || undefined;
  const format = b.format as Format;
  const region = b.region as Region;
  const currency = b.currency as Currency;
  const payment = b.payment === 'iban' ? 'iban' : 'card';

  if (!videoId) return NextResponse.json({ error: 'invalid_video' }, { status: 422 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'invalid_email' }, { status: 422 });
  if (name.length < 2) return NextResponse.json({ error: 'invalid_name' }, { status: 422 });
  if (!FORMATS.includes(format) || !REGIONS.includes(region) || !CURRENCIES.includes(currency))
    return NextResponse.json({ error: 'invalid_options' }, { status: 422 });
  if (b.terms !== true) return NextResponse.json({ error: 'terms_required' }, { status: 422 });

  // Fiyat DAİMA sunucuda yeniden hesaplanır.
  const q = quote({ views: clampViews(Number(b.views)), format, region, currency });

  const order = await createOrder({
    email,
    name,
    contact,
    videoUrl,
    videoId,
    format,
    region,
    views: q.views,
    currency,
    total: q.total,
    payment,
  });
  return NextResponse.json({ id: order.id, total: order.total, currency: order.currency, payment: order.payment }, { status: 201 });
}
