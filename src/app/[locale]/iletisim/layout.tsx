import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
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
    alternates: {
      canonical: `https://medyapr.com/${locale}/iletisim`,
    },
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
