import { intlLocale, locales, type Locale } from '@/lib/i18n/config';

export const SITE_URL = 'https://medyapr.com';

/** Türkiye/İngilizce dünyasına özgü sayfalar (sanatçı, klip): Arapça sürümü yoktur. */
export const TR_EN: readonly Locale[] = ['tr', 'en'];

/**
 * Üretilen sayfa için kesin ve eksiksiz canonical ve hreflang alternates nesnesi döner.
 * Yalnızca sayfanın gerçekten var olduğu dilleri listeler; olmayan bir çeviriye hreflang verilmez.
 * @param locale 'tr' | 'en' | 'ar'
 * @param path Sayfa yolu (örn: '/blog', '/trendler', '/sanatcilar')
 * @param available Sayfanın yayınlandığı diller (varsayılan: hepsi)
 */
export function getPageAlternates(locale: string, path: string = '', available: readonly Locale[] = locales) {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const url = (l: string) => `${SITE_URL}/${l}${cleanPath}`;
  const languages: Record<string, string> = Object.fromEntries(available.map((l) => [l, url(l)]));
  languages['x-default'] = url(available.includes('tr') ? 'tr' : available[0]);

  return {
    canonical: url(locale),
    languages,
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

/** "13 Ekim 2026" biçimindeki kaydı dile uygun gösterir (EN: "October 13, 2026"). */
export function displayDate(dateStr: string | undefined, locale: string): string {
  if (!dateStr || locale === 'tr') return dateStr ?? '';
  const iso = toIsoDateString(dateStr);
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(intlLocale(locale), { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}
