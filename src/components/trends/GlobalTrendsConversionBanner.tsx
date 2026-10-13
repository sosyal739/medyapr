'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Rocket,
  ShieldCheck,
  Check,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Flame,
  Globe2,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { formatMoney, quote, type Region } from '@/lib/pricing';

interface GlobalTrendsConversionBannerProps {
  locale: string;
}

const REGION_OPTIONS = [
  { id: 'us', labelTr: '🇺🇸 ABD (US Charts)', labelEn: '🇺🇸 US Billboard', regionParam: 'premium', currencyTr: 'USD', currencyEn: 'USD' },
  { id: 'gb', labelTr: '🇬🇧 İngiltere (UK)', labelEn: '🇬🇧 UK Charts', regionParam: 'premium', currencyTr: 'USD', currencyEn: 'USD' },
  { id: 'de', labelTr: '🇩🇪 Almanya (DE)', labelEn: '🇩🇪 Germany (DE)', regionParam: 'premium', currencyTr: 'USD', currencyEn: 'USD' },
  { id: 'tr', labelTr: '🇹🇷 Türkiye (TR)', labelEn: '🇹🇷 Turkey (TR)', regionParam: 'tr', currencyTr: 'TRY', currencyEn: 'TRY' },
  { id: 'global', labelTr: '🌍 Küresel Mix', labelEn: '🌍 Global Mix', regionParam: 'global', currencyTr: 'TRY', currencyEn: 'USD' },
] as const;

const GENRE_OPTIONS = [
  { id: 'hiphop', icon: '🔥', labelTr: 'Hip-Hop / Rap', labelEn: 'Hip-Hop / Rap' },
  { id: 'indie', icon: '🌿', labelTr: 'Indie / Alternatif', labelEn: 'Indie / Alt' },
  { id: 'edm', icon: '⚡', labelTr: 'EDM / Dans', labelEn: 'EDM / Electronic' },
  { id: 'rock', icon: '🎸', labelTr: 'Rock / Metal', labelEn: 'Rock / Metal' },
  { id: 'pop', icon: '✨', labelTr: 'Pop / Mainstream', labelEn: 'Pop / Mainstream' },
] as const;

const TIERS = [
  {
    id: 'starter',
    views: 25000,
    labelTr: 'Başlangıç İvmesi',
    labelEn: 'Starter Momentum',
    days: '2-4',
    pkgParam: 'views',
  },
  {
    id: 'contender',
    views: 50000,
    labelTr: 'Liste Adayı',
    labelEn: 'Chart Contender',
    days: '3-5',
    pkgParam: 'views',
  },
  {
    id: 'trending',
    views: 100000,
    labelTr: 'Trend Çıkışı (En Popüler)',
    labelEn: 'Trending Breakthrough (Top)',
    days: '5-7',
    pkgParam: 'views',
    highlight: true,
  },
  {
    id: 'viral',
    views: 250000,
    labelTr: 'Viral Global Hit',
    labelEn: 'Global Viral Hit',
    days: '7-12',
    pkgParam: 'views',
  },
] as const;

