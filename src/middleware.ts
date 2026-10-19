import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

const ARAB_COUNTRIES = new Set(['SA', 'AE', 'EG', 'MA', 'DZ', 'TN', 'LY', 'IQ', 'JO', 'LB', 'SY', 'YE', 'OM', 'KW', 'QA', 'BH', 'SD', 'PS', 'MR']);
const BOT_RE = /bot|crawl|spider|slurp|google|bing|yandex|baidu|duckduck|facebookexternalhit|whatsapp|telegram|twitter|linkedin|lighthouse|headless|preview/i;

/** İnsan ziyaretçi için dil: önce tarayıcı/telefon dili (ar, tr), sonra konum (TR, Arap ülkeleri), aksi halde İngilizce. */
function detectLocale(request: NextRequest): Locale {
  const first = (request.headers.get('accept-language') ?? '').split(',')[0].trim().toLowerCase();
  const lang = first.split(/[-;_]/)[0];
  if (lang === 'ar') return 'ar';
  if (lang === 'tr') return 'tr';
  const country = (request.headers.get('x-vercel-ip-country') ?? '').toUpperCase();
  if (country === 'TR') return 'tr';
  if (ARAB_COUNTRIES.has(country)) return 'ar';
  return 'en';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Skip static files, internal Next.js paths, api, images, and public text files */
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/video') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  /* Guard against accidental double-locale prefixes (e.g. /en/tr/..., /tr/en/..., /ar/tr/..., /tr/ar/..., /ar/en/..., /en/ar/...) */
  for (const l1 of locales) {
    for (const l2 of locales) {
      if (l1 !== l2) {
        const prefix = `/${l1}/${l2}`;
        if (pathname.startsWith(`${prefix}/`) || pathname === prefix) {
          const cleanPath = pathname.replace(new RegExp(`^/${l1}/${l2}`), `/${l2}`);
          return NextResponse.redirect(new URL(cleanPath, 'https://medyapr.com'), 308);
        }
      }
    }
  }

  /* Check if path already has a valid locale (/tr or /en) */
  const pathLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathLocale) {
    return NextResponse.next();
  }

  /* Google Search Console & Multilingual SEO Standard:
     Do NOT use IP geolocation or User-Agent sniffing to split redirects between /tr and /en,
     as Googlebot (HTTP crawler) and Google Web Rendering Service (WRS from US IPs) receive
     conflicting 307 redirects, causing "Redirect error" (Yeniden yönlendirme hatası) in GSC.
     Instead:
     - Only honor an explicit NEXT_LOCALE cookie if a human user manually switched language.
     - Otherwise, deterministically redirect all non-locale URLs (/, /fiyatlandirma, etc.)
       to the primary canonical locale (/tr) with 308 Permanent Redirect in a single hop.
  */
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined;
  const isBot = BOT_RE.test(request.headers.get('user-agent') ?? '');
  // Arama botları her zaman /tr'ye gider (tek, kalıcı yönlendirme); insanlar dillerine göre yönlenir.
  const targetLocale: Locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : isBot ? defaultLocale : detectLocale(request);

  const targetPathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`;
  const redirectUrl = new URL(targetPathname + request.nextUrl.search, request.nextUrl.origin);

  // Use 308 Permanent Redirect for default canonical path (/tr), 307 only when driven by user cookie
  const res = NextResponse.redirect(redirectUrl, isBot && !cookieLocale ? 308 : 307);
  if (!isBot) res.headers.set('Cache-Control', 'private, no-store');
  return res;
}

export const config = {
  matcher: [
    '/((?!_next|api|images|icons|video|robots.txt|sitemap.xml|llms.txt|llms-full.txt|favicon.ico|logo.png|og-image.jpg).*)',
  ],
};
