import { promises as fs } from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  videoId?: string;
  image: string;
  author: string;
  authorRole: string;
  tags: string[];
  quickFact?: string;
  table?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
  faqs?: {
    question: string;
    answer: string;
  }[];
  paragraphs: string[];
  /** Analiz yazısından aynı sanatçının "kimdir" yazısına bağ (slug) */
  bioSlug?: string;
  /** Yalnızca İngilizce yayınlanır (küresel trend yazıları); TR listede, sitemap'te ve hreflang'ta yer almaz. */
  enOnly?: boolean;
  /** Yalnızca Türkçe yayınlanır (Türkiye'ye özgü sanatçı/konu yazıları); EN çevirisi hazırlanmaz. */
  trOnly?: boolean;
  title_en?: string;
  summary_en?: string;
  category_en?: string;
  readTime_en?: string;
  authorRole_en?: string;
  tags_en?: string[];
  quickFact_en?: string;
  table_en?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
  faqs_en?: {
    question: string;
    answer: string;
  }[];
  paragraphs_en?: string[];
}

export interface Artist {
  slug: string;
  name: string;
  genre: string;
  bio: string;
  latestHit: string;
  hitVideoId: string;
  image: string;
  viewsTotal: string;
  monthlyAudience: string;
  topSongs: { title: string; views: string; videoId: string }[];
}

export async function getPosts(): Promise<BlogPost[]> {
  try {
    const file = path.join(process.cwd(), 'data', 'posts.json');
    const content = await fs.readFile(file, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getArtists(): Promise<Artist[]> {
  try {
    const file = path.join(process.cwd(), 'data', 'artists.json');
    const content = await fs.readFile(file, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const artists = await getArtists();
  return artists.find((a) => a.slug === slug) ?? null;
}

const TURKISH_STOPWORDS = [
  ' için ', ' nasıl ', ' nedir', ' olan ', ' olarak ', ' ile ', ' bir ',
  ' veya ', ' daha ', ' göre ', ' şarkı', ' müzik', ' izlenme', ' reklam',
];

export function isPostFullyTranslatedEn(post: BlogPost): boolean {
  if (post.trOnly) return false;
  if (post.enOnly) return true;
  if (!post.title_en || !post.summary_en || !post.paragraphs_en || post.paragraphs_en.length === 0) {
    return false;
  }
  if (post.title_en.trim() === post.title.trim()) {
    return false;
  }
  if (post.summary_en.trim() === post.summary.trim()) {
    return false;
  }
  const combinedEn = ` ${post.paragraphs_en.join(' ').toLowerCase()} `;
  let trHits = 0;
  for (const w of TURKISH_STOPWORDS) {
    if (combinedEn.includes(w)) {
      trHits += 1;
      if (trHits >= 2) return false;
    }
  }
  return true;
}


/** Dil için görünür yazılar. EN'de İngilizceye özel (küresel) yazılar öne alınır. */
export function postsForLocale(posts: BlogPost[], locale: string): BlogPost[] {
  if (locale === 'en') {
    const en = posts.filter(isPostFullyTranslatedEn);
    return [...en.filter((p) => p.enOnly), ...en.filter((p) => !p.enOnly)];
  }
  return posts.filter((p) => !p.enOnly);
}
