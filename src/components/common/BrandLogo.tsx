/* eslint-disable @next/next/no-img-element */
import './brand-logo.css';

/**
 * MedyaPR logosu. Gece modunda beyaz yazılı, gündüz modunda lacivert yazılı sürüm gösterilir
 * (globals.css .brand-logo-* kuralları). Dosyalar public/ altında, saydam arka planlı webp.
 */
export default function BrandLogo({ className = 'h-8 lg:h-9', alt = 'MedyaPR' }: { className?: string; alt?: string }) {
  return (
    <span className="inline-flex items-center">
      <img src="/logo-medyapr-dark.webp" alt={alt} width={640} height={139} className={`brand-logo-dark w-auto ${className}`} />
      <img src="/logo-medyapr.webp" alt={alt} width={640} height={139} className={`brand-logo-light w-auto ${className}`} aria-hidden="true" />
    </span>
  );
}
