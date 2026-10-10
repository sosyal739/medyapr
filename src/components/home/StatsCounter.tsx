'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * StatsCounter — Animated statistics counter section.
 *
 * 4 stats with numbers that count up from 0 when scrolled into view
 * (IntersectionObserver). Red gradient background, white text, icon above each stat.
 */

interface StatsCounterProps {
  dict: any;
}

interface StatConfig {
  label: string;
  value: number;
  suffix: string;
  prefix: string;
  decimals: number;
}

export default function StatsCounter({ dict }: StatsCounterProps) {
  const t = dict?.stats ?? {};

  const stats: StatConfig[] = t.items ?? [
    { label: 'Toplam İzlenme', value: 2.5, suffix: 'M+', prefix: '', decimals: 1 },
    { label: 'Mutlu Müşteri', value: 500, suffix: '+', prefix: '', decimals: 0 },
    { label: 'Kampanya', value: 1000, suffix: '+', prefix: '', decimals: 0 },
    { label: 'Müşteri Puanı', value: 4.9, suffix: '/5', prefix: '', decimals: 1 },
  ];

  const icons = [
    /* Eye */
    <svg key="eye" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    /* Users */
    <svg key="users" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    /* Rocket */
    <svg key="rocket" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>,
    /* Star */
    <svg key="star" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>,
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<number[]>(stats.map(() => 0));

  const animateCounts = useCallback(() => {
    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(2, -10 * progress);

      setCounts(stats.map((s) => {
        const val = eased * s.value;
        return s.decimals > 0
          ? parseFloat(val.toFixed(s.decimals))
          : Math.floor(val);
      }));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [stats]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounts();
        }
      },
      { threshold: 0.3 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasAnimated, animateCounts]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-r from-[#FF0033] via-[#CC0029] to-[#FF0033] py-16 md:py-20"
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/5" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4 md:gap-6 md:px-8 lg:px-12">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
              {icons[i % icons.length]}
            </div>
            <span className="mb-1 text-3xl font-extrabold text-white tabular-nums sm:text-4xl">
              {stat.prefix}
              {stat.decimals > 0
                ? counts[i].toFixed(stat.decimals)
                : counts[i].toLocaleString('tr-TR')}
              {stat.suffix}
            </span>
            <span className="text-sm font-medium text-white/80">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
