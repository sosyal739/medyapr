/** Tek WhatsApp numarası; ön görüşme ve iletişim butonları buradan link üretir. */
export const WHATSAPP_NUMBER = '905312993355';
export const PUBLIC_EMAIL = 'info@medyapr.com';

/** wa.me ara sayfasında soru işareti () oluşmaması için mesajdaki emoji karakterlerini temizler. */
function cleanChatMessage(message: string): string {
  return message
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F]/gu, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/^ +/gm, '')
    .trim();
}

export function consultHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(cleanChatMessage(message))}`;
}

/** Telegram: WhatsApp ile aynı numara (telefon numarası bağlantısı + hazır mesaj desteği). */
export const TELEGRAM_URL = `https://t.me/+${WHATSAPP_NUMBER}`;
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function telegramHref(message?: string): string {
  if (!message) return TELEGRAM_URL;
  return `${TELEGRAM_URL}?text=${encodeURIComponent(cleanChatMessage(message))}`;
}

export function mailtoHref(subject: string, body: string): string {
  return `mailto:${PUBLIC_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(cleanChatMessage(body))}`;
}


