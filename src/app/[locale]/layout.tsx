import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/common/CookieConsent';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import { ThemeProvider } from '@/components/theme/ThemeContext';

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  
  return {
    title: {
      default: dict.metadata.title,
      template: `%s | MedyaPR`,
    },
    description: dict.metadata.description,
    keywords: locale === 'tr' 
      ? 'youtube izlenme, video pr, klip pr, google ads video reklam, youtube büyütme, youtube reklam ajansı'
      : 'youtube views, video pr, music video pr, google ads video advertising, youtube growth, youtube pr agency',
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      siteName: 'MedyaPR',
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.title,
      description: dict.metadata.description,
    },
    alternates: {
      canonical: `https://medyapr.com/${locale}`,
      languages: {
        'tr': '/tr',
        'en': '/en',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '6vVh-U5RO-idJx1NOXWy1ALgOK3edpytPoOYklpLH_E',
    },
  };
}

export default async function LocaleLayout({ params, children }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {/* Schema.org Unified Graph: Organization, Person, ProfessionalService, WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://medyapr.com/#organization',
                  name: 'MedyaPR',
                  legalName: 'MedyaPR Video Reklam & PR Ajansı',
                  url: 'https://medyapr.com',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://medyapr.com/logo.png',
                  },
                  description: dict.metadata.description,
                  founder: { '@id': 'https://medyapr.com/#founder' },
                  contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+90-555-123-4567',
                    contactType: 'customer support',
                    email: 'info@medyapr.com',
                    availableLanguage: ['Turkish', 'English'],
                  },
                  sameAs: [
                    'https://www.youtube.com/@medyapr',
                    'https://instagram.com/medyapr',
                    'https://t.me/medyapr',
                  ],
                },
                {
                  '@type': 'Person',
                  '@id': 'https://medyapr.com/#founder',
                  name: 'Salih Maral',
                  jobTitle: 'Resmi Google Partner & Dijital Medya Stratejisti (18+ Yıllık Tecrübe)',
                  url: 'https://medyapr.com',
                  worksFor: { '@id': 'https://medyapr.com/#organization' },
                  knowsAbout: [
                    'Google Ads Video Reklamları',
                    'YouTube Algoritma Optimizasyonu',
                    'Müzik Klibi Lansman PR',
                    'YouTube Shorts Reklamcılığı',
                    'Dijital Medya Planlama',
                  ],
                },
                {
                  '@type': 'ProfessionalService',
                  '@id': 'https://medyapr.com/#service',
                  name: 'MedyaPR — YouTube Video PR & Google Ads Ajansı',
                  url: 'https://medyapr.com',
                  priceRange: '₺₺',
                  currenciesAccepted: 'TRY, USD, EUR',
                  paymentAccepted: 'Banka Havalesi, FAST, Kredi Kartı',
                  areaServed: ['TR', 'DE', 'Global'],
                  parentOrganization: { '@id': 'https://medyapr.com/#organization' },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://medyapr.com/#website',
                  name: 'MedyaPR',
                  url: 'https://medyapr.com',
                  description: dict.metadata.description,
                  inLanguage: locale === 'tr' ? 'tr-TR' : 'en-US',
                  publisher: { '@id': 'https://medyapr.com/#organization' },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-app-base text-zinc-100 antialiased selection:bg-[#FF0033] selection:text-white transition-colors duration-400">
        <ThemeProvider>
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-EEBZ16SNQ9'} />
          <Header dict={dict} locale={locale} />
          <main className="flex-grow pt-[72px]">{children}</main>
          <Footer dict={dict} locale={locale} />
          <CookieConsent dict={dict} locale={locale} />
        </ThemeProvider>
        
        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/905551234567"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 hover:shadow-xl transition-all duration-300 animate-pulse-glow"
          aria-label="WhatsApp"
          style={{ animationDuration: '3s' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
