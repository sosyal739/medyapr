import type { Metadata } from 'next';
import LookupForm from '@/components/track/LookupForm';
import { getAppStrings } from '@/lib/i18n/app-strings';

export const metadata: Metadata = { title: { absolute: 'Sipariş Sorgula | MedyaPR' }, robots: { index: false } };

export default async function TrackLookupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getAppStrings(locale).track;
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-studio-gradient py-16 md:py-24 text-white relative overflow-hidden">
      <div className="w-full max-w-lg px-4">
        <div className="rounded-3xl border border-studio bg-studio-card p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <span className="mb-2 inline-block rounded-full border border-zinc-700/60 bg-zinc-800/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
            Sipariş Takibi
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-extrabold text-white">
            {t.lookupTitle}
          </h1>
          <p className="mt-2 mb-6 text-sm text-zinc-400">{t.lookupDesc}</p>
          <LookupForm locale={locale} placeholder="AV-XXXXXXXX" cta={t.lookupBtn} />
        </div>
      </div>
    </section>
  );
}
