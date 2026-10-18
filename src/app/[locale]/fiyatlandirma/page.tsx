import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import CalculatorSection from '@/components/calc/CalculatorSection';
import { getPageAlternates } from '@/lib/seo';
import { formatMoney, quote } from '@/lib/pricing';

type Props = {
  params: Promise<{ locale: string }>;
};

/** Tablodaki hacimler; fiyatlar src/lib/pricing.ts motorundan hesaplanır (tek kaynak, tahmini). */
const PRICE_ROWS = [1_000, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000, 1_000_000];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: {
      absolute: isTr
        ? 'YouTube Reklam Verme & Klip İzlenme Fiyatları | MedyaPR'
        : 'YouTube Video Ad & Music PR Pricing Plans | MedyaPR',
    },
    description: isTr
      ? '2026 YouTube klip tanıtımı, video reklam verme ve 1.000 izlenme fiyatları. Karma Global 1K: 100 TL’den başlayan resmi Google Ads paketleri ve canlı hesaplama.'
      : '2026 YouTube music video promotion and Google Ads view pricing calculator. Transparent tiered rates from 1K to 1M real views.',
    alternates: getPageAlternates(locale, '/fiyatlandirma'),
  };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const isTr = locale === 'tr';

  const pricingFaqs = isTr
    ? [
        {
          question: 'YouTube 1.000 izlenme reklam ücreti 2026 yılında ne kadar?',
          answer:
            'MedyaPR resmi Google Ads video reklam paketlerinde 1.000 izlenme (1K) maliyeti Karma Global hedeflemede 100 TL (yüksek hacimli paketlerde 60 TL’ye kadar düşer), Türkiye hedefli kampanyalarda ise tahmini olarak 125 TL’den başlar, büyük paketlerde 1K başına yaklaşık 90 TL’ye kadar düşer (100K = 8.999 TL). Fiyatlar tahminidir; videonun uzunluğuna, hedef ülkeye ve reklam türüne göre değişebilir.',
        },
        {
          question: 'YouTube klip reklamı verirken ödemeyi nasıl yapıyorum?',
          answer:
            'Sitemizden video linkinizi ve paketinizi ilettiğinizde uzman ekibimiz klibinizi analiz eder. Sitede online ödeme alınmaz; ödeme planı teklifi onayladıktan sonra sizinle netleştirilir. Videonuz Google Ads onayından geçmezse yapılmış ön ödeme iade edilir.',
        },
        {
          question: 'Fiyatlandırma neden video uzunluğuna göre değişebilir?',
          answer:
            'Google Ads video reklam açık artırmalarında (In-Stream ve Keşfet) izlenme süresi ve video uzunluğu CPV (izlenme başına maliyet) baremini doğrudan etkiler. Standart 3-4 dakikalık müzik klipleri baz fiyatlarla çalışırken, uzun süreli videolar analiz aşamasında uzmanlarımızca değerlendirilir.',
        },
        {
          question: 'Kanal şifresi veya Google Ads hesap yetkisi gerekiyor mu?',
          answer:
            'Hayır, kesinlikle şifre veya kanal yetkisi istenmez. Yalnızca herkese açık YouTube video linkinizle resmi Google Partner hesaplarımız üzerinden reklam kampanyanız başlatılır.',
        },
      ]
    : [
        {
          question: 'How much does 1,000 YouTube ad views cost in 2026?',
          answer:
            'With MedyaPR official Google Ads campaigns, 1,000 real views start from $3 (100 TRY) on Blended Global packages and $4–$6 on targeted country packages, with automatic volume discounts up to 40% on larger tiers.',
        },
        {
          question: 'How do payments work?',
          answer:
            'Submit your YouTube link and package for technical review. There is no online payment on the site; the payment plan is agreed with you after you approve the quote. If your video is not approved by Google Ads, any prepayment is refunded.',
        },
      ];

  return (
    <div className="min-h-screen bg-app-base text-white">
      {/* Schema.org Service, BreadcrumbList & FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: isTr ? 'Ana Sayfa' : 'Home',
                    item: `https://medyapr.com/${locale}`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: isTr ? 'YouTube Reklam & İzlenme Fiyatları' : 'Pricing',
                    item: `https://medyapr.com/${locale}/fiyatlandirma`,
                  },
                ],
              },
              {
                '@type': 'Service',
                name: isTr ? 'MedyaPR YouTube Reklam Verme & Klip Tanıtım Paketleri' : 'MedyaPR YouTube Video & Music PR Packages and Pricing',
                description: isTr
                  ? 'Kademeli indirimli resmi Google Ads YouTube video ve klip tanıtım paketleri. 1.000 izlenmeden 1.000.000 izlenmeye kadar şeffaf baremler.'
                  : 'Official Google Ads YouTube video promotion packages. Tiered discounted pricing from 1K to 1M authentic views.',
                provider: {
                  '@type': 'Organization',
                  name: 'MedyaPR',
                  url: 'https://medyapr.com',
                },
                serviceType: isTr ? 'YouTube Video Reklam Verme ve Klip PR' : 'Video PR & Advertising Budget Estimation',
                areaServed: ['TR', 'DE', 'Global'],
                url: `https://medyapr.com/${locale}/fiyatlandirma`,
              },
              {
                '@type': 'FAQPage',
                mainEntity: pricingFaqs.map((f) => ({
                  '@type': 'Question',
                  name: f.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: f.answer,
                  },
                })),
              },
            ],
          }),
        }}
      />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#1A1A2E] py-16 lg:py-22 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#D9002B] rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            {dict.pricing.title}
          </h1>
          <p className="text-base lg:text-xl text-gray-300 max-w-3xl mx-auto">
            {dict.pricing.subtitle}
          </p>
        </div>
      </section>

      <CalculatorSection locale={locale} />

      {/* 2026 Şeffaf Fiyat Tablosu & Sipariş Rehberi (SEO + GEO Pillar) */}
      <section className="py-16 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 md:px-8 space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isTr
                ? '2026 YouTube Klip Tanıtımı ve Google Ads İzlenme Fiyat Tablosu'
                : '2026 YouTube Music Video PR & Google Ads Pricing Benchmark Table'}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-4xl">
              {isTr
                ? 'Aşağıdaki tablo, standart uzunluktaki (3-4 dk) müzik klipleri ve YouTube videoları için resmi Google Ads izlenme paketlerimizin kademeli indirimli fiyatlarını gösterir. Teklifinizi ilettiğinizde videonuz analiz edilir ve onayınızla işlem başlar.'
                : 'The benchmark table below outlines our tiered official Google Ads video promotion rates for standard music videos. Submit your quote for a custom technical analysis.'}
            </p>
          </div>

          <blockquote className="rounded-2xl border-l-4 border-emerald-500 bg-white/[0.03] p-5 text-sm sm:text-base text-zinc-200 italic">
            {isTr
              ? '“Özet Fiyat Bilgisi: MedyaPR’de 1.000 gerçek Google Ads YouTube izlenmesi Karma Global paketlerde 100 TL’den (büyük paketlerde 1K: 60 TL), Türkiye hedefli kampanyalarda ise tahmini 125 TL’den (100K pakette 1K: yaklaşık 90 TL) başlar. Şifre istenmez; fiyatlar tahminidir ve video süresine göre değişebilir.”'
              : '“Quick Pricing Fact: 1,000 authentic Google Ads YouTube views start at 100 TRY ($3) on Blended Global plans and 125 TRY ($3.4) on Turkey-targeted plans, with volume discounts on larger packs. Prices are estimates and vary by video length.”'}
          </blockquote>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04] text-zinc-300 uppercase font-extrabold">
                  <th className="py-3.5 px-4">{isTr ? 'Hedef İzlenme (tahmini fiyat)' : 'Target Views (estimated price)'}</th>
                  <th className="py-3.5 px-4">{isTr ? 'Karma Global (🔥 İndirimli)' : 'Blended Global'}</th>
                  <th className="py-3.5 px-4">{isTr ? 'Türkiye Hedefli' : 'Turkey Targeted'}</th>
                  <th className="py-3.5 px-4">{isTr ? 'Almanya / Avrupa / ABD' : 'Tier-1 (DE / EU / US)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-200">
                {PRICE_ROWS.map((v) => {
                  const g = quote({ views: v, region: 'global', currency: 'TRY' });
                  const t = quote({ views: v, region: 'tr', currency: 'TRY' });
                  const p = quote({ views: v, region: 'premium', currency: 'TRY' });
                  return (
                    <tr key={v}>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {new Intl.NumberFormat(isTr ? 'tr-TR' : 'en-US').format(v)} {isTr ? 'İzlenme' : 'Views'}
                      </td>
                      <td className="py-3.5 px-4 text-amber-300 font-bold">{formatMoney(g.total, 'TRY', locale)}</td>
                      <td className="py-3.5 px-4">{formatMoney(t.total, 'TRY', locale)}</td>
                      <td className="py-3.5 px-4">{formatMoney(p.total, 'TRY', locale)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* SSS / FAQ Accordion */}
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-white">
              {isTr ? 'YouTube Reklam Fiyatları Hakkında Sıkça Sorulan Sorular' : 'Pricing Frequently Asked Questions'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pricingFaqs.map((f, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
                  <h3 className="text-base font-extrabold text-white">{f.question}</h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#FF0033]/30 bg-gradient-to-r from-[#FF0033]/15 to-zinc-900 p-6">
            <div>
              <h3 className="text-lg font-extrabold text-white">
                {isTr ? 'Klibinizin Linkini Girip Hemen Ücretsiz Analiz İsteyin' : 'Submit Your Video Link for a Free Technical Analysis'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                {isTr
                  ? 'WhatsApp, Telegram veya E-Posta üzerinden teklifinizi iletin; uzman ekibimiz klibinizi inceleyip dönüş yapsın.'
                  : 'Send your quote via WhatsApp, Telegram, or Email; our specialists will review your video and reply in detail.'}
              </p>
            </div>
            <Link
              href={`/${locale}/order`}
              className="rounded-xl bg-[#E0002E] px-6 py-3.5 text-sm font-black text-white shadow-lg hover:brightness-110 transition"
            >
              {isTr ? 'Sipariş & Analiz Sihirbazına Git →' : 'Go to Order & Analysis Wizard →'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
