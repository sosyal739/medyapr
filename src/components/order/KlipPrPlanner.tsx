'use client';

import { useState } from 'react';
import {
  Music,
  Globe,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Send,
  Mail,
  ShieldCheck,
  Sliders,
  Video,
} from 'lucide-react';
import { WHATSAPP_NUMBER, TELEGRAM_URL } from '@/lib/contact';

interface KlipPrPlannerProps {
  locale: string;
}

const GENRES = [
  { id: 'pop', tr: 'Türkçe Pop & Dans', en: 'Pop & Dance' },
  { id: 'rap', tr: 'Hip-Hop / Rap / Trap', en: 'Hip-Hop / Rap / Trap' },
  { id: 'rock', tr: 'Rock & Alternatif', en: 'Rock & Alternative' },
  { id: 'indie', tr: 'Akustik & Indie', en: 'Acoustic & Indie' },
  { id: 'arabesk', tr: 'Arabesk / Halk / Fantezi', en: 'Traditional & Vocal' },
  { id: 'edm', tr: 'Elektronik / EDM / Club', en: 'Electronic / EDM' },
];

const REGIONS = [
  {
    id: 'tr',
    tr: 'Türkiye Geneli (Büyükşehir & Genç Dinleyici)',
    en: 'Turkey Nationwide (Core Music Audience)',
  },
  {
    id: 'eu',
    tr: 'Türkiye + Avrupa (Almanya, Hollanda, Avusturya, İngiltere)',
    en: 'Turkey + Europe (Germany, NL, UK, AT)',
  },
  {
    id: 'global',
    tr: 'Küresel Karma Dinleyici Erişimi (Global Reach)',
    en: 'Global Multi-Region Music Audience',
  },
];

const BUDGET_TIERS = [
  {
    id: 'starter',
    trTitle: 'Başlangıç Single Lansmanı',
    enTitle: 'Starter Single Launch',
    budgetTr: '1.500 TL – 4.000 TL Medya Bütçesi',
    budgetEn: '$50 – $150 Media Budget',
    reachTr: 'Yeni çıkan single ve akustik çalışmalar için ilk 48 saat hedef kitle tohumlama ve dinleyici keşif planı.',
    reachEn: 'First 48-hour audience seeding and discovery media plan for new singles.',
  },
  {
    id: 'pro',
    trTitle: 'Profesyonel Klip PR & Medya Planı',
    enTitle: 'Professional Video PR & Media Plan',
    budgetTr: '5.000 TL – 15.000 TL Medya Bütçesi',
    budgetEn: '$175 – $500 Media Budget',
    reachTr: 'Müzik türü, benzer sanatçı kitlesi ve yaş kırılımlı kapsamlı video reklam ve dijital PR yönetimi.',
    reachEn: 'Comprehensive genre, age, and affinity-targeted video ad & PR management.',
    popular: true,
  },
  {
    id: 'label',
    trTitle: 'Yapım Şirketi & Majör Lansman',
    enTitle: 'Record Label & Major Release',
    budgetTr: '20.000 TL+ Kurumsal Medya Bütçesi',
    budgetEn: '$700+ Custom Label Budget',
    reachTr: ' Çok ülkeli yayın, In-Stream + Shorts + Keşfet tam huni medya planlaması ve özel kurumsal raporlama.',
    reachEn: 'Multi-country full-funnel video campaign management with dedicated executive reporting.',
  },
];

