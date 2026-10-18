/**
 * "Diğer ülkeler" seçeneği için ülke listesi ve fiyat grubu.
 * - Avrupa (AB + EFTA + İngiltere), ABD ve Kanada: yüksek fiyat grubu (Premium tablosu).
 * - Diğer tüm ülkeler: Türkiye fiyatı.
 * Ülke adları tarayıcı/sunucunun Intl.DisplayNames'i ile dile göre üretilir (ayrı çeviri listesi gerekmez).
 */

/** Yüksek fiyat grubu: AB üyeleri, EFTA, İngiltere, ABD, Kanada. */
export const HIGH_PRICE_COUNTRIES: ReadonlySet<string> = new Set([
  // AB
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // EFTA + İngiltere
  'CH', 'NO', 'IS', 'LI', 'GB',
  // Kuzey Amerika
  'US', 'CA',
]);

/** Listenin başında gösterilen, Türkçe konuşan nüfusun yoğun olduğu ülkeler. */
export const POPULAR_COUNTRIES = ['DE', 'NL', 'BE', 'FR', 'AT', 'CH', 'GB', 'US', 'CA', 'AZ', 'SE', 'DK', 'AU', 'SA', 'AE', 'IQ', 'CY'] as const;

/** Türkiye hariç ISO 3166-1 alfa-2 ülke kodları. */
export const COUNTRY_CODES = [
  'AF', 'AL', 'DZ', 'AD', 'AO', 'AG', 'AR', 'AM', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BT', 'BO', 'BA', 'BW', 'BR', 'BN', 'BG',
  'BF', 'BI', 'CV', 'KH', 'CM', 'CA', 'CF', 'TD', 'CL', 'CN', 'CO', 'KM', 'CG', 'CD', 'CR', 'CI', 'HR', 'CU', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG',
  'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FJ', 'FI', 'FR', 'GA', 'GM', 'GE', 'DE', 'GH', 'GR', 'GD', 'GT', 'GN', 'GW', 'GY', 'HT', 'HN', 'HK', 'HU', 'IS', 'IN',
  'ID', 'IR', 'IQ', 'IE', 'IL', 'IT', 'JM', 'JP', 'JO', 'KZ', 'KE', 'KI', 'XK', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MG',
  'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MR', 'MU', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NZ', 'NI', 'NE', 'NG', 'KP',
  'MK', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PL', 'PT', 'PR', 'QA', 'RO', 'RU', 'RW', 'KN', 'LC', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN',
  'RS', 'SC', 'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'KR', 'SS', 'ES', 'LK', 'SD', 'SR', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TO', 'TT',
  'TN', 'TM', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UY', 'UZ', 'VU', 'VA', 'VE', 'VN', 'YE', 'ZM', 'ZW',
] as const;

const CODE_SET: ReadonlySet<string> = new Set(COUNTRY_CODES);

export function isCountryCode(v: unknown): v is string {
  return typeof v === 'string' && CODE_SET.has(v.toUpperCase());
}

export function isHighPriceCountry(code?: string): boolean {
  return !!code && HIGH_PRICE_COUNTRIES.has(code.toUpperCase());
}

export function countryName(code: string, locale: string): string {
  try {
    const dn = new Intl.DisplayNames([locale === 'tr' ? 'tr' : 'en'], { type: 'region' });
    return dn.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

/** Seçim listesi: önce popüler ülkeler, sonra diğerleri alfabetik. */
export function countryOptions(locale: string): { code: string; name: string; popular: boolean }[] {
  const popular = POPULAR_COUNTRIES.map((code) => ({ code, name: countryName(code, locale), popular: true }));
  const rest = COUNTRY_CODES.filter((c) => !(POPULAR_COUNTRIES as readonly string[]).includes(c))
    .map((code) => ({ code, name: countryName(code, locale), popular: false }))
    .sort((a, b) => a.name.localeCompare(b.name, locale === 'tr' ? 'tr' : 'en'));
  return [...popular, ...rest];
}

export const DEFAULT_COUNTRY = (locale: string) => (locale === 'tr' ? 'DE' : 'US');
