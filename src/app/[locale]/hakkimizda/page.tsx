import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import { Shield, Target, TrendingUp, Award, Users, BarChart3 } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

import { getPageAlternates } from '@/lib/seo';
import Link from 'next/link';
import { WHATSAPP_URL, TELEGRAM_URL, PUBLIC_EMAIL } from '@/lib/contact';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';

  return {
    title: {
      absolute: isAr
        ? 'من نحن | MedyaPR وكالة شريكة رسمية لـ Google'
        : isTr
        ? 'Hakkımızda | MedyaPR Resmi Google Partner Ajansı'
        : 'About Us | MedyaPR Official Google Partner Agency',
    },
    description: isAr
      ? 'أكثر من 18 عامًا من التميّز في العلاقات العامة الرقمية، نقدّم إدارة رسمية لإعلانات فيديو يوتيوب والترويج لفيديو الكليب عبر Google Ads للفنانين حول العالم.'
      : isTr
      ? '18 yılı aşkındır kesintisiz dijital medya tecrübesiyle sanatçı ve markalara resmi Google Ads YouTube video ve klip PR danışmanlığı sunuyoruz.'
      : 'Over 18 years of digital PR excellence, offering official Google Ads YouTube video and music video PR management to global artists.',
    alternates: getPageAlternates(locale, '/hakkimizda'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';

  const values = [
    { icon: Shield, title: locale === 'ar' ? 'آمن 100%' : locale === 'tr' ? '%100 Güvenli' : '100% Safe', desc: locale === 'ar' ? 'نعمل عبر منصة Google Ads الرسمية' : locale === 'tr' ? 'Google Ads resmi platformu ile çalışıyoruz' : 'We work with Google Ads official platform' },
    { icon: Target, title: locale === 'ar' ? 'إعلانات مستهدفة' : locale === 'tr' ? 'Hedefli Reklam' : 'Targeted Ads', desc: locale === 'ar' ? 'نضمن وصولك إلى الجمهور المناسب' : locale === 'tr' ? 'Doğru kitleye ulaşmanızı sağlıyoruz' : 'We ensure you reach the right audience' },
    { icon: TrendingUp, title: locale === 'ar' ? 'نمو عضوي' : locale === 'tr' ? 'Organik Büyüme' : 'Organic Growth', desc: locale === 'ar' ? 'المشاهدات الحقيقية تحفّز الخوارزمية' : locale === 'tr' ? 'Gerçek izlenmeler algoritma tetikler' : 'Real views trigger the algorithm' },
    { icon: Award, title: locale === 'ar' ? 'خبرة تتجاوز 18 عامًا' : locale === 'tr' ? '18+ Yıl Tecrübe' : '18+ Years Experience', desc: locale === 'ar' ? 'أكثر من 18 عامًا من العلاقات العامة الرقمية والترويج للفيديو دون انقطاع' : locale === 'tr' ? '18 yılı aşkındır sektörde kesintisiz dijital PR ve video tanıtımı' : 'Over 18 years of continuous digital PR and video promotion' },
    { icon: Users, title: locale === 'ar' ? 'مختصون في شراكة Google' : locale === 'tr' ? 'Google Partner Uzmanları' : 'Google Partner Specialists', desc: locale === 'ar' ? 'شراكات مع أبرز الفنانين في تركيا وحول العالم' : locale === 'tr' ? 'Türkiye\'de ve dünyada birçok sanatçı ve kurumsal referans' : 'Partnered with prominent artists across Turkey and worldwide' },
    { icon: BarChart3, title: locale === 'ar' ? 'تقارير شفافة' : locale === 'tr' ? 'Şeffaf Raporlama' : 'Transparent Reports', desc: locale === 'ar' ? 'تابع بيانات حملتك لحظة بلحظة' : locale === 'tr' ? 'Kampanya verilerinizi anlık takip edin' : 'Track your campaign data in real-time' },
  ];

  return (
    <div className="min-h-screen">
      {/* Schema.org AboutPage & BreadcrumbList */}
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
                    name: locale === 'ar' ? 'الرئيسية' : locale === 'tr' ? 'Ana Sayfa' : 'Home',
                    item: `https://medyapr.com/${locale}`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: locale === 'ar' ? 'من نحن' : locale === 'tr' ? 'Hakkımızda' : 'About Us',
                    item: `https://medyapr.com/${locale}/hakkimizda`,
                  },
                ],
              },
              {
                '@type': 'AboutPage',
                name: locale === 'ar' ? 'عن MedyaPR' : locale === 'tr' ? 'MedyaPR Hakkında' : 'About MedyaPR',
                description: isAr
                  ? 'أكثر من 18 عامًا من العلاقات العامة الرقمية وحملات الفيديو الرسمية عبر Google Ads دون انقطاع.'
                  : isTr
                  ? '18 yılı aşkındır kesintisiz dijital medya ve resmi Google Ads klip PR tecrübesi.'
                  : 'Over 18 years of continuous digital PR and official Google Ads video campaigns.',
                mainEntity: {
                  '@type': 'Organization',
                  name: 'MedyaPR',
                  url: 'https://medyapr.com',
                },
              },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#1A1A2E] py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#D9002B] rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-6">{dict.about.title}</h1>
          <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">{dict.about.subtitle}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-sm font-bold text-[#FF0033] mb-8">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Google Ads Partner
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">{dict.about.description}</p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-black text-center text-[#1A1A2E] mb-4">
            {locale === 'ar' ? 'قيمنا' : locale === 'tr' ? 'Değerlerimiz' : 'Our Values'}
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
            {locale === 'ar' ? 'لماذا تختارنا؟' : locale === 'tr' ? 'Neden bizi tercih etmelisiniz?' : 'Why should you choose us?'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#E0002E] to-[#CC0029] rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-[#FF0033]/20">
                  <v.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Çalışma şeklimiz, içerik ilkeleri ve iletişim */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl space-y-14">
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-[#1A1A2E] mb-4">
              {locale === 'ar' ? 'ماذا نفعل' : locale === 'tr' ? 'Ne yapıyoruz?' : 'What we do'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {locale === 'ar'
                ? 'نضع فيديوهات يوتيوب الخاصة بالموسيقيين وشركات الإنتاج والعلامات التجارية أمام المشاهدين المناسبين عبر حملات فيديو رسمية على Google Ads. تُستهدف الحملات حسب الدولة واللغة والاهتمامات ونوع الموسيقى، وتظهر النتائج في YouTube Studio ضمن المصدر "YouTube Ads". كما نرصد فيديوهات الكليب التركية الجديدة وترندات الموسيقى على يوتيوب في Release Radar والمدونة.'
                : locale === 'tr'
                ? 'Müzisyenlerin, yapım şirketlerinin ve markaların YouTube videolarını resmi Google Ads video reklamlarıyla doğru izleyiciyle buluşturuyoruz. Kampanyalar ülke, dil, ilgi alanı ve müzik türüne göre hedeflenir; sonuçlar YouTube Studio\'da "YouTube Reklamları" kaynağı olarak görünür. Ayrıca Türkiye\'de yayınlanan klipleri ve YouTube müzik trendlerini Klip Radarı ve blogumuzda derliyoruz.'
                : 'We put YouTube videos from musicians, labels and brands in front of the right viewers with official Google Ads video campaigns. Campaigns are targeted by country, language, interests and music genre, and results appear in YouTube Studio under the "YouTube Ads" source. We also compile new Turkish music videos and YouTube music trends in our Release Radar and blog.'}
            </p>
          </div>

          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-[#1A1A2E] mb-4">
              {locale === 'ar' ? 'كيف نعمل' : locale === 'tr' ? 'Çalışma ilkelerimiz' : 'How we work'}
            </h2>
            <ul className="space-y-3 text-gray-700 leading-relaxed list-disc pl-5">
              <li>{locale === 'ar' ? 'المراجعة أولًا ثم عرض السعر: نفحص الفيديو الخاص بك ونوضح بصراحة ما يمكن تنفيذه. لا تبدأ أي حملة دون موافقتك.' : locale === 'tr' ? 'Önce analiz, sonra teklif: videonuzu inceler, ne yapılabileceğini net yazarız. Onayınız olmadan kampanya başlamaz.' : 'Review first, then quote: we look at your video and state clearly what can be done. No campaign starts without your approval.'}</li>
              <li>{locale === 'ar' ? 'لا نطلب أبدًا كلمات مرور القناة أو صلاحية الدخول إليها؛ يكفينا رابط فيديو عام.' : locale === 'tr' ? 'Kanal şifresi veya yetki istemeyiz; yalnızca herkese açık video linki gerekir.' : 'We never ask for channel passwords or access; a public video link is all we need.'}</li>
              <li>{locale === 'ar' ? 'لا نستخدم البوتات أو اللوحات أو الحسابات الوهمية. تأتي المشاهدات الإعلانية عبر Google Ads.' : locale === 'tr' ? 'Bot, panel veya sahte hesap kullanmayız. Reklam izlenmeleri Google Ads üzerinden gelir.' : 'We do not use bots, panels or fake accounts. Ad views come through Google Ads.'}</li>
              <li>{locale === 'ar' ? 'لا نعد بما لا نستطيع ضمانه: الإعجابات والتعليقات والمشتركون تعتمد على الاستهداف ولا تُضمن مسبقًا.' : locale === 'tr' ? 'Garanti edemeyeceğimiz sözü vermeyiz: beğeni, yorum ve abone sayıları kampanya hedeflemesine bağlıdır, önceden garanti edilmez.' : 'We do not promise what we cannot guarantee: likes, comments and subscribers depend on targeting and are not guaranteed in advance.'}</li>
              <li>{locale === 'ar' ? 'يُتفق على خطة الدفع عند مرحلة عرض السعر. وإذا لم تتم الموافقة على الإعلان، يُردّ أي مبلغ مدفوع مسبقًا.' : locale === 'tr' ? 'Ödeme planı teklif aşamasında netleştirilir. Reklam onay almazsa ön ödeme iade edilir.' : 'The payment plan is agreed at the quote stage. If the ad is not approved, any prepayment is refunded.'}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-[#1A1A2E] mb-4">
              {locale === 'ar' ? 'كيف يُعدّ محتوى مدونتنا وRelease Radar' : locale === 'tr' ? 'Blog ve Klip Radarı içeriklerimiz nasıl hazırlanır?' : 'How our blog and Release Radar content is made'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              {locale === 'ar'
                ? 'تُراجع تفاصيل ملفات الفنانين، مثل تاريخ الميلاد والاسم الحقيقي، مقارنةً بعدة مصادر موثوقة. تأتي أعداد المشاهدات من يوتيوب وتتغير بمرور الوقت؛ وتعكس الأرقام في الصفحة تاريخ كتابتها. التعليقات في صفحات الفيديو رأي تحريري ولا ترتبط بالفنان أو شركة الإنتاج أو يوتيوب.'
                : locale === 'tr'
                ? 'Sanatçı biyografilerindeki doğum tarihi ve gerçek ad gibi bilgiler birden çok güvenilir kaynakla karşılaştırılarak yazılır. İzlenme sayıları YouTube\'dan alınır ve zamanla değişir; sayfadaki rakamlar yazının hazırlandığı tarihe aittir. Klip sayfalarındaki yorumlar editör görüşüdür ve sanatçı, plak şirketi veya YouTube ile bağlantılı değildir.'
                : 'Details in artist profiles, such as birth date and real name, are checked against several reliable sources. View counts come from YouTube and change over time; figures on a page reflect the date it was written. Commentary on video pages is editorial opinion and is not affiliated with the artist, label or YouTube.'}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {locale === 'ar'
                ? 'إذا أردت أن نصحّح معلومة أو نحذف صفحة، راسلنا؛ نرد خلال 24 ساعة.'
                : locale === 'tr'
                ? 'Bir bilgiyi düzeltmemizi veya bir sayfanın kaldırılmasını isterseniz bize yazın; 24 saat içinde dönüş yapıyoruz.'
                : 'If you would like us to correct a detail or remove a page, write to us; we reply within 24 hours.'}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black text-[#1A1A2E] mb-3">
              {locale === 'ar' ? 'تواصل معنا' : locale === 'tr' ? 'Bize ulaşın' : 'Contact us'}
            </h2>
            <p className="text-gray-600 mb-5">
              {locale === 'ar' ? 'أرسل رابط الفيديو وسنشرح لك ما يمكن تنفيذه عبر مراجعة مجانية.' : locale === 'tr' ? 'Video linkinizi gönderin, ücretsiz analizle ne yapılabileceğini anlatalım.' : 'Send your video link and we will explain what can be done with a free review.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#25D366] px-5 py-3 font-bold text-white hover:brightness-110">WhatsApp</a>
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-sky-600 px-5 py-3 font-bold text-white hover:brightness-110">Telegram</a>
              <a href={`mailto:${PUBLIC_EMAIL}`} className="rounded-xl border border-gray-300 px-5 py-3 font-bold text-[#1A1A2E] hover:bg-gray-50">{PUBLIC_EMAIL}</a>
              <Link href={`/${locale}/order`} className="rounded-xl bg-[#D9002B] px-5 py-3 font-bold text-white hover:brightness-110">{locale === 'ar' ? 'اطلب مراجعة مجانية' : locale === 'tr' ? 'Ücretsiz analiz iste' : 'Request a free review'}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
