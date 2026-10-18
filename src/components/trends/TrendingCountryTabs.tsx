'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flame,
  TrendingUp,
  Play,
  ExternalLink,
  ArrowRight,
  Music,
  Sparkles,
  SlidersHorizontal,
  BookOpen,
} from 'lucide-react';
import type { MultiCountryTrends } from '@/lib/youtube';
import { AR_TREND_REGIONS, type TrendRegion } from '@/lib/trend-regions';

export type { MultiCountryTrends };

interface TrendingCountryTabsProps {
  trends: MultiCountryTrends;
  locale: string;
  initialCountry?: TrendRegion;
}

const COUNTRIES = [
  { id: 'tr', flag: '🇹🇷', labelTr: 'Türkiye', labelEn: 'Turkey', labelAr: 'تركيا', subTr: 'YouTube TR Müzik', subEn: 'YouTube TR Charts' , subAr: 'قوائم يوتيوب تركيا'},
  { id: 'us', flag: '🇺🇸', labelTr: 'Amerika (US)', labelEn: 'United States', labelAr: 'الولايات المتحدة', subTr: 'YouTube US Müzik', subEn: 'YouTube US Charts' , subAr: 'قوائم يوتيوب أمريكا'},
  { id: 'de', flag: '🇩🇪', labelTr: 'Almanya (DE)', labelEn: 'Germany', labelAr: 'ألمانيا', subTr: 'YouTube DE Müzik', subEn: 'YouTube DE Charts' , subAr: 'قوائم يوتيوب ألمانيا'},
  { id: 'gb', flag: '🇬🇧', labelTr: 'İngiltere (UK)', labelEn: 'United Kingdom', labelAr: 'المملكة المتحدة', subTr: 'YouTube UK Müzik', subEn: 'YouTube UK Charts' , subAr: 'قوائم يوتيوب بريطانيا'},
  { id: 'sa', flag: '🇸🇦', labelTr: 'Suudi Arabistan', labelEn: 'Saudi Arabia', labelAr: 'السعودية', subTr: 'YouTube SA Müzik', subEn: 'YouTube SA Charts', subAr: 'قوائم يوتيوب السعودية' },
  { id: 'eg', flag: '🇪🇬', labelTr: 'Mısır', labelEn: 'Egypt', labelAr: 'مصر', subTr: 'YouTube EG Müzik', subEn: 'YouTube EG Charts', subAr: 'قوائم يوتيوب مصر' },
  { id: 'ma', flag: '🇲🇦', labelTr: 'Fas', labelEn: 'Morocco', labelAr: 'المغرب', subTr: 'YouTube MA Müzik', subEn: 'YouTube MA Charts', subAr: 'قوائم يوتيوب المغرب' },
] as const;

const GENRE_FILTERS = [
  { id: 'all', icon: '🌐', labelTr: 'Tüm Türler', labelEn: 'All Genres' , labelAr: 'كل الأنواع'},
  { id: 'hiphop', icon: '🔥', labelTr: 'Hip-Hop / Rap', labelEn: 'Hip-Hop / Rap', labelAr: 'هيب هوب / راب', guideSlug: 'hip-hop-rap-youtube-video-promotion-pr-strategy-guide' },
  { id: 'indie', icon: '🌿', labelTr: 'Indie / Alt', labelEn: 'Indie / Alt', labelAr: 'إندي / ألترناتيف', guideSlug: 'indie-alternative-music-video-promotion-pr-strategy-guide' },
  { id: 'edm', icon: '⚡', labelTr: 'EDM / Dance', labelEn: 'EDM / Dance', labelAr: 'EDM / دانس', guideSlug: 'edm-electronic-music-video-youtube-promotion-guide' },
  { id: 'rock', icon: '🎸', labelTr: 'Rock / Metal', labelEn: 'Rock / Metal', labelAr: 'روك / ميتال', guideSlug: 'rock-metal-music-video-promotion-youtube-strategy-guide' },
  { id: 'pop', icon: '✨', labelTr: 'Pop / Mainstream', labelEn: 'Pop / Mainstream' , labelAr: 'بوب / جماهيري'},
] as const;

