'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  Loader2,
  MessageCircle,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  ThumbsUp,
  XCircle,
} from 'lucide-react';
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
import { TELEGRAM_URL, WHATSAPP_NUMBER } from '@/lib/contact';
import type { AppStrings } from '@/lib/i18n/app-strings';

type Video = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  views?: number;
  likes?: number;
  comments?: number;
  durationSec?: number;
  source: 'api' | 'oembed';
};

type Lookup = { state: 'idle' | 'loading' | 'found' | 'notfound' | 'invalid' | 'unavailable'; video?: Video };

export type WizardInitial = {
  views: number;
  format: Format;
  pkg: Package;
  region: Region;
  currency: Currency;
  videoUrl?: string;
};

const PRESETS = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000];
const inputClass =
  'w-full rounded-xl border border-zinc-700/60 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#FF0033] focus:ring-4 focus:ring-[#FF0033]/20';

const short = (n: number) => (n >= 1_000_000 ? `${n / 1_000_000}M` : `${n / 1000}K`);
const duration = (s?: number) => (s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : '');

export default function OrderWizard({ locale, t, initial }: { locale: string; t: AppStrings; initial: WizardInitial }) {
  const isTr = locale === 'tr';
  const c = t.calc;
  const nf = useMemo(() => new Intl.NumberFormat(isTr ? 'tr-TR' : 'en-US'), [isTr]);

  const [url, setUrl] = useState(initial.videoUrl ?? '');
  const [lookup, setLookup] = useState<Lookup>(() =>
    initial.videoUrl && parseYouTubeId(initial.videoUrl) ? { state: 'loading' } : { state: 'idle' },
  );
  const [views, setViews] = useState(initial.views);
  const [region, setRegion] = useState<Region>(initial.region);
  const [pkg, setPkg] = useState<Package>(initial.pkg);
  const [currency, setCurrency] = useState<Currency>(initial.currency);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ id: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abort = useRef<AbortController | null>(null);
  const lastId = useRef<string | null>(null);

  const q = useMemo(() => quote({ views, format: initial.format, pkg, region, currency }), [views, initial.format, pkg, region, currency]);

  async function runLookup(raw: string) {
    const id = parseYouTubeId(raw);
    if (!id || id === lastId.current) return;
    lastId.current = id;
    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;
    const result = await fetchVideo(raw, id, ctrl.signal);
    if (result) setLookup(result);
  }

  // Sayfa bir linkle açıldıysa (ana sayfadan) videoyu hemen bul.
  useEffect(() => {
    const raw = initial.videoUrl;
    const id = raw ? parseYouTubeId(raw) : null;
    if (!raw || !id) return;
    lastId.current = id;
    const ctrl = new AbortController();
    abort.current = ctrl;
    fetchVideo(raw, id, ctrl.signal).then((result) => {
      if (result) setLookup(result);
    });
    return () => ctrl.abort();
  }, [initial.videoUrl]);

  function onUrlChange(v: string) {
    setUrl(v);
    if (timer.current) clearTimeout(timer.current);
    const id = parseYouTubeId(v);
    if (!v.trim()) {
      lastId.current = null;
      return setLookup({ state: 'idle' });
    }
    if (!id) {
      lastId.current = null;
      return setLookup({ state: 'invalid' });
    }
    if (id !== lastId.current) setLookup({ state: 'loading' });
    timer.current = setTimeout(() => runLookup(v), 350);
  }

  const video = lookup.video;
  const videoReady = (lookup.state === 'found' || lookup.state === 'unavailable') && !!parseYouTubeId(url);
  const contactOk = contact.replace(/[^\w@+]/g, '').length >= 5;
  const emailOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const ready = videoReady && name.trim().length > 1 && contactOk && emailOk && terms;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ views, format: initial.format, pkg, region, currency, videoUrl: url, name, email, contact, payment: 'iban', terms }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === 'video_not_found'
            ? isTr ? 'Video bulunamadı. Herkese açık veya liste dışı bir video linki girin.' : 'Video not found. Use a public or unlisted video link.'
            : data.error === 'invalid_contact'
              ? isTr ? 'Geçerli bir WhatsApp numarası veya Telegram kullanıcı adı girin.' : 'Enter a valid WhatsApp number or Telegram username.'
              : t.order.error,
        );
        return setBusy(false);
      }
      setDone({ id: data.id });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError(t.order.error);
      setBusy(false);
    }
  }

  const pkgName = c.packages[pkg].name;
  const totalText = formatMoney(q.total, currency, locale);

  if (done) {
    const msg = isTr
      ? `Merhaba, ${done.id} kodlu teklifimi iletmek ve video analizi yaptırmak istiyorum.\nVideo: ${video?.title || url}\n${url}\nHedef: ${nf.format(q.views)} izlenme • ${pkgName} • ${c.regions[region].name}\nTahmini Tutar: ${totalText}`
      : `Hello, I'd like to submit quote ${done.id} for video analysis.\nVideo: ${video?.title || url}\n${url}\nTarget: ${nf.format(q.views)} views • ${pkgName} • ${c.regions[region].name}\nEstimated Total: ${totalText}`;
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/30 bg-studio-card p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-white sm:text-3xl">
          {isTr ? 'Teklif Talebiniz Alındı' : 'Your Quote Request Is In'}
        </h2>
        <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
          {isTr
            ? 'Videonuzu (süre, içerik ve Google Ads uygunluğu açısından) analiz edip size detaylı dönüş yapabilmemiz için lütfen WhatsApp veya Telegram üzerinden teklifinizi iletin. Onay alınca işlem başlar.'
            : 'Please reach out on WhatsApp or Telegram below so we can analyze your video (duration, content, and Google Ads compliance) and reply in detail. Work begins upon approval.'}
        </p>

        <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t.track.code}</span>
          <span className="font-mono text-xl font-black tracking-wider text-white">{done.id}</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(done.id).then(() => setCopied(true), () => {});
            }}
            className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label={t.track.copy}
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 font-bold text-white shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-500"
          >
            <MessageCircle className="h-5 w-5" /> {isTr ? 'WhatsApp ile Teklifi İlet' : 'Send Quote on WhatsApp'}
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-4 font-bold text-white shadow-lg shadow-sky-900/40 transition hover:bg-sky-500"
          >
            <Send className="h-5 w-5" /> {isTr ? 'Telegram ile Teklifi İlet' : 'Send Quote on Telegram'}
          </a>
        </div>
        <p className="mt-3 text-xs text-zinc-400">
          {isTr
            ? '* Fiyatlandırma standart klip süreleri baz alınarak hesaplanmıştır; video uzunluğuna göre değişebilir.'
            : '* Pricing is estimated for standard durations and may vary based on video length.'}
        </p>

        <dl className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left text-sm">
          <SummaryRow k="Video" v={video?.title || url} />
          <SummaryRow k={c.views} v={nf.format(q.views)} />
          <SummaryRow k={c.pkg} v={pkgName} />
          <SummaryRow k={c.total} v={totalText} strong />
        </dl>

        <Link
          href={`/${locale}/track/${done.id}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B7A] hover:underline"
        >
          {isTr ? 'Teklif & kampanya takip sayfası' : 'Quote & campaign tracking page'} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
      <div className="space-y-6">
        {/* ── 1. Video ── */}
        <Step n={1} title={isTr ? 'YouTube video linkinizi yapıştırın' : 'Paste your YouTube video link'}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="url"
              inputMode="url"
              autoFocus={!initial.videoUrl}
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              className={`${inputClass} pl-11 text-base`}
              aria-label={t.order.video}
            />
          </div>

          {lookup.state === 'invalid' && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
              <XCircle className="h-4 w-4" /> {t.order.videoBad}
            </p>
          )}
          {lookup.state === 'notfound' && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
              <XCircle className="h-4 w-4" />
              {isTr ? 'Video bulunamadı. Gizli videolar desteklenmez; herkese açık veya liste dışı link girin.' : 'Video not found. Private videos are not supported; use a public or unlisted link.'}
            </p>
          )}
          {lookup.state === 'loading' && (
            <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" /> {isTr ? 'Videonuz aranıyor…' : 'Finding your video…'}
            </div>
          )}

          {videoReady && video && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] sm:flex">
              <div className="relative aspect-video w-full shrink-0 bg-black sm:w-56">
                <Image src={video.thumbnail} alt={video.title || 'YouTube video'} fill sizes="(min-width: 640px) 224px, 100vw" className="object-cover" />
                {video.durationSec ? (
                  <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
                    {duration(video.durationSec)}
                  </span>
                ) : null}
              </div>
              <div className="min-w-0 flex-1 p-4">
                <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> {isTr ? 'Videonuz bulundu' : 'Video found'}
                </p>
                {video.title ? (
                  <p className="mt-1 line-clamp-2 font-bold text-white">{video.title}</p>
                ) : (
                  <p className="mt-1 text-sm text-zinc-300">Video ID: {video.id}</p>
                )}
                {video.channel && <p className="mt-0.5 text-xs text-zinc-400">{video.channel}</p>}

                {video.views !== undefined ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Stat icon={<Eye className="h-3.5 w-3.5" />} label={isTr ? 'Mevcut izlenme' : 'Current views'} value={nf.format(video.views)} />
                    {video.likes !== undefined && <Stat icon={<ThumbsUp className="h-3.5 w-3.5" />} label={isTr ? 'Beğeni' : 'Likes'} value={nf.format(video.likes)} />}
                    {video.comments !== undefined && <Stat icon={<MessageSquare className="h-3.5 w-3.5" />} label={isTr ? 'Yorum' : 'Comments'} value={nf.format(video.comments)} />}
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] text-zinc-500">
                    {isTr ? 'Güncel izlenme sayısı sipariş onayında kontrol edilir.' : 'Current view count is checked when your order is confirmed.'}
                  </p>
                )}
              </div>
            </div>
          )}
        </Step>

        {/* ── 2. Paket ── */}
        <Step n={2} title={isTr ? 'Kaç izlenme istiyorsunuz?' : 'How many views do you want?'} dim={!videoReady}>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setViews(p)}
                aria-pressed={views === p}
                className={`rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                  views === p ? 'bg-[#D9002B] text-white shadow-md shadow-red-500/30' : 'border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {short(p)}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <label htmlFor="custom-views" className="text-xs text-zinc-400">{isTr ? 'veya özel miktar:' : 'or custom amount:'}</label>
            <input
              id="custom-views"
              inputMode="numeric"
              value={nf.format(views)}
              onChange={(e) => {
                const n = parseInt(e.target.value.replace(/\D/g, ''), 10);
                setViews(Number.isFinite(n) ? Math.min(MAX_VIEWS, n) : MIN_VIEWS);
              }}
              onBlur={() => setViews((v) => Math.max(MIN_VIEWS, v))}
              className="w-32 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right font-bold tabular-nums text-white outline-none focus:border-[#FF0033]"
            />
          </div>

          {video?.views !== undefined && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{isTr ? 'Şu an' : 'Now'}: <strong className="text-white">{nf.format(video.views)}</strong></span>
                <span>{isTr ? 'Kampanya hedefi' : 'Campaign target'}: <strong className="text-emerald-400">+{nf.format(q.views)}</strong></span>
              </div>
              <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/10">
                <div className="bg-zinc-400" style={{ width: `${(video.views / (video.views + q.views)) * 100}%` }} />
                <div className="bg-gradient-to-r from-[#FF0033] to-[#FF6B6B]" style={{ width: `${(q.views / (video.views + q.views)) * 100}%` }} />
              </div>
              <p className="mt-2 text-xs text-zinc-300">
                {isTr ? 'Hedeflenen toplam' : 'Target total'}: <strong className="text-white">≈ {nf.format(video.views + q.views)}</strong> {isTr ? 'izlenme' : 'views'}
              </p>
            </div>
          )}

          <h4 className="mb-2 mt-6 text-sm font-bold text-white">{c.region}</h4>
          <div className="grid gap-2 sm:grid-cols-3">
            {REGIONS.map((r) => (
              <Choice key={r} on={region === r} onClick={() => setRegion(r)} title={`${r === 'tr' ? '🇹🇷' : r === 'global' ? '🌍' : '💎'} ${c.regions[r].name}`} desc={c.regions[r].desc} />
            ))}
          </div>

          <h4 className="mb-2 mt-6 text-sm font-bold text-white">{c.pkg}</h4>
          <div className="grid gap-2 sm:grid-cols-2">
            {PACKAGES.map((p) => (
              <Choice key={p} on={pkg === p} onClick={() => setPkg(p)} title={`${p === 'views' ? '▶️' : '💬'} ${c.packages[p].name}`} desc={c.packages[p].desc} tag={c.packages[p].tag} />
            ))}
          </div>
          {pkg === 'engagement' && <p className="mt-2 text-[11px] text-zinc-400">{c.engagementNote}</p>}
        </Step>

        {/* ── 3. İletişim ── */}
        <Step n={3} title={isTr ? 'Detaylı analiz dönüşü için iletişim bilginiz' : 'Your contact info for detailed analysis reply'} dim={!videoReady}>
          <div className="mb-4 rounded-2xl border border-blue-500/25 bg-blue-500/[0.06] p-3.5 text-xs leading-relaxed text-zinc-300">
            <strong className="text-white">
              {isTr ? 'Uzman Video Analizi & Onay Süreci:' : 'Specialist Video Analysis & Approval Process:'}
            </strong>{' '}
            {isTr
              ? 'Her YouTube videosu; süresi, içeriği ve Google Ads reklam kriterlerine uygunluğu açısından uzmanlarımızca incelenir. Teklifinizi iletin, videonuzu analiz edip size WhatsApp veya Telegram üzerinden detaylı dönüş yapalım; onay alınca işlem başlar.'
              : 'Every YouTube video is reviewed for runtime, content, and Google Ads eligibility. Submit your quote; we will analyze your video and reply in detail on WhatsApp or Telegram. Work begins upon approval.'}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="w-name" className="mb-1.5 block text-xs font-semibold text-white/80">{isTr ? 'Ad / Sanatçı adı' : 'Name / Artist name'}</label>
              <input id="w-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="w-contact" className="mb-1.5 block text-xs font-semibold text-white/80">{isTr ? 'WhatsApp numarası veya Telegram kullanıcı adı' : 'WhatsApp number or Telegram username'}</label>
              <input id="w-contact" autoComplete="tel" value={contact} onChange={(e) => setContact(e.target.value)} className={inputClass} placeholder={isTr ? '+90 5XX XXX XX XX veya @kullanici' : '+1 555 0199 or @username'} />
            </div>
          </div>
          <div className="mt-3">
            <label htmlFor="w-email" className="mb-1.5 block text-xs font-semibold text-white/80">{isTr ? 'E-posta (isteğe bağlı)' : 'Email (optional)'}</label>
            <input id="w-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="ornek@domain.com" />
            {!emailOk && <p className="mt-1 text-xs text-rose-400">{isTr ? 'E-posta adresi geçersiz.' : 'Invalid email address.'}</p>}
          </div>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs text-white/70">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 h-4 w-4 rounded accent-[#FF0033]" />
            <span>
              {isTr ? 'Hizmet şartlarını ve Google Ads video reklam kurallarını kabul ediyorum.' : 'I accept the Terms of Service and Google Ads video ad policies.'}{' '}
              <Link href={`/${locale}/kullanim-kosullari`} className="underline hover:text-white" target="_blank">{isTr ? 'Şartlar' : 'Terms'}</Link>
            </span>
          </label>
        </Step>
      </div>

      {/* ── Özet ── */}
      <aside className="h-fit rounded-3xl border border-white/15 bg-gradient-to-b from-[#1C2029] to-[#14161C] p-6 text-white shadow-2xl lg:sticky lg:top-24">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white/60">{t.order.summary}</h2>
          <div className="flex rounded-xl border border-white/10 bg-white/5 p-0.5" role="group" aria-label={c.currency}>
            {CURRENCIES.map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => setCurrency(cur)}
                aria-pressed={currency === cur}
                className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${currency === cur ? 'bg-[#D9002B] text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>

        {video?.title && <p className="mb-3 line-clamp-2 text-sm font-semibold text-white/90">{video.title}</p>}

        <dl className="space-y-2 border-y border-white/10 py-4 text-sm">
          <SummaryRow k={c.views} v={nf.format(q.views)} />
          <SummaryRow k={c.region} v={c.regions[region].name} />
          <SummaryRow k={c.pkg} v={pkgName} />
          <SummaryRow k={c.per1k} v={formatMoney(q.perThousand, currency, locale)} />
          <div className="flex items-center justify-between text-white/75">
            <dt className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.eta}</dt>
            <dd className="font-semibold">{q.etaDays[0]}–{q.etaDays[1]} {c.days}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-end justify-between">
          <span className="text-sm text-white/60">{c.total}</span>
          <span className="font-[family-name:var(--font-heading)] text-3xl font-extrabold tabular-nums">{totalText}</span>
        </div>
        <p className="mt-1.5 text-[11px] font-semibold text-amber-300/90">
          {isTr
            ? '* Fiyatlandırma video uzunluğuna göre değişebilir.'
            : '* Pricing may vary based on video length.'}
        </p>
        {q.discountRate > 0 && (
          <p className="mt-1 text-right text-xs font-bold text-emerald-400">
            {isTr ? `%${Math.round(q.discountRate * 100)} hacim indirimi dahil` : `${Math.round(q.discountRate * 100)}% volume discount included`}
          </p>
        )}

        <div className="mt-4 space-y-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs">
          <div className="flex justify-between text-zinc-300">
            <span>{isTr ? 'Onay alınca başlar (%50)' : 'Starts on approval (50%)'}</span>
            <span className="font-bold text-emerald-400">{formatMoney(Math.round(q.total / 2), currency, locale)}</span>
          </div>
          <div className="flex justify-between text-zinc-300">
            <span>{isTr ? 'Kampanya bitince (%50)' : 'On completion (50%)'}</span>
            <span className="font-bold">{formatMoney(q.total - Math.round(q.total / 2), currency, locale)}</span>
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/20 p-3 text-xs text-red-200">{error}</p>}

        <button
          type="submit"
          disabled={!ready || busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-6 py-4 text-base font-extrabold text-white shadow-xl shadow-red-500/25 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          {busy ? <><Loader2 className="h-5 w-5 animate-spin" /> {t.order.submitting}</> : <>{isTr ? 'Teklifi İlet & Analiz İste' : 'Submit Quote & Request Analysis'} <ArrowRight className="h-5 w-5" /></>}
        </button>
        {!ready && !busy && (
          <p className="mt-2 text-center text-[11px] text-zinc-500">
            {!videoReady
              ? isTr ? 'Önce video linkinizi girin.' : 'Enter your video link first.'
              : isTr ? 'Ad, iletişim ve onay kutusunu doldurun.' : 'Fill in name, contact and accept the terms.'}
          </p>
        )}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-white/60">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          {isTr ? 'Analiz sonrası WhatsApp / Telegram dönüşü • Onay alınca işlem başlar' : 'Detailed reply via WhatsApp / Telegram • Starts upon approval'}
        </p>
      </aside>
    </form>
  );
}

