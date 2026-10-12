import { NextResponse } from 'next/server';
import { escapeHtml, notifyOwner, renderMail } from '@/lib/mailer';
import { clientIp, isAllowedOrigin, rateLimit } from '@/lib/rate-limit';

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\r\n]+/g, ' ').trim().slice(0, max) : '');

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (!rateLimit(`contact:${clientIp(req)}`)) return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': '600' } });

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 });
  }

  // Honeypot: botlara başarılı gibi yanıt ver, mail gönderme.
  if (b.website_hp) return NextResponse.json({ success: true });

  const name = clean(b.name, 100);
  const email = clean(b.email, 120).toLowerCase();
  const phone = clean(b.phone, 40);
  const channelUrl = clean(b.channelUrl, 300);
  const message = typeof b.message === 'string' ? b.message.trim().slice(0, 3000) : '';
  const lang = b.language === 'en' ? 'EN' : 'TR';

  if (name.length < 2 || !message) return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'invalid_email' }, { status: 422 });

  const html = renderMail(
    '🔔 Yeni İletişim / Analiz Talebi',
    [
      ['Ad Soyad', escapeHtml(name)],
      ['E-Posta', escapeHtml(email)],
      ['Telefon / WhatsApp', escapeHtml(phone)],
      ['Video / Kanal URL', escapeHtml(channelUrl)],
      ['Dil', lang],
      ['Mesaj', escapeHtml(message)],
    ],
    `Bu form <strong>medyapr.com</strong> üzerinden iletilmiştir • ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}`,
  );

  const result = await notifyOwner({ subject: `📬 Yeni Talep: ${name} — medyapr.com`, html, replyTo: email });
  if (!result.sent) return NextResponse.json({ error: 'mail_failed' }, { status: 502 });
  return NextResponse.json({ success: true });
}
