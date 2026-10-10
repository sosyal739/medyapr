'use client';

/**
 * WhyGoogleAds — USP (Unique Selling Proposition) section.
 *
 * Centered title + subtitle, 3×2 benefit cards with gradient icon circles,
 * decorative left element, subtle hover animations.
 */

interface WhyGoogleAdsProps {
  dict: any;
}

export default function WhyGoogleAds({ dict }: WhyGoogleAdsProps) {
  const t = dict?.whyGoogleAds ?? {};

  const sectionTitle = t.title ?? 'Neden Google Ads ile İzlenme?';
  const sectionSubtitle =
    t.subtitle ??
    'Google Ads altyapısının sunduğu avantajlarla YouTube kanalınızı güvenle büyütün.';

  const benefits = t.benefits ?? [
    {
      title: 'Gerçek İzleyiciler',
      description:
        'Bot veya sahte trafik yok. Tüm izlenimler Google Ads üzerinden gerçek kullanıcılardan gelir.',
    },
    {
      title: 'Hedeflenmiş Kitle',
      description:
        'Yaş, konum, ilgi alanı gibi kriterlere göre tam olarak hedef kitlenize ulaşın.',
    },
    {
      title: 'Kanal Güvenliği',
      description:
        'Google\'ın kendi reklam platformunu kullandığınız için kanalınız %100 güvende.',
    },
    {
      title: 'Hızlı Sonuçlar',
      description:
        'Kampanyanız dakikalar içinde başlar ve sonuçları anında görmeye başlarsınız.',
    },
    {
      title: 'Şeffaf Raporlama',
      description:
        'Google Ads panelinden tüm verileri gerçek zamanlı olarak takip edebilirsiniz.',
    },
    {
      title: 'Uygun Fiyat',
      description:
        'Bütçenize uygun paketlerle profesyonel sonuçlar elde edin. Gizli maliyet yok.',
    },
  ];

  const icons = [
    /* Users */
    <svg key="u" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>,
    /* Target */
    <svg key="t" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
    /* Shield */
    <svg key="s" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    /* Zap */
    <svg key="z" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    /* BarChart */
    <svg key="b" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
    /* DollarSign */
    <svg key="d" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  ];

  return (
    <section className="relative overflow-hidden bg-gray-50 py-20 md:py-28">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-[#FF0033]/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#FF6B6B]/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-[#FF0033]/10 px-4 py-1.5 text-sm font-semibold text-[#FF0033]">
            Google Ads
          </span>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#1A1A2E] sm:text-4xl">
            {sectionTitle}
          </h2>
          <p className="text-lg leading-relaxed text-[#6B7280]">{sectionSubtitle}</p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(benefits as any[]).map((b: any, i: number) => (
            <div
              key={i}
              className="group rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon in gradient circle */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FF0033] to-[#FF6B6B] text-white shadow-md shadow-[#FF0033]/20 transition-transform duration-300 group-hover:scale-110">
                {icons[i % icons.length]}
              </div>

              <h3 className="mb-2 text-lg font-bold text-[#1A1A2E]">{b.title}</h3>
              <p className="text-sm leading-relaxed text-[#6B7280]">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
