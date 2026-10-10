import type { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Flame, TrendingUp, Play, ExternalLink, ArrowRight, Music, Clock } from 'lucide-react';
import type { TrendingSong } from '@/components/home/TrendingMusicSection';

export const metadata: Metadata = {
  title: {
    absolute: 'Türkiye YouTube Trend Şarkılar Listesi | MedyaPR',
  },
  description:
    'Bugün YouTube Türkiye müzik trendlerinde ilk sırada hangi klipler var? Canlı izlenme sayıları, son 24 saatlik yükselişler ve resmi trend listesi.',
};

async function getTrendingSongs(): Promise<TrendingSong[]> {
  try {
    const file = path.join(process.cwd(), 'data', 'trending_songs.json');
    const content = await fs.readFile(file, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export default async function TrendlerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const songs = await getTrendingSongs();
  const isTr = locale === 'tr';
  const nf = new Intl.NumberFormat(isTr ? 'tr-TR' : 'en-US');
  const todayStr = new Date().toLocaleDateString(isTr ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isTr ? 'Ana Sayfa' : 'Home',
            item: `https://medyapr.com/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isTr ? 'Trend Şarkılar' : 'Trending Music',
            item: `https://medyapr.com/${locale}/trendler`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: isTr ? 'YouTube Türkiye Trend Müzik Klipleri Listesi' : 'YouTube Turkey Trending Music Videos',
        description: isTr
          ? 'YouTube Türkiye müzik listesinde en çok izlenen ve yükselişte olan şarkılar sıralaması.'
          : 'Official list of top trending music videos in YouTube Turkey.',
        itemListElement: songs.map((s, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: `${s.artist} - ${s.title}`,
          url: `https://www.youtube.com/watch?v=${s.videoId}`,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-studio-gradient text-white py-14 md:py-20 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Background glow */}
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#FF0033]/15 blur-[160px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[150px] animate-float-drift" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        {/* Breadcrumb / Top Tag */}
        <div className="mb-4 flex items-center gap-2 text-xs text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-white transition">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span className="text-[#FF6B6B]">Trend Şarkılar</span>
        </div>

        {/* Header */}
        <div className="mb-12 border-b border-studio pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E] mb-3">
            <Flame className="h-4 w-4 animate-pulse text-[#FF0033]" />
            Günlük Canlı Güncelleme · {todayStr}
          </div>
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight">
            Türkiye YouTube{' '}
            <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
              Trend Müzik Klipleri
            </span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-zinc-300 max-w-3xl leading-relaxed">
            YouTube Data API v3 üzerinden resmi olarak çekilen anlık Türkiye müzik trendleri sıralaması.
            Kliplerin toplam izlenmeleri, beğeni sayıları ve son 24 saatlik ivme analizi.
          </p>
        </div>

        {/* Songs List */}
        <div className="space-y-4">
          {songs.map((song) => {
            const isFirst = song.rank === 1;

            return (
              <div
                key={song.videoId}
                className={`group flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-3xl border p-5 md:p-6 backdrop-blur-xl transition-all duration-300 ${
                  isFirst
                    ? 'border-[#FF0033]/60 bg-gradient-to-r from-[#FF0033]/25 via-zinc-800/90 to-zinc-900/90 shadow-2xl shadow-[#FF0033]/20'
                    : 'border-studio bg-studio-card hover:border-studio-strong hover:bg-zinc-800/90'
                }`}
              >
                <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
                  {/* Rank */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-mono text-lg font-black ${
                      isFirst
                        ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30'
                        : song.rank === 2
                        ? 'bg-slate-300 text-black'
                        : song.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-white/10 text-white/80'
                    }`}
                  >
                    #{song.rank}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-2xl bg-black/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <a
                      href={`https://www.youtube.com/watch?v=${song.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="h-8 w-8 text-white fill-white" />
                    </a>
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B] truncate">
                        {song.artist}
                      </span>
                      {song.isNew && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          YENİ GİRİŞ
                        </span>
                      )}
                    </div>
                    <h2 className="mt-1 text-base sm:text-lg font-bold text-white truncate group-hover:text-[#FF6B6B] transition-colors">
                      {song.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-white/50">
                      <span className="text-white/80 font-bold tabular-nums">
                        {nf.format(song.views)} İzlenme
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-400">
                        <TrendingUp className="h-3.5 w-3.5" />
                        +{nf.format(song.gain24h)} (son 24s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t border-white/5 pt-3 md:border-t-0 md:pt-0">
                  <a
                    href={`https://www.youtube.com/watch?v=${song.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white transition"
                  >
                    YouTube <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`/${locale}#calculator`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF0033] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#FF0033]/20 hover:bg-[#E6002E] transition"
                  >
                    Klibini Tanıt <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Policy Attribution */}
        <div className="mt-14 rounded-2xl border border-studio bg-studio-card p-6 text-xs text-zinc-400 space-y-2">
          <p className="font-semibold text-zinc-200">
            📌 YouTube API Hizmet Politikaları & Telif Bildirimi
          </p>
          <p>
            Bu sayfada yer alan video başlıkları, küçük resimler ve izlenme istatistikleri doğrudan resmi
            YouTube Data API v3 aracılığıyla çekilmektedir. Listede yer alan eserler ve telif hakları ilgili
            sanatçılara ve yapım şirketlerine aittir. Listede bulunmak sanatçıların sitemizle ticari ilişkisi
            olduğu anlamına gelmez.
          </p>
        </div>
      </div>
    </div>
  );
}
