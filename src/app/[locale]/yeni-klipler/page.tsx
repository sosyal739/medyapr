import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Sparkles, Flame, Eye, ThumbsUp, Calendar, ArrowRight, Video, ExternalLink } from 'lucide-react';
import { getNewReleases, type NewRelease } from '@/lib/releases';
import { getPageAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const rawTitle = isTr
    ? 'Yeni Çıkan Müzik Klipleri ve Lansman Radarı 2026 | MedyaPR'
    : 'New Turkish Music Videos & Release Radar 2026 | MedyaPR';

  const pageDesc = isTr
    ? 'netd müzik, DMC, Sony Music ve bağımsız yapımlardan bugün ve bu hafta yayınlanan en yeni video klipler, müzikal analizler ve YouTube izlenme incelemeleri.'
    : 'Latest music videos released this week across netd music, DMC, Sony Music, and independent labels. Video reviews and YouTube analytics.';

  return {
    title: {
      absolute: rawTitle,
    },
    description: pageDesc,
    alternates: getPageAlternates(locale, '/yeni-klipler'),
    openGraph: {
      title: rawTitle,
      description: pageDesc,
    },
  };
}

export default async function NewReleasesPage({ params }: Props) {
  const { locale } = await params;
  const isTr = locale === 'tr';
  const releases = await getNewReleases();

  const channelBadgeColor: Record<string, string> = {
    netd: 'bg-red-950/70 border-red-500/40 text-red-300',
    dmc: 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300',
    sony: 'bg-purple-950/70 border-purple-500/40 text-purple-300',
    bagimsiz: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
  };

  return (
    <div className="min-h-screen bg-app-base text-white py-14 md:py-20 relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute top-10 left-1/4 h-96 w-96 rounded-full bg-[#FF0033]/15 blur-[150px] animate-float-drift" />
      <div className="pointer-events-none absolute top-1/2 right-10 h-80 w-80 rounded-full bg-violet-600/10 blur-[130px] animate-glow-soft" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        {/* Header Breadcrumb & Tag */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF0033]/40 bg-[#FF0033]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9002B] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D9002B]" />
            </span>
            <Video className="h-3.5 w-3.5 text-[#FF0033]" />
            <span>{isTr ? 'Klip Lansman Radarı' : 'Video Release Radar'}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
            {isTr ? 'Türkiye\'de Yeni Çıkan' : 'Latest Released'}{' '}
            <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
              {isTr ? 'Müzik Klipleri & Analizler' : 'Music Videos & Reviews'}
            </span>
          </h1>

          <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
            {isTr
              ? 'netd müzik, DMC, Sony Music Türkiye ve bağımsız dağıtımlardan bugün ve bu hafta yayınlanan en yeni klipler, sanatsal kurgu incelemeleri ve YouTube algoritma analizleri.'
              : 'The freshest music videos released this week across netd music, DMC, Sony Music, and independent record labels with editorial analysis.'}
          </p>
        </div>

        {/* Channels Highlight Bar */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-semibold text-zinc-400 mr-2">
            {isTr ? 'Takip Edilen Dağıtım Kanalları:' : 'Monitored Channels:'}
          </span>
          <span className="rounded-full bg-red-950/60 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-300">
            netd müzik
          </span>
          <span className="rounded-full bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-300">
            DMC (Doğan Music)
          </span>
          <span className="rounded-full bg-purple-950/60 border border-purple-500/30 px-3 py-1 text-xs font-bold text-purple-300">
            Sony Music Türkiye
          </span>
          <span className="rounded-full bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
            Bağımsız / Wovie
          </span>
        </div>

        {/* Releases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {releases.map((rel: NewRelease) => {
            const badgeClass = channelBadgeColor[rel.channelType] || channelBadgeColor.netd;
            return (
              <article
                key={rel.slug}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#16191E]/95 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-[#FF0033]/50 hover:shadow-[0_12px_35px_rgba(255,0,51,0.2)] hover:-translate-y-1"
              >
                {/* Thumbnail Header */}
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                    <Image
                      src={rel.thumbnail}
                      alt={`${rel.artist} - ${rel.title} Klibi`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Channel Pill Overlay */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold shadow-md ${badgeClass}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                        <span>{rel.channel}</span>
                      </span>
                    </div>

                    {/* Genre Pill Overlay */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="rounded-full bg-black/60 border border-white/15 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300 backdrop-blur-md">
                        {rel.genre}
                      </span>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="h-12 w-12 rounded-full bg-[#D9002B] flex items-center justify-center text-white shadow-xl shadow-[#FF0033]/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="h-5 w-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{rel.releaseDate}</span>
                      </span>
                      <span className="font-semibold text-zinc-400 text-[11px] bg-white/5 px-2 py-0.5 rounded-full">
                        {rel.channel}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-white mb-1 group-hover:text-[#FF5E7E] transition-colors line-clamp-1">
                      {rel.title}
                    </h2>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-3">
                      {rel.artist}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                      {rel.summary}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Klip İncelemesi Yayında
                  </span>

                  <Link
                    href={`/${locale}/klip/${rel.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#FF0033] transition-colors"
                  >
                    <span>{isTr ? 'İncele & İzle' : 'Review & Watch'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* INBOUND CALLOUT: "Klibiniz Yeni mi Çıktı?" */}
        <div className="relative overflow-hidden rounded-3xl border border-[#FF0033]/40 bg-gradient-to-r from-red-950/40 via-zinc-900/90 to-zinc-950 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isTr ? 'Sanatçılar ve Yapımcılar İçin' : 'For Artists & Producers'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {isTr ? 'Yeni Bir Klip mi Yayınladınız?' : 'Did You Just Release a New Music Video?'}{' '}
                <span className="bg-gradient-to-r from-[#FF0033] to-[#FF6B6B] bg-clip-text text-transparent">
                  {isTr ? 'Doğru Kitleyle Buluşturalım' : 'Reach the Right Audience'}
                </span>
              </h2>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {isTr
                  ? 'Klibinizin ilk 48 saatte YouTube algoritmasında organik ivme yakalaması için resmi Google Partner güvencesiyle yanınızdayız. Bot veya panel yok; yalnızca YouTube Studio tescilli resmi Google Ads video reklamları.'
                  : 'Get official Google Ads video promotions for your music video within the critical first 48 hours. Zero bots, pure YouTube Studio transparency.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href={`/${locale}/fiyatlandirma`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF0033]/30 hover:brightness-110 transition active:scale-95"
              >
                <span>{isTr ? 'YouTube Reklam Fiyatları' : 'Calculate Budget'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`/${locale}/order`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15 transition"
              >
                <span>{isTr ? 'Klip Analizi İste' : 'Request Video Audit'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
