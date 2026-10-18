'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: string;
  className?: string;
  variant?: 'header' | 'mobile' | 'footer';
  /** Arapça blog yazısı slug'ı -> aynı yazının Türkçe slug'ı (yalnızca çevirisi olanlar). */
  arTwins?: Record<string, string>;
}

/** Türkiye / İngilizce dünyasına özgü bölümler: Arapça sürümü yoktur. */
const NO_AR_SECTIONS = new Set(['sanatcilar', 'sanatci', 'klip', 'yeni-klipler']);

/**
 * Dil değiştirince gidilecek yol. Aynı içeriğin olmadığı yerde (yalnızca bir dilde yayınlanan blog yazısı,
 * Arapçası olmayan bölüm) 404 yerine o dilin blog ana sayfasına / ana sayfasına gidilir.
 */
function targetPath(pathname: string, from: string, to: Locale, arTwins: Record<string, string>): string {
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
  if (to === 'ar' && rest[0] && NO_AR_SECTIONS.has(rest[0])) return '/ar';
  return `/${to}${rest.length ? `/${rest.join('/')}` : ''}`;
}

export default function LanguageSwitcher({
  currentLocale,
  className = '',
  variant = 'header',
  arTwins = {},
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const others = locales.filter((l) => l !== currentLocale);

  const handleSwitch = (target: Locale) => (e: React.MouseEvent) => {
    e.preventDefault();
    // Seçilen dil 1 yıl çerezde saklanır (kök adres için tek yönlendirme).
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; SameSite=Lax`;
    router.push(targetPath(pathname, currentLocale, target, arTwins));
  };

  if (variant === 'mobile') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {others.map((l) => (
          <button
            key={l}
            onClick={handleSwitch(l)}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold text-zinc-200 bg-zinc-900/80 border border-zinc-700/60 hover:bg-zinc-800 transition-all"
            aria-label={`Switch language to ${localeNames[l]}`}
            lang={l}
          >
            <span className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-[#FF0033]" />
              <span>{localeNames[l]}</span>
            </span>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase bg-white/10 text-white">{l}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {others.map((l, i) => (
        <button
          key={l}
          onClick={handleSwitch(l)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-all border border-zinc-700/60 hover:border-zinc-500 shadow-xs group"
          aria-label={`Switch language to ${localeNames[l]}`}
          title={localeNames[l]}
          lang={l}
        >
          {i === 0 && <Globe className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#FF0033] transition-colors" />}
          <span className="uppercase tracking-wider font-extrabold">{l}</span>
        </button>
      ))}
    </div>
  );
}
