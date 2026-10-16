'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, Mail, MessageCircle } from 'lucide-react';
import { consultHref, mailtoHref } from '@/lib/contact';
import { trackEvent } from '@/lib/analytics';

interface ArtistClaimBoxProps {
  artistName: string;
  pageUrl: string;
  locale: string;
  /** GA olaylarında hangi sayfa türünden geldiğini ayırmak için */
  source: 'artist_page' | 'bio_post' | 'clip_page';
}

/**
 * Sanatçının/menajerin kendi sayfasını bulup düzeltme isteyebileceği, sayfayı paylaşabileceği
 * ve (isterse) klip tanıtımı için bize yazabileceği kutu. Paylaşım bağlantısı doğal geri bağlantı sağlar.
 */
export default function ArtistClaimBox({ artistName, pageUrl, locale, source }: ArtistClaimBoxProps) {
  const isTr = locale === 'tr';
  const [copied, setCopied] = useState<'link' | 'bio' | null>(null);

  const copy = async (kind: 'link' | 'bio') => {
    const text = kind === 'link' ? pageUrl : `${artistName} · MedyaPR Klip Radarı: ${pageUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // pano erişimi yoksa sessizce geç
    }
    trackEvent('share_page_copy', { source, kind });
  };

  const waMessage = isTr
    ? `Merhaba, ${artistName} sayfanızı gördüm: ${pageUrl}. Klibimizin tanıtımı için bilgi almak istiyoruz.`
    : `Hello, I saw the ${artistName} page: ${pageUrl}. We would like information about promoting our video.`;
  const mailSubject = isTr ? `Sayfa düzeltmesi: ${artistName}` : `Page correction: ${artistName}`;
  const mailBody = isTr
    ? `Merhaba,\n\n${pageUrl} sayfasında şu bilginin düzeltilmesini istiyorum:\n\n`
    : `Hello,\n\nI would like the following detail corrected on ${pageUrl}:\n\n`;

  return (
    <aside className="my-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
      <h2 className="text-lg sm:text-xl font-black text-white">
        {isTr ? 'Bu sayfa sizinle mi ilgili?' : 'Is this page about you?'}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
        {isTr
          ? `${artistName} sizseniz veya yönetiyorsanız, bir bilgi yanlışsa bize yazın, 24 saat içinde düzeltelim. İsterseniz sayfayı kendi biyografinize ekleyebilirsiniz. Yeni klibinizin tanıtımı için de ücretsiz analiz sunuyoruz.`
          : `If you are or manage ${artistName} and a detail is wrong, write to us and we will fix it within 24 hours. You can also add this page to your own bio. We offer a free review for promoting your next video.`}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={mailtoHref(mailSubject, mailBody)}
          onClick={() => trackEvent('claim_correction_click', { source })}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
        >
          <Mail className="h-4 w-4" /> {isTr ? 'Bilgiyi düzelt' : 'Correct a detail'}
        </a>
        <button
          type="button"
          onClick={() => copy('bio')}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
        >
          {copied === 'bio' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied === 'bio' ? (isTr ? 'Kopyalandı' : 'Copied') : isTr ? 'Biyografi bağlantısını kopyala' : 'Copy bio link'}
        </button>
        <a
          href={consultHref(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('claim_promo_click', { source })}
          className="inline-flex items-center gap-2 rounded-xl bg-[#D9002B] px-4 py-2.5 text-sm font-bold text-white hover:brightness-110"
        >
          <MessageCircle className="h-4 w-4" /> {isTr ? 'Klibim için analiz iste' : 'Request a review for my video'}
        </a>
        <Link
          href={`/${locale}/order`}
          className="inline-flex items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-semibold text-zinc-300 underline underline-offset-4 hover:text-white"
        >
          {isTr ? 'Fiyatla birlikte teklif al' : 'Get a quote with pricing'}
        </Link>
      </div>
    </aside>
  );
}
