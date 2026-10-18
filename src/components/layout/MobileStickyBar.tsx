'use client';

import Link from 'next/link';
import { MessageCircle, Calculator, Send } from 'lucide-react';
import { TELEGRAM_URL } from '@/lib/contact';

interface MobileStickyBarProps {
  locale?: string;
}

export default function MobileStickyBar({ locale = 'tr' }: MobileStickyBarProps) {
  const isTr = locale === 'tr';

  const isAr = locale === 'ar';
  const waText = isTr
    ? encodeURIComponent('Merhaba, YouTube klip tanıtımı ve reklam paketleri hakkında bilgi almak istiyorum.')
    : encodeURIComponent('Hello, I would like to get information about YouTube video PR and ad campaigns.');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-zinc-950/95 border-t border-zinc-800/90 backdrop-blur-xl px-3 py-2.5 shadow-2xl safe-area-bottom">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* WhatsApp Direct Contact Button */}
        <a
          href={`https://wa.me/905312993355?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] min-w-0 py-2.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
          aria-label={isAr ? 'تواصل عبر WhatsApp' : isTr ? 'WhatsApp ile Hemen İletişime Geç' : 'Contact via WhatsApp'}
        >
          <MessageCircle className="h-4 w-4 fill-white" />
          <span>{isAr ? 'WhatsApp' : isTr ? 'WhatsApp Danış' : 'WhatsApp'}</span>
        </a>

        {/* Telegram Direct Contact Button */}
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-950/50 transition-all active:scale-95"
          aria-label={isAr ? 'تواصل عبر Telegram' : isTr ? 'Telegram ile İletişime Geç' : 'Contact via Telegram'}
        >
          <Send className="h-4 w-4" />
          <span className="hidden min-[360px]:inline">Telegram</span>
        </a>

        {/* Instant Pricing Calculator CTA */}
        <Link
          href={`/${locale}/fiyatlandirma`}
          className="flex-1 inline-flex items-center justify-center gap-2 min-h-[44px] min-w-0 py-2.5 px-2.5 rounded-xl bg-gradient-to-r from-[#E0002E] to-[#CC0029] hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-[#FF0033]/30 transition-all active:scale-95"
        >
          <Calculator className="h-4 w-4" />
          <span>{isAr ? 'احصل على عرض سعر' : isTr ? 'Fiyat Hesapla' : 'Get Quote'}</span>
        </Link>
      </div>
    </div>
  );
}
