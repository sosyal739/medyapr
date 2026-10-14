'use client';

import { useTheme } from './ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { toggleTheme, isLight } = useTheme();
  const label = isLight ? 'Gece Moduna Geç' : 'Gündüz Moduna Geç';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="theme-toggle group relative inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:border-white/40 hover:bg-white/15"
    >
      {isLight ? (
        <>
          <Moon className="h-4 w-4 text-indigo-500" />
          {!compact && <span className="tracking-wide">Gece</span>}
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 text-amber-400 transition-transform group-hover:rotate-45" />
          {!compact && <span className="tracking-wide">Gündüz</span>}
        </>
      )}
    </button>
  );
}
