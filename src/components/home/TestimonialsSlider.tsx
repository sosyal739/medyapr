'use client';

/**
 * TestimonialsSlider — Testimonial cards section.
 *
 * 2×2 grid on desktop, single column on mobile.
 * Each card: quote text, name, role, 5-star rating, quote icon decoration.
 * White bg, subtle shadow, hover effect.
 */

interface TestimonialsSliderProps {
  dict: any;
}

export default function TestimonialsSlider({ dict }: TestimonialsSliderProps) {
  const t = dict?.testimonials ?? {};

  const sectionTitle = t.title ?? 'Müşterilerimiz Ne Diyor?';
  const sectionSubtitle =
    t.subtitle ?? 'Binlerce müşterimizden bazılarının deneyimleri.';

  const testimonials = t.items ?? [
    {
      quote:
        'Google Ads ile aldığımız izlenmeler tamamen gerçek. Kanal analitiklerinde net bir şekilde görebiliyoruz. Kesinlikle tavsiye ederim.',
      name: 'Ahmet Yılmaz',
      role: 'YouTuber • 120K Abone',
      rating: 5,
    },
    {
      quote:
        'Profesyonel paketlerini kullandık ve 2 hafta içinde hedeflediğimiz izlenme sayısına ulaştık. Mükemmel hizmet.',
      name: 'Elif Demir',
      role: 'Dijital Pazarlama Uzmanı',
      rating: 5,
    },
    {
      quote:
        'Müşteri desteği gerçekten harika. Her soruma anında dönüş yaptılar ve kampanyamı optimize ettiler.',
      name: 'Mehmet Kaya',
      role: 'E-Ticaret Girişimcisi',
      rating: 5,
    },
    {
      quote:
        'Daha önce farklı servisler denedim ama MedyaPR\'ın Google Ads altyapısı sayesinde sonuçlar çok daha kalıcı.',
      name: 'Zeynep Aksoy',
      role: 'İçerik Üreticisi • 50K Abone',
      rating: 4,
    },
  ];

  const renderStars = (count: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ${i < count ? 'text-[#F59E0B]' : 'text-gray-200'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );

  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#1A1A2E] sm:text-4xl">
            {sectionTitle}
          </h2>
          <p className="text-lg leading-relaxed text-[#6B7280]">{sectionSubtitle}</p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {(testimonials as any[]).map((item: any, i: number) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8"
            >
              {/* Quote decoration */}
              <div className="pointer-events-none absolute right-6 top-6 text-[#FF0033]/5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Stars */}
              <div className="mb-4">{renderStars(item.rating ?? 5)}</div>

              {/* Quote text */}
              <p className="mb-6 text-sm leading-relaxed text-[#6B7280] sm:text-base">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0033] to-[#FF6B6B] text-sm font-bold text-white">
                  {(item.name as string)
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{item.name}</p>
                  <p className="text-xs text-[#6B7280]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