const GENRE_LABELS: Record<string, { tr: string; en: string; ar: string; icon: string }> = {
  hiphop: { tr: 'Hip-Hop / Rap', en: 'Hip-Hop / Rap', ar: 'هيب هوب / راب', icon: '🔥' },
  indie: { tr: 'Indie / Alternatif', en: 'Indie / Alt', ar: 'إندي / ألترناتيف', icon: '🌿' },
  edm: { tr: 'EDM / Elektronik', en: 'EDM / Dance', ar: 'EDM / دانس', icon: '⚡' },
  rock: { tr: 'Rock / Metal', en: 'Rock / Metal', ar: 'روك / ميتال', icon: '🎸' },
  pop: { tr: 'Pop / Hit', en: 'Pop / Mainstream', ar: 'بوب / جماهيري', icon: '✨' },
};

const GENRE_PLAYBOOKS: Record<
  string,
  { titleTr: string; titleEn: string; titleAr: string; descTr: string; descEn: string; descAr: string; guideSlug: string; ctaTr: string; ctaEn: string ; ctaAr: string}
> = {
  hiphop: {
    titleTr: '🔥 Hip-Hop & Rap Klip PR Stratejisi',
    titleEn: '🔥 Hip-Hop & Rap YouTube Video PR Playbook',
    titleAr: '🔥 دليل الترويج لفيديوهات الهيب هوب والراب على يوتيوب',
    descTr: 'İlk 48 saatte %65+ izleme tutunması (retention) ile YouTube algoritmasının dikkatini çekin ve drill/trap kitlelerini hedefleyin.',
    descEn: 'Drive 62%+ retention in the first 48 hours to trigger Suggested Videos and algorithmic radio streams for rap releases.',
    descAr: 'حقق احتفاظًا بالمشاهدة يتجاوز 62% في أول 48 ساعة لتفعيل الفيديوهات المقترحة وقوائم الراديو الخوارزمية لإصدارات الراب.',
    guideSlug: 'hip-hop-rap-youtube-video-promotion-pr-strategy-guide',
    ctaTr: 'Hip-Hop Kampanyası Başlat',
    ctaEn: 'Launch Rap Campaign',
    ctaAr: 'أطلق حملة الراب',
  },
  indie: {
    titleTr: '🌿 Indie & Alternatif Müzik PR Stratejisi',
    titleEn: '🌿 Indie & Alternative YouTube PR Playbook',
    titleAr: '🌿 دليل الترويج للإندي والألترناتيف على يوتيوب',
    descTr: 'In-Feed Keşfet reklamlarıyla Hozier, Billie Eilish ve Phoebe Bridgers dinleyicilerini hedefleyerek sadık hayran kitlesi oluşturun.',
    descEn: 'Leverage In-Feed Discovery ads and artist affinity targeting to convert bedroom pop and indie folk listeners into cult fans.',
    descAr: 'استفد من إعلانات In-Feed للاكتشاف والاستهداف حسب اهتمامات الفنانين المشابهين لتحويل مستمعي البوب المنزلي والفولك المستقل إلى جمهور وفيّ.',
    guideSlug: 'indie-alternative-music-video-promotion-pr-strategy-guide',
    ctaTr: 'Indie Kampanyası Başlat',
    ctaEn: 'Launch Indie Campaign',
    ctaAr: 'أطلق حملة الإندي',
  },
  edm: {
    titleTr: '⚡ EDM & Elektronik Müzik PR Stratejisi',
    titleEn: '⚡ EDM & Electronic Music Video PR Playbook',
    titleAr: '⚡ دليل الترويج لفيديوهات EDM والموسيقى الإلكترونية',
    descTr: '4K sinematik visualizer ve festival drop kesitleriyle küresel dans dinleyicilerine en optimize birim maliyetle ulaşın.',
    descEn: 'Scale 4K visualizers and festival crowd drops worldwide across ADE, UK, and European dance music circuits.',
    descAr: 'وسّع انتشار فيديوهات الفيجوالايزر بدقة 4K ولقطات الدروب في المهرجانات حول العالم عبر ADE وبريطانيا وساحات الموسيقى الراقصة الأوروبية.',
    guideSlug: 'edm-electronic-music-video-youtube-promotion-guide',
    ctaTr: 'EDM Kampanyası Başlat',
    ctaEn: 'Launch EDM Campaign',
    ctaAr: 'أطلق حملة EDM',
  },
  rock: {
    titleTr: '🎸 Rock & Metal Video PR Stratejisi',
    titleEn: '🎸 Rock & Heavy Metal YouTube PR Playbook',
    titleAr: '🎸 دليل الترويج للروك والهيفي ميتال على يوتيوب',
    descTr: 'Gitar ekipman kanalları ve festival kitlelerini hedefleyerek genel algoritma bariyerlerini aşın, konser ve merch kitlesi kazanın.',
    descEn: 'Bypass mainstream pop algorithm gatekeeping with precision placement across guitar gear reviewers and festival circuits.',
    descAr: 'تجاوز حواجز خوارزمية البوب الجماهيري عبر استهداف دقيق لقنوات مراجعات معدات الغيتار وجمهور المهرجانات.',
    guideSlug: 'rock-metal-music-video-promotion-youtube-strategy-guide',
    ctaTr: 'Rock Kampanyası Başlat',
    ctaEn: 'Launch Rock Campaign',
    ctaAr: 'أطلق حملة الروك',
  },
};

