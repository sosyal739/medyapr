'use client';

/**
 * CTASection — Final call-to-action section.
 *
 * Gradient background (red to dark), large centered title + subtitle.
 * Two buttons: primary (white text on transparent border) and WhatsApp (green).
 * Telegram link. Decorative background elements.
 */

interface CTASectionProps {
  dict: any;
}

export default function CTASection({ dict }: CTASectionProps) {
  const t = dict?.cta ?? {};

  const title = t.title ?? 'YouTube Kanalınızı Büyütmeye Hazır mısınız?';
  const subtitle =
    t.subtitle ??
    'Hemen başlayın ve Google Ads ile gerçek izleyicilere ulaşın. İlk kampanyanıza özel %20 indirim!';
  const primaryBtn = t.primaryButton ?? 'Ücretsiz Başla';
  const whatsappBtn = t.whatsappButton ?? t.whatsapp ?? 'WhatsApp ile Ulaşın';
  const telegramText = t.telegramText ?? t.telegram ?? 'veya Telegram üzerinden yazın';
  const telegramLink = t.telegramLink ?? '#';
  const whatsappLink = t.whatsappLink && t.whatsappLink !== '#' ? t.whatsappLink : 'https://wa.me/905312993355';

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FF0033] via-[#CC0029] to-[#1A1A2E] py-20 md:py-28">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/5" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3" />

      {/* Dot pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-8">
        {/* Title */}
        <h2 className="mb-6 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/80">
          {subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Primary CTA */}
          <a
            href="#pricing"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-white px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#FF0033] hover:-translate-y-0.5"
          >
            {primaryBtn}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

          {/* WhatsApp CTA */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#25D366]/25 transition-all duration-300 hover:bg-[#20BD5A] hover:-translate-y-0.5 hover:shadow-xl"
          >
            {/* WhatsApp icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
            {whatsappBtn}
          </a>
        </div>

        {/* Telegram link */}
        <p className="mt-6 text-sm text-white/60">
          {telegramText}{' '}
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:text-white hover:decoration-white"
          >
            {/* Telegram icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Telegram
          </a>
        </p>
      </div>
    </section>
  );
}
