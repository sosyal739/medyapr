import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import CalculatorSection from '@/components/calc/CalculatorSection';

type Props = {
  params: Promise<{ locale: string }>;
};

import { getPageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: {
      absolute: isTr
        ? 'YouTube İzlenme & Klip PR Fiyatları | MedyaPR'
        : 'YouTube Video & Music PR Pricing Plans | MedyaPR',
    },
    description: isTr
      ? 'YouTube klip tanıtımı ve izlenme paketleri. Kademeli indirimli baremler, %100 resmi Google Ads gösterimleri ve aşamalı güvenli ödeme modeli.'
      : 'YouTube music video PR pricing calculator. Transparent tiered rates, 100% official Google Ads campaigns, and phased secure payment guarantee.',
    alternates: getPageAlternates(locale, '/fiyatlandirma'),
  };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const isTr = locale === 'tr';

  return (
    <div className="min-h-screen">
      {/* Schema.org Service & BreadcrumbList */}
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
                    name: locale === 'tr' ? 'Ana Sayfa' : 'Home',
                    item: `https://medyapr.com/${locale}`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: locale === 'tr' ? 'Fiyatlandırma' : 'Pricing',
                    item: `https://medyapr.com/${locale}/fiyatlandirma`,
                  },
                ],
              },
              {
                '@type': 'Service',
                name: locale === 'tr' ? 'MedyaPR YouTube Video & Klip PR Paketleri ve Fiyatlandırma' : 'MedyaPR YouTube Video & Music PR Packages and Pricing',
                description: isTr
                  ? 'Kademeli indirimli resmi Google Ads YouTube video ve klip tanıtım paketleri. 1.000 izlenmeden 1.000.000 izlenmeye kadar şeffaf baremler.'
                  : 'Official Google Ads YouTube video promotion packages. Tiered discounted pricing from 1K to 1M authentic views.',
                provider: {
                  '@type': 'Organization',
                  name: 'MedyaPR',
                  url: 'https://medyapr.com',
                },
                serviceType: locale === 'tr' ? 'Video PR ve Reklam Bütçesi Hesaplama' : 'Video PR & Advertising Budget Estimation',
                areaServed: ['TR', 'DE', 'Global'],
                url: `https://medyapr.com/${locale}/fiyatlandirma`,
              },
            ],
          }),
        }}
      />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#1A1A2E] py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#D9002B] rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
            {dict.pricing.title}
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
            {dict.pricing.subtitle}
          </p>
        </div>
      </section>

      <CalculatorSection locale={locale} />
    </div>
  );
}
