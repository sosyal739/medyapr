import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Play, Sparkles, Music, Users, ExternalLink } from 'lucide-react';
import { getArtists, getArtistBySlug } from '@/lib/content';

import { getPageAlternates, TR_EN } from '@/lib/seo';
import ArtistClaimBox from '@/components/common/ArtistClaimBox';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const artists = await getArtists();
  return ['tr', 'en'].flatMap((locale) =>
    artists.map((artist) => ({
      locale,
      slug: artist.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';
  const artist = await getArtistBySlug(slug);
  if (!artist) return { title: isAr ? 'الفنان غير موجود' : isTr ? 'Sanatçı Bulunamadı' : 'Artist Not Found' };

  const rawTitle = isAr
    ? `أغاني ${artist.name} وفيديوهاته وتحليلات يوتيوب | MedyaPR`
    : isTr
    ? (artist.name.length <= 8
        ? `${artist.name} Şarkıları, Klipleri & YouTube Analizi | MedyaPR`
        : `${artist.name} Şarkıları & YouTube Analizi | MedyaPR`)
    : `${artist.name} Songs, Videos & YouTube Analytics | MedyaPR`;

  const pageDesc = isAr
    ? `سيرة ${artist.name}، وأشهر فيديوهاته على يوتيوب، وأحدث أغنياته ${artist.latestHit}، وتحليلات الجمهور الرقمي بدعم من MedyaPR.`
    : isTr
    ? `${artist.name} biyografisi, YouTube en popüler klipleri, son hit şarkısı ${artist.latestHit} ve 18+ yıllık MedyaPR tecrübesiyle dijital dinleyici analizi.`
    : `${artist.name} biography, top YouTube videos, latest hit ${artist.latestHit}, and digital audience analytics powered by MedyaPR.`;

  return {
    title: {
      absolute: rawTitle,
    },
    description: pageDesc,
    alternates: getPageAlternates(locale, `/sanatci/${slug}`, TR_EN),
    openGraph: {
      title: rawTitle,
      description: pageDesc,
      images: [{ url: artist.image }],
    },
  };
}

export default async function ArtistDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  const isTr = locale === 'tr';


  const isAr = locale === 'ar';

  return (
    <div className="min-h-screen bg-app-base text-white py-14 md:py-20 relative">
      {/* Schema.org MusicGroup & BreadcrumbList */}
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
                    name: isAr ? 'الرئيسية' : isTr ? 'Ana Sayfa' : 'Home',
                    item: `https://medyapr.com/${locale}`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: isAr ? 'الفنانون' : isTr ? 'Sanatçılar' : 'Artists',
                    item: `https://medyapr.com/${locale}/sanatcilar`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: artist.name,
                    item: `https://medyapr.com/${locale}/sanatci/${slug}`,
                  },
                ],
              },
              {
                '@type': 'MusicGroup',
                name: artist.name,
                genre: artist.genre,
                description: artist.bio,
                image: artist.image,
              },
            ],
          }),
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 md:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href={`/${locale}/sanatcilar`}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            {isAr ? 'العودة إلى الفنانين' : isTr ? 'Sanatçılar Rehberine Dön' : 'Back to Artists'}
          </Link>
        </div>

        {/* Profile Card */}
        <div className="mb-10 rounded-3xl border border-studio bg-studio-card p-6 md:p-8 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Image
              width={112}
              height={112}
              src={artist.image}
              alt={artist.name}
              className="h-28 w-28 shrink-0 rounded-2xl object-cover border-2 border-[#FF0033]/40 shadow-xl"
            />
            <div className="space-y-2">
              <span className="rounded-full bg-[#FF0033]/20 border border-[#FF0033]/30 px-3 py-1 text-xs font-bold text-[#FF6B6B]">
                {artist.genre}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white">{artist.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                <span>
                  {isAr ? 'إجمالي مشاهدات يوتيوب:' : isTr ? 'Toplam YouTube İzlenme:' : 'Total YouTube Views:'} <strong className="text-white">{artist.viewsTotal}</strong>
                </span>
                <span>•</span>
                <span>
                  {isAr ? 'الجمهور المقدّر:' : isTr ? 'Tahmini Kitle:' : 'Estimated Audience:'} <strong className="text-emerald-400">{artist.monthlyAudience}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-studio pt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">
              {isAr ? 'السيرة الذاتية' : isTr ? 'Biyografi' : 'Biography'}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-300">{artist.bio}</p>
          </div>
        </div>

        {/* Featured Video Embed */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-[#FF0033]" />
            {isAr ? 'أحدث كليب ناجح:' : isTr ? 'Son Hit Klip:' : 'Latest Hit Video:'} {artist.latestHit}
          </h2>
          <div className="overflow-hidden rounded-3xl border border-white/15 bg-black shadow-2xl aspect-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${artist.hitVideoId}`}
              title={artist.latestHit}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
        </div>

        {/* Popular Songs */}
        <div className="mb-12 rounded-3xl border border-studio bg-studio-card p-6 backdrop-blur-xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Music className="h-5 w-5 text-[#FF6B6B]" /> {isAr ? 'أبرز الأغاني' : isTr ? 'Öne Çıkan Parçalar' : 'Top Tracks'}
          </h3>
          <div className="divide-y divide-studio">
            {artist.topSongs.map((song, i) => (
              <div key={i} className="flex items-center justify-between py-3 text-sm">
                <span className="font-semibold text-white/90">{song.title}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400">{song.views} {isAr ? 'مشاهدات' : isTr ? 'izlenme' : 'views'}</span>
                  <a
                    href={`https://www.youtube.com/watch?v=${song.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6B6B] hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ArtistClaimBox artistName={artist.name} pageUrl={`https://medyapr.com/${locale}/sanatci/${artist.slug}`} locale={locale} source="artist_page" />

        {/* Pitch for Managers & Musicians */}
        <div className="rounded-3xl border border-[#FF0033]/40 bg-studio-card p-8 md:p-10 shadow-2xl">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/20 px-3 py-1 text-xs font-bold text-[#FF6B6B]">
              <Sparkles className="h-3.5 w-3.5" /> {isAr ? 'للفنانين ومديري الأعمال' : isTr ? 'Müzisyenler & Menajerler İçin' : 'For Artists & Managers'}
            </span>
            <h3 className="text-2xl font-black text-white">
              {isAr ? 'اوصل إلى جماهير مشابهة لكليبك القادم' : isTr ? 'Sizin Klibiniz de Benzer Kitlelere Ulaşsın' : 'Reach Similar Audiences For Your Next Video'}
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
              {isAr
                ? `استهدف المعجبين الذين يستمعون إلى ${artist.name} وفنانين مشابهين. وانشر إصدارك الجديد بين الملايين عبر إعلانات In-Stream وShorts على يوتيوب.`
                : isTr
                ? `${artist.name} ve benzeri sanatçıları dinleyen kitleyi hedefleyerek, yeni parçanızı Türkiye ve Avrupa genelinde YouTube In-Stream ve Shorts reklamlarıyla milyonlara duyurun.`
                : `Target fans who listen to ${artist.name} and similar artists. Amplify your new release across YouTube In-Stream and Shorts ads to millions.`}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <Link
              href={`/${locale}/fiyatlandirma`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D9002B] px-7 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-[#FF0033]/30 hover:bg-[#E6002E] transition"
            >
              {isAr ? 'احسب أسعار إعلانات يوتيوب' : isTr ? 'YouTube Reklam Fiyatlarını Hesapla' : 'Calculate YouTube Ad Pricing'} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/order`}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-6 py-3.5 text-sm font-extrabold text-emerald-300 hover:bg-emerald-500/25 transition"
            >
              {isAr ? 'أرسل رابط الفيديو واطلب التحليل' : isTr ? 'Klip Linki Gir & Analiz İste' : 'Submit Video Link & Request Audit'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
