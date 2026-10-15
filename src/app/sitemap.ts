import type { MetadataRoute } from 'next';
import { getPosts, getArtists, isPostFullyTranslatedEn } from '@/lib/content';
import { getNewReleases, isReleaseIndexable } from '@/lib/releases';

const BASE_URL = 'https://medyapr.com';
const LOCALES = ['tr', 'en'] as const;
const STABLE_SITE_DATE = new Date('2026-10-10T08:00:00.000Z');

function parseTurkishDate(dateStr?: string): Date {
  if (!dateStr) return STABLE_SITE_DATE;
  const months: Record<string, string> = {
    Ocak: '01', Şubat: '02', Mart: '03', Nisan: '04', Mayıs: '05', Haziran: '06',
    Temmuz: '07', Ağustos: '08', Eylül: '09', Ekim: '10', Kasım: '11', Aralık: '12',
  };
  const parts = dateStr.trim().split(' ');
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
  const artists = await getArtists();
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
    '/sanatcilar',
    '/blog',
    '/gizlilik',
    '/kullanim-kosullari',
    '/iade-politikasi',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static routes
  for (const locale of LOCALES) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: STABLE_SITE_DATE,
        changeFrequency: route === '' || route === '/trendler' || route === '/yeni-klipler' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/fiyatlandirma' || route === '/blog' || route === '/yeni-klipler' ? 0.9 : 0.8,
      });
    }
  }

  // Dynamic Blog Posts
  for (const post of posts) {
    const postDate = parseTurkishDate(post.date);
    for (const locale of LOCALES) {
      if (locale === 'en' && !isPostFullyTranslatedEn(post)) {
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

  // Dynamic Artists
  for (const artist of artists) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/sanatci/${artist.slug}`,
        lastModified: STABLE_SITE_DATE,
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }
  }

  // Dynamic Releases (Yeni Klipler) - Google Scaled Content Abuse Önleme Kuralı
  // Yalnızca kalite kriterini karşılayan (özgün editör analizi ve künyesi olan) sayfalar sitemap'e girer.
  for (const release of releases) {
    if (!isReleaseIndexable(release)) continue;
    const releaseDate = release.releaseDate ? new Date(`${release.releaseDate}T08:00:00.000Z`) : STABLE_SITE_DATE;
    for (const locale of LOCALES) {
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

