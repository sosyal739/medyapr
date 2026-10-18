import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import FAQSection from '@/components/home/FAQSection';

import { getFaqs } from '@/data/faqs';

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
        ? 'Sıkça Sorulan Sorular | MedyaPR YouTube Video PR'
        : 'Frequently Asked Questions | MedyaPR Video PR',
    },
    description: isTr
      ? 'YouTube klip tanıtımı, resmi Google Ads reklam süreçleri, ödeme süreci ve kanal güvenliği hakkında merak edilen tüm soruların yanıtları.'
      : 'Find answers about YouTube video PR, official Google Ads campaign workflows, payment process, channel security, and real retention metrics.',
    alternates: getPageAlternates(locale, '/sss'),
  };
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#1A1A2E] py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-[#D9002B] rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">{dict.faq.title}</h1>
          <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">{dict.faq.subtitle}</p>
        </div>
      </section>

      {/* Schema.org FAQPage & BreadcrumbList */}
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
                    name: locale === 'tr' ? 'Sıkça Sorulan Sorular' : 'FAQ',
                    item: `https://medyapr.com/${locale}/sss`,
                  },
                ],
              },
              {
                '@type': 'FAQPage',
                mainEntity: getFaqs(locale).map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: { '@type': 'Answer', text: item.answer },
                })),
              },
            ],
          }),
        }}
      />

      <FAQSection dict={dict} locale={locale} />
    </div>
  );
}
