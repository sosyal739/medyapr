import type { Metadata } from 'next';
import Link from 'next/link';
import TrackView from '@/components/track/TrackView';
import { getAppStrings } from '@/lib/i18n/app-strings';
import { getOrder, publicView } from '@/lib/store';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  return {
    title: { absolute: locale === 'tr' ? `Sipariş Takibi (${id.toUpperCase()}) | MedyaPR` : `Order Tracking (${id.toUpperCase()}) | MedyaPR` },
    robots: { index: false, follow: false },
  };
}
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ new?: string }>;
};

export default async function TrackPage({ params, searchParams }: Props) {
  const { locale, id } = await params;
  const { new: isNew } = await searchParams;
  const t = getAppStrings(locale);
  const order = await getOrder(id.toUpperCase());

  return (
    <section className="min-h-[85vh] bg-studio-gradient py-14 md:py-20 text-white relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="mb-8">
          <span className="mb-2 inline-block rounded-full border border-zinc-700/60 bg-zinc-800/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-zinc-300">
            {locale === 'tr' ? 'Canlı Takip Paneli' : 'Live Tracking Panel'}
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-white md:text-4xl">
            {t.track.title}
          </h1>
        </div>

        {order ? (
          <TrackView initial={JSON.parse(JSON.stringify(publicView(order)))} locale={locale} t={t} isNew={isNew === '1'} />
        ) : (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300">
            <p className="text-base font-bold">{t.track.notFound}</p>
            <p className="text-xs text-white/50 mt-1">
              {locale === 'tr'
                ? 'Lütfen takip kodunuzu doğru girdiğinizden emin olun.'
                : 'Please verify that your order tracking code was entered correctly.'}
            </p>
            <Link
              href={`/${locale}/track`}
              className="mt-4 inline-block rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              {t.track.lookupBtn}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
