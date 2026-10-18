import type { Metadata } from 'next';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import TrendingCountryTabs from '@/components/trends/TrendingCountryTabs';
import { getTrends, type TrendingSong } from '@/lib/youtube';
import { formatMoney, quote } from '@/lib/pricing';
import GlobalTrendsConversionBanner from '@/components/trends/GlobalTrendsConversionBanner';
import { getPageAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';
  return {
    title: {
      absolute: isAr
        ? 'كليبات يوتيوب الأكثر رواجًا في السعودية ومصر والمغرب | MedyaPR'
        : isTr
        ? 'Dünya & Türkiye YouTube Trend Müzik Klipleri | MedyaPR'
        : 'Trending YouTube Music Videos: US, UK, DE, TR | MedyaPR',
    },
    description: isAr
      ? 'قوائم يوتيوب لأكثر الكليبات الموسيقية رواجًا في السعودية ومصر والمغرب: المشاهدات والإعجابات لكل كليب، مع استراتيجيات الترويج عبر إعلانات Google Ads الرسمية.'
      : isTr
      ? 'YouTube Türkiye, ABD, Almanya ve İngiltere canlı müzik trendleri sıralaması. Günlük izlenme artışları, resmi liste verileri ve klip PR stratejileri.'
      : 'Real-time trending YouTube music videos across the US, UK, Germany, and Turkey. Live view velocity, algorithm benchmarks, and official PR promotion strategies.',
    alternates: getPageAlternates(locale, '/trendler'),
    openGraph: {
      title: isAr
        ? 'كليبات يوتيوب الأكثر رواجًا في السعودية ومصر والمغرب | MedyaPR'
        : isTr
        ? 'Dünya & Türkiye YouTube Trend Müzik Klipleri | MedyaPR'
        : 'Trending YouTube Music Videos: US, UK, DE, TR | MedyaPR',
      description: isAr
        ? 'قوائم يوتيوب لأكثر الكليبات الموسيقية رواجًا في السعودية ومصر والمغرب: المشاهدات والإعجابات لكل كليب، مع استراتيجيات الترويج عبر إعلانات Google Ads الرسمية.'
        : isTr
        ? 'YouTube Türkiye, ABD, Almanya ve İngiltere canlı müzik trendleri sıralaması. Günlük izlenme artışları ve resmi liste verileri.'
        : 'Real-time trending YouTube music videos across the US, UK, Germany, and Turkey.',
      url: `https://medyapr.com/${locale}/trendler`,
      images: ['/og-image.jpg'],
    },
  };
}

// Trend listesi 6 saatte bir yenilenir (YOUTUBE_API_KEY varsa canlı veri).
export const revalidate = 21600;

