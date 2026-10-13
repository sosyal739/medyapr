'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { getFaqs } from '@/data/faqs';

interface FAQSectionProps {
  dict?: Dictionary;
  locale?: string;
}

export default function FAQSection({ dict, locale = 'tr' }: FAQSectionProps) {
  const isTr = locale === 'tr';
  const items = getFaqs(locale);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="relative overflow-hidden bg-studio-gradient border-y border-studio py-24 text-white">
      {/* Ambient Moving Glow */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#FF0033]/15 blur-[130px] animate-pulse-glow" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-violet-600/10 blur-[120px] animate-float-drift" />

      {/* Floating Animated Badge */}
      <div className="pointer-events-none absolute top-12 left-8 lg:left-24 z-20 hidden md:flex items-center gap-2 rounded-2xl border border-zinc-700/60 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-float-slow">
        <HelpCircle className="h-4 w-4 text-[#FF4D6D]" />
        <span>{isTr ? '7/24 Şeffaf Yanıtlar & Destek' : '24/7 Transparent Answers & Support'}</span>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
            <HelpCircle className="h-3.5 w-3.5 text-[#FF0033]" />
            {isTr ? 'Şeffaf Bilgilendirme' : 'FAQ'}
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
            {isTr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-300">
            {isTr
              ? 'Google Ads video kampanyaları ve sipariş süreci hakkında en çok merak edilenler.'
              : 'Everything you need to know about our Google Ads video delivery process.'}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {items.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-studio bg-studio-card backdrop-blur-xl transition hover:border-studio-strong hover:bg-zinc-800/90 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-zinc-100 leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      isOpen
                        ? 'bg-gradient-to-r from-[#E0002E] to-[#CC0029] text-white shadow-md shadow-[#FF0033]/30 rotate-180'
                        : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-white/5 px-6 pt-4 pb-6 animate-fade-in">
                    <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
