/**
 * i18n Configuration
 * Defines supported locales and the default locale for the MedyaPR application.
 */

export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'tr';
