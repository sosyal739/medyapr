'use client';

import { useMemo } from 'react';
import { countryOptions } from '@/lib/countries';

/** "Diğer ülkeler" seçilince açılan ülke listesi ve Türkçe konuşan kitle seçeneği. */
export default function CountryPicker({
  locale,
  country,
  onCountry,
  turkishOnly,
  onTurkishOnly,
}: {
  locale: string;
  country: string;
  onCountry: (code: string) => void;
  turkishOnly: boolean;
  onTurkishOnly: (v: boolean) => void;
}) {
  const isTr = locale === 'tr';
  const options = useMemo(() => countryOptions(locale), [locale]);
  const popular = options.filter((o) => o.popular);
  const rest = options.filter((o) => !o.popular);

  return (
    <div className="mt-3 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:grid-cols-[1fr_auto] sm:items-center">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-white/85">{isTr ? 'Hedef ülke' : 'Target country'}</span>
        <select
          value={country}
          onChange={(e) => onCountry(e.target.value)}
          className="w-full rounded-xl border border-zinc-700/60 bg-zinc-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-[#FF0033]"
        >
          <optgroup label={isTr ? 'Sık seçilenler' : 'Popular'}>
            {popular.map((o) => (
              <option key={o.code} value={o.code}>{o.name}</option>
            ))}
          </optgroup>
          <optgroup label={isTr ? 'Tüm ülkeler' : 'All countries'}>
            {rest.map((o) => (
              <option key={o.code} value={o.code}>{o.name}</option>
            ))}
          </optgroup>
        </select>
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-200 sm:pt-5">
        <input
          type="checkbox"
          checked={turkishOnly}
          onChange={(e) => onTurkishOnly(e.target.checked)}
          className="h-4 w-4 accent-[#D9002B]"
        />
        {isTr ? 'Sadece Türkçe konuşanlara göster' : 'Show only to Turkish speakers'}
      </label>
    </div>
  );
}
