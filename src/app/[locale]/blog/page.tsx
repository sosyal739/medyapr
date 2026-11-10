import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Users,
  Flame,
  Sparkles,
  TrendingUp,
  Share2,
  Lightbulb,
} from 'lucide-react';
import { getPostsForLocale, postCategoryKey } from '@/lib/content';
import { getPageAlternates, toIsoDateString, displayDate } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';
  const isAr = locale === 'ar';
  const isEs = locale === 'es';

  return {
    title: {
      absolute: isAr
        ? 'مدونة استراتيجيات الترويج لفيديو كليب يوتيوب | MedyaPR'
        : isTr
        ? 'YouTube Müzik Video & Klip PR Blogu | MedyaPR'
        : isEs
        ? 'Blog de Estrategia de Videos Musicales y YouTube PR | MedyaPR'
        : 'YouTube Music Video & PR Strategy Blog | MedyaPR',
    },
    description: isAr
      ? 'أساليب نمو وسائل التواصل الاجتماعي، وخطط إطلاق فيديو كليب على يوتيوب، وسير الفنانين، وأدلة الخوارزمية، واستراتيجيات الترويج عبر إعلانات Google Ads الرسمية.'
      : isTr
      ? 'Sosyal medya tüyoları, nasıl yapılır rehberleri, tavsiyeler, sanatçı biyografileri (kimdir), klip analizleri ve resmi Google Ads video PR stratejileri.'
      : isEs
      ? 'Estrategias de lanzamiento de videoclips en YouTube, análisis de tendencias musicales, algoritmos y campañas oficiales de Google Ads.'
      : 'Social media growth tactics, YouTube music video launch playbooks, artist biographies, algorithm guides, and official Google Ads PR strategies.',
    alternates: getPageAlternates(locale, '/blog'),
    openGraph: {
      title: isAr
        ? 'مدونة استراتيجيات الترويج لفيديو كليب يوتيوب | MedyaPR'
        : isTr
        ? 'YouTube Müzik Video & Klip PR Blogu | MedyaPR'
        : isEs
        ? 'Blog de Estrategia de Videos Musicales y YouTube PR | MedyaPR'
        : 'YouTube Music Video & PR Strategy Blog | MedyaPR',
      description: isAr
        ? 'أساليب نمو وسائل التواصل الاجتماعي، وخطط إطلاق فيديو كليب على يوتيوب، وسير الفنانين، وأدلة الخوارزمية، واستراتيجيات الترويج عبر إعلانات Google Ads الرسمية.'
        : isTr
        ? 'Sosyal medya tüyoları, nasıl yapılır rehberleri, tavsiyeler, sanatçı biyografileri (kimdir), klip analizleri ve resmi Google Ads video PR stratejileri.'
        : isEs
        ? 'Estrategias de lanzamiento de videoclips en YouTube, análisis de tendencias musicales, algoritmos y campañas oficiales de Google Ads.'
        : 'Social media growth tactics, YouTube music video launch playbooks, artist biographies, algorithm guides, and official Google Ads PR strategies.',
      url: `https://medyapr.com/${locale}/blog`,
      images: ['/og-image.jpg'],
    },
  };
}

