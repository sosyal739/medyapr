import type { Metadata } from 'next';
import OrderForm from '@/components/order/OrderForm';
import { getAppStrings } from '@/lib/i18n/app-strings';
import { CURRENCIES, FORMATS, PACKAGES, REGIONS, clampViews, type Currency, type Format, type Package, type Region } from '@/lib/pricing';

export const metadata: Metadata = { title: 'Sipariş Oluştur | MedyaPR', robots: { index: false } };

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function OrderPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = getAppStrings(locale);
  const pick = <T extends string>(list: readonly T[], v: string | undefined, d: T): T => (list.includes(v as T) ? (v as T) : d);

  return (
    <section className="min-h-[85vh] bg-studio-gradient py-14 md:py-20 text-white relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="mb-8">
          <span className="mb-2 inline-block rounded-full border border-zinc-700/60 bg-zinc-800/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FF5E7E]">
            Güvenli Sipariş
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-white md:text-4xl">
            {t.order.title}
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/60">{t.order.subtitle}</p>
        </div>

        <OrderForm
          locale={locale}
          t={t}
          initial={{
            views: clampViews(Number(sp.views) || 25_000),
            format: pick<Format>(FORMATS, sp.format, 'instream'),
            pkg: pick<Package>(PACKAGES, sp.pkg, 'views'),
            region: pick<Region>(REGIONS, sp.region, 'tr'),
            currency: pick<Currency>(CURRENCIES, sp.currency, locale === 'tr' ? 'TRY' : 'EUR'),
          }}
        />
      </div>
    </section>
  );
}
