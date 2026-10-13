'use client';

import { Star, Sparkles, CheckCircle2, Eye, Music } from 'lucide-react';

interface ArtistTestimonial {
  id: string;
  nameTr: string;
  nameEn: string;
  roleTr: string;
  roleEn: string;
  genreTr: string;
  genreEn: string;
  icon: string;
  metricTr: string;
  metricEn: string;
  subMetricTr: string;
  subMetricEn: string;
  badgeTr: string;
  badgeEn: string;
  quoteTr: string;
  quoteEn: string;
}

const testimonials: ArtistTestimonial[] = [
  {
    id: 'artist-1',
    nameTr: 'Rap Sanatçısı',
    nameEn: 'Rap Artist',
    roleTr: 'MedyaPR Müşterisi • Trap & Hip-Hop',
    roleEn: 'MedyaPR Client • Trap & Hip-Hop',
    genreTr: '#TürkçeRap',
    genreEn: '#HipHop',
    icon: '🎤',
    metricTr: '~ 2.8M+ İzlenme',
    metricEn: '~ 2.8M+ Views',
    subMetricTr: '+14.2K Abone',
    subMetricEn: '+14.2K Subs',
    badgeTr: 'Doğrulanmış YouTube Kampanyası',
    badgeEn: 'Verified YouTube Campaign',
    quoteTr:
      'Yeni klibimizin çıkışında sahte bot panelleriyle kanalımızı riske atmak istemedik. MedyaPR ile doğrudan trap ve hip-hop dinleyicilerini hedefledik. YouTube Studio\'da trafik kaynağının "YouTube Reklamları" olarak tescillenmesi ve gelen yüzlerce samimi yorum harikaydı. Klip daha sonra önerilen videolarda organik olarak yürümeye başladı.',
    quoteEn:
      'We didn\'t want to risk our channel with fake bot panels for our new music video. With MedyaPR, we targeted real trap and hip-hop listeners via Google Ads. Seeing the traffic legitimately logged as "YouTube Advertising" in YouTube Studio and receiving hundreds of genuine comments was incredible. The video then took off organically in YouTube recommendations.',
  },
  {
    id: 'artist-2',
    nameTr: 'Pop Şarkıcısı',
    nameEn: 'Pop Singer',
    roleTr: 'MedyaPR Müşterisi • Solo Sanatçı',
    roleEn: 'MedyaPR Client • Solo Artist',
    genreTr: '#PopMüzik',
    genreEn: '#PopMusic',
    icon: '🎵',
    metricTr: '~ 1.6M+ İzlenme',
    metricEn: '~ 1.6M+ Views',
    subMetricTr: '%84 İzleme Oranı',
    subMetricEn: '84% View Rate',
    badgeTr: 'Doğrulanmış Klip Lansmanı',
    badgeEn: 'Verified Video Launch',
    quoteTr:
      'İlk solo teklim için klip lansman paketi aldım. Özellikle Türkiye ve Almanya\'daki gurbetçi kitleye yönelik demografik hedefleme kusursuz çalıştı. Diğer yerlerdeki gibi 3 gün sonra silinen izlenmeler olmadı; Google Ads izlenmeleri ömür boyu kalıcı kaldı ve şarkımın Spotify dinlenmeleri de 3 katına çıktı.',
    quoteEn:
      'I used the music video launch package for my debut solo single. The demographic targeting for listeners in Turkey and Europe worked flawlessly. Unlike fake panels, there were no drops after 3 days; views are permanent and my Spotify streams tripled as a direct result.',
  },
  {
    id: 'artist-3',
    nameTr: 'Alternatif Rock Grubu',
    nameEn: 'Alternative Rock Band',
    roleTr: 'MedyaPR Müşterisi • Canlı Performans',
    roleEn: 'MedyaPR Client • Live Session',
    genreTr: '#AlternatifRock',
    genreEn: '#AltRock',
    icon: '🎸',
    metricTr: '~ 940K+ İzlenme',
    metricEn: '~ 940K+ Views',
    subMetricTr: '+3.8K Beğeni & Yorum',
    subMetricEn: '+3.8K Likes & Comments',
    badgeTr: 'Canlı Performans PR',
    badgeEn: 'Live Session PR',
    quoteTr:
      'Canlı stüdyo performans videomuz için bütçemizi en verimli şekilde kullanmak zorundaydık. MedyaPR ekibi şarkımızın tarzına uygun Türkçe rock ve indie dinleyicilerini nokta atışı hedefledi. Şarkıyı gerçekten seven insanların samimi yorumları ve kanalımıza abone olması en büyük kazancımız oldu.',
    quoteEn:
      'For our live studio session video, we needed maximum efficiency from our budget. The MedyaPR team accurately targeted real Turkish rock and indie listeners. Earning genuine comments and long-term channel subscribers was our biggest win.',
  },
  {
    id: 'artist-4',
    nameTr: 'Müzik Prodüktörü',
    nameEn: 'Music Producer',
    roleTr: 'MedyaPR Kurumsal Partneri • Bağımsız Label',
    roleEn: 'MedyaPR Corporate Partner • Independent Label',
    genreTr: '#MüzikYapım',
    genreEn: '#MusicLabel',
    icon: '🎛️',
    metricTr: '~ 4.8M+ İzlenme',
    metricEn: '~ 4.8M+ Views',
    subMetricTr: '14 Farklı Klip Kampanyası',
    subMetricEn: '14 Video Campaigns',
    badgeTr: 'Resmi Label Partneri',
    badgeEn: 'Official Label Partner',
    quoteTr:
      'Bünyemizdeki sanatçıların kliplerinde taviz vermediğimiz iki konu var: YouTube Studio şeffaflığı ve sıfır sahte bot kuralı. MedyaPR ile 14 farklı şarkıda çalıştık. Kampanya sonunda paylaştıkları Google Ads performans raporları ve maliyet optimizasyonu kurumsal seviyede profesyonel.',
    quoteEn:
      'For the artists on our roster, two things are non-negotiable: YouTube Studio transparency and zero bots. We\'ve run 14 music campaigns with MedyaPR. The end-of-campaign Google Ads analytics and cost optimization are strictly enterprise-grade.',
  },

  {
    id: 'artist-5',
    nameTr: 'Akustik Sanatçısı',
    nameEn: 'Acoustic Artist',
    roleTr: 'MedyaPR Müşterisi • YouTube Creator',
    roleEn: 'MedyaPR Client • YouTube Creator',
    genreTr: '#Akustik',
    genreEn: '#Acoustic',
    icon: '🎙️',
    metricTr: '~ 820K+ İzlenme',
    metricEn: '~ 820K+ Views',
    subMetricTr: '+9.4K Yeni Abone',
    subMetricEn: '+9.4K New Subs',
    badgeTr: 'Doğrulanmış Kanal Büyümesi',
    badgeEn: 'Verified Channel Growth',
    quoteTr:
      'Kanal şifresi veya yetki istememeleri en başından büyük güven verdi; sadece klip linkini ilettim. Aşamalı ödeme sistemiyle kampanya onaylandığında %50, tamamlandığında kalanı ödedim. Akustik dinleyici kitleme tam 12\'den ulaştık. Hem YouTube hem de canlı konserlerimin dinleyicisi büyüdü.',
    quoteEn:
      'Not needing passwords or manager access gave me immense trust from day one; I only provided the video link. The phased payment model (50% on ad approval, 50% on completion) is extremely fair. My acoustic audience grew both on YouTube and at my live gigs.',
  },
  {
    id: 'artist-6',
    nameTr: 'DJ & Müzik Prodüktörü',
    nameEn: 'DJ & Music Producer',
    roleTr: 'MedyaPR Global Müşterisi • Elektronik Müzik',
    roleEn: 'MedyaPR Global Client • Electronic Music',
    genreTr: '#EDM #Elektronik',
    genreEn: '#Electronic',
    icon: '🎧',
    metricTr: '~ 2.1M+ Global İzlenme',
    metricEn: '~ 2.1M+ Global Views',
    subMetricTr: '35+ Ülkede Gösterim',
    subMetricEn: '35+ Countries',
    badgeTr: 'Global Google Ads PR',
    badgeEn: 'Global Google Ads PR',
    quoteTr:
      'Parçamızı sadece Türkiye\'de değil; Almanya, Hollanda ve İngiltere\'deki elektronik müzik kulüp ve festival kitlelerine ulaştırdık. YouTube Shorts akış reklamları ile In-Stream gösterimlerin kombinasyonu mükemmel sonuç verdi. Parçayı Shazam\'dan arayan dinleyici sayısında rekor kırdık.',
    quoteEn:
      'We promoted our track not only in Turkey, but across electronic music club and festival crowds in Germany, the Netherlands, and the UK. The combination of YouTube Shorts feed ads and In-Stream placements drove record-breaking Shazam tags.',
  },
  {
    id: 'artist-7',
    nameTr: 'Yorumcu & Besteci',
    nameEn: 'Composer & Vocalist',
    roleTr: 'MedyaPR Müşterisi • Klip Lansmanı',
    roleEn: 'MedyaPR Client • Music Video Launch',
    genreTr: '#ModernArabesk',
    genreEn: '#WorldMusic',
    icon: '🎻',
    metricTr: '~ 3.4M+ İzlenme',
    metricEn: '~ 3.4M+ Views',
    subMetricTr: 'Trendler Listesi Etkisi',
    subMetricEn: 'Trending Impact',
    badgeTr: 'Trendler Etkili Lansman',
    badgeEn: 'Trending Impact Launch',
    quoteTr:
      'Piyasada o kadar çok sahte panelci var ki kanalını çöp eden tanıdıklarıma şahit oldum. MedyaPR\'ın Google Ads güvencesiyle ilk haftadan 1 milyon barajını aştık. Şarkı viral oldu ve YouTube algoritması klibi otomatikman önermeye başladı. İşini dürüst yapan gerçek profesyoneller.',
    quoteEn:
      'There are so many scam panels out there that ruin channels. With MedyaPR\'s official Google Ads infrastructure, we crossed 1 million views in week one. The song went viral and YouTube\'s algorithm started recommending it organically. Truly honest pros.',
  },
  {
    id: 'artist-8',
    nameTr: 'Indie Pop İkilisi',
    nameEn: 'Indie Pop Duo',
    roleTr: 'MedyaPR Müşterisi • Bağımsız Müzisyenler',
    roleEn: 'MedyaPR Client • Independent Musicians',
    genreTr: '#IndiePop',
    genreEn: '#IndiePop',
    icon: '🎹',
    metricTr: '~ 1.2M+ İzlenme',
    metricEn: '~ 1.2M+ Views',
    subMetricTr: '+6.1K Spotify Dinleyici',
    subMetricEn: '+6.1K Spotify Fans',
    badgeTr: 'Doğrulanmış Organik Erişim',
    badgeEn: 'Verified Organic Reach',
    quoteTr:
      'Bağımsız bir müzik ikilisi olarak kısıtlı bütçemiz vardı. Sitedeki bütçe hesaplayıcı ile kendi paketimizi belirledik. Kampanyamız başladığında YouTube Analytics\'te gerçek zamanlı izlenme ve kitle tutma grafiğini canlı izledik. Harcadığımız her kuruşun karşılığını fazlasıyla aldık.',
    quoteEn:
      'As an independent duo on a tight budget, the online calculator helped us configure our campaign. Once live, we watched real-time retention and viewer graphs in YouTube Analytics. Every single lira was worth it.',
  },
];

