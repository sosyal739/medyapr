'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { countryName, DEFAULT_COUNTRY } from '@/lib/countries';
import CountryPicker from './CountryPicker';
import Flag from '@/components/common/Flag';
import Link from 'next/link';
import { ArrowRight, Check, Mail, MessageCircle, Search, Send, ShieldCheck, Sparkles, Tag, ThumbsUp } from 'lucide-react';
import {
  CURRENCIES,
  MAX_VIEWS,
  MIN_VIEWS,
  PACKAGES,
  REGIONS,
  formatMoney,
  parseYouTubeId,
  quote,
  type Currency,
  type Format,
  type Package,
  type Region,
} from '@/lib/pricing';
import { consultHref, telegramHref } from '@/lib/contact';
import type { AppStrings } from '@/lib/i18n/app-strings';

const PRESETS = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000];

/** Slider log-ölçekli: 1K ile 1M arası düzgün hareket etsin. */
const toSlider = (v: number) => (Math.log(v / MIN_VIEWS) / Math.log(MAX_VIEWS / MIN_VIEWS)) * 1000;
const fromSlider = (s: number) => {
  const raw = MIN_VIEWS * Math.pow(MAX_VIEWS / MIN_VIEWS, s / 1000);
  const step = raw < 10_000 ? 500 : raw < 100_000 ? 1_000 : raw < 500_000 ? 5_000 : 10_000;
  return Math.min(MAX_VIEWS, Math.max(MIN_VIEWS, Math.round(raw / step) * step));
};

