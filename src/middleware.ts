import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

const ARAB_COUNTRIES = new Set(['SA', 'AE', 'EG', 'MA', 'DZ', 'TN', 'LY', 'IQ', 'JO', 'LB', 'SY', 'YE', 'OM', 'KW', 'QA', 'BH', 'SD', 'PS', 'MR']);
const BOT_RE = /bot|crawl|spider|slurp|google|bing|yandex|baidu|duckduck|facebookexternalhit|whatsapp|telegram|twitter|linkedin|lighthouse|headless|preview/i;

/** Uygulamanın geçerli birinci seviye rota önekleri (dil öneki olmadan gelen gerçek kısayollar). */
const KNOWN_APP_SEGMENTS = new Set([
  'admin',
  'blog',
  'es',
  'fiyatlandirma',
  'gizlilik',
  'google-ads-for-music-videos',
  'hakkimizda',
  'hizmetler',
  'iade-politikasi',
  'iletisim',
  'klip',
  'klip-pr',
  'kullanim-kosullari',
  'order',
  'promote-turkish-music-on-youtube',
  'promocion-videos-musicales-youtube-colombia-latam',
  'promocion-videos-musicales-youtube-mexico',
  'promocion-youtube-music-espana-google-ads',
  'sanatci',
  'sanatcilar',
  'sarki-reklami-verme',
  'sss',
  'track',
  'trendler',
  'yeni-klipler',
  'youtube-klip-tanitimi',
  'youtube-music-promotion-egypt',
  'youtube-music-promotion-morocco',
  'youtube-music-promotion-saudi-arabia',
  'youtube-music-video-promotion',
  'youtube-reklam-fiyatlari',
]);

/** Eski WordPress ve Mayıs 2025 düşmüş alan adı spam yolları: tek adımda 410 Gone döner. */
const LEGACY_GONE_SEGMENTS = new Set([
  'project',
  'projects',
  'portfolio',
  'tag',
  'tags',
  'category',
  'categories',
  'author',
  'wp-admin',
  'wp-content',
  'wp-includes',
  'wp-json',
  'feed',
  'comments',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
]);

function goneResponse() {
  return new NextResponse('Gone', {
    status: 410,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}

/** İnsan ziyaretçi için dil tespiti:
 * 1. Ziyaretçinin tarayıcı / cihaz dil tercihleri (Accept-Language q-factor ağırlıklarına göre).
 *    Desteklenen diller: 'tr', 'en', 'ar' (İspanyolca 15 Kas 2026'da kaldırıldı, /es → /en).
 *    Örn. Türk kullanıcının tarayıcısında (Almanya'da veya Türkiye'de) 'tr' varsa doğrudan Türkçe.
 *    Arapça, İspanyolca veya İngilizce tercih edenler anında kendi dillerinde karşılanır.
 * 2. Tarayıcı dilinde doğrudan bir eşleşme yoksa (örn. de-DE, ru-RU veya boş başlık):
 *    IP / Vercel Ülke koduna göre yönlendirilir:
 *    - TR -> tr
 *    - Arap ülkeleri -> ar
 *    - Diğerleri (Almanya, ABD, AB vb.) -> en
 */
function detectLocale(request: NextRequest): Locale {
  const acceptLang = request.headers.get('accept-language') ?? '';
  if (acceptLang) {
    const parsed = acceptLang
      .split(',')
      .map((part) => {
        const [tag, qPart] = part.trim().split(';');
        const lang = tag.trim().toLowerCase().split(/[-_]/)[0];
        let q = 1.0;
        if (qPart && qPart.trim().startsWith('q=')) {
          const parsedQ = parseFloat(qPart.trim().substring(2));
          if (!isNaN(parsedQ)) q = parsedQ;
        }
        return { lang, q };
      })
      .sort((a, b) => b.q - a.q);

    for (const item of parsed) {
      if (item.lang === 'tr') return 'tr';
      if (item.lang === 'ar') return 'ar';
      if (item.lang === 'en') return 'en';
    }
  }

  const country = (request.headers.get('x-vercel-ip-country') ?? '').toUpperCase();
  if (country === 'TR') return 'tr';
  if (ARAB_COUNTRIES.has(country)) return 'ar';
  return 'en';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Skip internal Next.js paths, api, and asset directories */
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/video')
  ) {
    return NextResponse.next();
  }

  /* Eski PHP/ASP/HTML spam ve tarama tuzaklarına tek adımda 410 Gone dön (GSC doğrulama dosyası hariç) */
  if (/\.(php|asp|aspx|jsp|cgi|html?)$/i.test(pathname) && !pathname.startsWith('/google')) {
    return goneResponse();
  }

  /* Skip public root text/verification files and remaining static assets */
  if (
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

  /* Check if path already has a valid locale (/tr, /en, /ar, /es) */
  const pathLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathLocale) {
    const secondSeg = pathname.split('/')[2]?.toLowerCase();
    if (secondSeg && LEGACY_GONE_SEGMENTS.has(secondSeg)) {
      return goneResponse();
    }

    const res = NextResponse.next();
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const isBot = BOT_RE.test(request.headers.get('user-agent') ?? '');
    if (!isBot && cookieLocale !== pathLocale) {
      res.cookies.set('NEXT_LOCALE', pathLocale, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
      });
    }
    return res;
  }

  const firstSeg = pathname.split('/')[1]?.toLowerCase();
  if (pathname !== '/' && (!firstSeg || !KNOWN_APP_SEGMENTS.has(firstSeg))) {
    return goneResponse();
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

  // Use 308 Permanent Redirect for default canonical path (/tr), 307 only when driven by user cookie or detection
  const res = NextResponse.redirect(redirectUrl, isBot && !cookieLocale ? 308 : 307);
  if (!isBot) {
    res.headers.set('Cache-Control', 'private, no-store');
    if (!cookieLocale) {
      res.cookies.set('NEXT_LOCALE', targetLocale, {
        path: '/',
        maxAge: 31536000,
        sameSite: 'lax',
      });
    }
  }
  return res;
}

export const config = {
  matcher: [
    '/((?!_next|api|images|icons|video|robots.txt|sitemap.xml|llms.txt|llms-full.txt|favicon.ico|logo.png|og-image.jpg).*)',
  ],
};
