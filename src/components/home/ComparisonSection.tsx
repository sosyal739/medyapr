'use client';

import {
  Check,
  X,
  ShieldAlert,
  ShieldCheck,
  Bot,
  Globe,
  BarChart3,
  TrendingDown,
  Lock,
  Flame,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface ComparisonSectionProps {
  locale: string;
}

export default function ComparisonSection({ locale }: ComparisonSectionProps) {
  const isTr = locale === 'tr';

  const rows = [
    {
      icon: Bot,
      feature: isTr ? 'Görüntüleme Teknolojisi' : 'Viewing Technology',
      subtitle: isTr ? 'İzlenme altyapısı ve doğrulama' : 'Traffic delivery infrastructure',
      bot: isTr
        ? 'SMM panelleri, emülatörler ve sahte veri merkezi botları kullanılır.'
        : 'SMM panels, emulators, and fake datacenter bots used.',
      botBadge: isTr ? 'Sahte Trafik' : 'Fake Bots',
      ads: isTr
        ? 'ASLA KULLANILMAZ. %100 Resmi Google Ads video gösterimi yapılır.'
        : 'NEVER USED. 100% Official Google Ads video campaigns.',
      adsBadge: isTr ? 'Sıfır Bot Garantisi' : 'Zero Bot Guarantee',
      highlight: true,
    },
    {
      icon: Globe,
      feature: isTr ? 'Trafik & İzleyici Kaynağı' : 'Audience & Traffic Source',
      subtitle: isTr ? 'Hedefleme ve demografi' : 'Targeting & demographics',
      bot: isTr
        ? 'Rastgele bot ağları ve proxy sunucuları; izleyen gerçek insan yoktur.'
        : 'Datacenter proxy networks and emulator pools with zero real viewers.',
      botBadge: isTr ? 'Hedefsiz Veri' : 'Untargeted',
      ads: isTr
        ? 'Müzik türü, ilgi alanı, dil ve konuma göre hedeflenen gerçek dinleyiciler.'
        : 'Real listeners targeted by music genre, interest, language, and location.',
      adsBadge: isTr ? 'Gerçek Hedef Kitle' : 'Targeted Audience',
      highlight: false,
    },
    {
      icon: BarChart3,
      feature: isTr ? 'YouTube Studio Doğrulaması' : 'YouTube Studio Verification',
      subtitle: isTr ? 'Analitik trafik kaynağı kaydı' : 'Analytics traffic source origin',
      bot: isTr
        ? 'Görünmez veya algoritmada şüpheli "Bilinmeyen / Doğrudan" olarak işaretlenir.'
        : 'Missing or flagged as suspicious "Direct / Unknown" traffic.',
      botBadge: isTr ? 'Spam Şüphesi' : 'Flagged Spam',
      ads: isTr
        ? 'Resmi YouTube Studio\'da doğrudan "YouTube Reklamları" sekmesinde tescillenir.'
        : 'Directly logged under "YouTube Advertising" in official YouTube Studio.',
      adsBadge: isTr ? 'Resmi Studio Kaydı' : 'Official Studio Log',
      highlight: true,
    },
    {
      icon: TrendingDown,
      feature: isTr ? 'İzlenme Silinme / Düşme Riski' : 'View Drop & Deletion Risk',
      subtitle: isTr ? 'Kalıcılık ve garanti süresi' : 'Permanence & lifetime guarantee',
      bot: isTr
        ? 'Aşırı yüksek risk. YouTube periyodik bot temizliği yaptığında tamamı silinir.'
        : 'Extreme risk. YouTube routinely wipes out bot and emulator views.',
      botBadge: isTr ? 'Geri Düşer' : 'Views Dropped',
      ads: isTr
        ? 'SIFIR RİSK. Google Ads resmi reklam gösterimidir, ömür boyu kalıcıdır.'
        : 'ZERO RISK. Official Google ad views are permanent for a lifetime.',
      adsBadge: isTr ? 'Ömür Boyu Kalıcı' : 'Lifetime Permanent',
      highlight: false,
    },
    {
      icon: Lock,
      feature: isTr ? 'Kanal Güvenliği & Para Kazanma' : 'Channel Safety & YPP',
      subtitle: isTr ? 'Monetizasyon ve ceza durumu' : 'Monetization & penalty safety',
      bot: isTr
        ? 'Algoritma shadowban uygular, önerilenlerden düşürür veya kanalı kapatır.'
        : 'Carries shadowban, view freezing, or permanent channel termination.',
      botBadge: isTr ? 'Shadowban Riski' : 'Shadowban Risk',
      ads: isTr
        ? 'Tamamen güvenli. YouTube Partner Programı (YPP) ve Topluluk Kuralları ile %100 uyumlu.'
        : '100% compliant with YouTube Partner Program & Community Guidelines.',
      adsBadge: isTr ? '%100 YPP Uyumlu' : '100% Compliant',
      highlight: false,
    },
    {
      icon: Flame,
      feature: isTr ? 'Organik Etkileşim & Fırsatlar' : 'Organic Engagement & Spillover',
      subtitle: isTr ? 'Beğeni, yorum ve abone kazanımı' : 'Likes, comments & subscribers',
      bot: isTr
        ? 'Sıfır değer; botlar şarkıyı dinlemez, yorum yapmaz, konserine gelmez.'
        : 'Zero real value; bots cannot like, comment, or become genuine fans.',
      botBadge: isTr ? 'Sıfır Etkileşim' : 'Zero Fans',
      ads: isTr
        ? 'Gerçek dinleyicilerden doğal beğeni, samimi yorumlar ve kalıcı kanal aboneliği.'
        : 'Real listeners interact with likes, authentic comments, and subscriptions.',
      adsBadge: isTr ? 'Doğal Abone & Yorum' : 'Real Fans & Comments',
      highlight: true,
    },
    {
      icon: FileText,
      feature: isTr ? 'Performans Raporlama' : 'Performance Reporting',
      subtitle: isTr ? 'Kampanya sonu şeffaf veri' : 'Post-campaign transparency',
      bot: isTr
        ? 'Raporlama yoktur veya sahte panel ekran görüntüleri iletilir.'
        : 'None or manipulated third-party panel screenshots.',
      botBadge: isTr ? 'Şeffaf Değil' : 'Opaque',
      ads: isTr
        ? 'Kampanya tamamlandığında ayrıntılı resmi Google Ads analitik raporu paylaşılır.'
        : 'Comprehensive official Google Ads performance analytics report delivered.',
      adsBadge: isTr ? 'Şeffaf PDF Raporu' : 'Verified PDF Report',
      highlight: false,
    },
  ];

  return (
    <section
      id="why-google-ads"
      className="relative overflow-hidden bg-studio-gradient py-24 text-white border-y border-studio"
    >
      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-emerald-500/15 blur-[140px] animate-pulse-glow" />
      <div className="pointer-events-none absolute top-12 left-10 h-80 w-80 rounded-full bg-[#FF0033]/15 blur-[120px] animate-float-drift" />

      {/* Floating Badges */}
      <div className="pointer-events-none absolute top-14 left-6 lg:left-16 z-20 hidden md:flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-rose-300 shadow-2xl backdrop-blur-xl animate-float-slow">
        <ShieldAlert className="h-4 w-4 text-rose-400" />
        <span>
          {isTr
            ? 'Bot Uyarısı: Sahte Paneller Videoyu Çöpe Atar'
            : 'Bot Warning: SMM Panels Damage Channel Authority'}
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-14 right-6 lg:right-16 z-20 hidden md:flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-emerald-300 shadow-2xl backdrop-blur-xl animate-float-reverse">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>
          {isTr
            ? 'Google Ads: %100 YPP & Monetizasyon Uyumlu'
            : 'Google Ads: 100% YPP & Monetization Compliant'}
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>
              {isTr ? 'Şeffaf & Yasal Karşılaştırma' : 'Transparent Comparison'}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            {isTr ? 'Google Ads ile Gerçek Reklam vs' : 'Google Ads Official vs'}{' '}
            <span className="text-rose-400 line-through decoration-[#FF0033] decoration-2">
              {isTr ? 'SMM Bot Panelleri' : 'SMM Bot Panels'}
            </span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
            {isTr
              ? 'Sanatçılar ve video sahipleri neden bot izlenmelerden uzak durmalı? İşte kanalınızın geleceğini belirleyen somut farklar:'
              : 'Why music artists and creators avoid fake panels. The concrete differences that safeguard your channel:'}
          </p>
        </div>

        {/* Princeton GEO Quick Fact Box */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900/90 to-zinc-950 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  {isTr
                    ? 'Temel Kural & Doğrulanmış Veri (AEO Quick Fact)'
                    : 'Core Principle & Verified Fact (AEO)'}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                  Google Partner
                </span>
              </div>
              <blockquote className="text-xs sm:text-sm md:text-base font-medium leading-relaxed text-zinc-200">
                {isTr
                  ? 'YouTube algoritması, yüklenen videoların izlenmelerini yalnızca adet olarak değil; izleme süresi (Watch Time), kitle tutunma oranı (Retention) ve trafik kaynağı orijinine göre değerlendirir. MedyaPR tarafından yönetilen resmi Google Ads gösterimleri YouTube Studio analitiklerinde doğrudan "YouTube Reklamları" sekmesinde tescillenir, kanal monetizasyonunu %100 korur ve sıfır shadowban riskiyle organik önerilenler algoritmasını pozitif tetikler.'
                  : 'The YouTube algorithm evaluates view quality based on retention, watch time, and authentic traffic source. MedyaPR official Google Ads campaigns are logged under "YouTube Advertising" in YouTube Studio, preserving 100% channel monetization with zero shadowban risk while positively triggering organic recommendations.'}
              </blockquote>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Hint */}
        <div className="mb-3 flex items-center justify-between text-xs text-zinc-400 md:hidden px-2">
          <span>← Tabloyu yana kaydırarak karşılaştırın →</span>
          <span className="text-emerald-400 font-semibold">2 Kolon</span>
        </div>

        {/* Premium Elevated Comparison Matrix Table */}
        <div className="relative overflow-x-auto rounded-3xl border border-white/10 bg-[#12141A]/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <caption className="sr-only">
              {isTr
                ? 'Google Ads ve SMM Bot Panelleri Karşılaştırma Tablosu'
                : 'Official Google Ads vs SMM Bot Panels Comparison Matrix'}
            </caption>

            {/* Table Header with Distinct Elevated Columns */}
            <thead>
              <tr className="border-b border-white/10 bg-zinc-950/80">
                {/* Column 1: Criteria */}
                <th
                  scope="col"
                  className="p-6 text-xs font-bold uppercase tracking-wider text-zinc-400 w-[28%]"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-zinc-400" />
                    <span>{isTr ? 'Değerlendirme Kriteri' : 'Criteria'}</span>
                  </div>
                </th>

                {/* Column 2: Bot / SMM (Danger Zone) */}
                <th
                  scope="col"
                  className="p-6 w-[36%] bg-gradient-to-b from-rose-500/[0.08] to-transparent border-l border-white/5"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-3 py-1 text-[11px] font-bold text-rose-300 w-fit">
                      <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                      <span>{isTr ? 'YÜKSEK RİSK & GEÇİCİ' : 'HIGH RISK & FAKE'}</span>
                    </div>
                    <span className="text-base font-bold text-rose-300">
                      {isTr ? 'SMM / Bot Panelleri' : 'SMM Bot Panels'}
                    </span>
                    <span className="text-xs text-rose-400/70 font-normal">
                      {isTr
                        ? 'Sahte sunucu botları & emülatörler'
                        : 'Datacenter bots & scripts'}
                    </span>
                  </div>
                </th>

                {/* Column 3: MedyaPR (Winner Crown Column) */}
                <th
                  scope="col"
                  className="p-6 w-[36%] bg-gradient-to-b from-emerald-500/15 via-emerald-950/25 to-transparent border-l-2 border-emerald-500/40 relative"
                >
                  {/* Subtle Top Glow Pill */}
                  <div className="flex flex-col gap-1.5">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/25 border border-emerald-400/50 px-3 py-1 text-[11px] font-bold text-emerald-300 w-fit shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>
                        {isTr
                          ? '👑 %100 GÜVENLİ & ÖNERİLEN'
                          : '👑 100% SAFE & RECOMMENDED'}
                      </span>
                    </div>
                    <span className="text-base font-bold text-emerald-300">
                      {isTr ? 'MedyaPR (Resmi Google Ads)' : 'MedyaPR (Official Ads)'}
                    </span>
                    <span className="text-xs text-emerald-400/70 font-normal">
                      {isTr
                        ? '18+ Yıllık Resmi Google Partner'
                        : 'Certified Google Partner Team'}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body with Rich Tactile Rows */}
            <tbody className="divide-y divide-white/5 text-sm">
              {rows.map((row, idx) => {
                const IconComponent = row.icon;
                return (
                  <tr
                    key={idx}
                    className="group transition-colors duration-200 hover:bg-white/[0.035]"
                  >
                    {/* Criteria Cell */}
                    <th
                      scope="row"
                      className="p-5 sm:p-6 align-top font-normal text-left"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-300 group-hover:border-[#FF0033]/40 group-hover:text-white group-hover:bg-[#FF0033]/10 transition shadow-inner">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm leading-snug">
                            {row.feature}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                            {row.subtitle}
                          </div>
                        </div>
                      </div>
                    </th>

                    {/* SMM / Bot Cell (Negative) */}
                    <td className="p-5 sm:p-6 align-top border-l border-white/5 bg-rose-950/[0.04]">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 mt-0.5">
                          <X className="h-3.5 w-3.5" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-xs sm:text-sm leading-relaxed text-rose-200/80">
                            {row.bot}
                          </p>
                          <span className="inline-block text-[11px] font-semibold text-rose-400 bg-rose-950/40 border border-rose-500/20 px-2 py-0.5 rounded-full">
                            {row.botBadge}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* MedyaPR Cell (Positive Winner Cell) */}
                    <td className="p-5 sm:p-6 align-top border-l-2 border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 to-transparent">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 mt-0.5 shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-xs sm:text-sm font-semibold leading-relaxed text-emerald-200">
                            {row.ads}
                          </p>
                          <span className="inline-block text-[11px] font-bold text-emerald-300 bg-emerald-900/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
                            ✓ {row.adsBadge}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table Bottom Verdict & Quick CTA Bar */}
          <div className="border-t border-white/10 bg-zinc-950/90 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                ✓
              </span>
              <span>
                {isTr
                  ? 'Kanalınızı riske atmayın: MedyaPR ile tüm izlenmeler ömür boyu kalıcıdır ve YouTube Studio\'da resmi Google Ads gösterimi olarak tescillenir.'
                  : 'Zero risk for your channel: With MedyaPR, all views are permanent for a lifetime and registered as official YouTube Ads in Studio.'}
              </span>
            </div>

            <Link
              href={`/${locale}#calc`}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_20px_rgba(255,0,51,0.35)] hover:brightness-110 transition active:scale-95"
            >
              <span>{isTr ? 'Bütçeni Hesapla & Başla' : 'Calculate & Launch'}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