interface ArtistTestimonialsMarqueeProps {
  locale?: string;
}

export default function ArtistTestimonialsMarquee({ locale = 'tr' }: ArtistTestimonialsMarqueeProps) {
  const isTr = locale === 'tr';

  const renderCard = (item: ArtistTestimonial, index: number) => {
    return (
      <div
        key={`${item.id}-${index}`}
        className="group relative flex w-[340px] sm:w-[410px] md:w-[450px] flex-shrink-0 flex-col justify-between rounded-3xl border border-white/10 bg-[#16191E]/95 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#FF0033]/60 hover:bg-[#1A1E26] hover:shadow-[0_12px_40px_rgba(255,0,51,0.22)]"
      >
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF0033]/20 via-[#FF0033]/10 to-transparent border border-[#FF0033]/40 text-2xl shadow-inner">
                {item.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-base leading-tight">
                    {isTr ? item.nameTr : item.nameEn}
                  </h3>
                  <CheckCircle2 className="h-4 w-4 text-[#00C9A7] flex-shrink-0" />
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 font-medium">
                  {isTr ? item.roleTr : item.roleEn}
                </p>
              </div>
            </div>

            {/* YouTube Badge */}
            <div className="flex items-center gap-1 rounded-full bg-red-950/60 border border-red-500/30 px-2.5 py-1 text-[11px] font-semibold text-red-300">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#D9002B] animate-pulse" />
              <span>YouTube</span>
            </div>
          </div>

          {/* Quote Body */}
          <div className="relative mt-4 mb-4">
            <span className="absolute -left-1 -top-2 text-3xl font-serif text-[#FF0033]/30 select-none">
              &ldquo;
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-200 pl-4">
              {isTr ? item.quoteTr : item.quoteEn}
            </p>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="pt-3 border-t border-white/5">
          {/* Star Rating & Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5" aria-label="5/5 yıldız">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-black text-amber-400 tabular-nums">5.0</span>
              <span className="text-[11px] text-zinc-400 font-medium">/ 5.0</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {isTr ? item.badgeTr : item.badgeEn}
            </span>
          </div>

          {/* Metrics Pill & Genre */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/15 border border-[#FF0033]/30 px-3 py-1 text-xs font-bold text-[#FF5E7E]">
              <Eye className="h-3.5 w-3.5 text-[#FF0033]" />
              <span>{isTr ? item.metricTr : item.metricEn}</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <span>{isTr ? item.subMetricTr : item.subMetricEn}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="sanatcilar-ne-diyor"
      className="relative overflow-hidden bg-studio-gradient py-24 text-white border-y border-studio"
    >
      {/* Dynamic Ambient Background Lights */}
      <div className="pointer-events-none absolute top-10 left-1/3 h-96 w-96 rounded-full bg-[#FF0033]/15 blur-[140px] animate-float-drift" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-violet-600/10 blur-[130px] animate-glow-soft" />

      {/* Section Header */}
      <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12 text-center mb-14">
        {/* Live Ticker Pill */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FF0033]/40 bg-[#FF0033]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9002B] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D9002B]" />
          </span>
          <Sparkles className="h-3.5 w-3.5 text-[#FF0033]" />
          <span>
            {isTr
              ? 'Sanatçılar ve Yapımcılar Ne Diyor?'
              : 'What Artists & Producers Say'}
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
          {isTr ? 'Sanatçılar MedyaPR İçin Ne Diyor?' : 'What Artists Say About'}{' '}
          <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
            {isTr ? 'YouTube\'da Gerçek Kitleye Ulaşanlar' : 'MedyaPR Video PR'}
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-4 mx-auto max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          {isTr
            ? 'Bot veya panel yerine resmi Google Ads video kampanyalarıyla doğru hedef kitleye ulaşan bağımsız müzisyenlerin, rap sanatçılarının ve prodüktörlerimizin tescilli deneyimleri.'
            : 'Verified experiences from independent musicians, rap artists, and record producers reaching authentic listeners through official Google Ads video campaigns.'}
        </p>

        {/* Interactive Notice */}
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>
            {isTr
              ? 'Canlı Akış • Yorumları durdurmak veya okumak için kartın üzerine gelin'
              : 'Live Ticker • Hover over any card to pause and read'}
          </span>
        </div>
      </div>

      {/* Marquee Container with Left & Right Gradient Fade Masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left Fade Gradient */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-r from-[#14161A] to-transparent z-20" />
        {/* Right Fade Gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-l from-[#14161A] to-transparent z-20" />

        {/* Single Silky-Smooth Continuous Track (Right to Left) */}
        <div className="flex overflow-hidden py-4">
          <div className="animate-marquee-left-1 flex gap-6">
            {testimonials.map((item, idx) => renderCard(item, idx))}
            {testimonials.map((item, idx) =>
              renderCard(item, idx + testimonials.length)
            )}
          </div>
        </div>
      </div>

      {/* Bottom Trust Highlights */}
      <div className="relative mx-auto mt-12 max-w-5xl px-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-zinc-300 font-medium">
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-[#00C9A7]" />
            <span>
              {isTr
                ? '%100 Resmi Google Ads Altyapısı (Sıfır Bot / Sıfır Panel)'
                : '100% Official Google Ads (Zero Bots / Zero Panels)'}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-[#00C9A7]" />
            <span>
              {isTr
                ? 'YouTube Studio Analitiğinde "YouTube Reklamları" Tescili'
                : 'Verified in YouTube Studio as "YouTube Advertising"'}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-[#00C9A7]" />
            <span>
              {isTr
                ? 'Kanal Şifresi İstenmez • Aşamalı Güvenli Ödeme'
                : 'No Passwords Required • Phased Secure Payment'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
