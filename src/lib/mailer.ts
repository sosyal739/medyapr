/**
 * Bildirim e-postaları — salihmaral.de ile aynı otomasyon:
 * ana kanal IONOS SMTP (nodemailer), SMTP düşerse Resend yedeği.
 * Gizli bilgiler yalnızca ortam değişkenlerinden okunur (Vercel → Settings → Environment Variables):
 *   SMTP_HOST (ops., varsayılan smtp.ionos.de), SMTP_PORT (ops., 587), SMTP_USER, SMTP_PASS,
 *   CONTACT_EMAIL (bildirimin gideceği adres), RESEND_API_KEY (ops.), RESEND_FALLBACK_EMAIL (ops.)
 */
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export function escapeHtml(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export type Notification = {
  subject: string;
  html: string;
  replyTo?: string;
};

export type SendResult = { sent: boolean; provider: 'smtp' | 'resend' | 'none'; id?: string };

function recipient(): string {
  return process.env.CONTACT_EMAIL || 'salihmaralde@gmail.com';
}

/** Yönetici bildirimini gönderir. Asla fırlatmaz: sipariş/form kaydı mail hatası yüzünden bozulmamalı. */
export async function notifyOwner({ subject, html, replyTo }: Notification): Promise<SendResult> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ionos.de',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false,
        auth: { user, pass },
      });
      const res = await transporter.sendMail({
        from: `"MedyaPR Web Sitesi" <${user}>`,
        to: recipient(),
        replyTo,
        subject,
        html,
      });
      return { sent: true, provider: 'smtp', id: res.messageId };
    } catch (err) {
      console.error('[mailer] SMTP failed, trying Resend fallback:', err);
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const res = await resend.emails.send({
        from: 'MedyaPR Website <onboarding@resend.dev>',
        to: process.env.RESEND_FALLBACK_EMAIL || recipient(),
        replyTo,
        subject: `[Yedek Kanal] ${subject}`,
        html,
      });
      return { sent: true, provider: 'resend', id: res.data?.id };
    } catch (err) {
      console.error('[mailer] Resend failed:', err);
    }
  }

  console.error('[mailer] No mail provider delivered. Check SMTP_USER/SMTP_PASS or RESEND_API_KEY.');
  return { sent: false, provider: 'none' };
}

/** Basit kart düzeni; tüm değerler çağıran tarafından escapeHtml'den geçmiş olmalı. */
export function renderMail(title: string, rows: Array<[label: string, value: string]>, footer: string): string {
  const fields = rows
    .filter(([, v]) => v)
    .map(
      ([label, value]) => `
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;color:#64748b;margin-bottom:6px">${label}</div>
        <div style="font-size:15px;font-weight:600;color:#0f172a;background:#f8fafc;padding:12px 16px;border-radius:8px;border-left:4px solid #FF0033;white-space:pre-wrap">${value}</div>
      </div>`,
    )
    .join('');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:#f1f5f9;margin:0;padding:20px;color:#1e293b">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
    <div style="background:linear-gradient(135deg,#7f1d1d 0%,#FF0033 100%);padding:24px;text-align:center;color:#fff">
      <h1 style="margin:0;font-size:22px;font-weight:800">${title}</h1>
    </div>
    <div style="padding:28px">${fields}</div>
    <div style="background:#f8fafc;padding:16px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0">${footer}</div>
  </div>
</body></html>`;
}
