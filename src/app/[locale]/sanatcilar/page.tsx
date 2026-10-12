import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, Play, ArrowRight, TrendingUp } from 'lucide-react';
import { getArtists } from '@/lib/content';

import { getPageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';
  return {
    title: {
      absolute: isTr ? 'Trend Türk Sanatçılar & Müzik Grupları | MedyaPR' : 'Trending Turkish Artists & Music Groups | MedyaPR',
    },
    description: isTr
      ? 'YouTube Türkiye müzik listelerinde zirvede yer alan sanatçılar, en popüler klipleri, biyografileri ve dijital dinleyici istatistikleri.'
      : 'Top trending artists in Turkey YouTube music charts, hit video clips, artist biographies, and audience analytics.',
    alternates: getPageAlternates(locale, '/sanatcilar'),
    openGraph: {
      title: isTr ? 'Trend Türk Sanatçılar & Müzik Grupları | MedyaPR' : 'Trending Turkish Artists & Music Groups | MedyaPR',
      description: isTr
        ? 'YouTube Türkiye müzik listelerinde zirvede yer alan sanatçılar, en popüler klipleri, biyografileri ve dijital dinleyici istatistikleri.'
        : 'Top trending artists in Turkey YouTube music charts.',
      url: `https://medyapr.com/${locale}/sanatcilar`,
      images: ['/og-image.jpg'],
    },
  };
}

export default async function SanatcilarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const artists = await getArtists();
  const isTr = locale === 'tr';

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
            name: isTr ? 'Sanatçılar' : 'Artists',
            item: `https://medyapr.com/${locale}/sanatcilar`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: isTr ? 'Öne Çıkan Türk Sanatçılar ve Müzik Grupları' : 'Featured Turkish Music Artists and Groups',
        description: isTr
          ? 'YouTube Türkiye listelerinin en çok dinlenen müzisyenleri ve klip istatistikleri.'
          : 'Leading musicians, artists, and bands in YouTube Turkey.',
        itemListElement: artists.map((a, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: a.name,
          url: `https://medyapr.com/${locale}/sanatci/${a.slug}`,
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
      {/* Glow */}
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#FF0033]/15 blur-[160px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[150px] animate-float-drift" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-white transition">
            {isTr ? 'Ana Sayfa' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#FF6B6B]">{isTr ? 'Sanatçılar' : 'Artists'}</span>
        </div>

        {/* Header */}
        <div className="mb-14 border-b border-studio pb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E] mb-3">
            <Users className="h-4 w-4 text-[#FF0033]" />
            {isTr ? 'Sanatçı & Grup Rehberi' : 'Artists Directory'}
          </span>
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight">
            {isTr ? (
              <>
                Trend{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Sanatçılar &amp; Gruplar
                </span>
              </>
            ) : (
              <>
                Trending{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Artists &amp; Bands
                </span>
              </>
            )}
          </h1>
          <p className="mt-3 text-sm md:text-base text-zinc-300 max-w-2xl leading-relaxed">
            {isTr
              ? 'YouTube Türkiye müzik listelerinde milyonlarca dinleyiciye ulaşan sanatçıların kariyerleri, hit parçaları ve büyüme verileri.'
              : 'Discover top Turkish musical artists dominating the charts.'}
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {artists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/${locale}/sanatci/${artist.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-studio bg-studio-card p-6 backdrop-blur-xl transition hover:border-studio-strong hover:bg-zinc-800/90 shadow-xl"
            >
              <div>
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/40 mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/10">
                    {artist.genre}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-extrabold text-white group-hover:text-[#FF6B6B] transition-colors">
                    {artist.name}
                  </h2>
                  <span className="text-xs font-bold text-emerald-400">
                    {artist.monthlyAudience}
                  </span>
                </div>

                <p className="text-xs text-white/50 mb-3">
                  {isTr ? 'Son Hit:' : 'Latest Hit:'} <strong className="text-white">{artist.latestHit}</strong>
                </p>

                <p className="text-sm leading-relaxed text-white/65 line-clamp-3">
                  {artist.bio}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs font-semibold text-[#FF6B6B]">
                <span>{isTr ? 'Sanatçı Profilini İncele' : 'View Artist Profile'}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