export default async function TrendlerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';
  const { trends: allTrends, updatedAt } = await getTrends();
  const primaryList = isAr ? allTrends.sa : isTr ? allTrends.tr : allTrends.us;
  const primarySongs: TrendingSong[] = primaryList.length > 0 ? primaryList : allTrends.tr;

  const todayStr = updatedAt
    ? new Date(updatedAt).toLocaleDateString(isAr ? 'ar-u-nu-latn-ca-gregory' : isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const region = isTr ? 'tr' : isAr ? 'global' : 'premium';
  const currency = isTr ? 'TRY' : 'USD';
  const price = (views: number) => {
    const q = quote({ views, region, currency });
    return `${formatMoney(q.total, currency, locale)} · ${isAr ? 'إعلانات Google Ads الرسمية' : isTr ? 'resmî Google Ads' : 'official Google Ads'}`;
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isAr ? 'الرئيسية' : isTr ? 'Ana Sayfa' : 'Home',
            item: `https://medyapr.com/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isAr ? 'الموسيقى الأكثر رواجًا' : isTr ? 'Trend Şarkılar' : 'Trending Music',
            item: `https://medyapr.com/${locale}/trendler`,
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: isAr
          ? 'قائمة كليبات يوتيوب الأكثر رواجًا في السعودية ومصر والمغرب'
          : isTr
          ? 'YouTube Trend Müzik Klipleri Listesi (Türkiye & Dünya)'
          : 'YouTube Trending Music Videos Chart (Global & Regional)',
        description: isAr
          ? 'الترتيب الرسمي لكليبات يوتيوب الأكثر رواجًا في السعودية ومصر والمغرب.'
          : isTr
          ? 'YouTube canlı müzik listesinde en çok izlenen ve yükselişte olan şarkılar sıralaması.'
          : 'Official ranking of trending YouTube music videos across the US, UK, Germany, and Turkey.',
        itemListElement: primarySongs.slice(0, 20).map((s, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: `${s.artist} - ${s.title}`,
          url: `https://www.youtube.com/watch?v=${s.videoId}`,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-studio-gradient text-white py-14 md:py-20 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Background glow */}
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#FF0033]/15 blur-[160px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[150px] animate-float-drift" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        {/* Breadcrumb / Top Tag */}
        <div className="mb-4 flex items-center gap-2 text-xs text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-white transition">
            {isAr ? 'الرئيسية' : isTr ? 'Ana Sayfa' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#FF6B6B]">{isAr ? 'الموسيقى الأكثر رواجًا' : isTr ? 'Trend Şarkılar' : 'Trending Music'}</span>
        </div>

        {/* Header */}
        <div className="mb-10 border-b border-studio pb-8">
{todayStr && (
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E] mb-3">
            <Flame className="h-4 w-4 animate-pulse text-[#FF0033]" />
            {isAr ? `آخر تحديث · ${todayStr}` : isTr ? `Son güncelleme · ${todayStr}` : `Last updated · ${todayStr}`}
          </div>
          )}
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight">
            {isAr
              ? (
              <>
                كليبات يوتيوب{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                 الأكثر رواجًا في العالم العربي
                </span>
              </>
            )
              : isTr ? (
              <>
                Dünya &amp; Türkiye YouTube{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Trend Müzik Klipleri
                </span>
              </>
            ) : (
              <>
                Global &amp; Regional YouTube{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Trending Music Videos
                </span>
              </>
            )}
          </h1>
          <p className="mt-3 text-sm md:text-base text-zinc-300 max-w-3xl leading-relaxed">
            {isAr
              ? "قوائم يوتيوب لأكثر الكليبات الموسيقية رواجًا في السعودية ومصر والمغرب، مع إجمالي المشاهدات والإعجابات لكل كليب."
              : isTr
              ? "YouTube'un Türkiye, ABD, Almanya ve İngiltere için yayınladığı resmî “En Popüler Müzik” listeleri. Kliplerin toplam izlenme ve beğeni sayıları."
              : "YouTube's official “Most Popular Music” charts for Turkey, the US, Germany and the UK, with total views and likes."}
          </p>
        </div>

        {/* Global Fast-Launch / Direct Conversion Banner */}
        <GlobalTrendsConversionBanner locale={locale} />

        {/* Interactive Multi-Country Tabs & Songs Grid */}
        <TrendingCountryTabs trends={allTrends} locale={locale} initialCountry={isAr ? 'sa' : isTr ? 'tr' : 'us'} />

        {/* ── Klip Lansman Planları & Dönüşüm Bölümü (Sanatçılar & Müzisyenler İçin) ── */}
        <div className="mt-16 rounded-3xl border border-[#FF0033]/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="max-w-3xl mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/20 px-3.5 py-1 text-xs font-extrabold text-[#FF6B6B] uppercase tracking-wider mb-3">
              {isAr ? '🚀 استراتيجية ترند يوتيوب عبر إعلانات Google Ads الرسمية' : isTr ? '🚀 Resmi Google Ads ile YouTube Trend Stratejisi' : '🚀 Official Google Ads YouTube Trending Strategy'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isAr
                ? 'خطط إطلاق الكليب لدخول ترند يوتيوب'
                : isTr
                ? 'Kendi Klibinizi YouTube Trendlerine Taşıyacak Lansman Planları'
                : 'Music Video Launch Plans to Break Into YouTube Trending'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
              {isAr
                ? 'اعرض كليبك على جمهورك المستهدف عبر إعلانات فيديو Google Ads الرسمية. الصق رابطك، وشاهد مشاهداتك الحالية، واختر باقتك. يبدأ الدفع بعد الموافقة على الإعلان.'
                : isTr
                ? 'Kendi klibinizi resmî Google Ads video reklamlarıyla hedef kitlenize gösterin. Linkinizi yapıştırın, mevcut izlenmenizi görün, paketinizi seçin. Ödeme reklam onayından sonra alınır.'
                : 'Show your own music video to your target audience with official Google Ads video ads. Paste your link, see your current views, pick a package. Payment starts after ad approval.'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Paket 1: Starter Launch */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {isAr ? 'إطلاق البداية' : isTr ? 'Başlangıç Lansmanı' : 'Starter Launch'}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{isAr ? 'ترويج البداية' : 'Starter PR'}</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">50.000</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">{isAr ? 'مشاهدات حقيقية' : isTr ? 'Gerçek İzlenme' : 'Real Views'}</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    {price(50_000)}
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ {isAr ? 'إعلانات In-Stream رسمية قابلة للتخطي' : isTr ? 'Atlanabilir In-Stream Resmi Reklam' : 'Skippable In-Stream Official Ads'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'موثّق بنسبة 100% في YouTube Studio / Analytics' : isTr ? '%100 YouTube Studio / Analytics Tescili' : '100% YouTube Studio / Analytics Verified'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'استهداف النوع الموسيقي والفئة الديموغرافية' : isTr ? 'Müzik Türü & Demografik Hedefleme' : 'Music Genre & Demographic Targeting'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'تحليل أولًا ثم عرض سعر' : isTr ? 'Önce Analiz, Sonra Teklif' : 'Review First, Then Quote'}</li>
                </ul>
              </div>
              <a
                href={`/${locale}/order?views=50000&region=${region}&currency=${currency}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-xs font-extrabold text-white hover:bg-zinc-700 transition"
              >
                {isAr ? 'اختر الباقة وابدأ' : isTr ? 'Paketi Seç & Başlat' : 'Select Plan & Start'}
              </a>
            </div>

            {/* Paket 2: Growth Momentum (Öne Çıkan) */}
            <div className="rounded-2xl border-2 border-[#FF0033] bg-gradient-to-b from-[#FF0033]/15 via-zinc-900/90 to-zinc-950 p-6 flex flex-col justify-between shadow-xl shadow-[#FF0033]/20 relative">
              <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-3 py-0.5 text-[11px] font-black text-white uppercase tracking-wider shadow-md">
                {isAr ? 'الإطلاق الأكثر طلبًا' : isTr ? 'En Popüler Klip Lansmanı' : 'Most Popular Launch'}
              </span>
              <div>
                <span className="text-xs font-bold text-[#FF6B6B] uppercase tracking-wider">
                  {isAr ? 'الخوارزمية والفيديوهات المقترحة' : isTr ? 'Algoritma & Keşfet' : 'Algorithm & Suggested'}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{isAr ? 'زخم النمو' : 'Growth Momentum'}</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">100.000</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">{isAr ? 'مشاهدات حقيقية' : isTr ? 'Gerçek İzlenme' : 'Real Views'}</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    {price(100_000)}
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-200 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ {isAr ? 'إعلانات In-Stream + إعلانات الاكتشاف In-Feed' : isTr ? 'In-Stream + In-Feed Keşfet Reklamı' : 'In-Stream + In-Feed Discovery Ads'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'استهدف معجبي الفنانين الناجحين المشابهين' : isTr ? 'Benzer Sanatçıların Kitlelerine Gösterim' : 'Target Fans of Similar Hit Artists'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'تقرير شامل للحملة والتحويلات' : isTr ? 'Detaylı Kampanya ve Dönüşüm Raporu' : 'Comprehensive Campaign & Conversion Report'}</li>
                  <li className="flex items-center gap-2 font-bold text-emerald-400">✓ {isAr ? 'تحليل أولًا ثم عرض سعر' : isTr ? 'Önce Analiz, Sonra Teklif' : 'Review First, Then Quote'}</li>
                </ul>
              </div>
              <a
                href={`/${locale}/order?views=100000&region=${region}&currency=${currency}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-4 py-3 text-xs font-black text-white shadow-lg shadow-[#FF0033]/30 hover:brightness-110 transition"
              >
                {isAr ? 'ابدأ الآن' : isTr ? 'Hemen Başlat' : 'Launch Now'} <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Paket 3: Viral Trend PR */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {isAr ? 'الترند والانتشار العالمي' : isTr ? 'Trend & Ulusal Çıkış' : 'Trend & Global Reach'}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{isAr ? 'الانتشار الواسع' : 'Viral Breakthrough'}</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">250.000</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">{isAr ? 'مشاهدات حقيقية' : isTr ? 'Gerçek İzlenme' : 'Real Views'}</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    {price(250_000)}
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ {isAr ? 'مزيج YouTube Shorts وإعلانات الفيديو' : isTr ? 'YouTube Shorts + Video Reklam Karması' : 'YouTube Shorts + Video Ads Mix'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'السعودية ومصر والمغرب وجمهور عربي متقاطع' : isTr ? 'Türkiye & Avrupa (Gurbetçi) Kitle Hedefi' : 'US, UK, DE & Global Cross-Audience'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'دعم أولوية عبر WhatsApp / Telegram' : isTr ? 'Öncelikli WhatsApp / Telegram desteği' : 'Priority WhatsApp / Telegram support'}</li>
                </ul>
              </div>
              <a
                href={`/${locale}/order?views=250000&region=${region}&currency=${currency}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-xs font-extrabold text-white hover:bg-zinc-700 transition"
              >
                {isAr ? 'اختر الباقة وابدأ' : isTr ? 'Paketi Seç & Başlat' : 'Select Plan & Start'}
              </a>
            </div>
          </div>

          {/* Quick WhatsApp Consultation Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-zinc-800/50 p-4 border border-zinc-700/50">
            <div className="text-xs text-zinc-300 text-center sm:text-left">
              💬 <strong className="text-white">
                {isAr
                  ? 'أرسل طلب عرض السعر وسنحلل فيديوك ونردّ عليك بالتفصيل.'
                  : isTr
                  ? 'Teklifinizi iletin, videonuzu analiz edip detaylı dönüş yapalım.'
                  : 'Submit your quote; we will analyze your video and reply in detail.'}
              </strong>{' '}
              {isAr
                ? 'يبدأ العمل بعد الموافقة. قد يختلف السعر حسب مدة الفيديو.'
                : isTr
                ? 'Onay alınca işlem başlar. Fiyatlandırma video uzunluğuna göre değişebilir.'
                : 'Work begins upon approval. Pricing may vary based on video length.'}
            </div>
            <a
              href={`https://wa.me/905312993355?text=${encodeURIComponent(
                isTr
                  ? 'Merhaba, klip lansmanım için teklif iletmek ve detaylı analiz almak istiyorum.'
                  : 'Hello, I would like to submit a quote and request a detailed analysis for my music video.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition"
            >
              {isAr ? 'أرسل طلب العرض عبر WhatsApp' : isTr ? 'WhatsApp ile Teklif İlet' : 'Send Quote on WhatsApp'}
            </a>
          </div>
        </div>

        {/* Footer Policy Attribution */}
        <div className="mt-14 rounded-2xl border border-studio bg-studio-card p-6 text-xs text-zinc-400 space-y-2">
          <p className="font-semibold text-zinc-200">
            📌 {isAr ? 'شروط خدمة YouTube API وإشعار حقوق النشر' : isTr ? 'YouTube API Hizmet Politikaları & Telif Bildirimi' : 'YouTube API Terms of Service & Copyright Notice'}
          </p>
          <p>
            {isAr
              ? 'تُجلب عناوين الفيديوهات والصور المصغرة وإحصاءات المشاهدات المعروضة في هذه القائمة عبر YouTube Data API v3 الرسمية. جميع حقوق النشر والعلامات التجارية مملوكة لأصحابها من الفنانين وشركات التسجيلات. ولا يعني إدراج عمل في هذه القائمة أي تأييد تجاري.'
              : isTr
              ? 'Bu sayfada yer alan video başlıkları, küçük resimler ve izlenme istatistikleri resmî YouTube Data API v3 aracılığıyla alınır ve periyodik olarak güncellenir. Listede yer alan eserler ve telif hakları ilgili sanatçılara ve yapım şirketlerine aittir. Listede bulunmak sanatçıların sitemizle ticari ilişkisi olduğu anlamına gelmez.'
              : 'Video titles, thumbnails, and view statistics displayed on this chart are retrieved via official YouTube Data API v3. All copyrights and trademarks belong to their respective artists and record labels. Inclusion on this chart does not imply commercial endorsement.'}
          </p>
        </div>
      </div>
    </div>
  );
}
