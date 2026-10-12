'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Play,
  Pause,
  ShieldCheck,
  Zap,
  Sparkles,
  Flame,
  TrendingUp,
  ThumbsUp,
  Eye,
  MousePointerClick,
  Volume2,
  VolumeX,
  Maximize2,
  Award,
  Users,
  MessageCircle,
} from 'lucide-react';
import { getAppStrings } from '@/lib/i18n/app-strings';
import { consultHref } from '@/lib/contact';

interface HeroSectionProps {
  dict: any;
  locale: string;
}

export default function HeroSection({ dict, locale }: HeroSectionProps) {
  const calcT = getAppStrings(locale).calc;
  const isTr = locale === 'tr';
  // Ses ve Oynatıcı Ref & Durumları
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(47); // Ses süresi ~47 sn
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

  // Ses Çalma / Durdurma Fonksiyonu
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Ses oynatma engellendi:', err);
        });
    }
  };

  // Zaman İlerlemesi Takibi
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (Number.isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  // Ses Bittiğinde Sıfırlama
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Ses Açma / Kapatma (Mute)
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    const next = !isMuted;
    audioRef.current.muted = next;
    setIsMuted(next);
  };

  // Zaman Çubuğuna Tıklayarak İlerleme (Seek)
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * duration;
    audioRef.current.currentTime = newTime;
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
      {/* Gizli HTML5 Audio Elementi */}
      <audio
        ref={audioRef}
        src="/audio/intro-voiceover.mp3"
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={() => {
          if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
          }
        }}
      />

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[550px] w-[550px] rounded-full bg-[#FF0033]/20 blur-[140px] animate-float-drift" />
      <div className="pointer-events-none absolute top-1/4 -right-24 h-[520px] w-[520px] rounded-full bg-zinc-600/15 blur-[150px] animate-glow-soft" />
      <div className="pointer-events-none absolute -bottom-36 left-10 h-[480px] w-[480px] rounded-full bg-red-600/10 blur-[130px] animate-float-reverse" />

      {/* Subtle tech grid mesh */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />

      {/* Floating Animated Badges (Top & Bottom) */}
      <div className="pointer-events-none absolute top-12 left-6 lg:left-24 z-20 hidden md:flex items-center gap-2.5 rounded-2xl border border-zinc-700/60 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-float-slow">
        <Flame className="h-4 w-4 text-[#FF0033] animate-pulse" />
        <span>{isTr ? 'Canlı Algoritma: YouTube Trendleri' : 'Live Algorithm: YouTube Trends'}</span>
        <span className="text-emerald-400 font-semibold">(+490K / 24s)</span>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-6 lg:left-20 z-20 hidden md:flex items-center gap-2.5 rounded-2xl border border-cyan-500/30 bg-zinc-900/90 px-4 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-float-drift">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5FF] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5FF]" />
        </span>
        <span>{isTr ? 'Google Ads Video Altyapısı:' : 'Google Ads Video Infrastructure:'}</span>
        <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-cyan-300 font-extrabold">
          {isTr ? '%100 Gerçek İzleyici' : '100% Real Viewers'}
        </span>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 lg:flex-row lg:items-center lg:gap-12 md:px-8 lg:px-12">
        {/* ── Sol Kolon: Başlık, Açıklama ve CTA ── */}
        <div className="flex flex-1 flex-col gap-6 animate-[fadeInUp_0.7s_ease-out_both]">
          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FF0033]/40 bg-[#FF0033]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5E7E] backdrop-blur-md shadow-lg shadow-[#FF0033]/10">
            <Award className="h-3.5 w-3.5 text-[#FF0033]" />
            {isTr ? '18+ Yıllık Tecrübe • Resmi Google Partner Uzmanları' : '18+ Years Experience • Official Google Partner Specialists'}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl text-white">
            {isTr ? 'Klibinizi' : 'Put Your Video'}{' '}
            <span className="bg-gradient-to-r from-[#FF0033] via-[#FF5E7E] to-[#FF9E79] bg-clip-text text-transparent">
              {isTr ? 'Doğru Kitleye Ulaştırın' : 'In Front of the Right Audience'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {isTr ? (
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

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <a
              href="#calculator"
              className="group relative inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#FF0033] to-[#CC0029] px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-[#FF0033]/35 transition-all duration-300 hover:scale-105 hover:shadow-[#FF0033]/55"
            >
              {isTr ? 'Fiyatı Hesapla & Sipariş Ver' : 'Calculate Price & Order'}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href={consultHref(calcT.consultMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-7 py-4 text-base font-bold text-emerald-300 backdrop-blur-md transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-white shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
              {calcT.consult}
            </a>

            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-[#FF0033]/50 hover:bg-[#FF0033]/15 hover:text-white shadow-lg cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 fill-white text-white" />
                  {isTr ? 'Sesli Anlatımı Durdur' : 'Stop Audio'}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white text-white" />
                  {isTr ? 'Sesli Anlatımı Dinle' : 'Listen to Audio'}
                </>
              )}
            </button>
          </div>

          {/* Süreç & Aşamalı Ödeme Güvencesi */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-3.5 text-xs text-zinc-300 backdrop-blur-md shadow-lg">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Güvenli Süreç:
              </span>
              <span className="text-zinc-200">Video Linki İletilir</span>
              <span className="text-zinc-500">➔</span>
              <span className="text-zinc-200">Google Ads Reklam Onayı</span>
              <span className="text-zinc-500">➔</span>
              <span className="text-emerald-400 font-bold">%50 Onayda, %50 Bitince Ödeme</span>
              <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-300 border border-blue-500/30">
                Kurumsala İş Bitiminde
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-zinc-400">
              * Şifre istenmez • Fiyat videonun uzunluğuna göre esneklik gösterebilir.
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-white/10 text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400 shrink-0" />
              18+ Yıllık Sektör & Video PR Tecrübesi
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              Resmi Google İş Ortağı (Partner) Uzman Yönetimi
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400 shrink-0" />
              Türkiye & Dünyada Birçok Sanatçı Referansı
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              Bot Yok • Çıkışta Detaylı Performans Raporu
            </span>
          </div>
        </div>

        {/* ── Sağ Kolon: Açık Tonlu Modern Sinematik Oynatıcı & Canlı Metrikler ── */}
        <div className="flex flex-1 justify-center animate-[fadeInUp_0.9s_ease-out_0.2s_both] w-full">
          <div className="relative w-full max-w-2xl">
            {/* Ferah Ortam Işıltısı (Luminous Ambient Aura) */}
            <div className="pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-r from-red-500/20 via-pink-400/20 to-sky-400/20 blur-3xl opacity-75" />

            {/* ── Dış Çerçeve (Ultra-Modern Açık Ton / Frosted Glass Shell) ── */}
            <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-b from-white/30 via-white/15 to-white/5 p-2 sm:p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-3xl ring-1 ring-white/50">
              <div className="relative overflow-hidden rounded-[26px] bg-slate-950 shadow-inner">
                {/* Video Ekranı (16:9 Sinematik Yatay) */}
                <div className="relative aspect-[16/10] sm:aspect-video w-full overflow-hidden bg-slate-900 group select-none">
                  {/* Sinematik Müzik Klibi / Sahne Arka Plan Görseli (Aydınlık & Canlı) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85"
                    alt="YouTube Video Tanıtımı"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 contrast-105"
                  />

                  {/* Şeffaf Aydınlık Gradyan (Ferah derinlik) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-900/30 pointer-events-none" />

                  {/* ── Üst Bar: Açık Ton Rozetler & Ekolayzer ── */}
                  <div className="absolute top-3.5 inset-x-3.5 sm:top-4 sm:inset-x-4 flex items-center justify-between z-20">
                    {/* Resmi YouTube Kanalı Açık Rozeti */}
                    <div className="flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-xl px-3.5 py-1.5 border border-white/80 shadow-lg shadow-black/10">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF0033] to-[#FF4D6D] text-[10px] font-black text-white shadow-xs">
                        ▶
                      </div>
                      <span className="text-xs font-black text-zinc-900 tracking-tight">
                        Resmi YouTube Kanalı
                      </span>
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white font-bold">
                        ✓
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold hidden sm:inline">
                        1.2M Abone
                      </span>
                    </div>

                    {/* Canlı Reklam / Ses Yayını Rozeti & Ekolayzer */}
                    <div className="flex items-center gap-2">
                      {isPlaying ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500 text-white px-3 py-1.5 text-[10px] font-black shadow-md shadow-emerald-500/30 animate-pulse">
                          <Volume2 className="h-3 w-3" />
                          SES ÇALIYOR
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF0033] to-[#FF4D6D] text-white px-3 py-1.5 text-[10px] font-black shadow-md shadow-red-500/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                          CANLI REKLAM
                        </div>
                      )}

                      {/* Ses Dalgaları */}
                      <div
                        className="hidden sm:flex items-end gap-1 h-6 px-2.5 py-1 rounded-full bg-white/90 border border-white/80 shadow-md backdrop-blur-md"
                        title="Canlı Ses Akışı"
                      >
                        <div className={`w-1 bg-[#FF0033] rounded-full ${isPlaying ? 'animate-eq-1' : 'h-1.5'}`} />
                        <div className={`w-1 bg-[#FF5E7E] rounded-full ${isPlaying ? 'animate-eq-2' : 'h-2.5'}`} />
                        <div className={`w-1 bg-zinc-900 rounded-full ${isPlaying ? 'animate-eq-3' : 'h-1'}`} />
                        <div className={`w-1 bg-emerald-500 rounded-full ${isPlaying ? 'animate-eq-4' : 'h-2'}`} />
                      </div>
                    </div>
                  </div>

                  {/* ── Video Ortası: Aydınlık & Parlak Play Butonu ── */}
                  <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="pointer-events-auto group/btn relative flex flex-col items-center justify-center gap-2.5 transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer select-none"
                      title={isPlaying ? 'Durdur' : 'Sesli Tanıtımı Başlat'}
                    >
                      <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF0033] via-[#FF2E55] to-[#FF6B6B] text-white shadow-[0_12px_35px_rgba(255,0,51,0.55)] border-4 border-white backdrop-blur-md">
                        {isPlaying ? (
                          <Pause className="h-7 w-7 sm:h-8 sm:w-8 fill-white" />
                        ) : (
                          <Play className="ml-1 h-7 w-7 sm:h-8 sm:w-8 fill-white" />
                        )}
                        {isPlaying && (
                          <span className="absolute -inset-3 rounded-full border-2 border-white/80 animate-ping opacity-75 pointer-events-none" />
                        )}
                      </div>

                      {!isPlaying && (
                        <span className="rounded-full bg-white/95 border border-white px-4 py-1.5 text-[11px] font-black text-zinc-900 shadow-xl shadow-black/15 backdrop-blur-md flex items-center gap-1.5">
                          <Volume2 className="h-3.5 w-3.5 text-[#FF0033]" />
                          Sesli Anlatımı Dinle
                        </span>
                      )}
                    </button>
                  </div>

                  {/* ── YATAY VİDEO ÜZERİNDE AÇIK TONLU MODERN METRİK KARTLARI ── */}

                  {/* 1. KART: CANLI İZLENME (Açık Cam Efekti) */}
                  <div className="absolute top-14 sm:top-16 left-3 sm:left-4 z-20 rounded-2xl border border-white/90 bg-white/92 p-3 sm:p-3.5 backdrop-blur-2xl shadow-xl shadow-black/15 transition-all hover:scale-105 max-w-[195px] sm:max-w-[215px]">
                    <div className="flex items-center justify-between gap-1 text-[10px] font-black uppercase tracking-wider mb-1">
                      <span className="flex items-center gap-1.5 text-emerald-700">
                        <Eye className="h-3.5 w-3.5 text-emerald-600" />
                        Canlı İzlenme
                      </span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="font-[family-name:var(--font-heading)] text-lg sm:text-2xl font-black tabular-nums tracking-tight text-zinc-950">
                        {views.toLocaleString('tr-TR')}
                      </span>
                    </div>

                    {recentViewBurst && (
                      <div
                        key={viewBurstKey}
                        className="mt-1 inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full animate-bounce shadow-xs"
                      >
                        +{recentViewBurst} izlenme 🚀
                      </div>
                    )}
                  </div>

                  {/* 2. KART: REKLAM TIKLAMASI & CTR (Açık Cam Efekti) */}
                  <div className="absolute top-14 sm:top-16 right-3 sm:right-4 z-20 rounded-2xl border border-white/90 bg-white/92 p-3 sm:p-3.5 backdrop-blur-2xl shadow-xl shadow-black/15 transition-all hover:scale-105 max-w-[185px] sm:max-w-[205px] text-right sm:text-left">
                    <div className="flex items-center justify-between sm:justify-start gap-1.5 text-[10px] font-black text-sky-800 uppercase tracking-wider mb-1">
                      <MousePointerClick className="h-3.5 w-3.5 text-sky-600" />
                      <span>Reklam Tıklaması</span>
                    </div>

                    <div className="flex items-baseline justify-end sm:justify-start gap-1.5">
                      <span className="font-[family-name:var(--font-heading)] text-lg sm:text-2xl font-black tabular-nums tracking-tight text-zinc-950">
                        {clicks.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-[10px] font-bold text-sky-600">tık</span>
                    </div>

                    <div className="mt-1 flex items-center justify-end sm:justify-start gap-1.5">
                      <span className="text-[10px] font-black text-sky-800 bg-sky-100/90 border border-sky-300 px-2 py-0.5 rounded-full shadow-xs">
                        %8.6 CTR
                      </span>
                      {recentClickBurst && (
                        <span
                          key={clickBurstKey}
                          className="text-[9px] font-black text-zinc-900 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full animate-pulse shadow-xs"
                        >
                          +{recentClickBurst}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3. KART: ORGANİK BEĞENİ (Açık Cam Efekti) */}
                  <div className="absolute bottom-16 sm:bottom-18 left-3 sm:left-4 z-20 rounded-2xl border border-white/90 bg-white/92 p-2.5 sm:p-3 backdrop-blur-2xl shadow-xl shadow-black/15 transition-all hover:scale-105">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-800 uppercase tracking-wider mb-0.5">
                      <ThumbsUp className="h-3.5 w-3.5 text-rose-600" />
                      <span>Organik Beğeni</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-[family-name:var(--font-heading)] text-base sm:text-xl font-black tabular-nums text-zinc-950">
                        {likes.toLocaleString('tr-TR')}
                      </span>
                      <span
                        key={likeBurstKey}
                        className="text-[10px] font-black text-rose-800 bg-rose-100/90 border border-rose-300 px-1.5 py-0.5 rounded-full shadow-xs"
                      >
                        ❤️ +1
                      </span>
                    </div>
                  </div>

                  {/* 4. KART: ALGORİTMA SKORU (Açık Cam Efekti) */}
                  <div className="absolute bottom-16 sm:bottom-18 right-3 sm:right-4 z-20 rounded-2xl border border-white/90 bg-white/92 p-2.5 sm:p-3 backdrop-blur-2xl shadow-xl shadow-black/15 transition-all hover:scale-105 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-[10px] font-black text-amber-800 uppercase tracking-wider mb-0.5">
                      <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
                      <span>Algoritma Sinyali</span>
                    </div>

                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-[10px] font-bold text-zinc-600">Önerilenler:</span>
                      <span className="font-[family-name:var(--font-heading)] text-base sm:text-lg font-black text-amber-700">
                        %94 Zirve
                      </span>
                    </div>
                  </div>

                  {/* ── Video Alt Kontrol Çubuğu (Açık Tonlu Lüks Scrubber) ── */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/95 via-white/80 to-transparent p-3 sm:p-4 pt-7 z-20 backdrop-blur-xs">
                    <div className="flex items-center justify-between text-[11px] font-medium mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold tracking-tight text-xs sm:text-sm text-zinc-950">
                          MedyaPR — Sesli Tanıtım &amp; Hizmet Kapsamı
                        </span>
                        <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                          4K 60FPS
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-zinc-700 tabular-nums font-mono text-[10px] sm:text-xs font-bold">
                          {formatSec(currentTime)} / {formatSec(duration)}
                        </span>

                        {/* Ses Aç / Kapat Butonu */}
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="p-1 text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer"
                          title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4 text-rose-600" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </button>

                        <Maximize2 className="h-3.5 w-3.5 text-zinc-500 hidden sm:block" />
                      </div>
                    </div>

                    {/* Kırmızı YouTube Zaman İlerleme Çubuğu */}
                    <div
                      onClick={handleSeek}
                      className="relative h-2 w-full rounded-full bg-slate-200/90 overflow-hidden cursor-pointer group/bar shadow-inner"
                      title="İlerletmek için tıkla"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-[#FF0033] via-[#FF4D6D] to-[#FF758F] rounded-full transition-all duration-150 relative"
                        style={{ width: `${progressPercent}%` }}
                      >
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md shadow-red-600/50 scale-100 group-hover/bar:scale-125 transition-transform border border-red-500/30" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Video Altı Ferah Doğrulama Şeridi (Açık Ton, Lüks ve Güven Verici) ── */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 bg-white/95 px-5 py-3.5 text-xs backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-zinc-800">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-zinc-700">
                      Doğrulama: <strong className="text-zinc-950 font-extrabold">YouTube Studio &amp; Analytics</strong> %100 Resmi Reklam Kaynağı
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-xs">
                    <Sparkles className="h-3 w-3 text-emerald-600" />
                    {isPlaying ? 'Sesli Anlatım Yayında 🔊' : 'Canlı Kampanya Monitörü'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
