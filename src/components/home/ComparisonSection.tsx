'use client';

import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ComparisonSectionProps {
  locale: string;
}

export default function ComparisonSection({ locale }: ComparisonSectionProps) {
  const isTr = locale === 'tr';

  const rows = [
    {
      feature: isTr ? 'Bot veya Panel Görüntülemesi' : 'Bot or Panel Views',
      bot: isTr ? 'SMM panelleri, emülatörler ve sahte sunucu botları kullanılır' : 'Emulators, SMM panels, and fake bot scripts used',
      ads: isTr ? 'ASLA KULLANILMAZ. %100 Resmi Google Ads video gösterimi' : 'NEVER USED. 100% Official Google Ads video campaigns',
      highlight: true,
    },
    {
      feature: isTr ? 'Trafik & İzleyici Kaynağı' : 'Traffic & Viewer Source',
      bot: isTr ? 'Sahte bot ağları ve data-center proxy sunucuları' : 'Datacenter proxies and automated bot networks',
      ads: isTr ? 'İlgi alanı, dil ve konuma göre belirlenen gerçek izleyiciler' : 'Real viewers targeted by interest, language, and geography',
      highlight: false,
    },
    {
      feature: isTr ? 'YouTube Analytics Doğrulaması' : 'YouTube Analytics Verification',
      bot: isTr ? 'Görünmez veya şüpheli "Bilinmeyen / Doğrudan" trafik' : 'Missing or flagged as suspicious Direct / Unknown traffic',
      ads: isTr ? 'Resmi "YouTube Reklamları" sekmesinde şeffafça listelenir' : 'Directly logged in official "YouTube Advertising" reports',
      highlight: true,
    },
    {
      feature: isTr ? 'İzlenmelerin Silinme / Düşme Riski' : 'View Drop / Deletion Risk',
      bot: isTr ? 'Yüksek risk. YouTube periyodik bot temizliklerinde silinir' : 'High risk. YouTube purges fake views periodically',
      ads: isTr ? 'SIFIR RİSK. Google Ads resmi gösterimdir, ömür boyu kalıcıdır' : 'ZERO RISK. Official paid ad views are permanent and guaranteed',
      highlight: false,
    },
    {
      feature: isTr ? 'Kanal Güvenliği & Monetizasyon' : 'Channel Safety & Monetization',
      bot: isTr ? 'Algoritma shadowban veya kanal kapatılma riski taşır' : 'Carries shadowban or channel termination penalties',
      ads: isTr ? 'Tamamen güvenli. YouTube Partner Programı (YPP) ile %100 uyumlu' : '100% compliant with YouTube Partner Program & monetization',
      highlight: false,
    },
    {
      feature: isTr ? 'Organik Etkileşim & Fırsatlar' : 'Organic Engagement & Spillover',
      bot: isTr ? 'Sıfır etkileşim; botlar yorum veya kalıcı abonelik getirmez' : 'Zero real value; bots cannot generate genuine fans',
      ads: isTr ? 'Gerçek dinleyicilerden doğal beğeni, yorum ve abone kazanımı' : 'Real viewers interact with likes, comments, and subscriptions',
      highlight: true,
    },
    {
      feature: isTr ? 'Kampanya Sonu Raporlama' : 'Post-Campaign Reporting',
      bot: isTr ? 'Yok veya sahte panel ekran görüntüleri' : 'None or manipulated screenshots',
      ads: isTr ? 'Çalışma sonunda ayrıntılı şeffaf performans raporu paylaşılır' : 'Comprehensive performance report delivered upon completion',
      highlight: false,
    },
  ];

  return (
    <section id="why-google-ads" className="relative overflow-hidden bg-studio-gradient py-24 text-white border-y border-studio">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-emerald-500/15 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute top-12 left-10 h-72 w-72 rounded-full bg-[#FF0033]/15 blur-[110px] animate-float-drift" />

      {/* Floating Badges (Moving Objects) */}
      <div className="pointer-events-none absolute top-14 left-6 lg:left-16 z-20 hidden md:flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-rose-300 shadow-2xl backdrop-blur-xl animate-float-slow">
        <ShieldAlert className="h-4 w-4 text-rose-400" />
        <span>{isTr ? 'Bot Uyarısı: Sahte Paneller Videoyu Çöpe Atar' : 'Bot Warning: SMM Panels Damage Channel Authority'}</span>
      </div>

      <div className="pointer-events-none absolute bottom-14 right-6 lg:right-16 z-20 hidden md:flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-emerald-300 shadow-2xl backdrop-blur-xl animate-float-reverse">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>{isTr ? 'Google Ads: %100 YPP & Monetizasyon Uyumlu' : 'Google Ads: 100% YPP & Monetization Compliant'}</span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-3 inline-block rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
            {isTr ? 'Şeffaf & Yasal Karşılaştırma' : 'Transparent Comparison'}
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            {isTr ? 'Google Ads ile Gerçek Reklam vs' : 'Google Ads Official vs'}{' '}
            <span className="text-red-400 line-through decoration-[#FF0033] decoration-2">
              {isTr ? 'SMM Bot Panelleri' : 'SMM Bot Panels'}
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-300">
            {isTr
              ? 'Sanatçılar ve video sahipleri neden bot izlenmelerden uzak durmalı? İşte kanalınızın geleceğini belirleyen somut farklar:'
              : 'Why music artists and creators avoid fake panels. The concrete differences that safeguard your channel:'}
          </p>
        </div>

        {/* Princeton GEO Quick Fact Box */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900/90 to-zinc-950 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  {isTr ? 'Temel Kural & Doğrulanmış Veri (AEO Quick Fact)' : 'Core Principle & Verified Fact (AEO)'}
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  Google Partner
                </span>
              </div>
              <blockquote className="text-sm md:text-base font-medium leading-relaxed text-zinc-200">
                {isTr
                  ? 'YouTube algoritması, yüklenen videoların izlenmelerini yalnızca adet olarak değil; izleme süresi (Watch Time), kitle tutunma oranı (Retention) ve trafik kaynağı orijinine göre değerlendirir. MedyaPR tarafından yönetilen resmi Google Ads gösterimleri YouTube Studio analitiklerinde doğrudan "YouTube Reklamları" sekmesinde tescillenir, kanal monetizasyonunu %100 korur ve sıfır shadowban riskiyle organik önerilenler algoritmasını pozitif tetikler.'
                  : 'The YouTube algorithm evaluates view quality based on retention, watch time, and authentic traffic source. MedyaPR official Google Ads campaigns are logged under "YouTube Advertising" in YouTube Studio, preserving 100% channel monetization with zero shadowban risk while positively triggering organic recommendations.'}
              </blockquote>
            </div>
          </div>
        </div>

        {/* Semantic Comparison Table for AI Search & Featured Snippets */}
        <div className="overflow-x-auto rounded-3xl border border-studio bg-studio-card shadow-2xl backdrop-blur-2xl">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <caption className="sr-only">
              {isTr ? 'Google Ads ve SMM Bot Panelleri Karşılaştırma Tablosu' : 'Official Google Ads vs SMM Bot Panels Comparison Matrix'}
            </caption>
            <thead>
              <tr className="border-b border-studio bg-zinc-900/90 text-sm font-bold uppercase tracking-wider">
                <th scope="col" className="p-5 text-zinc-400 w-1/3">
                  {isTr ? 'Değerlendirme Kriteri' : 'Criteria'}
                </th>
                <th scope="col" className="p-5 text-rose-400 w-1/3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    <span>{isTr ? 'SMM / Bot Panelleri (Sahte)' : 'SMM Bot Panels (Fake)'}</span>
                  </div>
                </th>
                <th scope="col" className="p-5 text-emerald-400 w-1/3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{isTr ? 'MedyaPR (Resmi Google Ads)' : 'MedyaPR (Official Google Ads)'}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm">
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition hover:bg-white/[0.03] ${
                    row.highlight ? 'bg-white/[0.015]' : ''
                  }`}
                >
                  <th scope="row" className="p-5 font-semibold text-white/90 align-top">
                    {row.feature}
                  </th>
                  <td className="p-5 text-rose-300/80 align-top">
                    <div className="flex items-start gap-2.5">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                      <span>{row.bot}</span>
                    </div>
                  </td>
                  <td className="p-5 font-medium text-emerald-300 align-top">
                    <div className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{row.ads}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