export default function TrendingCountryTabs({ trends, locale, initialCountry }: TrendingCountryTabsProps) {
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';
  // Arapça sitede yalnızca Arap pazarları, TR/EN sitede mevcut dört pazar gösterilir.
  const countries = COUNTRIES.filter((c) => (AR_TREND_REGIONS as string[]).includes(c.id) === isAr);
  const defaultCountry = initialCountry || (isAr ? 'sa' : isTr ? 'tr' : 'us');
  const [selectedCountry, setSelectedCountry] = useState<TrendRegion>(defaultCountry);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'views'>('rank');
  const [countFilter, setCountFilter] = useState<'all' | 'top10' | 'top5'>('all');

  // Seçili ülkede gerçekten bulunan türler; boş tür filtresi gösterilmez.
  const availableGenres = useMemo(
    () => new Set((trends[selectedCountry] || []).map((s) => s.genre).filter(Boolean)),
    [trends, selectedCountry],
  );

  // Filter by genre & sort
  const filteredAndSortedSongs = useMemo(() => {
    let result = [...(trends[selectedCountry] || trends.tr || [])];

    if (selectedGenre !== 'all') {
      result = result.filter((s) => s.genre === selectedGenre);
    }

    if (sortBy === 'views') {
      result.sort((a, b) => b.views - a.views);
    } else {
      result.sort((a, b) => a.rank - b.rank);
    }

    if (countFilter === 'top5') return result.slice(0, 5);
    if (countFilter === 'top10') return result.slice(0, 10);
    return result.slice(0, 20);
  }, [trends, selectedCountry, selectedGenre, sortBy, countFilter]);

  const nf = new Intl.NumberFormat(isAr ? 'ar-u-nu-latn-ca-gregory' : isTr ? 'tr-TR' : 'en-US');
  const activeCountryObj = countries.find((c) => c.id === selectedCountry) || countries[0];
  const activeGenrePlaybook = GENRE_PLAYBOOKS[selectedGenre];

  return (
    <div className="space-y-7">
      {/* ── Level 1: Country Market Selection Tabs ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-studio pb-5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {countries.map((c) => {
            const isActive = selectedCountry === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCountry(c.id as TrendRegion);
                  setSelectedGenre('all');
                }}
                className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E0002E] to-[#CC0029] text-white shadow-lg shadow-[#FF0033]/30 scale-105'
                    : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60'
                }`}
              >
                <span className="text-lg">{c.flag}</span>
                <span className="tracking-tight">{isAr ? c.labelAr : isTr ? c.labelTr : c.labelEn}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isActive ? 'bg-white/20 text-white' : 'bg-zinc-700/80 text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  Top 20
                </span>
              </button>
            );
          })}
        </div>

        {/* Count Filter (Top 5 / Top 10 / All) */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-700/60 p-1.5 rounded-2xl text-xs font-semibold text-zinc-300">
          <button
            onClick={() => setCountFilter('top5')}
            className={`px-3 py-1.5 rounded-xl transition ${countFilter === 'top5' ? 'bg-[#D9002B] text-white' : 'hover:text-white'}`}
          >
            Top 5
          </button>
          <button
            onClick={() => setCountFilter('top10')}
            className={`px-3 py-1.5 rounded-xl transition ${countFilter === 'top10' ? 'bg-[#D9002B] text-white' : 'hover:text-white'}`}
          >
            Top 10
          </button>
          <button
            onClick={() => setCountFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition ${countFilter === 'all' ? 'bg-[#D9002B] text-white' : 'hover:text-white'}`}
          >
            {isAr ? 'الكل' : isTr ? 'Tümü' : 'All'}
          </button>
        </div>
      </div>

      {/* ── Level 2: Multi-Dimension Genre & Sort Filter Bar ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-md">
        {/* Genre Pill Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-1 hidden sm:inline-flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {isAr ? 'النوع:' : isTr ? 'Tür:' : 'Genre:'}
          </span>
          {GENRE_FILTERS.filter((gf) => gf.id === 'all' || availableGenres.has(gf.id)).map((gf) => {
            const active = selectedGenre === gf.id;
            return (
              <button
                key={gf.id}
                type="button"
                onClick={() => setSelectedGenre(gf.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-white text-zinc-950 shadow-md font-extrabold scale-105'
                    : 'bg-zinc-800/90 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60'
                }`}
              >
                <span>{gf.icon}</span>
                <span>{isAr ? gf.labelAr : isTr ? gf.labelTr : gf.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown / Pills */}
        <div className="flex items-center gap-1.5 self-end lg:self-center">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mr-1 hidden sm:inline">
            {isAr ? 'الترتيب:' : isTr ? 'Sıralama:' : 'Sort:'}
          </span>
          <button
            type="button"
            onClick={() => setSortBy('rank')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              sortBy === 'rank' ? 'bg-[#D9002B] text-white font-bold' : 'text-zinc-400 hover:text-white bg-zinc-800/60'
            }`}
          >
            {isAr ? 'المركز' : isTr ? 'Sıra' : 'Rank'}
          </button>
          <button
            type="button"
            onClick={() => setSortBy('views')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              sortBy === 'views' ? 'bg-[#D9002B] text-white font-bold' : 'text-zinc-400 hover:text-white bg-zinc-800/60'
            }`}
          >
            {isAr ? 'إجمالي المشاهدات' : isTr ? 'Toplam İzlenme' : 'Total Views'}
          </button>
        </div>
      </div>

      {/* ── Contextual Genre PR Playbook Callout (When a Genre Is Selected) ── */}
      {activeGenrePlaybook && (
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-zinc-900/90 to-zinc-950 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center justify-center md:justify-start gap-2">
              <span>{isAr ? activeGenrePlaybook.titleAr : isTr ? activeGenrePlaybook.titleTr : activeGenrePlaybook.titleEn}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase">
                {isAr ? 'دليل الاستراتيجية' : isTr ? 'Strateji Rehberi' : 'Strategy Guide'}
              </span>
            </h3>
            <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
              {isAr ? activeGenrePlaybook.descAr : isTr ? activeGenrePlaybook.descTr : activeGenrePlaybook.descEn}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href={`/${locale}/blog/${activeGenrePlaybook.guideSlug}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition border border-zinc-700/60"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
              <span>{isAr ? 'اقرأ الدليل' : isTr ? 'Rehberi Oku' : 'Read Guide'}</span>
            </Link>

            <Link
              href={`/${locale}/order?views=50000&pkg=views&region=premium`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] text-xs font-black text-white hover:brightness-110 shadow-md shadow-[#FF0033]/30 transition"
            >
              <span>{isAr ? activeGenrePlaybook.ctaAr : isTr ? activeGenrePlaybook.ctaTr : activeGenrePlaybook.ctaEn}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Active Chart Summary Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF0033]/20 border border-[#FF0033]/40 text-2xl shrink-0">
            {activeCountryObj.flag}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{isAr ? activeCountryObj.labelAr : isTr ? activeCountryObj.labelTr : activeCountryObj.labelEn}</span>
              <span className="text-xs font-normal text-zinc-400">
                ({isAr ? activeCountryObj.subAr : isTr ? activeCountryObj.subTr : activeCountryObj.subEn})
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-semibold border border-zinc-700">
                {filteredAndSortedSongs.length} {isAr ? 'أغنية' : isTr ? 'klip' : 'tracks'}
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              {isAr
                ? "من قائمة يوتيوب الرسمية «الأكثر رواجًا في الموسيقى»، مع عدد المشاهدات والإعجابات."
                : isTr
                ? "YouTube'un resmî “En Popüler Müzik” listesinden; izlenme ve beğeni sayılarıyla."
                : "From YouTube's official “Most Popular Music” chart, with view and like counts."}
            </p>
          </div>
        </div>

        <Link
          href={`/${locale}/order`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>{isAr ? 'روّج لكليبك ←' : isTr ? 'Kendi klibinizi tanıtın →' : 'Promote your own video →'}</span>
        </Link>
      </div>

      {/* ── Song Grid / Cards List ── */}
      {filteredAndSortedSongs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndSortedSongs.map((song) => {
            const isTop3 = song.rank <= 3;
            const genreInfo = song.genre ? GENRE_LABELS[song.genre] : null;

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
                  <Image fill sizes="(min-width: 640px) 176px, 100vw"
                    src={song.thumbnail}
                    alt={`${song.artist} - ${song.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <a
                    href={`https://www.youtube.com/watch?v=${song.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Play on YouTube"
                  >
                    <div className="h-10 w-10 rounded-full bg-[#D9002B] flex items-center justify-center text-white shadow-lg shadow-[#FF0033]/50">
                      <Play className="h-5 w-5 fill-white ml-0.5" />
                    </div>
                  </a>

                  {/* Genre pill on thumbnail */}
                  {genreInfo && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                      {genreInfo.icon} {isAr ? genreInfo.ar : isTr ? genreInfo.tr : genreInfo.en}
                    </span>
                  )}
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
                      <span>
                        {nf.format(song.views)} {isAr ? 'مشاهدات' : isTr ? 'izlenme' : 'views'}
                      </span>
                    </div>
                    {song.gain24h > 0 && (
                      <div className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        <TrendingUp className="h-3 w-3" />
                        <span>
                          +{nf.format(song.gain24h)} {isTr ? '/ 24s' : '/ 24h'}
                        </span>
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

                    {song.blogSlug ? (
                      <Link
                        href={`/${locale}/blog/${song.blogSlug}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF6B6B] hover:text-[#FF8E53] underline decoration-[#FF0033]/40 underline-offset-2 transition ml-auto"
                      >
                        <span>{isAr ? 'تفصيل الاستراتيجية' : isTr ? 'Klip PR Analizi' : 'Strategy Breakdown'}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : song.genre && GENRE_PLAYBOOKS[song.genre] ? (
                      <Link
                        href={`/${locale}/blog/${GENRE_PLAYBOOKS[song.genre].guideSlug}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline decoration-amber-400/40 underline-offset-2 transition ml-auto"
                      >
                        <span>{isAr ? 'دليل النوع الموسيقي' : isTr ? 'Tür PR Rehberi' : 'Genre Playbook'}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 text-center">
          <p className="text-zinc-400 text-sm">
            {isAr
              ? 'لا توجد أغانٍ تطابق النوع والفلاتر المختارة. جرّب إعادة ضبط الفلاتر.'
              : isTr
              ? 'Seçilen tür ve filtrelere uygun klip bulunamadı. Filtreleri temizleyebilirsiniz.'
              : 'No tracks match the selected genre and filter combination. Try resetting filters.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedGenre('all');
              setSortBy('rank');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition"
          >
            {isAr ? 'عرض كل الأغاني' : isTr ? 'Tüm Şarkıları Göster' : 'Show All Songs'}
          </button>
        </div>
      )}
    </div>
  );
}
