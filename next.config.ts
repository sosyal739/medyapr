import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Fix any accidental double-locale paths in 1 hop
      {
        source: '/en/tr/:path*',
        destination: '/tr/:path*',
        permanent: true,
      },
      {
        source: '/tr/en/:path*',
        destination: '/en/:path*',
        permanent: true,
      },
      // Consolidated blog posts (with and without locale prefix to prevent 2-hop chains)
      {
        source: '/:locale(tr|en)/blog/youtube-music-video-promotion-cost-and-pricing-benchmarks-2026',
        destination: '/:locale/fiyatlandirma',
        permanent: true,
      },
      {
        source: '/blog/youtube-music-video-promotion-cost-and-pricing-benchmarks-2026',
        destination: '/tr/fiyatlandirma',
        permanent: true,
      },
      {
        source: '/:locale(tr|en)/blog/how-much-does-youtube-music-video-promotion-cost-2026',
        destination: '/:locale/fiyatlandirma',
        permanent: true,
      },
      {
        source: '/blog/how-much-does-youtube-music-video-promotion-cost-2026',
        destination: '/tr/fiyatlandirma',
        permanent: true,
      },
      {
        source: '/:locale(tr|en)/blog/muzik-klibi-tanitimi-fiyatlari-ve-butce-rehberi-2026',
        destination: '/:locale/fiyatlandirma',
        permanent: true,
      },
      {
        source: '/blog/muzik-klibi-tanitimi-fiyatlari-ve-butce-rehberi-2026',
        destination: '/tr/fiyatlandirma',
        permanent: true,
      },
      {
        source: '/:locale(tr|en)/blog/why-buying-fake-views-destroys-your-music-career-official-ads-guide',
        destination: '/:locale/blog/youtube-bot-panel-zararlari-resmi-google-ads-farki',
        permanent: true,
      },
      {
        source: '/blog/why-buying-fake-views-destroys-your-music-career-official-ads-guide',
        destination: '/tr/blog/youtube-bot-panel-zararlari-resmi-google-ads-farki',
        permanent: true,
      },
      {
        source: '/:locale(tr|en)/blog/best-youtube-music-video-promotion-services-reviewed-2026',
        destination: '/:locale/blog/youtube-izlenme-satin-almak-gerekli-mi-sektor-gercekleri-ve-resmi-reklam-rehberi',
        permanent: true,
      },
      {
        source: '/blog/best-youtube-music-video-promotion-services-reviewed-2026',
        destination: '/tr/blog/youtube-izlenme-satin-almak-gerekli-mi-sektor-gercekleri-ve-resmi-reklam-rehberi',
        permanent: true,
      },
      {
        source: '/:locale(tr|en)/blog/youtube-shorts-music-promotion-guide-how-to-make-your-song-viral',
        destination: '/:locale/blog/youtube-shorts-ile-sarkinizi-nasil-viral-yaparsiniz',
        permanent: true,
      },
      {
        source: '/blog/youtube-shorts-music-promotion-guide-how-to-make-your-song-viral',
        destination: '/tr/blog/youtube-shorts-ile-sarkinizi-nasil-viral-yaparsiniz',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
