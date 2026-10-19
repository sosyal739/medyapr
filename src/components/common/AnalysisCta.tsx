import { ArrowRight, Play } from 'lucide-react';

/**
 * "Klibiniz için ücretsiz analiz" kutusu. Düz GET formu: link /order sayfasına `video` parametresiyle gider,
 * sihirbaz videoyu otomatik bulur. Sunucu bileşeni; JS gerektirmez.
 */
export default function AnalysisCta({ locale, source = 'cta' }: { locale: string; source?: string }) {
  const isTr = locale === 'tr';
  const isAr = locale === 'ar';
  return (
    <section
      aria-label={isAr ? 'تحليل مجاني' : isTr ? 'Ücretsiz analiz' : 'Free video analysis'}
      className="my-10 rounded-3xl border-2 border-[#FF0033]/50 bg-gradient-to-br from-[#FF0033]/10 via-white/[0.03] to-transparent p-5 sm:p-7"
    >
      <p className="text-xs font-extrabold uppercase tracking-wider text-[#FF6B6B]">
        {isAr ? 'تحليل مجاني — خلال ثوانٍ' : isTr ? 'Ücretsiz analiz — saniyeler içinde' : 'Free analysis — in seconds'}
      </p>
      <h2 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
        {isAr
          ? 'الصق رابط فيديوك لنحلله ونرسل لك عرضًا تقديريًا'
          : isTr
            ? 'Klibinizin linkini yapıştırın, analiz edip tahmini teklif verelim'
            : 'Paste your video link and get an analysis and estimated quote'}
      </h2>
      <form action={`/${locale}/order`} method="get" className="mt-4 rounded-2xl border border-white/15 bg-black/20 p-2 sm:flex sm:items-center sm:gap-2">
        <label htmlFor={`cta-video-${source}`} className="sr-only">
          {isAr ? 'رابط فيديو يوتيوب' : isTr ? 'YouTube video linki' : 'YouTube video link'}
        </label>
        <div className="relative flex-1">
          <Play className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 fill-[#FF0033] text-[#FF0033]" />
          <input
            id={`cta-video-${source}`}
            name="video"
            type="url"
            inputMode="url"
            required
            placeholder={isAr ? 'الصق رابط فيديو يوتيوب' : isTr ? 'YouTube video linkinizi yapıştırın' : 'Paste your YouTube video link'}
            className="w-full rounded-xl bg-transparent py-3.5 pl-12 pr-3 text-base text-white placeholder-zinc-400 outline-none"
          />
        </div>
        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-6 py-3.5 text-base font-extrabold text-white shadow-lg shadow-[#FF0033]/30 transition hover:brightness-110 sm:mt-0 sm:w-auto"
        >
          {isAr ? 'حلّل' : isTr ? 'Analiz Et' : 'Analyze'}
          <ArrowRight className="h-5 w-5 rtl:rotate-180" />
        </button>
      </form>
      <p className="mt-3 text-xs text-zinc-400">
        {isAr
          ? 'بلا كلمات مرور • بلا بوتات • الأسعار تقديرية ولا تبدأ الحملة دون موافقتك.'
          : isTr
            ? 'Şifre yok • Bot yok • Fiyatlar tahminidir; onayınız olmadan kampanya başlamaz.'
            : 'No passwords • No bots • Prices are estimates; nothing starts without your approval.'}
      </p>
    </section>
  );
}
