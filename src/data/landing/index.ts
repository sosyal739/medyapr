import type { Locale } from '@/lib/i18n/config';
import type { LandingPage } from './types';
import { TR_PAGES } from './tr';
import { EN_PAGES } from './en';
import { AR_PAGES } from './ar';

export const LANDING_PAGES: LandingPage[] = [...TR_PAGES, ...EN_PAGES, ...AR_PAGES];

export const getLandingPages = (locale: string): LandingPage[] => LANDING_PAGES.filter((p) => p.locale === locale);

export const getLandingPage = (locale: string, slug: string): LandingPage | undefined =>
  LANDING_PAGES.find((p) => p.locale === (locale as Locale) && p.slug === slug);
