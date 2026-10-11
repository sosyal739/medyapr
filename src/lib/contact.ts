/** Tek WhatsApp numarası; ön görüşme ve iletişim butonları buradan link üretir. */
export const WHATSAPP_NUMBER = '905312993355';

export function consultHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
