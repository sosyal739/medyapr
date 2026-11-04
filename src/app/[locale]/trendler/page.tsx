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
  const isEs = locale === 'es';

  return {
    title: {
      absolute: isAr
        ? 'كليبات يوتيوب الأكثر رواجًا في السعودية ومصر والمغرب | MedyaPR'
        : isTr
        ? 'Dünya & Türkiye YouTube Trend Müzik Klipleri | MedyaPR'
        : isEs
        ? 'Videos Musicales en Tendencia en YouTube México, España y Colombia | MedyaPR'
        : 'Trending YouTube Music Videos: US, UK, DE, TR | MedyaPR',
    },
    description: isAr
      ? 'قوائم يوتيوب لأكثر الكليبات الموسيقية رواجًا في السعودية ومصر والمغرب: المشاهدات والإعجابات لكل كليب، مع استراتيجيات الترويج عبر إعلانات Google Ads الرسمية.'
      : isTr
      ? 'YouTube Türkiye, ABD, Almanya ve İngiltere canlı müzik trendleri sıralaması. Günlük izlenme artışları, resmi liste verileri ve klip PR stratejileri.'
      : isEs
      ? 'Listas oficiales de YouTube para los videos musicales más populares en México, España y Colombia: reproducciones y me gusta, con estrategias de promoción oficiales mediante Google Ads.'
      : 'Real-time trending YouTube music videos across the US, UK, Germany, and Turkey. Live view velocity, algorithm benchmarks, and official PR promotion strategies.',
    alternates: getPageAlternates(locale, '/trendler'),
    openGraph: {
      title: isAr
        ? 'كليبات يوتيوب الأكثر رواجًا في السعودية ومصر والمغرب | MedyaPR'
        : isTr
        ? 'Dünya & Türkiye YouTube Trend Müzik Klipleri | MedyaPR'
        : isEs
        ? 'Videos Musicales en Tendencia en YouTube México, España y Colombia | MedyaPR'
        : 'Trending YouTube Music Videos: US, UK, DE, TR | MedyaPR',
      description: isAr
        ? 'قوائم يوتيوب لأكثر الكليبات الموسيقية رواجًا في السعودية ومصر والمغرب: المشاهدات والإعجابات لكل كليب، مع استراتيجيات الترويج عبر إعلانات Google Ads الرسمية.'
        : isTr
        ? 'YouTube Türkiye, ABD, Almanya ve İngiltere canlı müzik trendleri sıralaması. Günlük izlenme artışları ve resmi liste verileri.'
        : isEs
        ? 'Listas de YouTube para videos musicales en tendencia en México, España y Colombia: reproducciones y métricas en tiempo real.'
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
  const isEs = locale === 'es';

  const { trends: allTrends, updatedAt } = await getTrends();
  const primaryList = isAr ? allTrends.sa : isEs ? allTrends.mx : isTr ? allTrends.tr : allTrends.us;
  const primarySongs: TrendingSong[] = primaryList && primaryList.length > 0 ? primaryList : allTrends.tr;

  const todayStr = updatedAt
    ? new Date(updatedAt).toLocaleDateString(isAr ? 'ar-u-nu-latn-ca-gregory' : isTr ? 'tr-TR' : isEs ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const region = isTr ? 'tr' : isAr ? 'global' : isEs ? 'global' : 'premium';
  const currency = isTr ? 'TRY' : 'USD';
  const price = (views: number) => {
    const q = quote({ views, region, currency });
    return `${formatMoney(q.total, currency, locale)} · ${isAr ? 'إعلانات Google Ads الرسمية' : isTr ? 'resmî Google Ads' : isEs ? 'Google Ads oficial' : 'official Google Ads'}`;
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
            name: isAr ? 'الرئيسية' : isTr ? 'Ana Sayfa' : isEs ? 'Inicio' : 'Home',
            item: `https://medyapr.com/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isAr ? 'الموسيقى الأكثر رواجًا' : isTr ? 'Trend Şarkılar' : isEs ? 'Música en Tendencia' : 'Trending Music',
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
          : isEs
          ? 'Lista de Videos Musicales en Tendencia en YouTube (México, España y Colombia)'
          : 'YouTube Trending Music Videos Chart (Global & Regional)',
        description: isAr
          ? 'الترتيب الرسمي لكليبات يوتيوب الأكثر رواجًا في السعودية ومصر والمغرب.'
          : isTr
          ? 'YouTube canlı müzik listesinde en çok izlenen ve yükselişte olan şarkılar sıralaması.'
          : isEs
          ? 'Ranking oficial de videos musicales en tendencia en YouTube en México, España y Colombia.'
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
            {isAr ? 'الرئيسية' : isTr ? 'Ana Sayfa' : isEs ? 'Inicio' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#FF6B6B]">{isAr ? 'الموسيقى الأكثر رواجًا' : isTr ? 'Trend Şarkılar' : isEs ? 'Música en Tendencia' : 'Trending Music'}</span>
        </div>

        {/* Header */}
        <div className="mb-10 border-b border-studio pb-8">
          {todayStr && (
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E] mb-3">
              <Flame className="h-4 w-4 animate-pulse text-[#FF0033]" />
              {isAr ? `آخر تحديث · ${todayStr}` : isTr ? `Son güncelleme · ${todayStr}` : isEs ? `Última actualización · ${todayStr}` : `Last updated · ${todayStr}`}
            </div>
          )}
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight">
            {isAr ? (
              <>
                كليبات يوتيوب{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  الأكثر رواجًا في العالم العربي
                </span>
              </>
            ) : isTr ? (
              <>
                Dünya &amp; Türkiye YouTube{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Trend Müzik Klipleri
                </span>
              </>
            ) : isEs ? (
              <>
                Videos Musicales en{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Tendencia en YouTube
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
              : isEs
              ? "Listas oficiales de YouTube “Música Más Popular” para México, España y Colombia. Número total de reproducciones y me gusta de cada video."
              : "YouTube's official “Most Popular Music” charts for Turkey, the US, Germany and the UK, with total views and likes."}
          </p>
        </div>

        {/* Global Fast-Launch / Direct Conversion Banner */}
        <GlobalTrendsConversionBanner locale={locale} />

        {/* Interactive Multi-Country Tabs & Songs Grid */}
        <TrendingCountryTabs trends={allTrends} locale={locale} initialCountry={isAr ? 'sa' : isEs ? 'mx' : isTr ? 'tr' : 'us'} />

        {/* ── Klip Lansman Planları & Dönüşüm Bölümü (Sanatçılar & Müzisyenler İçin) ── */}
        <div className="mt-16 rounded-3xl border border-[#FF0033]/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 p-8 md:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="max-w-3xl mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/20 px-3.5 py-1 text-xs font-extrabold text-[#FF6B6B] uppercase tracking-wider mb-3">
              {isAr
                ? '🚀 استراتيجية ترند يوتيوب عبر إعلانات Google Ads الرسمية'
                : isTr
                ? '🚀 Resmi Google Ads ile YouTube Trend Stratejisi'
                : isEs
                ? '🚀 Estrategia de Tendencias en YouTube con Google Ads Oficial'
                : '🚀 Official Google Ads YouTube Trending Strategy'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {isAr
                ? 'خطط إطلاق الكليب لدخول ترند يوتيوب'
                : isTr
                ? 'Kendi Klibinizi YouTube Trendlerine Taşıyacak Lansman Planları'
                : isEs
                ? 'Planes de Lanzamiento para Posicionar Tu Video en Tendencias'
                : 'Music Video Launch Plans to Break Into YouTube Trending'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
              {isAr
                ? 'اعرض كليبك على جمهورك المستهدف عبر إعلانات فيديو Google Ads الرسمية. الصق رابطك، وشاهد مشاهداتك الحالية، واختر باقتك. يبدأ الدفع بعد الموافقة على الإعلان.'
                : isTr
                ? 'Kendi klibinizi resmî Google Ads video reklamlarıyla hedef kitlenize gösterin. Linkinizi yapıştırın, mevcut izlenmenizi görün, paketinizi seçin. Ödeme reklam onayından sonra alınır.'
                : isEs
                ? 'Muestra tu propio video musical a tu público objetivo con anuncios de video oficiales de Google Ads. Pega tu enlace, mira tus vistas actuales y elige un plan. El pago se realiza tras la aprobación del anuncio.'
                : 'Show your own music video to your target audience with official Google Ads video ads. Paste your link, see your current views, pick a package. Payment starts after ad approval.'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Paket 1: Starter Launch */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {isAr ? 'إطلاق البداية' : isTr ? 'Başlangıç Lansmanı' : isEs ? 'Lanzamiento Inicial' : 'Starter Launch'}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{isAr ? 'ترويج البداية' : isEs ? 'Starter PR' : 'Starter PR'}</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">50.000</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">{isAr ? 'مشاهدات حقيقية' : isTr ? 'Gerçek İzlenme' : isEs ? 'Reproducciones Reales' : 'Real Views'}</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    {price(50_000)}
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ {isAr ? 'إعلانات In-Stream رسمية قابلة للتخطي' : isTr ? 'Atlanabilir In-Stream Resmi Reklam' : isEs ? 'Anuncios oficiales In-Stream saltables' : 'Skippable In-Stream Official Ads'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'موثّق بنسبة 100% في YouTube Studio / Analytics' : isTr ? '%100 YouTube Studio / Analytics Tescili' : isEs ? '100% verificado en YouTube Studio y Analytics' : '100% YouTube Studio / Analytics Verified'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'استهداف النوع الموسيقي والفئة الديموغرافية' : isTr ? 'Müzik Türü & Demografik Hedefleme' : isEs ? 'Segmentación por género musical y demografía' : 'Music Genre & Demographic Targeting'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'تحليل أولًا ثم عرض سعر' : isTr ? 'Önce Analiz, Sonra Teklif' : isEs ? 'Análisis primero, luego cotización' : 'Review First, Then Quote'}</li>
                </ul>
              </div>
              <a
                href={`/${locale}/order?views=50000&region=${region}&currency=${currency}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-xs font-extrabold text-white hover:bg-zinc-700 transition"
              >
                {isAr ? 'اختر الباقة وابدأ' : isTr ? 'Paketi Seç & Başlat' : isEs ? 'Elegir Plan y Comenzar' : 'Select Plan & Start'}
              </a>
            </div>

            {/* Paket 2: Growth Momentum (Öne Çıkan) */}
            <div className="rounded-2xl border-2 border-[#FF0033] bg-gradient-to-b from-[#FF0033]/15 via-zinc-900/90 to-zinc-950 p-6 flex flex-col justify-between shadow-xl shadow-[#FF0033]/20 relative">
              <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-3 py-0.5 text-[11px] font-black text-white uppercase tracking-wider shadow-md">
                {isAr ? 'الإطلاق الأكثر طلبًا' : isTr ? 'En Popüler Klip Lansmanı' : isEs ? 'Lanzamiento Más Popular' : 'Most Popular Launch'}
              </span>
              <div>
                <span className="text-xs font-bold text-[#FF6B6B] uppercase tracking-wider">
                  {isAr ? 'الخوارزمية والفيديوهات المقترحة' : isTr ? 'Algoritma & Keşfet' : isEs ? 'Algoritmo y Recomendados' : 'Algorithm & Suggested'}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{isAr ? 'زخم النمو' : isEs ? 'Impulso de Crecimiento' : 'Growth Momentum'}</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">100.000</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">{isAr ? 'مشاهدات حقيقية' : isTr ? 'Gerçek İzlenme' : isEs ? 'Reproducciones Reales' : 'Real Views'}</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    {price(100_000)}
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-200 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ {isAr ? 'إعلانات In-Stream + إعلانات الاكتشاف In-Feed' : isTr ? 'In-Stream + In-Feed Keşfet Reklamı' : isEs ? 'Anuncios In-Stream + In-Feed Discovery' : 'In-Stream + In-Feed Discovery Ads'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'استهدف معجبي الفنانين الناجحين المشابهين' : isTr ? 'Benzer Sanatçıların Kitlelerine Gösterim' : isEs ? 'Segmentación de fans de artistas de éxito afines' : 'Target Fans of Similar Hit Artists'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'تقرير شامل للحملة والتحويلات' : isTr ? 'Detaylı Kampanya ve Dönüşüm Raporu' : isEs ? 'Reporte detallado de campaña y conversiones' : 'Comprehensive Campaign & Conversion Report'}</li>
                  <li className="flex items-center gap-2 font-bold text-emerald-400">✓ {isAr ? 'تحليل أولًا ثم عرض سعر' : isTr ? 'Önce Analiz, Sonra Teklif' : isEs ? 'Análisis primero, luego cotización' : 'Review First, Then Quote'}</li>
                </ul>
              </div>
              <a
                href={`/${locale}/order?views=100000&region=${region}&currency=${currency}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-4 py-3 text-xs font-black text-white shadow-lg shadow-[#FF0033]/30 hover:brightness-110 transition"
              >
                {isAr ? 'ابدأ الآن' : isTr ? 'Hemen Başlat' : isEs ? 'Comenzar Ahora' : 'Launch Now'} <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Paket 3: Viral Trend PR */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition">
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {isAr ? 'الترند والانتشار العالمي' : isTr ? 'Trend & Ulusal Çıkış' : isEs ? 'Tendencias y Alcance Global' : 'Trend & Global Reach'}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-1">{isAr ? 'الانتشار الواسع' : isEs ? 'Gran Avance Viral' : 'Viral Breakthrough'}</h3>
                <div className="mt-4 mb-5">
                  <span className="text-3xl font-black text-white">250.000</span>
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">{isAr ? 'مشاهدات حقيقية' : isTr ? 'Gerçek İzlenme' : isEs ? 'Reproducciones Reales' : 'Real Views'}</span>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    {price(250_000)}
                  </p>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                  <li className="flex items-center gap-2">✓ {isAr ? 'مزيج YouTube Shorts وإعلانات الفيديو' : isTr ? 'YouTube Shorts + Video Reklam Karması' : isEs ? 'Combinación de YouTube Shorts y Anuncios de Video' : 'YouTube Shorts + Video Ads Mix'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'السعودية ومصر والمغرب وجمهور عربي متقاطع' : isTr ? 'Türkiye & Avrupa (Gurbetçi) Kitle Hedefi' : isEs ? 'México, España, Colombia y audiencia hispanohablante' : 'US, UK, DE & Global Cross-Audience'}</li>
                  <li className="flex items-center gap-2">✓ {isAr ? 'دعم أولوية عبر WhatsApp / Telegram' : isTr ? 'Öncelikli WhatsApp / Telegram desteği' : isEs ? 'Soporte prioritario por WhatsApp / Telegram' : 'Priority WhatsApp / Telegram support'}</li>
                </ul>
              </div>
              <a
                href={`/${locale}/order?views=250000&region=${region}&currency=${currency}`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-xs font-extrabold text-white hover:bg-zinc-700 transition"
              >
                {isAr ? 'اختر الباقة وابدأ' : isTr ? 'Paketi Seç & Başlat' : isEs ? 'Elegir Plan y Comenzar' : 'Select Plan & Start'}
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
                  : isEs
                  ? 'Envíanos tu propuesta; analizaremos tu video y te responderemos en detalle.'
                  : 'Submit your quote; we will analyze your video and reply in detail.'}
              </strong>{' '}
              {isAr
                ? 'يبدأ العمل بعد الموافقة. قد يختلف السعر حسب مدة الفيديو.'
                : isTr
                ? 'Onay alınca işlem başlar. Fiyatlandırma video uzunluğuna göre değişebilir.'
                : isEs
                ? 'El trabajo inicia tras la aprobación. El precio puede variar según la duración del video.'
                : 'Work begins upon approval. Pricing may vary based on video length.'}
            </div>
            <a
              href={`https://wa.me/905312993355?text=${encodeURIComponent(
                isTr
                  ? 'Merhaba, klip lansmanım için teklif iletmek ve detaylı analiz almak istiyorum.'
                  : isEs
                  ? 'Hola, me gustaría enviar una propuesta y recibir un análisis detallado para mi video musical.'
                  : 'Hello, I would like to submit a quote and request a detailed analysis for my music video.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition"
            >
              {isAr ? 'أرسل طلب العرض عبر WhatsApp' : isTr ? 'WhatsApp ile Teklif İlet' : isEs ? 'Enviar Propuesta por WhatsApp' : 'Send Quote on WhatsApp'}
            </a>
          </div>
        </div>

        {/* ── 4 Dilli Müzik PR ve Trend Analiz Rehberleri (Trendler Sayfası Otorite Köprüsü) ── */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B]">
                {isAr
                  ? 'أدلة الترويج الموسيقي وتحليلات الخوارزمية'
                  : isTr
                  ? 'Müzik PR & Canlı Trend Algoritma Rehberleri'
                  : isEs
                  ? 'Guías de PR Musical y Análisis del Algoritmo de Tendencias'
                  : 'Music PR & Algorithm Trend Analysis Playbooks'}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                {isAr
                  ? 'استراتيجيات تصدر قوائم يوتيوب في الأسواق المستهدفة'
                  : isTr
                  ? 'YouTube Trendlerine Giriş ve Ülke Bazlı Klip Tanıtımı'
                  : isEs
                  ? 'Cómo Entrar en Listas y Destacar en YouTube Music a Nivel Global'
                  : 'How to Chart & Break Out on YouTube Music Globally'}
              </h3>
            </div>
            <Link href={`/${locale}/blog`} className="text-xs font-bold text-zinc-400 hover:text-white transition">
              {isAr ? 'جميع الأدلة ←' : isTr ? 'Tüm Rehberler →' : isEs ? 'Todas las Guías →' : 'All Guides →'}
            </Link>
          </div>

          {isAr ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-semibold">
              <Link
                href="/ar/blog/youtube-saudi-arabia-music-chart-october-2026"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🇸🇦 قائمة يوتيوب للموسيقى في السعودية: الأكثر رواجًا 2026 ←
              </Link>
              <Link
                href="/ar/blog/youtube-egypt-music-chart-october-2026"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🇪🇬 قائمة يوتيوب للموسيقى في مصر: الأكثر رواجًا 2026 ←
              </Link>
              <Link
                href="/ar/blog/youtube-morocco-music-chart-october-2026"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🇲🇦 قائمة يوتيوب للموسيقى في المغرب: الأكثر رواجًا 2026 ←
              </Link>
              <Link
                href="/ar/blog/is-buying-youtube-views-worth-it-official-ads-guide"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🛡️ هل شراء مشاهدات يوتيوب ضروري؟ دليل الإعلانات الرسمية ←
              </Link>
              <Link
                href="/ar/blog/nancy-ajram-bastafizzak-youtube-analysis"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🎤 تحليل كليب نانسي عجرم «بستفزك» على يوتيوب ←
              </Link>
              <Link
                href="/ar/blog/tamer-hosny-etneen-magneen-youtube-analysis"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🎬 تحليل كليب تامر حسني «اتنين مجانين» على يوتيوب ←
              </Link>
            </div>
          ) : isTr ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-semibold">
              <Link
                href="/tr/blog/muzik-kliplerinde-ilk-48-saat-algoritma-rehberi"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🔥 Müzik Kliplerinde İlk 48 Saat & YouTube Trend Formülü →
              </Link>
              <Link
                href="/tr/blog/youtube-klip-tanitimi-google-ads-rehberi"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                📘 Resmi Google Ads ile YouTube Klip Tanıtımı Nasıl Yapılır? →
              </Link>
              <Link
                href="/tr/blog/youtube-shorts-reklami-nasil-verilir-muzik-klibi-demand-gen"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                📱 YouTube Shorts Reklamı ile Şarkı Viral Yapma & Demand Gen →
              </Link>
              <Link
                href="/tr/blog/youtube-video-reklam-fiyatlari-2026-cpv-butce-hesaplama"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                💰 2026 YouTube Video Reklam Fiyatları & CPV Bütçe Hesaplama →
              </Link>
              <Link
                href="/tr/blog/almanyadaki-turkler-icin-youtube-reklam-ve-video-pr-rehberi"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🇩🇪 Almanya & Avrupa'daki Türk Sanatçılar İçin Klip PR Rehberi →
              </Link>
              <Link
                href="/tr/blog/youtube-premiere-nasil-yapilir-muzik-klibi-lansman-adimlari"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🎬 YouTube Premiere İlk Gösterim Kurgusu & Lansman Adımları →
              </Link>
            </div>
          ) : isEs ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-semibold">
              <Link
                href="/es/blog/youtube-mexico-music-chart-2026"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🇲🇽 Lista YouTube Música México: Tendencias y Corridos 2026 →
              </Link>
              <Link
                href="/es/blog/youtube-espana-music-chart-2026"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🇪🇸 Lista YouTube Música España: Urban Latino y Pop 2026 →
              </Link>
              <Link
                href="/es/blog/youtube-colombia-music-chart-2026"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🇨🇴 Lista YouTube Música Colombia: Reggaetón y Ritmos Latinos →
              </Link>
              <Link
                href="/es/blog/como-entrar-en-tendencias-de-youtube-estrategia-2026"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🔥 Cómo Entrar en Tendencias de YouTube: Estrategia 2026 →
              </Link>
              <Link
                href="/es/blog/es-buena-idea-comprar-visitas-youtube-guia-anuncios-oficiales"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🛡️ ¿Comprar Visitas en YouTube? Guía de Anuncios Oficiales →
              </Link>
              <Link
                href="/es/blog/promocion-videos-musicales-youtube-google-ads-guia"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                📘 Promoción de Videos Musicales con Google Ads: Guía Completa →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs font-semibold">
              <Link
                href="/en/blog/youtube-music-chart-usa-october-2026-latin-and-hip-hop"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🇺🇸 YouTube USA Music Chart: Latin & Hip-Hop Trends 2026 →
              </Link>
              <Link
                href="/en/blog/youtube-music-chart-uk-october-2026-diaspora-sounds"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🇬🇧 YouTube UK Music Chart: Diaspora Sounds & Rap →
              </Link>
              <Link
                href="/en/blog/youtube-music-chart-germany-october-2026-turkish-artists"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🇩🇪 YouTube Germany Music Chart: Turkish Sounds & Deutschrap →
              </Link>
              <Link
                href="/en/blog/how-to-get-on-youtube-trending-music-video-strategy-2026"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🔥 How to Get on YouTube Trending: 2026 Music Video Strategy →
              </Link>
              <Link
                href="/en/blog/spotify-vs-youtube-music-marketing-where-to-spend-your-pr-budget"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                📊 Spotify vs YouTube Music Marketing: PR Budget Allocation →
              </Link>
              <Link
                href="/en/blog/hip-hop-rap-youtube-video-promotion-pr-strategy-guide"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 text-zinc-200 hover:text-white transition"
              >
                🎤 Hip-Hop & Rap YouTube Video Promotion: 2026 PR Playbook →
              </Link>
            </div>
          )}
        </div>

        {/* Footer Policy Attribution */}
        <div className="mt-14 rounded-2xl border border-studio bg-studio-card p-6 text-xs text-zinc-400 space-y-2">
          <p className="font-semibold text-zinc-200">
            📌 {isAr
              ? 'شروط خدمة YouTube API وإشعار حقوق النشر'
              : isTr
              ? 'YouTube API Hizmet Politikaları & Telif Bildirimi'
              : isEs
              ? 'Términos del Servicio de YouTube API y Aviso de Derechos de Autor'
              : 'YouTube API Terms of Service & Copyright Notice'}
          </p>
          <p>
            {isAr
              ? 'تُجلب عناوين الفيديوهات والصور المصغرة وإحصاءات المشاهدات المعروضة في هذه القائمة عبر YouTube Data API v3 الرسمية. جميع حقوق النشر والعلامات التجارية مملوكة لأصحابها من الفنانين وشركات التسجيلات. ولا يعني إدراج عمل في هذه القائمة أي تأييد تجاري.'
              : isTr
              ? 'Bu sayfada yer alan video başlıkları, küçük resimler ve izlenme istatistikleri resmî YouTube Data API v3 aracılığıyla alınır ve periyodik olarak güncellenir. Listede yer alan eserler ve telif hakları ilgili sanatçılara ve yapım şirketlerine aittir. Listede bulunmak sanatçıların sitemizle ticari ilişkisi olduğu anlamına gelmez.'
              : isEs
              ? 'Los títulos de video, miniaturas y estadísticas de reproducciones mostradas en esta lista se obtienen mediante la API oficial YouTube Data API v3 y se actualizan periódicamente. Todas las marcas y derechos de autor pertenecen a sus respectivos artistas y compañías discográficas.'
              : 'Video titles, thumbnails, and view statistics displayed on this chart are retrieved via official YouTube Data API v3. All copyrights and trademarks belong to their respective artists and record labels. Inclusion on this chart does not imply commercial endorsement.'}
          </p>
        </div>
      </div>
    </div>
  );
}
