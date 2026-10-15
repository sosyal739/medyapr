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

  const title = isTr
    ? 'Müzik Klibi Dijital PR & Lansman Ajansı | MedyaPR'
    : 'Music Video Digital PR & Launch Agency | MedyaPR';

  const description = isTr
    ? 'Sanatçılar, müzik grupları ve yapım şirketleri için hedef kitle odaklı müzik klibi dijital PR, medya planlama ve lansman yönetimi. Ücretsiz analiz isteyin.'
    : 'Audience-targeted music video digital PR, media planning, and launch management for independent artists and record labels. Request a free video audit.';

  return {
    title: { absolute: title },
    description,
    // Paid-media dedicated landing page: noindex prevents organic keyword cannibalization
    // while AdsBot-Google evaluates full 10/10 landing page quality and policy compliance.
    robots: {
      index: false,
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

  const faqs = isTr
    ? [
        {
          q: 'Klip PR ve medya planlama çalışması için kanal şifresi gerekiyor mu?',
          a: 'Hayır. MedyaPR üzerinden yürütülen hiçbir medya planlama ve tanıtım çalışmasında kanal şifresi veya hesap yetkisi talep edilmez. Yalnızca yayınlanmış video bağlantınız (veya yayın öncesi lansman bilginiz) yeterlidir.',
        },
        {
          q: 'Ödeme ve faturalandırma süreci nasıl işliyor?',
          a: 'Sanatçı ve yapımcılar için %100 şeffaf aşamalı model uygulanır: Klibiniz incelenip medya planı ve reklam onayı tamamlandığında bütçenin %50’si, kampanya hedeflenen medya planına ulaşıp tamamlandığında kalan %50’si ödenir.',
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
          q: 'How does the phased 50/50 payment structure work?',
          a: 'Once your music video passes compliance review and your campaign is approved, 50% of the budget is paid. The remaining 50% is paid upon campaign completion.',
        },
        {
          q: 'Do you use bots or artificial engagement panels?',
          a: 'Never. MedyaPR is an independent digital media planning and music PR agency with 18+ years of experience. We strictly adhere to official advertising policies and never offer artificial metric manipulation.',
        },
      ];

  return (
    <div className="min-h-screen bg-app-base text-white py-12 md:py-20 relative overflow-hidden">
      {/* Ambient Studio Lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[480px] w-[850px] rounded-full bg-[#FF0033]/12 blur-[150px]" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10 space-y-16">
        {/* 1. HERO SECTION (100% Agency & Artist Launch Positioning) */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-900/90 px-4 py-1.5 text-xs font-extrabold text-[#FF6B6B] shadow-lg">
            <Award className="h-4 w-4 text-[#FF0033]" />
            <span>
              {isTr
                ? '18+ Yıllık Dijital Medya Deneyimi • Sanatçı & Yapım Şirketlerine Özel Klip PR'
                : '18+ Years Digital Media Track Record • Dedicated Artist & Label Video PR'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            {isTr ? (
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
            {isTr
              ? 'Stüdyoda aylarca emek verdiğiniz şarkınız yanlış kitleler arasında kaybolmasın. Müzik türünüze (Pop, Rap, Rock, Alternatif, Akustik), yaş grubuna ve hedef coğrafyaya göre planlanan kurumsal video medya yönetimiyle klibinizi gerçek müzikseverlere ulaştırıyoruz.'
              : 'Do not let months of studio production go unnoticed. We plan and manage genre-matched, geo-targeted video advertising and digital PR campaigns for independent artists and record labels.'}
          </p>

          {/* Trust Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-bold text-zinc-200">
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-3 py-3">
              <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{isTr ? 'Kanal Şifresi İstenmez' : 'No Password Required'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-3 py-3">
              <Target className="h-4 w-4 text-[#FF6B6B] shrink-0" />
              <span>{isTr ? 'Müzik Türü & Yaş Hedefleme' : 'Genre & Age Targeting'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-3 py-3">
              <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0" />
              <span>{isTr ? '%50 Onayda • %50 Bitince' : '50/50 Phased Payment'}</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 px-3 py-3">
              <BarChart3 className="h-4 w-4 text-amber-400 shrink-0" />
              <span>{isTr ? 'Şeffaf Medya Raporlama' : 'Transparent Reporting'}</span>
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
              {isTr ? 'Şeffaf Ajans Süreci' : 'Transparent Agency Workflow'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {isTr ? '3 Adımda Klip Lansman & Medya Yönetimi' : '3-Step Music Video Launch Management'}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0033]/20 text-sm font-black text-[#FF6B6B]">
                01
              </div>
              <h3 className="text-lg font-extrabold text-white">
                {isTr ? 'Ücretsiz Klip & Kitle Analizi' : 'Free Video & Audience Audit'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {isTr
                  ? 'Eserinizin müzik türünü, temposunu ve hedef dinleyici profilini inceliyoruz. Şarkınıza en uygun coğrafi bölgeleri ve ilgi alanı kırılımlarını belirliyoruz.'
                  : 'We evaluate your track genre, tempo, and listener persona to define the highest-affinity geographic and demographic segments.'}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0033]/20 text-sm font-black text-[#FF6B6B]">
                02
              </div>
              <h3 className="text-lg font-extrabold text-white">
                {isTr ? 'Kampanya Kurulumu & %50 Onay Güvencesi' : 'Campaign Setup & 50% Approval Security'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {isTr
                  ? 'Medya planınız hazırlanır ve resmi reklam politikalarına uygun şekilde onaya sunulur. Kampanyanız onaylandığında ilk %50 ödemeniz alınarak yayın başlatılır.'
                  : 'Your media plan is configured and submitted for official ad policy review. Once approved, 50% payment initiates the live campaign.'}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF0033]/20 text-sm font-black text-[#FF6B6B]">
                03
              </div>
              <h3 className="text-lg font-extrabold text-white">
                {isTr ? 'Optimizasyon & Tamamlama Raporu' : 'Optimization & Final Reporting'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {isTr
                  ? 'Yayın süresince bütçeniz en yüksek izleyici ilgisi gösteren kitle segmentlerine göre optimize edilir. Süreç tamamlandığında şeffaf sonuçlarla kalan %50 ödeme tamamlanır.'
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
              {isTr ? 'Müzik Türüne Göre Kitle Planlaması' : 'Genre-Specific Audience Planning'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {isTr
                ? 'Her Müzik Türü İçin Farklı Dinleyici Stratejisi'
                : 'Tailored Listener Targeting Across Every Music Genre'}
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-zinc-950 text-zinc-300 border-b border-white/10">
                  <th className="p-3.5 font-extrabold">{isTr ? 'Müzik Türü' : 'Music Genre'}</th>
                  <th className="p-3.5 font-extrabold">{isTr ? 'Birincil Dinleyici Kitlesi' : 'Primary Listener Segment'}</th>
                  <th className="p-3.5 font-extrabold">{isTr ? 'Önerilen Medya Formatı' : 'Recommended Ad Format'}</th>
                  <th className="p-3.5 font-extrabold">{isTr ? 'Öncelikli Coğrafya' : 'Core Geography'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-zinc-300 bg-zinc-900/50">
                <tr>
                  <td className="p-3.5 font-bold text-white">Hip-Hop / Rap / Trap</td>
                  <td className="p-3.5">16–28 Yaş Şehirli Genç & Rap Dinleyicisi</td>
                  <td className="p-3.5">Atlanabilir Video + Dikey Shorts Akışı</td>
                  <td className="p-3.5">Türkiye + Almanya / Avrupa</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-white">Türkçe Pop & Dans</td>
                  <td className="p-3.5">18–35 Yaş Güncel Hit & Liste Takipçileri</td>
                  <td className="p-3.5">In-Stream Klibin En Güçlü Nakarat Kesiti</td>
                  <td className="p-3.5">Türkiye Geneli + Küresel</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-white">Rock & Alternatif</td>
                  <td className="p-3.5">18–40 Yaş Albüm & Konser Odaklı Dinleyici</td>
                  <td className="p-3.5">Uzun Süreli Tam Klip Gösterimi + Keşfet</td>
                  <td className="p-3.5">Büyükşehir & Üniversite Kentleri</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-white">Akustik / Indie / Vokal</td>
                  <td className="p-3.5">Akustik Seans & Çalma Listesi Dinleyicileri</td>
                  <td className="p-3.5">İlgili Müzik Videoları Yanı Keşfet Yerleşimi</td>
                  <td className="p-3.5">Türkiye & Avrupa Kültür Kitlesi</td>
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
              {isTr ? 'Sanatçı ve Menajerlerin Sıkça Sorduğu Sorular' : 'Frequently Asked Questions for Artists'}
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
              {isTr
                ? 'Kurumsal Şeffaflık, Bağımsız Ajans Beyanı ve Hizmet Politikası'
                : 'Corporate Transparency, Independent Agency Disclosure & Service Policy'}
            </span>
          </div>
          <p className="leading-relaxed">
            {isTr
              ? 'MedyaPR, sanatçılar, müzik yapımcıları ve kurumsal markalar için medya planlama, dijital halkla ilişkiler (PR) ve video reklam yönetimi hizmeti sunan bağımsız bir dijital ajanstır. Sunulan tüm medya planlama hizmetleri resmi reklam politikaları ve platform kullanım koşullarıyla %100 uyumludur; yapay etkileşim, bot veya metrik manipülasyonu hizmeti kesinlikle verilmemektedir. Kampanya bütçe kademeleri medya planlama ve yönetim hizmetini kapsar; erişim ve etkileşim sonuçları eserin müzikal niteliğine, hedef kitle rekabetine ve izleyici ilgisine göre doğal olarak şekillenir.'
              : 'MedyaPR is an independent digital media planning and music PR agency serving artists, producers, and record labels. All campaign management services strictly comply with official advertising policies and platform terms of service. We do not offer artificial engagement, bots, or metric manipulation. Media projections represent estimated advertising reach based on audience targeting parameters.'}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/5 text-zinc-300 font-semibold">
            <Link href={`/${locale}/hakkimizda`} className="hover:text-white underline underline-offset-4">
              {isTr ? 'Hakkımızda' : 'About Us'}
            </Link>
            <Link href={`/${locale}/gizlilik`} className="hover:text-white underline underline-offset-4">
              {isTr ? 'Gizlilik Politikası' : 'Privacy Policy'}
            </Link>
            <Link href={`/${locale}/kullanim-kosullari`} className="hover:text-white underline underline-offset-4">
              {isTr ? 'Kullanım Koşulları' : 'Terms of Service'}
            </Link>
            <Link href={`/${locale}/iade-politikasi`} className="hover:text-white underline underline-offset-4">
              {isTr ? 'İade & Hizmet Koşulları' : 'Refund & Service Policy'}
            </Link>
            <Link href={`/${locale}/iletisim`} className="hover:text-white underline underline-offset-4">
              {isTr ? 'İletişim & Künye' : 'Contact & Imprint'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
