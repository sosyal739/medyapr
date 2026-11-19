/**
 * YouTube küçük resimleri (i.ytimg.com) YouTube tarafından zaten küçültülmüş JPEG olarak gelir.
 * Vercel görsel optimizasyonundan geçirmek ücretsiz kotayı (ayda 5.000 dönüşüm) tüketiyordu
 * (Kasım 2026: kotanın büyük kısmı). Bu görseller `unoptimized` ile doğrudan YouTube'dan yüklenir.
 */
export function isYouTubeThumb(src: unknown): boolean {
  return typeof src === 'string' && /^https:\/\/(i\d?\.ytimg\.com|img\.youtube\.com)\//.test(src);
}
