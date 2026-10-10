import type { MetadataRoute } from 'next';
import { getPosts, getArtists } from '@/lib/content';

const BASE_URL = 'https://medyapr.com';
const LOCALES = ['tr', 'en'] as const;

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
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/trendler' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route === '/fiyatlandirma' || route === '/blog' ? 0.9 : 0.8,
        alternates: {
          languages: {
            tr: `${BASE_URL}/tr${route}`,
            en: `${BASE_URL}/en${route}`,
          },
        },
      });
    }
  }

  // Dynamic Blog Posts
  for (const post of posts) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            tr: `${BASE_URL}/tr/blog/${post.slug}`,
            en: `${BASE_URL}/en/blog/${post.slug}`,
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
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.75,
        alternates: {
          languages: {
            tr: `${BASE_URL}/tr/sanatci/${artist.slug}`,
            en: `${BASE_URL}/en/sanatci/${artist.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
