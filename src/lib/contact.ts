/** Tek WhatsApp numarası; ön görüşme ve iletişim butonları buradan link üretir. */
export const WHATSAPP_NUMBER = '905312993355';

export function consultHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Telegram: WhatsApp ile aynı numara (telefon numarası bağlantısı). */
export const TELEGRAM_URL = `https://t.me/+${WHATSAPP_NUMBER}`;
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
