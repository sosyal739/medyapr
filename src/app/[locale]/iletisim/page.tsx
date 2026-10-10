import type { Metadata } from 'next';
import ContactClient from '@/components/contact/ContactClient';

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
        ? 'İletişim | MedyaPR YouTube Video PR & Danışmanlık'
        : 'Contact Us | MedyaPR YouTube Video PR Agency',
    },
    description: isTr
      ? 'YouTube video ve klip lansmanınız için bizimle iletişime geçin. Resmi Google Ads analizi, teklif alma ve WhatsApp hızlı destek hattı.'
      : 'Get in touch with MedyaPR for YouTube music video PR campaigns. Official Google Ads analysis, custom quotes, and WhatsApp support.',
    alternates: getPageAlternates(locale, '/iletisim'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const schema = {
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
            name: isTr ? 'İletişim' : 'Contact',
            item: `https://medyapr.com/${locale}/iletisim`,
          },
        ],
      },
      {
        '@type': 'ContactPage',
        name: isTr ? 'MedyaPR İletişim' : 'Contact MedyaPR',
        description: isTr
          ? 'MedyaPR resmi Google Ads klip PR ve YouTube büyüme danışmanlığı iletişim kanalları.'
          : 'MedyaPR official Google Ads video PR and YouTube growth consultation channels.',
        mainEntity: {
          '@type': 'Organization',
          name: 'MedyaPR',
          telephone: '+90-555-123-4567',
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
