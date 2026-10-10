/**
 * Dictionary Loader
 * Dynamically imports the correct dictionary JSON file based on the given locale.
 * Uses dynamic import() for code-splitting — only the requested locale is loaded.
 */

import type { Locale } from './config';

const dictionaries = {
  tr: () => import('@/dictionaries/tr.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
};

/**
 * Loads and returns the dictionary for the specified locale.
 * @param locale - The locale code ('tr' or 'en')
 * @returns The dictionary object containing all translations for the locale
 */
export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};

/** Type representing the full dictionary structure, inferred from the Turkish dictionary */
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
