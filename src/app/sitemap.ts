import type { MetadataRoute } from 'next';
import { getPosts, getArPosts, getEsPosts, isPostFullyTranslatedEn } from '@/lib/content';
import { getNewReleases, isReleaseIndexable } from '@/lib/releases';
import { LANDING_PAGES } from '@/data/landing';

const BASE_URL = 'https://medyapr.com';
const LOCALES = ['tr', 'en', 'ar'] as const;
/** Türkiye/İngilizce içerikli bölümler (klip): Arapça ve İspanyolca sürümleri yoktur. */
const TR_EN_ONLY = ['tr', 'en'] as const;
const TR_EN_ONLY_ROUTES = new Set(['/yeni-klipler']);
const STABLE_SITE_DATE = new Date('2026-11-04T00:00:00.000Z');

function parseTurkishDate(dateStr?: string): Date {
  if (!dateStr) return STABLE_SITE_DATE;
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const d = new Date(`${trimmed}T08:00:00.000Z`);
    if (!isNaN(d.getTime())) return d;
  }
  const months: Record<string, string> = {
    Ocak: '01', Şubat: '02', Mart: '03', Nisan: '04', Mayıs: '05', Haziran: '06',
    Temmuz: '07', Ağustos: '08', Eylül: '09', Ekim: '10', Kasım: '11', Aralık: '12',
  };
  const parts = trimmed.split(' ');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1]] || '10';
    const year = parts[2];
    const d = new Date(`${year}-${month}-${day}T08:00:00.000Z`);
    if (!isNaN(d.getTime())) return d;
  }
  return STABLE_SITE_DATE;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const releases = await getNewReleases();

  const staticRoutes = [
    '',
    '/fiyatlandirma',
    '/order',
    '/klip-pr',
    '/hizmetler',
    '/hakkimizda',
    '/sss',
    '/iletisim',
    '/trendler',
    '/yeni-klipler',
    '/blog',
    '/gizlilik',
    '/kullanim-kosullari',
    '/iade-politikasi',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static routes
  for (const locale of LOCALES) {
    for (const route of staticRoutes) {
      if (locale === 'ar' && TR_EN_ONLY_ROUTES.has(route)) continue;
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: STABLE_SITE_DATE,
        changeFrequency: route === '' || route === '/trendler' || route === '/yeni-klipler' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/fiyatlandirma' || route === '/blog' || route === '/yeni-klipler' ? 0.9 : 0.8,
      });
    }
  }

  // Ticari açılış sayfaları (yalnızca indekslenebilir dillerde: tr, en, ar)
  for (const lp of LANDING_PAGES) {
    if (lp.locale === 'es') continue;
    entries.push({
      url: `${BASE_URL}/${lp.locale}/${lp.slug}`,
      lastModified: STABLE_SITE_DATE,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Dynamic Blog Posts (TR & EN) - Yalnızca ana ve kaliteli Müzik PR rehberleri (noindex olan magazin yazıları hariç)
  for (const post of posts) {
    if (post.noindex) continue;
    const postDate = parseTurkishDate(post.date);
    for (const locale of TR_EN_ONLY) {
      if (locale === 'en' && !isPostFullyTranslatedEn(post)) {
        continue;
      }
      if (locale === 'tr' && post.enOnly) {
        continue;
      }
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: postDate,
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }
  }

  // Arapça blog yazıları (ayrı havuz: posts_ar.json)
  for (const post of await getArPosts()) {
    entries.push({
      url: `${BASE_URL}/ar/blog/${post.slug}`,
      lastModified: parseTurkishDate(post.date),
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  // İspanyolca sayfalar geçici olarak sitemap dışına alınmıştır (Google kalite ve tarama bütçesi optimizasyonu).

  // Dynamic Releases (Yeni Klipler) - Google Scaled Content Abuse Önleme Kuralı
  // Yalnızca kalite kriterini karşılayan (özgün editör analizi ve künyesi olan) sayfalar sitemap'e girer.
  for (const release of releases) {
    if (!isReleaseIndexable(release)) continue;
    const releaseDate = release.releaseDate ? new Date(`${release.releaseDate}T08:00:00.000Z`) : STABLE_SITE_DATE;
    for (const locale of TR_EN_ONLY) {
      entries.push({
        url: `${BASE_URL}/${locale}/klip/${release.slug}`,
        lastModified: releaseDate,
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }
  }

  return entries;
}
