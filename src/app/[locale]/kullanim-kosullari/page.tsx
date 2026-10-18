import type { Metadata } from 'next';
import Link from 'next/link';
import { FileCheck, AlertCircle, ArrowLeft } from 'lucide-react';

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
        ? 'Kullanım Koşulları | MedyaPR Resmi Video Ajansı'
        : 'Terms of Service | MedyaPR Official Video PR',
    },
    description: isTr
      ? 'MedyaPR hizmet kullanım şartları. Kampanya onay süreçleri, YouTube reklam politikaları, ödeme koşulları ve kurumsal hizmet kuralları.'
      : 'Terms and conditions of MedyaPR video promotion services. Campaign approval, Google Ads policy compliance, payment terms, and service rules.',
    alternates: getPageAlternates(locale, '/kullanim-kosullari'),
  };
}

export default async function TermsPage({ params }: Props) {
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
        name: isTr ? 'Kullanım Koşulları' : 'Terms of Service',
        item: `https://medyapr.com/${locale}/kullanim-kosullari`,
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
          <span className="text-[#FF6B6B]">{isTr ? 'Kullanım Koşulları' : 'Terms of Service'}</span>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl space-y-8">
          <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF0033]/20 text-[#FF0033]">
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isTr ? 'Hizmet Kullanım Koşulları' : 'Terms of Service'}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                {isTr ? 'Yürürlük Tarihi: 10 Ekim 2026 • MedyaPR Resmi Sözleşmesi' : 'Effective Date: October 2026 • MedyaPR Terms'}
              </p>
            </div>
          </div>

          <section className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <h2 className="text-lg font-bold text-white">
              {isTr ? '1. Hizmet Kapsamı ve Google Ads Reklam Ağı' : '1. Scope of Service & Google Ads Network'}
            </h2>
            <p>
              {isTr
                ? 'MedyaPR, müşterilerinin YouTube videolarını ve müzik kliplerini resmi Google Ads video reklamları üzerinden hedef kitleye ulaştırır. Tüm izlenmeler doğrudan Google altyapısı üzerinden üretilir ve YouTube Studio analitiklerinde tescillenir. Sahte bot veya SMM panelleri kesinlikle kullanılmaz.'
                : 'MedyaPR provides targeted video campaigns exclusively via the official Google Ads network. Zero bot or SMM panel services are utilized.'}
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              {isTr ? '2. Reklam Onayı ve Ödeme Koşulları' : '2. Approval and Payment Terms'}
            </h2>
            <p>
              {isTr
                ? 'Sipariş verildiğinde video Google Partner uzmanlarımız tarafından ön incelemeden geçirilir ve Google Ads onay sürecine iletilir. Ödeme planı teklif aşamasında yazılı olarak netleştirilir; sitede online ödeme alınmaz.'
                : 'The payment plan is agreed in writing at the quote stage; no online payment is taken on the site.'}
            </p>
          </section>

          <section className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
            <h2 className="text-lg font-bold text-white">
              {isTr ? '3. İçerik ve Politika Uyumluluğu' : '3. Content Policy Compliance'}
            </h2>
            <p>
              {isTr
                ? 'Google Ads reklam politikalarına (telif hakları, şiddet, nefret söylemi vb.) aykırı olan videolar onay alamaz. Onay alamayan videolar için herhangi bir ücret talep edilmez veya peşin alınmışsa %100 iade edilir.'
                : 'Videos violating Google Advertising guidelines cannot be approved. Rejected campaigns incur zero fees, and any deposits are fully refunded.'}
            </p>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>{isTr ? 'Sözleşme soruları: info@medyapr.com' : 'Contract inquiries: info@medyapr.com'}</span>
            <Link href={`/${locale}/iletisim`} className="text-[#FF6B6B] hover:underline font-semibold">
              {isTr ? 'Uzmanımıza Danışın →' : 'Ask an Expert →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
