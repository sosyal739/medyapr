import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import { Check, Play, Users, ThumbsUp, MessageCircle, Clock, Zap, ArrowRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

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
        ? 'Google Ads YouTube İzlenme & Klip PR Hizmetleri | MedyaPR'
        : 'YouTube Music PR & Google Ads Video Services | MedyaPR',
    },
    description: isTr
      ? 'Resmi Google Ads ile YouTube organik izlenme, şarkı ve klip tanıtımı, Shorts reklamları ve 4000 saat paketleri. Şifre istenmez, %50 onayda güvenli ödeme.'
      : 'Grow your YouTube channel with official Google Ads In-Stream, Shorts and Discovery campaigns. 18+ years experience, zero bots, and 50/50 phased payment.',
    alternates: getPageAlternates(locale, '/hizmetler'),
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const isTr = locale === 'tr';

  const iconMap: Record<string, LucideIcon> = {
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
                    name: isTr ? 'Ana Sayfa' : 'Home',
                    item: `https://medyapr.com/${locale}`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: isTr ? 'YouTube Reklam & PR Hizmetleri' : 'Services',
                    item: `https://medyapr.com/${locale}/hizmetler`,
                  },
                ],
              },
              {
                '@type': 'Service',
                name: isTr ? 'YouTube Klip PR ve Google Ads Video Reklam Hizmetleri' : 'YouTube Video & Music PR Services',
                provider: {
                  '@type': 'Organization',
                  name: 'MedyaPR',
                  url: 'https://medyapr.com',
                },
                serviceType: isTr ? 'Dijital Müzik PR ve Video Reklam Yönetimi' : 'Digital Music PR and Video Ad Management',
                description: dict.services.subtitle,
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: isTr ? 'MedyaPR YouTube Hizmet Kataloğu' : 'MedyaPR YouTube Services Catalog',
                  itemListElement: (dict.services?.items || []).map((s) => ({
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: s.title,
                      description: s.description,
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
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#D9002B] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#FF6B6B] rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
            {dict.services.title}
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
            {dict.services.subtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">
              {isTr
                ? 'Resmi Google Ads ile YouTube Kanal ve Klip Büyütme Çözümleri'
                : 'Official Google Ads YouTube Channel & Music Video Growth Solutions'}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {isTr
                ? 'Tüm paketlerimiz %100 resmi Google Ads reklam altyapısıyla çalışır, YouTube Studio Analytics’te şeffafça raporlanır ve kanal şifresi gerektirmez.'
                : 'All packages run on 100% official Google Ads infrastructure, report transparently in YouTube Studio Analytics, and never require passwords.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dict.services.items.map((service, idx: number) => {
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
                    {['Google Ads', isTr ? 'Gerçek İzlenme' : 'Real Views', isTr ? 'Hedefli Kitle' : 'Targeted Audience'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={14} className="text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Link
                      href={`/${locale}/fiyatlandirma`}
                      className="inline-flex items-center gap-2 text-[#FF0033] font-bold text-sm group-hover:gap-3 transition-all"
                    >
                      {isTr ? 'Fiyatları Hesapla' : 'Calculate Pricing'}
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href={`/${locale}/order`}
                      className="text-xs font-semibold text-gray-500 hover:text-[#1A1A2E] underline"
                    >
                      {isTr ? 'Analiz İste' : 'Request Review'}
                    </Link>
                  </div>

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
