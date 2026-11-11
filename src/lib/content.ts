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
  /** Hassas haberlerde (sağlık, vefat vb.) yazı sonundaki analiz kutusunu gizler. */
  noCta?: boolean;
  /** Arama motorlarında dizin dışı tutulur (noindex, follow) ve sitemap'e eklenmez. */
  noindex?: boolean;
  /** İçerik gerçekten güncellendiğinde tarih (schema dateModified); yoksa yayın tarihi kullanılır. */
  updated?: string;
  /**
   * Arapça/İspanyolca yazılar: metin alanları ilgili dildedir, `category` dildeki etikettir.
   * Blog kategorisi `categoryKey` ile eşleşir.
   */
  categoryKey?: string;
  /** Bu yazı, bu Türkçe yazının (slug) çevirisidir; hreflang çifti kurulur. Yoksa bağımsızdır. */
  translationOf?: string;
  /** Yazının hedeflediği pazar (trend yazıları): sa | eg | ma | mx | es | co. */
  region?: 'sa' | 'eg' | 'ma' | 'mx' | 'es' | 'co';
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
  genre_en?: string;
  bio: string;
  bio_en?: string;
  latestHit: string;
  hitVideoId: string;
  image: string;
  viewsTotal: string;
  monthlyAudience: string;
  monthlyAudience_en?: string;
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

/** Arapça blog yazıları (ayrı dosya: TR/EN içeriğinden bağımsız yönetilir). */
export async function getArPosts(): Promise<BlogPost[]> {
  try {
    const file = path.join(process.cwd(), 'data', 'posts_ar.json');
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return [];
  }
}

export async function getArPostBySlug(slug: string): Promise<BlogPost | null> {
  return (await getArPosts()).find((p) => p.slug === slug) ?? null;
}

/** Türkçe yazı slug'ı -> Arapça çevirisinin slug'ı (hreflang için). */
export async function getArTranslationMap(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  for (const p of await getArPosts()) if (p.translationOf) map[p.translationOf] = p.slug;
  return map;
}

/** İspanyolca blog yazıları (ayrı dosya: TR/EN/AR içeriğinden bağımsız yönetilir). */
export async function getEsPosts(): Promise<BlogPost[]> {
  try {
    const file = path.join(process.cwd(), 'data', 'posts_es.json');
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return [];
  }
}

export async function getEsPostBySlug(slug: string): Promise<BlogPost | null> {
  return (await getEsPosts()).find((p) => p.slug === slug) ?? null;
}

/** Türkçe yazı slug'ı -> İspanyolca çevirisinin slug'ı (hreflang için). */
export async function getEsTranslationMap(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  for (const p of await getEsPosts()) if (p.translationOf) map[p.translationOf] = p.slug;
  return map;
}

const CATEGORY_KEYS: Record<string, string> = {
  'Sosyal Medya': 'sosyal-medya',
  'Nasıl Yapılır?': 'nasil-yapilir',
  'Tavsiye': 'tavsiye',
  'Kimdir?': 'kimdir',
  'Resmi Video PR & Google Ads': 'video-pr',
  'Şarkı & Klip Analizleri': 'analizler',
};

/** Blog kategori anahtarı (TR kategori adından veya AR/ES yazının `categoryKey` alanından). */
export function postCategoryKey(post: BlogPost): string {
  return post.categoryKey ?? CATEGORY_KEYS[post.category] ?? 'all';
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
  const combinedSummary = ` ${post.summary_en.toLowerCase()} `;
  for (const w of TURKISH_STOPWORDS) {
    if (combinedSummary.includes(w)) {
      return false;
    }
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

/** Dil için görünür yazılar. EN'de İngilizceye özel (küresel) yazılar öne alınır. noindex yazılar liste dışı bırakılır. */
export function postsForLocale(posts: BlogPost[], locale: string): BlogPost[] {
  const visible = posts.filter((p) => !p.noindex);
  if (locale === 'ar') return visible;
  if (locale === 'es') return visible;
  if (locale === 'en') {
    const en = visible.filter(isPostFullyTranslatedEn);
    return [...en.filter((p) => p.enOnly), ...en.filter((p) => !p.enOnly)];
  }
  return visible.filter((p) => !p.enOnly);
}

/** Dile göre yazı havuzu: Arapça için posts_ar.json, İspanyolca için posts_es.json, TR/EN için posts.json (süzülmüş). */
export async function getPostsForLocale(locale: string): Promise<BlogPost[]> {
  if (locale === 'ar') return postsForLocale(await getArPosts(), 'ar');
  if (locale === 'es') return getEsPosts();
  return postsForLocale(await getPosts(), locale);
}
