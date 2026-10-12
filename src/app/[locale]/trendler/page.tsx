import type { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import type { TrendingSong } from '@/components/home/TrendingMusicSection';
import TrendingCountryTabs, { type MultiCountryTrends } from '@/components/trends/TrendingCountryTabs';
import { getPageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';
  return {
    title: {
      absolute: isTr
        ? 'Dünya & Türkiye YouTube Trend Müzik Klipleri | MedyaPR'
        : 'Global & Trending YouTube Music Videos (US, UK, DE, TR) | MedyaPR',
    },
    description: isTr
      ? 'YouTube Türkiye, ABD, Almanya ve İngiltere canlı müzik trendleri sıralaması. Günlük izlenme artışları, resmi liste verileri ve klip PR stratejileri.'
      : 'Real-time trending YouTube music videos across the US, UK, Germany, and Turkey. Live view velocity, algorithm benchmarks, and official PR promotion strategies.',
    alternates: getPageAlternates(locale, '/trendler'),
    openGraph: {
      title: isTr
        ? 'Dünya & Türkiye YouTube Trend Müzik Klipleri | MedyaPR'
        : 'Global & Trending YouTube Music Videos (US, UK, DE, TR) | MedyaPR',
      description: isTr
        ? 'YouTube Türkiye, ABD, Almanya ve İngiltere canlı müzik trendleri sıralaması. Günlük izlenme artışları ve resmi liste verileri.'
        : 'Real-time trending YouTube music videos across the US, UK, Germany, and Turkey.',
      url: `https://medyapr.com/${locale}/trendler`,
      images: ['/og-image.jpg'],
    },
  };
}

async function getAllTrendingSongs(): Promise<MultiCountryTrends> {
  try {
    const file = path.join(process.cwd(), 'data', 'trending_songs.json');
    const content = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return { tr: parsed, us: [], de: [], gb: [] };
    }
    return {
      tr: Array.isArray(parsed.tr) ? parsed.tr : [],
      us: Array.isArray(parsed.us) ? parsed.us : [],
      de: Array.isArray(parsed.de) ? parsed.de : [],
      gb: Array.isArray(parsed.gb) ? parsed.gb : [],
    };
  } catch {
    return { tr: [], us: [], de: [], gb: [] };
  }
}

