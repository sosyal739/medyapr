'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search } from 'lucide-react';
import Flag from '@/components/common/Flag';
import { countryName, countryOptions } from '@/lib/countries';

/** "Ülke seç" seçilince açılan, bayraklı ve aranabilir ülke listesi. */
export default function CountryPicker({
  locale,
  country,
  onCountry,
}: {
  locale: string;
  country: string;
  onCountry: (code: string) => void;
}) {
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';
  const options = useMemo(() => countryOptions(locale), [locale]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Üst kartların overflow-hidden'ı listeyi kırpmasın diye liste body'ye taşınır ve konumu düğmeden hesaplanır.
  const [pos, setPos] = useState<{ top: number; left: number; width: number; maxH: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = buttonRef.current?.getBoundingClientRect();
      if (!r) return;
      const below = window.innerHeight - r.bottom - 12;
      const above = r.top - 12;
      const openUp = below < 260 && above > below;
      const maxH = Math.max(180, Math.min(360, openUp ? above : below));
      setPos({ left: r.left, width: r.width, maxH, top: openUp ? r.top - Math.min(maxH, 360) - 4 : r.bottom + 4 });
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const norm = (s: string) => s.toLocaleLowerCase(isAr ? 'ar' : isTr ? 'tr' : 'en').normalize('NFD').replace(/[̀-ͯ]/g, '');
    const q = norm(query.trim());
    return q ? options.filter((o) => norm(o.name).includes(q) || o.code.toLowerCase() === q) : options;
  }, [options, query, isTr]);
  const popular = filtered.filter((o) => o.popular);
  const rest = filtered.filter((o) => !o.popular);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current && !rootRef.current.contains(t) && !popupRef.current?.contains(t)) setOpen(false);
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

  const popupReady = open && !!pos;
  useEffect(() => {
    if (popupReady) inputRef.current?.focus();
  }, [popupReady]);

  const pick = (code: string) => {
    onCountry(code);
    setOpen(false);
    setQuery('');
  };

  const renderRow = (code: string, name: string) => (
    <li key={code} role="option" aria-selected={code === country}>
      <button
        type="button"
        onClick={() => pick(code)}
        className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:bg-white/10 ${code === country ? 'bg-[#FF0033]/15 text-white' : 'text-zinc-200'}`}
      >
        <Flag code={code} />
        <span className="flex-1 truncate">{name}</span>
        {code === country && <Check className="h-4 w-4 text-[#FF5E7E]" />}
      </button>
    </li>
  );

  return (
    <div ref={rootRef} className="relative mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
      <span className="mb-1.5 block text-xs font-semibold text-white/85">{isAr ? 'الدولة المستهدفة' : isTr ? 'Hedef ülke' : 'Target country'}</span>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 rounded-xl border border-zinc-700/60 bg-zinc-900/80 px-3 py-2.5 text-left text-sm text-white outline-none transition hover:border-zinc-500 focus:border-[#FF0033]"
      >
        <Flag code={country} />
        <span className="flex-1 truncate font-semibold">{countryName(country, locale)}</span>
        <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && pos && typeof document !== 'undefined' && createPortal(
        <div
          ref={popupRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width }}
          className="z-[100] overflow-hidden rounded-xl border border-white/15 bg-zinc-950 shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن دولة…' : isTr ? 'Ülke ara…' : 'Search country…'}
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
              aria-label={isAr ? 'ابحث عن دولة' : isTr ? 'Ülke ara' : 'Search country'}
            />
          </div>
          <ul role="listbox" style={{ maxHeight: pos.maxH - 48 }} className="overflow-y-auto py-1">
            {popular.length > 0 && !query && (
              <li className="px-3 pb-1 pt-2 text-[11px] font-bold text-zinc-500">{isAr ? 'الأكثر شيوعًا' : isTr ? 'Sık seçilenler' : 'Popular'}</li>
            )}
            {popular.map((o) => renderRow(o.code, o.name))}
            {rest.length > 0 && !query && (
              <li className="px-3 pb-1 pt-3 text-[11px] font-bold text-zinc-500">{isAr ? 'كل الدول' : isTr ? 'Tüm ülkeler' : 'All countries'}</li>
            )}
            {rest.map((o) => renderRow(o.code, o.name))}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-zinc-500">{isAr ? 'لم يتم العثور على دولة' : isTr ? 'Ülke bulunamadı' : 'No country found'}</li>
            )}
          </ul>
        </div>,
        document.body,
      )}
    </div>
  );
}
