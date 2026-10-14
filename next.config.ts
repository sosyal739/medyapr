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
      {
        source: '/:locale/blog/youtube-music-video-promotion-cost-and-pricing-benchmarks-2026',
        destination: '/:locale/fiyatlandirma',
        permanent: true,
      },
      {
        source: '/:locale/blog/how-much-does-youtube-music-video-promotion-cost-2026',
        destination: '/:locale/fiyatlandirma',
        permanent: true,
      },
      {
        source: '/:locale/blog/muzik-klibi-tanitimi-fiyatlari-ve-butce-rehberi-2026',
        destination: '/:locale/fiyatlandirma',
        permanent: true,
      },
      {
        source: '/:locale/blog/why-buying-fake-views-destroys-your-music-career-official-ads-guide',
        destination: '/:locale/blog/youtube-bot-panel-zararlari-resmi-google-ads-farki',
        permanent: true,
      },
      {
        source: '/:locale/blog/best-youtube-music-video-promotion-services-reviewed-2026',
        destination: '/:locale/blog/youtube-izlenme-satin-almak-gerekli-mi-sektor-gercekleri-ve-resmi-reklam-rehberi',
        permanent: true,
      },
      {
        source: '/:locale/blog/youtube-shorts-music-promotion-guide-how-to-make-your-song-viral',
        destination: '/:locale/blog/youtube-shorts-ile-sarkinizi-nasil-viral-yaparsiniz',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
