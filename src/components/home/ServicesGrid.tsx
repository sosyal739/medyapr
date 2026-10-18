'use client';

import { Play, Smartphone, Search, Globe, Target, BarChart3 } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/dictionaries';

interface ServicesGridProps {
  dict: Dictionary;
  locale?: string;
}

export default function ServicesGrid({ dict, locale = 'tr' }: ServicesGridProps) {
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';

  const services = [
    {
      title: isAr ? 'إعلانات In-Stream القابلة للتخطي' : isTr ? 'Atlanabilir In-Stream (TrueView)' : 'Skippable In-Stream Ads',
      description: isAr
        ? 'يُعرض فيديو الكليب قبل مقاطع يوتيوب الشهيرة أو أثناءها كإعلان قابل للتخطي. أعلى نسبة احتفاظ وتفاعل حقيقي من الجمهور.'
        : isTr
        ? 'Videonuz diğer popüler YouTube videolarının başında veya ortasında atlanabilir reklam olarak yayınlanır. En yüksek kitle etkileşimi ve kalıcı dinleyici kazandıran format.'
        : 'Your video plays before or during popular YouTube videos as a skippable ad. Highest retention and authentic audience engagement.',
      badge: isAr ? 'الأكثر طلبًا' : isTr ? 'En Çok Tercih Edilen' : 'Most Popular',
      icon: Play,
      accent: 'border-[#FF0033]/40 bg-[#FF0033]/5',
      badgeColor: 'bg-[#FF0033]/20 text-[#FF8FA3]',
    },
    {
      title: isAr ? 'إعلانات فيديو YouTube Shorts' : isTr ? 'YouTube Shorts Video Reklamları' : 'YouTube Shorts Video Ads',
      description: isAr
        ? 'يظهر مقطع Shorts العمودي مباشرة في تدفق Shorts اللانهائي. انتشار فوري على نطاق واسع واكتشاف طبيعي ضخم.'
        : isTr
        ? 'Dikey formatlı Shorts klibiniz, milyonlarca aktif kullanıcının Shorts akışında doğrudan gösterilir. Hızlı viral yayılma ve anlık kanca etkisi.'
        : 'Your vertical Shorts clip is placed directly in the infinite Shorts feed. Instant viral visibility and massive organic discovery.',
      badge: isAr ? 'صيغة سريعة الانتشار' : isTr ? 'Viral Format' : 'Viral Format',
      icon: Smartphone,
      accent: 'border-violet-500/40 bg-violet-500/5',
      badgeColor: 'bg-violet-500/20 text-violet-300',
    },
    {
      title: isAr ? 'إعلانات In-Feed (الاكتشاف)' : isTr ? 'In-Feed (Keşfet & Arama) Reklamları' : 'In-Feed (Discovery) Ads',
      description: isAr
        ? 'تظهر في نتائج بحث يوتيوب وبجانب الفيديوهات ذات الصلة. ينقر المشاهد عن قصد، مما يجلب مشتركين ووقت مشاهدة مرتفعًا.'
        : isTr
        ? 'YouTube ana sayfasında, arama sonuçlarında ve ilgili videoların yanında organik öneri gibi görünür. Kullanıcı kendi isteğiyle tıklar ve izler.'
        : 'Appears in YouTube search results and beside related videos. Viewers click intentionally, driving subscribers and high watch time.',
      badge: isAr ? 'نقرات عن رغبة حقيقية' : isTr ? 'Organik Tıklama' : 'Organic Intent',
      icon: Search,
      accent: 'border-blue-500/40 bg-blue-500/5',
      badgeColor: 'bg-blue-500/20 text-blue-300',
    },
    {
      title: isAr ? 'الاستهداف حسب الاهتمام واللغة والموقع' : isTr ? 'İlgi Alanı, Dil ve Konum Hedefleme' : 'Interest, Language & Geo Targeting',
      description: isAr
        ? 'صل إلى المشاهدين المحتملين في تركيا وحول العالم، بتصفية دقيقة حسب الاهتمام واللغة والموقع الجغرافي.'
        : isTr
        ? 'Videonuzu Türkiye\'de ve dünyanın farklı ülkelerinde ilgi alanı, dil ve konuma göre belirlenen en doğru potansiyel dinleyici ve izleyici kitlesine ulaştırıyoruz.'
        : 'Reach potential viewers in Turkey and globally, filtered precisely by interest, language, and geographical location.',
      badge: isAr ? 'استهداف دقيق' : isTr ? 'Hassas Hedefleme' : 'Precision Targeting',
      icon: Globe,
      accent: 'border-emerald-500/40 bg-emerald-500/5',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      title: isAr ? 'YouTube Analytics وتقرير الأداء' : isTr ? 'YouTube Analytics & Performans Raporu' : 'YouTube Analytics & Performance Report',
      description: isAr
        ? 'لا بوتات ولا لوحات وهمية. يُحتسب كل الترافيك رسميًا كـ«إعلانات يوتيوب» في Studio، مع تقرير أداء مفصّل في نهاية الحملة.'
        : isTr
        ? 'Bot veya panel görüntülemesi kullanılmaz. İzlenmeler Google Ads üzerinden gelir, trafik kaynağınız YouTube Analytics\'te "YouTube Reklamları" olarak listelenir ve çalışma sonunda ayrıntılı performans raporu paylaşılır.'
        : 'Zero fake bots or panels. All traffic is officially recognized as "YouTube Advertising" in Studio, accompanied by an in-depth end-of-campaign performance report.',
      badge: isAr ? 'رسمي 100%' : isTr ? '%100 Resmi Kaynak' : '100% Official',
      icon: BarChart3,
      accent: 'border-amber-500/40 bg-amber-500/5',
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    {
      title: isAr ? 'التفاعل الطبيعي والانتشار' : isTr ? 'Organik Beğeni, Yorum & Abonelik' : 'Organic Engagement & Visibility',
      description: isAr
        ? 'يمنح انتشار الحملة أكبر فرصة للمشاهدين الحقيقيين للاشتراك والإعجاب وكتابة تعليقات حقيقية.'
        : isTr
        ? 'Reklamla birlikte videonuzun görünürlüğü hızla artar; içeriğinizi beğenen gerçek kullanıcıların beğeni, yorum ve kanal aboneliği gibi organik etkileşimlerde bulunması için en yüksek fırsat oluşur.'
        : 'Campaign visibility creates maximum opportunity for real viewers to subscribe, like, and leave authentic comments.',
      badge: isAr ? 'تفاعل طبيعي' : isTr ? 'Doğal Etkileşim' : 'Natural Engagement',
      icon: Target,
      accent: 'border-rose-500/40 bg-rose-500/5',
      badgeColor: 'bg-rose-500/20 text-rose-300',
    },
  ];

  return (
    <section id="services" className="relative overflow-hidden bg-studio-gradient py-24 text-white border-y border-studio">
      {/* Ambient Moving Glow */}
      <div className="pointer-events-none absolute top-1/2 -left-28 h-80 w-80 rounded-full bg-zinc-600/15 blur-[120px] animate-float-slow" />
      <div className="pointer-events-none absolute bottom-12 right-10 h-72 w-72 rounded-full bg-[#FF0033]/15 blur-[120px] animate-float-reverse" />

      {/* Floating Animated Badge (Moving Object) */}
      <div className="pointer-events-none absolute top-12 left-8 lg:left-20 z-20 hidden md:flex items-center gap-2 rounded-2xl border border-zinc-700/60 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-float-drift">
        <Target className="h-4 w-4 text-[#FF4D6D]" />
        <span>{isAr ? 'استهداف مباشر حسب الاهتمام والنوع الموسيقي' : isTr ? 'Doğrudan İlgi Alanı & Müzik Türü Hedeflemesi' : 'Direct Interest & Music Genre Targeting'}</span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
            {isAr ? 'صيغ فيديو Google Ads' : isTr ? 'Google Ads Kampanya Formatları' : 'Google Ads Video Formats'}
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            {isAr ? 'مصمّمة من أجل' : isTr ? 'Kanalınız İçin' : 'Engineered For'}{' '}
            <span className="bg-gradient-to-r from-[#FF0033] to-[#FF6B6B] bg-clip-text text-transparent">
              {isAr ? 'نمو حقيقي على يوتيوب' : isTr ? 'Doğru Reklam Formatı' : 'Real YouTube Growth'}
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-300">
            {isAr
              ? 'تُدار كل حملة حصريًا عبر البنية الرسمية لإعلانات الفيديو في Google Ads.'
              : isTr
              ? 'Tüm kampanyalar YouTube ve Google Ads politikalarına tam uyumlu resmi reklam altyapısıyla yönetilir.'
              : 'Every single campaign is handled strictly through Google Ads official video ad infrastructure.'}
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl border border-studio bg-studio-card p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-studio-strong hover:bg-zinc-800/90 hover:shadow-2xl backdrop-blur-xl"
              >
                {/* Badge */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-[#FF4D6D]" />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="mb-3 text-lg font-bold text-white group-hover:text-[#FF6B6B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
