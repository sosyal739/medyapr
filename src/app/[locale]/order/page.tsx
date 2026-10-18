import type { Metadata } from 'next';
import Link from 'next/link';
import OrderWizard from '@/components/order/OrderWizard';
import { getAppStrings } from '@/lib/i18n/app-strings';
import { getPageAlternates } from '@/lib/seo';
import { CURRENCIES, FORMATS, PACKAGES, REGIONS, clampViews, type Currency, type Format, type Package, type Region } from '@/lib/pricing';
import { isCountryCode } from '@/lib/countries';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: {
      absolute: isTr
        ? 'YouTube Reklam Siparişi & Klip Analizi | MedyaPR'
        : 'YouTube Video Ad Order & Free Analysis | MedyaPR',
    },
    description: isTr
      ? 'YouTube video linkinizi yapıştırın, izlenme paketinizi seçin ve WhatsApp, Telegram veya Mail ile ücretsiz video analizi isteyin. Onay alınca işlem başlar.'
      : 'Paste your YouTube video link, select a view package, and request a free technical analysis via WhatsApp, Telegram, or Email. Work starts upon approval.',
    alternates: getPageAlternates(locale, '/order'),
  };
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function OrderPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = getAppStrings(locale);
  const isTr = locale === 'tr';
  const pick = <T extends string>(list: readonly T[], v: string | undefined, d: T): T => (list.includes(v as T) ? (v as T) : d);
  const CHANNELS = ['whatsapp', 'telegram', 'email'] as const;

  const orderFaqs = isTr
    ? [
        {
          question: 'Video linkimi gönderdikten sonra süreç nasıl ilerliyor?',
          answer:
            'Gönderdiğiniz YouTube video linki ve hedef paketiniz Google Partner uzmanlarımız tarafından incelenir. Videonuzun süresi, hedef kitlesi ve Google Ads reklam uygunluğu analiz edilerek WhatsApp, Telegram veya E-Posta üzerinden size detaylı dönüş yapılır. Onayınız alındıktan sonra kampanya başlatılır.',
        },
        {
          question: 'Neden doğrudan kartla ödeme yerine analiz ve onay süreci var?',
          answer:
            'Her müzik klibinin ve YouTube videosunun süresi, kategorisi ve reklam politikası uygunluğu farklıdır. Kanalınızın güvenliği ve bütçenizin en verimli şekilde kullanılması için önce teknik video analizi yapılır; Google Ads reklam onayı alındıktan sonra kampanya başlatılır.',
        },
      ]
    : [
        {
          question: 'What happens after I submit my YouTube video link?',
          answer:
            'Our Google Partner specialists inspect your video duration, target audience, and ad policy compliance, then reply via WhatsApp, Telegram, or Email with a detailed launch plan.',
        },
      ];

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-studio-gradient py-10 text-white md:py-16">
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
                    name: isTr ? 'Sipariş & Video Analizi' : 'Order & Video Analysis',
                    item: `https://medyapr.com/${locale}/order`,
                  },
                ],
              },
              {
                '@type': 'Service',
                name: isTr ? 'YouTube Reklam Siparişi ve Ücretsiz Klip Analizi' : 'YouTube Video Ad Order & Technical Review',
                provider: {
                  '@type': 'Organization',
                  name: 'MedyaPR',
                  url: 'https://medyapr.com',
                },
                serviceType: isTr ? 'Resmi Google Ads YouTube Video Tanıtımı' : 'Official Google Ads YouTube Video Promotion',
                url: `https://medyapr.com/${locale}/order`,
              },
              {
                '@type': 'FAQPage',
                mainEntity: orderFaqs.map((f) => ({
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

      <div className="mx-auto max-w-6xl px-4 md:px-8 space-y-12">
        <div className="mb-6 md:mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-white md:text-4xl">
            {isTr ? 'Video Linkinizi Girin, Paketinizi Seçip Analiz İsteyin' : 'Enter Your Video Link, Pick a Package & Request Analysis'}
          </h1>
          <p className="mt-2 text-sm text-white/75 md:text-base max-w-3xl leading-relaxed">
            {isTr
              ? 'YouTube video linkinizi yapıştırın ve hedef paketinizi seçin; teklifinizi WhatsApp ile, Telegram ile veya Mail (E-Posta) ile bize iletin. Uzman ekibimiz videonuzu analiz edip detaylı dönüş yapsın, onay alınca işlem başlar. (Fiyatlandırma video uzunluğuna göre değişebilir.)'
              : 'Paste your YouTube video link and choose your target package; send your quote request via WhatsApp, Telegram, or Email. Our specialists will analyze your video and reply in detail; work begins upon approval. (Pricing may vary based on video length.)'}
          </p>
        </div>

        <OrderWizard
          locale={locale}
          t={t}
          initial={{
            views: clampViews(Number(sp.views) || 25_000),
            format: pick<Format>(FORMATS, sp.format, 'instream'),
            pkg: pick<Package>(PACKAGES, sp.pkg, 'views'),
            region: pick<Region>(REGIONS, sp.region, isTr ? 'tr' : 'premium'),
            currency: pick<Currency>(CURRENCIES, sp.currency, isTr ? 'TRY' : 'USD'),
            videoUrl: sp.video?.slice(0, 300),
            channel: pick(CHANNELS, sp.channel, 'whatsapp'),
            country: isCountryCode(sp.country) ? sp.country.toUpperCase() : undefined,
          }}
        />

        {/* Sipariş & Analiz Süreci Bilgilendirme Bölümü (SEO & Güven) */}
        <div className="border-t border-white/10 pt-10 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {isTr
              ? 'YouTube Video Reklam ve Klip PR Sipariş Süreci Nasıl İşler?'
              : 'How the YouTube Video Ad & Music PR Order Workflow Operates'}
          </h2>
          <blockquote className="rounded-2xl border-l-4 border-[#FF0033] bg-white/[0.03] p-5 text-sm text-zinc-200 italic">
            {isTr
              ? '“MedyaPR’de tüm YouTube izlenme ve klip tanıtım kampanyaları sertifikalı Google Partner uzmanları tarafından yürütülür. Kanal şifresi istenmez; teklifiniz incelendikten sonra onayınızla çalışılır.”'
              : '“All YouTube video promotion campaigns at MedyaPR are managed by certified Google Partner specialists with zero passwords required.”'}
          </blockquote>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orderFaqs.map((f, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2">
                <h3 className="text-base font-bold text-white">{f.question}</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-bold pt-2">
            <Link href={`/${locale}/fiyatlandirma`} className="text-[#FF6B6B] underline">
              {isTr ? '← Tüm Paket Fiyatları ve Hesaplayıcı' : '← All Package Prices & Calculator'}
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href={`/${locale}/hizmetler`} className="text-emerald-400 underline">
              {isTr ? 'Google Ads YouTube Hizmetlerimiz' : 'Our Google Ads YouTube Services'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

