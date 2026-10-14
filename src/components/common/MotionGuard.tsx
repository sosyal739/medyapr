'use client';

import { useEffect } from 'react';

/**
 * Sürekli animasyonları (yüzen ışıklar, nabız, parıltı) yalnızca ekranda görünürken oynatır.
 * Ekran dışındaki öğeler duraklatılır; bu ana iş parçacığını ve pili rahatlatır, görünüm değişmez.
 * Kullanıcı "hareketi azalt" demişse CSS (globals.css) zaten tüm animasyonları durdurur.
 */
export default function MotionGuard() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle('anim-paused', !entry.isIntersecting);
        }
      },
      { rootMargin: '120px 0px' },
    );

    const watch = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>('[class*="animate-"]').forEach((el) => io.observe(el));
    };
    watch(document);

    // Sonradan eklenen öğeler (sekme değişimi, istemci bileşenleri) için
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            if (n.className && String(n.className).includes('animate-')) io.observe(n);
            watch(n);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
