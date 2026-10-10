import type { MetadataRoute } from 'next';
import { getPosts, getArtists } from '@/lib/content';

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

  const staticRoutes = [
    '',
    '/fiyatlandirma',
    '/hizmetler',
    '/hakkimizda',
    '/sss',
    '/iletisim',
    '/trendler',
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
        changeFrequency: route === '' || route === '/trendler' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/fiyatlandirma' || route === '/blog' ? 0.9 : 0.8,
        alternates: {
          languages: {
            tr: `${BASE_URL}/tr${route}`,
            en: `${BASE_URL}/en${route}`,
            'x-default': `${BASE_URL}/tr${route}`,
          },
        },
      });
    }
  }

  // Dynamic Blog Posts
  for (const post of posts) {
    const postDate = parseTurkishDate(post.date);
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: postDate,
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            tr: `${BASE_URL}/tr/blog/${post.slug}`,
            en: `${BASE_URL}/en/blog/${post.slug}`,
            'x-default': `${BASE_URL}/tr/blog/${post.slug}`,
          },
        },
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
        alternates: {
          languages: {
            tr: `${BASE_URL}/tr/sanatci/${artist.slug}`,
            en: `${BASE_URL}/en/sanatci/${artist.slug}`,
            'x-default': `${BASE_URL}/tr/sanatci/${artist.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