export default async function TrendlerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isTr = locale === 'tr';
  const allTrends = await getAllTrendingSongs();
  const primarySongs: TrendingSong[] = (isTr ? allTrends.tr : allTrends.us).length > 0
    ? (isTr ? allTrends.tr : allTrends.us)
    : allTrends.tr;

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
        name: isTr
          ? 'YouTube Trend Müzik Klipleri Listesi (Türkiye & Dünya)'
          : 'YouTube Trending Music Videos Chart (Global & Regional)',
        description: isTr
          ? 'YouTube canlı müzik listesinde en çok izlenen ve yükselişte olan şarkılar sıralaması.'
          : 'Official ranking of trending YouTube music videos across the US, UK, Germany, and Turkey.',
        itemListElement: primarySongs.slice(0, 20).map((s, idx) => ({
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
            {isTr ? 'Ana Sayfa' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#FF6B6B]">{isTr ? 'Trend Şarkılar' : 'Trending Music'}</span>
        </div>

        {/* Header */}
        <div className="mb-10 border-b border-studio pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E] mb-3">
            <Flame className="h-4 w-4 animate-pulse text-[#FF0033]" />
            {isTr ? `Günlük Canlı Güncelleme · ${todayStr}` : `Daily Live Charts · ${todayStr}`}
          </div>
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight">
            {isTr ? (
              <>
                Dünya &amp; Türkiye YouTube{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Trend Müzik Klipleri
                </span>
              </>
            ) : (
              <>
                Global &amp; Regional YouTube{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Trending Music Videos
                </span>
              </>
            )}
          </h1>
          <p className="mt-3 text-sm md:text-base text-zinc-300 max-w-3xl leading-relaxed">
            {isTr
              ? 'YouTube Data API v3 üzerinden resmi olarak çekilen anlık Türkiye, ABD, Almanya ve İngiltere müzik trendleri sıralaması. Kliplerin toplam izlenmeleri, beğeni sayıları ve son 24 saatlik ivme analizi.'
              : 'Real-time YouTube music trending charts across the United States, United Kingdom, Germany, and Turkey powered by official YouTube Data API. Total views, 24h velocity, and viral music video breakdown.'}
          </p>
        </div>

        {/* Interactive Multi-Country Tabs & Songs Grid */}
        <TrendingCountryTabs trends={allTrends} locale={locale} initialCountry={isTr ? 'tr' : 'us'} />

        {/* ── Klip Lansman Planları & Dönüşüm Bölümü (Sanatçılar & Müzisyenler İçin) ── */}
        <div className="mt-16 rounded-3xl border border-[#FF0033]/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="max-w-3xl mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/20 px-3.5 py-1 text-xs font-extrabold text-[#FF6B6B] uppercase tracking-wider mb-3">
              {isTr ? '🚀 Resmi Google Ads ile YouTube Trend Stratejisi' : '🚀 Official Google Ads YouTube Trending Strategy'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isTr
                ? 'Kendi Klibinizi YouTube Trendlerine Taşıyacak Lansman Planları'
                : 'Music Video Launch Plans to Break Into YouTube Trending'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
              {isTr
                ? 'Bu listedeki kliplerin ortak noktası; ilk 24-48 saatte aldıkları yüksek izlenme tutunması (%65+ Retention) ve resmi Google Ads reklam ivmesidir. Bot panelleri kanalı algoritmada cezalandırırken, MedyaPR ile %100 resmi reklamlarla organik keşfet trafiğinizi başlatın.'
                : 'Every breakout music video on these charts relies on high early audience retention (65%+) and official Google Ads discovery velocity in the first 48 hours. Avoid bot panels that trigger shadowbans — kickstart authentic algorithm recommendation with MedyaPR.'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Paket 1: Starter Launch */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {isTr ? 'Başlangıç Lansmanı' : 'Starter Launch'}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">Starter PR</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">50.000</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">{isTr ? 'Gerçek İzlenme' : 'Real Views'}</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    {isTr ? '3.250 ₺ · İlk 48 Saat İvmesi' : '$120 · First 48h Momentum'}
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ {isTr ? 'Atlanabilir In-Stream Resmi Reklam' : 'Skippable In-Stream Official Ads'}</li>
                  <li className="flex items-center gap-2">✓ {isTr ? '%100 YouTube Studio / Analytics Tescili' : '100% YouTube Studio / Analytics Verified'}</li>
                  <li className="flex items-center gap-2">✓ {isTr ? 'Müzik Türü & Demografik Hedefleme' : 'Music Genre & Demographic Targeting'}</li>
                  <li className="flex items-center gap-2">✓ {isTr ? '%50 Onayda, %50 Bitince Ödeme' : '50% Upfront, 50% on Delivery'}</li>
                </ul>
              </div>
              <a
                href={`/${locale}#calculator`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-xs font-extrabold text-white hover:bg-zinc-700 transition"
              >
                {isTr ? 'Paketi Seç & Başlat' : 'Select Plan & Start'}
              </a>
            </div>

            {/* Paket 2: Growth Momentum (Öne Çıkan) */}
            <div className="rounded-2xl border-2 border-[#FF0033] bg-gradient-to-b from-[#FF0033]/15 via-zinc-900/90 to-zinc-950 p-6 flex flex-col justify-between shadow-xl shadow-[#FF0033]/20 relative">
              <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-3 py-0.5 text-[10px] font-black text-white uppercase tracking-wider shadow-md">
                {isTr ? 'En Popüler Klip Lansmanı' : 'Most Popular Launch'}
              </span>
              <div>
                <span className="text-xs font-bold text-[#FF6B6B] uppercase tracking-wider">
                  {isTr ? 'Algoritma & Keşfet' : 'Algorithm & Suggested'}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">Growth Momentum</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">100.000</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">{isTr ? 'Gerçek İzlenme' : 'Real Views'}</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    {isTr ? '5.500 ₺ · Önerilen Videolar Hedefi' : '$190 · Suggested Videos Target'}
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-200 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ {isTr ? 'In-Stream + In-Feed Keşfet Reklamı' : 'In-Stream + In-Feed Discovery Ads'}</li>
                  <li className="flex items-center gap-2">✓ {isTr ? '%65+ Ortalama İzleme Süresi (Retention)' : '65%+ Average Watch Time Retention'}</li>
                  <li className="flex items-center gap-2">✓ {isTr ? 'Benzer Sanatçıların Kitlelerine Gösterim' : 'Target Fans of Similar Hit Artists'}</li>
                  <li className="flex items-center gap-2">✓ {isTr ? 'Detaylı Kampanya ve Dönüşüm Raporu' : 'Comprehensive Campaign & Conversion Report'}</li>
                  <li className="flex items-center gap-2 font-bold text-emerald-400">✓ {isTr ? '%50 Onayda, %50 Bitince Ödeme' : '50% Upfront, 50% on Delivery'}</li>
                </ul>
              </div>
              <a
                href={`/${locale}#calculator`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-4 py-3 text-xs font-black text-white shadow-lg shadow-[#FF0033]/30 hover:brightness-110 transition"
              >
                {isTr ? 'Hemen Başlat' : 'Launch Now'} <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Paket 3: Viral Trend PR */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {isTr ? 'Trend & Ulusal Çıkış' : 'Trend & Global Reach'}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">Viral Breakthrough</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">250.000+</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">{isTr ? 'Gerçek İzlenme' : 'Real Views'}</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    {isTr ? '11.500 ₺ · YouTube Trend 20 Listesi' : '$390 · Trending Chart Target'}
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ {isTr ? 'YouTube Shorts + Video Reklam Karması' : 'YouTube Shorts + Video Ads Mix'}</li>
                  <li className="flex items-center gap-2">✓ {isTr ? 'Türkiye & Avrupa (Gurbetçi) Kitle Hedefi' : 'US, UK, DE & Global Cross-Audience'}</li>
                  <li className="flex items-center gap-2">✓ {isTr ? 'Radyo & Yapımcı Radarına Girme Desteği' : 'Radio & A&R Label Radar Exposure'}</li>
                  <li className="flex items-center gap-2">✓ {isTr ? '7/24 Öncelikli Danışmanlık Hattı' : '24/7 Priority PR Strategist Line'}</li>
                </ul>
              </div>
              <a
                href={`/${locale}#calculator`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-xs font-extrabold text-white hover:bg-zinc-700 transition"
              >
                {isTr ? 'Paketi Seç & Başlat' : 'Select Plan & Start'}
              </a>
            </div>
          </div>

          {/* Quick WhatsApp Consultation Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-zinc-800/50 p-4 border border-zinc-700/50">
            <div className="text-xs text-zinc-300 text-center sm:text-left">
              💬 <strong className="text-white">
                {isTr
                  ? 'Özel klip lansman bütçeniz veya yapım şirketi anlaşmanız mı var?'
                  : 'Have a custom music video launch budget or record label contract?'}
              </strong>{' '}
              {isTr ? 'Stratejistimizle doğrudan görüşün.' : 'Chat directly with our lead PR strategist.'}
            </div>
            <a
              href={`https://wa.me/905312993355?text=${encodeURIComponent(
                isTr
                  ? 'Merhaba, klip lansmanım ve YouTube trend paketleri hakkında bilgi almak istiyorum.'
                  : 'Hello, I would like to get information regarding music video PR and YouTube trending campaign packages.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition"
            >
              {isTr ? 'WhatsApp ile Danışın (+90 531 299 33 55)' : 'Chat on WhatsApp (+90 531 299 33 55)'}
            </a>
          </div>
        </div>

        {/* Footer Policy Attribution */}
        <div className="mt-14 rounded-2xl border border-studio bg-studio-card p-6 text-xs text-zinc-400 space-y-2">
          <p className="font-semibold text-zinc-200">
            📌 {isTr ? 'YouTube API Hizmet Politikaları & Telif Bildirimi' : 'YouTube API Terms of Service & Copyright Notice'}
          </p>
          <p>
            {isTr
              ? 'Bu sayfada yer alan video başlıkları, küçük resimler ve izlenme istatistikleri doğrudan resmi YouTube Data API v3 aracılığıyla çekilmektedir. Listede yer alan eserler ve telif hakları ilgili sanatçılara ve yapım şirketlerine aittir. Listede bulunmak sanatçıların sitemizle ticari ilişkisi olduğu anlamına gelmez.'
              : 'Video titles, thumbnails, and view statistics displayed on this chart are retrieved via official YouTube Data API v3. All copyrights and trademarks belong to their respective artists and record labels. Inclusion on this chart does not imply commercial endorsement.'}
          </p>
        </div>
      </div>
    </div>
  );
}
