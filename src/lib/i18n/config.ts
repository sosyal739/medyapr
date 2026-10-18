/**
 * i18n Configuration
 * Defines supported locales and the default locale for the MedyaPR application.
 */

export const locales = ['tr', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'tr';

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

/** Yazım yönü: Arapça sağdan sola. */
export const localeDir = (locale: string): 'rtl' | 'ltr' => (locale === 'ar' ? 'rtl' : 'ltr');

/** Open Graph locale etiketi (Facebook/WhatsApp önizlemeleri). */
export const ogLocale = (locale: string) => (locale === 'tr' ? 'tr_TR' : locale === 'ar' ? 'ar_AR' : 'en_US');

/** Schema.org inLanguage değeri (BCP 47). */
export const schemaLang = (locale: string) => (locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar' : 'en-US');

/**
 * Tarih/sayı biçimlendirme etiketi. Arapçada Latin rakamları ve miladi takvim kullanılır
 * (fiyat ve izlenme sayıları sitenin geri kalanıyla aynı görünür; ar-SA varsayılanı Hicri takvimdir).
 */
export const intlLocale = (locale: string) => (locale === 'tr' ? 'tr-TR' : locale === 'ar' ? 'ar-u-nu-latn-ca-gregory' : 'en-US');

/** Dil seçicide gösterilen adlar (her dil kendi adıyla). */
export const localeNames: Record<Locale, string> = { tr: 'Türkçe', en: 'English', ar: 'العربية' };
