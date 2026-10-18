/* eslint-disable @next/next/no-img-element */
/**
 * Ülke bayrağı. Windows emoji bayrakları çizmediği için (iki harf görünür) bayraklar
 * public/flags/<kod>.svg olarak siteden sunulur (country-flag-icons, MIT).
 */
export default function Flag({ code, className = '' }: { code: string; className?: string }) {
  return (
    <img
      src={`/flags/${code.toLowerCase()}.svg`}
      alt=""
      aria-hidden="true"
      width={21}
      height={14}
      loading="lazy"
      className={`inline-block h-[14px] w-[21px] shrink-0 rounded-[2px] object-cover ring-1 ring-black/25 ${className}`}
    />
  );
}
