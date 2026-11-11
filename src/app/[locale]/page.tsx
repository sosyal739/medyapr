import type { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import { getPageAlternates } from '@/lib/seo';
import HeroSection from '@/components/home/HeroSection';
import TrustBadges from '@/components/home/TrustBadges';
import CalculatorSection from '@/components/calc/CalculatorSection';
import TrendingMusicSection from '@/components/home/TrendingMusicSection';
import ArtistTestimonialsMarquee from '@/components/home/ArtistTestimonialsMarquee';
import ComparisonSection from '@/components/home/ComparisonSection';
import ServicesGrid from '@/components/home/ServicesGrid';
import HowItWorks from '@/components/home/HowItWorks';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import FAQSection from '@/components/home/FAQSection';
import { getTrends } from '@/lib/youtube';
import { getPostsForLocale } from '@/lib/content';
import { getFaqs } from '@/data/faqs';
import { getLandingPages } from '@/data/landing';

type Props = {
  params: Promise<{ locale: string }>;
};

/** Ana sayfa içeriğinin son gerçek güncellemesi (görünür tarih + schema dateModified). İçerik değişince elle güncelleyin. */
const HOME_UPDATED = '2026-11-11';

/** HeroSection'daki tanıtım videosuyla aynı dosyalar (VideoObject şeması için). */
function getHeroVideo(locale: string) {
  if (locale === 'tr') return { src: '/video/medyapr_tanitim.mp4', poster: '/video/poster.webp', uploadDate: '2026-10-13' };
  if (locale === 'ar') return { src: '/video/medyapr_tanitim_ar.mp4', poster: '/video/poster_ar.webp', uploadDate: '2026-10-19' };
  return { src: '/video/medyapr_tanitim_en.mp4', poster: '/video/poster_en.webp', uploadDate: '2026-10-19' };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';
  const isAr = locale === 'ar';
  const isEs = locale === 'es';

  return {
    title: {
      absolute: isAr
        ? 'ترويج فيديو كليب على يوتيوب وإعلانات Google Ads | MedyaPR'
        : isEs
        ? 'Promoción de Videos Musicales en YouTube y Google Ads | MedyaPR'
        : isTr
        ? 'YouTube Klip Tanıtımı & Video Reklam Verme | MedyaPR'
        : 'YouTube Music Video Promotion & Google Ads PR | MedyaPR',
    },
    description: isAr
      ? 'ترويج فيديو كليب على يوتيوب عبر إعلانات Google Ads الرسمية وباقات مشاهدات حقيقية. لا حاجة لكلمة مرور؛ مراجعة مجانية أولًا ثم عرض سعر.'
      : isEs
      ? 'Promoción de videos musicales en YouTube con campañas oficiales de Google Ads y vistas 100% reales. Sin contraseñas de canal; análisis técnico gratuito.'
      : isTr
      ? 'Resmi Google Ads ile YouTube klip tanıtımı, şarkı reklamı ve gerçek izlenme paketleri. Şifre istenmez; önce ücretsiz analiz, sonra teklif.'
      : 'Official Google Ads YouTube music video promotion and real view packages. No password required; free review first, then a quote.',
    alternates: getPageAlternates(locale, ''),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const isTr = locale === 'tr';
  const isAr = locale === 'ar';
  const isEs = locale === 'es';
  const dict = await getDictionary(locale as Locale);
  const { trends } = await getTrends();
  const trendingSongs = locale === 'ar' ? (trends.sa.length ? trends.sa : trends.tr) : locale === 'es' ? (trends.mx.length ? trends.mx : trends.es.length ? trends.es : trends.us) : locale === 'tr' ? trends.tr : trends.us.length ? trends.us : trends.tr;
  const blogPosts = await getPostsForLocale(locale);
  const heroVideo = getHeroVideo(locale);

  return (
    <>
      {/* Schema.org Combined Graph: FAQPage, HowTo, Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': `https://medyapr.com/${locale}#webpage`,
                url: `https://medyapr.com/${locale}`,
                name: 'MedyaPR',
                isPartOf: { '@id': 'https://medyapr.com/#website' },
                about: { '@id': 'https://medyapr.com/#organization' },
                dateModified: HOME_UPDATED,
                primaryImageOfPage: `https://medyapr.com${heroVideo.poster}`,
              },
              {
                '@type': 'VideoObject',
                name: locale === 'ar' ? 'MedyaPR: الترويج لفيديو يوتيوب عبر Google Ads' : locale === 'tr' ? 'MedyaPR tanıtım videosu: Google Ads ile YouTube klip tanıtımı' : 'MedyaPR intro: YouTube music video promotion with Google Ads',
                description: dict.metadata.description,
                thumbnailUrl: `https://medyapr.com${heroVideo.poster}`,
                contentUrl: `https://medyapr.com${heroVideo.src}`,
                uploadDate: heroVideo.uploadDate,
                inLanguage: locale === 'ar' ? 'ar' : locale === 'tr' ? 'tr' : 'en',
                publisher: { '@id': 'https://medyapr.com/#organization' },
              },
              {
                '@type': 'FAQPage',
                mainEntity: getFaqs(locale).map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer,
                  },
                })),
              },
              {
                '@type': 'HowTo',
                name: locale === 'ar' ? 'كيف يعمل الترويج لفيديو الكليب على يوتيوب' : locale === 'es' ? 'Cómo Funciona la Promoción de Videos en YouTube' : locale === 'tr' ? 'YouTube Klip Tanıtımı ve Video PR Nasıl Yapılır?' : 'How YouTube Music Video PR Works',
                description: locale === 'ar'
                  ? 'آلية حملة فيديو رسمية عبر Google Ads في 4 خطوات: الإرسال، والمراجعة، والموافقة، والتنفيذ.'
                  : locale === 'es'
                  ? 'Proceso oficial de campaña en YouTube con Google Ads en 4 pasos: envío, análisis, aprobación y entrega.'
                  : locale === 'tr'
                  ? 'MedyaPR ile YouTube video ve klip tanıtımının 4 adımlı resmi Google Ads onay ve yayın süreci.'
                  : '4-step official Google Ads video campaign workflow: submission, review, approval, and delivery.',
                totalTime: 'P2D',
                step: [
                  {
                    '@type': 'HowToStep',
                    position: 1,
                    name: locale === 'ar' ? 'أرسل رابط الفيديو' : locale === 'es' ? 'Envía el Enlace de tu Video' : locale === 'tr' ? 'Video Linki Paylaşılır' : 'Submit Video URL',
                    text: locale === 'ar'
                      ? 'لا حاجة لأي كلمة مرور. يكفي مشاركة رابط فيديو يوتيوب العام فقط.'
                      : locale === 'tr'
                      ? 'Kanal şifresi veya yetki gerekmez; yalnızca herkese açık YouTube video linki iletilir.'
                      : 'Zero passwords required. Only the public YouTube video URL is shared.',
                    url: `https://medyapr.com/${locale}#how-it-works`,
                  },
                  {
                    '@type': 'HowToStep',
                    position: 2,
                    name: locale === 'ar' ? 'مراجعة Google Partner والموافقة' : locale === 'es' ? 'Revisión y Aprobación de Google Partner' : locale === 'tr' ? 'Google Partner Analizi & Onay' : 'Google Partner Review & Approval',
                    text: locale === 'ar'
                      ? 'يفحص فريق Google Partner المعتمد لدينا مدى التزام المحتوى بالسياسات ثم يرفعه للحصول على الموافقة الرسمية.'
                      : locale === 'tr'
                      ? '18+ yıllık deneyimli uzman ekibimiz videoyu içerik ve politika açısından inceleyip resmi Google Ads onayına sunar.'
                      : 'Our certified Google Partner team inspects content compliance and submits for official approval.',
                    url: `https://medyapr.com/${locale}#how-it-works`,
                  },
                  {
                    '@type': 'HowToStep',
                    position: 3,
                    name: locale === 'ar' ? 'تحليل أولًا ثم عرض سعر' : locale === 'es' ? 'Análisis Previo y Cotización Clara' : locale === 'tr' ? 'Önce Analiz, Sonra Teklif' : 'Review First, Then Quote',
                    text: locale === 'ar'
                      ? 'تتم مراجعة فيديوك ثم نرسل لك عرض سعر واضحًا؛ ولا تبدأ أي حملة دون موافقتك.'
                      : locale === 'tr'
                      ? 'Videonuz incelenir, net bir teklif iletilir; onayınız olmadan kampanya başlamaz.'
                      : 'Your video is reviewed and a clear quote is sent; no campaign starts without your approval.',
                    url: `https://medyapr.com/${locale}#how-it-works`,
                  },
                  {
                    '@type': 'HowToStep',
                    position: 4,
                    name: locale === 'ar' ? 'التقارير والمشاهدات الدائمة' : locale === 'es' ? 'Reporte de Métricas y Vistas Permanentes' : locale === 'tr' ? 'Performans Raporlama & Kalıcı İzlenme' : 'Reporting & Permanent Views',
                    text: locale === 'ar'
                      ? 'تُسجَّل المشاهدات في YouTube Studio ضمن إعلانات يوتيوب وتبقى دائمة مدى الحياة، مع تقارير مفصلة.'
                      : locale === 'tr'
                      ? 'İzlenmeler YouTube Studio analitiklerinde tescillenir, ömür boyu kalıcıdır ve detaylı performans raporu teslim edilir.'
                      : 'Views are logged in YouTube Studio under YouTube Advertising with lifetime permanence and detailed reports.',
                    url: `https://medyapr.com/${locale}#how-it-works`,
                  },
                ],
              },
              {
                '@type': 'Service',
                serviceType: locale === 'ar' ? 'إعلانات الترويج لفيديو يوتيوب والموسيقى' : locale === 'es' ? 'Publicidad y Promoción de Videos en YouTube' : locale === 'tr' ? 'YouTube Video & Klip PR Reklamcılığı' : 'YouTube Video & Music PR Advertising',
                provider: {
                  '@type': 'Organization',
                  name: 'MedyaPR',
                  url: 'https://medyapr.com',
                },
                areaServed: ['TR', 'DE', 'Global'],
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: locale === 'ar' ? 'باقات الترويج لفيديو يوتيوب' : locale === 'es' ? 'Paquetes de Promoción en YouTube' : locale === 'tr' ? 'YouTube Video PR Paketleri' : 'YouTube Video PR Packages',
                  itemListElement: [
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Service',
                        name: locale === 'ar' ? 'إعلانات فيديو In-Stream على يوتيوب' : locale === 'tr' ? 'YouTube In-Stream Video Reklamı' : 'YouTube In-Stream Video Ads',
                      },
                    },
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Service',
                        name: locale === 'ar' ? 'إعلانات خلاصة YouTube Shorts' : locale === 'tr' ? 'YouTube Shorts Akış Reklamı' : 'YouTube Shorts Feed Ads',
                      },
                    },
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Service',
                        name: locale === 'ar' ? 'الترويج لإطلاق فيديو الكليب' : locale === 'tr' ? 'Müzik Klibi Lansman PR' : 'Music Video Launch PR',
                      },
                    },
                  ],
                },
              },
            ],
          }),
        }}
      />

      <HeroSection dict={dict} locale={locale} />
      <TrustBadges dict={dict} locale={locale} />
      <CalculatorSection locale={locale} />
      <div className="cv-auto">
        <TrendingMusicSection songs={trendingSongs} locale={locale} />
      </div>
      <div className="cv-auto">
        <ArtistTestimonialsMarquee locale={locale} />
      </div>
      <div className="cv-auto">
        <ComparisonSection locale={locale} />
      </div>
      <div className="cv-auto">
        <ServicesGrid dict={dict} locale={locale} />
      </div>
      <div className="cv-auto">
        <HowItWorks dict={dict} locale={locale} />
      </div>
      <div className="cv-auto">
        <BlogPreviewSection
        posts={blogPosts.slice(0, 3).map((p) => ({ ...p, paragraphs: [], paragraphs_en: [], faqs: [], faqs_en: [], table: undefined, table_en: undefined }))}
        locale={locale}
        />
      </div>

      {/* Sipariş Odaklı Ticari SEO & GEO Pillar Bölümü */}
      <section className="cv-auto bg-app-base py-16 border-t border-white/10 text-white">
        <div className="mx-auto max-w-6xl px-4 md:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="inline-block rounded-full bg-[#FF0033]/15 border border-[#FF0033]/30 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B]">
              {isAr ? 'الدليل الرسمي للترويج للفيديو عبر Google Partner' : isEs ? 'Guía Oficial de Promoción en YouTube con Google Partner' : isTr ? 'Resmi Google Partner Video PR Rehberi' : 'Official Google Partner Video PR Guide'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isAr
                ? 'ترويج فيديو كليب على يوتيوب وإعلانات الفيديو وباقات المشاهدات الحقيقية'
                : isEs
                ? 'Promoción de Videos Musicales en YouTube, Campañas de Video y Vistas Reales'
                : isTr
                ? 'YouTube Klip Tanıtımı, Video Reklam Verme ve Gerçek İzlenme Paketleri'
                : 'YouTube Music Video Promotion, Video Advertising & Real View Packages'}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {isAr
                ? 'بخبرة تتجاوز 18 عامًا في المجال وخبرة Google Partner المعتمدة، تدير MedyaPR الترويج لفيديوهات يوتيوب عبر إعلانات Google Ads الرسمية وتسويق الأغاني وحملات المشاهدات الحقيقية للفنانين وشركات التسجيلات وصنّاع المحتوى. لا نطلب كلمة مرور القناة أبدًا.'
                : isEs
                ? 'Con más de 18 años de experiencia en la industria y certificación oficial Google Partner, MedyaPR gestiona promociones de videos en YouTube con Google Ads oficial, marketing musical y campañas de vistas 100% reales para artistas, sellos y creadores. Jamás pedimos contraseñas de canal.'
                : isTr
                ? 'MedyaPR, 18+ yıllık sektör deneyimi ve sertifikalı Google Partner uzmanlığıyla sanatçılar, yapım şirketleri ve içerik üreticileri için resmi Google Ads üzerinden YouTube reklam verme, şarkı tanıtımı ve organik izlenme kampanyaları yürütür. Kanal şifresi veya yönetici yetkisi asla istenmez; yalnızca herkese açık video linkinizle analiz yapılır ve onayınız alındığında işlem başlar.'
                : 'With 18+ years of industry experience and certified Google Partner expertise, MedyaPR manages official Google Ads YouTube video promotion, song marketing, and real view campaigns for artists, record labels, and creators. Zero channel passwords required.'}
            </p>
          </div>

          <blockquote className="rounded-2xl border-l-4 border-[#FF0033] bg-white/[0.03] p-5 text-sm sm:text-base text-zinc-200 italic">
            {isAr
              ? '«تظهر إعلانات فيديو الكليب المُدارة عبر Google Ads الرسمية بشفافية ضمن مصدر الزيارات ‹إعلانات يوتيوب› في YouTube Analytics، وتبقى دائمة مدى الحياة دون أي مخاطر بوتات.»'
              : isEs
              ? '“Los anuncios de video gestionados mediante Google Ads oficial aparecen verificados en YouTube Studio Analytics bajo la fuente ‘Publicidad de YouTube’ con permanencia total y cero riesgo de bots.”'
              : isTr
              ? '“Resmi Google Ads üzerinden yürütülen YouTube klip reklamları ve video tanıtım kampanyaları, YouTube Studio Analytics ekranında doğrudan ‘YouTube Reklamları’ trafik kaynağı altında görünür; bot veya panel kullanılmadığı için izlenmeler ömür boyu kalıcıdır.”'
              : '“YouTube music video ads managed through official Google Ads appear transparently under the ‘YouTube Advertising’ traffic source in YouTube Studio Analytics with lifetime permanence and zero bot risk.”'}
          </blockquote>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04] text-zinc-300 uppercase font-extrabold">
                  <th className="py-3.5 px-4">{isAr ? 'الخدمة والباقة' : isEs ? 'Servicio y Paquete' : isTr ? 'Hizmet & Paket Türü' : 'Service & Package'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'مصدر الزيارات' : isEs ? 'Fuente de Tráfico' : isTr ? 'Trafik Kaynağı' : 'Traffic Source'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'السعر الابتدائي' : isEs ? 'Tarifa Base' : isTr ? 'Başlangıç Baremi' : 'Starting Rate'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'الآلية' : isEs ? 'Proceso' : isTr ? 'Süreç' : 'Process'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'الإجراء' : isEs ? 'Acción' : isTr ? 'Hızlı İşlem' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-300">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">{isAr ? 'الترويج لفيديو الكليب باستهداف دولة محددة' : isTr ? 'YouTube Klip Tanıtımı (Türkiye Hedefli)' : 'Targeted Country Music Video PR'}</td>
                  <td className="py-3.5 px-4">{isAr ? 'Google Ads In-Stream والاكتشاف' : 'Google Ads In-Stream & Keşfet'}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{isAr ? 'CPV مخصص بالشرائح' : isTr ? '1.000 İzlenme: tahmini ₺125’ten başlayan' : 'Tiered Custom CPV'}</td>
                  <td className="py-3.5 px-4">{isAr ? 'تحليل أولًا ثم عرض سعر' : isTr ? 'Önce analiz, sonra teklif' : 'Review first, then quote'}</td>
                  <td className="py-3.5 px-4">
                    <Link href={`/${locale}/fiyatlandirma`} className="font-bold text-[#FF6B6B] underline">
                      {isAr ? 'احسب ←' : isTr ? 'Fiyat Hesapla →' : 'Calculate →'}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">{isAr ? 'مشاهدات يوتيوب عالمية' : isTr ? 'Global YouTube İzlenme Paketi' : 'Global YouTube Views'}</td>
                  <td className="py-3.5 px-4">Google Ads Global Video Ağı</td>
                  <td className="py-3.5 px-4 text-amber-300 font-bold">{isAr ? 'خصم للكميات الكبيرة' : isTr ? '1.000 İzlenme: ₺100 🔥' : 'High-Volume Discounted'}</td>
                  <td className="py-3.5 px-4">{isAr ? 'تحليل أولًا ثم عرض سعر' : isTr ? 'Önce analiz, sonra teklif' : 'Review first, then quote'}</td>
                  <td className="py-3.5 px-4">
                    <Link href={`/${locale}/order`} className="font-bold text-emerald-400 underline">
                      {isAr ? 'اطلب تحليلًا ←' : isTr ? 'Analiz İste →' : 'Request Analysis →'}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">{isAr ? 'الترويج لـ YouTube Shorts والتفاعل' : isTr ? 'YouTube Shorts & Etkileşim Paketi' : 'YouTube Shorts & Engagement PR'}</td>
                  <td className="py-3.5 px-4">{isAr ? 'Google Ads Shorts وDemand Gen' : 'Google Ads Shorts & Demand Gen'}</td>
                  <td className="py-3.5 px-4 text-sky-300 font-bold">{isAr ? 'أسعار متدرجة حسب الكمية' : isTr ? 'Kademeli Hacim İndirimi' : 'Volume Tiered'}</td>
                  <td className="py-3.5 px-4">{isAr ? 'للشركات: الدفع بعد التنفيذ' : isTr ? 'Kurumsala İş Bitiminde' : 'Corporate Post-Delivery'}</td>
                  <td className="py-3.5 px-4">
                    <Link href={`/${locale}/hizmetler`} className="font-bold text-sky-300 underline">
                      {isAr ? 'عرض الخدمات ←' : isTr ? 'Hizmetleri Gör →' : 'View Services →'}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3 Ticari Açılış Sayfası (Doğrudan Ana Sayfa Otorite Köprüsü) */}
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B]">
              {isAr
                ? 'باقات الإعلانات الرسمية وصفحات الخدمة التجارية'
                : isTr
                ? 'Ticari Hizmet & Paket Sayfalarımız'
                : 'Official Commercial Promotion & Pricing Pages'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
              {getLandingPages(locale).map((lp) => (
                <Link
                  key={lp.slug}
                  href={`/${locale}/${lp.slug}`}
                  className="rounded-xl border border-[#FF0033]/35 bg-[#FF0033]/10 p-3.5 hover:bg-[#FF0033]/20 hover:border-[#FF0033]/60 transition text-white flex items-center justify-between gap-2"
                >
                  <span>🎯 {lp.keyword}</span>
                  <span className="text-[#FF6B6B] shrink-0">{isAr ? '←' : '→'}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs font-bold">
            <Link href={`/${locale}/fiyatlandirma`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white">
              💰 {isAr ? 'أسعار إعلانات يوتيوب والمشاهدات' : isTr ? 'YouTube Reklam & İzlenme Fiyatları' : 'YouTube Ad & View Pricing'} →
            </Link>
            <Link href={`/${locale}/order`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-emerald-500/50 transition text-white">
              🚀 {isAr ? 'أرسل الفيديو واطلب التحليل' : isTr ? 'Video Linki Gir & Analiz İste' : 'Submit Video & Request Analysis'} →
            </Link>
            <Link href={`/${locale}/klip-pr`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white">
              🎵 {isAr ? 'وكالة العلاقات العامة الرقمية وإطلاق فيديو الكليب' : isTr ? 'Müzik Klibi Dijital PR & Şarkı Tanıtımı' : 'Music Video Digital PR & Launch Agency'} →
            </Link>
            {isAr ? (
              <>
                <Link
                  href="/ar/blog/launch-music-video-youtube-saudi-arabia-gulf-plan-2026"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🇸🇦 خطة إطلاق فيديو كليب على يوتيوب في السعودية 2026 ←
                </Link>
                <Link
                  href="/ar/blog/promote-music-video-youtube-saudi-egypt-morocco-guide"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🌍 كيف تروّج لكليبك على يوتيوب في السعودية ومصر والمغرب ←
                </Link>
                <Link
                  href="/ar/blog/youtube-bot-panel-risks-official-google-ads-difference"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🛡️ هل شراء مشاهدات يوتيوب ضروري؟ الدليل الرسمي ←
                </Link>
                <Link
                  href="/ar/blog/first-48-hours-music-video-youtube-algorithm-guide"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  ⏱️ أول 48 ساعة لكليبك على يوتيوب: دليل الخوارزمية ←
                </Link>
                <Link
                  href="/ar/blog/youtube-premiere-music-video-launch-steps"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🎬 العرض الأول (Premiere) في يوتيوب: خطوات إطلاق الكليب ←
                </Link>
                <Link
                  href="/ar/blog/youtube-music-video-promotion-google-ads-guide"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  📘 كيف تروّج لفيديو الكليب عبر Google Ads ←
                </Link>
              </>
            ) : isEs ? (
              <>
                <Link
                  href="/es/blog/promocion-videos-musicales-youtube-google-ads-guia"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  📘 Promoción de Videos Musicales con Google Ads →
                </Link>
                <Link
                  href="/es/blog/como-entrar-en-tendencias-de-youtube-estrategia-2026"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🔥 Cómo Entrar en Tendencias de YouTube (2026) →
                </Link>
                <Link
                  href="/es/blog/youtube-mexico-music-chart-2026"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🇲🇽 Lista YouTube Música México 2026 →
                </Link>
                <Link
                  href="/es/blog/youtube-espana-music-chart-2026"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🇪🇸 Lista YouTube Música España 2026 →
                </Link>
                <Link
                  href="/es/blog/youtube-colombia-music-chart-2026"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🇨🇴 Lista YouTube Música Colombia 2026 →
                </Link>
                <Link
                  href="/es/blog/anuncios-youtube-shorts-videos-musicales-demand-gen"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  📱 Anuncios en YouTube Shorts y Demand Gen →
                </Link>
              </>
            ) : isTr ? (
              <>
                <Link
                  href="/tr/youtube-klip-tanitimi"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  📘 YouTube Klip Tanıtımı Nasıl Yapılır? →
                </Link>
                <Link
                  href="/tr/blog/youtube-shorts-reklami-nasil-verilir-muzik-klibi-demand-gen"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  📱 YouTube Shorts Reklam Verme Rehberi →
                </Link>
                <Link
                  href="/tr/youtube-reklam-fiyatlari"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  📊 YouTube Video Reklam Fiyatları 2026 & CPV →
                </Link>
                <Link
                  href="/tr/blog/almanyadaki-turkler-icin-youtube-reklam-ve-video-pr-rehberi"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🇩🇪 Almanya ve Avrupa Türk Sanatçı PR Rehberi →
                </Link>
                <Link
                  href="/tr/blog/muzik-kliplerinde-ilk-48-saat-algoritma-rehberi"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🔥 Müzik Kliplerinde İlk 48 Saat & Trend Formülü →
                </Link>
                <Link
                  href="/tr/blog/youtube-premiere-nasil-yapilir-muzik-klibi-lansman-adimlari"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🎬 YouTube Premiere (İlk Gösterim) Nasıl Yapılır? →
                </Link>
                <Link
                  href="/tr/blog/youtubeda-sarkiniz-neden-tutmuyor-klip-cikaran-muzikisyenlerin-5-buyuk-hatasi"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  ❓ Şarkınız YouTube'da Neden Tutmuyor? 5 Büyük Klip Hatası →
                </Link>
                <Link
                  href="/tr/blog/youtube-shorts-reklami-nasil-verilir-muzik-klibi-demand-gen"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  📱 YouTube Shorts Reklam Verme: Müzik Klibi Rehberi →
                </Link>
                <Link
                  href="/tr/blog/muzik-klibi-lansmaninda-instagram-reels-ve-youtube-teaser-rehberi"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🎞️ Klip Lansmanında Instagram Reels ve YouTube Teaser Rehberi →
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/en/google-ads-for-music-videos"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  📘 How to Promote Your Music Video with Google Ads →
                </Link>
                <Link
                  href="/en/fiyatlandirma"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  💰 Cost of YouTube Music Video Ads (CPV 2026) →
                </Link>
                <Link
                  href="/en/blog/hip-hop-rap-youtube-video-promotion-pr-strategy-guide"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🎤 Hip-Hop & Rap Music Video PR Playbook →
                </Link>
                <Link
                  href="/en/blog/youtube-music-marketing-plan-30-day-release-guide-2026"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🗓️ YouTube Music Marketing Plan: 30-Day Release Guide →
                </Link>
                <Link
                  href="/en/blog/how-independent-artists-get-millions-of-views-without-a-record-label"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  🚀 Independent Artists: 1M YouTube Views Without a Label →
                </Link>
                <Link
                  href="/en/blog/spotify-vs-youtube-music-marketing-where-to-spend-your-pr-budget"
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-[#FF0033]/50 transition text-white"
                >
                  💸 Spotify vs YouTube Music Marketing: PR Budget Guide →
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <div className="cv-auto">
        <FAQSection dict={dict} locale={locale} />
      </div>

      <p className="pb-8 text-center text-xs text-zinc-400">
        {isAr ? 'آخر تحديث' : isEs ? 'Última actualización' : isTr ? 'Son güncelleme' : 'Last updated'}:{' '}
        <time dateTime={HOME_UPDATED}>
          {new Date(`${HOME_UPDATED}T12:00:00Z`).toLocaleDateString(isAr ? 'ar' : isEs ? 'es-ES' : isTr ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        {' · '}
        <Link href={`/${locale}/hakkimizda`} className="underline hover:text-white">
          {isAr ? 'من نحن' : isEs ? 'Sobre nosotros' : isTr ? 'Hakkımızda' : 'About us'}
        </Link>
      </p>
    </>
  );
}
