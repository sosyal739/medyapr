import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Music,
  Target,
  BarChart3,
  Award,
  HelpCircle,
  ArrowRight,
  Lock,
  FileText,
} from 'lucide-react';
import { locales } from '@/lib/i18n/config';
import { getPageAlternates } from '@/lib/seo';
import KlipPrPlanner from '@/components/order/KlipPrPlanner';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';

  const title = isAr
    ? 'وكالة العلاقات العامة الرقمية وإطلاق فيديو الكليب | MedyaPR'
    : isTr
    ? 'Müzik Klibi Dijital PR & Lansman Ajansı | MedyaPR'
    : 'Music Video Digital PR & Launch Agency | MedyaPR';

  const description = isAr
    ? 'علاقات عامة رقمية وتخطيط إعلامي وإدارة إطلاق لفيديو الكليب باستهداف الجمهور المناسب، للفنانين المستقلين وشركات التسجيلات. اطلب تحليلًا مجانيًا لكليبك.'
    : isTr
    ? 'Sanatçılar, müzik grupları ve yapım şirketleri için hedef kitle odaklı müzik klibi dijital PR, medya planlama ve lansman yönetimi. Ücretsiz analiz isteyin.'
    : 'Audience-targeted music video digital PR, media planning, and launch management for independent artists and record labels. Request a free video audit.';

  return {
    title: { absolute: title },
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: getPageAlternates(locale, '/klip-pr'),
  };
}

