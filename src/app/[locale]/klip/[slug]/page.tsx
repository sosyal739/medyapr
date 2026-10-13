import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Play,
  Sparkles,
  Calendar,
  Eye,
  ThumbsUp,
  Share2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Music,
  UserCheck,
} from 'lucide-react';
import { getNewReleases, getReleaseBySlug, type NewRelease } from '@/lib/releases';
import { getPageAlternates } from '@/lib/seo';
import SocialShareBar from '@/components/releases/SocialShareBar';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const releases = await getNewReleases();
  return ['tr', 'en'].flatMap((locale) =>
    releases.map((rel) => ({
      locale,
      slug: rel.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const isTr = locale === 'tr';
  const rel = await getReleaseBySlug(slug);

  if (!rel) return { title: isTr ? 'Klip Bulunamadı' : 'Video Not Found' };

  const rawTitle = isTr
    ? `${rel.artist} - ${rel.title} Klip İncelemesi | MedyaPR`
    : `${rel.artist} - ${rel.title} Video Review & Analytics | MedyaPR`;

  const pageDesc = isTr
    ? `${rel.artist} imzalı ${rel.title} klibi ${rel.channel} kanalında yayında. Klip yönetmeni, künyesi, izlenme analizi ve YouTube algoritma incelemesi.`
    : `${rel.artist}'s new music video ${rel.title} out now on ${rel.channel}. Video review, director credits, and YouTube growth analytics.`;

  return {
    title: {
      absolute: rawTitle,
    },
    description: pageDesc,
    alternates: getPageAlternates(locale, `/klip/${slug}`),
    openGraph: {
      title: rawTitle,
      description: pageDesc,
      images: [{ url: rel.thumbnail }],
    },
  };
}

export default async function ReleaseDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const isTr = locale === 'tr';
  const rel = await getReleaseBySlug(slug);

  if (!rel) {
    notFound();
  }

  const channelBadgeColor: Record<string, string> = {
    netd: 'bg-red-950/70 border-red-500/40 text-red-300',
    dmc: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300',
    sony: 'bg-purple-950/70 border-purple-500/40 text-purple-300',
    bagimsiz: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
  };

  const badgeClass = channelBadgeColor[rel.channelType] || channelBadgeColor.netd;

  return (
    <div className="min-h-screen bg-app-base text-white py-12 md:py-20 relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute top-10 left-1/3 h-96 w-96 rounded-full bg-[#FF0033]/15 blur-[150px] animate-float-drift" />
      <div className="pointer-events-none absolute bottom-1/3 right-10 h-80 w-80 rounded-full bg-violet-600/10 blur-[130px] animate-glow-soft" />

      {/* Schema.org VideoObject & BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                    name: isTr ? 'Yeni Klipler' : 'New Releases',
                    item: `https://medyapr.com/${locale}/yeni-klipler`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: `${rel.artist} - ${rel.title}`,
                    item: `https://medyapr.com/${locale}/klip/${slug}`,
                  },
                ],
              },
              {
                '@type': 'VideoObject',
                name: `${rel.artist} - ${rel.title}`,
                description: rel.summary,
                thumbnailUrl: [rel.thumbnail],
                uploadDate: rel.releaseDate,
                embedUrl: `https://www.youtube-nocookie.com/embed/${rel.videoId}`,
              },
            ],
          }),
        }}
      />

      <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
        {/* Navigation Back Link */}
        <div className="mb-6">
          <Link
            href={`/${locale}/yeni-klipler`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isTr ? 'Tüm Yeni Kliplere Dön' : 'Back to All Releases'}</span>
          </Link>
        </div>

        {/* Video Player Header */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl mb-8">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${rel.videoId}?rel=0`}
            title={`${rel.artist} - ${rel.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Song Info & Channel Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold shadow-md ${badgeClass}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                <span>{rel.channel}</span>
              </span>
              <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-zinc-300">
                {rel.genre}
              </span>
              <span className="flex items-center gap-1 text-xs text-zinc-400 ml-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                <span>{rel.releaseDate}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              {rel.title}
            </h1>
            <p className="text-lg font-bold text-zinc-300 mt-1">
              {rel.artist}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/80 border border-white/10 px-4 py-2.5 rounded-2xl shrink-0">
            <div>
              <div className="text-[11px] font-semibold text-zinc-400">Canlı İzlenme</div>
              <div className="text-sm font-black text-red-400">{rel.views}</div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <div className="text-[11px] font-semibold text-zinc-400">Beğeni</div>
              <div className="text-sm font-black text-white">{rel.likes}</div>
            </div>
          </div>
        </div>

        {/* Credits Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 mb-10 text-xs">
          <div>
            <span className="text-zinc-500 block mb-0.5">Yönetmen</span>
            <span className="font-semibold text-zinc-200">{rel.director || 'Belirtilmedi'}</span>
          </div>
          <div>
            <span className="text-zinc-500 block mb-0.5">Prodüksiyon / Label</span>
            <span className="font-semibold text-zinc-200">{rel.producer || rel.channel}</span>
          </div>
          <div>
            <span className="text-zinc-500 block mb-0.5">Sanatçı Instagram</span>
            <span className="font-semibold text-rose-400">{rel.instagramHandle || '@sanatci'}</span>
          </div>
          <div>
            <span className="text-zinc-500 block mb-0.5">Hedef Kitle</span>
            <span className="font-semibold text-zinc-200 line-clamp-1">{rel.targetAudience}</span>
          </div>
        </div>

        {/* Editorial Review & Video Analysis */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FF0033]" />
            <span>{isTr ? 'Klip İncelemesi & Müzikal Analiz' : 'Video Review & Musical Analysis'}</span>
          </h2>

          <div className="rounded-3xl border border-white/10 bg-[#16191E]/80 p-6 sm:p-8 backdrop-blur-md">
            <p className="text-sm sm:text-base leading-relaxed text-zinc-200 mb-6">
              {rel.review}
            </p>

            <blockquote className="border-l-2 border-[#FF0033] pl-4 italic text-xs sm:text-sm text-zinc-300">
              {rel.summary}
            </blockquote>
          </div>
        </section>

        {/* SOCIAL SHARE & EGO-BAIT TAGGING BAR */}
        <div className="mb-12">
          <SocialShareBar
            title={rel.title}
            artist={rel.artist}
            channel={rel.channel}
            instagramHandle={rel.instagramHandle || ''}
            twitterHandle={rel.twitterHandle || ''}
            slug={rel.slug}
            locale={locale}
          />
        </div>

        {/* THE INBOUND CONVERSION MAGNET (SANATÇIYI MÜŞTERİYE ÇEVİREN BÖLÜM) */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#FF0033]/50 bg-gradient-to-br from-red-950/40 via-zinc-900/95 to-zinc-950 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                <UserCheck className="h-4 w-4 text-emerald-400" />
                <span>{isTr ? 'Bu Klibin Sahibi veya Menajeri Misiniz?' : 'Are You the Artist or Manager?'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {isTr ? 'Klibinizi YouTube Algoritmasında' : 'Promote Your Video With'}{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  {isTr ? 'Resmi Google Ads ile Büyütün' : 'Official Google Ads'}
                </span>
              </h3>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {isTr
                  ? `Tebrikler! '${rel.title}' klibiniz yayında. Klibinizin YouTube algoritmasında 'Önerilen Videolar' arasına girmesi ve ilk günlerde doğru müzikseverlere ulaşması için 18+ yıllık resmi Google Partner tecrübemizle yanınızdayız.`
                  : `Congratulations! '${rel.title}' is out now. Scale your reach and trigger YouTube recommendations with certified Google Ads video PR.`}
              </p>

              <div className="space-y-2 pt-2 text-xs font-semibold text-zinc-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00C9A7] shrink-0" />
                  <span>Kanal şifresi gerekmez (Yalnızca herkese açık YouTube linki iletilir)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00C9A7] shrink-0" />
                  <span>YouTube Studio'da resmi "YouTube Reklamları" tescili (Sıfır bot / Sıfır panel)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00C9A7] shrink-0" />
                  <span>Aşamalı güvenli ödeme: %50 onayda, %50 kampanya tamamlandığında</span>
                </div>
              </div>
            </div>

            {/* Inbound CTAs */}
            <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
              <a
                href={`https://wa.me/905300000000?text=${encodeURIComponent(
                  `Merhaba MedyaPR ekibi, '${rel.artist} - ${rel.title}' klibimiz için YouTube Google Ads PR lansman paketleri hakkında bilgi almak istiyoruz.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="h-5 w-5 fill-white" />
                <span>{isTr ? 'WhatsApp ile Klibi Tanıt' : 'Promote via WhatsApp'}</span>
              </a>

              <Link
                href={`/${locale}#calculator`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#FF0033]/30 hover:brightness-110 transition active:scale-95"
              >
                <span>{isTr ? 'Bütçe Hesaplayıcıya Git' : 'Calculate Campaign Budget'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
