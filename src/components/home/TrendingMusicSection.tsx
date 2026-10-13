'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, TrendingUp, Play, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';

import type { TrendingSong } from '@/lib/youtube';

export type { TrendingSong };

interface TrendingMusicSectionProps {
  songs: TrendingSong[];
  locale: string;
}

export default function TrendingMusicSection({ songs, locale }: TrendingMusicSectionProps) {
  const [filter, setFilter] = useState<'top10' | 'all' | 'top5'>('top10');
  const isTr = locale === 'tr';

  const displayedSongs =
    filter === 'top5'
      ? songs.slice(0, 5)
      : filter === 'all'
      ? songs.slice(0, 20)
      : songs.slice(0, 10);
  const nf = new Intl.NumberFormat(isTr ? 'tr-TR' : 'en-US');

  return (
    <section id="trends" className="relative overflow-hidden bg-studio-gradient py-24 text-white border-y border-studio">
      {/* Dynamic Drifting Glow backgrounds */}
      <div className="pointer-events-none absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-[#FF0033]/20 blur-[130px] animate-float-drift" />
      <div className="pointer-events-none absolute bottom-10 -right-32 h-96 w-96 rounded-full bg-zinc-600/15 blur-[130px] animate-glow-soft" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FF0033]/40 bg-[#FF0033]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9002B] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D9002B]" />
              </span>
              <Flame className="h-4 w-4 text-[#FF0033]" />
              {isTr ? 'YouTube Türkiye Müzik Listesi' : 'YouTube Music Charts'}
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
              {isTr ? 'Bugün Türkiye\'de' : 'Today on Trending'}{' '}
              <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                {isTr ? 'Trend Olan Müzik Klipleri' : 'Music Videos'}
              </span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              {isTr
                ? "YouTube'un resmî “En Popüler Müzik” listesi; izlenme sayılarıyla birlikte."
                : "YouTube's official “Most Popular Music” chart, with view counts."}
            </p>
          </div>

          {/* Tactile Pro Segmented Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-700/70 shadow-lg shadow-black/40 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setFilter('top10')}
              className={`flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2 text-xs font-extrabold transition-all duration-200 ${
                filter === 'top10'
                  ? 'bg-gradient-to-r from-[#E0002E] to-[#CC0029] text-white shadow-lg shadow-red-500/30 border border-red-400/40 scale-102'
                  : 'bg-zinc-800/60 text-zinc-300 hover:text-white hover:bg-zinc-700/70 border border-zinc-700/50 shadow-xs'
              }`}
            >
              <Flame className={`h-3.5 w-3.5 ${filter === 'top10' ? 'text-white' : 'text-zinc-400'}`} />
              {isTr ? 'İlk 10 Klip' : 'Top 10'}
            </button>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2 text-xs font-extrabold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-[#E0002E] to-[#CC0029] text-white shadow-lg shadow-red-500/30 border border-red-400/40 scale-102'
                  : 'bg-zinc-800/60 text-zinc-300 hover:text-white hover:bg-zinc-700/70 border border-zinc-700/50 shadow-xs'
              }`}
            >
              <Sparkles className={`h-3.5 w-3.5 ${filter === 'all' ? 'text-white' : 'text-zinc-400'}`} />
              {isTr ? 'Tüm 20 Trend' : 'All 20'}
            </button>
            <button
              type="button"
              onClick={() => setFilter('top5')}
              className={`flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2 text-xs font-extrabold transition-all duration-200 ${
                filter === 'top5'
                  ? 'bg-gradient-to-r from-[#E0002E] to-[#CC0029] text-white shadow-lg shadow-red-500/30 border border-red-400/40 scale-102'
                  : 'bg-zinc-800/60 text-zinc-300 hover:text-white hover:bg-zinc-700/70 border border-zinc-700/50 shadow-xs'
              }`}
            >
              <TrendingUp className={`h-3.5 w-3.5 ${filter === 'top5' ? 'text-white' : 'text-zinc-400'}`} />
              {isTr ? 'Zirve 5' : 'Top 5'}
            </button>
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {displayedSongs.map((song) => {
            const isFirst = song.rank === 1;
            const isSecond = song.rank === 2;
            const isThird = song.rank === 3;

            return (
              <div
                key={song.videoId}
                className={`group relative flex flex-col sm:flex-row items-center gap-4 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 ${
                  isFirst
                    ? 'border-[#FF0033]/60 bg-gradient-to-r from-[#FF0033]/25 via-zinc-850/90 to-zinc-900/90 shadow-xl shadow-[#FF0033]/20'
                    : 'border-studio bg-studio-card hover:border-studio-strong hover:bg-zinc-800/90 shadow-lg'
                }`}
              >
                {/* Rank Badge */}
                <div className="relative shrink-0">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl font-extrabold text-base ${
                      isFirst
                        ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/40'
                        : isSecond
                        ? 'bg-slate-300 text-black'
                        : isThird
                        ? 'bg-amber-700 text-white'
                        : 'bg-white/15 text-white/90'
                    }`}
                  >
                    #{song.rank}
                  </div>
                  {isFirst && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9002B] opacity-75" />
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#D9002B]" />
                    </span>
                  )}
                </div>

                {/* Thumbnail with overlay */}
                <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-xl bg-black/40">
                  <Image fill sizes="160px"
                    src={song.thumbnail}
                    alt={song.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <a
                    href={`https://www.youtube.com/watch?v=${song.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100"
                    title={isTr ? 'YouTube\'da Aç' : 'Watch on YouTube'}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D9002B] text-white shadow-lg">
                      <Play className="ml-0.5 h-5 w-5 fill-white" />
                    </div>
                  </a>
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="truncate text-xs font-semibold uppercase tracking-wider text-[#FF6B6B]">
                        {song.artist}
                      </span>
                      {isFirst && (
                        <div className="flex items-end gap-0.5 h-3.5 px-1.5 py-0.5 rounded bg-black/40 border border-white/20" title={isTr ? 'Şu An Canlı Zirvede' : 'Currently #1 on Trending'}>
                          <div className="w-0.5 bg-[#D9002B] rounded-full animate-eq-1" />
                          <div className="w-0.5 bg-white rounded-full animate-eq-2" />
                          <div className="w-0.5 bg-amber-400 rounded-full animate-eq-3" />
                        </div>
                      )}
                      {song.isNew && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          {isTr ? 'YENİ GİRİŞ' : 'NEW'}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-[#FF6B6B]">
                      {song.title}
                    </h3>
                  </div>

                  {/* Metrics */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-bold text-white/90 tabular-nums">
                      {nf.format(song.views)} {isTr ? 'İzlenme' : 'views'}
                    </span>
                    {song.gain24h > 0 && (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                        <TrendingUp className="h-3 w-3" />
                        +{nf.format(song.gain24h)} {isTr ? 'son 24s' : '24h'}
                      </span>
                    )}
                    <div className="ml-auto flex items-center gap-2">
                      {song.blogSlug && (
                        <Link
                          href={`/${locale}/blog/${song.blogSlug}`}
                          className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-zinc-300 hover:bg-[#FF0033]/30 hover:text-white transition"
                          title={isTr ? 'Sanatçı & Klip Analizi' : 'Analysis'}
                        >
                          {isTr ? 'Analiz' : 'Review'}
                        </Link>
                      )}
                      <a
                        href={`https://www.youtube.com/watch?v=${song.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 hover:text-white"
                        title={isTr ? "YouTube'da Aç" : 'Open on YouTube'}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore All 20 Trends Link */}
        <div className="mt-8 flex justify-center">
          <Link
            href={`/${locale}/trendler`}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-bold text-white shadow-xl backdrop-blur-xl hover:border-[#FF0033]/60 hover:bg-[#FF0033]/20 transition-all hover:scale-105"
          >
            <Flame className="h-4 w-4 text-[#FF0033]" />
            {isTr ? 'Tüm 20 Trend Şarkıyı ve Klip Analizlerini Canlı İncele' : 'Explore All 20 Trending Music Videos & Deep Analysis'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Conversion & Pitch Banner */}
        <div className="mt-14 relative overflow-hidden rounded-3xl border border-[#FF0033]/30 bg-gradient-to-r from-[#1A0B14] via-[#161224] to-[#0E0E1B] p-8 md:p-12 shadow-2xl">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-[#FF0033]/20 blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/20 px-3.5 py-1 text-xs font-bold text-[#FF6B6B]">
                <Sparkles className="h-3.5 w-3.5" />
                {isTr ? 'Algoritmik Büyüme Fırsatı' : 'Algorithmic Growth Engine'}
              </span>
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                {isTr
                  ? 'Kendi Klibinizi Doğru Kitleye Ulaştırın'
                  : 'Get Your Own Music Video in Front of the Right Audience'}
              </h3>
              <p className="text-sm leading-relaxed text-white/70 sm:text-base">
                {isTr
                  ? 'Linkinizi yapıştırın, videonuzu ve mevcut izlenmesini görün, istediğiniz izlenme paketini seçin. Kampanyalar resmî Google Ads video reklamlarıyla yürütülür; bot veya panel kullanılmaz.'
                  : 'Paste your link, see your video and its current views, then pick a views package. Campaigns run on official Google Ads video ads — no bots or panels.'}
              </p>
              <div className="text-xs text-white/40">
                {isTr
                  ? '* Veri Kaynağı: YouTube Data API v3 (chart=mostPopular, regionCode=TR, categoryId=10 Müzik). Sitemiz YouTube ile bağlantılı değildir; bağımsız reklam danışmanlığı sağlar.'
                  : '* Data Source: YouTube Data API v3. We provide independent official Google Ads video campaigns.'}
              </div>
            </div>

            <a
              href={`/${locale}/order`}
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-[#FF0033]/30 transition-all hover:scale-105 hover:shadow-[#FF0033]/40"
            >
              {isTr ? 'Videomu Tanıt' : 'Promote My Video'}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
