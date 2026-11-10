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
      // Türkiye/İngilizce dünyasına özgü bölümlerin Arapça ve İspanyolca sürümü yok: tek adımda İngilizceye.
      { source: '/ar/sanatcilar', destination: '/en/sanatcilar', permanent: true },
      { source: '/ar/yeni-klipler', destination: '/en/yeni-klipler', permanent: true },
      { source: '/ar/sanatci/:slug', destination: '/en/sanatci/:slug', permanent: true },
      { source: '/ar/klip/:slug', destination: '/en/klip/:slug', permanent: true },
      { source: '/es/sanatcilar', destination: '/en/sanatcilar', permanent: true },
      { source: '/es/yeni-klipler', destination: '/en/yeni-klipler', permanent: true },
      { source: '/es/sanatci/:slug', destination: '/en/sanatci/:slug', permanent: true },
      { source: '/es/klip/:slug', destination: '/en/klip/:slug', permanent: true },
      // Consolidated blog posts (with and without locale prefix to prevent 2-hop chains)
      {
        source: '/:locale(tr|en)/blog/sabrina-carpenter-espresso-youtube-video-strategy',
        destination: '/en/blog/sabrina-carpenter-taste-please-please-please-youtube-pr-playbook',
        permanent: true,
      },
      {
        source: '/blog/sabrina-carpenter-espresso-youtube-video-strategy',
        destination: '/en/blog/sabrina-carpenter-taste-please-please-please-youtube-pr-playbook',
        permanent: true,
      },
      {
        source: '/:locale(tr|en)/blog/youtube-trendlere-nasil-girilir-2026-algoritma-rehberi',
        destination: '/:locale/blog/muzik-kliplerinde-ilk-48-saat-algoritma-rehberi',
        permanent: true,
      },
      {
        source: '/blog/youtube-trendlere-nasil-girilir-2026-algoritma-rehberi',
        destination: '/tr/blog/muzik-kliplerinde-ilk-48-saat-algoritma-rehberi',
        permanent: true,
      },
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
        destination: '/:locale/blog/youtube-izlenme-satin-almak-zararli-mi-bot-panel-vs-google-ads-2026',
        permanent: true,
      },
      {
        source: '/blog/why-buying-fake-views-destroys-your-music-career-official-ads-guide',
        destination: '/tr/blog/youtube-izlenme-satin-almak-zararli-mi-bot-panel-vs-google-ads-2026',
        permanent: true,
      },
      {
        source: '/:locale(tr|en)/blog/best-youtube-music-video-promotion-services-reviewed-2026',
        destination: '/:locale/blog/youtube-izlenme-satin-almak-zararli-mi-bot-panel-vs-google-ads-2026',
        permanent: true,
      },
      {
        source: '/blog/best-youtube-music-video-promotion-services-reviewed-2026',
        destination: '/tr/blog/youtube-izlenme-satin-almak-zararli-mi-bot-panel-vs-google-ads-2026',
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
      // İndeks diyeti (10 Kas 2026): aynı arama niyetini paylaşan yazılar tek sayfada birleştirildi.
      { source: '/:locale(tr|en)/blog/youtube-bot-panel-zararlari-resmi-google-ads-farki', destination: '/:locale/blog/youtube-izlenme-satin-almak-zararli-mi-bot-panel-vs-google-ads-2026', permanent: true },
      { source: '/blog/youtube-bot-panel-zararlari-resmi-google-ads-farki', destination: '/tr/blog/youtube-izlenme-satin-almak-zararli-mi-bot-panel-vs-google-ads-2026', permanent: true },
      { source: '/:locale(tr|en)/blog/youtube-izlenme-satin-almak-gerekli-mi-sektor-gercekleri-ve-resmi-reklam-rehberi', destination: '/:locale/blog/youtube-izlenme-satin-almak-zararli-mi-bot-panel-vs-google-ads-2026', permanent: true },
      { source: '/blog/youtube-izlenme-satin-almak-gerekli-mi-sektor-gercekleri-ve-resmi-reklam-rehberi', destination: '/tr/blog/youtube-izlenme-satin-almak-zararli-mi-bot-panel-vs-google-ads-2026', permanent: true },
      { source: '/:locale(tr|en)/blog/neden-youtube-goruntulenme-alinmali-muzik-piyasasinda-rekabet-ve-klip-tanitimi', destination: '/:locale/blog/youtube-izlenme-satin-almak-zararli-mi-bot-panel-vs-google-ads-2026', permanent: true },
      { source: '/blog/neden-youtube-goruntulenme-alinmali-muzik-piyasasinda-rekabet-ve-klip-tanitimi', destination: '/tr/blog/youtube-izlenme-satin-almak-zararli-mi-bot-panel-vs-google-ads-2026', permanent: true },
      { source: '/tr/blog/youtube-video-reklam-fiyatlari-2026-cpv-butce-hesaplama', destination: '/tr/youtube-reklam-fiyatlari', permanent: true },
      { source: '/en/blog/youtube-video-reklam-fiyatlari-2026-cpv-butce-hesaplama', destination: '/en/fiyatlandirma', permanent: true },
      { source: '/blog/youtube-video-reklam-fiyatlari-2026-cpv-butce-hesaplama', destination: '/tr/youtube-reklam-fiyatlari', permanent: true },
      { source: '/tr/blog/youtube-klip-tanitimi-paketleri-ve-fiyatlari-2026-lansman-planlari', destination: '/tr/youtube-reklam-fiyatlari', permanent: true },
      { source: '/en/blog/youtube-klip-tanitimi-paketleri-ve-fiyatlari-2026-lansman-planlari', destination: '/en/fiyatlandirma', permanent: true },
      { source: '/blog/youtube-klip-tanitimi-paketleri-ve-fiyatlari-2026-lansman-planlari', destination: '/tr/youtube-reklam-fiyatlari', permanent: true },
      { source: '/:locale(tr|en)/blog/cost-of-youtube-music-video-ads-cpv-benchmarks-2026', destination: '/en/fiyatlandirma', permanent: true },
      { source: '/blog/cost-of-youtube-music-video-ads-cpv-benchmarks-2026', destination: '/en/fiyatlandirma', permanent: true },
      { source: '/tr/blog/youtube-klip-tanitimi-google-ads-rehberi', destination: '/tr/youtube-klip-tanitimi', permanent: true },
      { source: '/en/blog/youtube-klip-tanitimi-google-ads-rehberi', destination: '/en/youtube-music-video-promotion', permanent: true },
      { source: '/blog/youtube-klip-tanitimi-google-ads-rehberi', destination: '/tr/youtube-klip-tanitimi', permanent: true },
      { source: '/:locale(tr|en)/blog/how-to-promote-your-music-video-on-youtube-with-google-ads-2026', destination: '/en/google-ads-for-music-videos', permanent: true },
      { source: '/blog/how-to-promote-your-music-video-on-youtube-with-google-ads-2026', destination: '/en/google-ads-for-music-videos', permanent: true },
      { source: '/ar/blog/is-buying-youtube-views-worth-it-official-ads-guide', destination: '/ar/blog/youtube-bot-panel-risks-official-google-ads-difference', permanent: true },
    ];
  },
};

export default nextConfig;
