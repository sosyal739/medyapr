'use client';

/**
 * PricingSection — 4-column pricing table.
 *
 * Cards: Başlangıç, Profesyonel (popular/highlighted), Premium, Enterprise.
 * Popular card has red gradient border, 'Popular' badge, and is slightly elevated.
 * Each card: name, price, views, likes, duration, feature list with checkmarks, CTA button.
 * Enterprise card: "Contact us" style.
 */

interface PricingSectionProps {
  dict: any;
}

export default function PricingSection({ dict }: PricingSectionProps) {
  const t = dict?.pricing ?? {};

  const sectionTitle = t.title ?? 'Fiyatlandırma';
  const sectionSubtitle =
    t.subtitle ??
    'İhtiyacınıza uygun paketi seçin. Tüm paketler Google Ads altyapısı ile çalışır.';

  const plans = t.plans ?? [
    {
      name: 'Başlangıç',
      price: '₺499',
      period: '/ay',
      views: '10.000 İzlenme',
      likes: '200 Beğeni',
      duration: '7 Gün',
      popular: false,
      enterprise: false,
      cta: 'Başla',
      features: [
        'Gerçek İzleyiciler',
        'Google Ads Altyapısı',
        'Temel Hedefleme',
        'E-posta Destek',
      ],
    },
    {
      name: 'Profesyonel',
      price: '₺999',
      period: '/ay',
      views: '50.000 İzlenme',
      likes: '1.000 Beğeni',
      duration: '15 Gün',
      popular: true,
      enterprise: false,
      cta: 'En Popüler',
      features: [
        'Gerçek İzleyiciler',
        'Google Ads Altyapısı',
        'Gelişmiş Hedefleme',
        'Öncelikli Destek',
        'Detaylı Raporlama',
        'A/B Testi',
      ],
    },
    {
      name: 'Premium',
      price: '₺1.999',
      period: '/ay',
      views: '150.000 İzlenme',
      likes: '3.000 Beğeni',
      duration: '30 Gün',
      popular: false,
      enterprise: false,
      cta: 'Premium Seç',
      features: [
        'Gerçek İzleyiciler',
        'Google Ads Altyapısı',
        'Premium Hedefleme',
        '7/24 Destek',
        'Detaylı Raporlama',
        'A/B Testi',
        'Özel Danışmanlık',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Özel Fiyat',
      period: '',
      views: 'Sınırsız İzlenme',
      likes: 'Sınırsız Beğeni',
      duration: 'Özel Süre',
      popular: false,
      enterprise: true,
      cta: 'İletişime Geç',
      features: [
        'Tüm Premium Özellikler',
        'Dedicated Account Manager',
        'Özel API Erişimi',
        'SLA Garantisi',
        'Toplu İndirim',
        'Fatura ile Ödeme',
        'Beyaz Etiket Çözüm',
      ],
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#1A1A2E] sm:text-4xl">
            {sectionTitle}
          </h2>
          <p className="text-lg leading-relaxed text-[#6B7280]">{sectionSubtitle}</p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
          {(plans as any[]).map((plan: any, i: number) => {
            const isPopular = plan.popular === true;
            const isEnterprise = plan.enterprise === true;

            return (
              <div
                key={i}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isPopular
                    ? 'border-[#FF0033]/30 bg-white shadow-xl shadow-[#FF0033]/5 ring-2 ring-[#FF0033]/20 scale-[1.02] z-10'
                    : 'border-gray-100 bg-white shadow-sm'
                }`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-4 py-1 text-xs font-bold text-white shadow-md shadow-[#FF0033]/25">
                      ⭐ Popüler
                    </span>
                  </div>
                )}

                {/* Top gradient bar for popular */}
                {isPopular && (
                  <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-[#FF0033] to-[#FF6B6B]" />
                )}

                {/* Plan name */}
                <h3 className="mb-1 text-lg font-bold text-[#1A1A2E]">{plan.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className={`text-3xl font-extrabold ${
                      isEnterprise
                        ? 'bg-gradient-to-r from-[#FF0033] to-[#FF6B6B] bg-clip-text text-transparent'
                        : 'text-[#1A1A2E]'
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-[#6B7280]">{plan.period}</span>
                  )}
                </div>

                {/* Stats */}
                <div className="mb-6 space-y-2 rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF0033]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    <span className="font-medium text-[#1A1A2E]">{plan.views}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF0033]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                    <span className="font-medium text-[#1A1A2E]">{plan.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF0033]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    <span className="font-medium text-[#1A1A2E]">{plan.duration}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="mb-8 flex-1 space-y-3">
                  {(plan.features as string[]).map((f: string, fi: number) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-[#6B7280]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#00C9A7]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`mt-auto w-full rounded-xl py-3 text-sm font-semibold transition-all duration-300 ${
                    isPopular
                      ? 'bg-gradient-to-r from-[#FF0033] to-[#CC0029] text-white shadow-lg shadow-[#FF0033]/25 hover:shadow-xl hover:shadow-[#FF0033]/30'
                      : isEnterprise
                      ? 'border-2 border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white'
                      : 'border-2 border-[#FF0033]/20 text-[#FF0033] hover:bg-[#FF0033] hover:text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
