import { NextResponse } from 'next/server';
import { CURRENCIES, FORMATS, PACKAGES, REGIONS, quote, parseYouTubeId, clampViews, type Currency, type Format, type Package, type Region } from '@/lib/pricing';
import { countryName, isCountryCode } from '@/lib/countries';
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
  const channel = (['whatsapp', 'telegram', 'email'].includes(String(b.channel)) ? String(b.channel) : 'whatsapp') as
    | 'whatsapp'
    | 'telegram'
    | 'email';
  const email = String(b.email ?? '').trim().toLowerCase();
  const rawName = String(b.name ?? '').trim().slice(0, 80);
  const contact = String(b.contact ?? '').trim().slice(0, 80) || undefined;
  const note = String(b.note ?? '').trim().slice(0, 400) || undefined;
  const visitorLocale = ['tr', 'en', 'ar'].includes(String(b.locale)) ? String(b.locale) : 'tr';
  const LANG_NAME: Record<string, string> = { tr: 'Türkçe', en: 'İngilizce', ar: 'Arapça' };
  const format = (FORMATS.includes(b.format as Format) ? b.format : 'instream') as Format;
  const pkg = (PACKAGES.includes(b.pkg as Package) ? b.pkg : 'views') as Package;
  const region = (REGIONS.includes(b.region as Region) ? b.region : 'tr') as Region;
  const country = region === 'premium' && isCountryCode(b.country) ? String(b.country).toUpperCase() : undefined;
  const currency = (CURRENCIES.includes(b.currency as Currency) ? b.currency : 'TRY') as Currency;
  const payment = 'iban' as const;

  if (!videoId) return NextResponse.json({ error: 'invalid_video' }, { status: 422 });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const contactValid = !!contact && contact.replace(/[^\w@+]/g, '').length >= 5;

  if (channel === 'email') {
    if (!emailValid) return NextResponse.json({ error: 'invalid_email' }, { status: 422 });
  } else if (email && !emailValid) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 422 });
  }

  const name =
    rawName.length >= 2
      ? rawName
      : emailValid
        ? email.split('@')[0]
        : contactValid
          ? contact!
          : channel === 'telegram'
            ? 'Telegram Analiz Talebi'
            : 'WhatsApp Analiz Talebi';

  // Video gerçekten var mı? Ağ hatasında (undefined) siparişi engelleme.
  const video = await getVideoInfo(videoId);
  if (video === null) return NextResponse.json({ error: 'video_not_found' }, { status: 422 });

  // Fiyat DAİMA sunucuda yeniden hesaplanır.
  const q = quote({ views: clampViews(Number(b.views)), format, pkg, region, currency, country });

  const channelLabel =
    channel === 'email' ? '✉️ E-Posta (Mail) ile Analiz' : channel === 'telegram' ? '✈️ Telegram ile Analiz' : '💬 WhatsApp ile Analiz';

  const order = await createOrder({
    email,
    name,
    contact: contact || (channel === 'email' ? email : channelLabel),
    videoUrl,
    videoId,
    format,
    pkg,
    region,
    views: q.views,
    currency,
    total: q.total,
    payment,
    paymentNote: note ? `${channelLabel} — Not: ${note}` : channelLabel,
    videoTitle: video?.title || undefined,
    startViews: video?.views,
  });

  // Bildirim: başarısız olsa bile sipariş kaydı etkilenmez (notifyOwner fırlatmaz).
  const fmt = (n: number) => new Intl.NumberFormat('tr-TR').format(n);
  await notifyOwner({
    subject: `[${visitorLocale.toUpperCase()}] 🎯 Yeni Teklif & Analiz Talebi (${channel.toUpperCase()}) ${order.id}: ${order.name} — ${fmt(order.total)} ${order.currency}`,
    replyTo: emailValid ? email : undefined,
    html: renderMail(
      `🎯 Yeni Video Analiz & Teklif Talebi (${channelLabel})`,
      [
        ['Takip Kodu', escapeHtml(order.id)],
        ['İletişim Kanalı', escapeHtml(channelLabel)],
        ['Ziyaretçi Dili', escapeHtml(LANG_NAME[visitorLocale])],
        ['Talep', 'YouTube videosu için PR / reklam çalışması planlıyor; videonun analiz edilip teklif verilmesini bekliyor.'],
        ['Ad / Sanatçı', escapeHtml(name)],
        ['E-Posta', escapeHtml(email)],
        ['WhatsApp / Telegram', escapeHtml(contact || '')],
        ['Müşteri Notu', escapeHtml(note || '')],
        ['Video', escapeHtml(video?.title ? `${video.title} — ${video.channel}\n${videoUrl}` : videoUrl)],
        ['Kanal', escapeHtml(video?.channel || '')],
        ['Yayın Tarihi', video?.publishedAt ? new Date(video.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''],
        ['Süre', video?.durationSec ? `${Math.floor(video.durationSec / 60)}:${String(video.durationSec % 60).padStart(2, '0')}` : ''],
        ['Başlangıç İzlenmesi', video?.views !== undefined ? fmt(video.views) : ''],
        ['Beğeni', video?.likes !== undefined ? fmt(video.likes) + (video.views ? ` (%${((video.likes / video.views) * 100).toFixed(1)})` : '') : ''],
        ['Yorum', video?.comments !== undefined ? fmt(video.comments) : ''],
        ['Hedef Ülke', region === 'premium' ? escapeHtml(`${country ? countryName(country, 'tr') : 'Belirtilmedi'}`) : region === 'global' ? 'Global (tüm ülkeler karışık)' : 'Türkiye (Türkçe konuşanlar)'],
        ['Seçilen Paket', escapeHtml(`${order.pkg ?? 'views'} • ${order.format} • ${order.region} • ${fmt(order.views)} izlenme`)],
        ['Tahmini Tutar', escapeHtml(`${fmt(order.total)} ${order.currency} (Video uzunluğuna göre değişebilir)`)],
        ['Takip Linki', `https://medyapr.com/tr/track/${escapeHtml(order.id)}`],
      ],
      `Bu bildirim <strong>medyapr.com</strong> teklif ve analiz sayfasından gönderildi • ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}`,
    ),
  });

  return NextResponse.json({ id: order.id, total: order.total, currency: order.currency, payment: order.payment, channel }, { status: 201 });
}