export default function KlipPrPlanner({ locale }: KlipPrPlannerProps) {
  const isTr = locale === 'tr';
  const [videoUrl, setVideoUrl] = useState('');
  const [artistOrSong, setArtistOrSong] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(GENRES[1].id);
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0].id);
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_TIERS[1].id);
  const [isPreRelease, setIsPreRelease] = useState(false);

  const genreObj = GENRES.find((g) => g.id === selectedGenre) || GENRES[0];
  const regionObj = REGIONS.find((r) => r.id === selectedRegion) || REGIONS[0];
  const budgetObj = BUDGET_TIERS.find((b) => b.id === selectedBudget) || BUDGET_TIERS[1];

  const buildBriefMessage = () => {
    const linkInfo = isPreRelease
      ? isTr
        ? 'Klip henüz yayınlanmadı (Ön lansman planlaması)'
        : 'Unreleased video (Pre-release planning)'
      : videoUrl.trim() || (isTr ? 'Görüşmede paylaşılacak' : 'Will share in chat');

    if (isTr) {
      return [
        'Merhaba MedyaPR Ekibi, müzik klibimiz için dijital PR ve medya planlama analizi rica ediyorum:',
        '',
        `- Sanatçı / Şarkı: ${artistOrSong.trim() || 'Belirtilmedi'}`,
        `- Klip Bağlantısı: ${linkInfo}`,
        `- Müzik Türü: ${genreObj.tr}`,
        `- Hedef Bölge: ${regionObj.tr}`,
        `- Planlanan Bütçe Kademesi: ${budgetObj.trTitle} (${budgetObj.budgetTr})`,
        '',
        'Klibimize uygun hedef kitle planı ve süreç hakkında bilgi alabilir miyim?',
      ].join('\n');
    }

    return [
      'Hello MedyaPR Team, I would like to request a digital PR and media planning audit for our music video:',
      '',
      `- Artist / Track: ${artistOrSong.trim() || 'Not specified'}`,
      `- Video Link: ${linkInfo}`,
      `- Genre: ${genreObj.en}`,
      `- Target Region: ${regionObj.en}`,
      `- Budget Tier: ${budgetObj.enTitle} (${budgetObj.budgetEn})`,
      '',
      'Could you share a tailored audience targeting plan and next steps?',
    ].join('\n');
  };

  const encodedBrief = encodeURIComponent(buildBriefMessage());
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedBrief}`;
  const tgHref = `${TELEGRAM_URL}?text=${encodedBrief}`;
  const mailSubject = encodeURIComponent(
    isTr
      ? `Müzik Klibi PR & Medya Planlama Talebi - ${artistOrSong.trim() || 'Yeni Lansman'}`
      : `Music Video PR & Media Plan Request - ${artistOrSong.trim() || 'New Release'}`
  );
  const mailHref = `mailto:info@medyapr.com?subject=${mailSubject}&body=${encodedBrief}`;

  return (
    <div
      id="lansman-planlayici"
      className="rounded-3xl border border-[#FF0033]/40 bg-zinc-900/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/20 border border-[#FF0033]/40 px-3 py-1 text-xs font-extrabold text-[#FF6B6B] mb-2">
            <Sliders className="h-3.5 w-3.5" />
            {isTr ? 'Ücretsiz Sanatçı & Klip Ön Analiz Formu' : 'Free Artist & Video Pre-Audit Brief'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isTr ? 'Klip Lansman & Medya Planınızı Oluşturun' : 'Build Your Music Video Launch Brief'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1">
            {isTr
              ? 'Şifre veya kanal yetkisi gerekmez. Şarkınızın tarzını ve hedef kitlenizi seçin, uzman ekibimiz klibinizi inceleyip medya planınızı hazırlasın.'
              : 'No password or channel access required. Select your genre and target region to receive a custom media plan.'}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300 font-bold flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{isTr ? 'Önce Analiz • Sonra Teklif' : 'Review First • Then Quote'}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Artist & Video Link */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-300">
              {isTr ? '1. Sanatçı / Şarkı Adı ve Klip Bağlantısı' : '1. Artist / Track Name & Video URL'}
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={artistOrSong}
                onChange={(e) => setArtistOrSong(e.target.value)}
                placeholder={isTr ? 'Örn: Sanatçı - Şarkı Adı' : 'e.g. Artist - Track Title'}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#FF0033] focus:outline-none"
              />
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={isPreRelease}
                placeholder={isTr ? 'Video Linki (varsa)' : 'Video Link (optional)'}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#FF0033] focus:outline-none disabled:opacity-50"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPreRelease}
                onChange={(e) => setIsPreRelease(e.target.checked)}
                className="rounded border-zinc-600 bg-zinc-800 text-[#FF0033] focus:ring-[#FF0033]"
              />
              <span>
                {isTr
                  ? 'Klibim henüz yayınlanmadı, çıkış tarihine özel ön lansman planı istiyorum'
                  : 'My video is not out yet; I want a pre-release launch plan'}
              </span>
            </label>
          </div>

          {/* Step 2: Music Genre */}
          <div className="space-y-3 rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
            <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-zinc-300">
              <Music className="h-4 w-4 text-[#FF0033]" />
              {isTr ? '2. Şarkınızın Müzik Türü (Kitle Eşleşmesi)' : '2. Music Genre (Audience Affinity)'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {GENRES.map((g) => {
                const active = selectedGenre === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGenre(g.id)}
                    className={`rounded-xl border px-3.5 py-2.5 text-left text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'border-[#FF0033] bg-[#FF0033]/20 text-white shadow-md shadow-[#FF0033]/20'
                        : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    {isTr ? g.tr : g.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Target Geography */}
          <div className="space-y-3 rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
            <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-zinc-300">
              <Globe className="h-4 w-4 text-[#FF0033]" />
              {isTr ? '3. Hedef Dinleyici Bölgesi' : '3. Target Listener Geography'}
            </label>
            <div className="space-y-2">
              {REGIONS.map((r) => {
                const active = selectedRegion === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRegion(r.id)}
                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      active
                        ? 'border-[#FF0033] bg-[#FF0033]/20 text-white'
                        : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-600'
                    }`}
                  >
                    <span>{isTr ? r.tr : r.en}</span>
                    {active && <CheckCircle2 className="h-4 w-4 text-[#FF6B6B] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Campaign Budget Tier */}
          <div className="space-y-3 rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
            <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-zinc-300">
              <Sparkles className="h-4 w-4 text-[#FF0033]" />
              {isTr ? '4. Planlanan Medya & Lansman Bütçesi' : '4. Planned Media & Launch Budget Tier'}
            </label>
            <div className="grid gap-3">
              {BUDGET_TIERS.map((b) => {
                const active = selectedBudget === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBudget(b.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-all cursor-pointer ${
                      active
                        ? 'border-[#FF0033] bg-gradient-to-r from-[#FF0033]/20 to-zinc-900 text-white shadow-lg'
                        : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-extrabold text-white">
                        {isTr ? b.trTitle : b.enTitle}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold text-[#FF6B6B]">
                        {isTr ? b.budgetTr : b.budgetEn}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
                      {isTr ? b.reachTr : b.reachEn}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Summary & Instant Contact Channels */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/15 bg-zinc-950 p-6 shadow-xl">
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0033]/20 text-[#FF6B6B]">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {isTr ? 'Medya Planı Özeti' : 'Media Plan Summary'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {isTr ? '18+ Yıllık MedyaPR Uzman İncelemesi' : '18+ Years MedyaPR Specialist Audit'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between gap-2 border-b border-white/5 pb-2.5">
                <span className="text-zinc-400">{isTr ? 'Sanatçı / Eser:' : 'Artist / Track:'}</span>
                <span className="font-bold text-white text-right">
                  {artistOrSong.trim() || (isTr ? 'Belirtilmedi' : 'Not entered')}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-b border-white/5 pb-2.5">
                <span className="text-zinc-400">{isTr ? 'Müzik Türü:' : 'Music Genre:'}</span>
                <span className="font-bold text-[#FF6B6B] text-right">
                  {isTr ? genreObj.tr : genreObj.en}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-b border-white/5 pb-2.5">
                <span className="text-zinc-400">{isTr ? 'Hedef Bölge:' : 'Target Region:'}</span>
                <span className="font-bold text-white text-right">
                  {isTr ? regionObj.tr : regionObj.en}
                </span>
              </div>
              <div className="flex justify-between gap-2 border-b border-white/5 pb-2.5">
                <span className="text-zinc-400">{isTr ? 'Bütçe Planı:' : 'Budget Tier:'}</span>
                <span className="font-bold text-emerald-400 text-right">
                  {isTr ? budgetObj.budgetTr : budgetObj.budgetEn}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2 text-xs text-zinc-300">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{isTr ? 'Resmi Medya Planlama Güvencesi' : 'Official Media Planning Guarantee'}</span>
              </div>
              <p className="leading-relaxed text-zinc-400">
                {isTr
                  ? 'Klibiniz uzman ekibimizce incelenir, hedef kitle kırılımları hazırlanır. Kampanya reklam onayı aldıktan sonra yayına alınır.'
                  : 'Your video is reviewed by our specialists. The campaign goes live after ad approval.'}
              </p>
            </div>
          </div>

          {/* 3 Direct Submission Channels */}
          <div className="mt-6 space-y-3 pt-4 border-t border-white/10">
            <p className="text-xs font-bold uppercase tracking-wider text-center text-zinc-400">
              {isTr
                ? 'Tercih Ettiğiniz Kanaldan Analiz Talebini Gönderin'
                : 'Send Your Brief via Your Preferred Channel'}
            </p>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.01]"
            >
              <MessageCircle className="h-5 w-5 fill-white" />
              <span>{isTr ? 'WhatsApp ile Lansman Analizi İste' : 'Request Audit via WhatsApp'}</span>
            </a>

            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={tgHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-3 text-xs font-extrabold text-white shadow-md transition-all"
              >
                <Send className="h-4 w-4" />
                <span>{isTr ? 'Telegram ile Gönder' : 'Send via Telegram'}</span>
              </a>

              <a
                href={mailHref}
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-4 py-3 text-xs font-extrabold text-white transition-all"
              >
                <Mail className="h-4 w-4 text-[#FF6B6B]" />
                <span>{isTr ? 'E-Posta ile İste' : 'Request via Email'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
