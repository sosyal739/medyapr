'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQSectionProps {
  dict: any;
}

export default function FAQSection({ dict }: FAQSectionProps) {
  const isTr = true;

  const items = [
    {
      question: isTr
        ? 'Süreç nasıl işliyor ve ödeme ne zaman alınır?'
        : 'How does the process work and when is payment collected?',
      answer: isTr
        ? 'Süreç 3 güvenli adımda ilerler: 1) Video linkiniz paylaşılır (şifre veya kanal yetkisi asla istenmez). 2) Ekibimiz videoyu analiz edip resmi Google Ads / YouTube reklam onayına gönderir. 3) Videonuz reklam için onaylanınca ödemenin yarısı (%50), kampanya başarıyla tamamlandığında ise tamamı (%50) alınır. Kurumsal müşteriler ve ajanslar için ödeme doğrudan iş bitiminde alınmaktadır.'
        : 'Three transparent steps: 1) Share your video link (no passwords needed). 2) We analyze and submit to official Google Ads approval. 3) Once approved, 50% is collected; the remaining 50% upon completion. For corporate clients, payment is collected upon job completion.',
    },
    {
      question: isTr
        ? 'Kampanyaları kim yönetiyor ve sektördeki tecrübeniz nedir?'
        : 'Who manages the campaigns and what is your industry experience?',
      answer: isTr
        ? 'MedyaPR olarak 18 yılı aşkındır sektörde kesintisiz hizmet vermekteyiz. Bugüne kadar Türkiye\'de ve dünyanın dört bir yanında sayısız ünlü sanatçı, bağımsız müzisyen, yapım şirketi ve kurumsal marka ile çalıştık. Tüm video ve klip tanıtım işlemleriniz, alanında sertifikalı resmi Google İş Ortağı (Partner) uzmanlarımız tarafından bizzat kurgulanmakta ve yönetilmektedir.'
        : 'With over 18 years of industry experience, MedyaPR has partnered with numerous artists, labels, and corporate brands across Turkey and globally. All campaigns are personally set up and managed by certified official Google Partner specialists.',
    },
    {
      question: isTr
        ? 'Fiyatlar videonun uzunluğuna göre değişiklik gösterir mi?'
        : 'Does the price vary based on video duration?',
      answer: isTr
        ? 'Evet. Sitemizdeki hesaplayıcı tutarları standart video uzunlukları baz alınarak listelenmiştir. Google Ads reklam açık artırma maliyetleri süreye göre değiştiği için nihai fiyat; videonun uzunluğuna, hedef kitle kriterlerine ve seçilen reklam formatına göre esneklik gösterebilir.'
        : 'Yes. The calculator shows base prices for standard lengths. Depending on video duration, targeting depth, and ad format, pricing may vary accordingly.',
    },
    {
      question: isTr
        ? 'İzlenmeler YouTube Studio / Analytics panelimde nasıl görünecek?'
        : 'How will the views appear in YouTube Studio / Analytics?',
      answer: isTr
        ? 'Tüm kampanyalarımız resmi Google Ads video altyapısı üzerinden yürütülür. YouTube Studio panelinize girdiğinizde trafik kaynağınız "YouTube Reklamları" (YouTube Advertising) olarak saniyesi saniyesine ve ülke detaylarıyla şeffafça listelenir.'
        : 'All campaigns run on official Google Ads infrastructure. In YouTube Studio, traffic is officially categorized under "YouTube Advertising".',
    },
    {
      question: isTr
        ? 'Bot veya panel görüntülemesi kullanıyor musunuz?'
        : 'Do you use bots or SMM panels?',
      answer: isTr
        ? 'Kesinlikle hayır. Bot veya panel görüntülemesi asla kullanılmaz. İzlenmeler yalnızca resmi Google Ads üzerinden gelir ve trafik kaynağı YouTube Analytics\'te "YouTube reklamcılığı" olarak görünür. Kanalınız %100 güvendedir.'
        : 'Never. Zero bots or SMM panels. All traffic is delivered via Google Ads and officially verified as "YouTube Advertising".',
    },
    {
      question: isTr
        ? 'Hedef kitle belirleme kriterleri nelerdir?'
        : 'What are the audience targeting criteria?',
      answer: isTr
        ? 'Videonuz Türkiye\'de ve dünyanın farklı ülkelerinde ilgi alanı, dil ve konuma göre belirlenen potansiyel izleyicilere ulaştırılır. Ulaşılacak izleyici ve görüntülenme sayısı reklam bütçesine, hedef kitleye ve video içeriğine göre optimize edilir.'
        : 'Videos reach potential viewers in Turkey and globally, filtered by interest, language, and geography according to budget and content.',
    },
    {
      question: isTr
        ? 'Kampanya sonunda performans raporu paylaşılıyor mu?'
        : 'Is a performance report provided upon completion?',
      answer: isTr
        ? 'Evet. Prodüksiyon şirketleri, sanatçılar ve YouTuber\'lar için sunduğumuz hizmet kapsamında kampanyanız profesyonel şekilde hazırlanır, anlık takip edilir ve çalışma sonunda ayrıntılı performans raporu paylaşılır.'
        : 'Yes. Every campaign is professionally prepared, monitored in real time, and delivered with a comprehensive post-campaign performance report.',
    },
    {
      question: isTr
        ? 'Kanalımın para kazanması (monetizasyon) veya telif durumu etkilenir mi?'
        : 'Does this affect monetization or copyright standing?',
      answer: isTr
        ? 'Kesinlikle olumsuz etkilenmez. Google Ads, YouTube\'un kendi resmi reklam aracı olduğu için %100 güvenlidir ve YouTube Partner Programı (YPP) şartlarına tam uyumludur. Sıfır ban veya ceza riski vardır.'
        : 'Zero penalty risk. Google Ads is YouTube\'s native ad platform and is 100% compliant with YPP.',
    },
    {
      question: isTr
        ? 'İzlenmeler sonradan silinir mi veya düşüş yaşanır mı?'
        : 'Will views drop or get deleted later?',
      answer: isTr
        ? 'Asla düşmez. Bot panelleri sahte trafik gönderdiği için YouTube belirli aralıklarla bunları temizler. Bizim sunduğumuz izlenmeler Google Ads reklam gösterimi olduğu için YouTube tarafından onaylı ve kalıcıdır. Ayrıca gerçek izleyicilerden doğal beğeni, yorum ve kanal aboneliği fırsatı oluşur.'
        : 'Never. Unlike fake bot farms, Google Ads impressions are permanently recognized by YouTube algorithms.',
    },
    {
      question: isTr
        ? 'Ödemeyi nasıl yapabilirim? Kart şart mı?'
        : 'How do I pay? Is a credit card mandatory?',
      answer: isTr
        ? 'Hayır, kredi kartı şart değildir. Siparişinizi oluşturduktan sonra ekranda ve sipariş sayfanızda çıkan IBAN adresimize Havale / EFT / FAST ile ödeme yapabilirsiniz. Videonuz onaylandığında %50, iş bitiminde kalanı ödenir (Kurumsal müşteriler için tüm ödeme iş bitimindedir).'
        : 'No credit card required. You can pay via FAST / Bank Transfer directly. 50% upon approval, 50% upon completion (100% upon completion for corporate clients).',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="relative overflow-hidden bg-studio-gradient border-y border-studio py-24 text-white">
      {/* Ambient Moving Glow */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#FF0033]/15 blur-[130px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-violet-600/10 blur-[120px] animate-float-drift" />

      {/* Floating Animated Badge (Moving Object) */}
      <div className="pointer-events-none absolute top-12 left-8 lg:left-24 z-20 hidden md:flex items-center gap-2 rounded-2xl border border-zinc-700/60 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-float-slow">
        <HelpCircle className="h-4 w-4 text-[#FF4D6D]" />
        <span>7/24 Şeffaf Yanıtlar & Destek</span>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
            <HelpCircle className="h-3.5 w-3.5 text-[#FF0033]" />
            {isTr ? 'Şeffaf Bilgilendirme' : 'FAQ'}
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            {isTr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-300">
            {isTr
              ? 'Google Ads video kampanyaları ve sipariş süreci hakkında en çok merak edilenler.'
              : 'Everything you need to know about our Google Ads video delivery process.'}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {items.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-studio bg-studio-card backdrop-blur-xl transition hover:border-studio-strong hover:bg-zinc-800/90 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.04]"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-white sm:text-lg">
                    {item.question}
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-zinc-700/60 bg-zinc-800/80 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 border-[#FF0033] bg-[#FF0033] text-white shadow-md' : 'text-zinc-400'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>

                {/* Collapsible answer */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? '300px' : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="px-6 pb-6 text-sm leading-relaxed text-zinc-300 sm:text-base border-t border-zinc-800/80 pt-4">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
