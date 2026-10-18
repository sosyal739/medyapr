'use client';

import { Star, Sparkles, CheckCircle2, Eye, Music } from 'lucide-react';

interface ArtistTestimonial {
  id: string;
  nameTr: string;
  nameEn: string;
  nameAr: string;
  roleTr: string;
  roleEn: string;
  roleAr: string;
  genreTr: string;
  genreEn: string;
  genreAr: string;
  icon: string;
  metricTr: string;
  metricEn: string;
  metricAr: string;
  subMetricTr: string;
  subMetricEn: string;
  subMetricAr: string;
  badgeTr: string;
  badgeEn: string;
  badgeAr: string;
  quoteTr: string;
  quoteEn: string;
  quoteAr: string;
}

const testimonials: ArtistTestimonial[] = [
  {
    id: 'artist-1',
    nameTr: 'Rap Sanatçısı',
    nameEn: 'Rap Artist',
    nameAr: 'فنان راب',
    roleTr: 'MedyaPR Müşterisi • Trap & Hip-Hop',
    roleEn: 'MedyaPR Client • Trap & Hip-Hop',
    roleAr: 'عميل MedyaPR • تراب وهيب هوب',
    genreTr: '#TürkçeRap',
    genreEn: '#HipHop',
    genreAr: '#HipHop',
    icon: '🎤',
    metricTr: '~ 2.8M+ İzlenme',
    metricEn: '~ 2.8M+ Views',
    metricAr: '~ +2.8M مشاهدة',
    subMetricTr: '+14.2K Abone',
    subMetricEn: '+14.2K Subs',
    subMetricAr: '+14.2K مشترك',
    badgeTr: 'Doğrulanmış YouTube Kampanyası',
    badgeEn: 'Verified YouTube Campaign',
    badgeAr: 'حملة يوتيوب موثّقة',
    quoteTr:
      'Yeni klibimizin çıkışında sahte bot panelleriyle kanalımızı riske atmak istemedik. MedyaPR ile doğrudan trap ve hip-hop dinleyicilerini hedefledik. YouTube Studio\'da trafik kaynağının "YouTube Reklamları" olarak tescillenmesi ve gelen yüzlerce samimi yorum harikaydı. Klip daha sonra önerilen videolarda organik olarak yürümeye başladı.',
    quoteEn:
      'We didn\'t want to risk our channel with fake bot panels for our new music video. With MedyaPR, we targeted real trap and hip-hop listeners via Google Ads. Seeing the traffic legitimately logged as "YouTube Advertising" in YouTube Studio and receiving hundreds of genuine comments was incredible. The video then took off organically in YouTube recommendations.',
    quoteAr: 'لم نرغب في المخاطرة بقناتنا عبر لوحات البوتات الوهمية لفيديو الكليب الجديد. مع MedyaPR استهدفنا مستمعي التراب والهيب هوب الحقيقيين عبر Google Ads. كان مذهلًا أن نرى الزيارات مسجلة رسميًا تحت «إعلانات يوتيوب» في YouTube Studio وأن نتلقى مئات التعليقات الحقيقية. بعدها انطلق الفيديو بشكل طبيعي في توصيات يوتيوب.',
  },
  {
    id: 'artist-2',
    nameTr: 'Pop Şarkıcısı',
    nameEn: 'Pop Singer',
    nameAr: 'مغنّي بوب',
    roleTr: 'MedyaPR Müşterisi • Solo Sanatçı',
    roleEn: 'MedyaPR Client • Solo Artist',
    roleAr: 'عميل MedyaPR • فنان منفرد',
    genreTr: '#PopMüzik',
    genreEn: '#PopMusic',
    genreAr: '#PopMusic',
    icon: '🎵',
    metricTr: '~ 1.6M+ İzlenme',
    metricEn: '~ 1.6M+ Views',
    metricAr: '~ +1.6M مشاهدة',
    subMetricTr: '%84 İzleme Oranı',
    subMetricEn: '84% View Rate',
    subMetricAr: 'نسبة مشاهدة 84%',
    badgeTr: 'Doğrulanmış Klip Lansmanı',
    badgeEn: 'Verified Video Launch',
    badgeAr: 'إطلاق كليب موثّق',
    quoteTr:
      'İlk solo teklim için klip lansman paketi aldım. Özellikle Türkiye ve Almanya\'daki gurbetçi kitleye yönelik demografik hedefleme kusursuz çalıştı. Diğer yerlerdeki gibi 3 gün sonra silinen izlenmeler olmadı; Google Ads izlenmeleri ömür boyu kalıcı kaldı ve şarkımın Spotify dinlenmeleri de 3 katına çıktı.',
    quoteEn:
      'I used the music video launch package for my debut solo single. The demographic targeting for listeners in Turkey and Europe worked flawlessly. Unlike fake panels, there were no drops after 3 days; views are permanent and my Spotify streams tripled as a direct result.',
    quoteAr: 'استخدمت باقة إطلاق الفيديو كليب لأول أغنية منفردة لي. وعمل الاستهداف الديموغرافي للمستمعين في تركيا وأوروبا بلا أي خلل. وعلى عكس اللوحات الوهمية، لم تنخفض المشاهدات بعد 3 أيام؛ فهي دائمة، وتضاعف عدد مرات الاستماع إلى أغنيتي على Spotify ثلاث مرات نتيجة لذلك.',
  },
  {
    id: 'artist-3',
    nameTr: 'Alternatif Rock Grubu',
    nameEn: 'Alternative Rock Band',
    nameAr: 'فرقة روك بديل',
    roleTr: 'MedyaPR Müşterisi • Canlı Performans',
    roleEn: 'MedyaPR Client • Live Session',
    roleAr: 'عميل MedyaPR • جلسة حية',
    genreTr: '#AlternatifRock',
    genreEn: '#AltRock',
    genreAr: '#AltRock',
    icon: '🎸',
    metricTr: '~ 940K+ İzlenme',
    metricEn: '~ 940K+ Views',
    metricAr: '~ +940K مشاهدة',
    subMetricTr: '+3.8K Beğeni & Yorum',
    subMetricEn: '+3.8K Likes & Comments',
    subMetricAr: '+3.8K إعجاب وتعليق',
    badgeTr: 'Canlı Performans PR',
    badgeEn: 'Live Session PR',
    badgeAr: 'ترويج الجلسة الحية',
    quoteTr:
      'Canlı stüdyo performans videomuz için bütçemizi en verimli şekilde kullanmak zorundaydık. MedyaPR ekibi şarkımızın tarzına uygun Türkçe rock ve indie dinleyicilerini nokta atışı hedefledi. Şarkıyı gerçekten seven insanların samimi yorumları ve kanalımıza abone olması en büyük kazancımız oldu.',
    quoteEn:
      'For our live studio session video, we needed maximum efficiency from our budget. The MedyaPR team accurately targeted real Turkish rock and indie listeners. Earning genuine comments and long-term channel subscribers was our biggest win.',
    quoteAr: 'لفيديو جلسة الاستوديو الحية، احتجنا إلى أقصى كفاءة من ميزانيتنا. استهدف فريق MedyaPR بدقة مستمعي الروك والإندي الحقيقيين. وكان أكبر مكسب لنا هو الحصول على تعليقات صادقة ومشتركين دائمين في القناة.',
  },
  {
    id: 'artist-4',
    nameTr: 'Müzik Prodüktörü',
    nameEn: 'Music Producer',
    nameAr: 'منتج موسيقي',
    roleTr: 'MedyaPR Kurumsal Partneri • Bağımsız Label',
    roleEn: 'MedyaPR Corporate Partner • Independent Label',
    roleAr: 'شريك MedyaPR المؤسسي • شركة إنتاج مستقلة',
    genreTr: '#MüzikYapım',
    genreEn: '#MusicLabel',
    genreAr: '#MusicLabel',
    icon: '🎛️',
    metricTr: '~ 4.8M+ İzlenme',
    metricEn: '~ 4.8M+ Views',
    metricAr: '~ +4.8M مشاهدة',
    subMetricTr: '14 Farklı Klip Kampanyası',
    subMetricEn: '14 Video Campaigns',
    subMetricAr: '14 حملة فيديو كليب',
    badgeTr: 'Resmi Label Partneri',
    badgeEn: 'Official Label Partner',
    badgeAr: 'شريك رسمي لشركات الإنتاج',
    quoteTr:
      'Bünyemizdeki sanatçıların kliplerinde taviz vermediğimiz iki konu var: YouTube Studio şeffaflığı ve sıfır sahte bot kuralı. MedyaPR ile 14 farklı şarkıda çalıştık. Kampanya sonunda paylaştıkları Google Ads performans raporları ve maliyet optimizasyonu kurumsal seviyede profesyonel.',
    quoteEn:
      'For the artists on our roster, two things are non-negotiable: YouTube Studio transparency and zero bots. We\'ve run 14 music campaigns with MedyaPR. The end-of-campaign Google Ads analytics and cost optimization are strictly enterprise-grade.',
    quoteAr: 'بالنسبة للفنانين المتعاقدين معنا، هناك أمران لا نتنازل عنهما: الشفافية في YouTube Studio وانعدام البوتات. نفذنا 14 حملة موسيقية مع MedyaPR، وتحليلات Google Ads في نهاية الحملة وتحسين التكلفة على مستوى احترافي مؤسسي بحق.',
  },

  {
    id: 'artist-5',
    nameTr: 'Akustik Sanatçısı',
    nameEn: 'Acoustic Artist',
    nameAr: 'فنان أكوستيك',
    roleTr: 'MedyaPR Müşterisi • YouTube Creator',
    roleEn: 'MedyaPR Client • YouTube Creator',
    roleAr: 'عميل MedyaPR • صانع محتوى على يوتيوب',
    genreTr: '#Akustik',
    genreEn: '#Acoustic',
    genreAr: '#Acoustic',
    icon: '🎙️',
    metricTr: '~ 820K+ İzlenme',
    metricEn: '~ 820K+ Views',
    metricAr: '~ +820K مشاهدة',
    subMetricTr: '+9.4K Yeni Abone',
    subMetricEn: '+9.4K New Subs',
    subMetricAr: '+9.4K مشترك جديد',
    badgeTr: 'Doğrulanmış Kanal Büyümesi',
    badgeEn: 'Verified Channel Growth',
    badgeAr: 'نمو قناة موثّق',
    quoteTr:
      'Kanal şifresi veya yetki istememeleri en başından büyük güven verdi; sadece klip linkini ilettim. Süreç baştan sona şeffaftı, kampanya onayımla başladı. Akustik dinleyici kitleme tam 12\'den ulaştık. Hem YouTube hem de canlı konserlerimin dinleyicisi büyüdü.',
    quoteEn:
      'Not needing passwords or manager access gave me immense trust from day one; I only provided the video link. The process was transparent from start to finish and the campaign began only with my approval. My acoustic audience grew both on YouTube and at my live gigs.',
    quoteAr: 'عدم طلب كلمات المرور أو صلاحيات الإدارة منحني ثقة كبيرة منذ البداية؛ فقد قدمت رابط الفيديو فقط. كانت العملية شفافة من البداية إلى النهاية، ولم تبدأ الحملة إلا بموافقتي. ونما جمهوري الأكوستيك على يوتيوب وفي حفلاتي الحية.',
  },
  {
    id: 'artist-6',
    nameTr: 'DJ & Müzik Prodüktörü',
    nameEn: 'DJ & Music Producer',
    nameAr: 'دي جي ومنتج موسيقي',
    roleTr: 'MedyaPR Global Müşterisi • Elektronik Müzik',
    roleEn: 'MedyaPR Global Client • Electronic Music',
    roleAr: 'عميل MedyaPR العالمي • موسيقى إلكترونية',
    genreTr: '#EDM #Elektronik',
    genreEn: '#Electronic',
    genreAr: '#Electronic',
    icon: '🎧',
    metricTr: '~ 2.1M+ Global İzlenme',
    metricEn: '~ 2.1M+ Global Views',
    metricAr: '~ +2.1M مشاهدة عالمية',
    subMetricTr: '35+ Ülkede Gösterim',
    subMetricEn: '35+ Countries',
    subMetricAr: '+35 دولة',
    badgeTr: 'Global Google Ads PR',
    badgeEn: 'Global Google Ads PR',
    badgeAr: 'ترويج عالمي عبر Google Ads',
    quoteTr:
      'Parçamızı sadece Türkiye\'de değil; Almanya, Hollanda ve İngiltere\'deki elektronik müzik kulüp ve festival kitlelerine ulaştırdık. YouTube Shorts akış reklamları ile In-Stream gösterimlerin kombinasyonu mükemmel sonuç verdi. Parçayı Shazam\'dan arayan dinleyici sayısında rekor kırdık.',
    quoteEn:
      'We promoted our track not only in Turkey, but across electronic music club and festival crowds in Germany, the Netherlands, and the UK. The combination of YouTube Shorts feed ads and In-Stream placements drove record-breaking Shazam tags.',
    quoteAr: 'روّجنا لأغنيتنا ليس في تركيا فقط، بل لجمهور نوادي وحفلات الموسيقى الإلكترونية في ألمانيا وهولندا وبريطانيا. وقد حقق الجمع بين إعلانات YouTube Shorts وإعلانات In-Stream أرقامًا قياسية في عمليات التعرّف عبر Shazam.',
  },
  {
    id: 'artist-7',
    nameTr: 'Yorumcu & Besteci',
    nameEn: 'Composer & Vocalist',
    nameAr: 'ملحّن ومغنٍّ',
    roleTr: 'MedyaPR Müşterisi • Klip Lansmanı',
    roleEn: 'MedyaPR Client • Music Video Launch',
    roleAr: 'عميل MedyaPR • إطلاق فيديو كليب',
    genreTr: '#ModernArabesk',
    genreEn: '#WorldMusic',
    genreAr: '#WorldMusic',
    icon: '🎻',
    metricTr: '~ 3.4M+ İzlenme',
    metricEn: '~ 3.4M+ Views',
    metricAr: '~ +3.4M مشاهدة',
    subMetricTr: 'Trendler Listesi Etkisi',
    subMetricEn: 'Trending Impact',
    subMetricAr: 'تأثير الترند',
    badgeTr: 'Trendler Etkili Lansman',
    badgeEn: 'Trending Impact Launch',
    badgeAr: 'إطلاق بتأثير الترند',
    quoteTr:
      'Piyasada o kadar çok sahte panelci var ki kanalını çöp eden tanıdıklarıma şahit oldum. MedyaPR\'ın Google Ads güvencesiyle ilk haftadan 1 milyon barajını aştık. Şarkı viral oldu ve YouTube algoritması klibi otomatikman önermeye başladı. İşini dürüst yapan gerçek profesyoneller.',
    quoteEn:
      'There are so many scam panels out there that ruin channels. With MedyaPR\'s official Google Ads infrastructure, we crossed 1 million views in week one. The song went viral and YouTube\'s algorithm started recommending it organically. Truly honest pros.',
    quoteAr: 'هناك الكثير من اللوحات الاحتيالية التي تدمّر القنوات. ومع بنية MedyaPR الرسمية عبر Google Ads تجاوزنا مليون مشاهدة في الأسبوع الأول. انتشرت الأغنية وبدأت خوارزمية يوتيوب توصي بها بشكل طبيعي. محترفون صادقون حقًا.',
  },
  {
    id: 'artist-8',
    nameTr: 'Indie Pop İkilisi',
    nameEn: 'Indie Pop Duo',
    nameAr: 'ثنائي إندي بوب',
    roleTr: 'MedyaPR Müşterisi • Bağımsız Müzisyenler',
    roleEn: 'MedyaPR Client • Independent Musicians',
    roleAr: 'عميل MedyaPR • موسيقيون مستقلون',
    genreTr: '#IndiePop',
    genreEn: '#IndiePop',
    genreAr: '#IndiePop',
    icon: '🎹',
    metricTr: '~ 1.2M+ İzlenme',
    metricEn: '~ 1.2M+ Views',
    metricAr: '~ +1.2M مشاهدة',
    subMetricTr: '+6.1K Spotify Dinleyici',
    subMetricEn: '+6.1K Spotify Fans',
    subMetricAr: '+6.1K مستمع على Spotify',
    badgeTr: 'Doğrulanmış Organik Erişim',
    badgeEn: 'Verified Organic Reach',
    badgeAr: 'وصول طبيعي موثّق',
    quoteTr:
      'Bağımsız bir müzik ikilisi olarak kısıtlı bütçemiz vardı. Sitedeki bütçe hesaplayıcı ile kendi paketimizi belirledik. Kampanyamız başladığında YouTube Analytics\'te gerçek zamanlı izlenme ve kitle tutma grafiğini canlı izledik. Harcadığımız her kuruşun karşılığını fazlasıyla aldık.',
    quoteEn:
      'As an independent duo on a tight budget, the online calculator helped us configure our campaign. Once live, we watched real-time retention and viewer graphs in YouTube Analytics. Every single lira was worth it.',
    quoteAr: 'كنا ثنائيًا مستقلًا بميزانية محدودة، وساعدتنا الحاسبة على الموقع في إعداد حملتنا. وبعد انطلاقها تابعنا رسوم الاحتفاظ بالمشاهدين والمشاهدات لحظة بلحظة في YouTube Analytics. كل ليرة أنفقناها كانت تستحق.',
  },
];