export default function GlobalTrendsConversionBanner({ locale }: GlobalTrendsConversionBannerProps) {
  const isTr = locale === 'tr';

  const [selectedRegion, setSelectedRegion] = useState<string>('us');
  const [selectedGenre, setSelectedGenre] = useState<string>('hiphop');
  const [selectedTierId, setSelectedTierId] = useState<string>('trending');

  const activeRegion = REGION_OPTIONS.find((r) => r.id === selectedRegion) || REGION_OPTIONS[0];
  const activeGenre = GENRE_OPTIONS.find((g) => g.id === selectedGenre) || GENRE_OPTIONS[0];
  const activeTier = TIERS.find((t) => t.id === selectedTierId) || TIERS[2];

  const currency = isTr ? (activeRegion.id === 'tr' || activeRegion.id === 'global' ? 'TRY' : 'USD') : 'USD';
  // Fiyatlar her zaman sipariş sayfasıyla aynı motordan hesaplanır.
  const priceFor = (views: number) =>
    formatMoney(quote({ views, region: activeRegion.regionParam as Region, currency }).total, currency, locale);
  const priceDisplay = priceFor(activeTier.views);

  // Pre-fill direct order link
  const orderHref = `/${locale}/order?views=${activeTier.views}&region=${activeRegion.regionParam}&pkg=${activeTier.pkgParam}&currency=${currency}`;

  // Pre-fill WhatsApp message
  const waMessage = isTr
    ? `Merhaba, ${activeGenre.labelTr} klibim için ${activeRegion.labelTr} pazarında ${activeTier.views.toLocaleString('tr-TR')} izlenmelik YouTube trend lansmanı başlatmak istiyorum.`
    : `Hello, I would like to launch a ${activeGenre.labelEn} music video campaign targeting ${activeRegion.labelEn} with ${activeTier.views.toLocaleString('en-US')} views.`;

  const waHref = `https://wa.me/905312993355?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="mb-14 relative overflow-hidden rounded-3xl border border-[#FF0033]/40 bg-gradient-to-b from-zinc-900/95 via-zinc-950/95 to-zinc-950 p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-2xl">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#FF0033]/20 blur-[100px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-600/15 blur-[110px]" />

      <div className="relative z-10 space-y-6">
        {/* Top Header Badge & Title */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF0033]/50 bg-[#FF0033]/15 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#FF6B6B] mb-2.5">
              <Rocket className="h-3.5 w-3.5 text-[#FF0033]" />
              <span>{isTr ? 'KÜRESEL KLİP LANSMANI · 1-TIKLA BAŞLAT' : 'GLOBAL MUSIC VIDEO LAUNCH · 1-CLICK LAUNCH'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {isTr ? (
                <>
                  Kendi Klibinizi de{' '}
                  <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                    YouTube Trendlerine
                  </span>{' '}
                  Taşıyın
                </>
              ) : (
                <>
                  Launch Your Video Into{' '}
                  <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                    Global YouTube Charts
                  </span>
                </>
              )}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-300 max-w-2xl">
              {isTr
                ? 'Hedef pazarınızı ve müzik türünüzü seçin; resmi Google Ads In-Stream ve Shorts reklamlarıyla organik dinleyici kitlenizi anında büyütün.'
                : 'Configure your target market and genre; break into Suggested Videos and algorithmic radio feeds via official Google Ads.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {isTr ? 'Canlı Kota Açık' : 'Live Capacity Open'}
            </span>
          </div>
        </div>

        {/* ── 3-Step Interactive Configurator ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Step 1: Target Market */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-[#FF6B6B]" />
              <span>{isTr ? '1. Hedef Ülke / Pazar' : '1. Target Market'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              {REGION_OPTIONS.map((reg) => {
                const active = selectedRegion === reg.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left border ${
                      active
                        ? 'bg-[#FF0033] text-white border-red-500 shadow-md shadow-red-500/30'
                        : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border-zinc-700/60'
                    }`}
                  >
                    <span>{isTr ? reg.labelTr : reg.labelEn}</span>
                    {active && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Music Genre */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{isTr ? '2. Müzik Türü' : '2. Music Genre'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              {GENRE_OPTIONS.map((g) => {
                const active = selectedGenre === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGenre(g.id)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left border ${
                      active
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-md shadow-amber-500/25'
                        : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border-zinc-700/60'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{g.icon}</span>
                      <span>{isTr ? g.labelTr : g.labelEn}</span>
                    </span>
                    {active && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Target Momentum / Tier */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isTr ? '3. Lansman Hedefi' : '3. Launch Goal'}</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {TIERS.map((tier) => {
                const active = selectedTierId === tier.id;
                const price = priceFor(tier.views);
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left border ${
                      active
                        ? 'bg-gradient-to-r from-[#FF0033] to-[#CC0029] text-white border-red-400 shadow-lg shadow-red-500/30 ring-1 ring-white/20'
                        : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border-zinc-700/60'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-white text-xs sm:text-sm">
                        {tier.views.toLocaleString(isTr ? 'tr-TR' : 'en-US')} {isTr ? 'İzlenme' : 'Views'}
                      </div>
                      <div className="text-[11px] opacity-80 font-normal">
                        {isTr ? tier.labelTr : tier.labelEn}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-black text-amber-300">{price}</div>
                      <div className="text-[10px] opacity-75">{tier.days} {isTr ? 'gün' : 'days'}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Summary & Direct Checkout Actions ── */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-5 bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-800/60">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
              <span className="text-zinc-400">{isTr ? 'Seçilen Paket:' : 'Selected Package:'}</span>
              <strong className="text-white font-extrabold">
                {activeTier.views.toLocaleString(isTr ? 'tr-TR' : 'en-US')} {isTr ? 'İzlenme' : 'Views'} • {isTr ? activeGenre.labelTr : activeGenre.labelEn} ({isTr ? activeRegion.labelTr : activeRegion.labelEn})
              </strong>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-zinc-500" />
                <span>{activeTier.days} {isTr ? 'gün teslimat' : 'days delivery'}</span>
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{isTr ? '%50 Onayda, %50 Teslimatta Ödeme' : '50% on Approval, 50% on Completion'}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href={orderHref}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-6 py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-[#FF0033]/30 hover:brightness-110 active:scale-95 transition-all text-center"
            >
              <span>{isTr ? 'Hemen Kampanyayı Başlat' : 'Launch Campaign in 1-Click'} ({priceDisplay})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-5 py-3.5 text-xs sm:text-sm font-bold text-emerald-300 hover:text-white transition-all text-center"
            >
              <MessageCircle className="h-4 w-4 fill-emerald-400" />
              <span>{isTr ? 'WhatsApp ile Danış' : 'Chat with PR Lead'}</span>
            </a>
          </div>
        </div>

        {/* Trust verification pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>{isTr ? '%100 YouTube Studio Tescili' : '100% YouTube Studio Verified'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>{isTr ? 'Sıfır Bot / %100 Resmi Google Ads' : 'Zero Bots / Official Google Ads'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>{isTr ? 'Şifre Gerekmez (Yalnızca Link)' : 'No Channel Password Needed'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>{isTr ? '18+ Yıllık Kesintisiz Tecrübe' : '18+ Years Track Record'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
