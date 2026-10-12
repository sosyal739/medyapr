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
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  /* Check if path already has a valid locale */
  const pathLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathLocale) {
    const noindex = pathLocale === 'en';
    const currentCookie = request.cookies.get('NEXT_LOCALE')?.value;
    if (currentCookie !== pathLocale) {
      const response = NextResponse.next();
      if (noindex) response.headers.set('X-Robots-Tag', 'noindex, follow');
      response.cookies.set('NEXT_LOCALE', pathLocale, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
      });
      return response;
    }
    const res = NextResponse.next();
    if (noindex) res.headers.set('X-Robots-Tag', 'noindex, follow');
    return res;
  }

  /* Detect preferred locale:
     1. Prioritize explicit NEXT_LOCALE cookie if present
     2. Fallback to Accept-Language header
     3. Default to defaultLocale ('tr')
  */
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined;
  let targetLocale: Locale = defaultLocale; // 'tr'

  if (cookieLocale && locales.includes(cookieLocale)) {
    targetLocale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get('accept-language') || '';
    // Sadece ziyaretçi açıkça İngilizce istiyorsa ve Türkçe sinyali yoksa 'en' yap, aksi halde daima varsayılan 'tr'
    const isStrictlyEnglish = /^en([-_][A-Za-z]+)?(,|;|$)/i.test(acceptLanguage) && !/tr/i.test(acceptLanguage);
    targetLocale = isStrictlyEnglish ? 'en' : 'tr';
  }

  /* Redirect to locale-prefixed path with 308 Permanent Redirect */
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`;

  const response = NextResponse.redirect(redirectUrl, 308);
  response.cookies.set('NEXT_LOCALE', targetLocale, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next|api|images|icons|robots.txt|sitemap.xml|llms.txt|llms-full.txt|favicon.ico|logo.png|og-image.jpg).*)'],
};
