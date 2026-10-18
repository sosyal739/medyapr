'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import {
  ArrowRight,
  Play,
  Pause,
  ShieldCheck,
  TrendingUp,
  ThumbsUp,
  Eye,
  MousePointerClick,
  Volume2,
  VolumeX,
  Award,
  Users,
  MessageCircle,
} from 'lucide-react';
import { getAppStrings } from '@/lib/i18n/app-strings';
import { parseYouTubeId } from '@/lib/pricing';
import { consultHref } from '@/lib/contact';

interface HeroSectionProps {
  dict: Dictionary;
  locale: string;
}

export default function HeroSection({ dict, locale }: HeroSectionProps) {
  const calcT = getAppStrings(locale).calc;
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';
  // Video ve Oynatıcı Ref & Durumları
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroFormRef = useRef<HTMLFormElement | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(50.8); // Video & Ses süresi ~50.8 sn
  const [isMuted, setIsMuted] = useState(false);

  // Canlı hareketli metrikler: İzlenme, Tıklama, Beğeni
  const [views, setViews] = useState(250312);
  const [recentViewBurst, setRecentViewBurst] = useState<number | null>(28);
  const [viewBurstKey, setViewBurstKey] = useState(0);

  const [clicks, setClicks] = useState(19420);
  const [recentClickBurst, setRecentClickBurst] = useState<number | null>(4);
  const [clickBurstKey, setClickBurstKey] = useState(0);

  const [likes, setLikes] = useState(18440);
  const [likeBurstKey, setLikeBurstKey] = useState(0);

  // Gerçek zamanlı artan sayaç simülasyonu (2 saniyede bir dinamik artış)
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. İzlenme Patlaması (+15 ile +36 arası)
      const vGain = Math.floor(Math.random() * 22) + 15;
      setViews((prev) => prev + vGain);
      setRecentViewBurst(vGain);
      setViewBurstKey((k) => k + 1);

      // 2. Reklam Tıklaması (+2 ile +6 arası)
      const cGain = Math.floor(Math.random() * 5) + 2;
      setClicks((prev) => prev + cGain);
      setRecentClickBurst(cGain);
      setClickBurstKey((k) => k + 1);

      // 3. Organik Beğeni Artışı (+1 ile +3 arası)
      if (Math.random() > 0.3) {
        setLikes((prev) => prev + Math.floor(Math.random() * 3) + 1);
        setLikeBurstKey((k) => k + 1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Video & Ses Çalma / Durdurma Fonksiyonu
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Video oynatma engellendi:', err);
        });
    }
  };

  // Zaman İlerlemesi Takibi
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (Number.isFinite(videoRef.current.duration) && videoRef.current.duration > 0) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  // Video Bittiğinde Sıfırlama
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Ses Açma / Kapatma (Mute)
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  // Zaman Çubuğuna Tıklayarak İlerleme (Seek)
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Zaman formatı (00:15 / 00:52)
  const formatSec = (sec: number) => {
    if (!Number.isFinite(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // İlerleme yüzdesi
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="relative overflow-hidden bg-studio-gradient min-h-[92vh] flex items-center text-white py-14 md:py-20">

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[550px] w-[550px] rounded-full bg-[#FF0033]/20 blur-[140px] animate-float-drift" />
      <div className="pointer-events-none absolute top-1/4 -right-24 h-[520px] w-[520px] rounded-full bg-zinc-600/15 blur-[150px] animate-glow-soft" />
      <div className="pointer-events-none absolute -bottom-36 left-10 h-[480px] w-[480px] rounded-full bg-red-600/10 blur-[130px] animate-float-reverse" />

      {/* Subtle tech grid mesh */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />

      {/* Floating Animated Badges (Top & Bottom) */}
            <div className="pointer-events-none absolute bottom-8 left-6 lg:left-20 z-20 hidden md:flex items-center gap-2.5 rounded-2xl border border-cyan-500/30 bg-zinc-900/90 px-4 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-float-drift">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5FF] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5FF]" />
        </span>
        <span>{isAr ? 'بنية فيديو Google Ads:' : isTr ? 'Google Ads Video Altyapısı:' : 'Google Ads Video Infrastructure:'}</span>
        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-cyan-300 font-extrabold">
          {isAr ? 'مشاهدون حقيقيون 100%' : isTr ? '%100 Gerçek İzleyici' : '100% Real Viewers'}
        </span>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 lg:flex-row lg:items-center lg:gap-12 md:px-8 lg:px-12">
        {/* ── Sol Kolon: Başlık, Açıklama ve CTA ── */}
        <div className="flex flex-1 flex-col gap-6 animate-[heroRise_0.5s_ease-out_both]">
          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FF0033]/40 bg-[#FF0033]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E] backdrop-blur-md shadow-lg shadow-[#FF0033]/10">
            <Award className="h-3.5 w-3.5 text-[#FF0033]" />
            {isAr ? 'خبرة تتجاوز 18 عامًا • خبراء Google Partner رسميون' : isTr ? '18+ Yıllık Tecrübe • Resmi Google Partner Uzmanları' : '18+ Years Experience • Official Google Partner Specialists'}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl text-white">
            <span className="block text-sm sm:text-base font-extrabold uppercase tracking-wider text-zinc-300 mb-2">
              {isAr ? 'ترويج فيديو كليب على يوتيوب وإعلانات Google Ads الرسمية' : isTr ? 'YouTube Klip Tanıtımı & Resmi Google Ads Video Reklam' : 'YouTube Music Video Promotion & Official Google Ads PR'}
            </span>
            {isAr ? 'اجعل كليبك' : isTr ? 'Klibinizi' : 'Put Your Video'}{' '}
            <span className="bg-gradient-to-r from-[#FF0033] via-[#FF5E7E] to-[#FF9E79] bg-clip-text text-transparent">
              {isAr ? 'أمام الجمهور المناسب' : isTr ? 'Doğru Kitleye Ulaştırın' : 'In Front of the Right Audience'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {isAr
              ? (
              <>
                <strong className="text-white font-semibold">18 عامًا في هذا المجال.</strong> يتولى حملتك الترويجية{' '}
                <strong className="text-white font-semibold">خبراء Google Partner المعتمدون</strong>. بلا بوتات أو لوحات؛ وتظهر الزيارات في YouTube Analytics باسم{' '}
                <strong className="text-white font-semibold">«إعلانات يوتيوب»</strong>.
              </>
            )
              : isTr ? (
              <>
                <strong className="text-white font-semibold">18 yıldır sektördeyiz.</strong> Klip tanıtımınız sertifikalı{' '}
                <strong className="text-white font-semibold">Google Partner uzmanlarımızca</strong> yönetilir. Bot veya panel yok; trafik YouTube Analytics&apos;te{' '}
                <strong className="text-white font-semibold">&ldquo;YouTube Reklamları&rdquo;</strong> olarak görünür.
              </>
            ) : (
              <>
                <strong className="text-white font-semibold">18 years in the industry.</strong> Your promotion is run by certified{' '}
                <strong className="text-white font-semibold">Google Partner specialists</strong>. No bots or panels; traffic shows up in YouTube Analytics as{' '}
                <strong className="text-white font-semibold">&ldquo;YouTube Ads&rdquo;</strong>.
              </>
            )}
          </p>

          {/* Birincil eylem: link yapıştır → sipariş sihirbazı (JS olmadan da çalışan düz form) */}
          <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[#FF0033]/40 bg-[#FF0033]/15 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="hero-cta-ping absolute inline-flex h-full w-full rounded-full bg-[#FF0033]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF0033]" />
            </span>
            {isAr ? 'تحليل مجاني لفيديوك — ثوانٍ فقط' : isTr ? 'Ücretsiz video analizi — saniyeler içinde' : 'Free video analysis — in seconds'}
          </div>
          <form ref={heroFormRef} action={`/${locale}/order`} method="get" className="hero-cta-glow -mt-2 rounded-3xl border-2 border-[#FF0033]/60 bg-white/[0.08] p-2.5 backdrop-blur-md sm:flex sm:items-center sm:gap-2">
            <label htmlFor="hero-video" className="sr-only">{isAr ? 'رابط فيديو يوتيوب' : isTr ? 'YouTube video linki' : 'YouTube video link'}</label>
            <div className="relative flex-1">
              <Play className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 fill-[#FF0033] text-[#FF0033]" />
              <input
                id="hero-video"
                name="video"
                type="url"
                inputMode="url"
                required
                onChange={(e) => {
                  if (!parseYouTubeId(e.target.value.trim())) return;
                  setAnalyzing(true);
                  heroFormRef.current?.requestSubmit();
                }}
                placeholder={isAr ? 'الصق رابط فيديو يوتيوب' : isTr ? 'YouTube video linkinizi yapıştırın' : 'Paste your YouTube video link'}
                className="w-full rounded-2xl bg-transparent py-5 pl-14 pr-4 text-base font-medium text-white placeholder-zinc-300 outline-none sm:text-lg"
              />
            </div>
            <button
              type="submit"
              className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] px-7 py-4 text-base font-extrabold text-white shadow-xl shadow-[#FF0033]/35 transition-all hover:brightness-110 sm:mt-0 sm:w-auto"
            >
              {analyzing ? (isAr ? 'جارٍ التحليل…' : isTr ? 'Analiz ediliyor…' : 'Analyzing…') : isAr ? 'حلّل' : isTr ? 'Analiz Et' : 'Analyze'}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
          <div className="-mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-sm">
            <span className="text-zinc-400">{isAr ? 'نجد الفيديو ونعرض مشاهداته، وأنت تختار الباقة.' : isTr ? 'Videonuzu bulalım, izlenmesini görün, paketinizi seçin.' : 'We find your video, show its views, you pick a package.'}</span>
            <a href="#calculator" className="font-semibold text-white underline decoration-[#FF0033]/60 underline-offset-4 hover:text-[#FF6B6B]">
              {isAr ? 'اطّلع على الأسعار أولًا' : isTr ? 'Önce fiyatlara bak' : 'See prices first'}
            </a>
            <a href={consultHref(calcT.consultMsg)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-emerald-300 hover:text-white">
              <MessageCircle className="h-4 w-4" /> {calcT.consult}
            </a>
          </div>

          {/* Süreç */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-3.5 text-xs text-zinc-300 backdrop-blur-md shadow-lg">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {isAr ? 'مراحل آمنة:' : isTr ? 'Güvenli Süreç:' : 'Safe Workflow:'}
              </span>
              <span className="text-zinc-200">{isAr ? 'أرسل رابط الفيديو' : isTr ? 'Video Linki İletilir' : 'Submit Video Link'}</span>
              <span className="text-zinc-500">➔</span>
              <span className="text-zinc-200">{isAr ? 'موافقة Google Ads' : isTr ? 'Google Ads Reklam Onayı' : 'Google Ads Approval'}</span>
              <span className="text-zinc-500">➔</span>
              <span className="text-emerald-400 font-bold">{isAr ? 'مراجعة وعرض سعر' : isTr ? 'Analiz & Teklif' : 'Review & Quote'}</span>
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-400">
              {isAr
                ? '* لا حاجة لكلمات المرور • قد تتغير الأسعار حسب مدة الفيديو.'
                : isTr
                ? '* Şifre istenmez • Fiyat videonun uzunluğuna göre esneklik gösterebilir.'
                : '* Zero passwords required • Rates may adjust according to video length.'}
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-white/10 text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400 shrink-0" />
              {isAr ? 'خبرة تتجاوز 18 عامًا في الترويج للفيديو والصناعة الموسيقية' : isTr ? '18+ Yıllık Sektör & Video PR Tecrübesi' : '18+ Years Video PR & Music Industry Experience'}
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              {isAr ? 'إدارة بواسطة خبراء Google Partner رسميين معتمدين' : isTr ? 'Resmi Google İş Ortağı (Partner) Uzman Yönetimi' : 'Certified Official Google Partner Specialist Operations'}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400 shrink-0" />
              {isAr ? 'يثق بنا كبار الفنانين عالميًا والفنانون المستقلون' : isTr ? 'Türkiye & Dünyada Birçok Sanatçı Referansı' : 'Trusted by Leading Global & Independent Artists'}
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              {isAr ? 'للفنانين المعروفين والشركات: الدفع بعد إتمام العمل (بعد المراجعة)' : isTr ? 'Tanınmış sanatçı ve firmalara iş bitiminde ödeme (onayla)' : 'Pay after completion for established artists & companies (on approval)'}
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              {isAr ? 'بلا بوتات • تقرير أداء شامل بعد الحملة' : isTr ? 'Bot Yok • Çıkışta Detaylı Performans Raporu' : 'Zero Bots • Comprehensive Post-Campaign Performance Report'}
            </span>
          </div>
        </div>

        {/* ── Sağ Kolon: Sesli Tanıtım Oynatıcı + Örnek Kampanya Metrikleri ── */}
        <div className="flex flex-1 justify-center animate-[heroRise_0.6s_ease-out_both] w-full">
          <div className="relative w-full max-w-2xl">
            <div className="pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-r from-red-500/20 via-pink-400/10 to-sky-400/20 blur-3xl opacity-70" />

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/85 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              {/* ── Video alanı: 1080p Tanıtım Filmi Oynatıcı ── */}
              <div
                onClick={togglePlay}
                className="group relative aspect-video w-full select-none overflow-hidden bg-slate-900 cursor-pointer"
              >
                <video
                  ref={videoRef}
                  src="/video/medyapr_tanitim.mp4"
                  poster="/video/poster.webp"
                  preload="none"
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  onLoadedMetadata={() => {
                    if (videoRef.current && Number.isFinite(videoRef.current.duration)) {
                      setDuration(videoRef.current.duration);
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                />
                {!isPlaying && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/40" />
                )}

                {/* Üst: marka + durum */}
                <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-center justify-between gap-2 sm:inset-x-4 sm:top-4">
                  <div className="flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur-md">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D9002B]">
                      <Play className="ml-px h-2.5 w-2.5 fill-white text-white" />
                    </span>
                    {isAr ? 'الفيلم التعريفي لـ MedyaPR' : isTr ? 'MedyaPR Tanıtım Filmi' : 'MedyaPR Commercial Film'}
                  </div>

                  {isPlaying ? (
                    <div className="flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-black text-white shadow-md shadow-emerald-500/30">
                      <span className="flex h-3.5 items-end gap-0.5" aria-hidden="true">
                        <span className="w-0.5 rounded-full bg-white animate-eq-1" />
                        <span className="w-0.5 rounded-full bg-white animate-eq-2" />
                        <span className="w-0.5 rounded-full bg-white animate-eq-3" />
                      </span>
                      {isAr ? 'قيد التشغيل' : isTr ? 'VİDEO OYNUYOR' : 'PLAYING'}
                    </div>
                  ) : (
                    <div className="rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-bold text-white/90 ring-1 ring-white/15 backdrop-blur-md">
                      {isAr ? '00:50 • شاهد' : isTr ? '00:50 • İzleyin' : '00:50 • Watch'}
                    </div>
                  )}
                </div>

                {/* Orta: Sadece video duraklatıldığında veya başlamadığında gösterilir (Oynatırken görünmez) */}
                {!isPlaying && (
                  <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center animate-[fadeIn_0.3s_ease-out]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                      aria-label={isAr ? 'شغّل الفيديو' : isTr ? 'Videoyu başlat' : 'Play video'}
                      className="pointer-events-auto relative flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-[#FF0033] to-[#FF5E7E] text-white shadow-[0_10px_35px_rgba(255,0,51,0.5)] ring-4 ring-white/80 transition-transform duration-300 hover:scale-110 active:scale-95 sm:h-20 sm:w-20"
                    >
                      <Play className="ml-1 h-7 w-7 fill-white sm:h-8 sm:w-8" />
                      <span className="pointer-events-none absolute -inset-3 animate-ping rounded-full border-2 border-white/70 opacity-70" />
                    </button>
                  </div>
                )}

                {/* Alt: başlık, süre, ses, ilerleme (Kontroller) */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute inset-x-0 bottom-0 z-20 px-3 pb-3 pt-8 sm:px-4 sm:pb-4 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 truncate">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="cursor-pointer p-1 text-white/90 transition-colors hover:text-white"
                        aria-label={isPlaying ? (isAr ? 'إيقاف مؤقت' : isTr ? 'Durdur' : 'Pause') : (isAr ? 'تشغيل' : isTr ? 'Oynat' : 'Play')}
                      >
                        {isPlaying ? <Pause className="h-4 w-4 fill-white text-white" /> : <Play className="h-4 w-4 fill-white text-white" />}
                      </button>
                      <span className="truncate text-xs font-extrabold text-white sm:text-sm">
                        {isAr ? 'نطاق الخدمة ونظرة عامة على العملية' : isTr ? 'Hizmet kapsamı ve süreç anlatımı' : 'Service scope and process overview'}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-white/90">
                      <span className="font-mono text-[11px] font-bold tabular-nums">
                        {formatSec(currentTime)} / {formatSec(duration)}
                      </span>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="cursor-pointer p-1 text-white/90 transition-colors hover:text-white"
                        aria-label={isMuted ? (isAr ? 'تشغيل الصوت' : isTr ? 'Sesi aç' : 'Unmute') : (isAr ? 'كتم الصوت' : isTr ? 'Sesi kapat' : 'Mute')}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div
                    onClick={handleSeek}
                    className="group/bar relative h-1.5 w-full cursor-pointer rounded-full bg-white/25 transition-[height] hover:h-2"
                    title={isAr ? 'انقر للتقديم' : isTr ? 'İlerletmek için tıklayın' : 'Click to seek'}
                  >
                    <div className="relative h-full rounded-full bg-gradient-to-r from-[#FF0033] to-[#FF758F] transition-all duration-150" style={{ width: `${progressPercent}%` }}>
                      <span className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-red-500/30 bg-white shadow-md transition-transform group-hover/bar:scale-125" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Örnek kampanya metrikleri: videonun üstünde değil, altında ayrı şerit ── */}
              <div className="border-t border-white/10">
                <div className="flex items-center justify-between px-4 pt-3 sm:px-5">
                  <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    {isAr ? 'لوحة حملة تجريبية' : isTr ? 'Örnek Kampanya Paneli' : 'Sample Campaign Dashboard'}
                  </span>
                  <span className="text-[11px] font-medium text-zinc-500">{isAr ? 'بيانات توضيحية' : isTr ? 'Örnek veri' : 'Illustrative data'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-4 sm:p-4">
                  <Metric
                    icon={<Eye className="h-3.5 w-3.5" />}
                    tone="text-emerald-400"
                    label={isAr ? 'المشاهدات' : isTr ? 'İzlenme' : 'Views'}
                    value={views.toLocaleString(isAr ? 'ar-u-nu-latn-ca-gregory' : isTr ? 'tr-TR' : 'en-US')}
                    delta={recentViewBurst ? `+${recentViewBurst}` : undefined}
                    deltaKey={viewBurstKey}
                  />
                  <Metric
                    icon={<MousePointerClick className="h-3.5 w-3.5" />}
                    tone="text-sky-400"
                    label={isAr ? 'نقرات الإعلان' : isTr ? 'Reklam Tıkı' : 'Ad Clicks'}
                    value={clicks.toLocaleString(isAr ? 'ar-u-nu-latn-ca-gregory' : isTr ? 'tr-TR' : 'en-US')}
                    delta={recentClickBurst ? `+${recentClickBurst}` : undefined}
                    deltaKey={clickBurstKey}
                  />
                  <Metric
                    icon={<ThumbsUp className="h-3.5 w-3.5" />}
                    tone="text-rose-400"
                    label={isAr ? 'الإعجابات' : isTr ? 'Beğeni' : 'Likes'}
                    value={likes.toLocaleString(isAr ? 'ar-u-nu-latn-ca-gregory' : isTr ? 'tr-TR' : 'en-US')}
                    delta="+1"
                    deltaKey={likeBurstKey}
                  />
                  <Metric
                    icon={<TrendingUp className="h-3.5 w-3.5" />}
                    tone="text-amber-400"
                    label={isAr ? 'CTR' : isTr ? 'Tıklama Oranı' : 'CTR'}
                    value="%8.6"
                  />
                </div>
              </div>

              {/* ── Doğrulama şeridi ── */}
              <div className="flex items-center gap-2 border-t border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-zinc-300 sm:px-5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>
                  {isAr
                    ? (
                    <>يظهر الترافيك في <strong className="font-bold text-white">YouTube Studio وAnalytics</strong> باسم «إعلانات يوتيوب».</>
                  )
                    : isTr ? (
                    <>Trafik <strong className="font-bold text-white">YouTube Studio &amp; Analytics</strong>&apos;te &ldquo;YouTube Reklamları&rdquo; olarak görünür.</>
                  ) : (
                    <>Traffic appears in <strong className="font-bold text-white">YouTube Studio &amp; Analytics</strong> as &ldquo;YouTube Ads&rdquo;.</>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon,
  tone,
  label,
  value,
  delta,
  deltaKey,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
  delta?: string;
  deltaKey?: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
      <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${tone}`}>
        {icon}
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="font-[family-name:var(--font-heading)] text-lg font-black tabular-nums tracking-tight text-white sm:text-xl">{value}</span>
        {delta && (
          <span key={deltaKey} className={`text-[11px] font-bold ${tone} animate-[fadeInUp_0.4s_ease-out_both]`}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
