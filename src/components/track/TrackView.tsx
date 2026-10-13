'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Check, Copy, ExternalLink, Hourglass, ShieldCheck, Sparkles, MessageCircle, Send } from 'lucide-react';
import { formatMoney } from '@/lib/pricing';
import { TELEGRAM_URL } from '@/lib/contact';
import type { AppStrings } from '@/lib/i18n/app-strings';
import type { DailyStat, OrderStatus } from '@/lib/store';

export type PublicOrder = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  videoId: string;
  videoUrl: string;
  views: number;
  total: number;
  currency: 'TRY' | 'EUR' | 'USD';
  payment: 'card' | 'iban';
  format: 'instream' | 'shorts' | 'discovery';
  region: 'tr' | 'global' | 'premium';
  stats: DailyStat[];
};

const STEPS: OrderStatus[] = ['payment_review', 'queued', 'running', 'completed'];

const STATUS_LABELS_TR: Record<OrderStatus, string> = {
  pending_payment: 'Analiz & Onay Bekleniyor',
  payment_review: 'Google Ads Onay İncelemesinde',
  queued: 'Onaylandı — Kampanya Hazırlanıyor',
  running: 'Google Ads Yayında',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
};

const STATUS_LABELS_EN: Record<OrderStatus, string> = {
  pending_payment: 'Awaiting Analysis & Approval',
  payment_review: 'In Google Ads Approval Review',
  queued: 'Approved — Preparing Campaign',
  running: 'Google Ads Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function TrackView({
  initial,
  locale,
  t,
  isNew,
}: {
  initial: PublicOrder;
  locale: string;
  t: AppStrings;
  isNew: boolean;
}) {
  const [o, setO] = useState(initial);
  const [copiedCode, setCopiedCode] = useState(false);
  const isTr = locale === 'tr';
  const nf = new Intl.NumberFormat(isTr ? 'tr-TR' : 'en-US');
  const statusLabels = isTr ? STATUS_LABELS_TR : STATUS_LABELS_EN;

  // Auto-refresh every 25s
  useEffect(() => {
    const id = setInterval(async () => {
      const r = await fetch(`/api/orders/${o.id}`, { cache: 'no-store' }).catch(() => null);
      if (r?.ok) setO(await r.json());
    }, 25_000);
    return () => clearInterval(id);
  }, [o.id]);

  const done = o.stats.reduce((n, s) => n + s.views, 0);
  const pct = Math.min(100, Math.round((done / o.views) * 100));
  const waitingPay = o.status === 'pending_payment' || o.status === 'payment_review';
  const stepIdx = o.status === 'pending_payment' ? -1 : STEPS.indexOf(o.status);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(o.id);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  const waText = isTr
    ? encodeURIComponent(`Merhaba, MedyaPR üzerinden ${o.id} kodlu teklifim için video analizi ve onay sürecini başlatmak istiyorum. Video Linkim: ${o.videoUrl}`)
    : encodeURIComponent(`Hello, I would like to start the video analysis and approval process for my MedyaPR quote ${o.id}. Video Link: ${o.videoUrl}`);

  return (
    <div className="space-y-8 text-white">
      {isNew && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-sm text-emerald-300 backdrop-blur-xl">
          <Sparkles className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>
            {isTr
              ? 'Teklif talebiniz başarıyla oluşturuldu! Bu sayfanın bağlantısını saklayın; analiz, onay ve kampanya sürecini buradan anlık takip edebilirsiniz.'
              : 'Your quote request was created! Bookmark this URL to track analysis, approval, and campaign progress in real-time.'}
          </span>
        </div>
      )}

      {/* Top Banner: Video Card + Order ID */}
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-studio bg-studio-card p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-5">
          {/* Thumbnail */}
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-2xl border border-zinc-700/60 bg-black/40">
            <Image fill sizes="128px"
              src={`https://i.ytimg.com/vi/${o.videoId}/mqdefault.jpg`}
              alt="Video Thumbnail"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              {isTr ? 'Teklif & Takip Kodu' : 'Quote & Tracking Code'}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-2xl font-black text-white tracking-wide">{o.id}</span>
              <button
                onClick={copyCode}
                className="rounded-lg border border-zinc-700/60 bg-zinc-800/80 p-1.5 text-zinc-300 hover:text-white hover:border-zinc-500 transition"
                title={isTr ? 'Kodu Kopyala' : 'Copy Code'}
              >
                {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={o.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-700 hover:text-white transition shadow-sm"
          >
            {isTr ? "YouTube'da Aç" : 'Open on YouTube'} <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <span className="rounded-xl bg-[#D9002B] px-4 py-2 text-xs font-extrabold text-white shadow-lg shadow-[#FF0033]/30">
            {statusLabels[o.status] || o.status}
          </span>
        </div>
      </div>

      {/* Progress Timeline Steps */}
      <div className="rounded-3xl border border-studio bg-studio-card p-6 md:p-8 backdrop-blur-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-6">
          {isTr ? 'Kampanya Aşamaları' : 'Campaign Milestones'}
        </h3>
        <ol className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STEPS.map((s, i) => {
            const on = i <= stepIdx;
            const current = i === stepIdx;

            return (
              <li
                key={s}
                className={`relative rounded-2xl border p-4 transition ${
                  current
                    ? 'border-[#FF0033] bg-[#FF0033]/10 shadow-lg shadow-[#FF0033]/20'
                    : on
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-white/5 bg-white/[0.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-white/40">0{i + 1}</span>
                  {on ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Hourglass className="h-4 w-4 text-white/30" />
                  )}
                </div>
                <div className={`text-xs font-bold ${on ? 'text-white' : 'text-white/40'}`}>
                  {statusLabels[s]}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Analysis & WhatsApp / Telegram Confirmation Box */}
      {waitingPay && (
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-studio-card p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                {isTr ? 'Online Ödeme Yoktur • WhatsApp & Telegram İletişim' : 'No Online Checkout • WhatsApp & Telegram Support'}
              </div>
              <h4 className="text-xl font-extrabold text-white">
                {isTr ? 'Tahmini Teklif Tutarı:' : 'Estimated Quote:'}{' '}
                <span className="text-[#FF6B6B]">{formatMoney(o.total, o.currency, locale)}</span>
              </h4>
              {isTr ? (
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Sitemizde otomatik online ödeme veya sesli çağrı merkezi bulunmamaktadır. İlettiğiniz video linki;{' '}
                  <strong className="text-white">video uzunluğu, hedef kitle ve Google Ads reklam politikalarına uygunluk</strong>{' '}
                  açısından incelenmektedir. Teklif kodunuzu (<strong className="text-white font-mono bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/60">{o.id}</strong>) WhatsApp veya Telegram üzerinden bize iletin; analiz edip detaylı dönüş yapalım. Onay alınca işleminiz başlar.{' '}
                  <span className="text-amber-300 font-semibold">(Fiyatlandırma video uzunluğuna göre değişebilir.)</span>
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  We do not use automated online checkout or voice call centers. Your video link is inspected for{' '}
                  <strong className="text-white">runtime, target audience, and Google Ads policy compliance</strong>. Send your quote code (<strong className="text-white font-mono bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/60">{o.id}</strong>) via WhatsApp or Telegram below; we will analyze your video and reply in detail. Work begins upon approval.{' '}
                  <span className="text-amber-300 font-semibold">(Pricing may vary based on video length.)</span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <a
                href={`https://wa.me/905312993355?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#25D366]/30 hover:scale-105 transition"
              >
                <MessageCircle className="h-5 w-5" />
                {isTr ? 'WhatsApp ile Teklifi İlet' : 'Send Quote on WhatsApp'}
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sky-600/30 hover:scale-105 transition"
              >
                <Send className="h-5 w-5" />
                {isTr ? 'Telegram ile Teklifi İlet' : 'Send Quote on Telegram'}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Progress Ring & Daily Charts */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        {/* Ring Card */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-studio bg-studio-card p-8 text-center backdrop-blur-xl shadow-2xl">
          <Ring pct={pct} />
          <div className="mt-6">
            <div className="font-[family-name:var(--font-heading)] text-4xl font-extrabold tabular-nums tracking-tight">
              {nf.format(done)}
            </div>
            <div className="mt-1 text-sm text-zinc-400">
              {isTr ? 'Teslim Edilen İzlenme / Hedef:' : 'Delivered Views / Target:'} <strong className="text-white">{nf.format(o.views)}</strong>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-zinc-900/60 border border-studio px-4 py-2 text-xs text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>{isTr ? 'Google Ads Resmi Video Gösterimleri' : 'Official Google Ads Video Impressions'}</span>
          </div>
        </div>

        {/* Daily Stats Bar Chart */}
        <div className="rounded-3xl border border-studio bg-studio-card p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {isTr ? 'Günlük İzlenme Performansı' : 'Daily View Performance'}
            </h3>
            <span className="rounded-full bg-zinc-900/60 border border-studio px-3 py-1 text-xs text-zinc-400">
              {o.stats.length} {isTr ? 'Günlük Veri' : 'Days of Data'}
            </span>
          </div>

          {o.stats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500">
              <Hourglass className="h-8 w-8 mb-3 opacity-40 animate-pulse" />
              <p className="text-sm">
                {isTr
                  ? 'Kampanya onaylandıktan sonra günlük izlenmeler burada listelenecektir.'
                  : 'Daily statistics will appear here once the campaign goes live.'}
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                {isTr ? 'Her gün otomatik olarak güncellenir.' : 'Updated automatically every 24 hours.'}
              </p>
            </div>
          ) : (
            <Bars stats={o.stats} locale={locale} />
          )}
        </div>
      </div>
    </div>
  );
}

function Ring({ pct }: { pct: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 180 180" className="mx-auto h-48 w-48 -rotate-90" role="img" aria-label={`${pct}%`}>
      <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
      <circle
        cx="90"
        cy="90"
        r={r}
        fill="none"
        stroke="#FF0033"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        style={{ transition: 'stroke-dashoffset .8s ease' }}
      />
      <text
        x="90"
        y="90"
        textAnchor="middle"
        dominantBaseline="central"
        className="rotate-90 origin-center fill-white text-3xl font-extrabold"
        style={{ transformBox: 'fill-box' }}
      >
        {pct}%
      </text>
    </svg>
  );
}

function Bars({ stats, locale }: { stats: DailyStat[]; locale: string }) {
  const max = Math.max(...stats.map((s) => s.views), 1);
  const W = 560,
    H = 200,
    pad = 28;
  const bw = Math.min(40, (W - pad * 2) / stats.length - 6);
  const fmt = new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', { notation: 'compact' });

  return (
    <svg viewBox={`0 0 ${W} ${H + 28}`} className="w-full" role="img">
      {[0, 0.5, 1].map((g) => (
        <g key={g}>
          <line x1={pad} x2={W - pad} y1={H - g * (H - 20)} y2={H - g * (H - 20)} stroke="rgba(255,255,255,0.1)" />
          <text x={0} y={H - g * (H - 20) + 4} fontSize="10" fill="rgba(255,255,255,0.4)">
            {fmt.format(max * g)}
          </text>
        </g>
      ))}
      {stats.map((s, i) => {
        const step = (W - pad * 2) / stats.length;
        const x = pad + i * step + (step - bw) / 2;
        const h = (s.views / max) * (H - 20);
        return (
          <g key={s.date}>
            <rect x={x} y={H - h} width={bw} height={h} rx="6" fill="#FF0033" opacity={0.9}>
              <title>{`${s.date}: ${s.views}`}</title>
            </rect>
            <text x={x + bw / 2} y={H + 16} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)">
              {s.date.slice(5)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
