import type { Metadata } from 'next';
import ContactClient from '@/components/contact/ContactClient';

type Props = {
  params: Promise<{ locale: string }>;
};

import { getPageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';

  return {
    title: {
      absolute: isAr
        ? 'اتصل بنا | MedyaPR وكالة الترويج لفيديو يوتيوب'
        : isTr
        ? 'İletişim | MedyaPR YouTube Video PR & Danışmanlık'
        : 'Contact Us | MedyaPR YouTube Video PR Agency',
    },
    description: isAr
      ? 'تواصل مع MedyaPR لحملات الترويج لفيديو الكليب على يوتيوب. تحليل إعلانات Google Ads الرسمية، وعروض أسعار مخصصة، ودعم عبر WhatsApp.'
      : isTr
      ? 'YouTube video ve klip lansmanınız için bizimle iletişime geçin. Resmi Google Ads analizi, teklif alma ve WhatsApp hızlı destek hattı.'
      : 'Get in touch with MedyaPR for YouTube music video PR campaigns. Official Google Ads analysis, custom quotes, and WhatsApp support.',
    alternates: getPageAlternates(locale, '/iletisim'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isAr ? 'الرئيسية' : isTr ? 'Ana Sayfa' : 'Home',
            item: `https://medyapr.com/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isAr ? 'تواصل معنا' : isTr ? 'İletişim' : 'Contact',
            item: `https://medyapr.com/${locale}/iletisim`,
          },
        ],
      },
      {
        '@type': 'ContactPage',
        name: isAr ? 'تواصل مع MedyaPR' : isTr ? 'MedyaPR İletişim' : 'Contact MedyaPR',
        description: isAr
          ? 'قنوات التواصل مع MedyaPR للترويج للفيديو عبر إعلانات Google Ads الرسمية واستشارات نمو قناتك على يوتيوب.'
          : isTr
          ? 'MedyaPR resmi Google Ads klip PR ve YouTube büyüme danışmanlığı iletişim kanalları.'
          : 'MedyaPR official Google Ads video PR and YouTube growth consultation channels.',
        mainEntity: {
          '@type': 'Organization',
          name: 'MedyaPR',
          url: `https://medyapr.com/${locale}/iletisim`,
          email: 'info@medyapr.com',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ContactClient locale={locale} />
    </>
  );
}
