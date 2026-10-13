import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import { Shield, Target, TrendingUp, Award, Users, BarChart3 } from 'lucide-react';

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
        ? 'Hakkımızda | MedyaPR Resmi Google Partner Ajansı'
        : 'About Us | MedyaPR Official Google Partner Agency',
    },
    description: isTr
      ? '18 yılı aşkındır kesintisiz dijital medya tecrübesiyle sanatçı ve markalara resmi Google Ads YouTube video ve klip PR danışmanlığı sunuyoruz.'
      : 'Over 18 years of digital PR excellence, offering official Google Ads YouTube video and music video PR management to global artists.',
    alternates: getPageAlternates(locale, '/hakkimizda'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const isTr = locale === 'tr';

  const values = [
    { icon: Shield, title: locale === 'tr' ? '%100 Güvenli' : '100% Safe', desc: locale === 'tr' ? 'Google Ads resmi platformu ile çalışıyoruz' : 'We work with Google Ads official platform' },
    { icon: Target, title: locale === 'tr' ? 'Hedefli Reklam' : 'Targeted Ads', desc: locale === 'tr' ? 'Doğru kitleye ulaşmanızı sağlıyoruz' : 'We ensure you reach the right audience' },
    { icon: TrendingUp, title: locale === 'tr' ? 'Organik Büyüme' : 'Organic Growth', desc: locale === 'tr' ? 'Gerçek izlenmeler algoritma tetikler' : 'Real views trigger the algorithm' },
    { icon: Award, title: locale === 'tr' ? '18+ Yıl Tecrübe' : '18+ Years Experience', desc: locale === 'tr' ? '18 yılı aşkındır sektörde kesintisiz dijital PR ve video tanıtımı' : 'Over 18 years of continuous digital PR and video promotion' },
    { icon: Users, title: locale === 'tr' ? 'Google Partner Uzmanları' : 'Google Partner Specialists', desc: locale === 'tr' ? 'Türkiye\'de ve dünyada birçok sanatçı ve kurumsal referans' : 'Partnered with prominent artists across Turkey and worldwide' },
    { icon: BarChart3, title: locale === 'tr' ? 'Şeffaf Raporlama' : 'Transparent Reports', desc: locale === 'tr' ? 'Kampanya verilerinizi anlık takip edin' : 'Track your campaign data in real-time' },
  ];

  return (
    <div className="min-h-screen">
      {/* Schema.org AboutPage & BreadcrumbList */}
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
                    name: locale === 'tr' ? 'Hakkımızda' : 'About Us',
                    item: `https://medyapr.com/${locale}/hakkimizda`,
                  },
                ],
              },
              {
                '@type': 'AboutPage',
                name: locale === 'tr' ? 'MedyaPR Hakkında' : 'About MedyaPR',
                description: isTr
                  ? '18 yılı aşkındır kesintisiz dijital medya ve resmi Google Ads klip PR tecrübesi.'
                  : 'Over 18 years of continuous digital PR and official Google Ads video campaigns.',
                mainEntity: {
                  '@type': 'Organization',
                  name: 'MedyaPR',
                  url: 'https://medyapr.com',
                },
              },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#1A1A2E] py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#D9002B] rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">{dict.about.title}</h1>
          <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">{dict.about.subtitle}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-sm font-bold text-[#FF0033] mb-8">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Google Ads Partner
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">{dict.about.description}</p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-black text-center text-[#1A1A2E] mb-4">
            {locale === 'tr' ? 'Değerlerimiz' : 'Our Values'}
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
            {locale === 'tr' ? 'Neden bizi tercih etmelisiniz?' : 'Why should you choose us?'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#E0002E] to-[#CC0029] rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-[#FF0033]/20">
                  <v.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
