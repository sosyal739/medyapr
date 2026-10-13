import { NextResponse } from 'next/server';
import { CURRENCIES, FORMATS, PACKAGES, REGIONS, quote, parseYouTubeId, clampViews, type Currency, type Format, type Package, type Region } from '@/lib/pricing';
import { createOrder } from '@/lib/store';
import { getVideoInfo } from '@/lib/youtube';
import { escapeHtml, notifyOwner, renderMail } from '@/lib/mailer';
import { clientIp, isAllowedOrigin, rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (!rateLimit(`order:${clientIp(req)}`, 8)) return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': '600' } });

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
  const pkg = (PACKAGES.includes(b.pkg as Package) ? b.pkg : 'views') as Package;
  const region = b.region as Region;
  const currency = b.currency as Currency;
  const payment = 'iban' as const; // Kart ödemesi şu an kapalı.

  if (!videoId) return NextResponse.json({ error: 'invalid_video' }, { status: 422 });
  // Siparişler WhatsApp/Telegram üzerinden yürür: iletişim zorunlu, e-posta isteğe bağlı.
  if (!contact || contact.replace(/[^\w@+]/g, '').length < 5) return NextResponse.json({ error: 'invalid_contact' }, { status: 422 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'invalid_email' }, { status: 422 });
  if (name.length < 2) return NextResponse.json({ error: 'invalid_name' }, { status: 422 });
  if (!FORMATS.includes(format) || !REGIONS.includes(region) || !CURRENCIES.includes(currency))
    return NextResponse.json({ error: 'invalid_options' }, { status: 422 });
  if (b.terms !== true) return NextResponse.json({ error: 'terms_required' }, { status: 422 });

  // Video gerçekten var mı? Ağ hatasında (undefined) siparişi engelleme.
  const video = await getVideoInfo(videoId);
  if (video === null) return NextResponse.json({ error: 'video_not_found' }, { status: 422 });

  // Fiyat DAİMA sunucuda yeniden hesaplanır.
  const q = quote({ views: clampViews(Number(b.views)), format, pkg, region, currency });

  const order = await createOrder({
    email,
    name,
    contact,
    videoUrl,
    videoId,
    format,
    pkg,
    region,
    views: q.views,
    currency,
    total: q.total,
    payment,
    videoTitle: video?.title || undefined,
    startViews: video?.views,
  });
  // Bildirim: başarısız olsa bile sipariş kaydı etkilenmez (notifyOwner fırlatmaz).
  const fmt = (n: number) => new Intl.NumberFormat('tr-TR').format(n);
  await notifyOwner({
    subject: `🛒 Yeni Sipariş ${order.id}: ${order.name} — ${fmt(order.total)} ${order.currency}`,
    replyTo: email || undefined,
    html: renderMail(
      '🛒 Yeni Sipariş Alındı',
      [
        ['Takip Kodu', escapeHtml(order.id)],
        ['Ad Soyad', escapeHtml(name)],
        ['WhatsApp / Telegram', escapeHtml(contact)],
        ['E-Posta', escapeHtml(email)],
        ['Video', escapeHtml(video?.title ? `${video.title} — ${video.channel}
${videoUrl}` : videoUrl)],
        ['Başlangıç İzlenmesi', video?.views !== undefined ? fmt(video.views) : ''],
        ['Paket', escapeHtml(`${order.pkg ?? 'views'} • ${order.format} • ${order.region} • ${fmt(order.views)} izlenme`)],
        ['Tutar', escapeHtml(`${fmt(order.total)} ${order.currency}`)],
        ['Ödeme', order.payment === 'iban' ? 'IBAN / Havale' : 'Kart'],
        ['Takip Linki', `https://medyapr.com/tr/track/${escapeHtml(order.id)}`],
      ],
      `Bu bildirim <strong>medyapr.com</strong> sipariş formundan gönderildi • ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}`,
    ),
  });

  return NextResponse.json({ id: order.id, total: order.total, currency: order.currency, payment: order.payment }, { status: 201 });
}
