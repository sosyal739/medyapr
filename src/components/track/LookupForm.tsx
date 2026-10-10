'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function LookupForm({
  locale,
  placeholder,
  cta,
}: {
  locale: string;
  placeholder: string;
  cta: string;
}) {
  const [code, setCode] = useState('');
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const c = code.trim().toUpperCase();
        if (c) router.push(`/${locale}/track/${encodeURIComponent(c)}`);
      }}
      className="flex flex-col sm:flex-row gap-3"
    >
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={placeholder}
        required
        className="flex-1 rounded-xl border border-zinc-700/60 bg-zinc-900/80 px-4 py-3.5 font-mono text-sm text-white placeholder-zinc-500 uppercase outline-none focus:border-[#FF0033] focus:ring-4 focus:ring-[#FF0033]/20 transition"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF0033] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#FF0033]/30 hover:bg-[#E6002E] transition hover:scale-105"
      >
        <Search className="h-4 w-4" />
        {cta}
      </button>
    </form>
  );
}
