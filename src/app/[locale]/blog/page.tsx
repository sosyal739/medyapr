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
import { getPosts, type BlogPost } from '@/lib/content';
import { getPageAlternates, toIsoDateString } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';
  return {
    title: {
      absolute: isTr ? 'YouTube Müzik Video & Klip PR Blogu | MedyaPR' : 'YouTube Music Video & PR Strategy Blog | MedyaPR',
    },
    description: isTr
      ? 'Sosyal medya tüyoları, nasıl yapılır rehberleri, tavsiyeler, sanatçı biyografileri (kimdir), klip analizleri ve resmi Google Ads video PR stratejileri.'
      : 'Social media growth tactics, YouTube music video launch playbooks, artist biographies, algorithm guides, and official Google Ads PR strategies.',
    alternates: getPageAlternates(locale, '/blog'),
    openGraph: {
      title: isTr ? 'YouTube Müzik Video & Klip PR Blogu | MedyaPR' : 'YouTube Music Video & PR Strategy Blog | MedyaPR',
      description: isTr
        ? 'Sosyal medya tüyoları, nasıl yapılır rehberleri, tavsiyeler, sanatçı biyografileri (kimdir), klip analizleri ve resmi Google Ads video PR stratejileri.'
        : 'Social media growth tactics, YouTube music video launch playbooks, artist biographies, algorithm guides, and official Google Ads PR strategies.',
      url: `https://medyapr.com/${locale}/blog`,
      images: ['/og-image.jpg'],
    },
  };
}

