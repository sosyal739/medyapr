import type { Metadata } from 'next';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: {
      absolute: isTr
        ? 'İade ve Garanti Politikası | MedyaPR Güvencesi'
        : 'Refund & Guarantee Policy | MedyaPR Video PR',
    },
    description: isTr
      ? 'MedyaPR %100 onay garantisi ve iade şartları. Reklam onayı alamayan veya tamamlanamayan kampanyalar için anında tam iade ve müşteri koruma ilkeleri.'
      : 'MedyaPR 100% approval and refund guarantee. Complete money-back policy if campaigns are not approved by Google Ads or delivery falls short.',
    alternates: {
      canonical: `https://medyapr.com/${locale}/iade-politikasi`,
    },
  };
}

export default async function RefundPage({ params }: Props) {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const schema = {
    '@context': 'https://schema.org',
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
        name: isTr ? 'İade ve Garanti Politikası' : 'Refund & Guarantee Policy',
        item: `https://medyapr.com/${locale}/iade-politikasi`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-studio-gradient text-white py-14 md:py-20 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="relative mx-auto max-w-4xl px-4 md:px-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            {isTr ? 'Ana Sayfa' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#FF6B6B]">{isTr ? 'İade Politikası' : 'Refund Policy'}</span>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl space-y-8">
          <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isTr ? 'İade ve Performans Garanti Politikası' : 'Refund & Performance Guarantee Policy'}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                {isTr ? '18+ Yıllık Güven • %100 Resmi Google Partner Koruma Standardı' : '18+ Years Track Record • Official Google Partner Security'}
              </p>
            </div>
          </div>

          <section className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              {isTr ? '1. Reklam Onayı Alınamazsa %100 İade' : '1. 100% Refund if Campaign Is Not Approved'}
            </h2>
            <p>
              {isTr
                ? 'İlettiğiniz video YouTube veya Google Ads politikaları nedeniyle onay alamazsa, sizden hiçbir komisyon veya işlem ücreti kesilmez. Yapılmış herhangi bir ön ödeme varsa 24 saat içinde eksiksiz olarak banka hesabınıza iade edilir.'
                : 'If your video fails Google Ads review due to policy reasons, zero fees are charged and any deposit is refunded in full within 24 hours.'}
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <h2 className="text-lg font-bold text-white">
              {isTr ? '2. Aşamalı Ödeme Güvencesi' : '2. Phased Payment Security'}
            </h2>
            <p>
              {isTr
                ? 'MedyaPR standart olarak tüm müşterilerine aşamalı ödeme modeli uygular: Ödemenin yarısı (%50) video onaylandığında, kalan yarısı (%50) ise kampanya tamamlanıp YouTube Studio\'ya yansıdığında alınır. Hedeflenen izlenme teslim edilmeden ikinci ödeme asla talep edilmez.'
                : 'With our phased payment model (50% on approval, 50% on full delivery), your budget is completely secured at all stages of promotion.'}
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <h2 className="text-lg font-bold text-white">
              {isTr ? '3. Ömür Boyu Kalıcı İzlenme Garantisi' : '3. Lifetime Permanent View Guarantee'}
            </h2>
            <p>
              {isTr
                ? 'Resmi Google Ads reklamları üzerinden sağlanan tüm izlenmeler, beğeniler ve abonelikler YouTube kanalınızda ömür boyu kalıcıdır. Sahte panellerin aksine sonradan silinme veya düşüş yaşanmaz.'
                : 'All views, likes, and subscribers generated via official Google Ads video campaigns are 100% authentic and permanent for the lifetime of your video.'}
            </p>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>Finans & İade birimi: muhasebe@medyapr.com</span>
            <Link href={`/${locale}/iletisim`} className="text-[#FF6B6B] hover:underline font-semibold">
              {isTr ? 'Müşteri Temsilcisine Bağlan →' : 'Contact Support →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
