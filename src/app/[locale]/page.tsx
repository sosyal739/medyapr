import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import { getPageAlternates } from '@/lib/seo';
import HeroSection from '@/components/home/HeroSection';
import TrustBadges from '@/components/home/TrustBadges';
import CalculatorSection from '@/components/calc/CalculatorSection';
import TrendingMusicSection from '@/components/home/TrendingMusicSection';
import ArtistTestimonialsMarquee from '@/components/home/ArtistTestimonialsMarquee';
import ComparisonSection from '@/components/home/ComparisonSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import HowItWorks from '@/components/home/HowItWorks';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import FAQSection from '@/components/home/FAQSection';
import { getTrends } from '@/lib/youtube';
import { getPosts, postsForLocale } from '@/lib/content';
import { getFaqs } from '@/data/faqs';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: {
      absolute: isTr
        ? 'YouTube Klip Tanıtımı & Video Reklam Verme | MedyaPR'
        : 'YouTube Music Video Promotion & Google Ads PR | MedyaPR',
    },
    description: isTr
      ? 'Resmi Google Ads ile YouTube klip tanıtımı, şarkı reklamı ve gerçek izlenme paketleri. Şifre istenmez; önce ücretsiz analiz, sonra teklif.'
      : 'Official Google Ads YouTube music video promotion and real view packages. No password required; free review first, then a quote.',
    alternates: getPageAlternates(locale, ''),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const isTr = locale === 'tr';
  const dict = await getDictionary(locale as Locale);
  const { trends } = await getTrends();
  const trendingSongs = locale === 'tr' ? trends.tr : trends.us.length ? trends.us : trends.tr;
  const blogPosts = postsForLocale(await getPosts(), locale);

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
                  ? 'MedyaPR ile YouTube video ve klip tanıtımının 4 adımlı resmi Google Ads onay ve yayın süreci.'
                  : '4-step official Google Ads video campaign workflow: submission, review, approval, and delivery.',
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
                    name: locale === 'tr' ? 'Önce Analiz, Sonra Teklif' : 'Review First, Then Quote',
                    text: locale === 'tr'
                      ? 'Videonuz incelenir, net bir teklif iletilir; onayınız olmadan kampanya başlamaz.'
                      : 'Your video is reviewed and a clear quote is sent; no campaign starts without your approval.',
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
      <div className="cv-auto">
        <TrendingMusicSection songs={trendingSongs} locale={locale} />
      </div>
      <div className="cv-auto">
        <ArtistTestimonialsMarquee locale={locale} />
      </div>
      <div className="cv-auto">
        <ComparisonSection locale={locale} />
      </div>
      <div className="cv-auto">
        <ServicesGrid dict={dict} locale={locale} />
      </div>
      <div className="cv-auto">
        <HowItWorks dict={dict} locale={locale} />
      </div>
      <div className="cv-auto">
        <BlogPreviewSection
        posts={blogPosts.slice(0, 3).map((p) => ({ ...p, paragraphs: [], paragraphs_en: [], faqs: [], faqs_en: [], table: undefined, table_en: undefined }))}
        locale={locale}
        />
      </div>

      {/* Sipariş Odaklı Ticari SEO & GEO Pillar Bölümü */}
      <section className="cv-auto bg-app-base py-16 border-t border-white/10 text-white">
        <div className="mx-auto max-w-6xl px-4 md:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="inline-block rounded-full bg-[#FF0033]/15 border border-[#FF0033]/30 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B]">
              {isTr ? 'Resmi Google Partner Video PR Rehberi' : 'Official Google Partner Video PR Guide'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isTr
                ? 'YouTube Klip Tanıtımı, Video Reklam Verme ve Gerçek İzlenme Paketleri'
                : 'YouTube Music Video Promotion, Video Advertising & Real View Packages'}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {isTr
                ? 'MedyaPR, 18+ yıllık sektör deneyimi ve sertifikalı Google Partner uzmanlığıyla sanatçılar, yapım şirketleri ve içerik üreticileri için resmi Google Ads üzerinden YouTube reklam verme, şarkı tanıtımı ve organik izlenme kampanyaları yürütür. Kanal şifresi veya yönetici yetkisi asla istenmez; yalnızca herkese açık video linkinizle analiz yapılır ve onayınız alındığında işlem başlar.'
                : 'With 18+ years of industry experience and certified Google Partner expertise, MedyaPR manages official Google Ads YouTube video promotion, song marketing, and real view campaigns for artists, record labels, and creators. Zero channel passwords required.'}
            </p>
          </div>

          <blockquote className="rounded-2xl border-l-4 border-[#FF0033] bg-white/[0.03] p-5 text-sm sm:text-base text-zinc-200 italic">
            {isTr
              ? '“Resmi Google Ads üzerinden yürütülen YouTube klip reklamları ve video tanıtım kampanyaları, YouTube Studio Analytics ekranında doğrudan ‘YouTube Reklamları’ trafik kaynağı altında görünür; bot veya panel kullanılmadığı için izlenmeler ömür boyu kalıcıdır.”'
              : '“YouTube music video ads managed through official Google Ads appear transparently under the ‘YouTube Advertising’ traffic source in YouTube Studio Analytics with lifetime permanence and zero bot risk.”'}
          </blockquote>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04] text-zinc-300 uppercase font-extrabold">
                  <th className="py-3.5 px-4">{isTr ? 'Hizmet & Paket Türü' : 'Service & Package'}</th>
                  <th className="py-3.5 px-4">{isTr ? 'Trafik Kaynağı' : 'Traffic Source'}</th>
                  <th className="py-3.5 px-4">{isTr ? 'Başlangıç Baremi' : 'Starting Rate'}</th>
                  <th className="py-3.5 px-4">{isTr ? 'Süreç' : 'Process'}</th>
                  <th className="py-3.5 px-4">{isTr ? 'Hızlı İşlem' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-300">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">{isTr ? 'YouTube Klip Tanıtımı (Türkiye Hedefli)' : 'Targeted Country Music Video PR'}</td>
                  <td className="py-3.5 px-4">Google Ads In-Stream & Keşfet</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{isTr ? '1.000 İzlenme: tahmini ₺125’ten başlayan' : 'Tiered Custom CPV'}</td>
                  <td className="py-3.5 px-4">{isTr ? 'Önce analiz, sonra teklif' : 'Review first, then quote'}</td>
                  <td className="py-3.5 px-4">
                    <Link href={`/${locale}/fiyatlandirma`} className="font-bold text-[#FF6B6B] underline">
                      {isTr ? 'Fiyat Hesapla →' : 'Calculate →'}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">{isTr ? 'Karma Global YouTube İzlenme Paketi' : 'Blended Global YouTube Views'}</td>
                  <td className="py-3.5 px-4">Google Ads Global Video Ağı</td>
                  <td className="py-3.5 px-4 text-amber-300 font-bold">{isTr ? '1.000 İzlenme: ₺100 🔥' : 'High-Volume Discounted'}</td>
                  <td className="py-3.5 px-4">{isTr ? 'Önce analiz, sonra teklif' : 'Review first, then quote'}</td>
                  <td className="py-3.5 px-4">
                    <Link href={`/${locale}/order`} className="font-bold text-emerald-400 underline">
                      {isTr ? 'Analiz İste →' : 'Request Analysis →'}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">{isTr ? 'YouTube Shorts & Etkileşim Paketi' : 'YouTube Shorts & Engagement PR'}</td>
                  <td className="py-3.5 px-4">Google Ads Shorts & Demand Gen</td>
                  <td className="py-3.5 px-4 text-sky-300 font-bold">{isTr ? 'Kademeli Hacim İndirimi' : 'Volume Tiered'}</td>
                  <td className="py-3.5 px-4">{isTr ? 'Kurumsala İş Bitiminde' : 'Corporate Post-Delivery'}</td>
                  <td className="py-3.5 px-4">
                    <Link href={`/${locale}/hizmetler`} className="font-bold text-sky-300 underline">
                      {isTr ? 'Hizmetleri Gör →' : 'View Services →'}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs font-bold">
            <Link href={`/${locale}/fiyatlandirma`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white">
              💰 {isTr ? 'YouTube Reklam & İzlenme Fiyatları' : 'YouTube Ad & View Pricing'} →
            </Link>
            <Link href={`/${locale}/order`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-emerald-500/50 transition text-white">
              🚀 {isTr ? 'Video Linki Gir & Analiz İste' : 'Submit Video & Request Analysis'} →
            </Link>
            <Link href={`/${locale}/klip-pr`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white">
              🎵 {isTr ? 'Müzik Klibi Dijital PR & Şarkı Tanıtımı' : 'Music Video Digital PR & Launch Agency'} →
            </Link>
            <Link href={`/${locale}/blog/youtube-klip-tanitimi-google-ads-rehberi`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white">
              📘 {isTr ? 'YouTube Klip Tanıtımı Nasıl Yapılır?' : 'How to Run Music Video Ads'} →
            </Link>
            <Link href={`/${locale}/blog/youtube-shorts-reklami-nasil-verilir-muzik-klibi-demand-gen`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white">
              📱 {isTr ? 'YouTube Shorts Reklam Verme Rehberi' : 'YouTube Shorts Ad Promotion Guide'} →
            </Link>
            <Link href={`/${locale}/blog/youtube-4000-saat-izlenme-suresi-nasil-doldurulur-para-kazanma-rehberi`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white">
              ⏱️ {isTr ? 'YouTube 4000 Saat İzlenme Rehberi' : 'YouTube 4,000 Watch Hours Guide'} →
            </Link>
          </div>
        </div>
      </section>

      <div className="cv-auto">
        <FAQSection dict={dict} locale={locale} />
      </div>
    </>
  );
}
