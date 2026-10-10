import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
import { getPosts, getPostBySlug } from '@/lib/content';

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
    if (href.startsWith('/') && !href.startsWith(`/${locale}`)) {
      href = `/${locale}${href}`;
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
  return ['tr', 'en'].flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Yazı Bulunamadı' };

  return {
    title: {
      absolute: post.title,
    },
    description: post.summary,
    alternates: {
      canonical: `https://medyapr.com/${locale}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      images: [{ url: post.image, width: 1200, height: 675, alt: post.title }],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  const allPosts = await getPosts();
  const catKeyMap: Record<string, string> = {
    'Sosyal Medya': 'sosyal-medya',
    'Nasıl Yapılır?': 'nasil-yapilir',
    'Tavsiye': 'tavsiye',
    'Kimdir?': 'kimdir',
    'Resmi Video PR & Google Ads': 'video-pr',
    'Şarkı & Klip Analizleri': 'analizler',
  };
  const categoryKey = post ? (catKeyMap[post.category] || 'all') : 'all';

  const sameCatPosts = allPosts.filter((p) => p.slug !== slug && p.category === post?.category);
  const otherCatPosts = allPosts.filter((p) => p.slug !== slug && p.category !== post?.category);
  const relatedPosts = [...sameCatPosts, ...otherCatPosts].slice(0, 3);

  if (!post) {
    notFound();
  }

  const isTr = locale === 'tr';

  // Schema.org Graph (BlogPosting + BreadcrumbList + FAQPage)
  const schemaGraph: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.summary,
      image: post.image,
      datePublished: '2026-10-09',
      inLanguage: isTr ? 'tr-TR' : 'en-US',
      mainEntityOfPage: `https://medyapr.com/${locale}/blog/${slug}`,
      author: {
        '@type': 'Person',
        name: post.author,
        jobTitle: post.authorRole,
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
          name: post.category,
          item: `https://medyapr.com/${locale}/blog?kategori=${categoryKey}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: post.title,
          item: `https://medyapr.com/${locale}/blog/${slug}`,
        },
      ],
    },
  ];

  if (post.faqs && post.faqs.length > 0) {
    schemaGraph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((f) => ({
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
            {post.category}
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-10 space-y-4">
          <span className="inline-block rounded-full bg-[#FF0033]/20 border border-[#FF0033]/40 px-3.5 py-1 text-xs font-bold text-[#FF6B6B]">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 border-y border-studio py-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-[#FF6B6B]" />
              <strong className="text-white">{post.author}</strong> ({post.authorRole})
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-zinc-500" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-zinc-500" /> {post.readTime} okuma
            </span>
          </div>
        </header>

        {/* ── Princeton GEO Quick Fact / Doğrudan Cevap Kutusu (Preferred Source) ── */}
        {post.quickFact && (
          <div className="mb-10 relative overflow-hidden rounded-3xl border border-[#FF0033]/40 bg-gradient-to-r from-zinc-900/90 via-zinc-900/95 to-zinc-950 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF0033]/20 text-[#FF4D6D] border border-[#FF0033]/30">
                <Quote className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#FF6B6B]">
                    Özet Bilgi &amp; Hızlı Yanıt (Quick Fact)
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    Doğrulanmış Veri
                  </span>
                </div>
                <blockquote className="text-sm sm:text-base font-medium leading-relaxed text-zinc-200 italic">
                  &ldquo;{post.quickFact}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
        )}

        {/* Featured YouTube Video Embed or 16:9 Image */}
        {post.videoId ? (
          <div className="mb-12 overflow-hidden rounded-3xl border border-white/15 bg-black shadow-2xl aspect-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${post.videoId}`}
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        ) : (
          <div className="mb-12 overflow-hidden rounded-3xl border border-white/15 aspect-video shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}

        {/* ── Structured Benchmark Table (Featured Snippet & AI Citability) ── */}
        {post.table && (
          <div className="mb-12 overflow-hidden rounded-3xl border border-studio bg-studio-card p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <TableIcon className="h-4 w-4 text-[#FF4D6D]" />
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                {post.table.caption || 'Performans & Karşılaştırma Tablosu'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04] text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {post.table.headers.map((h, i) => (
                      <th key={i} className="py-3.5 px-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {post.table.rows.map((row, rIdx) => (
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
          {post.paragraphs.map((p, idx) => {
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
        {post.faqs && post.faqs.length > 0 && (
          <div className="mt-14 space-y-4 rounded-3xl border border-studio bg-studio-card p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-[#FF0033]" />
              <h3 className="text-xl font-extrabold text-white">Sıkça Sorulan Sorular</h3>
            </div>
            <div className="space-y-3">
              {post.faqs.map((f, i) => (
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
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-xl border border-studio bg-zinc-800/80 px-3 py-1 text-xs text-zinc-300">
              #{tag}
            </span>
          ))}
        </div>

        {/* ── E-E-A-T Author & Agency Credibility Card ── */}
        <div className="mt-10 rounded-3xl border border-white/15 bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#FF0033] to-[#99001F] flex items-center justify-center text-white font-black text-2xl shadow-xl">
            SM
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-extrabold text-white text-base">{post.author}</span>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                Resmi Google Partner
              </span>
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                18+ Yıllık Tecrübe
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              MedyaPR bünyesinde Türkiye ve dünya genelinde müzik klipleri, prodüksiyon şirketleri ve sanatçılar için resmi Google Ads video PR stratejileri geliştirmektedir.
            </p>
          </div>
        </div>

        {/* In-Article Conversion Card */}
        <div className="mt-10 relative overflow-hidden rounded-3xl border border-[#FF0033]/40 bg-studio-card p-8 md:p-10 shadow-2xl">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/20 px-3 py-1 text-xs font-bold text-[#FF6B6B]">
              <Sparkles className="h-3.5 w-3.5" /> Resmi Reklam &amp; Video PR Kampanyası
            </span>
            <h3 className="text-2xl font-black text-white">
              Kendi Klibinizi de YouTube Trendlerine Taşımak İster Misiniz?
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Bot panelleriyle kanalınızı riske atmayın. Şarkınız için yaş, müzik zevki ve bölge hedefli resmi Google Ads kampanyası başlatın; video onaylanınca %50, iş bitiminde kalanı ödeyin.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}#calculator`}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-7 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-[#FF0033]/30 hover:scale-105 transition"
            >
              Fiyatı Hesapla &amp; Başlat <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/905551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-6 py-3.5 text-sm font-bold text-white hover:bg-zinc-700 transition"
            >
              Bize Danışın (WhatsApp)
            </a>
          </div>
        </div>

        {/* ── Topic Cluster: Related Articles ── */}
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 rounded-lg bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                      {rel.category}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#FF6B6B] transition line-clamp-2">
                      {rel.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
                      <span>{rel.date}</span>
                      <span className="font-semibold text-white/80 group-hover:translate-x-0.5 transition flex items-center gap-1">
                        Oku →
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
