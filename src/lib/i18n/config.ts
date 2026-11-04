/**
 * i18n Configuration
 * Defines supported locales and the default locale for the MedyaPR application.
 */

export const locales = ['tr', 'en', 'ar', 'es'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'tr';

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

/** Yazım yönü: Arapça sağdan sola, diğerleri soldan sağa. */
export const localeDir = (locale: string): 'rtl' | 'ltr' => (locale === 'ar' ? 'rtl' : 'ltr');

/** Open Graph locale etiketi (Facebook/WhatsApp önizlemeleri). */
export const ogLocale = (locale: string) =>
  locale === 'tr' ? 'tr_TR' : locale === 'ar' ? 'ar_AR' : locale === 'es' ? 'es_ES' : 'en_US';

/** Schema.org inLanguage değeri (BCP 47). */
export const schemaLang = (locale: string) =>
  locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar' : locale === 'es' ? 'es' : 'en-US';

/**
 * Tarih/sayı biçimlendirme etiketi.
 */
export const intlLocale = (locale: string) =>
  locale === 'tr'
    ? 'tr-TR'
    : locale === 'ar'
    ? 'ar-u-nu-latn-ca-gregory'
    : locale === 'es'
    ? 'es-ES'
    : 'en-US';

/** Dil seçicide gösterilen adlar (her dil kendi adıyla). */
export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
  ar: 'العربية',
  es: 'Español',
};
