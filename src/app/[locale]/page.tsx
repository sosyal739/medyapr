import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import HeroSection from '@/components/home/HeroSection';
import TrustBadges from '@/components/home/TrustBadges';
import CalculatorSection from '@/components/calc/CalculatorSection';
import TrendingMusicSection from '@/components/home/TrendingMusicSection';
import ComparisonSection from '@/components/home/ComparisonSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import HowItWorks from '@/components/home/HowItWorks';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import FAQSection from '@/components/home/FAQSection';
import { promises as fs } from 'fs';
import path from 'path';
import { getPosts } from '@/lib/content';
import { getFaqs } from '@/data/faqs';

type Props = {
  params: Promise<{ locale: string }>;
};

async function getTrendingSongs(locale: string = 'tr') {
  try {
    const file = path.join(process.cwd(), 'data', 'trending_songs.json');
    const content = await fs.readFile(file, 'utf8');
    const data = JSON.parse(content);
    if (Array.isArray(data)) return data;
    return locale === 'tr' ? (data.tr || []) : (data.us || data.tr || []);
  } catch (e) {
    return [];
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const trendingSongs = await getTrendingSongs(locale);
  const blogPosts = await getPosts();

  return (
    <>
      {/* Schema.org Combined Graph: FAQPage, HowTo, Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'FAQPage',
                mainEntity: getFaqs(locale).map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                  },
                })),
              },
              {
                '@type': 'HowTo',
                name: locale === 'tr' ? 'YouTube Klip Tanıtımı ve Video PR Nasıl Yapılır?' : 'How YouTube Music Video PR Works',
                description: locale === 'tr'
                  ? 'MedyaPR ile YouTube video ve klip tanıtımının 4 adımlı resmi Google Ads onay, aşamalı ödeme ve yayın süreci.'
                  : '4-step official Google Ads video campaign workflow: submission, review, phased payment, and delivery.',
                totalTime: 'P2D',
                step: [
                  {
                    '@type': 'HowToStep',
                    position: 1,
                    name: locale === 'tr' ? 'Video Linki Paylaşılır' : 'Submit Video URL',
                    text: locale === 'tr'
                      ? 'Kanal şifresi veya yetki gerekmez; yalnızca herkese açık YouTube video linki iletilir.'
                      : 'Zero passwords required. Only the public YouTube video URL is shared.',
                    url: `https://medyapr.com/${locale}#how-it-works`,
                  },
                  {
                    '@type': 'HowToStep',
                    position: 2,
                    name: locale === 'tr' ? 'Google Partner Analizi & Onay' : 'Google Partner Review & Approval',
                    text: locale === 'tr'
                      ? '18+ yıllık deneyimli uzman ekibimiz videoyu içerik ve politika açısından inceleyip resmi Google Ads onayına sunar.'
                      : 'Our certified Google Partner team inspects content compliance and submits for official approval.',
                    url: `https://medyapr.com/${locale}#how-it-works`,
                  },
                  {
                    '@type': 'HowToStep',
                    position: 3,
                    name: locale === 'tr' ? 'Aşamalı Güvenli Ödeme' : 'Phased Safe Payment',
                    text: locale === 'tr'
                      ? 'Video reklam onayı alınca ödemenin yarısı (%50), kampanya tamamlandığında kalanı alınır. Kurumsal müşterilerde tüm ödeme iş bitimindedir.'
                      : '50% upon official ad approval, 50% upon campaign delivery. Corporate clients pay 100% on delivery.',
                    url: `https://medyapr.com/${locale}#how-it-works`,
                  },
                  {
                    '@type': 'HowToStep',
                    position: 4,
                    name: locale === 'tr' ? 'Performans Raporlama & Kalıcı İzlenme' : 'Reporting & Permanent Views',
                    text: locale === 'tr'
                      ? 'İzlenmeler YouTube Studio analitiklerinde tescillenir, ömür boyu kalıcıdır ve detaylı performans raporu teslim edilir.'
                      : 'Views are logged in YouTube Studio under YouTube Advertising with lifetime permanence and detailed reports.',
                    url: `https://medyapr.com/${locale}#how-it-works`,
                  },
                ],
              },
              {
                '@type': 'Service',
                serviceType: locale === 'tr' ? 'YouTube Video & Klip PR Reklamcılığı' : 'YouTube Video & Music PR Advertising',
                provider: {
                  '@type': 'Organization',
                  name: 'MedyaPR',
                  url: 'https://medyapr.com',
                },
                areaServed: ['TR', 'DE', 'Global'],
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: locale === 'tr' ? 'YouTube Video PR Paketleri' : 'YouTube Video PR Packages',
                  itemListElement: [
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Service',
                        name: locale === 'tr' ? 'YouTube In-Stream Video Reklamı' : 'YouTube In-Stream Video Ads',
                      },
                    },
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Service',
                        name: locale === 'tr' ? 'YouTube Shorts Akış Reklamı' : 'YouTube Shorts Feed Ads',
                      },
                    },
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Service',
                        name: locale === 'tr' ? 'Müzik Klibi Lansman PR' : 'Music Video Launch PR',
                      },
                    },
                  ],
                },
              },
            ],
          }),
        }}
      />

      <HeroSection dict={dict} locale={locale} />
      <TrustBadges dict={dict} locale={locale} />
      <CalculatorSection locale={locale} />
      <TrendingMusicSection songs={trendingSongs} locale={locale} />
      <ComparisonSection locale={locale} />
      <ServicesGrid dict={dict} locale={locale} />
      <HowItWorks dict={dict} locale={locale} />
      <BlogPreviewSection
        posts={blogPosts.slice(0, 3).map((p) => ({ ...p, paragraphs: [], paragraphs_en: [], faqs: [], faqs_en: [], table: undefined, table_en: undefined }))}
        locale={locale}
      />
      <FAQSection dict={dict} locale={locale} />
    </>
  );
}
