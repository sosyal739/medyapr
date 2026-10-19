import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { getPageAlternates, SITE_URL } from '@/lib/seo';
import { getLandingPage, getLandingPages, LANDING_PAGES } from '@/data/landing';
import type { LandingPage } from '@/data/landing/types';
import { formatMoney, quote, type Currency } from '@/lib/pricing';
import AnalysisCta from '@/components/common/AnalysisCta';
import type { Locale } from '@/lib/i18n/config';

/** Yalnızca tanımlı ticari sayfalar üretilir; diğer adresler 404 verir. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LANDING_PAGES.map((p) => ({ locale: p.locale, slug: p.slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getLandingPage(locale, slug);
  if (!page) return {};
  return {
    title: { absolute: page.title },
    description: page.description,
    robots: { index: true, follow: true },
    alternates: getPageAlternates(locale, `/${slug}`, [locale as Locale]),
    openGraph: { title: page.title, description: page.description, url: `${SITE_URL}/${locale}/${slug}`, type: 'website' },
  };
}

function PriceTable({ page, locale }: { page: LandingPage; locale: string }) {
  const isTr = locale === 'tr';
  const isAr = locale === 'ar';
  const rows = [1_000, 5_000, 10_000, 50_000, 100_000];
  const cur: Currency = isTr ? 'TRY' : 'USD';
  const money = (n: number) => formatMoney(n, cur, locale);
  type Col = { label: string; total: (v: number) => number };
  let cols: Col[];
  if (page.prices === 'ar') {
    const c = page.priceCountry ?? 'SA';
    cols = [
      { label: 'الدولة المختارة', total: (v) => quote({ views: v, region: 'premium', country: c, currency: cur }).total },
      { label: 'جمهور عالمي', total: (v) => quote({ views: v, region: 'global', currency: cur }).total },
    ];
  } else if (isTr) {
    cols = [
      { label: 'Türkiye', total: (v) => quote({ views: v, region: 'tr', currency: cur }).total },
      { label: 'Global', total: (v) => quote({ views: v, region: 'global', currency: cur }).total },
      { label: 'Avrupa / Kanada', total: (v) => quote({ views: v, region: 'premium', country: 'DE', currency: cur }).total },
      { label: 'ABD', total: (v) => quote({ views: v, region: 'premium', country: 'US', currency: cur }).total },
    ];
  } else {
    cols = [
      { label: 'Global', total: (v) => quote({ views: v, region: 'global', currency: cur }).total },
      { label: 'Turkey', total: (v) => quote({ views: v, region: 'tr', currency: cur }).total },
      { label: 'Europe / Canada', total: (v) => quote({ views: v, region: 'premium', country: 'DE', currency: cur }).total },
      { label: 'USA', total: (v) => quote({ views: v, region: 'premium', country: 'US', currency: cur }).total },
    ];
  }
  const nf = new Intl.NumberFormat(isAr ? 'ar-u-nu-latn' : isTr ? 'tr-TR' : 'en-US');
  return (
    <section className="mt-10">
      <h2 className="text-xl font-extrabold text-white sm:text-2xl">
        {isAr ? 'أسعار تقديرية' : isTr ? 'Tahmini fiyat tablosu' : 'Estimated price table'}
      </h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[420px] text-left text-sm rtl:text-right">
          <thead className="bg-white/[0.05] text-xs uppercase tracking-wider text-zinc-300">
            <tr>
              <th className="px-4 py-3">{isAr ? 'المشاهدات' : isTr ? 'İzlenme' : 'Views'}</th>
              {cols.map((c) => (
                <th key={c.label} className="px-4 py-3">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-zinc-200">
            {rows.map((v) => (
              <tr key={v}>
                <td className="px-4 py-3 font-bold text-white">{nf.format(v)}</td>
                {cols.map((c) => (
                  <td key={c.label} className="px-4 py-3">{money(c.total(v))}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-zinc-400">
        {isAr
          ? '* الأسعار تقديرية وتتغير بحسب مدة الفيديو. يتأكد العرض النهائي بعد المراجعة.'
          : isTr
            ? '* Fiyatlar tahminidir; video uzunluğuna göre değişebilir. Kesin teklif analizden sonra netleşir.'
            : '* Prices are estimates and may vary with video length. The final quote is confirmed after review.'}
      </p>
    </section>
  );
}

export default async function LandingPageRoute({ params }: Props) {
  const { locale, slug } = await params;
  const page = getLandingPage(locale, slug);
  if (!page) notFound();

  const isTr = locale === 'tr';
  const isAr = locale === 'ar';
  const url = `${SITE_URL}/${locale}/${slug}`;
  const others = getLandingPages(locale).filter((p) => p.slug !== slug);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isAr ? 'الرئيسية' : isTr ? 'Ana Sayfa' : 'Home', item: `${SITE_URL}/${locale}` },
          { '@type': 'ListItem', position: 2, name: page.keyword, item: url },
        ],
      },
      {
        '@type': 'Service',
        name: page.keyword,
        description: page.description,
        url,
        provider: { '@type': 'Organization', name: 'MedyaPR', url: SITE_URL },
        areaServed: page.areaServed ?? ['Global'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  return (
    <div className="relative min-h-screen bg-app-base py-12 text-white md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container mx-auto max-w-3xl px-4 md:px-8">
        <nav aria-label="breadcrumb" className="mb-5 text-xs text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-white">{isAr ? 'الرئيسية' : isTr ? 'Ana Sayfa' : 'Home'}</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-300">{page.keyword}</span>
        </nav>

        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold leading-tight sm:text-4xl">{page.h1}</h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">{page.lead}</p>

        <AnalysisCta locale={locale} source={`lp_${slug}`} />

        {page.sections.map((s) => (
          <section key={s.h} className="mt-9">
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">{s.h}</h2>
            {s.p?.map((t) => (
              <p key={t.slice(0, 40)} className="mt-3 leading-relaxed text-zinc-300">{t}</p>
            ))}
            {s.ul && (
              <ul className="mt-3 space-y-2">
                {s.ul.map((li) => (
                  <li key={li.slice(0, 40)} className="flex gap-2.5 text-zinc-300">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <span className="leading-relaxed">{li}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {page.prices && <PriceTable page={page} locale={locale} />}

        <section className="mt-10">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">{isAr ? 'أسئلة شائعة' : isTr ? 'Sık sorulan sorular' : 'Frequently asked questions'}</h2>
          <div className="mt-4 space-y-3">
            {page.faq.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <summary className="cursor-pointer font-bold text-white">{f.q}</summary>
                <p className="mt-2 leading-relaxed text-zinc-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <AnalysisCta locale={locale} source={`lp_${slug}_end`} />

        {others.length > 0 && (
          <nav aria-label={isAr ? 'صفحات ذات صلة' : isTr ? 'İlgili sayfalar' : 'Related pages'} className="mt-6 border-t border-white/10 pt-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-400">{isAr ? 'صفحات ذات صلة' : isTr ? 'İlgili sayfalar' : 'Related pages'}</h2>
            <ul className="mt-3 space-y-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/${locale}/${o.slug}`} className="font-semibold text-[#FF6B6B] hover:text-white">{o.keyword}</Link>
                </li>
              ))}
              <li>
                <Link href={`/${locale}/fiyatlandirma`} className="font-semibold text-[#FF6B6B] hover:text-white">
                  {isAr ? 'الأسعار والحاسبة' : isTr ? 'Fiyatlar & Hesaplayıcı' : 'Pricing & Calculator'}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
