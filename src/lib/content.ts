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
