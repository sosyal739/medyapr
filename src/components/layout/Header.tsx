'use client';

import { useState, useEffect } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import Link from 'next/link';
import { Menu, X, Globe, Sparkles, BookOpen, Users, Flame, Video } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import ThemeToggle from '@/components/theme/ThemeToggle';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

interface HeaderProps {
  dict: Dictionary;
  locale: string;
}

export default function Header({ dict, locale }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const otherLocale = locale === 'tr' ? 'en' : 'tr';
  const isTr = locale === 'tr';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--header-bg)] backdrop-blur-2xl border-b border-white/15 shadow-2xl shadow-black/40'
            : 'bg-[var(--header-bg)] backdrop-blur-xl border-b border-white/10'
        }`}
      >
        {/* Top accent line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FF0033] to-transparent opacity-80" />

        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Brand Logo */}
            <Link href={`/${locale}`} className="flex items-center" aria-label="MedyaPR">
              <BrandLogo className="h-8 sm:h-9" />
            </Link>

            {/* Desktop Navigation — Tactile 3D Segmented Dock */}
            <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-zinc-900/85 border border-zinc-700/60 shadow-lg backdrop-blur-2xl">
              <Link
                href={`/${locale}`}
                className="px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/90 border border-transparent hover:border-zinc-600/50 shadow-xs hover:-translate-y-0.5 transition-all duration-200"
              >
                {isTr ? 'Ana Sayfa' : 'Home'}
              </Link>

              <Link
                href={`/${locale}/trendler`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-extrabold text-white bg-gradient-to-r from-red-600 to-rose-600 border border-red-400/40 shadow-md shadow-red-600/25 hover:scale-105 transition-all duration-200"
              >
                <Flame className="h-3.5 w-3.5 text-white animate-pulse" />
                {isTr ? 'Canlı Trendler' : 'Trends'}
              </Link>

              <Link
                href={`/${locale}/yeni-klipler`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/90 border border-transparent hover:border-zinc-600/50 shadow-xs hover:-translate-y-0.5 transition-all duration-200"
              >
                <Video className="h-3.5 w-3.5 text-red-400" />
                {isTr ? 'Yeni Klipler' : 'New Clips'}
              </Link>

              <Link
                href={`/${locale}/sanatcilar`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/90 border border-transparent hover:border-zinc-600/50 shadow-xs hover:-translate-y-0.5 transition-all duration-200"
              >
                <Users className="h-3.5 w-3.5 text-zinc-400" />
                {isTr ? 'Sanatçılar' : 'Artists'}
              </Link>

              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/90 border border-transparent hover:border-zinc-600/50 shadow-xs hover:-translate-y-0.5 transition-all duration-200"
              >
                <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
                {isTr ? 'Müzik Blogu' : 'Blog'}
              </Link>

              <Link
                href={`/${locale}/fiyatlandirma`}
                className="px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/90 border border-transparent hover:border-zinc-600/50 shadow-xs hover:-translate-y-0.5 transition-all duration-200"
              >
                {isTr ? 'Fiyatlar & Hesapla' : 'Pricing & Calculator'}
              </Link>

              <Link
                href={`/${locale}/hizmetler`}
                className="px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/90 border border-transparent hover:border-zinc-600/50 shadow-xs hover:-translate-y-0.5 transition-all duration-200"
              >
                {isTr ? 'Hizmetler' : 'Services'}
              </Link>

              <Link
                href={`/${locale}/sss`}
                className="px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/90 border border-transparent hover:border-zinc-600/50 shadow-xs hover:-translate-y-0.5 transition-all duration-200"
              >
                {isTr ? 'SSS' : 'FAQ'}
              </Link>
            </nav>

            {/* Right CTAs */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Theme Toggle Button (Siyah Oda / Gri Stüdyo) */}
              <ThemeToggle />

              {/* Language Switcher */}
              <LanguageSwitcher currentLocale={locale} />

              {/* Order Tracking */}
              <Link
                href={`/${locale}/track`}
                className="px-3.5 py-1.5 text-xs font-bold text-zinc-200 rounded-xl border border-zinc-700/60 hover:border-zinc-500 hover:bg-white/5 hover:text-white transition-all shadow-xs"
              >
                {isTr ? 'Sipariş Takibi' : 'Track'}
              </Link>

              {/* Order Now CTA */}
              <Link
                href={`/${locale}/order`}
                className="px-4 py-2 text-xs bg-gradient-to-r from-[#E0002E] to-[#CC0029] text-white font-extrabold rounded-xl shadow-lg shadow-[#FF0033]/30 hover:scale-105 transition-all"
              >
                {isTr ? 'Sipariş & Analiz' : 'Order & Audit'}
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle compact />
              <button
                className="lg:hidden p-2 text-white/80 hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-0 right-0 w-80 h-full bg-zinc-950 border-l border-zinc-800 p-6 pt-20 text-white shadow-2xl overflow-y-auto">
            <nav className="flex flex-col gap-3">
              <Link
                href={`/${locale}`}
                className="px-4 py-3 rounded-xl text-base font-semibold text-white/80 hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isTr ? 'Ana Sayfa' : 'Home'}
              </Link>
              <Link
                href={`/${locale}/trendler`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-[#FF5E7E] hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Flame className="h-4 w-4 text-[#FF0033]" />
                {isTr ? 'Canlı Trend Şarkılar' : 'Trending Charts'}
              </Link>
              <Link
                href={`/${locale}/yeni-klipler`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-white/90 hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Video className="h-4 w-4 text-red-400" />
                {isTr ? 'Yeni Klipler' : 'New Clips'}
              </Link>
              <Link
                href={`/${locale}/sanatcilar`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-white/80 hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4 text-white/40" />
                {isTr ? 'Sanatçılar' : 'Artists'}
              </Link>
              <Link
                href={`/${locale}/blog`}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-white/80 hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4 text-white/40" />
                {isTr ? 'Müzik & Büyüme Blogu' : 'Blog'}
              </Link>
              <Link
                href={`/${locale}/fiyatlandirma`}
                className="px-4 py-3 rounded-xl text-base font-semibold text-white/80 hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isTr ? 'Fiyatlar & Hesaplama' : 'Pricing & Calculator'}
              </Link>
              <Link
                href={`/${locale}/hizmetler`}
                className="px-4 py-3 rounded-xl text-base font-semibold text-white/80 hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isTr ? 'Hizmetler & Paketler' : 'Services & Packages'}
              </Link>
              <Link
                href={`/${locale}/sss`}
                className="px-4 py-3 rounded-xl text-base font-semibold text-white/80 hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isTr ? 'SSS' : 'FAQ'}
              </Link>

              <hr className="my-2 border-white/10" />
              <LanguageSwitcher currentLocale={locale} variant="mobile" />

              <Link
                href={`/${locale}/track`}
                className="w-full px-4 py-3 rounded-xl text-center text-sm font-bold border border-white/20 text-white hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isTr ? 'Sipariş Takibi' : 'Track Order'}
              </Link>

              <Link
                href={`/${locale}/order`}
                className="w-full px-4 py-3 rounded-xl text-center text-sm font-extrabold bg-[#D9002B] text-white shadow-lg shadow-[#FF0033]/30"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isTr ? 'Sipariş & Analiz İste' : 'Order & Request Audit'}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