const CATEGORIES = [
  { key: 'all', labelTr: 'Tüm Rehberler', labelEn: 'All Guides', icon: BookOpen, match: null },
  { key: 'sosyal-medya', labelTr: 'Sosyal Medya', labelEn: 'Social Media', icon: Share2, match: 'Sosyal Medya' },
  { key: 'nasil-yapilir', labelTr: 'Nasıl Yapılır?', labelEn: 'How-To', icon: Sparkles, match: 'Nasıl Yapılır?' },
  { key: 'tavsiye', labelTr: 'Tavsiye', labelEn: 'Tips & Strategy', icon: Lightbulb, match: 'Tavsiye' },
  { key: 'kimdir', labelTr: 'Kimdir?', labelEn: 'Who Is?', icon: Users, match: 'Kimdir?' },
  { key: 'video-pr', labelTr: 'Resmi Video PR', labelEn: 'Official Video PR', icon: TrendingUp, match: 'Resmi Video PR & Google Ads' },
  { key: 'analizler', labelTr: 'Şarkı Analizleri', labelEn: 'Song Analysis', icon: Flame, match: 'Şarkı & Klip Analizleri' },
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
  const allPosts = await getPosts();
  const isTr = locale === 'tr';

  const activeCategory = CATEGORIES.find((c) => c.key === activeCategoryKey) || CATEGORIES[0];

  const filteredPosts =
    activeCategory.match === null
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory.match);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
            name: 'Blog',
            item: `https://medyapr.com/${locale}/blog`,
          },
        ],
      },
      {
        '@type': 'Blog',
        name: isTr ? 'MedyaPR YouTube Video & Müzik PR Strateji Blogu' : 'MedyaPR YouTube Video & Music PR Strategy Blog',
        description: isTr
          ? 'Sanatçı biyografileri, trend şarkı analizleri, klip pazarlama dinamikleri ve resmi Google Ads büyüme rehberleri.'
          : 'Artist portraits, YouTube music video PR strategies, algorithm breakdowns, and official Google Ads guides.',
        url: `https://medyapr.com/${locale}/blog`,
        blogPost: filteredPosts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
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
            {isTr ? 'Ana Sayfa' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#FF6B6B]">{isTr ? 'Müzik & Video PR Blogu' : 'Music & Video PR Blog'}</span>
          {activeCategory.key !== 'all' && (
            <>
              <span>/</span>
              <span className="text-zinc-200">{isTr ? activeCategory.labelTr : activeCategory.labelEn}</span>
            </>
          )}
        </div>

        {/* Header */}
        <div className="mb-10 border-b border-studio pb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E] mb-3">
            <BookOpen className="h-4 w-4 text-[#FF0033]" />
            {isTr ? 'Trend & Müzik PR Stratejileri' : 'Insights & Analytics'}
          </span>
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight">
            {isTr ? (
              <>
                Müzik &amp; YouTube{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Strateji Rehberi
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
            {isTr
              ? 'Sanatçı portreleri, YouTube trend şarkı analizleri, klip lansmanlarında ilk 48 saat taktikleri ve resmi Google Ads video kampanyalarıyla kanal büyütme sırları.'
              : 'Deep dives on trending music, artist profiles, video launch playbooks, and algorithm optimization.'}
          </p>
        </div>

        {/* Categories Tab Navigation */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              {isTr ? 'Kategorilere Göre İncele' : 'Browse by Category'}
            </h2>
            <span className="text-xs text-zinc-400">
              {filteredPosts.length} {isTr ? 'yazı listeleniyor' : 'articles found'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategoryKey === cat.key;
              const count =
                cat.match === null
                  ? allPosts.length
                  : allPosts.filter((p) => p.category === cat.match).length;

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
                      ? 'bg-gradient-to-r from-[#FF0033] to-[#CC0029] text-white border-red-500/80 shadow-lg shadow-[#FF0033]/30 scale-105'
                      : 'bg-zinc-900/80 text-zinc-300 border-zinc-700/60 hover:border-zinc-500 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-[#FF6B6B]'}`} />
                  <span>{isTr ? cat.labelTr : cat.labelEn}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
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
        {filteredPosts.length > 0 && (
          <Link
            href={`/${locale}/blog/${filteredPosts[0].slug}`}
            className="group mb-12 block overflow-hidden rounded-3xl border border-studio bg-studio-card p-6 md:p-8 backdrop-blur-xl shadow-2xl transition hover:border-studio-strong hover:bg-zinc-800/90"
          >
            <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] items-center">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/40">
                <Image fill sizes="(min-width: 1024px) 480px, 100vw"
                  src={filteredPosts[0].image}
                  alt={filteredPosts[0].title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-[#FF0033] px-3 py-1 text-xs font-bold text-white shadow-lg">
                  {(!isTr && filteredPosts[0].category_en) ? filteredPosts[0].category_en : filteredPosts[0].category}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#FF6B6B]" /> {filteredPosts[0].date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-white/40" /> {(!isTr && filteredPosts[0].readTime_en) ? filteredPosts[0].readTime_en : filteredPosts[0].readTime}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-[#FF6B6B] transition-colors leading-snug">
                  {(!isTr && filteredPosts[0].title_en) ? filteredPosts[0].title_en : filteredPosts[0].title}
                </h2>
                <p className="text-sm leading-relaxed text-white/65 line-clamp-3">
                  {(!isTr && filteredPosts[0].summary_en) ? filteredPosts[0].summary_en : filteredPosts[0].summary}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6B6B] group-hover:translate-x-1 transition-transform">
                  {isTr ? 'Yazıyı Oku' : 'Read Article'} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Other Posts Grid */}
        {filteredPosts.length > 1 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.slice(1).map((post) => {
              const postTitle = (!isTr && post.title_en) ? post.title_en : post.title;
              const postSummary = (!isTr && post.summary_en) ? post.summary_en : post.summary;
              const postCategory = (!isTr && post.category_en) ? post.category_en : post.category;
              const postReadTime = (!isTr && post.readTime_en) ? post.readTime_en : post.readTime;

              return (
                <Link
                  key={post.slug}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group flex flex-col justify-between rounded-3xl border border-studio bg-studio-card p-6 backdrop-blur-xl transition hover:border-studio-strong hover:bg-zinc-800/90 shadow-xl"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/40 mb-5">
                      <Image fill sizes="(min-width: 1024px) 480px, 100vw"
                        src={post.image}
                        alt={postTitle}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/10">
                        {postCategory}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#FF6B6B]" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-white/40" /> {postReadTime}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#FF6B6B] transition-colors leading-snug line-clamp-2">
                      {postTitle}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/60 line-clamp-3">
                      {postSummary}
                    </p>
                  </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs font-semibold text-[#FF6B6B]">
                  <span>{isTr ? 'Devamını Oku' : 'Read More'}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-12 text-center my-12">
            <BookOpen className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {isTr ? 'Bu kategoride henüz yazı bulunmuyor' : 'No posts in this category yet'}
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              {isTr ? 'Tüm rehber ve analizleri görmek için ana blog listesine dönebilirsiniz.' : 'Return to full blog list to see all guides and analysis.'}
            </p>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF0033] text-white text-xs font-bold"
            >
              {isTr ? 'Tüm Yazıları Gör' : 'View All Posts'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
