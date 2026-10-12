'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flame, TrendingUp, Play, ExternalLink, ArrowRight, Music, Clock, Sparkles } from 'lucide-react';
import type { TrendingSong } from '@/components/home/TrendingMusicSection';

export interface MultiCountryTrends {
  tr: TrendingSong[];
  us: TrendingSong[];
  de: TrendingSong[];
  gb: TrendingSong[];
}

interface TrendingCountryTabsProps {
  trends: MultiCountryTrends;
  locale: string;
  initialCountry?: 'tr' | 'us' | 'de' | 'gb';
}

const COUNTRIES = [
  { id: 'tr', flag: '🇹🇷', labelTr: 'Türkiye', labelEn: 'Turkey', subTr: 'YouTube TR Müzik', subEn: 'YouTube TR Charts' },
  { id: 'us', flag: '🇺🇸', labelTr: 'Amerika (US)', labelEn: 'United States', subTr: 'YouTube US Müzik', subEn: 'YouTube US Charts' },
  { id: 'de', flag: '🇩🇪', labelTr: 'Almanya (DE)', labelEn: 'Germany', subTr: 'YouTube DE Müzik', subEn: 'YouTube DE Charts' },
  { id: 'gb', flag: '🇬🇧', labelTr: 'İngiltere (UK)', labelEn: 'United Kingdom', subTr: 'YouTube UK Müzik', subEn: 'YouTube UK Charts' },
] as const;

export default function TrendingCountryTabs({ trends, locale, initialCountry }: TrendingCountryTabsProps) {
  const isTr = locale === 'tr';
  const defaultCountry = initialCountry || (isTr ? 'tr' : 'us');
  const [selectedCountry, setSelectedCountry] = useState<'tr' | 'us' | 'de' | 'gb'>(defaultCountry);
  const [filter, setFilter] = useState<'all' | 'top10' | 'top5'>('all');

  const currentSongs = trends[selectedCountry] || trends.tr || [];
  const displayedSongs =
    filter === 'top5'
      ? currentSongs.slice(0, 5)
      : filter === 'top10'
      ? currentSongs.slice(0, 10)
      : currentSongs.slice(0, 20);

  const nf = new Intl.NumberFormat(isTr ? 'tr-TR' : 'en-US');
  const activeCountryObj = COUNTRIES.find((c) => c.id === selectedCountry) || COUNTRIES[0];

  return (
    <div className="space-y-8">
      {/* Country Selection Pill Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-studio pb-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {COUNTRIES.map((c) => {
            const isActive = selectedCountry === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCountry(c.id as any)}
                className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF0033] to-[#CC0029] text-white shadow-lg shadow-[#FF0033]/30 scale-105'
                    : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60'
                }`}
              >
                <span className="text-lg">{c.flag}</span>
                <span className="tracking-tight">{isTr ? c.labelTr : c.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isActive ? 'bg-white/20 text-white' : 'bg-zinc-700/80 text-zinc-400 group-hover:text-zinc-200'
                }`}>
                  Top 20
                </span>
              </button>
            );
          })}
        </div>

        {/* Count Filter (Top 5 / Top 10 / All 20) */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-700/60 p-1.5 rounded-2xl text-xs font-semibold text-zinc-300">
          <button
            onClick={() => setFilter('top5')}
            className={`px-3 py-1.5 rounded-xl transition ${filter === 'top5' ? 'bg-[#FF0033] text-white' : 'hover:text-white'}`}
          >
            Top 5
          </button>
          <button
            onClick={() => setFilter('top10')}
            className={`px-3 py-1.5 rounded-xl transition ${filter === 'top10' ? 'bg-[#FF0033] text-white' : 'hover:text-white'}`}
          >
            Top 10
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition ${filter === 'all' ? 'bg-[#FF0033] text-white' : 'hover:text-white'}`}
          >
            {isTr ? 'Tüm 20 Şarkı' : 'All 20 Songs'}
          </button>
        </div>
      </div>

      {/* Active Chart Header Sub-banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0033]/20 border border-[#FF0033]/40 text-2xl">
            {activeCountryObj.flag}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{isTr ? activeCountryObj.labelTr : activeCountryObj.labelEn}</span>
              <span className="text-xs font-normal text-zinc-400">
                ({isTr ? activeCountryObj.subTr : activeCountryObj.subEn})
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              {isTr
                ? 'Son 24 saatlik izlenme ivmesi ve YouTube Trend listesi.'
                : 'Last 24 hours view velocity and official YouTube Trending chart.'}
            </p>
          </div>
        </div>

        <Link
          href={`/${locale}/fiyatlandirma`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          {isTr ? 'Klibinizi Bu Listeye Taşıyın →' : 'Promote Your Video to Trending →'}
        </Link>
      </div>

      {/* Song Grid / Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedSongs.map((song) => {
          const isTop3 = song.rank <= 3;
          return (
            <div
              key={`${selectedCountry}-${song.rank}-${song.videoId}`}
              className={`group relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                isTop3
                  ? 'bg-gradient-to-br from-zinc-900/95 via-zinc-800/70 to-zinc-900/95 border-[#FF0033]/40 shadow-xl shadow-[#FF0033]/10 hover:border-[#FF0033]/70'
                  : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/90'
              }`}
            >
              {/* Rank Badge */}
              <div className="absolute -top-3 -left-3 z-10">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-black shadow-lg ${
                    song.rank === 1
                      ? 'bg-amber-400 text-zinc-950 shadow-amber-400/40'
                      : song.rank === 2
                      ? 'bg-slate-300 text-zinc-950 shadow-slate-300/40'
                      : song.rank === 3
                      ? 'bg-amber-700 text-white shadow-amber-700/40'
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}
                >
                  #{song.rank}
                </span>
              </div>

              {/* Thumbnail with Play Overlay */}
              <div className="relative w-full sm:w-44 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-950">
                <img
                  src={song.thumbnail}
                  alt={`${song.artist} - ${song.title}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <a
                  href={`https://www.youtube.com/watch?v=${song.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Play on YouTube"
                >
                  <div className="h-10 w-10 rounded-full bg-[#FF0033] flex items-center justify-center text-white shadow-lg shadow-[#FF0033]/50">
                    <Play className="h-5 w-5 fill-white ml-0.5" />
                  </div>
                </a>
              </div>

              {/* Info Column */}
              <div className="flex flex-col justify-between flex-grow min-w-0">
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-[#FF5E7E] transition">
                    {song.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium line-clamp-1 mt-0.5">{song.artist}</p>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap items-center gap-3 text-xs my-2">
                  <div className="flex items-center gap-1 text-zinc-300">
                    <Music className="h-3 w-3 text-zinc-500" />
                    <span>{nf.format(song.views)} {isTr ? 'izlenme' : 'views'}</span>
                  </div>
                  {song.gain24h > 0 && (
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      <TrendingUp className="h-3 w-3" />
                      <span>+{nf.format(song.gain24h)} {isTr ? '/ 24s' : '/ 24h'}</span>
                    </div>
                  )}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                  <a
                    href={`https://www.youtube.com/watch?v=${song.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-300 hover:text-white transition"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  {song.blogSlug && (
                    <Link
                      href={`/${locale}/blog/${song.blogSlug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF6B6B] hover:text-[#FF8E53] underline decoration-[#FF0033]/40 underline-offset-2 transition ml-auto"
                    >
                      <span>{isTr ? 'Klip PR Analizi' : 'Strategy Breakdown'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
