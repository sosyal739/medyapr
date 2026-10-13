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
  views: string;
  likes: string;
  summary: string;
  review: string;
  targetAudience: string;
  tags: string[];
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
