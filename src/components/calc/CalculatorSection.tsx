import Calculator from './Calculator';
import { getAppStrings } from '@/lib/i18n/app-strings';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function CalculatorSection({ locale }: { locale: string }) {
  const t = getAppStrings(locale).calc;
  return (
    <section id="calculator" className="scroll-mt-20 relative overflow-hidden bg-studio-gradient py-20 md:py-28 text-white border-y border-studio">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-[450px] w-[650px] rounded-full bg-[#FF0033]/20 blur-[140px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-[380px] w-[380px] rounded-full bg-zinc-600/15 blur-[130px] animate-float-drift" />

      {/* Moving Floating Badges (Moving Objects) */}
      <div className="pointer-events-none absolute top-16 left-6 lg:left-16 z-20 hidden md:flex items-center gap-2.5 rounded-2xl border border-zinc-700/60 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-float-slow">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <span>FAST & Havale Anında Aktivasyon</span>
      </div>

      <div className="pointer-events-none absolute bottom-16 right-6 lg:right-16 z-20 hidden md:flex items-center gap-2.5 rounded-2xl border border-zinc-700/60 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-float-reverse">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>YouTube Studio Şeffaf Takip</span>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full border border-[#FF0033]/40 bg-[#FF0033]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E]">
            Canlı Fiyat Hesaplayıcı
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-white md:text-5xl">
            {t.title}
          </h2>
          <p className="mt-4 text-sm md:text-base text-slate-300">{t.subtitle}</p>
        </div>
        <Calculator locale={locale} t={t} />
      </div>
    </section>
  );
}
