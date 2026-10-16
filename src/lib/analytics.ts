/** GA4 olayı gönder. Çerez izni verilmemişse gtag zaten veriyi saklamaz (Consent Mode v2). */
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  try {
    w.gtag?.('event', name, params);
  } catch {
    // ölçüm hatası kullanıcı akışını bozmamalı
  }
}
