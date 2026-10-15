import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

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

  /* Guard against accidental double-locale prefixes (e.g. /en/tr/... or /tr/en/...) */
  if (pathname.startsWith('/en/tr/') || pathname === '/en/tr') {
    const cleanPath = pathname.replace(/^\/en\/tr/, '/tr');
    return NextResponse.redirect(new URL(cleanPath, 'https://medyapr.com'), 308);
  }
  if (pathname.startsWith('/tr/en/') || pathname === '/tr/en') {
    const cleanPath = pathname.replace(/^\/tr\/en/, '/en');
    return NextResponse.redirect(new URL(cleanPath, 'https://medyapr.com'), 308);
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
  const targetLocale: Locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale; // 'tr'

  const targetPathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`;
  const redirectUrl = new URL(targetPathname + request.nextUrl.search, request.nextUrl.origin);

  // Use 308 Permanent Redirect for default canonical path (/tr), 307 only when driven by user cookie
  const statusCode = targetLocale === defaultLocale ? 308 : 307;
  return NextResponse.redirect(redirectUrl, statusCode);
}

export const config = {
  matcher: [
    '/((?!_next|api|images|icons|video|robots.txt|sitemap.xml|llms.txt|llms-full.txt|favicon.ico|logo.png|og-image.jpg).*)',
  ],
};
