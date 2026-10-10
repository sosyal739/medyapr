import type { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Flame, TrendingUp, Play, ExternalLink, ArrowRight, Music, Clock } from 'lucide-react';
import type { TrendingSong } from '@/components/home/TrendingMusicSection';

import { getPageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';
  return {
    title: {
      absolute: isTr ? 'Türkiye YouTube Trend Şarkılar Listesi | MedyaPR' : 'Turkey Trending YouTube Music Videos | MedyaPR',
    },
    description: isTr
      ? 'Bugün YouTube Türkiye müzik trendlerinde ilk sırada hangi klipler var? Canlı izlenme sayıları, son 24 saatlik yükselişler ve resmi trend listesi.'
      : 'Live ranking of trending YouTube music videos in Turkey. Daily view velocity, algorithm insights, and top music releases.',
    alternates: getPageAlternates(locale, '/trendler'),
    openGraph: {
      title: isTr ? 'Türkiye YouTube Trend Şarkılar Listesi | MedyaPR' : 'Turkey Trending YouTube Music Videos | MedyaPR',
      description: isTr
        ? 'Bugün YouTube Türkiye müzik trendlerinde ilk sırada hangi klipler var? Canlı izlenme sayıları, son 24 saatlik yükselişler ve resmi trend listesi.'
        : 'Live ranking of trending YouTube music videos in Turkey.',
      url: `https://medyapr.com/${locale}/trendler`,
      images: ['/og-image.jpg'],
    },
  };
}

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
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end border-t border-white/5 pt-3 md:border-t-0 md:pt-0">
                  <Link
                    href={song.blogSlug ? `/${locale}/blog/${song.blogSlug}` : `/${locale}/blog`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition"
                  >
                    {isTr ? 'Trend & Klip Analizi' : 'Trend Analysis'}
                  </Link>
                  <a
                    href={`https://www.youtube.com/watch?v=${song.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 hover:text-white transition"
                    title="YouTube'da İzle"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`/${locale}#calculator`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-4 py-2 text-xs font-extrabold text-white shadow-lg shadow-[#FF0033]/20 hover:brightness-110 transition"
                  >
                    Klibini Tanıt <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Klip Lansman Planları & Dönüşüm Bölümü (Sanatçılar & Müzisyenler İçin) ── */}
        <div className="mt-16 rounded-3xl border border-[#FF0033]/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="max-w-3xl mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/20 px-3.5 py-1 text-xs font-extrabold text-[#FF6B6B] uppercase tracking-wider mb-3">
              🚀 Resmi Google Ads ile YouTube Trend Stratejisi
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Kendi Klibinizi YouTube Trendlerine Taşıyacak Lansman Planları
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
              Bu listedeki kliplerin ortak noktası; ilk 24-48 saatte aldıkları yüksek izlenme tutunması (%65+ Retention) ve resmi Google Ads reklam ivmesidir. Bot panelleri kanalı algoritmada cezalandırırken, MedyaPR ile %100 resmi reklamlarla organik keşfet trafiğinizi başlatın.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Paket 1: Starter Launch */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Başlangıç Lansmanı</span>
                <h3 className="text-xl font-extrabold text-white mt-1">Starter PR</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">50.000</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">Gerçek İzlenme</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">3.250 ₺ · İlk 48 Saat İvmesi</p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ Atlanabilir In-Stream Resmi Reklam</li>
                  <li className="flex items-center gap-2">✓ %100 YouTube Studio / Analytics Tescili</li>
                  <li className="flex items-center gap-2">✓ Müzik Türü &amp; Demografik Hedefleme</li>
                  <li className="flex items-center gap-2">✓ %50 Onayda, %50 Bitince Ödeme</li>
                </ul>
              </div>
              <a
                href={`/${locale}#calculator`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-xs font-extrabold text-white hover:bg-zinc-700 transition"
              >
                Paketi Seç &amp; Başlat
              </a>
            </div>

            {/* Paket 2: Growth Momentum (Öne Çıkan) */}
            <div className="rounded-2xl border-2 border-[#FF0033] bg-gradient-to-b from-[#FF0033]/15 via-zinc-900/90 to-zinc-950 p-6 flex flex-col justify-between shadow-xl shadow-[#FF0033]/20 relative">
              <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-3 py-0.5 text-[10px] font-black text-white uppercase tracking-wider shadow-md">
                En Popüler Klip Lansmanı
              </span>
              <div>
                <span className="text-xs font-bold text-[#FF6B6B] uppercase tracking-wider">Algoritma &amp; Keşfet</span>
                <h3 className="text-xl font-extrabold text-white mt-1">Growth Momentum</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">100.000</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">Gerçek İzlenme</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">5.500 ₺ · Önerilen Videolar Hedefi</p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-200 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ In-Stream + In-Feed Keşfet Reklamı</li>
                  <li className="flex items-center gap-2">✓ %65+ Ortalama İzleme Süresi (Retention)</li>
                  <li className="flex items-center gap-2">✓ Benzer Sanatçıların Kitlelerine Gösterim</li>
                  <li className="flex items-center gap-2">✓ Detaylı Kampanya ve Dönüşüm Raporu</li>
                  <li className="flex items-center gap-2 font-bold text-emerald-400">✓ %50 Onayda, %50 Bitince Ödeme</li>
                </ul>
              </div>
              <a
                href={`/${locale}#calculator`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-4 py-3 text-xs font-black text-white shadow-lg shadow-[#FF0033]/30 hover:brightness-110 transition"
              >
                Hemen Başlat <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Paket 3: Viral Trend PR */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Trend &amp; Ulusal Çıkış</span>
                <h3 className="text-xl font-extrabold text-white mt-1">Viral Breakthrough</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">250.000+</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">Gerçek İzlenme</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">11.500 ₺ · YouTube Trend 20 Listesi</p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ YouTube Shorts + Video Reklam Karması</li>
                  <li className="flex items-center gap-2">✓ Türkiye &amp; Avrupa (Gurbetçi) Kitle Hedefi</li>
                  <li className="flex items-center gap-2">✓ Radyo &amp; Yapımcı Radarına Girme Desteği</li>
                  <li className="flex items-center gap-2">✓ 7/24 Öncelikli Danışmanlık Hattı</li>
                </ul>
              </div>
              <a
                href={`/${locale}#calculator`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-xs font-extrabold text-white hover:bg-zinc-700 transition"
              >
                Paketi Seç &amp; Başlat
              </a>
            </div>
          </div>

          {/* Quick WhatsApp Consultation Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-zinc-800/50 p-4 border border-zinc-700/50">
            <div className="text-xs text-zinc-300 text-center sm:text-left">
              💬 <strong className="text-white">Özel klip lansman bütçeniz veya yapım şirketi anlaşmanız mı var?</strong> Stratejistimizle doğrudan görüşün.
            </div>
            <a
              href="https://wa.me/905312993355?text=Merhaba%2C%20klip%20lansman%C4%B1m%20ve%20YouTube%20trend%20paketleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition"
            >
              WhatsApp ile Danışın (+90 531 299 33 55)
            </a>
          </div>
        </div>

        {/* Footer Policy Attribution */}
        <div className="mt-14 rounded-2xl border border-studio bg-studio-card p-6 text-xs text-zinc-400 space-y-2">
          <p className="font-semibold text-zinc-200">
            📌 YouTube API Hizmet Politikaları &amp; Telif Bildirimi
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
