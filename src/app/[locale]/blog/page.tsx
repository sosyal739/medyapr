import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { getPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: {
    absolute: 'YouTube Müzik Video & Klip PR Blogu | MedyaPR',
  },
  description:
    'YouTube trend şarkı analizleri, müzik klibi lansman stratejileri, algoritma dinamikleri ve Google Ads ile organik büyüme rehberleri.',
};

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = await getPosts();
  const isTr = locale === 'tr';

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
          ? 'YouTube trend şarkı analizleri, klip pazarlama dinamikleri ve resmi Google Ads büyüme rehberleri.'
          : 'YouTube music video PR strategies, algorithm breakdowns, and official Google Ads guides.',
        url: `https://medyapr.com/${locale}/blog`,
        blogPost: posts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          url: `https://medyapr.com/${locale}/blog/${p.slug}`,
          datePublished: p.date,
          author: {
            '@type': 'Person',
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
      {/* Background glow */}
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#FF0033]/15 blur-[160px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-20 right-10 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[150px] animate-float-drift" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs text-zinc-400">
          <Link href={`/${locale}`} className="hover:text-white transition">
            Ana Sayfa
          </Link>
          <span>/</span>
          <span className="text-[#FF6B6B]">Müzik & Büyüme Blogu</span>
        </div>

        {/* Header */}
        <div className="mb-14 border-b border-studio pb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E] mb-3">
            <BookOpen className="h-4 w-4 text-[#FF0033]" />
            {isTr ? 'Trend & Büyüme Analizleri' : 'Insights & Analytics'}
          </span>
          <h1 className="text-3xl font-extrabold sm:text-5xl tracking-tight">
            Müzik & YouTube{' '}
            <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
              Strateji Rehberi
            </span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-zinc-300 max-w-2xl leading-relaxed">
            {isTr
              ? 'Türkiye müzik trendlerindeki yükselişler, klip lansmanlarında ilk 48 saat taktikleri ve resmi Google Ads video kampanyalarıyla kanal büyütme sırları.'
              : 'Deep dives on trending music, video launch playbooks, and algorithm optimization.'}
          </p>
        </div>

        {/* Featured First Post */}
        {posts[0] && (
          <Link
            href={`/${locale}/blog/${posts[0].slug}`}
            className="group mb-12 block overflow-hidden rounded-3xl border border-studio bg-studio-card p-6 md:p-8 backdrop-blur-xl shadow-2xl transition hover:border-studio-strong hover:bg-zinc-800/90"
          >
            <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] items-center">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posts[0].image}
                  alt={posts[0].title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-[#FF0033] px-3 py-1 text-xs font-bold text-white shadow-lg">
                  {posts[0].category}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#FF6B6B]" /> {posts[0].date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-white/40" /> {posts[0].readTime}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-[#FF6B6B] transition-colors leading-snug">
                  {posts[0].title}
                </h2>
                <p className="text-sm leading-relaxed text-white/65 line-clamp-3">
                  {posts[0].summary}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6B6B] group-hover:translate-x-1 transition-transform">
                  Yazıyı Oku <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Other Posts Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-studio bg-studio-card p-6 backdrop-blur-xl transition hover:border-studio-strong hover:bg-zinc-800/90 shadow-xl"
            >
              <div>
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/40 mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/10">
                    {post.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#FF6B6B]" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-white/40" /> {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#FF6B6B] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60 line-clamp-2">
                  {post.summary}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs font-semibold text-[#FF6B6B]">
                <span>Devamını Oku</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
