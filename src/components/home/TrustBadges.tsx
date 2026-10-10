'use client';

import { ShieldCheck, BarChart2, Zap, Award, Headphones, Users, CheckCircle } from 'lucide-react';

interface TrustBadgesProps {
  dict: any;
}

export default function TrustBadges({ dict }: TrustBadgesProps) {
  const items = [
    { label: 'Sektör Tecrübesi', value: '18+ Yıllık Kesintisiz Hizmet', icon: Award },
    { label: 'Resmi Yetki', value: 'Google İş Ortağı Partner Uzmanları', icon: ShieldCheck },
    { label: 'Referans Ağı', value: 'Türkiye & Dünyada Birçok Sanatçı', icon: Users },
    { label: 'Hedef Kitle', value: 'İlgi Alanı, Dil ve Konum', icon: Zap },
    { label: 'Trafik Güvencesi', value: 'Bot & Panel Kullanılmaz', icon: ShieldCheck },
    { label: 'Trafik Kaynağı', value: 'YouTube Reklamcılığı', icon: BarChart2 },
    { label: 'Kimler İçin?', value: 'Prodüksiyon, Sanatçı & Kurumsal', icon: CheckCircle },
    { label: 'Doğal Etkileşim', value: 'Beğeni, Yorum & Abonelik', icon: Headphones },
  ];

  return (
    <section className="relative overflow-hidden bg-zinc-900/90 border-y border-studio py-5 shadow-inner">
      <div className="flex animate-[marquee_25s_linear_infinite]">
        {[...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex shrink-0 items-center gap-3 px-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#FF4D6D]">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  {item.label}
                </span>
                <span className="text-xs font-bold text-white">{item.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}