/** Video önizlemesini çeker. İstek iptal edildiyse null döner. */
async function fetchVideo(raw: string, id: string, signal: AbortSignal): Promise<Lookup | null> {
  try {
    const res = await fetch(`/api/video?url=${encodeURIComponent(raw)}`, { signal });
    if (res.status === 404) return { state: 'notfound' };
    if (!res.ok) {
      // Servis geçici olarak yanıt vermiyorsa kapakla devam edilir; sipariş engellenmez.
      return {
        state: 'unavailable',
        video: { id, title: '', channel: '', thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, source: 'oembed' },
      };
    }
    return { state: 'found', video: await res.json() };
  } catch (e) {
    return (e as Error).name === 'AbortError' ? null : { state: 'unavailable' };
  }
}

function Step({ n, title, dim, children }: { n: number; title: string; dim?: boolean; children: React.ReactNode }) {
  return (
    <section className={`rounded-3xl border border-studio bg-studio-card p-5 shadow-xl backdrop-blur-xl transition-opacity sm:p-6 ${dim ? 'opacity-50' : ''}`}>
      <h3 className="mb-4 flex items-center gap-3 text-base font-extrabold text-white sm:text-lg">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D9002B] text-sm font-black">{n}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Choice({ on, onClick, title, desc, tag }: { on: boolean; onClick: () => void; title: string; desc: string; tag?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-2xl border p-3 text-left transition ${
        on ? 'border-[#FF0033] bg-[#FF0033]/15 ring-1 ring-[#FF0033]/40' : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-extrabold text-white">{title}</span>
        {tag && <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-300">{tag}</span>}
      </div>
      <div className="mt-0.5 text-xs text-zinc-400">{desc}</div>
    </button>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-zinc-300">
      {icon} {label}: <strong className="tabular-nums text-white">{value}</strong>
    </span>
  );
}

function SummaryRow({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 py-0.5 ${strong ? 'font-bold text-white' : 'text-white/75'}`}>
      <dt>{k}</dt>
      <dd className="min-w-0 truncate text-right font-semibold tabular-nums">{v}</dd>
    </div>
  );
}
