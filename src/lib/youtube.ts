/**
 * YouTube veri katmanı (yalnızca sunucu).
 * - YOUTUBE_API_KEY tanımlıysa resmî YouTube Data API v3 kullanılır (izlenme, beğeni, yorum, süre).
 * - Anahtar yoksa video bilgisi için oEmbed'e (başlık, kanal, kapak; istatistik yok),
 *   trendler için data/trending_songs.json dosyasına düşülür.
 * Anahtar yalnızca YouTube Data API ile sınırlandırılmış ayrı bir anahtar olmalıdır.
 */
import { promises as fs } from 'fs';
import path from 'path';

export type VideoInfo = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  views?: number;
  likes?: number;
  comments?: number;
  durationSec?: number;
  publishedAt?: string;
  source: 'api' | 'oembed';
};

export interface TrendingSong {
  rank: number;
  videoId: string;
  title: string;
  artist: string;
  views: number;
  likes: number;
  /** Gerçek 24 saatlik artış verisi yoksa 0; arayüz 0'ı göstermez. */
  gain24h: number;
  publishedAt: string;
  thumbnail: string;
  isNew?: boolean;
  blogSlug?: string;
  genre?: 'hiphop' | 'pop' | 'indie' | 'edm' | 'rock';
}

import { TREND_REGIONS, type TrendRegion } from '@/lib/trend-regions';
export { TREND_REGIONS, AR_TREND_REGIONS, type TrendRegion } from '@/lib/trend-regions';
export type MultiCountryTrends = Record<TrendRegion, TrendingSong[]>;

const API = 'https://www.googleapis.com/youtube/v3';
const TRENDS_REVALIDATE = 6 * 60 * 60;

const apiKey = () => process.env.YOUTUBE_API_KEY;
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const isVideoId = (id: string) => /^[\w-]{11}$/.test(id);

/** ISO 8601 süre (PT3M42S) → saniye. */
function parseDuration(iso?: string): number | undefined {
  const m = iso?.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return undefined;
  const [, d, h, mi, s] = m.map((x) => Number(x) || 0);
  return d * 86400 + h * 3600 + mi * 60 + s;
}

const num = (v: unknown) => (v === undefined || v === null || v === '' ? undefined : Number(v));

/**
 * Video bilgisi. Video yoksa veya gizliyse `null`;
 * ağ/servis hatasında `undefined` döner (çağıran engellememeli).
 */
export async function getVideoInfo(id: string): Promise<VideoInfo | null | undefined> {
  if (!isVideoId(id)) return null;
  try {
    const key = apiKey();
    if (key) {
      const res = await fetch(
        `${API}/videos?part=snippet,statistics,contentDetails&id=${id}&key=${key}`,
        { next: { revalidate: 300 } },
      );
      if (!res.ok) return undefined;
      const item = (await res.json()).items?.[0];
      if (!item) return null;
      return {
        id,
        title: item.snippet?.title ?? '',
        channel: item.snippet?.channelTitle ?? '',
        thumbnail: thumb(id),
        views: num(item.statistics?.viewCount),
        likes: num(item.statistics?.likeCount),
        comments: num(item.statistics?.commentCount),
        durationSec: parseDuration(item.contentDetails?.duration),
        publishedAt: item.snippet?.publishedAt,
        source: 'api',
      };
    }

    const res = await fetch(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`,
      { next: { revalidate: 300 } },
    );
    // 401: video var ama yerleştirme kapalı.
    if (res.status === 401) return { id, title: '', channel: '', thumbnail: thumb(id), source: 'oembed' };
    if (res.status === 404 || res.status === 400) return null;
    if (!res.ok) return undefined;
    const o = await res.json();
    return { id, title: o.title ?? '', channel: o.author_name ?? '', thumbnail: thumb(id), source: 'oembed' };
  } catch {
    return undefined;
  }
}

type FileTrends = Partial<MultiCountryTrends> & { updatedAt?: string };

async function readTrendsFile(): Promise<FileTrends> {
  try {
    const raw = JSON.parse(await fs.readFile(path.join(process.cwd(), 'data', 'trending_songs.json'), 'utf8'));
    return Array.isArray(raw) ? { tr: raw } : raw;
  } catch {
    return {};
  }
}

/** Dosyadaki bozuk kayıtları ayıklar ve kapakları video kimliğinden üretir. */
function sanitize(list: TrendingSong[] | undefined): TrendingSong[] {
  return (list ?? [])
    .filter((s) => s && isVideoId(s.videoId))
    .map((s, i) => ({ ...s, rank: i + 1, thumbnail: thumb(s.videoId), gain24h: s.gain24h || 0 }));
}

async function fetchChart(region: TrendRegion, key: string, meta: Map<string, TrendingSong>): Promise<TrendingSong[] | null> {
  try {
    const res = await fetch(
      `${API}/videos?part=snippet,statistics&chart=mostPopular&videoCategoryId=10&maxResults=20&regionCode=${region.toUpperCase()}&key=${key}`,
      { next: { revalidate: TRENDS_REVALIDATE, tags: ['trends'] } },
    );
    if (!res.ok) return null;
    const items: Array<{ id: string; snippet?: Record<string, string>; statistics?: Record<string, string> }> =
      (await res.json()).items ?? [];
    const weekAgo = Date.now() - 7 * 86400_000;
    return items.map((it, i) => {
      const known = meta.get(it.id);
      const publishedAt = it.snippet?.publishedAt ?? '';
      return {
        rank: i + 1,
        videoId: it.id,
        title: it.snippet?.title ?? '',
        artist: (it.snippet?.channelTitle ?? '').replace(/\s*-\s*Topic$|VEVO$/, '').trim(),
        views: Number(it.statistics?.viewCount ?? 0),
        likes: Number(it.statistics?.likeCount ?? 0),
        gain24h: 0,
        publishedAt,
        thumbnail: thumb(it.id),
        isNew: publishedAt ? Date.parse(publishedAt) > weekAgo : false,
        ...(known?.blogSlug ? { blogSlug: known.blogSlug } : {}),
        ...(known?.genre ? { genre: known.genre } : {}),
      };
    });
  } catch {
    return null;
  }
}

/**
 * Ülke bazlı trend listeleri. Anahtar varsa canlı veri (6 saatte bir yenilenir),
 * yoksa veya API hata verirse dosyadaki temizlenmiş liste.
 */
export async function getTrends(): Promise<{ trends: MultiCountryTrends; updatedAt: string | null; live: boolean }> {
  const file = await readTrendsFile();
  const fallback = Object.fromEntries(TREND_REGIONS.map((r) => [r, sanitize(file[r])])) as MultiCountryTrends;
  const key = apiKey();
  if (!key) return { trends: fallback, updatedAt: file.updatedAt ?? null, live: false };

  const meta = new Map<string, TrendingSong>();
  TREND_REGIONS.forEach((r) => fallback[r].forEach((s) => meta.set(s.videoId, s)));

  const charts = await Promise.all(TREND_REGIONS.map((r) => fetchChart(r, key, meta)));
  const live = charts.some((c) => c && c.length > 0);
  const trends = Object.fromEntries(
    TREND_REGIONS.map((r, i) => [r, charts[i] && charts[i]!.length > 0 ? charts[i] : fallback[r]]),
  ) as MultiCountryTrends;
  return { trends, updatedAt: live ? new Date().toISOString() : file.updatedAt ?? null, live };
}
