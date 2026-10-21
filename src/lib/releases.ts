import { promises as fs } from 'fs';
import path from 'path';

export interface NewRelease {
  slug: string;
  title: string;
  artist: string;
  channel: string;
  channelType: 'netd' | 'dmc' | 'sony' | 'bagimsiz';
  videoId: string;
  thumbnail: string;
  releaseDate: string;
  genre: string;
  genreSlug: 'pop' | 'rap' | 'rock' | 'edm';
  director?: string;
  producer?: string;
  instagramHandle?: string;
  twitterHandle?: string;
  views?: string;
  likes?: string;
  channel_en?: string;
  genre_en?: string;
  summary: string;
  summary_en?: string;
  review: string;
  review_en?: string;
  targetAudience: string;
  targetAudience_en?: string;
  tags: string[];
  tags_en?: string[];
  lastChecked?: string;
  isIndexable?: boolean;
}

/**
 * KESİN SPAM ÖNLEME EMNİYET KİLİDİ (Zero-Spam Mutation Gate):
 * Kullanıcı yanlışlıkla 'yayına al / indexle' dese dahi, aşağıdaki katı şartları
 * sağlamayan hiçbir klip sayfası Google dizinine AÇILAMAZ ve sitemap'e GİREMEZ.
 *
 * Şartlar (Google Thin Content & Scaled Content Abuse Koruması):
 * 1. Açıkça 'isIndexable === true' olarak onaylanmış olmalı (varsayılan: false).
 * 2. İnceleme metni (review) EN AZ 120 gerçek kelimeden oluşmalı.
 * 3. Doğrulanmış gerçek bir yönetmen veya prodüksiyon künyesi bulunmalı.
 * 4. Geçerli 11 karakterli YouTube videoId bulunmalı.
 *
 * Bu şartları sağlamayan sayfalar kullanıcıya ve sosyal medyaya açık kalır
 * fakat Google'a kesin olarak 'noindex, follow' verilir. Böylece ana site
 * ve fiyat sayfaları hiçbir zaman spam cezası riskiyle karşılaşmaz.
 */
export function isReleaseIndexable(rel: NewRelease): boolean {
  // Katı kural: Açıkça true denmemişse VARSAYILAN OLARAK NOINDEX!
  if (rel.isIndexable !== true) return false;

  const wordCount = (rel.review || '').trim().split(/\s+/).filter(Boolean).length;
  const hasCredits = Boolean(
    rel.director &&
    rel.director !== 'Bilinmiyor' &&
    rel.director !== 'Belirtilmedi' &&
    rel.director.trim().length >= 3
  );
  const hasValidVideoId = Boolean(rel.videoId && /^[\w-]{11}$/.test(rel.videoId));

  // En az 120 kelimelik özgün insan analizi + doğrulanmış künye şart
  return wordCount >= 120 && hasCredits && hasValidVideoId;
}


export async function getNewReleases(): Promise<NewRelease[]> {
  try {
    const file = path.join(process.cwd(), 'data', 'releases.json');
    const content = await fs.readFile(file, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function getReleaseBySlug(slug: string): Promise<NewRelease | null> {
  const releases = await getNewReleases();
  return releases.find((r) => r.slug === slug) ?? null;
}