interface ArtistTestimonialsMarqueeProps {
  locale?: string;
}

export default function ArtistTestimonialsMarquee({ locale = 'tr' }: ArtistTestimonialsMarqueeProps) {
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';

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
                    {isAr ? item.nameAr : isTr ? item.nameTr : item.nameEn}
                  </h3>
                  <CheckCircle2 className="h-4 w-4 text-[#00C9A7] flex-shrink-0" />
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 font-medium">
                  {isAr ? item.roleAr : isTr ? item.roleTr : item.roleEn}
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
              {isAr ? item.quoteAr : isTr ? item.quoteTr : item.quoteEn}
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
              {isAr ? item.badgeAr : isTr ? item.badgeTr : item.badgeEn}
            </span>
          </div>

          {/* Metrics Pill & Genre */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FF0033]/15 border border-[#FF0033]/30 px-3 py-1 text-xs font-bold text-[#FF5E7E]">
              <Eye className="h-3.5 w-3.5 text-[#FF0033]" />
              <span>{isAr ? item.metricAr : isTr ? item.metricTr : item.metricEn}</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <span>{isAr ? item.subMetricAr : isTr ? item.subMetricTr : item.subMetricEn}</span>
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
            {isAr
              ? 'ماذا يقول الفنانون والمنتجون'
              : isTr
              ? 'Sanatçılar ve Yapımcılar Ne Diyor?'
              : 'What Artists & Producers Say'}
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
          {isAr ? 'ماذا يقول الفنانون عن' : isTr ? 'Sanatçılar MedyaPR İçin Ne Diyor?' : 'What Artists Say About'}{' '}
          <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
            {isAr ? 'الترويج للفيديو مع MedyaPR' : isTr ? 'YouTube\'da Gerçek Kitleye Ulaşanlar' : 'MedyaPR Video PR'}
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-4 mx-auto max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          {isAr
            ? 'تجارب موثّقة لموسيقيين مستقلين وفناني راب ومنتجين وصلوا إلى مستمعين حقيقيين عبر حملات فيديو Google Ads الرسمية.'
            : isTr
            ? 'Bot veya panel yerine resmi Google Ads video kampanyalarıyla doğru hedef kitleye ulaşan bağımsız müzisyenlerin, rap sanatçılarının ve prodüktörlerimizin tescilli deneyimleri.'
            : 'Verified experiences from independent musicians, rap artists, and record producers reaching authentic listeners through official Google Ads video campaigns.'}
        </p>

        {/* Interactive Notice */}
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>
            {isAr
              ? 'شريط مباشر • مرّر المؤشر فوق أي بطاقة للإيقاف والقراءة'
              : isTr
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
              {isAr
                ? 'إعلانات Google Ads رسمية 100% (بلا بوتات / بلا لوحات)'
                : isTr
                ? '%100 Resmi Google Ads Altyapısı (Sıfır Bot / Sıfır Panel)'
                : '100% Official Google Ads (Zero Bots / Zero Panels)'}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-[#00C9A7]" />
            <span>
              {isAr
                ? 'موثّق في YouTube Studio تحت «إعلانات يوتيوب»'
                : isTr
                ? 'YouTube Studio Analitiğinde "YouTube Reklamları" Tescili'
                : 'Verified in YouTube Studio as "YouTube Advertising"'}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2">
            <CheckCircle2 className="h-4 w-4 text-[#00C9A7]" />
            <span>
              {isAr
                ? 'لا حاجة لكلمات المرور • مراجعة أولًا ثم عرض سعر'
                : isTr
                ? 'Kanal Şifresi İstenmez • Önce Analiz, Sonra Teklif'
                : 'No Passwords Required • Review First, Then Quote'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
