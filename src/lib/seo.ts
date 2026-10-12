export const SITE_URL = 'https://medyapr.com';

/**
 * Üretilen sayfa için kesin ve eksiksiz canonical ve hreflang alternates nesnesi döner.
 * @param locale 'tr' | 'en'
 * @param path Sayfa yolu (örn: '/blog', '/trendler', '/sanatcilar')
 */
export function getPageAlternates(locale: string, path: string = '') {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const currentUrl = `${SITE_URL}/${locale}${cleanPath}`;
  const trUrl = `${SITE_URL}/tr${cleanPath}`;
  const enUrl = `${SITE_URL}/en${cleanPath}`;

  // /en içerikleri tam çevrilene kadar noindex (middleware) ve hreflang'dan çıkarıldı.
  // Çeviri tamamlanınca languages: { tr: trUrl, en: enUrl, 'x-default': trUrl } geri eklenecek.
  void trUrl;
  void enUrl;
  return {
    canonical: currentUrl,
  };
}

/**
 * Türkçe tarih metnini (örn: "9 Ekim 2026") arama motorları için ISO-8601 (YYYY-MM-DD) formatına çevirir.
 */
export function toIsoDateString(dateStr?: string): string {
  if (!dateStr) return '2026-10-10';
  const months: Record<string, string> = {
    Ocak: '01', Şubat: '02', Mart: '03', Nisan: '04', Mayıs: '05', Haziran: '06',
    Temmuz: '07', Ağustos: '08', Eylül: '09', Ekim: '10', Kasım: '11', Aralık: '12',
  };
  const parts = dateStr.trim().split(' ');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]] || '10';
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return '2026-10-10';
}
