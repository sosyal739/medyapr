import type { Metadata } from 'next';
import OrderWizard from '@/components/order/OrderWizard';
import { getAppStrings } from '@/lib/i18n/app-strings';
import { CURRENCIES, FORMATS, PACKAGES, REGIONS, clampViews, type Currency, type Format, type Package, type Region } from '@/lib/pricing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Teklif İlet & Video Analizi' : 'Submit Quote & Video Analysis',
    robots: { index: false },
  };
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function OrderPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = getAppStrings(locale);
  const isTr = locale === 'tr';
  const pick = <T extends string>(list: readonly T[], v: string | undefined, d: T): T => (list.includes(v as T) ? (v as T) : d);
  const CHANNELS = ['whatsapp', 'telegram', 'email'] as const;

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-studio-gradient py-10 text-white md:py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-6 md:mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-white md:text-4xl">
            {isTr ? 'Video Linkinizi Girin, Paketinizi Seçip Analiz İsteyin' : 'Enter Your Video Link, Pick a Package & Request Analysis'}
          </h1>
          <p className="mt-2 text-sm text-white/75 md:text-base max-w-3xl leading-relaxed">
            {isTr
              ? 'YouTube video linkinizi yapıştırın ve hedef paketinizi seçin; teklifinizi WhatsApp ile, Telegram ile veya Mail (E-Posta) ile bize iletin. Uzman ekibimiz videonuzu analiz edip detaylı dönüş yapsın, onay alınca işlem başlar. (Fiyatlandırma video uzunluğuna göre değişebilir.)'
              : 'Paste your YouTube video link and choose your target package; send your quote request via WhatsApp, Telegram, or Email. Our specialists will analyze your video and reply in detail; work begins upon approval. (Pricing may vary based on video length.)'}
          </p>
        </div>

        <OrderWizard
          locale={locale}
          t={t}
          initial={{
            views: clampViews(Number(sp.views) || 25_000),
            format: pick<Format>(FORMATS, sp.format, 'instream'),
            pkg: pick<Package>(PACKAGES, sp.pkg, 'views'),
            region: pick<Region>(REGIONS, sp.region, isTr ? 'tr' : 'premium'),
            currency: pick<Currency>(CURRENCIES, sp.currency, isTr ? 'TRY' : 'USD'),
            videoUrl: sp.video?.slice(0, 300),
            channel: pick(CHANNELS, sp.channel, 'whatsapp'),
          }}
        />
      </div>
    </section>
  );
}

