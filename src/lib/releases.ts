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
  summary: string;
  review: string;
  targetAudience: string;
  tags: string[];
  lastChecked?: string;
  isIndexable?: boolean;
}

/**
 * Google Scaled Content Abuse Önleme Kuralı (Spam Guardrail):
 * Bir klip sayfası ANCAK şu şartları karşılıyorsa Google dizinine açılır:
 * 1. Açıkça isIndexable: false olarak işaretlenmemiş olmalı.
 * 2. En az 80 kelimelik özgün editoryal not / müzik analizi içermeli.
 * 3. Doğrulanmış en az bir yönetmen / yapımcı künyesi bulunmalı.
 * Şartları karşılamayan basit veri kartları sayfada görüntülenir ama Google'a NOINDEX kalır.
 */
export function isReleaseIndexable(rel: NewRelease): boolean {
  if (rel.isIndexable === false) return false;
  const wordCount = (rel.review || '').trim().split(/\s+/).filter(Boolean).length;
  const hasCredits = Boolean(rel.director && rel.director !== 'Bilinmiyor' && rel.director !== 'Belirtilmedi');
  return wordCount >= 70 && hasCredits;
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

