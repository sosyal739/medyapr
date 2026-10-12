'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, X, Check } from 'lucide-react';

interface CookieConsentProps {
  dict: any;
  locale: string;
}

export default function CookieConsent({ dict, locale }: CookieConsentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const t = dict?.cookie_consent || {
    title: locale === 'tr' ? 'Çerez ve Gizlilik Tercihleri' : 'Cookie & Privacy Preferences',
    description:
      locale === 'tr'
        ? 'MedyaPR olarak, sitemizde güvenli bir deneyim sunmak, resmi Google Ads reklam performansını analiz etmek ve ziyaretçi trafiğini ölçümlemek için KVKK ve GDPR standartlarına tam uyumlu çerezler kullanıyoruz.'
        : 'At MedyaPR, we use cookies fully compliant with GDPR and KVKK regulations to ensure browsing security, analyze official Google Ads performance, and measure visitor traffic.',
    badge: locale === 'tr' ? 'KVKK & GDPR Güvencesi' : 'GDPR & KVKK Compliant',
    accept_all: locale === 'tr' ? 'Tümünü Kabul Et' : 'Accept All',
    necessary_only: locale === 'tr' ? 'Sadece Zorunlu' : 'Necessary Only',
    decline: locale === 'tr' ? 'Reddet' : 'Decline',
    privacy_policy: locale === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy',
    cookie_settings: locale === 'tr' ? 'Çerez Ayarları' : 'Cookie Settings',
  };

  useEffect(() => {
    setMounted(true);

    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const stored = localStorage.getItem('medyapr_cookie_consent');
      if (!stored) {
        // Small delay so page renders first without abrupt flash
        timer = setTimeout(() => setIsOpen(true), 1500);
      }
    } catch {
      // Fallback if localStorage is restricted
      setIsOpen(false);
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-cookie-settings', handleOpen);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('open-cookie-settings', handleOpen);
    };
  }, []);

  const saveConsent = (type: 'all' | 'necessary' | 'declined') => {
    const payload = {
      consent: type,
      necessary: true,
      analytics: type === 'all',
      marketing: type === 'all',
      declined: type === 'declined',
      timestamp: Date.now(),
    };

    try {
      localStorage.setItem('medyapr_cookie_consent', JSON.stringify(payload));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Set cookie for 1 year
    document.cookie = `medyapr_cookie_consent=${type}; path=/; max-age=31536000; SameSite=Lax`;
    // Also synchronize current locale in cookie
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;

    // Dynamic Google Consent Mode v2 sync
    if (typeof window !== 'undefined' && (window as any).gtag) {
      if (type === 'all') {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      } else {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    }

    setIsOpen(false);
  };

  if (!mounted || !isOpen) return null;

  return (
    <aside
      aria-label={t.title}
      role="dialog"
      aria-modal="false"
      className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-4 md:right-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative rounded-2xl bg-zinc-950/95 border border-zinc-800/80 p-4 shadow-2xl shadow-black/80 backdrop-blur-2xl ring-1 ring-white/10">
        {/* Glow accent */}
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#FF0033]/80 to-transparent" />

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF0033]/15 border border-[#FF0033]/30 flex items-center justify-center text-[#FF0033] shrink-0">
              <Cookie className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">{t.title}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="h-3 w-3" />
                  {t.badge}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Kapat"
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Description & Privacy Link */}
        <p className="text-xs text-zinc-300 leading-relaxed mb-4">
          {t.description}{' '}
          <Link
            href={`/${locale}/gizlilik`}
            className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors font-medium"
          >
            {t.privacy_policy}
          </Link>
          .
        </p>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1 border-t border-zinc-800/60">
          <button
            onClick={() => saveConsent('declined')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 transition-all text-center"
          >
            {t.decline}
          </button>

          <button
            onClick={() => saveConsent('necessary')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 transition-all text-center"
          >
            {t.necessary_only}
          </button>

          <button
            onClick={() => saveConsent('all')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF0033] to-[#CC0029] hover:from-red-500 hover:to-red-700 shadow-md shadow-[#FF0033]/25 hover:shadow-[#FF0033]/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
          >
            <Check className="h-3.5 w-3.5" />
            {t.accept_all}
          </button>
        </div>
      </div>
    </aside>
  );
}
