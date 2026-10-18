/**
 * Pricing engine — tek kaynak. Hem tarayıcıdaki hesaplayıcı hem de sunucu (sipariş doğrulama)
 * bu dosyayı kullanır. Fiyatı istemciden ASLA kabul etme; sunucu yeniden hesaplar.
 */

import { isHighPriceCountry } from './countries';

export const FORMATS = ['instream', 'shorts', 'discovery'] as const;
export type Format = (typeof FORMATS)[number];

/**
 * Hedef bölge. 'premium' anahtarı geriye dönük uyumluluk için korunur ve "Diğer ülkeler" anlamına gelir:
 * seçilen ülke Avrupa/ABD/Kanada ise yüksek tablo, değilse Türkiye tablosu uygulanır (bkz. src/lib/countries.ts).
 */
export const REGIONS = ['tr', 'global', 'premium'] as const;
export type Region = (typeof REGIONS)[number];

export const PACKAGES = ['views', 'engagement'] as const;
export type Package = (typeof PACKAGES)[number];

/** Etkileşim Paketi: izlenmeye ek beğeni/yorum/paylaşım odaklı kampanya, izlenme fiyatına +%30. */
export const ENGAGEMENT_UPLIFT = 0.3;

export const CURRENCIES = ['TRY', 'EUR', 'USD'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const MIN_VIEWS = 1_000;
export const MAX_VIEWS = 1_000_000;

/**
 * Türkiye temel fiyat tablosu (TL cinsinden), 18 Ekim 2026'da güncellendi.
 * Sahibin verdiği noktalar: 1K = 125, 5K = 575, 10K = 1.000, 50K = 4.750, 100K = 8.999.
 * Aradaki ve üstteki kademeler (25K, 250K, 500K, 1M) birim fiyat düşüşünü sürdürecek biçimde türetildi.
 * 1.000 (1K) = 125 TL (125/1K)
 * 5.000 (5K) = 575 TL (115/1K)
 * 10.000 (10K) = 1.000 TL (100/1K)
 * 25.000 (25K) = 2.400 TL (96/1K)
 * 50.000 (50K) = 4.750 TL (95/1K)
 * 100.000 (100K) = 8.999 TL (~90/1K)
 * 250.000 (250K) = 19.500 TL (78/1K)
 * 500.000 (500K) = 37.500 TL (75/1K)
 * 1.000.000 (1M) = 67.500 TL (67,5/1K)
 */
export const TR_PRICE_TIERS: readonly [number, number][] = [
  [1_000, 125],
  [5_000, 575],
  [10_000, 1_000],
  [25_000, 2_400],
  [50_000, 4_750],
  [100_000, 8_999],
  [250_000, 19_500],
  [500_000, 37_500],
  [1_000_000, 67_500],
];

/**
 * Premium ülkeler (ABD, İngiltere, Almanya vb.) fiyat tablosu (TL). Türkiye fiyatı düştüğünde
 * değişmemesi için ayrı tutulur; eski Türkiye tablosunun 2 katıdır.
 */
export const PREMIUM_PRICE_TIERS: readonly [number, number][] = [
  [1_000, 500],
  [5_000, 2_400],
  [10_000, 4_000],
  [25_000, 8_200],
  [50_000, 15_000],
  [100_000, 24_000],
  [250_000, 52_000],
  [500_000, 100_000],
  [1_000_000, 180_000],
];

/**
 * Global izlenme fiyat tablosu (TL cinsinden).
 * 1.000 (1K) = 100 TL (100 TL/1K)
 * 5.000 (5K) = 450 TL (90 TL/1K)
 * 10.000 (10K) = 750 TL (75 TL/1K)
 * 25.000 (25K) = 1.500 TL (60 TL/1K)
 * 50.000 (50K) = 2.500 TL (50 TL/1K)
 * 100.000 (100K) = 4.000 TL (40 TL/1K)
 * 250.000 (250K) = 9.500 TL (38 TL/1K)
 * 500.000 (500K) = 18.000 TL (36 TL/1K)
 * 1.000.000 (1M) = 35.000 TL (35 TL/1K)
 * Her artışta birim fiyat kademeli olarak düşer.
 */
export const GLOBAL_PRICE_TIERS: readonly [number, number][] = [
  [1_000, 100],
  [5_000, 450],
  [10_000, 750],
  [25_000, 1_500],
  [50_000, 2_500],
  [100_000, 4_000],
  [250_000, 9_500],
  [500_000, 18_000],
  [1_000_000, 35_000],
];

export type Quote = {
  views: number;
  format: Format;
  pkg: Package;
  region: Region;
  currency: Currency;
  discountRate: number;
  subtotal: number;
  discount: number;
  total: number;
  perThousand: number;
  etaDays: [number, number];
};

export function clampViews(v: number): number {
  if (!Number.isFinite(v)) return MIN_VIEWS;
  return Math.min(MAX_VIEWS, Math.max(MIN_VIEWS, Math.round(v)));
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function interpolateTiers(v: number, tiers: readonly [number, number][]): number {
  if (v <= tiers[0][0]) return tiers[0][1];
  const last = tiers[tiers.length - 1];
  if (v >= last[0]) return last[1];

  for (let i = 0; i < tiers.length - 1; i++) {
    const [v0, p0] = tiers[i];
    const [v1, p1] = tiers[i + 1];
    if (v >= v0 && v <= v1) {
      const progress = (v - v0) / (v1 - v0);
      return Math.round(p0 + progress * (p1 - p0));
    }
  }
  return tiers[0][1];
}

export function getPriceTry(views: number, region: Region, country?: string): number {
  const v = clampViews(views);
  if (region === 'global') {
    return interpolateTiers(v, GLOBAL_PRICE_TIERS);
  }
  if (region === 'premium') {
    return interpolateTiers(v, isHighPriceCountry(country) ? PREMIUM_PRICE_TIERS : TR_PRICE_TIERS);
  }
  return interpolateTiers(v, TR_PRICE_TIERS);
}

export function getTrPriceTry(views: number): number {
  return interpolateTiers(clampViews(views), TR_PRICE_TIERS);
}

export function quote(input: {
  views: number;
  format?: Format;
  pkg?: Package;
  region: Region;
  currency: Currency;
  /** Yalnızca region === 'premium' (Diğer ülkeler) için anlamlı. */
  country?: string;
}): Quote {
  const views = clampViews(input.views);
  const format = input.format || 'instream';
  const pkg = input.pkg || 'views';
  const pkgFactor = pkg === 'engagement' ? 1 + ENGAGEMENT_UPLIFT : 1;
  const { region, currency } = input;
  const country = region === 'premium' ? (input.country || 'US').toUpperCase() : undefined;
  const high = region === 'premium' && isHighPriceCountry(country);

  // 1.000 izlenme baz tavan liste fiyatı
  const baseRatePerKTry = region === 'global' ? 100 : high ? 500 : 125;
  const subtotalTry = (views / 1000) * baseRatePerKTry * pkgFactor;

  // Kademeli paket fiyatı (hacim arttıkça birim maliyet düşer)
  const totalTry = Math.round(getPriceTry(views, region, country) * pkgFactor);

  // Hacim indirimi
  const discountTry = Math.max(0, subtotalTry - totalTry);
  const discountRate = subtotalTry > 0 ? discountTry / subtotalTry : 0;

  // Döviz dönüşümü (TRY bazlı)
  const toCurrency = (tryAmount: number): number => {
    if (currency === 'TRY') return tryAmount;
    if (currency === 'EUR') return round2(tryAmount / 40);
    if (currency === 'USD') return round2((tryAmount / 40) * 1.08);
    return tryAmount;
  };

  const total = toCurrency(totalTry);
  const subtotal = toCurrency(subtotalTry);
  const discount = toCurrency(discountTry);

  // Doğal teslimat hızı
  const days = Math.max(1, Math.min(25, Math.ceil(views / 45_000)));

  return {
    views,
    format,
    pkg,
    region,
    currency,
    discountRate,
    subtotal,
    discount,
    total,
    perThousand: round2((total / views) * 1000),
    etaDays: [days, days + 2],
  };
}

export function formatMoney(amount: number, currency: Currency, locale: string): string {
  return new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount >= 100 ? 0 : 2,
  }).format(amount);
}

/** YouTube video ID çıkarır (watch, youtu.be, shorts, embed). Geçersizse null. */
export function parseYouTubeId(raw: string): string | null {
  try {
    const u = new URL(raw.trim());
    const host = u.hostname.replace(/^www\.|^m\./, '');
    let id: string | null = null;
    if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
    else if (host === 'youtube.com' || host === 'music.youtube.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      else {
        const m = u.pathname.match(/^\/(shorts|embed|live)\/([\w-]{11})/);
        if (m) id = m[2];
      }
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