const CATEGORIES = [
  { key: 'all', labelTr: 'Tüm Rehberler', labelEn: 'All Guides', labelAr: 'جميع الأدلة', labelEs: 'Todas las Guías', icon: BookOpen, match: null },
  { key: 'sosyal-medya', labelTr: 'Sosyal Medya', labelEn: 'Social Media', labelAr: 'وسائل التواصل الاجتماعي', labelEs: 'Redes Sociales', icon: Share2, match: 'Sosyal Medya' },
  { key: 'nasil-yapilir', labelTr: 'Nasıl Yapılır?', labelEn: 'How-To', labelAr: 'كيف تفعل', labelEs: 'Guías Prácticas', icon: Sparkles, match: 'Nasıl Yapılır?' },
  { key: 'tavsiye', labelTr: 'Tavsiye', labelEn: 'Tips & Strategy', labelAr: 'نصائح واستراتيجية', labelEs: 'Estrategia Musical', icon: Lightbulb, match: 'Tavsiye' },
  { key: 'kimdir', labelTr: 'Kimdir?', labelEn: 'Who Is?', labelAr: 'من هو؟', labelEs: 'Biografías', icon: Users, match: 'Kimdir?' },
  { key: 'video-pr', labelTr: 'Resmi Video PR', labelEn: 'Official Video PR', labelAr: 'الترويج الرسمي للفيديو', labelEs: 'PR Oficial de Video', icon: TrendingUp, match: 'Resmi Video PR & Google Ads' },
  { key: 'analizler', labelTr: 'Şarkı Analizleri', labelEn: 'Song Analysis', labelAr: 'تحليل الأغاني', labelEs: 'Análisis y Tendencias', icon: Flame, match: 'Şarkı & Klip Analizleri' },
];

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ kategori?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const activeCategoryKey = resolvedSearchParams.kategori || 'all';
  const isTr = locale === 'tr';
  const isAr = locale === 'ar';
  const isEs = locale === 'es';
  const allPosts = await getPostsForLocale(locale);

  const activeCategory = CATEGORIES.find((c) => c.key === activeCategoryKey) || CATEGORIES[0];

  const filteredPosts =
    activeCategory.match === null
      ? allPosts
      : allPosts.filter((p) => postCategoryKey(p) === activeCategory.key);

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
            name: isAr ? 'المدونة' : 'Blog',
            item: `https://medyapr.com/${locale}/blog`,
          },
        ],
      },
      {
        '@type': 'Blog',
        name: isAr
          ? 'مدونة MedyaPR لاستراتيجيات الترويج لفيديو يوتيوب والموسيقى'
          : isTr
          ? 'MedyaPR YouTube Video & Müzik PR Strateji Blogu'
          : isEs
          ? 'MedyaPR Blog de Estrategia de Videos Musicales y YouTube PR'
          : 'MedyaPR YouTube Video & Music PR Strategy Blog',
        description: isAr
          ? 'بورتريهات الفنانين، واستراتيجيات الترويج لفيديو كليب على يوتيوب، وتحليلات الخوارزمية، وأدلة إعلانات Google Ads الرسمية.'
          : isTr
          ? 'Sanatçı biyografileri, trend şarkı analizleri, klip pazarlama dinamikleri ve resmi Google Ads büyüme rehberleri.'
          : isEs
          ? 'Análisis de canciones en tendencia, estrategias de promoción de videoclips y guías de crecimiento con Google Ads.'
          : 'Artist portraits, YouTube music video PR strategies, algorithm breakdowns, and official Google Ads guides.',
        url: `https://medyapr.com/${locale}/blog`,
        blogPost: filteredPosts.map((p) => ({
          '@type': 'BlogPosting',
          headline: (!isTr && !isAr && !isEs && p.title_en) ? p.title_en : p.title,
          url: `https://medyapr.com/${locale}/blog/${p.slug}`,
          datePublished: toIsoDateString(p.date),
          author: {
            '@type': 'Organization',
            name: p.author,
          },
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
      {/* Background glow accents */}
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#FF0033]/15 blur-[160px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[150px] animate-float-drift" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-white transition">
            {isAr ? 'الرئيسية' : isTr ? 'Ana Sayfa' : isEs ? 'Inicio' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#FF6B6B]">
            {isAr ? 'مدونة الترويج الموسيقي والفيديو' : isTr ? 'Müzik & Video PR Blogu' : isEs ? 'Blog de Video y Música PR' : 'Music & Video PR Blog'}
          </span>
          {activeCategory.key !== 'all' && (
            <>
              <span>/</span>
              <span className="text-zinc-200">
                {isAr ? activeCategory.labelAr : isTr ? activeCategory.labelTr : isEs ? activeCategory.labelEs : activeCategory.labelEn}
              </span>
            </>
          )}
        </div>

        {/* Header */}
        <div className="mb-10 border-b border-studio pb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E] mb-3">
            <BookOpen className="h-4 w-4 text-[#FF0033]" />
            {isAr ? 'رؤى وتحليلات' : isTr ? 'Trend & Müzik PR Stratejileri' : isEs ? 'Perspectivas y Análisis' : 'Insights & Analytics'}
          </span>
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight">
            {isAr ? (
              <>
                الموسيقى ويوتيوب{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  دليل الاستراتيجية
                </span>
              </>
            ) : isTr ? (
              <>
                Müzik &amp; YouTube{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Strateji Rehberi
                </span>
              </>
            ) : isEs ? (
              <>
                Música y YouTube{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Guía de Estrategia
                </span>
              </>
            ) : (
              <>
                Music &amp; YouTube{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Strategy Guide
                </span>
              </>
            )}
          </h1>
          <p className="mt-3 text-sm md:text-base text-zinc-300 max-w-3xl leading-relaxed">
            {isAr
              ? 'نظرة معمّقة على الموسيقى الرائجة، وملفات الفنانين، وخطط إطلاق الفيديو، وتحسين الخوارزمية.'
              : isTr
              ? 'Sanatçı portreleri, YouTube trend şarkı analizleri, klip lansmanlarında ilk 48 saat taktikleri ve resmi Google Ads video kampanyalarıyla kanal büyütme sırları.'
              : isEs
              ? 'Análisis en profundidad sobre música en tendencia, planes de lanzamiento de videoclips y optimización del algoritmo de YouTube con Google Ads.'
              : 'Deep dives on trending music, artist profiles, video launch playbooks, and algorithm optimization.'}
          </p>
        </div>

        {/* Categories Tab Navigation */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              {isAr ? 'تصفّح حسب الفئة' : isTr ? 'Kategorilere Göre İncele' : isEs ? 'Explorar por Categoría' : 'Browse by Category'}
            </h2>
            <span className="text-xs text-zinc-400">
              {filteredPosts.length} {isAr ? 'مقالات' : isTr ? 'yazı listeleniyor' : isEs ? 'artículos encontrados' : 'articles found'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategoryKey === cat.key;
              const count =
                cat.match === null
                  ? allPosts.length
                  : allPosts.filter((p) => postCategoryKey(p) === cat.key).length;

              // Arapça veya İspanyolca blogda yazısı olmayan kategori sekmesi gösterilmez (boş sayfa SEO'ya zarar verir).
              if ((locale === 'ar' || locale === 'es') && cat.match !== null && count === 0) return null;

              const href =
                cat.key === 'all'
                  ? `/${locale}/blog`
                  : `/${locale}/blog?kategori=${cat.key}`;

              return (
                <Link
                  key={cat.key}
                  href={href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E0002E] to-[#CC0029] text-white border-red-500/80 shadow-lg shadow-[#FF0033]/30 scale-105'
                      : 'bg-zinc-900/80 text-zinc-300 border-zinc-700/60 hover:border-zinc-500 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#FF6B6B]'}`} />
                  <span>{isAr ? cat.labelAr : isTr ? cat.labelTr : isEs ? cat.labelEs : cat.labelEn}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Featured First Post (Only if posts exist) */}
        {filteredPosts.length > 0 && (() => {
          const fp = filteredPosts[0];
          const fpTitle = (!isTr && !isAr && !isEs && fp.title_en) ? fp.title_en : fp.title;
          const fpSummary = (!isTr && !isAr && !isEs && fp.summary_en) ? fp.summary_en : fp.summary;
          const fpCategory = (!isTr && !isAr && !isEs && fp.category_en) ? fp.category_en : fp.category;
          const fpReadTime = (!isTr && !isAr && !isEs && fp.readTime_en) ? fp.readTime_en : fp.readTime;
          return (
            <Link
              href={`/${locale}/blog/${fp.slug}`}
              className="group mb-12 block overflow-hidden rounded-3xl border border-studio bg-studio-card p-6 md:p-8 backdrop-blur-xl shadow-2xl transition hover:border-studio-strong hover:bg-zinc-800/90"
            >
              <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] items-center">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/40">
                  <Image fill sizes="(min-width: 1024px) 480px, 100vw"
                    src={fp.image}
                    alt={fpTitle}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="rounded-full bg-[#FF0033]/20 px-3 py-1 font-bold text-[#FF6B6B]">
                      {fpCategory}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {displayDate(fp.date, locale)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {fpReadTime} {isAr ? 'قراءة' : isTr ? 'okuma' : isEs ? 'lectura' : 'read'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white group-hover:text-[#FF6B6B] transition sm:text-3xl">
                    {fpTitle}
                  </h2>
                  <p className="line-clamp-3 text-sm text-zinc-300 leading-relaxed">
                    {fpSummary}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6B6B] group-hover:text-[#FF8E53] transition pt-2">
                    <span>{isAr ? 'اقرأ المقال بالكامل' : isTr ? 'Yazının Tamamını Oku' : isEs ? 'Leer Artículo Completo' : 'Read Full Guide'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })()}

        {/* Remaining Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.slice(1).map((post) => {
            const pTitle = (!isTr && !isAr && !isEs && post.title_en) ? post.title_en : post.title;
            const pSummary = (!isTr && !isAr && !isEs && post.summary_en) ? post.summary_en : post.summary;
            const pCategory = (!isTr && !isAr && !isEs && post.category_en) ? post.category_en : post.category;
            return (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-studio bg-studio-card p-5 backdrop-blur-md shadow-lg transition hover:border-studio-strong hover:bg-zinc-800/90"
              >
                <div className="relative aspect-video overflow-hidden rounded-xl bg-black/40 mb-4">
                  <Image fill sizes="(min-width: 1024px) 320px, 100vw"
                    src={post.image}
                    alt={pTitle}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-2.5">
                  <span className="rounded-full bg-zinc-800 px-2 py-0.5 font-bold text-zinc-300">
                    {pCategory}
                  </span>
                  <span>•</span>
                  <span>{displayDate(post.date, locale)}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#FF6B6B] transition line-clamp-2 mb-2">
                  {pTitle}
                </h3>
                <p className="line-clamp-2 text-xs text-zinc-300 leading-relaxed mb-4 flex-grow">
                  {pSummary}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B6B] pt-2 border-t border-zinc-800">
                  <span>{isAr ? 'اقرأ التفاصيل' : isTr ? 'Detayları İncele' : isEs ? 'Leer Detalles' : 'Read More'}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
