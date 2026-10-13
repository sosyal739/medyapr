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
    const currentCookie = request.cookies.get('NEXT_LOCALE')?.value;
    if (currentCookie !== pathLocale) {
      const response = NextResponse.next();
      response.cookies.set('NEXT_LOCALE', pathLocale, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
      });
      return response;
    }
    return NextResponse.next();
  }

  /* 0. Arama motoru robotları (Googlebot, Bingbot, YandexBot vb.) için:
     Googlebot ABD IP'si üzerinden tarasa dahi, ana domain (/ ) ASLA /en'e yönlendirilmemelidir.
     Birincil pazar ve ana dil Türkçe (/tr) olduğu için botlar daima /tr'ye 307 (Geçici) ile yönlendirilir.
     Bu sayede kök alan adı Google indeksinde /en olarak kalıcı kilitlenmez.
  */
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|googlebot|crawler|spider|robot|crawling|google|bing|yandex|duckduck|slurp|baiduspider/i.test(userAgent);

  if (isBot) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/tr${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(redirectUrl, 307);
  }

  /* Detect preferred locale for human visitors:
     1. Prioritize explicit NEXT_LOCALE cookie if present (user manual preference)
     2. Edge Geolocation: If visitor is outside Turkey (country !== 'TR'), route to 'en'
     3. Fallback to Accept-Language header
     4. Default to 'tr' for Turkey visitors
  */
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined;
  let targetLocale: Locale = defaultLocale; // 'tr'

  if (cookieLocale && locales.includes(cookieLocale)) {
    targetLocale = cookieLocale;
  } else {
    // Vercel Edge / Cloudflare Geolocation header
    const country = (
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-country-code') ||
      (request as NextRequest & { geo?: { country?: string } }).geo?.country ||
      ''
    ).toUpperCase();

    if (country) {
      // Türkiye dışındaki tüm dünya ülkelerine (US, DE, GB, FR vb.) İngilizce arayüz
      targetLocale = country === 'TR' ? 'tr' : 'en';
    } else {
      // Ülke başlığı yoksa (yerel geliştirme veya proxy arkası):
      const acceptLanguage = request.headers.get('accept-language') || '';
      // Tarayıcısında Türkçe dil sinyali olanlara 'tr', diğer herkese 'en'
      const hasTurkish = /tr([-_][A-Za-z]+)?(,|;|$)/i.test(acceptLanguage);
      targetLocale = hasTurkish ? 'tr' : 'en';
    }
  }

  /* Redirect to locale-prefixed path with 307 Temporary Redirect */
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`;

  const response = NextResponse.redirect(redirectUrl, 307);
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
