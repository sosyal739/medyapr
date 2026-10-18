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
  Mail,
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
import { consultHref, mailtoHref, telegramHref } from '@/lib/contact';
import { trackEvent } from '@/lib/analytics';
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
  publishedAt?: string;
  source: 'api' | 'oembed';
};

type Lookup = { state: 'idle' | 'loading' | 'found' | 'notfound' | 'invalid' | 'unavailable'; video?: Video };
export type AnalysisChannel = 'whatsapp' | 'telegram' | 'email';

export type WizardInitial = {
  views: number;
  format: Format;
  pkg: Package;
  region: Region;
  currency: Currency;
  videoUrl?: string;
  channel?: AnalysisChannel;
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
  const [channel, setChannel] = useState<AnalysisChannel>(initial.channel ?? 'whatsapp');
  const [name, setName] = useState('');
  const contact = ''; // WhatsApp/Telegram/Mail akışlarında telefon istenmez
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ id: string; channel: AnalysisChannel } | null>(null);
  const [copied, setCopied] = useState(false);

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);
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
    setError('');
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
  const videoId = parseYouTubeId(url);
  const videoReady = !!videoId && lookup.state !== 'notfound';
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const pkgName = c.packages[pkg].name;
  const regionName = c.regions[region].name;
  const totalText = formatMoney(q.total, currency, locale);
  const durText = video?.durationSec ? duration(video.durationSec) : '';

  const buildPackageMessage = (orderId?: string) => {
    const codeLine = orderId ? (isTr ? `Talep Kodu: ${orderId}\n` : `Request Code: ${orderId}\n`) : '';
    // Video bloğu: yalnızca bilinen alanlar yazılır (YouTube API anahtarı yoksa istatistikler boş kalır)
    const pubText = video?.publishedAt
      ? new Date(video.publishedAt).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const likeRate =
      video?.views && video.likes !== undefined
        ? isTr
          ? `%${((video.likes / video.views) * 100).toFixed(1).replace('.', ',')}`
          : `${((video.likes / video.views) * 100).toFixed(1)}%`
        : '';
    const L = isTr
      ? { title: 'Video', channel: 'Kanal', link: 'Link', pub: 'Yayın tarihi', dur: 'Süre', views: 'İzlenme', likes: 'Beğeni', comments: 'Yorum', rate: 'beğeni oranı' }
      : { title: 'Video', channel: 'Channel', link: 'Link', pub: 'Published', dur: 'Duration', views: 'Views', likes: 'Likes', comments: 'Comments', rate: 'like rate' };
    const metaLine = [pubText && `${L.pub}: ${pubText}`, durText && `${L.dur}: ${durText}`].filter(Boolean).join(' · ');
    const statLine = [
      video?.views !== undefined && `${L.views}: ${nf.format(video.views)}`,
      video?.likes !== undefined && `${L.likes}: ${nf.format(video.likes)}${likeRate ? ` (${L.rate} ${likeRate})` : ''}`,
      video?.comments !== undefined && `${L.comments}: ${nf.format(video.comments)}`,
    ]
      .filter(Boolean)
      .join(' · ');
    const videoBlock = [
      video?.title && `${L.title}: ${video.title}`,
      video?.channel && `${L.channel}: ${video.channel}`,
      `${L.link}: ${url}`,
      metaLine,
      statLine,
    ]
      .filter(Boolean)
      .join('\n');
    const senderLine = name.trim();
    const noteLine = note.trim() ? (isTr ? `\nNot: ${note.trim()}` : `\nNote: ${note.trim()}`) : '';

    return isTr
      ? `Merhaba, YouTube videom için PR / reklam çalışması planlıyorum. Videomu analiz edip bana teklif verir misiniz?\n\n${codeLine}${videoBlock}\n\nDüşündüğüm paket: ${nf.format(q.views)} İzlenme - ${pkgName} - ${regionName}\nTahmini Teklif: ${totalText} (Video uzunluğuna göre değişebilir)${senderLine ? `\nİletişim: ${senderLine}` : ''}${noteLine}`
      : `Hello, I am planning a PR / ad campaign for my YouTube video. Could you review it and send me a quote?\n\n${codeLine}${videoBlock}\n\nPackage I have in mind: ${nf.format(q.views)} Views - ${pkgName} - ${regionName}\nEstimated Quote: ${totalText} (May vary by video length)${senderLine ? `\nContact: ${senderLine}` : ''}${noteLine}`;
  };

  function ensureVideoEntered(): boolean {
    if (!videoReady) {
      setError(
        isTr
          ? 'Lütfen önce 1. adımda YouTube video linkinizi yapıştırın.'
          : 'Please paste your YouTube video link in Step 1 first.',
      );
      urlInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      urlInputRef.current?.focus();
      return false;
    }
    return true;
  }

  async function requestViaChannel(targetChannel: AnalysisChannel) {
    setError('');
    setChannel(targetChannel);
    if (!ensureVideoEntered() || busy) return;

    // WhatsApp veya Telegram seçildiyse: kullanıcıyı bekletmeden hazır mesajla ilgili uygulamayı aç
    if (targetChannel === 'whatsapp' || targetChannel === 'telegram') {
      const msg = buildPackageMessage();
      if (targetChannel === 'telegram') {
        navigator.clipboard?.writeText(msg).catch(() => {});
      }
      const targetHref = targetChannel === 'whatsapp' ? consultHref(msg) : telegramHref(msg);
      window.open(targetHref, '_blank', 'noopener,noreferrer');

      // Arka planda siparişi / analiz talebini kaydet ve yöneticiye bildirim gönder
      setBusy(true);
      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            channel: targetChannel,
            views,
            format: initial.format,
            pkg,
            region,
            currency,
            videoUrl: url,
            name,
            email: '',
            contact: '',
            note,
            locale,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.id) {
          setDone({ id: data.id, channel: targetChannel });
          trackEvent('order_request_submitted', { channel: targetChannel, views, pkg, region, currency });
        }
      } catch {
        // WhatsApp/Telegram zaten açıldığı için hata gösterme
      } finally {
        setBusy(false);
      }
      return;
    }

    // Mail (E-Posta) ile analiz isteği
    if (!emailValid) {
      setError(
        isTr
          ? 'Mail ile analiz dönüşü yapabilmemiz için lütfen geçerli bir e-posta adresi girin.'
          : 'Please enter a valid email address so we can send your video analysis via email.',
      );
      emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      emailInputRef.current?.focus();
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          channel: 'email',
          views,
          format: initial.format,
          pkg,
          region,
          currency,
          videoUrl: url,
          name,
          email,
          contact,
          note,
          locale,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.error === 'video_not_found'
            ? isTr
              ? 'Video bulunamadı. Herkese açık veya liste dışı bir video linki girin.'
              : 'Video not found. Use a public or unlisted video link.'
            : data.error === 'invalid_email'
              ? isTr
                ? 'Lütfen geçerli bir e-posta adresi girin.'
                : 'Please enter a valid email address.'
              : t.order.error,
        );
        setBusy(false);
        return;
      }
      setDone({ id: data.id, channel: 'email' });
      trackEvent('order_request_submitted', { channel: 'email', views, pkg, region, currency });
      setBusy(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError(t.order.error);
      setBusy(false);
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    void requestViaChannel(channel);
  }

  if (done) {
    const msg = buildPackageMessage(done.id);
    const mailSubject = isTr
      ? `YouTube Video Analiz & Teklif Talebi (${done.id}) - ${video?.title || url}`
      : `YouTube Video Analysis & Quote Request (${done.id}) - ${video?.title || url}`;

    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/30 bg-studio-card p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400" />
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-white sm:text-3xl">
          {done.channel === 'email'
            ? isTr
              ? 'Paketiniz & Analiz Talebiniz Mail İle Alındı'
              : 'Your Package & Analysis Request Was Received by Email'
            : isTr
              ? 'Paketiniz & Analiz Talebiniz Oluşturuldu'
              : 'Your Package & Analysis Request Is Ready'}
        </h2>
        <p className="mt-2 text-sm text-zinc-300 leading-relaxed">
          {done.channel === 'email'
            ? isTr
              ? `Videonuz (${video?.title || url}) ve seçtiğiniz paket uzman ekibimize iletildi. Süre, içerik ve Google Ads uygunluk analizini tamamlayıp ${email} adresinize detaylı dönüş yapacağız. Onay alınca işlem başlar.`
              : `Your video and selected package have been sent to our team. After checking duration, content, and Google Ads eligibility, we will send a detailed reply to ${email}. Work begins upon approval.`
            : isTr
              ? 'Videonuzu (süre, içerik ve Google Ads uygunluğu açısından) analiz edip size detaylı dönüş yapabilmemiz için mesajınızı WhatsApp, Telegram veya Mail üzerinden iletebilirsiniz. Onay alınca işlem başlar.'
              : 'Send your pre-filled package details via WhatsApp, Telegram, or Email below so we can analyze your video and reply in detail. Work begins upon approval.'}
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

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <a
            href={consultHref(msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 transition hover:bg-emerald-500"
          >
            <MessageCircle className="h-4 w-4 shrink-0" /> {isTr ? 'WhatsApp ile İlet' : 'Send via WhatsApp'}
          </a>
          <a
            href={telegramHref(msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-900/40 transition hover:bg-sky-500"
          >
            <Send className="h-4 w-4 shrink-0" /> {isTr ? 'Telegram ile İlet' : 'Send via Telegram'}
          </a>
          <a
            href={mailtoHref(mailSubject, msg)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-500/15 px-4 py-3.5 text-sm font-bold text-amber-200 transition hover:bg-amber-500/25 hover:text-white"
          >
            <Mail className="h-4 w-4 shrink-0" /> {isTr ? 'Mail Uygulamasıyla Gönder' : 'Open in Mail App'}
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
          <SummaryRow k={c.region} v={regionName} />
          <SummaryRow k={c.total} v={totalText} strong />
        </dl>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/${locale}/track/${done.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B7A] hover:underline"
          >
            {isTr ? 'Teklif & kampanya takip sayfası' : 'Quote & campaign tracking page'} <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setDone(null)}
            className="text-xs font-semibold text-zinc-400 underline hover:text-white"
          >
            {isTr ? 'Paketi veya linki düzenle' : 'Edit package or link'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
      <div className="space-y-6">
        {/* ── 1. Video Linki ── */}
        <Step n={1} title={isTr ? 'YouTube video linkinizi yapıştırın' : 'Paste your YouTube video link'}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              ref={urlInputRef}
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
              {isTr
                ? 'Video bulunamadı. Gizli videolar desteklenmez; herkese açık veya liste dışı link girin.'
                : 'Video not found. Private videos are not supported; use a public or unlisted link.'}
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
                    {isTr ? 'Güncel izlenme sayısı ve video süresi analiz aşamasında kontrol edilir.' : 'Current view count and duration are checked during analysis.'}
                  </p>
                )}
              </div>
            </div>
          )}
        </Step>

        {/* ── 2. Paket Seçimi ── */}
        <Step n={2} title={isTr ? 'Paketinizi ve hedef izlenmeyi seçin' : 'Select your package and target views'}>
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
              {(video.likes !== undefined || video.comments !== undefined) && (
                <p className="mt-2 text-xs text-zinc-400">
                  {video.likes !== undefined && <>{isTr ? 'Beğeni' : 'Likes'}: <strong className="text-white">{nf.format(video.likes)}</strong></>}
                  {video.likes !== undefined && video.comments !== undefined && ' · '}
                  {video.comments !== undefined && <>{isTr ? 'Yorum' : 'Comments'}: <strong className="text-white">{nf.format(video.comments)}</strong></>}
                </p>
              )}
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

        {/* ── 3. Paketi Gönder & Analiz İste (WhatsApp / Telegram / Mail Seçenekleri) ── */}
        <Step
          n={3}
          title={
            isTr
              ? 'Paketi gönderin ve analiz isteyin (WhatsApp, Telegram veya Mail)'
              : 'Send your package & request analysis (WhatsApp, Telegram, or Email)'
          }
        >
          <p className="mb-4 text-xs leading-relaxed text-zinc-300">
            {isTr
              ? 'Video linkinizi ve seçtiğiniz paketi size en uygun kanaldan bize iletin. Uzman ekibimiz videonuzun süresini ve Google Ads uygunluğunu analiz edip detaylı dönüş yapsın; onay alınca işlem başlar.'
              : 'Send your video link and selected package through your preferred channel. Our specialists will analyze your video duration and Google Ads compliance and reply in detail; work begins upon approval.'}
          </p>

          {/* 3 Kanal Seçim Kartları */}
          <div className="grid gap-2.5 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setChannel('whatsapp')}
              aria-pressed={channel === 'whatsapp'}
              className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition ${
                channel === 'whatsapp'
                  ? 'border-emerald-400 bg-emerald-500/15 ring-1 ring-emerald-400/40'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              <span className="inline-flex items-center gap-2 text-sm font-extrabold text-white">
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                {isTr ? 'WhatsApp ile Analiz' : 'Via WhatsApp'}
              </span>
              <span className="mt-1 text-[11px] text-zinc-400">
                {isTr ? 'Paketi ve linki tek tıkla WhatsApp’tan gönderin' : 'Send link & package directly on WhatsApp'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setChannel('telegram')}
              aria-pressed={channel === 'telegram'}
              className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition ${
                channel === 'telegram'
                  ? 'border-sky-400 bg-sky-500/15 ring-1 ring-sky-400/40'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              <span className="inline-flex items-center gap-2 text-sm font-extrabold text-white">
                <Send className="h-4 w-4 text-sky-400" />
                {isTr ? 'Telegram ile Analiz' : 'Via Telegram'}
              </span>
              <span className="mt-1 text-[11px] text-zinc-400">
                {isTr ? 'Paketi ve linki tek tıkla Telegram’dan gönderin' : 'Send link & package directly on Telegram'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setChannel('email');
                setTimeout(() => emailInputRef.current?.focus(), 50);
              }}
              aria-pressed={channel === 'email'}
              className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition ${
                channel === 'email'
                  ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400/40'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              <span className="inline-flex items-center gap-2 text-sm font-extrabold text-white">
                <Mail className="h-4 w-4 text-amber-400" />
                {isTr ? 'Mail ile Analiz' : 'Via Email'}
              </span>
              <span className="mt-1 text-[11px] text-zinc-400">
                {isTr ? 'E-postanızı yazın, analizi mailinize gönderelim' : 'Enter your email to receive the analysis'}
              </span>
            </button>
          </div>

          {/* İletişim / Mail Bilgileri */}
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {channel === 'email' && (
                <div>
                  <label htmlFor="w-email" className="mb-1.5 block text-xs font-semibold text-white/85">
                    {isTr ? 'E-posta adresiniz (Zorunlu) *' : 'Your email address (Required) *'}
                  </label>
                  <input
                    ref={emailInputRef}
                    id="w-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={inputClass}
                    placeholder="ornek@domain.com"
                  />
                </div>
              )}
              <div>
                <label htmlFor="w-name" className="mb-1.5 block text-xs font-semibold text-white/85">
                  {isTr ? 'Ad / Sanatçı veya Kanal Adı (İsteğe bağlı)' : 'Name / Artist or Channel Name (Optional)'}
                </label>
                <input
                  id="w-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder={isTr ? 'Örn: Sanatçı / Yapım Adı' : 'e.g. Artist / Label Name'}
                />
              </div>
              <div>
                <label htmlFor="w-note" className="mb-1.5 block text-xs font-semibold text-white/85">
                  {isTr ? 'Ek Notunuz (İsteğe bağlı)' : 'Additional Note (Optional)'}
                </label>
                <input
                  id="w-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={inputClass}
                  placeholder={isTr ? 'Örn: Klip çıkış tarihi, hedef ülke vb.' : 'e.g. Release date, target audience'}
                />
              </div>
            </div>

            {/* 3 Doğrudan Gönderim Butonu */}
            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => void requestViaChannel('whatsapp')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-emerald-950/50 transition hover:bg-emerald-500 disabled:opacity-50"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>{isTr ? 'WhatsApp ile Analiz İste' : 'Request via WhatsApp'}</span>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => void requestViaChannel('telegram')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-sky-950/50 transition hover:bg-sky-500 disabled:opacity-50"
              >
                <Send className="h-4 w-4 shrink-0" />
                <span>{isTr ? 'Telegram ile Analiz İste' : 'Request via Telegram'}</span>
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => void requestViaChannel('email')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-4 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-red-950/50 transition hover:brightness-110 disabled:opacity-50"
              >
                {busy && channel === 'email' ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : (
                  <Mail className="h-4 w-4 shrink-0" />
                )}
                <span>{isTr ? 'Mail ile Analiz İste' : 'Request via Email'}</span>
              </button>
            </div>
          </div>
        </Step>
      </div>

      {/* ── Sağ Kolon: Paket Özeti & 3 Analiz Kanalı (Sticky) ── */}
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

        {video?.title ? (
          <p className="mb-3 line-clamp-2 text-sm font-semibold text-white/90">{video.title}</p>
        ) : url.trim() ? (
          <p className="mb-3 truncate text-xs text-zinc-400">{url}</p>
        ) : (
          <p className="mb-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            {isTr ? '1. adımda YouTube video linkinizi yapıştırın.' : 'Paste your YouTube video link in Step 1.'}
          </p>
        )}

        <dl className="space-y-2 border-y border-white/10 py-4 text-sm">
          <SummaryRow k={c.views} v={nf.format(q.views)} />
          <SummaryRow k={c.region} v={regionName} />
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

        {/* Sağ Özet Kutusu: 3 Kanaldan Paketi Gönder & Analiz İste */}
        <div className="mt-5 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {isTr ? 'Paketi Gönder & Analiz İste:' : 'Send Package & Request Analysis:'}
          </p>

          <button
            type="button"
            disabled={busy}
            onClick={() => void requestViaChannel('whatsapp')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-950/50 transition hover:bg-emerald-500 disabled:opacity-50"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span>{isTr ? 'WhatsApp ile Analiz İste' : 'Request Analysis on WhatsApp'}</span>
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => void requestViaChannel('telegram')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sky-950/50 transition hover:bg-sky-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4 shrink-0" />
            <span>{isTr ? 'Telegram ile Analiz İste' : 'Request Analysis on Telegram'}</span>
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => void requestViaChannel('email')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-red-950/50 transition hover:brightness-110 disabled:opacity-50"
          >
            {busy && channel === 'email' ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <Mail className="h-4 w-4 shrink-0" />
            )}
            <span>{isTr ? 'Mail (E-Posta) ile Analiz İste' : 'Request Analysis via Email'}</span>
          </button>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-white/60">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          {isTr
            ? 'Analiz sonrası detaylı dönüş • Onay alınca işlem başlar'
            : 'Detailed reply after analysis • Starts upon approval'}
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
        {tag && <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-[11px] font-black text-amber-300">{tag}</span>}
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
