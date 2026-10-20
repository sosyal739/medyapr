'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { locales } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: string;
  className?: string;
  variant?: 'header' | 'mobile' | 'footer';
  /** Arapça blog yazısı slug'ı -> aynı yazının Türkçe slug'ı (yalnızca çevirisi olanlar). */
  arTwins?: Record<string, string>;
}

/** Türkiye / İngilizce dünyasına özgü bölümler: Arapça sürümü yoktur. */
const NO_AR_SECTIONS = new Set(['sanatcilar', 'sanatci', 'klip', 'yeni-klipler']);

/** 9 Ticari Sayfa Arasında 3 Dilli Karşılıklı Eşleşme (404 Önleme) */
const LANDING_TWINS: Record<string, Record<string, string>> = {
  'youtube-klip-tanitimi': { tr: 'youtube-klip-tanitimi', en: 'youtube-music-video-promotion', ar: 'youtube-music-promotion-saudi-arabia' },
  'youtube-music-video-promotion': { tr: 'youtube-klip-tanitimi', en: 'youtube-music-video-promotion', ar: 'youtube-music-promotion-saudi-arabia' },
  'youtube-music-promotion-saudi-arabia': { tr: 'youtube-klip-tanitimi', en: 'youtube-music-video-promotion', ar: 'youtube-music-promotion-saudi-arabia' },

  'sarki-reklami-verme': { tr: 'sarki-reklami-verme', en: 'google-ads-for-music-videos', ar: 'youtube-music-promotion-egypt' },
  'google-ads-for-music-videos': { tr: 'sarki-reklami-verme', en: 'google-ads-for-music-videos', ar: 'youtube-music-promotion-egypt' },
  'youtube-music-promotion-egypt': { tr: 'sarki-reklami-verme', en: 'google-ads-for-music-videos', ar: 'youtube-music-promotion-egypt' },

  'youtube-reklam-fiyatlari': { tr: 'youtube-reklam-fiyatlari', en: 'promote-turkish-music-on-youtube', ar: 'youtube-music-promotion-morocco' },
  'promote-turkish-music-on-youtube': { tr: 'youtube-reklam-fiyatlari', en: 'promote-turkish-music-on-youtube', ar: 'youtube-music-promotion-morocco' },
  'youtube-music-promotion-morocco': { tr: 'youtube-reklam-fiyatlari', en: 'promote-turkish-music-on-youtube', ar: 'youtube-music-promotion-morocco' },
};


/**
 * Dil değiştirince gidilecek yol. Aynı içeriğin olmadığı yerde (yalnızca bir dilde yayınlanan blog yazısı,
 * Arapçası olmayan bölüm) 404 yerine o dilin blog ana sayfasına / ana sayfasına gidilir.
 */
function targetPath(pathname: string, from: string, to: string, arTwins: Record<string, string>): string {
  const rest = pathname.split('/').filter(Boolean).slice(1); // [locale, ...rest] -> rest
  if (rest[0] === 'blog' && rest[1]) {
    const slug = decodeURIComponent(rest[1]);
    if (from === 'ar') {
      const twin = arTwins[slug];
      return twin ? `/${to}/blog/${twin}` : `/${to}/blog`;
    }
    if (to === 'ar') {
      const arSlug = Object.keys(arTwins).find((k) => arTwins[k] === slug);
      return arSlug ? `/ar/blog/${arSlug}` : '/ar/blog';
    }
  }
  // 9 Ticari Açılış Sayfası Arasında Dil Değişimi (404 yerine hedef dildeki ikiz sayfaya git)
  if (rest.length === 1 && LANDING_TWINS[rest[0]]) {
    const twin = LANDING_TWINS[rest[0]];
    const targetSlug = twin[to];
    if (targetSlug) return `/${to}/${targetSlug}`;
  }
  if (to === 'ar' && rest[0] && NO_AR_SECTIONS.has(rest[0])) return '/ar';
  return `/${to}${rest.length ? `/${rest.join('/')}` : ''}`;
}

/** Dillerin kendi alfabesiyle yazılmış adları (menüde her dil kendi adıyla görünür). */
const LANGUAGE_NAMES: Record<string, string> = {
  tr: 'Türkçe',
  en: 'English',
  ar: 'العربية',
};

export default function LanguageSwitcher({ currentLocale, className = '', variant = 'header', arTwins = {} }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const switchTo = (target: string) => {
    setOpen(false);
    if (target === currentLocale) return;
    // Seçilen dili 1 yıl hatırla
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(targetPath(pathname, currentLocale, target, arTwins));
  };

  const label = LANGUAGE_NAMES[currentLocale] ?? currentLocale;
  const ariaLabel = currentLocale === 'ar' ? 'اللغة' : currentLocale === 'tr' ? 'Dil seçimi' : 'Language';

  // Mobil menü: tüm diller alt alta
  if (variant === 'mobile') {
    return (
      <div className={`rounded-xl border border-zinc-700/60 bg-zinc-900/80 p-1.5 ${className}`} role="group" aria-label={ariaLabel}>
        <div className="flex items-center gap-2 px-3 pb-1 pt-2 text-xs font-semibold text-zinc-400">
          <Globe className="h-3.5 w-3.5 text-[#FF0033]" />
          {currentLocale === 'ar' ? 'اللغة' : currentLocale === 'tr' ? 'Dil' : 'Language'}
        </div>
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-current={l === currentLocale}
            lang={l}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition ${l === currentLocale ? 'bg-white/10 text-white' : 'text-zinc-300 hover:bg-white/5'}`}
          >
            {LANGUAGE_NAMES[l] ?? l}
            {l === currentLocale && <Check className="h-4 w-4 text-[#FF5E7E]" />}
          </button>
        ))}
      </div>
    );
  }

  // Masaüstü: açılır menü
  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="group inline-flex items-center gap-1.5 rounded-xl border border-zinc-700/60 px-2.5 py-1.5 text-xs font-bold text-zinc-300 shadow-xs transition-all hover:border-zinc-500 hover:bg-white/10 hover:text-white"
      >
        <Globe className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-[#FF0033]" />
        <span lang={currentLocale}>{label}</span>
        <ChevronDown className={`h-3 w-3 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="menu" className="absolute right-0 top-full z-50 mt-1.5 min-w-[9rem] overflow-hidden rounded-xl border border-white/15 bg-zinc-950 py-1 shadow-2xl">
          {locales.map((l) => (
            <li key={l} role="none">
              <button
                type="button"
                role="menuitem"
                lang={l}
                onClick={() => switchTo(l)}
                className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left text-sm transition hover:bg-white/10 ${l === currentLocale ? 'font-bold text-white' : 'text-zinc-300'}`}
              >
                {LANGUAGE_NAMES[l] ?? l}
                {l === currentLocale && <Check className="h-4 w-4 text-[#FF5E7E]" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
