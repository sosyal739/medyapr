import type { Locale } from '@/lib/i18n/config';

export type LandingSection = { h: string; p?: string[]; ul?: string[] };

export type LandingPage = {
  locale: Locale;
  slug: string;
  /** Hedef anahtar kelime (başlık/meta için) */
  keyword: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections: LandingSection[];
  faq: { q: string; a: string }[];
  /** Fiyat tablosu: hangi bölgeler gösterilsin */
  prices?: 'tr' | 'en' | 'ar';
  /** Fiyat tablosunda ülke seçimi (ar sayfaları için) */
  priceCountry?: string;
  /** Hedef ülke etiketi (Service schema areaServed) */
  areaServed?: string[];
};
