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
  getEsPosts,
  getEsPostBySlug,
  getEsTranslationMap,
  getPostsForLocale,
  postCategoryKey,
  isPostFullyTranslatedEn,
} from '@/lib/content';
import ArtistClaimBox from '@/components/common/ArtistClaimBox';
import { getLandingPages } from '@/data/landing';
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
      href = href.replace(/^\/(tr|en|ar|es)(?=\/|$|#)/, '');
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
  const esPosts = await getEsPosts();
  return [
    ...posts.filter((post) => !post.enOnly).map((post) => ({ locale: 'tr', slug: post.slug })),
    ...posts.filter(isPostFullyTranslatedEn).map((post) => ({ locale: 'en', slug: post.slug })),
    ...arPosts.map((post) => ({ locale: 'ar', slug: post.slug })),
    ...esPosts.map((post) => ({ locale: 'es', slug: post.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (locale === 'es') {
    const esPost = await getEsPostBySlug(slug);
    if (!esPost) return { title: 'Artículo no encontrado', robots: { index: false, follow: true } };
    const trTwin = esPost.translationOf ? await getPostBySlug(esPost.translationOf) : null;
    const esUrl = `${SITE_URL}/es/blog/${slug}`;
    const languages: Record<string, string> = { es: esUrl };
    if (trTwin && !trTwin.enOnly) languages.tr = `${SITE_URL}/tr/blog/${trTwin.slug}`;
    if (trTwin && isPostFullyTranslatedEn(trTwin)) languages.en = `${SITE_URL}/en/blog/${trTwin.slug}`;
    if (trTwin) {
      const arTwinSlug = (await getArTranslationMap())[trTwin.slug];
      if (arTwinSlug) languages.ar = `${SITE_URL}/ar/blog/${arTwinSlug}`;
    }
    languages['x-default'] = languages.tr ?? esUrl;
    return {
      title: { absolute: esPost.title },
      description: esPost.summary,
      robots: { index: false, follow: true },
      alternates: { canonical: esUrl, languages },
      openGraph: {
        title: esPost.title,
        description: esPost.summary,
        images: [{ url: esPost.image, width: 1200, height: 675, alt: esPost.title }],
        type: 'article',
        locale: 'es_ES',
        publishedTime: toIsoDateString(esPost.date),
        authors: [esPost.author],
      },
      twitter: { card: 'summary_large_image', title: esPost.title, description: esPost.summary, images: [esPost.image] },
    };
  }

  if (locale === 'ar') {
    const arPost = await getArPostBySlug(slug);
    if (!arPost) return { title: 'المقال غير موجود', robots: { index: false, follow: true } };
    // Arapça yazı bir Türkçe yazının çevirisiyse hreflang çifti kurulur; aksi halde yalnızca Arapça yayınlanır.
    const trTwin = arPost.translationOf ? await getPostBySlug(arPost.translationOf) : null;
    const arUrl = `${SITE_URL}/ar/blog/${slug}`;
    const languages: Record<string, string> = { ar: arUrl };
    if (trTwin && !trTwin.enOnly) languages.tr = `${SITE_URL}/tr/blog/${trTwin.slug}`;
    if (trTwin && isPostFullyTranslatedEn(trTwin)) languages.en = `${SITE_URL}/en/blog/${trTwin.slug}`;
    if (trTwin) {
      const esTwinSlug = (await getEsTranslationMap())[trTwin.slug];
      if (esTwinSlug) languages.es = `${SITE_URL}/es/blog/${esTwinSlug}`;
    }
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
    ? { canonical: `https://medyapr.com/en/blog/${slug}`, languages: { en: `https://medyapr.com/en/blog/${slug}`, 'x-default': `https://medyapr.com/en/blog/${slug}` } }
    : hasEn
    ? getPageAlternates(locale, `/blog/${slug}`, TR_EN)
    : {
        canonical: trCanonical,
        languages: {
          tr: trCanonical,
          'x-default': trCanonical,
        },
      };

  const arSlug = (await getArTranslationMap())[slug];
  if (arSlug) (alternates.languages as Record<string, string>).ar = `${SITE_URL}/ar/blog/${arSlug}`;
  const esSlug = (await getEsTranslationMap())[slug];
  if (esSlug) (alternates.languages as Record<string, string>).es = `${SITE_URL}/es/blog/${esSlug}`;

  return {
    title: {
      absolute: postTitle,
    },
    description: postSummary,
    robots: (post.noindex || (!isTr && !hasEn)) ? { index: false, follow: true } : undefined,
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
  const isEs = locale === 'es';
  const post = isAr ? await getArPostBySlug(slug) : isEs ? await getEsPostBySlug(slug) : await getPostBySlug(slug);

  if (!post) {
    // Yanlış dil önekiyle gelen adres: yazı başka dilde varsa kalıcı yönlendirme (404 değil).
    if (isAr || isEs) {
      const trPost = await getPostBySlug(slug);
      if (trPost) permanentRedirect(trPost.enOnly ? `/en/blog/${slug}` : `/tr/blog/${slug}`);
    } else if (await getArPostBySlug(slug)) {
      permanentRedirect(`/ar/blog/${slug}`);
    } else if (await getEsPostBySlug(slug)) {
      permanentRedirect(`/es/blog/${slug}`);
    }
    notFound();
  }

  if (isTr && post.enOnly) {
    permanentRedirect(`/en/blog/${slug}`);
  }

  const hasEn = isPostFullyTranslatedEn(post);
  if (!isTr && !isAr && !isEs && !hasEn) {
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
  const relatedPosts = [...sameCatPosts, ...otherCatPosts].slice(0, 6);
  const postTitle = (locale === 'en' && hasEn && post.title_en) ? post.title_en : post.title;
  const postSummary = (locale === 'en' && hasEn && post.summary_en) ? post.summary_en : post.summary;
  const postCategory = (locale === 'en' && post.category_en) ? post.category_en : post.category;
  const postReadTime = (locale === 'en' && post.readTime_en) ? post.readTime_en : post.readTime;
  const postAuthorRole = (locale === 'en' && post.authorRole_en) ? post.authorRole_en : post.authorRole;
  const postQuickFact = (locale === 'en') ? (post.quickFact_en ?? (post.enOnly ? post.quickFact : undefined)) : post.quickFact;
  const postTable = (locale === 'en') ? (post.table_en ?? (post.enOnly ? post.table : undefined)) : post.table;
  const postFaqs = (locale === 'en') ? (post.faqs_en ?? (post.enOnly ? post.faqs : undefined)) : post.faqs;
  const postParagraphs = (locale === 'en' && hasEn && post.paragraphs_en) ? post.paragraphs_en : (post.paragraphs || []);
  const postTags = (locale === 'en' && post.tags_en) ? post.tags_en : post.tags;

  // Schema.org Graph (BlogPosting + BreadcrumbList + FAQPage)
  const schemaGraph: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: postTitle,
      description: postSummary,
      image: post.image,
      datePublished: toIsoDateString(post.date),
      inLanguage: isAr ? schemaLang('ar') : isEs ? schemaLang('es') : (isTr || !hasEn) ? 'tr-TR' : 'en-US',
      mainEntityOfPage: `https://medyapr.com/${locale}/blog/${slug}`,
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
          name: isAr ? 'الرئيسية' : isTr ? 'Ana Sayfa' : 'Home',
          item: `https://medyapr.com/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: isAr ? 'المدونة' : 'Blog',
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
            {isAr ? 'الرئيسية' : isTr ? 'Ana Sayfa' : isEs ? 'Inicio' : 'Home'}
          </Link>
          <span className="text-zinc-600">/</span>
          <Link href={`/${locale}/blog`} className="hover:text-white transition">
            {isAr ? 'المدونة' : isEs ? 'Blog' : isTr ? 'Blog' : 'Blog'}
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
              <Clock className="h-4 w-4 text-zinc-500" /> {postReadTime} {isAr ? 'قراءة' : isTr ? 'okuma' : isEs ? 'lectura' : 'read'}
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
                    {isAr ? 'حقائق سريعة' : isTr ? 'Özet Bilgi' : isEs ? 'Resumen Rápido' : 'Quick Facts'}
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                    {isAr ? 'إجابة مختصرة' : isTr ? 'Kısa Yanıt' : isEs ? 'Respuesta Directa' : 'Short Answer'}
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
              <span className="block text-xs text-zinc-400">{isAr ? 'عن الفنان' : isTr ? 'Sanatçıyı tanıyın' : isEs ? 'Sobre el artista' : 'About the artist'}</span>
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
                {postTable.caption || (isAr ? 'الأداء ومعيار المقارنة' : isTr ? 'Performans & Karşılaştırma Tablosu' : isEs ? 'Tabla de Comparación y Rendimiento' : 'Performance & Comparison Benchmark')}
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
            return (
              <p key={idx} className="leading-relaxed">
                {parseParagraphWithLinks(p, locale)}
              </p>
            );
          })}
        </div>

        {/* ── Structured FAQ Section (FAQPage Schema Accordion) ── */}
        {postFaqs && postFaqs.length > 0 && (
          <div className="mt-14 space-y-4 rounded-3xl border border-studio bg-studio-card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-[#FF0033]" />
              <h3 className="text-xl font-extrabold text-white">
                {isAr ? 'الأسئلة الشائعة' : isTr ? 'Sıkça Sorulan Sorular' : isEs ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
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
                {isAr ? 'شريك Google رسمي' : isTr ? 'Resmi Google Partner' : isEs ? 'Google Partner Oficial' : 'Official Google Partner'}
              </span>
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                {isAr ? 'خبرة تتجاوز 18 عامًا' : isTr ? '18+ Yıllık Tecrübe' : isEs ? '18+ Años de Experiencia' : '18+ Years Track Record'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isAr
                ? 'كتبه وراجعه خبراء المحتوى في MedyaPR، الذين يديرون حملات ترويج فيديو رسمية كشريك Google لشركات التسجيلات والفنانين المستقلين وشركات الإنتاج في تركيا وحول العالم.'
                : isTr
                ? 'Türkiye ve dünya genelinde müzik klipleri, prodüksiyon şirketleri ve sanatçılar için resmi Google Ads video PR stratejileri geliştiren MedyaPR editoryal uzmanları tarafından hazırlanmıştır.'
                : isEs
                ? 'Redactado y verificado por los estrategas de contenido de MedyaPR, especialistas en campañas de PR y video de Google Ads para sellos discográficos, artistas independientes y productoras.'
                : 'Written and verified by MedyaPR editorial strategists, managing official Google Partner video PR campaigns for record labels, independent artists, and production companies in Turkey and worldwide.'}
            </p>
          </div>
        </div>

        {/* In-Article Conversion Card */}
        <div className="mt-10 relative overflow-hidden rounded-3xl border border-[#FF0033]/40 bg-studio-card p-8 md:p-10 shadow-2xl">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/20 px-3 py-1 text-xs font-bold text-[#FF6B6B]">
              <Sparkles className="h-3.5 w-3.5" />
              {isAr ? 'حملة ترويج فيديو رسمية عبر Google Ads' : isTr ? 'Resmi Reklam & Video PR Kampanyası' : isEs ? 'Campaña Oficial de Publicidad y Video PR' : 'Official Google Ads Video PR Campaign'}
            </span>
            <h3 className="text-2xl font-black text-white">
              {isAr
                ? 'هل تريد أن يصل فيديو الكليب الخاص بك إلى قوائم الترند على يوتيوب؟'
                : isTr
                ? 'Kendi Klibinizi de YouTube Trendlerine Taşımak İster Misiniz?'
                : isEs
                ? '¿Quieres posicionar tu video musical en las tendencias de YouTube?'
                : 'Want to Push Your Music Video into the YouTube Trending Charts?'}
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {isAr
                ? "ابتعد عن لوحات البوتات المشبوهة التي تضر بمكانة قناتك لدى الخوارزمية. أطلق حملة إعلانية رسمية عبر Google Ads مع استهداف حسب العمر ونوع الموسيقى والموقع الجغرافي. راسلنا للحصول على مراجعة مجانية لفيديو الكليب."
                : isTr
                ? 'Bot panelleriyle kanalınızı riske atmayın. Şarkınız için yaş, müzik zevki ve bölge hedefli resmi Google Ads kampanyası başlatın; ücretsiz video analizi için bize yazın.'
                : isEs
                ? 'No arriesgues tu canal con paneles de bots. Lanza una campaña oficial de Google Ads segmentada por edad, género musical y ubicación. Contáctanos para un análisis gratuito de tu video.'
                : "Avoid shady bot panels that damage your channel's algorithmic standing. Launch a targeted official Google Ads video campaign with age, genre, and geographic audience targeting. Message us for a free video review."}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <Link
              href={`/${locale}/fiyatlandirma`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-7 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-[#FF0033]/30 hover:scale-105 transition"
            >
              {isAr ? 'أسعار إعلانات يوتيوب وحاسبة الأسعار' : isTr ? 'YouTube Reklam Fiyatları & Hesaplama' : isEs ? 'Precios y Calculadora de Anuncios' : 'YouTube Ad Pricing & Calculator'}{' '}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/klip-pr`}
              className="inline-flex items-center gap-2 rounded-xl border border-[#FF0033]/50 bg-[#FF0033]/15 px-6 py-3.5 text-sm font-extrabold text-white hover:bg-[#FF0033]/25 transition"
            >
              {isAr ? 'الترويج الرقمي وإطلاق فيديو الكليب' : isTr ? 'Müzik Klibi Dijital PR & Lansman' : isEs ? 'Lanzamiento y PR Digital de Video' : 'Music Video Digital PR & Launch'}
            </Link>
            <Link
              href={`/${locale}/order`}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-6 py-3.5 text-sm font-extrabold text-emerald-300 hover:bg-emerald-500/25 transition"
            >
              {isAr ? 'أرسل رابط الفيديو واطلب التحليل' : isTr ? 'Video Linki Gir & Analiz İste' : isEs ? 'Enviar Enlace y Solicitar Análisis' : 'Submit Video Link & Request Audit'}
            </Link>
            <Link
              href={`/${locale}/hizmetler`}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-5 py-3.5 text-sm font-bold text-zinc-200 hover:bg-zinc-700 transition"
            >
              {isAr ? 'باقات مشاهدات يوتيوب عبر Google Ads' : isTr ? 'Google Ads YouTube İzlenme Paketleri' : isEs ? 'Paquetes de Vistas con Google Ads' : 'Google Ads YouTube View Packages'}
            </Link>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2.5">
              {isAr ? '🎯 خدمات الترويج الرسمية على يوتيوب:' : isTr ? '🎯 Resmi YouTube Reklam & Klip Tanıtım Sayfaları:' : isEs ? '🎯 Páginas Oficiales de Promoción en YouTube:' : '🎯 Official YouTube Music Promotion Pages:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-extrabold">
              {getLandingPages(locale).map((lp) => (
                <Link
                  key={lp.slug}
                  href={`/${locale}/${lp.slug}`}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-emerald-200 hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-white transition"
                >
                  🚀 {lp.keyword} →
                </Link>
              ))}
            </div>
          </div>
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
                  {isAr ? 'مجموعة المواضيع والأدلة ذات الصلة' : isTr ? 'Konu Kümesi & Önerilen Rehberler' : isEs ? 'Grupo Temático y Guías Recomendadas' : 'Topic Cluster & Related Guides'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {isAr ? 'رؤى ذات صلة بالترويج للفيديو' : isTr ? 'İlgili Müzik PR ve Algoritma Analizleri' : isEs ? 'Análisis Relacionados de Video PR' : 'Related Video PR Insights'}
                </h3>
              </div>
              <Link
                href={`/${locale}/blog`}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition"
              >
                {isAr ? 'عرض الكل' : isTr ? 'Tüm Yazılar' : isEs ? 'Ver Todos' : 'View All'} <ArrowRight className="h-3.5 w-3.5" />
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
                        {isAr ? 'اقرأ ←' : isTr ? 'Oku →' : isEs ? 'Leer →' : 'Read →'}
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
