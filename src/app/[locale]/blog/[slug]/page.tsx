import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  User,
  Tag,
  ShieldCheck,
  Award,
  HelpCircle,
  Table as TableIcon,
  Quote,
} from 'lucide-react';
import {
  getPosts,
  getPostBySlug,
  getArPosts,
  getArPostBySlug,
  getArTranslationMap,
  getPostsForLocale,
  postCategoryKey,
  isPostFullyTranslatedEn,
} from '@/lib/content';
import ArtistClaimBox from '@/components/common/ArtistClaimBox';
import { displayDate, getPageAlternates, toIsoDateString, SITE_URL, TR_EN } from '@/lib/seo';
import { schemaLang } from '@/lib/i18n/config';

function parseParagraphWithLinks(text: string, locale: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const label = match[1];
    let href = match[2];
    if (href.startsWith('/')) {
      href = href.replace(/^\/(tr|en|ar)(?=\/|$|#)/, '');
      if (href === '' || href === '#calculator' || href === '/#calculator') {
        href = '/fiyatlandirma';
      }
      href = `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
    }
    parts.push(
      <Link
        key={match.index}
        href={href}
        className="font-semibold text-[#FF6B6B] hover:text-[#FF8E53] underline decoration-[#FF0033]/50 underline-offset-2 transition"
      >
        {label}
      </Link>
    );
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPosts();
  const arPosts = await getArPosts();
  return [
    ...posts.filter((post) => !post.enOnly).map((post) => ({ locale: 'tr', slug: post.slug })),
    ...posts.filter(isPostFullyTranslatedEn).map((post) => ({ locale: 'en', slug: post.slug })),
    ...arPosts.map((post) => ({ locale: 'ar', slug: post.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (locale === 'ar') {
    const arPost = await getArPostBySlug(slug);
    if (!arPost) return { title: 'المقال غير موجود', robots: { index: false, follow: true } };
    // Arapça yazı bir Türkçe yazının çevirisiyse hreflang çifti kurulur; aksi halde yalnızca Arapça yayınlanır.
    const trTwin = arPost.translationOf ? await getPostBySlug(arPost.translationOf) : null;
    const arUrl = `${SITE_URL}/ar/blog/${slug}`;
    const languages: Record<string, string> = { ar: arUrl };
    if (trTwin && !trTwin.enOnly) languages.tr = `${SITE_URL}/tr/blog/${trTwin.slug}`;
    if (trTwin && isPostFullyTranslatedEn(trTwin)) languages.en = `${SITE_URL}/en/blog/${trTwin.slug}`;
    languages['x-default'] = languages.tr ?? arUrl;
    return {
      title: { absolute: arPost.title },
      description: arPost.summary,
      alternates: { canonical: arUrl, languages },
      openGraph: {
        title: arPost.title,
        description: arPost.summary,
        images: [{ url: arPost.image, width: 1200, height: 675, alt: arPost.title }],
        type: 'article',
        locale: 'ar_AR',
        publishedTime: toIsoDateString(arPost.date),
        authors: [arPost.author],
      },
      twitter: { card: 'summary_large_image', title: arPost.title, description: arPost.summary, images: [arPost.image] },
    };
  }

  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Yazı Bulunamadı' };

  const isTr = locale === 'tr';
  const hasEn = isPostFullyTranslatedEn(post);
  const postTitle = (!isTr && hasEn && post.title_en) ? post.title_en : post.title;
  const postSummary = (!isTr && hasEn && post.summary_en) ? post.summary_en : post.summary;
  const trCanonical = `https://medyapr.com/tr/blog/${slug}`;

  const alternates = post.enOnly
    ? { canonical: `https://medyapr.com/en/blog/${slug}`, languages: { en: `https://medyapr.com/en/blog/${slug}` } }
    : hasEn
    ? getPageAlternates(locale, `/blog/${slug}`)
    : {
        canonical: trCanonical,
        languages: {
          tr: trCanonical,
          'x-default': trCanonical,
        },
      };

  const arSlug = (await getArTranslationMap())[slug];
  if (arSlug) (alternates.languages as Record<string, string>).ar = `${SITE_URL}/ar/blog/${arSlug}`;

  return {
    title: {
      absolute: postTitle,
    },
    description: postSummary,
    robots: (!isTr && !hasEn) ? { index: false, follow: true } : undefined,
    alternates,
    openGraph: {
      title: postTitle,
      description: postSummary,
      images: [{ url: post.image, width: 1200, height: 675, alt: postTitle }],
      type: 'article',
      publishedTime: toIsoDateString(post.date),
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: postTitle,
      description: postSummary,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const isTr = locale === 'tr';
  const isAr = locale === 'ar';
  const post = isAr ? await getArPostBySlug(slug) : await getPostBySlug(slug);

  if (!post) {
    // Yanlış dil önekiyle gelen adres: yazı başka dilde varsa kalıcı yönlendirme (404 değil).
    if (isAr) {
      const trPost = await getPostBySlug(slug);
      if (trPost) permanentRedirect(trPost.enOnly ? `/en/blog/${slug}` : `/tr/blog/${slug}`);
    } else if (await getArPostBySlug(slug)) {
      permanentRedirect(`/ar/blog/${slug}`);
    }
    notFound();
  }

  if (isTr && post.enOnly) {
    notFound();
  }

  const hasEn = isPostFullyTranslatedEn(post);
  if (!isTr && !isAr && !hasEn) {
    permanentRedirect(`/tr/blog/${slug}`);
  }

  const allPosts = await getPostsForLocale(locale);
  const categoryKey = postCategoryKey(post);

  const sameCatPosts = allPosts.filter((p) => p.slug !== slug && p.category === post?.category);
  const otherCatPosts = allPosts.filter((p) => p.slug !== slug && p.category !== post?.category);
  const isBioPost = !isAr && /kimdir/.test(post.slug);
  const bioArtistName = isBioPost
    ? ((!isTr && post.title_en ? post.title_en.match(/^Who is (.+?)\?/i)?.[1] : undefined) ?? post.title.split(/ Kimdir/i)[0]).trim()
    : '';
  const bioPost = post.bioSlug ? allPosts.find((p) => p.slug === post.bioSlug) : undefined;
  const relatedPosts = [...sameCatPosts, ...otherCatPosts].slice(0, 3);
  const postTitle = (!isTr && hasEn && post.title_en) ? post.title_en : post.title;
  const postSummary = (!isTr && hasEn && post.summary_en) ? post.summary_en : post.summary;
  const postCategory = (!isTr && post.category_en) ? post.category_en : post.category;
  const postReadTime = (!isTr && post.readTime_en) ? post.readTime_en : post.readTime;
  const postAuthorRole = (!isTr && post.authorRole_en) ? post.authorRole_en : post.authorRole;
  const postQuickFact = (!isTr && hasEn && post.quickFact_en) ? post.quickFact_en : post.quickFact;
  const postTable = (!isTr && hasEn && post.table_en) ? post.table_en : post.table;
  const postFaqs = (!isTr && hasEn && post.faqs_en) ? post.faqs_en : post.faqs;
  const postParagraphs = (!isTr && hasEn && post.paragraphs_en) ? post.paragraphs_en : (post.paragraphs || []);
  const postTags = (!isTr && post.tags_en) ? post.tags_en : post.tags;

  // Schema.org Graph (BlogPosting + BreadcrumbList + FAQPage)
  const schemaGraph: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: postTitle,
      description: postSummary,
      image: post.image,
      datePublished: toIsoDateString(post.date),
      inLanguage: isAr ? schemaLang('ar') : (isTr || !hasEn) ? 'tr-TR' : 'en-US',
      mainEntityOfPage: isAr ? `https://medyapr.com/ar/blog/${slug}` : (isTr || !hasEn) ? `https://medyapr.com/tr/blog/${slug}` : `https://medyapr.com/${locale}/blog/${slug}`,
      author: {
        '@type': 'Organization',
        name: 'MedyaPR',
        url: `https://medyapr.com/${locale}/hakkimizda`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'MedyaPR',
        url: 'https://medyapr.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://medyapr.com/logo.png',
        },
      },
    },
    {
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
          name: 'Blog',
          item: `https://medyapr.com/${locale}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: postCategory,
          item: `https://medyapr.com/${locale}/blog?kategori=${categoryKey}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: postTitle,
          item: `https://medyapr.com/${locale}/blog/${slug}`,
        },
      ],
    },
  ];

  if (postFaqs && postFaqs.length > 0) {
    schemaGraph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: postFaqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  return (
    <article className="min-h-screen bg-app-base text-white py-14 md:py-20 relative">
      {/* Schema.org Combined JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaGraph),
        }}
      />

      {/* Ambient Glow */}
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#FF0033]/12 blur-[160px]" />

      <div className="relative mx-auto max-w-4xl px-4 md:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-white transition">
            {isTr ? 'Ana Sayfa' : 'Home'}
          </Link>
          <span className="text-zinc-600">/</span>
          <Link href={`/${locale}/blog`} className="hover:text-white transition">
            Blog
          </Link>
          <span className="text-zinc-600">/</span>
          <Link
            href={`/${locale}/blog?kategori=${categoryKey}`}
            className="hover:text-[#FF6B6B] transition text-zinc-300"
          >
            {postCategory}
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-10 space-y-4">
          <span className="inline-block rounded-full bg-[#FF0033]/20 border border-[#FF0033]/40 px-3.5 py-1 text-xs font-bold text-[#FF6B6B]">
            {postCategory}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {postTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-6 border-y border-studio py-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#FF6B6B]" />
              <strong className="text-white">{post.author}</strong> ({postAuthorRole})
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-zinc-500" /> {displayDate(post.date, locale)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-zinc-500" /> {postReadTime} {isTr ? 'okuma' : 'read'}
            </span>
          </div>
        </header>

        {/* ── Princeton GEO Quick Fact / Doğrudan Cevap Kutusu (Preferred Source) ── */}
        {postQuickFact && (
          <div className="mb-10 relative overflow-hidden rounded-3xl border border-[#FF0033]/40 bg-gradient-to-r from-zinc-900/90 via-zinc-900/95 to-zinc-950 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF0033]/20 text-[#FF4D6D] border border-[#FF0033]/30">
                <Quote className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#FF6B6B]">
                    {isTr ? 'Özet Bilgi' : 'Quick Facts'}
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                    {isTr ? 'Kısa Yanıt' : 'Short Answer'}
                  </span>
                </div>
                <blockquote className="text-sm sm:text-base font-medium leading-relaxed text-zinc-200 italic">
                  &ldquo;{postQuickFact}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        )}

        {/* Sanatçı "kimdir" sayfasına yönlendirme: bilgi sorguları tek sayfada toplanır */}
        {bioPost && (
          <Link
            href={`/${locale}/blog/${bioPost.slug}`}
            className="mb-10 -mt-4 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-zinc-200 transition hover:border-[#FF0033]/50 hover:bg-white/[0.07]"
          >
            <span>
              <span className="block text-xs text-zinc-400">{isTr ? 'Sanatçıyı tanıyın' : 'About the artist'}</span>
              <span className="font-bold text-white">{(!isTr && bioPost.title_en) ? bioPost.title_en : bioPost.title}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        )}

        {/* Featured YouTube Video Embed or 16:9 Image */}
        {post.videoId ? (
          <div className="mb-12 overflow-hidden rounded-3xl border border-white/15 bg-black shadow-2xl aspect-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${post.videoId}`}
              title={postTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        ) : (
          <div className="relative mb-12 overflow-hidden rounded-3xl border border-white/15 aspect-video shadow-2xl">
            <Image fill preload sizes="(min-width: 1024px) 800px, 100vw" src={post.image} alt={postTitle} className="object-cover" />
          </div>
        )}

        {/* ── Structured Benchmark Table (Featured Snippet & AI Citability) ── */}
        {postTable && (
          <div className="mb-12 overflow-hidden rounded-3xl border border-studio bg-studio-card p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <TableIcon className="h-4 w-4 text-[#FF4D6D]" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                {postTable.caption || (isTr ? 'Performans & Karşılaştırma Tablosu' : 'Performance & Comparison Benchmark')}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04] text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {postTable.headers.map((h, i) => (
                      <th key={i} className="py-3.5 px-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {postTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-3.5 px-4 text-xs sm:text-sm ${
                            cIdx === 0 ? 'font-bold text-white' : 'text-zinc-300'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Article Body */}
        <div className="space-y-6 text-base sm:text-lg leading-relaxed text-white/80">
          {postParagraphs.map((p, idx) => {
            if (p.startsWith('### ')) {
              return (
                <h2 key={idx} className="pt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {p.replace('### ', '')}
                </h2>
              );
            }
            if (p.startsWith('1. ') || p.startsWith('2. ') || p.startsWith('3. ')) {
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-base text-zinc-200">
                  {parseParagraphWithLinks(p, locale)}
                </div>
              );
            }
            const isMidArticle = idx === 2 && postParagraphs.length > 4;
            return (
              <div key={idx} className="space-y-6">
                <p className="leading-relaxed">
                  {parseParagraphWithLinks(p, locale)}
                </p>
                {isMidArticle && (
                  <div className="my-8 rounded-2xl border border-[#FF0033]/30 bg-gradient-to-r from-[#FF0033]/15 via-zinc-900 to-zinc-950 p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#FF6B6B] bg-[#FF0033]/20 px-2.5 py-0.5 rounded-full inline-block">
                        {isTr ? '🎯 Kendi Klibinizi Başlatın' : '🎯 Promote Your Music Video'}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        {isTr
                          ? 'Klibiniz için bütçenize uygun resmi Google Ads paketini hesaplayın'
                          : 'Calculate your official Google Ads music video launch package'}
                      </h4>
                      <p className="text-xs text-zinc-300">
                        {isTr
                          ? '%100 YouTube Studio tescilli resmi reklam izlenmeleri.'
                          : '100% YouTube Studio verified official ad views.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap shrink-0 items-center gap-2.5">
                      <Link
                        href={`/${locale}/fiyatlandirma`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-5 py-3 text-xs font-black text-white shadow-lg shadow-[#FF0033]/30 hover:scale-105 transition"
                      >
                        {isTr ? 'YouTube Reklam Fiyatları' : 'Calculate Ad Pricing'} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/${locale}/order`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-bold text-white hover:bg-white/10 transition"
                      >
                        {isTr ? 'Klip Analizi İste' : 'Request Video Audit'}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Structured FAQ Section (FAQPage Schema Accordion) ── */}
        {postFaqs && postFaqs.length > 0 && (
          <div className="mt-14 space-y-4 rounded-3xl border border-studio bg-studio-card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-[#FF0033]" />
              <h3 className="text-xl font-extrabold text-white">
                {isTr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
              </h3>
            </div>
            <div className="space-y-3">
              {postFaqs.map((f, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">{f.question}</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-studio pt-6">
          <Tag className="h-4 w-4 text-[#FF6B6B]" />
          {postTags.map((tag) => (
            <span key={tag} className="rounded-xl border border-studio bg-zinc-800/80 px-3 py-1 text-xs text-zinc-300">
              #{tag}
            </span>
          ))}
        </div>

        {/* ── E-E-A-T Author & Agency Credibility Card ── */}
        <div className="mt-10 rounded-3xl border border-white/15 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#FF0033] to-[#99001F] flex items-center justify-center text-white font-black text-2xl shadow-xl">
            PR
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-extrabold text-white text-base">{post.author}</span>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-bold text-blue-300 border border-blue-500/30">
                {isTr ? 'Resmi Google Partner' : 'Official Google Partner'}
              </span>
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                {isTr ? '18+ Yıllık Tecrübe' : '18+ Years Track Record'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isTr
                ? 'Türkiye ve dünya genelinde müzik klipleri, prodüksiyon şirketleri ve sanatçılar için resmi Google Ads video PR stratejileri geliştiren MedyaPR editoryal uzmanları tarafından hazırlanmıştır.'
                : 'Written and verified by MedyaPR editorial strategists, managing official Google Partner video PR campaigns for record labels, independent artists, and production companies in Turkey and worldwide.'}
            </p>
          </div>
        </div>

        {/* In-Article Conversion Card */}
        <div className="mt-10 relative overflow-hidden rounded-3xl border border-[#FF0033]/40 bg-studio-card p-8 md:p-10 shadow-2xl">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/20 px-3 py-1 text-xs font-bold text-[#FF6B6B]">
              <Sparkles className="h-3.5 w-3.5" />
              {isTr ? 'Resmi Reklam & Video PR Kampanyası' : 'Official Google Ads Video PR Campaign'}
            </span>
            <h3 className="text-2xl font-black text-white">
              {isTr
                ? 'Kendi Klibinizi de YouTube Trendlerine Taşımak İster Misiniz?'
                : 'Want to Push Your Music Video into the YouTube Trending Charts?'}
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {isTr
                ? 'Bot panelleriyle kanalınızı riske atmayın. Şarkınız için yaş, müzik zevki ve bölge hedefli resmi Google Ads kampanyası başlatın; ücretsiz video analizi için bize yazın.'
                : "Avoid shady bot panels that damage your channel's algorithmic standing. Launch a targeted official Google Ads video campaign with age, genre, and geographic audience targeting. Message us for a free video review."}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <Link
              href={`/${locale}/fiyatlandirma`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-7 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-[#FF0033]/30 hover:scale-105 transition"
            >
              {isTr ? 'YouTube Reklam Fiyatları & Hesaplama' : 'YouTube Ad Pricing & Calculator'}{' '}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/klip-pr`}
              className="inline-flex items-center gap-2 rounded-xl border border-[#FF0033]/50 bg-[#FF0033]/15 px-6 py-3.5 text-sm font-extrabold text-white hover:bg-[#FF0033]/25 transition"
            >
              {isTr ? 'Müzik Klibi Dijital PR & Lansman' : 'Music Video Digital PR & Launch'}
            </Link>
            <Link
              href={`/${locale}/order`}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-6 py-3.5 text-sm font-extrabold text-emerald-300 hover:bg-emerald-500/25 transition"
            >
              {isTr ? 'Video Linki Gir & Analiz İste' : 'Submit Video Link & Request Audit'}
            </Link>
            <Link
              href={`/${locale}/hizmetler`}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-5 py-3.5 text-sm font-bold text-zinc-200 hover:bg-zinc-700 transition"
            >
              {isTr ? 'Google Ads YouTube İzlenme Paketleri' : 'Google Ads YouTube View Packages'}
            </Link>
          </div>

          {!isAr && (
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
              {isTr ? '📌 Sanatçılar İçin Öne Çıkan Resmi YouTube Rehberleri:' : '📌 Featured Official YouTube Guides for Artists:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold">
              <Link
                href={`/${locale}/blog/youtube-shorts-reklami-nasil-verilir-muzik-klibi-demand-gen`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-zinc-200 hover:border-[#FF0033]/50 hover:text-white transition"
              >
                📱 {isTr ? 'YouTube Shorts Reklam Verme Rehberi' : 'YouTube Shorts Ad Promotion Guide'} →
              </Link>
              <Link
                href={`/${locale}/blog/youtube-4000-saat-izlenme-suresi-nasil-doldurulur-para-kazanma-rehberi`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-zinc-200 hover:border-[#FF0033]/50 hover:text-white transition"
              >
                ⏱️ {isTr ? 'YouTube 4000 Saat İzlenme Doldurma' : 'YouTube 4,000 Watch Hours Guide'} →
              </Link>
              <Link
                href={`/${locale}/blog/youtube-premiere-nasil-yapilir-muzik-klibi-lansman-adimlari`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-zinc-200 hover:border-[#FF0033]/50 hover:text-white transition"
              >
                🎬 {isTr ? 'YouTube Premiere İlk Gösterim Kurgusu' : 'YouTube Premiere Music Video Setup'} →
              </Link>
              <Link
                href={`/${locale}/blog/youtube-canli-yayini-nasil-baslatilir-ve-one-cikarilir`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-zinc-200 hover:border-[#FF0033]/50 hover:text-white transition"
              >
                🔴 {isTr ? 'YouTube Canlı Yayın Açma Şartları' : 'YouTube Live Stream Requirements'} →
              </Link>
              <Link
                href={`/${locale}/blog/youtube-gizli-ve-liste-disi-video-farki-nedir`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-zinc-200 hover:border-[#FF0033]/50 hover:text-white transition"
              >
                🔒 {isTr ? 'YouTube Liste Dışı Video Ne Demek?' : 'YouTube Unlisted vs Private Videos'} →
              </Link>
              <Link
                href={`/${locale}/blog/youtube-klip-tanitimi-google-ads-rehberi`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-zinc-200 hover:border-[#FF0033]/50 hover:text-white transition"
              >
                📘 {isTr ? 'YouTube Klip Tanıtımı Nasıl Yapılır?' : 'How to Promote a Music Video on YouTube'} →
              </Link>
            </div>
          </div>
          )}
        </div>

        {/* ── Topic Cluster: Related Articles ── */}
        {isBioPost && bioArtistName && (
          <ArtistClaimBox artistName={bioArtistName} pageUrl={`https://medyapr.com/${locale}/blog/${post.slug}`} locale={locale} source="bio_post" />
        )}

        {relatedPosts.length > 0 && (
          <div className="mt-14 border-t border-studio pt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B6B]">
                  {isTr ? 'Konu Kümesi & Önerilen Rehberler' : 'Topic Cluster & Related Guides'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {isTr ? 'İlgili Müzik PR ve Algoritma Analizleri' : 'Related Video PR Insights'}
                </h3>
              </div>
              <Link
                href={`/${locale}/blog`}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition"
              >
                {isTr ? 'Tüm Yazılar' : 'View All'} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/${locale}/blog/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-studio bg-studio-card hover:border-[#FF0033]/50 transition duration-300"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <Image fill sizes="(min-width: 1024px) 800px, 100vw"
                      src={rel.image}
                      alt={(!isTr && rel.title_en) ? rel.title_en : rel.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-lg bg-black/70 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
                      {(!isTr && rel.category_en) ? rel.category_en : rel.category}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#FF6B6B] transition line-clamp-2">
                      {(!isTr && rel.title_en) ? rel.title_en : rel.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                      <span>{displayDate(rel.date, locale)}</span>
                      <span className="font-semibold text-white/80 group-hover:translate-x-0.5 transition flex items-center gap-1">
                        {isTr ? 'Oku →' : 'Read →'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
