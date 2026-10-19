import type { Metadata } from 'next';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { type Locale } from '@/lib/i18n/config';
import { Check, Play, Users, ThumbsUp, MessageCircle, Clock, Zap, ArrowRight, Search, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ locale: string }>;
};

import { getPageAlternates } from '@/lib/seo';
import { getLandingPages } from '@/data/landing';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';

  return {
    title: {
      absolute: isAr
        ? 'خدمات الترويج الموسيقي على يوتيوب وفيديو Google Ads | MedyaPR'
        : isTr
        ? 'Google Ads YouTube İzlenme & Klip PR Hizmetleri | MedyaPR'
        : 'YouTube Music PR & Google Ads Video Services | MedyaPR',
    },
    description: isAr
      ? 'نمِّ قناتك على يوتيوب عبر حملات Google Ads الرسمية In-Stream وShorts والاكتشاف. خبرة تتجاوز 18 عامًا وبدون أي بوتات.'
      : isTr
      ? 'Resmi Google Ads ile YouTube klip tanıtımı, hedefli izlenme, abone ve etkileşim kampanyaları, Shorts reklamları. Şifre istenmez, ücretsiz video analizi.'
      : 'Grow your YouTube channel with official Google Ads In-Stream, Shorts and Discovery campaigns. 18+ years experience and zero bots.',
    alternates: getPageAlternates(locale, '/hizmetler'),
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';

  const iconMap: Record<string, LucideIcon> = {
    play: Play,
    users: Users,
    thumbsUp: ThumbsUp,
    messageCircle: MessageCircle,
    clock: Clock,
    search: Search,
    zap: Zap,
  };

  return (
    <div className="min-h-screen">
      {/* Schema.org Service & BreadcrumbList */}
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
                    name: isAr ? 'الخدمات' : isTr ? 'YouTube Reklam & PR Hizmetleri' : 'Services',
                    item: `https://medyapr.com/${locale}/hizmetler`,
                  },
                ],
              },
              {
                '@type': 'Service',
                name: isAr ? 'خدمات الترويج لفيديو يوتيوب والموسيقى' : isTr ? 'YouTube Klip PR ve Google Ads Video Reklam Hizmetleri' : 'YouTube Video & Music PR Services',
                provider: {
                  '@type': 'Organization',
                  name: 'MedyaPR',
                  url: 'https://medyapr.com',
                },
                serviceType: isAr ? 'الترويج الموسيقي الرقمي وإدارة إعلانات الفيديو' : isTr ? 'Dijital Müzik PR ve Video Reklam Yönetimi' : 'Digital Music PR and Video Ad Management',
                description: dict.services.subtitle,
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: isAr ? 'كتالوج خدمات MedyaPR على يوتيوب' : isTr ? 'MedyaPR YouTube Hizmet Kataloğu' : 'MedyaPR YouTube Services Catalog',
                  itemListElement: (dict.services?.items || []).map((s) => ({
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: s.title,
                      description: s.description,
                    },
                  })),
                },
              },
            ],
          }),
        }}
      />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#1A1A2E] py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#D9002B] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#FF6B6B] rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
            {dict.services.title}
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto">
            {dict.services.subtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E]">
              {isAr
                ? 'حلول رسمية عبر Google Ads لنمو قناة يوتيوب وفيديو الكليب'
                : isTr
                ? 'Resmi Google Ads ile YouTube Kanal ve Klip Büyütme Çözümleri'
                : 'Official Google Ads YouTube Channel & Music Video Growth Solutions'}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {isAr
                ? 'تعمل جميع الباقات على بنية Google Ads الرسمية 100%، وتُقدَّم تقاريرها بشفافية في YouTube Studio Analytics، ولا تتطلب أي كلمات مرور.'
                : isTr
                ? 'Tüm paketlerimiz %100 resmi Google Ads reklam altyapısıyla çalışır, YouTube Studio Analytics’te şeffafça raporlanır ve kanal şifresi gerektirmez.'
                : 'All packages run on 100% official Google Ads infrastructure, report transparently in YouTube Studio Analytics, and never require passwords.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dict.services.items.map((service, idx: number) => {
              const IconComponent = iconMap[service.icon] || Play;
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                >
                  {/* Badge */}
                  {service.badge && (
                    <span className="absolute top-6 right-6 px-3 py-1 bg-gradient-to-r from-[#FF0033] to-[#FF6B6B] text-white text-xs font-bold rounded-full">
                      {service.badge}
                    </span>
                  )}

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:from-[#FF0033] group-hover:to-[#CC0029] transition-all duration-500">
                    <IconComponent
                      size={28}
                      className="text-[#FF0033] group-hover:text-white transition-colors duration-500"
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#1A1A2E] mb-3 group-hover:text-[#FF0033] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {(service.icon === 'search'
                      ? [isAr ? 'فحص مدة الفيديو' : isTr ? 'Video süresi kontrolü' : 'Video length check', isAr ? 'أهلية Google Ads' : isTr ? 'Google Ads uygunluğu' : 'Google Ads eligibility', isAr ? 'عرض سعر واضح' : isTr ? 'Net teklif' : 'Clear quote']
                      : ['Google Ads', isAr ? 'مشاهدات حقيقية' : isTr ? 'Gerçek İzlenme' : 'Real Views', isAr ? 'جمهور مستهدف' : isTr ? 'Hedefli Kitle' : 'Targeted Audience']
                    ).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check size={14} className="text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Link
                      href={`/${locale}/fiyatlandirma`}
                      className="inline-flex items-center gap-2 text-[#FF0033] font-bold text-sm group-hover:gap-3 transition-all"
                    >
                      {isAr ? 'احسب الأسعار' : isTr ? 'Fiyatları Hesapla' : 'Calculate Pricing'}
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href={`/${locale}/order`}
                      className="text-xs font-semibold text-gray-500 hover:text-[#1A1A2E] underline"
                    >
                      {isAr ? 'اطلب مراجعة' : isTr ? 'Analiz İste' : 'Request Review'}
                    </Link>
                  </div>

                  {/* Hover border accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF0033] to-[#FF6B6B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hizmet ayrıntıları: süreç, kampanya türleri, kapsam dışı olanlar, SSS */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl space-y-16">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E] mb-3">
              {isAr ? 'كيف يعمل ذلك؟' : isTr ? 'Süreç nasıl işliyor?' : 'How does it work?'}
            </h2>
            <p className="text-gray-600 mb-8 max-w-3xl">
              {isAr
                ? 'نراجع الفيديو الخاص بك أولًا، ثم نوضح ما يمكن تنفيذه في عرض سعر واضح. لا تبدأ أي حملة دون موافقتك.'
                : isTr
                ? 'Önce videonuzu inceliyoruz, sonra ne yapılabileceğini net bir teklifle anlatıyoruz. Onayınız olmadan hiçbir kampanya başlamaz.'
                : 'We review your video first, then explain what can be done in a clear quote. No campaign starts without your approval.'}
            </p>
            <ol className="grid gap-5 sm:grid-cols-2">
              {[
                [isAr ? 'أرسل رابط الفيديو' : isTr ? 'Video linkini iletin' : 'Send your video link', isAr ? 'يكفي رابط يوتيوب عام. لا نطلب أبدًا كلمات مرور القناة أو صلاحية الدخول إليها.' : isTr ? 'Yalnızca herkese açık YouTube linki yeterli. Kanal şifresi veya yetki istemiyoruz.' : 'A public YouTube link is enough. We never ask for channel passwords or access.'],
                [isAr ? 'المراجعة وعرض السعر' : isTr ? 'Analiz ve teklif' : 'Review and quote', isAr ? 'نفحص المدة والمحتوى وأهلية Google Ads، ثم نرد عليك عبر WhatsApp أو Telegram أو البريد الإلكتروني مع عرض سعر.' : isTr ? 'Videonun süresini, içeriğini ve Google Ads uygunluğunu inceleyip WhatsApp, Telegram veya e-posta ile teklifle dönüyoruz.' : 'We check length, content and Google Ads eligibility, then reply by WhatsApp, Telegram or email with a quote.'],
                [isAr ? 'موافقة الإعلان وبدء الحملة' : isTr ? 'Reklam onayı ve başlangıç' : 'Ad approval and start', isAr ? 'بعد موافقتك، يُرسل الإعلان إلى Google Ads. وعند اعتماده تبدأ عملية التسليم.' : isTr ? 'Siz onaylayınca reklam Google Ads onayına gönderilir; onay çıkınca yayın başlar.' : 'Once you approve, the ad is submitted to Google Ads. When it is approved, delivery starts.'],
                [isAr ? 'التقرير' : isTr ? 'Raporlama' : 'Reporting', isAr ? 'عند انتهاء الحملة نشارك تقريرًا مبنيًا على بيانات YouTube Studio وGoogle Ads.' : isTr ? 'Kampanya bitince YouTube Studio ve Google Ads verileriyle rapor paylaşılır.' : 'When the campaign ends we share a report based on YouTube Studio and Google Ads data.'],
              ].map(([t, d], i) => (
                <li key={i} className="rounded-2xl border border-gray-100 bg-[#FAFAFA] p-6">
                  <p className="text-sm font-bold text-[#CC0029] mb-1">{isAr ? `الخطوة ${i + 1}` : isTr ? `Adım ${i + 1}` : `Step ${i + 1}`}</p>
                  <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">{t}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{d}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E] mb-3">
              {isAr ? 'ما هي صيغ الإعلانات التي نستخدمها؟' : isTr ? 'Hangi reklam türleri kullanılıyor?' : 'Which ad formats do we use?'}
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                [isAr ? 'إعلان In-Stream قابل للتخطي' : isTr ? 'Atlanabilir In-Stream' : 'Skippable In-Stream', isAr ? 'يُعرض الإعلان قبل الفيديوهات الأخرى أو أثناءها ويمكن تخطيه بعد 5 ثوانٍ. وهو الصيغة الأكثر شيوعًا للترويج لفيديو الكليب.' : isTr ? 'Reklam, diğer videoların başında veya ortasında gösterilir. Kullanıcı 5 saniye sonra atlayabilir. Klip tanıtımında en yaygın kullanılan biçimdir.' : 'The ad plays before or during other videos and can be skipped after 5 seconds. It is the most common format for music video promotion.'],
                [isAr ? 'إعلانات YouTube Shorts' : isTr ? 'YouTube Shorts reklamı' : 'YouTube Shorts ads', isAr ? 'تُعرض الفيديوهات العمودية في خلاصة Shorts. مناسبة للمقاطع التشويقية القصيرة أو لقطة عمودية من كورال أغنيتك.' : isTr ? 'Dikey videolar Shorts akışında gösterilir. Kısa teaser veya nakaratı öne çıkaran dikey klip parçaları için uygundur.' : 'Vertical videos are shown in the Shorts feed. A good fit for short teasers or a vertical cut of your chorus.'],
                [isAr ? 'In-Feed (الاكتشاف)' : isTr ? 'In-Feed (keşif)' : 'In-Feed (discovery)', isAr ? 'يظهر الفيديو الخاص بك في نتائج بحث يوتيوب وبجانب الفيديوهات ذات الصلة؛ ويختار المشاهد النقر والمشاهدة.' : isTr ? 'Videonuz YouTube arama sonuçlarında ve ilgili videoların yanında görünür; izleyici tıklayarak izler.' : 'Your video appears in YouTube search results and next to related videos; viewers choose to click and watch.'],
              ].map(([t, d], i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">{t}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-600 max-w-3xl">
              {isAr
                ? 'يعتمد الاستهداف على الدولة واللغة والاهتمامات ونوع الموسيقى. تظهر المشاهدات الإعلانية في YouTube Studio ضمن مصدر الزيارات "YouTube Ads".'
                : isTr
                ? 'Hedefleme ülke, dil, ilgi alanı ve müzik türüne göre yapılır. Reklam izlenmeleri YouTube Studio\'da "YouTube Reklamları" kaynağı olarak görünür.'
                : 'Targeting is based on country, language, interests and music genre. Ad views appear in YouTube Studio under the "YouTube Ads" traffic source.'}
            </p>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1A2E] mb-3">
              {isAr ? 'ما لا نفعله وما لا يمكننا ضمانه' : isTr ? 'Neleri yapmıyor, neleri garanti etmiyoruz?' : 'What we do not do, and what we cannot guarantee'}
            </h2>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700 leading-relaxed list-disc pl-5">
              <li>{isAr ? 'لا نستخدم البوتات أو اللوحات أو الحسابات الوهمية، ولا نطلب أبدًا كلمات مرور القناة.' : isTr ? 'Bot, panel veya sahte hesap kullanmıyoruz; kanal şifresi istemiyoruz.' : 'We do not use bots, panels or fake accounts, and we never ask for channel passwords.'}</li>
              <li>{isAr ? 'الإعجابات والتعليقات والمشتركون تعتمد على المشاهدين؛ ولا يمكننا ضمان هذه الأرقام مسبقًا. تقدّم باقة التفاعل الاستهداف وإعداد الحملة لتحقيق هذا الهدف.' : isTr ? 'Beğeni, yorum ve abone sayıları reklam görenlerin kendi kararıdır; bu sayıları önceden garanti edemeyiz. Etkileşim paketi bu yönde hedefleme ve kampanya kurgusu sunar.' : 'Likes, comments and subscribers depend on viewers; we cannot guarantee those numbers in advance. The engagement package offers targeting and campaign setup toward that goal.'}</li>
              <li>{isAr ? 'لا تُحتسب المشاهدات الإعلانية المدفوعة ضمن 4,000 ساعة مشاهدة المطلوبة في برنامج شركاء يوتيوب، لذلك لا نبيع ساعات المشاهدة.' : isTr ? 'Ücretli reklam izlenmeleri YouTube İş Ortağı Programı\'nın 4.000 saatlik izlenme şartına sayılmaz. Bu yüzden "izlenme saati" satmıyoruz.' : 'Paid ad views do not count toward the 4,000 watch hours required by the YouTube Partner Program, so we do not sell watch hours.'}</li>
              <li>{isAr ? 'يختلف السعر حسب مدة الفيديو والدولة المستهدفة وصيغة الإعلان؛ ويُحدَّد المبلغ الدقيق في عرض السعر بعد مراجعتنا.' : isTr ? 'Fiyat video süresine, hedef ülkeye ve reklam türüne göre değişebilir; kesin tutar analizden sonra teklifte yazılır.' : 'Pricing varies with video length, target country and ad format; the exact amount is stated in the quote after our review.'}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E] mb-6">
              {isAr ? 'الأسئلة الشائعة' : isTr ? 'Sık sorulan sorular' : 'Frequently asked questions'}
            </h2>
            <div className="divide-y divide-gray-200 rounded-2xl border border-gray-100 bg-[#FAFAFA]">
              {[
                [isAr ? 'ما الفيديوهات التي تعملون معها؟' : isTr ? 'Hangi videolar için hizmet veriyorsunuz?' : 'Which videos do you work with?', isAr ? 'فيديوهات الكليب، وفيديوهات الأغاني، والحفلات المباشرة، وفيديوهات العلامات التجارية. يجب أن يكون الفيديو عامًا أو غير مدرج.' : isTr ? 'Müzik klipleri, şarkı videoları, canlı performanslar ve kurumsal tanıtım videoları. Video herkese açık veya liste dışı olmalı.' : 'Music videos, song videos, live performances and brand videos. The video must be public or unlisted.'],
                [isAr ? 'ما سرعة التسليم؟' : isTr ? 'Teslimat ne kadar sürer?' : 'How fast is delivery?', isAr ? 'تعتمد سرعة التسليم على الفيديو والاستهداف؛ وقد يكتمل أحيانًا خلال يوم واحد. يُذكر الموعد المؤكد في عرض السعر.' : isTr ? 'Teslimat hızı videoya ve hedeflemeye göre değişir; bazen bir gün içinde de tamamlanabilir. Netleşen süre teklifte yazılır.' : 'Delivery speed depends on the video and the targeting; it can sometimes be completed within a single day. The confirmed timing is stated in your quote.'],
                [isAr ? 'ماذا لو لم تتم الموافقة على الإعلان؟' : isTr ? 'Reklam onay almazsa ne olur?' : 'What if the ad is not approved?', isAr ? 'إذا لم تتم الموافقة على الفيديو وفق سياسات Google Ads، فلا تُحتسب أي عمولة أو رسوم ويُردّ أي مبلغ مدفوع مسبقًا. التفاصيل في سياسة الاسترداد.' : isTr ? 'Video Google Ads politikaları nedeniyle onay almazsa komisyon veya işlem ücreti kesilmez, yapılmış ön ödeme iade edilir. Ayrıntılar iade politikasındadır.' : 'If the video is not approved under Google Ads policies, no commission or fee is charged and any prepayment is refunded. Details are in the refund policy.'],
                [isAr ? 'كيف تتم عملية الدفع؟' : isTr ? 'Nasıl ödeme yapılır?' : 'How do payments work?', isAr ? 'لا يوجد دفع إلكتروني على الموقع. يُتفق معك على خطة الدفع بعد موافقتك على عرض السعر.' : isTr ? 'Sitede online ödeme alınmaz. Ödeme planı, teklifi onayladıktan sonra sizinle netleştirilir.' : 'There is no online payment on the site. The payment plan is agreed with you after you approve the quote.'],
              ].map(([q, a], i) => (
                <details key={i} className="group p-5">
                  <summary className="cursor-pointer list-none font-bold text-[#1A1A2E] flex items-center justify-between gap-4">
                    {q}
                    <span className="text-[#CC0029] transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href={`/${locale}/order`} className="inline-flex items-center gap-2 rounded-xl bg-[#D9002B] px-6 py-3 font-bold text-white hover:brightness-110">
                {isAr ? 'اطلب مراجعة مجانية للفيديو' : isTr ? 'Ücretsiz video analizi iste' : 'Request a free video review'}
              </Link>
              <Link href={`/${locale}/fiyatlandirma`} className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-bold text-[#1A1A2E] hover:bg-gray-50">
                {isAr ? 'عرض الأسعار' : isTr ? 'YouTube Reklam Fiyatları' : 'See pricing'}
              </Link>
              <Link href={`/${locale}/klip-pr`} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-bold text-[#CC0029] hover:bg-red-100">
                {isAr ? 'خطة الترويج الرقمي وإطلاق فيديو الكليب' : isTr ? 'Müzik Klibi Dijital PR & Lansman Planlama' : 'Music Video Digital PR & Launch Plan'}
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3 text-xs font-extrabold text-[#1A1A2E]">
              {getLandingPages(locale).map((lp) => (
                <Link
                  key={lp.slug}
                  href={`/${locale}/${lp.slug}`}
                  className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-1.5 text-[#CC0029] hover:bg-red-100 transition"
                >
                  ★ {lp.keyword} →
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs font-bold text-[#CC0029]">
              <Link
                href={isAr ? '/ar/blog/youtube-music-video-promotion-google-ads-guide' : `/${locale}/blog/youtube-klip-tanitimi-google-ads-rehberi`}
                className="hover:underline"
              >
                → {isAr ? 'كيف تروّج لفيديو كليب على يوتيوب' : isTr ? 'YouTube Klip Tanıtımı Nasıl Yapılır? (Resmi Google Ads Rehberi)' : 'How to Promote a Music Video on YouTube'}
              </Link>
              <Link
                href={isAr ? '/ar/blog/youtube-shorts-ads-music-video-demand-gen' : `/${locale}/blog/youtube-shorts-reklami-nasil-verilir-muzik-klibi-demand-gen`}
                className="hover:underline"
              >
                → {isAr ? 'دليل الترويج بإعلانات YouTube Shorts' : isTr ? 'YouTube Shorts Reklam Verme & Demand Gen Rehberi' : 'YouTube Shorts Ad Promotion Guide'}
              </Link>
              <Link
                href={isAr ? '/ar/blog/promote-music-video-youtube-saudi-egypt-morocco-guide' : `/${locale}/blog/youtube-4000-saat-izlenme-suresi-nasil-doldurulur-para-kazanma-rehberi`}
                className="hover:underline"
              >
                → {isAr ? 'دليل ترويج الكليب في السعودية ومصر والمغرب' : isTr ? 'YouTube 4000 Saat İzlenme Süresi Doldurma Rehberi' : 'YouTube 4,000 Watch Hours Guide'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
