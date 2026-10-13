'use client';

import { Play, CreditCard, Sparkles, Building2, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/dictionaries';

interface HowItWorksProps {
  dict: Dictionary;
  locale?: string;
}

export default function HowItWorks({ dict, locale = 'tr' }: HowItWorksProps) {
  const isTr = locale === 'tr';

  const steps = [
    {
      step: '01',
      title: isTr ? 'Teklifinizi & Video Linkinizi İletin' : 'Submit Your Quote & Video Link',
      description: isTr
        ? 'Şifre veya kanal yetkisi gerekmez. Video linkinizi ve hedef izlenmenizi teklif formumuzdan, WhatsApp veya Telegram üzerinden bize iletin.'
        : 'No passwords or channel access required. Share your video link and target views via our quote form, WhatsApp, or Telegram.',
      icon: Play,
    },
    {
      step: '02',
      title: isTr ? 'Analiz Edip Detaylı Dönüş Yapalım' : 'Video Analysis & Detailed Reply',
      description: isTr
        ? '18+ yıllık tecrübeli Google Partner uzmanlarımız videonuzun süresini, içeriğini ve Google Ads uygunluğunu analiz edip size detaylı dönüş yapar. (Fiyatlandırma video uzunluğuna göre değişebilir.)'
        : 'Our certified Google Partner specialists analyze your video duration, content, and Google Ads compliance, then send you a detailed reply. (Pricing may vary based on video length.)',
      icon: Sparkles,
    },
    {
      step: '03',
      title: isTr ? 'Onay Alınca İşlem Başlar' : 'Work Begins Upon Approval',
      description: isTr
        ? 'Detaylar üzerinde mutabık kalınıp videonuz Google Ads reklam onayından geçtiğinde işleminiz başlar. %50 onayda, %50 iş bitiminde güvenli ödeme modeli uygulanır.'
        : 'Once details are confirmed and your video passes Google Ads approval, your campaign begins. Phased payment: 50% on approval, 50% upon completion.',
      icon: CreditCard,
    },
  ];

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-studio-gradient border-y border-studio py-24 text-white">
      {/* Ambient Moving Glow */}
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-[#FF0033]/15 blur-[120px] animate-float-drift" />
      <div className="pointer-events-none absolute top-10 left-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px] animate-glow-soft" />

      {/* Floating Animated Badge (Moving Object) */}
      <div className="pointer-events-none absolute top-12 right-8 lg:right-20 z-20 hidden md:flex items-center gap-2 rounded-2xl border border-zinc-700/60 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-float-reverse">
        <Sparkles className="h-4 w-4 text-[#FF4D6D]" />
        <span>{isTr ? 'Teklifi İlet • Analiz Sonrası Onayda Başlar' : 'Submit Quote • Starts After Analysis & Approval'}</span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
            {isTr ? 'Şeffaf & Güvenli 3 Adım' : '3 Transparent Steps'}
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            {isTr ? 'Süreç' : 'How It'}{' '}
            <span className="bg-gradient-to-r from-[#FF0033] to-[#FF6B6B] bg-clip-text text-transparent">
              {isTr ? 'Nasıl İşler?' : 'Works'}
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-300">
            {isTr
              ? 'Teklifinizi iletin, videonuzu analiz edip WhatsApp veya Telegram üzerinden detaylı dönüş yapalım; onay alınca işlem başlar.'
              : 'Submit your quote, let us analyze your video and reply in detail via WhatsApp or Telegram; work begins upon approval.'}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl border border-studio bg-studio-card p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-studio-strong hover:bg-zinc-800/90 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Step Number */}
                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-white/45 group-hover:text-[#FF0033] transition-colors">
                      {item.step}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-[#FF4D6D] group-hover:scale-110 group-hover:bg-[#D9002B] group-hover:text-white transition-all">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-white group-hover:text-[#FF6B6B] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-zinc-400 group-hover:text-emerald-400 transition-colors">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>
                    {idx === 0
                      ? (isTr ? 'Şifre Gerektirmez' : 'No Password Required')
                      : idx === 1
                      ? (isTr ? 'Resmi Politika Uyumu' : 'Official Policy Compliance')
                      : (isTr ? 'Maksimum Müşteri Güveni' : 'Maximum Buyer Protection')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Önemli Süreç & Ödeme Koşulları (Kurumsal & Video Uzunluğu Vurgusu) ── */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Kurumsal Müşteriler İçin */}
          <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-zinc-900/80 to-zinc-950 p-6 md:p-8 backdrop-blur-xl shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300 border border-blue-500/30 mb-2">
                  {isTr ? 'Ajanslar & Yapım Şirketleri' : 'Agencies & Production Studios'}
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  {isTr ? 'Kurumsal Müşteriler İçin Ödeme İş Bitiminde' : 'For Corporate Clients: Payment Upon Delivery'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  {isTr ? (
                    <>Kurumsal müşteriler, yapım şirketleri ve ajanslar için ödeme <strong className="text-white font-semibold">doğrudan iş bitiminde</strong> alınmaktadır. Kampanya tamamlandığında resmi YouTube Studio &amp; Google Ads performans raporu tarafınıza iletilir ve faturalandırılır.</>
                  ) : (
                    <>For corporate clients, production houses, and record labels, payment is collected <strong className="text-white font-semibold">directly upon campaign delivery</strong>. Official YouTube Studio &amp; Google Ads reports are provided with tax invoicing.</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Video Uzunluğu & Fiyatlandırma */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-zinc-900/80 to-zinc-950 p-6 md:p-8 backdrop-blur-xl shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30 mb-2">
                  {isTr ? 'Şeffaf Fiyatlandırma Notu' : 'Transparent Pricing Policy'}
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  {isTr ? 'Fiyat Videonun Uzunluğuna Göre Değişiklik Gösterebilir' : 'Pricing May Vary Based On Video Duration'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  {isTr ? (
                    <>Web sitemizdeki hesaplayıcı tutarları standart video süreleri baz alınarak hazırlanmıştır. Google reklam maliyetleri gereği <strong className="text-white font-semibold">fiyat, videonun uzunluğuna</strong>, hedefleme derinliğine ve seçilen reklam formatına göre değişiklik gösterebilir.</>
                  ) : (
                    <>Calculator rates reflect standard video runtimes. Due to Google auction dynamics, <strong className="text-white font-semibold">pricing may adjust depending on video length</strong>, target audience depth, and selected ad format.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <a
            href="#calculator"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#D9002B] px-8 py-4 font-extrabold text-white shadow-xl shadow-[#FF0033]/30 hover:bg-[#E6002E] transition-all hover:scale-105"
          >
            {isTr ? 'Hemen Fiyatını Hesapla & Başlat' : 'Calculate Your Price & Start'}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
