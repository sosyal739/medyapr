import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import { Check, Play, Users, ThumbsUp, MessageCircle, Clock, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: {
      absolute: isTr
        ? 'YouTube Klip PR & Video Reklam Hizmetleri | MedyaPR'
        : 'YouTube Music PR & Video Ad Services | MedyaPR',
    },
    description: isTr
      ? 'In-Stream, Shorts ve Keşfet reklamları ile YouTube kanalınızı büyütün. 18+ yıllık tecrübe, resmi Google Ads altyapısı ve şeffaf performans takibi.'
      : 'Grow your YouTube channel with In-Stream, Shorts and In-Feed ads. 18+ years experience, official Google Ads platform, and real-time performance tracking.',
    alternates: {
      canonical: `https://medyapr.com/${locale}/hizmetler`,
    },
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  const iconMap: Record<string, any> = {
    play: Play,
    users: Users,
    thumbsUp: ThumbsUp,
    messageCircle: MessageCircle,
    clock: Clock,
    zap: Zap,
  };

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
                    name: locale === 'tr' ? 'Hizmetler' : 'Services',
                    item: `https://medyapr.com/${locale}/hizmetler`,
                  },
                ],
              },
              {
                '@type': 'Service',
                name: locale === 'tr' ? 'YouTube Klip PR ve Video Reklam Hizmetleri' : 'YouTube Video & Music PR Services',
                provider: {
                  '@type': 'Organization',
                  name: 'MedyaPR',
                  url: 'https://medyapr.com',
                },
                serviceType: 'Dijital Müzik PR ve Video Reklam Yönetimi',
                description: dict.services.subtitle,
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: 'MedyaPR YouTube Hizmet Kataloğu',
                  itemListElement: (dict.services?.items || []).map((s: any) => ({
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: s.title,
                      description: s.desc,
                    },
                  })),
                },
              },
            ],
          }),
        }}
      />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#1A1A2E] py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF0033] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#FF6B6B] rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">
            {dict.services.title}
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
            {dict.services.subtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dict.services.items.map((service: any, idx: number) => {
              const IconComponent = iconMap[service.icon] || Play;
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                >
                  {/* Badge */}
                  {service.badge && (
                    <span className="absolute top-6 right-6 px-3 py-1 bg-gradient-to-r from-[#FF0033] to-[#FF6B6B] text-white text-xs font-bold rounded-full">
                      {service.badge}
                    </span>
                  )}

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:from-[#FF0033] group-hover:to-[#CC0029] transition-all duration-500">
                    <IconComponent
                      size={28}
                      className="text-[#FF0033] group-hover:text-white transition-colors duration-500"
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#1A1A2E] mb-3 group-hover:text-[#FF0033] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {['Google Ads', locale === 'tr' ? 'Gerçek İzlenme' : 'Real Views', locale === 'tr' ? 'Hedefli Kitle' : 'Targeted Audience'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={14} className="text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={`/${locale}/iletisim`}
                    className="inline-flex items-center gap-2 text-[#FF0033] font-semibold text-sm group-hover:gap-3 transition-all"
                  >
                    {dict.pricing?.cta || 'Hemen Başla'}
                    <ArrowRight size={16} />
                  </Link>

                  {/* Hover border accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF0033] to-[#FF6B6B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
