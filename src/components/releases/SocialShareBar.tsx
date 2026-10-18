'use client';

import { useState } from 'react';
import { Share2, Check, Copy, MessageCircle } from 'lucide-react';

interface SocialShareBarProps {
  title: string;
  artist: string;
  channel: string;
  instagramHandle: string;
  twitterHandle: string;
  slug: string;
  locale: string;
}

export default function SocialShareBar({
  title,
  artist,
  channel,
  instagramHandle,
  twitterHandle,
  slug,
  locale,
}: SocialShareBarProps) {
  const [copiedType, setCopiedType] = useState<'link' | 'instagram' | null>(null);
  const isTr = locale === 'tr';
  const isAr = locale === 'ar';

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/${locale}/klip/${slug}` : `https://medyapr.com/${locale}/klip/${slug}`;

  // Twitter Pre-populated tweet
  const tweetText = `🎬 ${artist} - '${title}' yeni klibi ${channel} kanalında yayında! 🚀 Klip kurgusu ve müzikal analizi MedyaPR'da:\n${shareUrl} ${twitterHandle ? `${twitterHandle}` : ''} #YeniKlip #MüzikPR`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  // Instagram Caption Template
  const instagramCaption = `🎬 YENİ KLİP İNCELEMESİ | ${artist} — ${title}

Bugün ${channel} kanalında yayınlanan yeni tekliyi mercek altına aldık! 
Klibin görsel dili, müzikal aranjmanı ve ilk 24 saat trend analizi web sitemizde yayında.

👉 İncelemenin tamamını okumak ve klibi izlemek için profildeki linke tıklayın! (${shareUrl})

Sanatçı: ${instagramHandle || artist}
Yayıncı: ${channel}

#YeniKlip #TürkçeMüzik #${channel.replace(/\s+/g, '')} #KlipLansman #MedyaPR #MüzikTrendleri`;

  const copyToClipboard = (text: string, type: 'link' | 'instagram') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#16191E]/90 p-5 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-[#FF0033]" />
            <h4 className="text-sm font-bold text-white">
              {isAr ? 'شارك وأشر إلى الفنان' : isTr ? 'Sosyal Medyada Paylaş & Sanatçıyı Etiketle' : 'Share & Tag the Artist'}
            </h4>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isAr
              ? 'شارك وأشر إلى الفنان لتحفيز التفاعل المباشر والزيارات.'
              : isTr
              ? 'Sanatçıyı ve klibi etiketleyerek sosyal medyada paylaşın, sanatçıyla doğrudan etkileşim başlatın.'
              : 'Share and tag the artist to trigger direct engagement and traffic.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Twitter / X */}
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-black border border-white/20 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition"
          >
            <span className="font-bold">𝕏</span>
            <span>{isAr ? 'غرّد' : isTr ? 'Tweetle' : 'Tweet'}</span>
          </a>

          {/* Instagram Caption Copy */}
          <button
            onClick={() => copyToClipboard(instagramCaption, 'instagram')}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
              copiedType === 'instagram'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-pink-500/30 text-pink-200 hover:brightness-110'
            }`}
          >
            {copiedType === 'instagram' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isAr ? 'تم نسخ النص!' : isTr ? 'Instagram Metni Kopyalandı!' : 'Caption Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>{isAr ? 'انسخ نص Instagram' : isTr ? 'Instagram Taslağını Kopyala' : 'Copy IG Caption'}</span>
              </>
            )}
          </button>

          {/* Copy Link */}
          <button
            onClick={() => copyToClipboard(shareUrl, 'link')}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              copiedType === 'link'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
            }`}
          >
            {copiedType === 'link' ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isAr ? 'تم النسخ' : isTr ? 'Link Kopyalandı' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>{isAr ? 'انسخ الرابط' : isTr ? 'Linki Kopyala' : 'Copy Link'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
