/** Tek WhatsApp numarası; ön görüşme ve iletişim butonları buradan link üretir. */
export const WHATSAPP_NUMBER = '905312993355';
export const PUBLIC_EMAIL = 'info@medyapr.com';

export function consultHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Telegram: WhatsApp ile aynı numara (telefon numarası bağlantısı + hazır mesaj desteği). */
export const TELEGRAM_URL = `https://t.me/+${WHATSAPP_NUMBER}`;
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function telegramHref(message?: string): string {
  if (!message) return TELEGRAM_URL;
  return `${TELEGRAM_URL}?text=${encodeURIComponent(message)}`;
}

export function mailtoHref(subject: string, body: string): string {
  return `mailto:${PUBLIC_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

