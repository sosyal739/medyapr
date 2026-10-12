'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Banknote, CheckCircle2, CreditCard, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { formatMoney, parseYouTubeId, quote, type Currency, type Format, type Package, type Region } from '@/lib/pricing';
import type { AppStrings } from '@/lib/i18n/app-strings';

type Initial = { views: number; format: Format; pkg: Package; region: Region; currency: Currency };

const inputClass =
  'w-full rounded-xl border border-zinc-700/60 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#FF0033] focus:ring-4 focus:ring-[#FF0033]/20';

export default function OrderForm({ locale, t, initial }: { locale: string; t: AppStrings; initial: Initial }) {
  const router = useRouter();
  const o = t.order;
  const c = t.calc;
  const [videoUrl, setVideoUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [payment, setPayment] = useState<'card' | 'iban'>('iban');
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const q = useMemo(() => quote(initial), [initial]);
  const videoId = parseYouTubeId(videoUrl);
  const videoTouched = videoUrl.trim().length > 0;
  const ready = !!videoId && name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && terms;
  const nf = new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...initial, videoUrl, name, email, contact, payment, terms }),
      });
      if (!res.ok) throw new Error();
      const { id } = await res.json();
      router.push(`/${locale}/track/${id}?new=1`);
    } catch {
      setError(o.error);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      {/* Left Column: Form */}
      <div className="space-y-6 rounded-3xl border border-studio bg-studio-card p-6 shadow-2xl md:p-8 backdrop-blur-xl">
        <div>
          <label htmlFor="video" className="mb-2 block text-sm font-semibold text-white/90">
            {o.video}
          </label>
          <input
            id="video"
            type="url"
            required
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className={inputClass}
          />
          {videoTouched && !videoId && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
              <XCircle className="h-4 w-4" /> {o.videoBad}
            </p>
          )}
          {videoId && (
            <div className="mt-3 flex items-center gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                alt="Video Thumbnail"
                className="h-16 w-28 rounded-lg object-cover"
              />
              <div>
                <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> {o.videoOk}
                </p>
                <p className="text-xs text-white/50 mt-0.5">Video ID: {videoId}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-white/90">
              {o.name}
            </label>
            <input
              id="name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder={locale === 'tr' ? 'Ad Soyad veya Sanatçı Adı' : 'Full Name or Artist Name'}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-white/90">
              {o.email}
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="ornek@domain.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact" className="mb-2 block text-sm font-semibold text-white/90">
            {o.contact}
          </label>
          <input
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className={inputClass}
            placeholder={locale === 'tr' ? '+90 531 299 33 55 (WhatsApp Bildirimi İçin)' : '+1 555 0199 (For WhatsApp Updates)'}
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-white/90">{o.payment}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                key: 'iban' as const,
                icon: Banknote,
                label: locale === 'tr' ? 'Banka Havalesi / FAST (%50 Onayda, %50 Bitince)' : 'Bank Wire / Transfer (50% On Approval, 50% On Delivery)',
                desc: locale === 'tr' ? 'Videonuz reklam onayı alınca %50, iş bitiminde %50 (Kurumsala iş bitiminde)' : '50% upon Google Ads approval, 50% upon delivery (100% on delivery for agencies)',
              },
              {
                key: 'card' as const,
                icon: CreditCard,
                label: locale === 'tr' ? 'Kredi / Banka Kartı (Stripe)' : 'Credit / Debit Card (Stripe)',
                desc: locale === 'tr' ? 'Şu an bakımda — Havale seçiniz' : 'Under maintenance — Choose Wire Transfer',
              },
            ].map(({ key, icon: Icon, label, desc }) => (
              <button
                type="button"
                key={key}
                disabled={key === 'card'}
                onClick={() => setPayment(key)}
                aria-pressed={payment === key}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                  key === 'card' ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/[0.01]' :
                  payment === key
                    ? 'border-[#FF0033] bg-[#FF0033]/15 ring-1 ring-[#FF0033]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <Icon className={`mt-0.5 h-5 w-5 ${payment === key ? 'text-[#FF4D6D]' : 'text-white/40'}`} />
                <span>
                  <span className="block text-sm font-bold text-white">{label}</span>
                  <span className="block text-xs text-white/50">{desc}</span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        {/* Süreç & Ödeme Güvenlik Kutusu */}
        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 text-xs">
          <p className="font-bold text-white mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            {locale === 'tr' ? 'Süreç Nasıl İşler?' : 'How Does the Process Work?'}
          </p>
          <ul className="space-y-1 text-zinc-300">
            {locale === 'tr' ? (
              <>
                <li>• <strong>1. Adım:</strong> Video linkiniz incelenir ve resmi Google Ads onay sürecine iletilir.</li>
                <li>• <strong>2. Adım:</strong> Reklam onayı çıktığında tutarın <strong className="text-emerald-400">%50&apos;si</strong> alınır.</li>
                <li>• <strong>3. Adım:</strong> Kampanya başarıyla tamamlandığında kalan <strong className="text-emerald-400">%50</strong> alınır.</li>
                <li className="text-blue-300 font-semibold">• <strong>Kurumsal Müşteriler:</strong> Ajanslar ve kurumsal müşteriler için tüm ödeme iş bitimindedir.</li>
                <li className="text-amber-300 text-[11px] pt-0.5">* Fiyat videonun uzunluğuna göre değişiklik gösterebilir.</li>
              </>
            ) : (
              <>
                <li>• <strong>Step 1:</strong> Your video link is reviewed and submitted for official Google Ads approval.</li>
                <li>• <strong>Step 2:</strong> When ad approval is granted, <strong className="text-emerald-400">50%</strong> payment is collected.</li>
                <li>• <strong>Step 3:</strong> Remaining <strong className="text-emerald-400">50%</strong> is settled once campaign is 100% complete.</li>
                <li className="text-blue-300 font-semibold">• <strong>Corporate Clients:</strong> Labels and agencies pay 100% upon delivery.</li>
                <li className="text-amber-300 text-[11px] pt-0.5">* Pricing may vary depending on video runtime.</li>
              </>
            )}
          </ul>
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-xs text-white/70">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#FF0033] rounded"
          />
          <span>
            {locale === 'tr'
              ? 'Hizmet şartlarını ve Google Ads video gösterim kurallarını okudum, onaylıyorum.'
              : 'I have read and agree to the Terms of Service and Google Ads video promotion policies.'}
          </span>
        </label>
      </div>

      {/* Right Column: Sticky Summary */}
      <aside className="h-fit rounded-3xl border border-studio bg-studio-card p-6 text-white shadow-2xl lg:sticky lg:top-24 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between border-b border-studio pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white/60">
            {o.summary}
          </h2>
          <Link href={`/${locale}#calculator`} className="text-xs font-semibold text-[#FF6B7A] hover:underline">
            {o.edit}
          </Link>
        </div>

        <dl className="space-y-2.5 text-sm">
          <Row k={c.views} v={nf.format(q.views)} />
          <Row k={c.format} v={c.formats[initial.format]?.name || initial.format} />
          <Row k={c.pkg} v={c.packages[initial.pkg].name} />
          <Row k={c.region} v={c.regions[initial.region]?.name || initial.region} />
          {q.discountRate > 0 && (
            <Row
              k={`${c.discount} (%${Math.round(q.discountRate * 100)})`}
              v={`−${formatMoney(q.discount, q.currency, locale)}`}
              accent
            />
          )}
          <Row k={c.eta} v={`${q.etaDays[0]}–${q.etaDays[1]} ${c.days}`} />
        </dl>

        <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
          <span className="text-sm text-white/60">{c.total}</span>
          <span className="font-[family-name:var(--font-heading)] text-3xl font-extrabold tabular-nums text-white">
            {formatMoney(q.total, q.currency, locale)}
          </span>
        </div>

        {/* Aşamalı Ödeme Ayrıntısı */}
        <div className="mt-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs space-y-1.5">
          <div className="flex justify-between text-zinc-300">
            <span>{locale === 'tr' ? 'Onayda Alınacak (%50):' : 'Due On Approval (50%):'}</span>
            <span className="font-bold text-emerald-400">{formatMoney(Math.round(q.total / 2), q.currency, locale)}</span>
          </div>
          <div className="flex justify-between text-zinc-300">
            <span>{locale === 'tr' ? 'İş Bitiminde Kalan (%50):' : 'Due On Delivery (50%):'}</span>
            <span className="font-bold text-zinc-200">{formatMoney(q.total - Math.round(q.total / 2), q.currency, locale)}</span>
          </div>
          <div className="pt-1.5 border-t border-white/10 text-[11px] text-blue-300 font-medium">
            {locale === 'tr' ? '🏢 Kurumsal müşteriler için tüm ödeme iş bitimindedir.' : '🏢 Record labels & corporate clients pay 100% upon delivery.'}
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-red-500/20 border border-red-500/30 p-3 text-xs text-red-200">{error}</p>}

        <button
          type="submit"
          disabled={!ready || busy}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-6 py-4 font-bold text-white shadow-lg shadow-[#FF0033]/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> {o.submitting}
            </>
          ) : (
            locale === 'tr' ? 'Siparişi Onayla & Takip Kodu Al' : 'Confirm Order & Get Tracking Code'
          )}
        </button>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> {locale === 'tr' ? '%100 Resmi Google Ads Altyapısı' : '100% Official Google Ads Network'}
        </p>
      </aside>
    </form>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${accent ? 'text-emerald-400' : 'text-white/75'}`}>
      <dt>{k}</dt>
      <dd className="text-right font-semibold tabular-nums">{v}</dd>
    </div>
  );
}
