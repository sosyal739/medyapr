'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: string;
  className?: string;
  variant?: 'header' | 'mobile' | 'footer';
}

export default function LanguageSwitcher({
  currentLocale,
  className = '',
  variant = 'header',
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale: Locale = currentLocale === 'tr' ? 'en' : 'tr';
  const targetLabel = otherLocale === 'tr' ? 'Türkçe' : 'English';

  const handleSwitch = (e: React.MouseEvent) => {
    e.preventDefault();

    // 1. Persist chosen locale in cookie for 1 year
    document.cookie = `NEXT_LOCALE=${otherLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // 2. Synchronize route pathname preserving query/subpath
    let newPath = pathname;
    if (pathname.startsWith(`/${currentLocale}/`)) {
      newPath = pathname.replace(`/${currentLocale}/`, `/${otherLocale}/`);
    } else if (pathname === `/${currentLocale}`) {
      newPath = `/${otherLocale}`;
    } else {
      newPath = `/${otherLocale}${pathname}`;
    }

    router.push(newPath);
  };

  if (variant === 'mobile') {
    return (
      <button
        onClick={handleSwitch}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold text-zinc-200 bg-zinc-900/80 border border-zinc-700/60 hover:bg-zinc-800 transition-all ${className}`}
        aria-label={currentLocale === 'tr' ? `Dili ${targetLabel} olarak değiştir` : `Switch language to ${targetLabel}`}
      >
        <span className="flex items-center gap-2.5">
          <Globe className="h-4 w-4 text-[#FF0033]" />
          <span>{currentLocale === 'tr' ? 'Dil Seçimi: English' : 'Language: Türkçe'}</span>
        </span>
        <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase bg-white/10 text-white">
          {otherLocale}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSwitch}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-all border border-zinc-700/60 hover:border-zinc-500 shadow-xs group ${className}`}
      aria-label={`Switch language to ${targetLabel}`}
      title={targetLabel}
    >
      <Globe className="h-3.5 w-3.5 text-zinc-400 group-hover:text-[#FF0033] transition-colors" />
      <span className="uppercase tracking-wider font-extrabold">{otherLocale}</span>
    </button>
  );
}
