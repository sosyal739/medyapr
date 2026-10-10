import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: {
      absolute: isTr
        ? 'Gizlilik Politikası | MedyaPR Güvenli Video Ajansı'
        : 'Privacy Policy | MedyaPR Secure Video PR Agency',
    },
    description: isTr
      ? 'MedyaPR gizlilik ve veri güvenliği ilkeleri. Kanal bilgileri, sipariş güvenliği, YouTube API kullanımı ve KVKK/GDPR uyumluluğu hakkında detaylar.'
      : 'MedyaPR privacy and data security policy. Video campaign security, channel protection, zero credential requests, and GDPR compliance standards.',
    alternates: {
      canonical: `https://medyapr.com/${locale}/gizlilik`,
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
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
        name: isTr ? 'Gizlilik Politikası' : 'Privacy Policy',
        item: `https://medyapr.com/${locale}/gizlilik`,
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
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            {isTr ? 'Ana Sayfa' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#FF6B6B]">{isTr ? 'Gizlilik Politikası' : 'Privacy Policy'}</span>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl space-y-8">
          <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0033]/20 text-[#FF0033]">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isTr ? 'Gizlilik ve Veri Güvenliği Politikası' : 'Privacy & Data Protection Policy'}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                {isTr ? 'Son Güncelleme: 10 Ekim 2026 • Resmi Google Partner Standartları' : 'Last Updated: October 2026 • Google Partner Standards'}
              </p>
            </div>
          </div>

          <section className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              {isTr ? '1. Kanal Şifresi ve Giriş Bilgisi Talep Edilmez' : '1. Zero Password or Channel Access Required'}
            </h2>
            <p>
              {isTr
                ? 'MedyaPR, 18 yılı aşkın hizmet süresi boyunca müşterilerinden asla YouTube kanal şifresi, hesap erişimi veya yönetici yetkisi talep etmez. Tanıtım operasyonları yalnızca herkese açık (public) video linki üzerinden resmi Google Ads video ağıyla yürütülür.'
                : 'MedyaPR never asks for your YouTube channel password or login credentials. All campaigns are operated strictly through public video URLs via the official Google Ads network.'}
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#FF6B6B]" />
              {isTr ? '2. Toplanan Bilgiler ve Kullanım Amacı' : '2. Information Collected and Usage'}
            </h2>
            <p>
              {isTr
                ? 'Sipariş ve iletişim süreçlerinde sağlanan ad, e-posta, telefon ve video linki bilgileri yalnızca Google Ads kampanya kurulumu, onay bildirimi ve performans raporlaması amacıyla kullanılır. Bilgileriniz hiçbir üçüncü partiyle paylaşılmaz, satılmaz veya ticari veri tabanlarına aktarılmaz.'
                : 'Contact details provided during order processing are strictly utilized for Google Ads campaign approval, updates, and reporting. Your data is never sold or shared with third parties.'}
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <h2 className="text-lg font-bold text-white">
              {isTr ? '3. YouTube API ve Google Hizmet Şartları Uyumu' : '3. Google & YouTube Terms Compliance'}
            </h2>
            <p>
              {isTr
                ? 'Sitemizdeki canlı trendler ve istatistikler, YouTube Data API v3 resmi protokolleri çerçevesinde sunulur. Tüm reklam gösterimleri Google Reklam Politikaları ve YouTube Partner Programı (YPP) şartlarına %100 uyumludur.'
                : 'Our platform adheres 100% to Google Advertising Policies, YouTube Terms of Service, and YouTube Partner Program guidelines with complete channel safety.'}
            </p>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>Sorularınız için: info@medyapr.com</span>
            <Link href={`/${locale}/iletisim`} className="text-[#FF6B6B] hover:underline font-semibold">
              {isTr ? 'İletişim Hattına Git →' : 'Contact Support →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
