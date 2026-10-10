'use client';

import { useTheme } from './ThemeContext';
import { Moon, Sun, Sparkles } from 'lucide-react';

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme, isBlackRoom } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isBlackRoom ? 'Gri Stüdyo Moduna Geç' : 'Siyah Oda (Gece Modu) Moduna Geç'}
      title={isBlackRoom ? 'Gri Stüdyo Moduna Geç' : 'Siyah Oda (Gece Modu) Moduna Geç'}
      className={`group relative inline-flex items-center gap-2 rounded-xl border transition-all duration-300 shadow-md ${
        isBlackRoom
          ? 'border-red-500/40 bg-zinc-950 px-3.5 py-1.5 text-xs font-bold text-white hover:border-red-400 hover:bg-black shadow-red-500/10'
          : 'border-zinc-600/60 bg-zinc-800/90 px-3.5 py-1.5 text-xs font-bold text-zinc-100 hover:border-zinc-400 hover:bg-zinc-700 shadow-black/20'
      }`}
    >
      {isBlackRoom ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <Moon className="h-3.5 w-3.5 text-red-500" />
          {!compact && (
            <span className="tracking-wide">
              Siyah Oda <span className="text-[10px] text-zinc-400 font-normal">(Gece)</span>
            </span>
          )}
        </>
      ) : (
        <>
          <Sun className="h-3.5 w-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
          {!compact && (
            <span className="tracking-wide text-zinc-200">
              Gri Stüdyo
            </span>
          )}
        </>
      )}
    </button>
  );
}
