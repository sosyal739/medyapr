'use client';

import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import type { BlogPost } from '@/lib/content';

interface BlogPreviewSectionProps {
  posts: BlogPost[];
  locale: string;
}

export default function BlogPreviewSection({ posts, locale }: BlogPreviewSectionProps) {
  const isTr = locale === 'tr';

  return (
    <section id="blog" className="relative overflow-hidden bg-studio-gradient border-y border-studio py-24 text-white">
      {/* Ambient Glow */}
      <div className="pointer-events-none absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px] animate-float-slow" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-violet-500/10 blur-[120px] animate-glow-soft" />

      {/* Floating Animated Badge (Moving Object) */}
      <div className="pointer-events-none absolute top-10 right-8 lg:right-24 z-20 hidden md:flex items-center gap-2 rounded-2xl border border-zinc-700/60 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-float-slow">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <span>{isTr ? 'Haftalık Algoritma & Klip Analizleri' : 'Weekly Algorithm & Video Playbooks'}</span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-14 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
              <BookOpen className="h-3.5 w-3.5 text-[#FF0033]" />
              {isTr ? 'Müzik & YouTube Strateji Rehberi' : 'Music & Strategy Blog'}
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
              {isTr ? 'Trend Analizleri &' : 'Trending Insights &'}{' '}
              <span className="bg-gradient-to-r from-[#FF0033] to-[#FF6B6B] bg-clip-text text-transparent">
                {isTr ? 'Büyüme Taktikleri' : 'Growth Strategies'}
              </span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-zinc-300 max-w-2xl leading-relaxed">
              {isTr
                ? 'YouTube algoritmasının işleyişi, trend olan şarkıların ivme sırları ve bağımsız müzisyenlerin bilmesi gereken klip pazarlama rehberleri.'
                : 'Actionable video marketing playbooks, trending track breakdowns, and growth tactics.'}
            </p>
          </div>

          <Link
            href={`/${locale}/blog`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-5 py-3 text-xs font-bold text-white hover:bg-zinc-700/80 hover:border-zinc-500/60 transition shadow-md"
          >
            {isTr ? 'Tüm Yazıları Gör' : 'View All Posts'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 3 Posts Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => {
            const postTitle = (!isTr && post.title_en) ? post.title_en : post.title;
            const postSummary = (!isTr && post.summary_en) ? post.summary_en : post.summary;
            const postCategory = (!isTr && post.category_en) ? post.category_en : post.category;
            const postReadTime = (!isTr && post.readTime_en) ? post.readTime_en : post.readTime;

            return (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-studio bg-studio-card p-6 backdrop-blur-xl transition hover:-translate-y-1.5 hover:border-studio-strong hover:bg-zinc-800/90 shadow-xl"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-black/40 mb-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={postTitle}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-[#FF0033] px-3 py-1 text-xs font-bold text-white shadow-lg">
                      {postCategory}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-zinc-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#FF6B6B]" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-500" /> {postReadTime}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#FF6B6B] transition-colors leading-snug">
                    {postTitle}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-400 line-clamp-3">
                    {postSummary}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4 text-xs font-bold text-[#FF6B6B]">
                  <span>{isTr ? 'Detaylı İncele' : 'Read Guide'}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