function useAnimatedNumber(target: number, ms = 350) {
  const [val, setVal] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = a + (target - a) * eased;
      setVal(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return val;
}

export default function Calculator({ locale, t }: { locale: string; t: AppStrings['calc'] }) {
  const isTr = locale === 'tr';
  const [views, setViews] = useState(1_000); // açılışta en düşük fiyat görünsün (1K = ₺100)
  const [format] = useState<Format>('instream');
  const [pkg, setPkg] = useState<Package>('views');
  const [region, setRegion] = useState<Region>('global');
  const [country, setCountry] = useState(DEFAULT_COUNTRY(locale));
  const [currency, setCurrency] = useState<Currency>(isTr ? 'TRY' : 'USD');
  const [videoUrl, setVideoUrl] = useState('');
  const usedTracked = useRef(false);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!usedTracked.current) {
      usedTracked.current = true;
      trackEvent('calculator_used', { views, pkg, region });
    }
  }, [views, pkg, region]);

  const q = useMemo(() => quote({ views, format, pkg, region, currency, country }), [views, format, pkg, region, currency, country]);
  const regionLabel = region === 'premium' ? `${countryName(country, locale)}` : t.regions[region].name;
  const animTotal = useAnimatedNumber(q.total);
  const nf = new Intl.NumberFormat(isTr ? 'tr-TR' : 'en-US');

  const videoParam = videoUrl.trim() ? `&video=${encodeURIComponent(videoUrl.trim())}` : '';
  const href = `/${locale}/order?views=${q.views}&format=${format}&pkg=${pkg}&region=${region}&currency=${currency}${region === 'premium' ? `&country=${country}` : ''}${videoParam}`;
  const mailOrderHref = `${href}&channel=email`;
  const hasValidVideo = !!parseYouTubeId(videoUrl);

  // wa.me yönlendirmesi emojileri bozduğu için ▸ işareti ve *kalın* etiket kullanılır
  const pkgMessage = [
    isTr
      ? 'Merhaba, YouTube videom için PR / reklam çalışması planlıyorum. Videomu analiz edip bana teklif verir misiniz?'
      : 'Hello, I am planning a PR / ad campaign for my YouTube video. Could you review it and send me a quote?',
    videoUrl.trim() ? `▸ *${isTr ? 'Video linki' : 'Video link'}:* ${videoUrl.trim()}` : '',
    [
      `▸ *${isTr ? 'Düşündüğüm paket' : 'Package I have in mind'}:* ${nf.format(q.views)} ${isTr ? 'İzlenme' : 'Views'} - ${t.packages[pkg].name} - ${regionLabel}`,
      `▸ *${isTr ? 'Tahmini teklif' : 'Estimated quote'}:* ${formatMoney(q.total, currency, locale)} (${isTr ? 'video uzunluğuna göre değişebilir' : 'may vary by video length'})`,
    ].join('\n'),
  ]
    .filter(Boolean)
    .join('\n\n');


  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#181B22]/95 via-[#15171D]/95 to-[#111317]/95 p-6 sm:p-8 lg:p-10 text-white shadow-2xl backdrop-blur-2xl">
      {/* Hafif Ortam Işıltıları */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#FF0033]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-72 w-72 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative grid gap-8 lg:grid-cols-[1.42fr_1fr] lg:gap-10 items-start">
        {/* ── Sol Kolon: Yapılandırıcı & Güvenceler ── */}
        <div className="space-y-7">
          {/* Adım 1: İzlenme Sayısı */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                  {isTr ? '1. Adım' : 'Step 1'}
                </span>
                <h3 className="text-base font-extrabold text-white">{t.views}</h3>
              </div>
              <div className="flex items-baseline gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 transition-all focus-within:border-[#FF0033] focus-within:ring-2 focus-within:ring-[#FF0033]/20">
                <input
                  id="views"
                  inputMode="numeric"
                  value={nf.format(views)}
                  onChange={(e) => {
                    const n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                    setViews(Number.isFinite(n) ? Math.min(MAX_VIEWS, n) : MIN_VIEWS);
                  }}
                  onBlur={() => setViews((v) => Math.max(MIN_VIEWS, v))}
                  aria-label={t.views}
                  className="w-28 sm:w-36 text-right font-[family-name:var(--font-heading)] text-2xl font-black tabular-nums bg-transparent text-white outline-none"
                />
                <span className="text-xs font-semibold text-zinc-400">{isTr ? 'izlenme' : 'views'}</span>
              </div>
            </div>

            {/* Slider */}
            <div className="py-2">
              <input
                type="range"
                min={0}
                max={1000}
                value={toSlider(views)}
                onChange={(e) => setViews(fromSlider(Number(e.target.value)))}
                aria-label={t.views}
                className="calc-range w-full cursor-pointer"
                style={{ ['--pct' as string]: `${toSlider(views) / 10}%` }}
              />
              <div className="mt-2 flex justify-between text-[11px] font-medium text-zinc-500">
                <span>1.000 (Min)</span>
                <span>50.000</span>
                <span>1.000.000 (1M)</span>
              </div>
            </div>

            {/* Hızlı Seçim Butonları (1K - 1M) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESETS.map((p) => {
                const active = views === p;
                const label = p === 1_000_000 ? '1M' : p >= 1000 ? `${p / 1000}K` : `${p}`;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setViews(p)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-[#D9002B] text-white shadow-md shadow-red-500/30 scale-105'
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Adım 2: Hedef Kitle & Bölge */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                  {isTr ? '2. Adım' : 'Step 2'}
                </span>
                <h3 className="text-base font-extrabold text-white">{t.region}</h3>
              </div>
              {region === 'global' && (
                <span className="text-[11px] font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  {isTr ? '1K: ₺100 Başlayan Kademeli Tarife 🔥' : 'From $2.70/1K Progressive Discount 🔥'}
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {REGIONS.map((r) => {
                const on = region === r;
                const tag = t.regions[r]?.tag;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    aria-pressed={on}
                    className={`relative rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                      on
                        ? 'border-[#FF0033] bg-[#FF0033]/15 ring-1 ring-[#FF0033]/40 shadow-lg shadow-red-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex h-6 items-center text-lg">
                        {r === 'tr' ? <Flag code="TR" /> : r === 'global' ? '🌍' : on ? <Flag code={country} /> : '🗺️'}
                      </span>
                      {tag && (
                        <span
                          className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${
                            r === 'global'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : r === 'premium'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-white/10 text-zinc-300 border-white/10'
                          }`}
                        >
                          {tag}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-extrabold text-white">{t.regions[r].name}</div>
                    <div className="mt-0.5 text-xs text-zinc-400">{t.regions[r].desc}</div>
                  </button>
                );
              })}
            </div>
            {region === 'premium' && (
              <CountryPicker locale={locale} country={country} onCountry={setCountry} />
            )}
          </div>

          {/* Adım 3: Paket Türü */}
          <div>
            <div className="mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                {isTr ? '3. Adım' : 'Step 3'}
              </span>
              <h3 className="text-base font-extrabold text-white">{t.pkg}</h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {PACKAGES.map((p) => {
                const on = pkg === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPkg(p)}
                    aria-pressed={on}
                    className={`relative rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                      on
                        ? 'border-[#FF0033] bg-[#FF0033]/15 ring-1 ring-[#FF0033]/40 shadow-lg shadow-red-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">{p === 'views' ? '▶️' : '💬'}</span>
                      <span
                        className={`text-[11px] font-black px-2 py-0.5 rounded-full border ${
                          p === 'engagement'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-white/10 text-zinc-300 border-white/10'
                        }`}
                      >
                        {t.packages[p].tag}
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-white">{t.packages[p].name}</div>
                    <div className="mt-0.5 text-xs text-zinc-400">{t.packages[p].desc}</div>
                  </button>
                );
              })}
            </div>
            {pkg === 'engagement' && <p className="mt-2 text-[11px] text-zinc-400">{t.engagementNote}</p>}
          </div>

          {/* Güvenceler (İkna Edici Net Standartlar) */}
          <div className="pt-1">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {t.guaranteesTitle || (isTr ? '%100 Resmi Google Ads Güvencesi' : '100% Official Google Ads Standards')}
              </span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Check className="h-3 w-3 stroke-[3]" /> {isTr ? 'Tüm Paketlerde Standart' : 'Standard Across All Plans'}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(t.guarantees || []).map((g, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 transition-all hover:border-emerald-500/40 hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                      {idx === 0 ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : idx === 1 ? (
                        <Sparkles className="h-4 w-4" />
                      ) : (
                        <ThumbsUp className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-xs font-extrabold text-white">{g.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-400">{g.desc}</p>
                </div>
              ))}
            </div>

            {/* Süreç Şeridi */}
            <div className="mt-3.5 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-zinc-900/80 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-zinc-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-black text-[11px]">
                  ✓
                </span>
                <span>
                  <strong className="text-white">
                    {isTr ? 'Analiz & Onay Süreci:' : 'Analysis & Approval Workflow:'}
                  </strong>{' '}
                  {isTr ? (
                    <>
                      Teklifinizi iletin, videonuzu analiz edip WhatsApp / Telegram üzerinden detaylı dönüş yapalım. Onay alınca işlem başlar.
                    </>
                  ) : (
                    <>
                      Submit your quote; we analyze your video and reply in detail via WhatsApp / Telegram. Work starts upon approval.
                    </>
                  )}
                </span>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                {isTr ? '* Fiyatlandırma video uzunluğuna göre değişebilir' : '* Pricing may vary based on video length'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Sağ Kolon: Dinamik Sipariş Özeti (Sticky) ── */}
        <aside className="lg:sticky lg:top-24 rounded-3xl border border-white/15 bg-gradient-to-b from-[#1C2029] to-[#14161C] p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
          {/* Üst Bar: Canlı Teklif & Para Birimi */}
          <div className="flex items-center justify-between mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {isTr ? 'Canlı Teklif Hesaplama' : 'Live Quote Estimator'}
            </span>

            <div className="flex rounded-xl border border-white/10 bg-white/5 p-0.5" role="group" aria-label={t.currency}>
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  aria-pressed={currency === c}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    currency === c ? 'bg-[#D9002B] text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Fiyat Alanı */}
          <div className="mb-5">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t.total}</div>
            <div className="mt-1 font-[family-name:var(--font-heading)] text-5xl font-black tabular-nums tracking-tight text-white">
              {formatMoney(animTotal, currency, locale)}
            </div>
            <p className="mt-1.5 text-[11px] font-semibold text-amber-300/90">
              {isTr
                ? '* Standart klip süresi baz alınmıştır; fiyatlandırma video uzunluğuna göre değişebilir.'
                : '* Based on standard duration; pricing may vary depending on video length.'}
            </p>
            {q.discountRate > 0 && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <Tag className="h-3 w-3" />
                {isTr ? `%${Math.round(q.discountRate * 100)} İndirim Uygulandı` : `${Math.round(q.discountRate * 100)}% Discount Applied`}
              </div>
            )}
          </div>

          {/* Döküm Detayları */}
          <div className="space-y-3 border-y border-white/10 py-4 text-sm">
            <div className="flex items-center justify-between text-zinc-300">
              <span className="text-zinc-400">{isTr ? 'Hedef İzlenme' : 'Target Views'}</span>
              <span className="font-bold text-white">{nf.format(q.views)} {isTr ? 'İzlenme' : 'Views'}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span className="text-zinc-400">{isTr ? 'Hedef Kitle' : 'Audience Target'}</span>
              <span className="font-bold text-white">{t.regions[region].name}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span className="text-zinc-400">{t.pkg}</span>
              <span className="font-bold text-white">{t.packages[pkg].name}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-300">
              <span className="text-zinc-400">{t.per1k}</span>
              <span className="font-bold text-white">{formatMoney(q.perThousand, currency, locale)}</span>
            </div>
          </div>

          {/* YouTube Video Linki Girişi + 3 Analiz Kanalı */}
          <div className="mt-5 space-y-3">
            <div>
              <label htmlFor="calc-video-url" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                {isTr ? 'YouTube Video Linkiniz (Pakete Ekle)' : 'Your YouTube Video Link (Attach to Package)'}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="calc-video-url"
                  type="url"
                  inputMode="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-white/15 bg-black/30 py-2.5 pl-10 pr-3 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-[#FF0033] focus:ring-2 focus:ring-[#FF0033]/20"
                />
              </div>
              {hasValidVideo && (
                <p className="mt-1 text-[11px] font-semibold text-emerald-400">
                  ✓ {isTr ? 'Video linki pakete eklendi' : 'Video link attached to package'}
                </p>
              )}
            </div>

            <Link
              href={href}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-6 py-4 text-base font-extrabold text-white shadow-xl shadow-red-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t.cta}</span>
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>

            <div className="grid grid-cols-3 gap-2">
              <a
                href={consultHref(pkgMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-3 text-[11px] sm:text-xs font-bold text-emerald-300 transition-all hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-white"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{isTr ? 'WhatsApp Analiz' : 'WhatsApp'}</span>
              </a>
              <a
                href={telegramHref(pkgMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  navigator.clipboard?.writeText(pkgMessage).catch(() => {});
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-sky-400/40 bg-sky-500/10 px-2.5 py-3 text-[11px] sm:text-xs font-bold text-sky-300 transition-all hover:border-sky-400 hover:bg-sky-500/20 hover:text-white"
              >
                <Send className="h-3.5 w-3.5 shrink-0" />
                <span>{isTr ? 'Telegram Analiz' : 'Telegram'}</span>
              </a>
              <Link
                href={mailOrderHref}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-2.5 py-3 text-[11px] sm:text-xs font-bold text-amber-300 transition-all hover:border-amber-400 hover:bg-amber-500/20 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span>{isTr ? 'Mail ile Analiz' : 'Via Email'}</span>
              </Link>
            </div>
          </div>

          {/* Güvence Maddeleri */}
          <div className="mt-4 space-y-2 border-t border-white/10 pt-3.5">
            {t.perks.map((p) => (
              <div key={p} className="flex items-center gap-2 text-xs text-zinc-300">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{p}</span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-zinc-400">{t.note}</p>
        </aside>
      </div>
    </div>
  );
}