export default async function KlipPrLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';

  const faqs = isAr
    ? [
        {
          q: 'هل تحتاجون كلمة مرور القناة أو الوصول إلى الحساب؟',
          a: 'لا. لا نطلب أبدًا كلمة مرور قناتك ولا بيانات تسجيل الدخول. نحتاج فقط رابط الكليب العام لإعداد حملتك وإطلاقها.',
        },
        {
          q: 'كيف تتم عملية الدفع؟',
          a: 'تتم مراجعة كليبك أولًا ثم نُعدّ خطة إعلامية، ويُتفق على خطة الدفع كتابيًا في مرحلة عرض السعر. لا تبدأ أي حملة دون موافقتك.',
        },
        {
          q: 'هل تستخدمون بوتات أو لوحات تفاعل مصطنعة؟',
          a: 'أبدًا. MedyaPR وكالة مستقلة للتخطيط الإعلامي الرقمي والترويج الموسيقي بخبرة تتجاوز 18 عامًا. نلتزم التزامًا صارمًا بسياسات الإعلانات الرسمية ولا نقدّم أي تلاعب مصطنع بالأرقام.',
        },
      ]
    : isTr
    ? [
        {
          q: 'Klip PR ve medya planlama çalışması için kanal şifresi gerekiyor mu?',
          a: 'Hayır. MedyaPR üzerinden yürütülen hiçbir medya planlama ve tanıtım çalışmasında kanal şifresi veya hesap yetkisi talep edilmez. Yalnızca yayınlanmış video bağlantınız (veya yayın öncesi lansman bilginiz) yeterlidir.',
        },
        {
          q: 'Ödeme ve faturalandırma süreci nasıl işliyor?',
          a: 'Önce klibiniz incelenir ve medya planı hazırlanır; ödeme planı teklif aşamasında yazılı olarak netleştirilir. Onayınız olmadan kampanya başlamaz.',
        },
        {
          q: 'Hangi müzik türleri ve sanatçılar için uygundur?',
          a: 'Türkçe Pop, Hip-Hop/Rap, Rock, Alternatif, Akustik, Indie, Arabesk/Halk ve Elektronik müzik başta olmak üzere hem bağımsız (independent) müzisyenler hem de plak şirketleri için türe özel dinleyici kitle eşleşmesi yapılır.',
        },
        {
          q: 'Yapay etkileşim veya bot panel kullanılıyor mu?',
          a: 'Kesinlikle hayır. MedyaPR, 18+ yıllık tecrübeye sahip bağımsız bir dijital medya planlama ve PR ajansıdır. Kanal sağlığına zarar veren bot, panel veya yapay metrik manipülasyonu hizmetimiz yoktur; yalnızca resmi reklam ağları ve gerçek izleyici hedeflemesi kullanılır.',
        },
      ]
    : [
        {
          q: 'Do you require channel passwords or account access?',
          a: 'No. We never ask for your channel password or login credentials. Only your public music video link is needed to configure and launch your campaign.',
        },
        {
          q: 'How does payment work?',
          a: 'Your music video is reviewed first and a media plan is prepared; the payment plan is agreed in writing at the quote stage. No campaign starts without your approval.',
        },
        {
          q: 'Do you use bots or artificial engagement panels?',
          a: 'Never. MedyaPR is an independent digital media planning and music PR agency with 18+ years of experience. We strictly adhere to official advertising policies and never offer artificial metric manipulation.',
        },
      ];

  const schemaGraph = {
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
            name: isAr ? 'الترويج الرقمي وإطلاق فيديو الكليب' : isTr ? 'Müzik Klibi Dijital PR & Lansman' : 'Music Video Digital PR & Launch',
            item: `https://medyapr.com/${locale}/klip-pr`,
          },
        ],
      },
      {
        '@type': 'Service',
        name: isAr
          ? 'خدمة العلاقات العامة الرقمية وإطلاق فيديو الكليب والتخطيط الإعلامي'
          : isTr
          ? 'Müzik Klibi Dijital PR, Lansman ve Medya Planlama Hizmeti'
          : 'Music Video Digital PR, Launch and Media Planning Service',
        provider: {
          '@type': 'Organization',
          name: 'MedyaPR',
          url: 'https://medyapr.com',
        },
        serviceType: isAr ? 'الترويج الموسيقي والتخطيط الإعلامي للفيديو' : isTr ? 'Müzik PR ve Video Medya Planlama' : 'Music PR and Video Media Planning',
        areaServed: ['TR', 'DE', 'Global'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-app-base text-white py-12 md:py-20 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      {/* Ambient Studio Lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[480px] w-[850px] rounded-full bg-[#FF0033]/12 blur-[150px]" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10 space-y-16">
        {/* 1. HERO SECTION (100% Agency & Artist Launch Positioning) */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-900/90 px-4 py-1.5 text-xs font-extrabold text-[#FF6B6B] shadow-lg">
            <Award className="h-4 w-4 text-[#FF0033]" />
            <span>
              {isAr
                ? 'خبرة تتجاوز 18 عامًا في الإعلام الرقمي • ترويج فيديو مخصص للفنانين وشركات الإنتاج'
                : isTr
                ? '18+ Yıllık Dijital Medya Deneyimi • Sanatçı & Yapım Şirketlerine Özel Klip PR'
                : '18+ Years Digital Media Track Record • Dedicated Artist & Label Video PR'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            {isAr
              ? (
              <>
                اوصل كليبك إلى{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  جمهور المستمعين المناسب
                </span>
              </>
            )
              : isTr ? (
              <>
                Yeni Müzik Klibinizi{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Doğru Dinleyici Kitlesiyle
                </span>{' '}
                Buluşturun
              </>
            ) : (
              <>
                Connect Your Music Video With the{' '}
                <span className="bg-gradient-to-r from-[#FF0033] via-[#FF6B6B] to-[#FF8E53] bg-clip-text text-transparent">
                  Right Listener Audience
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            {isAr
              ? 'لا تدع أشهر العمل في الاستوديو تمر دون أن يلاحظها أحد. نخطط وندير حملات إعلانات فيديو وعلاقات عامة رقمية تناسب نوع موسيقاك وتستهدف المناطق الجغرافية المناسبة، للفنانين المستقلين وشركات التسجيلات.'
              : isTr
              ? 'Stüdyoda aylarca emek verdiğiniz şarkınız yanlış kitleler arasında kaybolmasın. Müzik türünüze (Pop, Rap, Rock, Alternatif, Akustik), yaş grubuna ve hedef coğrafyaya göre planlanan kurumsal video medya yönetimiyle klibinizi gerçek müzikseverlere ulaştırıyoruz.'
              : 'Do not let months of studio production go unnoticed. We plan and manage genre-matched, geo-targeted video advertising and digital PR campaigns for independent artists and record labels.'}
          </p>

          {/* Trust Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-bold text-zinc-200">
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-3 py-3">
              <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{isAr ? 'لا حاجة لكلمة مرور' : isTr ? 'Kanal Şifresi İstenmez' : 'No Password Required'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-3 py-3">
              <Target className="h-4 w-4 text-[#FF6B6B] shrink-0" />
              <span>{isAr ? 'استهداف النوع الموسيقي والعمر' : isTr ? 'Müzik Türü & Yaş Hedefleme' : 'Genre & Age Targeting'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-3 py-3">
              <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0" />
              <span>{isAr ? 'تحليل أولًا • ثم عرض سعر' : isTr ? 'Önce Analiz • Sonra Teklif' : 'Review First • Then Quote'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-3 py-3">
              <BarChart3 className="h-4 w-4 text-amber-400 shrink-0" />
              <span>{isAr ? 'تقارير شفافة' : isTr ? 'Şeffaf Medya Raporlama' : 'Transparent Reporting'}</span>
            </div>
          </div>
        </section>

        {/* 2. INTERACTIVE LAUNCH BRIEF & BUDGET PLANNER */}
        <section>
          <KlipPrPlanner locale={locale} />
        </section>

        {/* 3. HOW OUR ARTIST PR & MEDIA PLANNING WORKS (3 STEPS) */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B]">
              {isAr ? 'آلية عمل شفافة للوكالة' : isTr ? 'Şeffaf Ajans Süreci' : 'Transparent Agency Workflow'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {isAr ? 'إدارة إطلاق الكليب في 3 خطوات' : isTr ? '3 Adımda Klip Lansman & Medya Yönetimi' : '3-Step Music Video Launch Management'}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0033]/20 text-sm font-black text-[#FF6B6B]">
                01
              </div>
              <h3 className="text-lg font-extrabold text-white">
                {isAr ? 'تحليل مجاني للكليب والجمهور' : isTr ? 'Ücretsiz Klip & Kitle Analizi' : 'Free Video & Audience Audit'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {isAr
                  ? 'نحلل نوع عملك الموسيقي وإيقاعه وشخصية المستمع المستهدف لتحديد المناطق والفئات الديموغرافية الأكثر ارتباطًا بموسيقاك.'
                  : isTr
                  ? 'Eserinizin müzik türünü, temposunu ve hedef dinleyici profilini inceliyoruz. Şarkınıza en uygun coğrafi bölgeleri ve ilgi alanı kırılımlarını belirliyoruz.'
                  : 'We evaluate your track genre, tempo, and listener persona to define the highest-affinity geographic and demographic segments.'}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0033]/20 text-sm font-black text-[#FF6B6B]">
                02
              </div>
              <h3 className="text-lg font-extrabold text-white">
                {isAr ? 'إعداد الحملة والموافقة' : isTr ? 'Kampanya Kurulumu & Onay' : 'Campaign Setup & Approval'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {isAr
                  ? 'تُعدّ خطتك الإعلامية وتُرسل لمراجعة سياسات الإعلانات الرسمية. وبعد الموافقة تنطلق الحملة مباشرة.'
                  : isTr
                  ? 'Medya planınız hazırlanır ve resmi reklam politikalarına uygun şekilde onaya sunulur. Kampanyanız onaylandığında yayın başlatılır.'
                  : 'Your media plan is configured and submitted for official ad policy review. Once approved, the live campaign starts.'}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0033]/20 text-sm font-black text-[#FF6B6B]">
                03
              </div>
              <h3 className="text-lg font-extrabold text-white">
                {isAr ? 'التحسين والتقرير النهائي' : isTr ? 'Optimizasyon & Tamamlama Raporu' : 'Optimization & Final Reporting'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {isAr
                  ? 'طوال فترة الإطلاق تُوجَّه ميزانيتك نحو شرائح المستمعين الأعلى أداءً، وتُختتم الحملة بتقرير نهائي.'
                  : isTr
                  ? 'Yayın süresince bütçeniz en yüksek izleyici ilgisi gösteren kitle segmentlerine göre optimize edilir. Süreç tamamlandığında sonuçlar şeffaf biçimde raporlanır.'
                  : 'Throughout the launch, your media budget is optimized toward top-performing listener segments, concluding with final reporting.'}
              </p>
            </div>
          </div>
        </section>

        {/* 4. GENRE TARGETING MATRIX TABLE */}
        <section className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 sm:p-10 space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B]">
              <Music className="h-4 w-4" />
              {isAr ? 'تخطيط الجمهور حسب النوع الموسيقي' : isTr ? 'Müzik Türüne Göre Kitle Planlaması' : 'Genre-Specific Audience Planning'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {isAr
                ? 'استهداف مخصص للمستمعين لكل نوع موسيقي'
                : isTr
                ? 'Her Müzik Türü İçin Farklı Dinleyici Stratejisi'
                : 'Tailored Listener Targeting Across Every Music Genre'}
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-zinc-950 text-zinc-300 border-b border-white/10">
                  <th className="p-3.5 font-extrabold">{isAr ? 'النوع الموسيقي' : isTr ? 'Müzik Türü' : 'Music Genre'}</th>
                  <th className="p-3.5 font-extrabold">{isAr ? 'شريحة المستمعين الأساسية' : isTr ? 'Birincil Dinleyici Kitlesi' : 'Primary Listener Segment'}</th>
                  <th className="p-3.5 font-extrabold">{isAr ? 'صيغة الإعلان الموصى بها' : isTr ? 'Önerilen Medya Formatı' : 'Recommended Ad Format'}</th>
                  <th className="p-3.5 font-extrabold">{isAr ? 'المناطق الجغرافية الأساسية' : isTr ? 'Öncelikli Coğrafya' : 'Core Geography'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-300 bg-zinc-900/50">
                <tr>
                  <td className="p-3.5 font-bold text-white">{isAr ? 'هيب هوب / راب / تراب' : 'Hip-Hop / Rap / Trap'}</td>
                  <td className="p-3.5">{isAr ? 'شباب المدن (16–28 عامًا) ومستمعو الراب' : '16–28 Yaş Şehirli Genç & Rap Dinleyicisi'}</td>
                  <td className="p-3.5">{isAr ? 'فيديو قابل للتخطي + تدفق Shorts العمودي' : 'Atlanabilir Video + Dikey Shorts Akışı'}</td>
                  <td className="p-3.5">{isAr ? 'دول الخليج ومصر والمغرب + أوروبا' : 'Türkiye + Almanya / Avrupa'}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-white">{isAr ? 'بوب ورقص' : 'Türkçe Pop & Dans'}</td>
                  <td className="p-3.5">{isAr ? '18–35 عامًا، متابعو الأغاني الرائجة وقوائم الترند' : '18–35 Yaş Güncel Hit & Liste Takipçileri'}</td>
                  <td className="p-3.5">{isAr ? 'In-Stream بمقطع من أقوى جزء في الكليب' : 'In-Stream Klibin En Güçlü Nakarat Kesiti'}</td>
                  <td className="p-3.5">{isAr ? 'العالم العربي بالكامل + جمهور عالمي' : 'Türkiye Geneli + Küresel'}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-white">{isAr ? 'روك وألترناتيف' : 'Rock & Alternatif'}</td>
                  <td className="p-3.5">{isAr ? '18–40 عامًا، جمهور الألبومات والحفلات' : '18–40 Yaş Albüm & Konser Odaklı Dinleyici'}</td>
                  <td className="p-3.5">{isAr ? 'عرض الكليب كاملًا لمدة أطول + الاكتشاف' : 'Uzun Süreli Tam Klip Gösterimi + Keşfet'}</td>
                  <td className="p-3.5">{isAr ? 'المدن الكبرى والمدن الجامعية' : 'Büyükşehir & Üniversite Kentleri'}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-white">{isAr ? 'أكوستيك / إندي / غناء' : 'Akustik / Indie / Vokal'}</td>
                  <td className="p-3.5">{isAr ? 'جمهور الجلسات الأكوستيك وقوائم التشغيل' : 'Akustik Seans & Çalma Listesi Dinleyicileri'}</td>
                  <td className="p-3.5">{isAr ? 'الظهور بجانب الفيديوهات الموسيقية ذات الصلة' : 'İlgili Müzik Videoları Yanı Keşfet Yerleşimi'}</td>
                  <td className="p-3.5">{isAr ? 'جمهور الثقافة والفنون في العالم العربي وأوروبا' : 'Türkiye & Avrupa Kültür Kitlesi'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. FAQ SECTION */}
        <section className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#FF0033]" />
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isAr ? 'أسئلة شائعة للفنانين' : isTr ? 'Sanatçı ve Menajerlerin Sıkça Sorduğu Sorular' : 'Frequently Asked Questions for Artists'}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((item, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">{item.q}</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. OFFICIAL AGENCY DISCLOSURE & POLICY COMPLIANCE BOX (For AdsBot-Google Verification) */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 text-xs text-zinc-400 space-y-3">
          <div className="flex items-center gap-2 font-bold text-zinc-200">
            <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              {isAr
                ? 'الشفافية المؤسسية وإفصاح الوكالة المستقلة وسياسة الخدمة'
                : isTr
                ? 'Kurumsal Şeffaflık, Bağımsız Ajans Beyanı ve Hizmet Politikası'
                : 'Corporate Transparency, Independent Agency Disclosure & Service Policy'}
            </span>
          </div>
          <p className="leading-relaxed">
            {isAr
              ? 'MedyaPR وكالة مستقلة للتخطيط الإعلامي الرقمي والترويج الموسيقي تخدم الفنانين والمنتجين وشركات التسجيلات. تلتزم جميع خدمات إدارة الحملات التزامًا صارمًا بسياسات الإعلانات الرسمية وشروط استخدام المنصات. لا نقدّم تفاعلًا مصطنعًا ولا بوتات ولا تلاعبًا بالأرقام. والتوقعات الإعلامية هي تقديرات للوصول الإعلاني مبنية على معايير استهداف الجمهور.'
              : isTr
              ? 'MedyaPR, sanatçılar, müzik yapımcıları ve kurumsal markalar için medya planlama, dijital halkla ilişkiler (PR) ve video reklam yönetimi hizmeti sunan bağımsız bir dijital ajanstır. Sunulan tüm medya planlama hizmetleri resmi reklam politikaları ve platform kullanım koşullarıyla %100 uyumludur; yapay etkileşim, bot veya metrik manipülasyonu hizmeti kesinlikle verilmemektedir. Kampanya bütçe kademeleri medya planlama ve yönetim hizmetini kapsar; erişim ve etkileşim sonuçları eserin müzikal niteliğine, hedef kitle rekabetine ve izleyici ilgisine göre doğal olarak şekillenir.'
              : 'MedyaPR is an independent digital media planning and music PR agency serving artists, producers, and record labels. All campaign management services strictly comply with official advertising policies and platform terms of service. We do not offer artificial engagement, bots, or metric manipulation. Media projections represent estimated advertising reach based on audience targeting parameters.'}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/5 text-zinc-300 font-semibold">
            <Link href={`/${locale}/hakkimizda`} className="hover:text-white underline underline-offset-4">
              {isAr ? 'من نحن' : isTr ? 'Hakkımızda' : 'About Us'}
            </Link>
            <Link href={`/${locale}/gizlilik`} className="hover:text-white underline underline-offset-4">
              {isAr ? 'سياسة الخصوصية' : isTr ? 'Gizlilik Politikası' : 'Privacy Policy'}
            </Link>
            <Link href={`/${locale}/kullanim-kosullari`} className="hover:text-white underline underline-offset-4">
              {isAr ? 'شروط الاستخدام' : isTr ? 'Kullanım Koşulları' : 'Terms of Service'}
            </Link>
            <Link href={`/${locale}/iade-politikasi`} className="hover:text-white underline underline-offset-4">
              {isAr ? 'سياسة الاسترداد والخدمة' : isTr ? 'İade & Hizmet Koşulları' : 'Refund & Service Policy'}
            </Link>
            <Link href={`/${locale}/iletisim`} className="hover:text-white underline underline-offset-4">
              {isAr ? 'تواصل معنا وبيانات الشركة' : isTr ? 'İletişim & Künye' : 'Contact & Imprint'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
