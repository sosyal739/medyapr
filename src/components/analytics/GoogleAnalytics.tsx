import React from 'react';
import Script from 'next/script';

export default function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  if (!measurementId) return null;

  return (
    <>
      {/* Google Consent Mode v2 (Default: Denied until user consents) */}
      <Script
        id="google-consent-mode"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500
            });
            
            // Check existing consent
            try {
              var savedConsent = localStorage.getItem('cookie_consent');
              if (savedConsent === 'accepted') {
                gtag('consent', 'update', {
                  'ad_storage': 'granted',
                  'ad_user_data': 'granted',
                  'ad_personalization': 'granted',
                  'analytics_storage': 'granted'
                });
              }
            } catch (e) {}
          `,
        }}
      />

      {/* Global Site Tag (gtag.js) - Google Analytics 4 & Google Ads */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
            gtag('config', 'AW-11081445035');

            // Akıllı Anti-Bot & Kaliteli İletişim Filtresi
            // Yanlışlıkla basıp çıkanları veya botları dönüşüm saymaz
            var pageEntryTime = Date.now();
            var userInteracted = false;

            window.addEventListener('scroll', function() { userInteracted = true; }, { passive: true, once: true });
            window.addEventListener('touchstart', function() { userInteracted = true; }, { passive: true, once: true });
            window.addEventListener('mousemove', function() { userInteracted = true; }, { passive: true, once: true });

            document.addEventListener('click', function(e) {
              try {
                var target = e.target && e.target.closest ? e.target.closest('a') : null;
                if (!target || !target.href) return;
                var href = target.href.toLowerCase();

                var isContactLink = href.indexOf('wa.me/') !== -1 || 
                                    href.indexOf('api.whatsapp.com') !== -1 || 
                                    href.indexOf('t.me/') !== -1 || 
                                    href.indexOf('mailto:info@medyapr.com') !== -1;

                if (isContactLink) {
                  var channel = href.indexOf('t.me/') !== -1 ? 'telegram' : (href.indexOf('mailto:') !== -1 ? 'email' : 'whatsapp');
                  
                  // Filtre 1: Sayfada en az 6 saniye geçirmemişse ve etkileşimi yoksa (kazara dokunma / bot)
                  var timeOnPage = (Date.now() - pageEntryTime) / 1000;
                  var isIntentional = timeOnPage >= 6 && userInteracted;

                  // Filtre 2: Oturum başına sadece 1 defa dönüşüm sayılsın (mükerrer tıklamaları engeller)
                  var sessionKey = 'medyapr_conv_' + channel;
                  var alreadyTracked = false;
                  try {
                    alreadyTracked = !!sessionStorage.getItem(sessionKey);
                  } catch(ex) {}

                  // GA4'te her tıklama olay bazında kaydedilsin (analiz için)
                  gtag('event', channel + '_click', {
                    'event_category': 'artist_pr_lead',
                    'event_label': channel,
                    'time_on_page_sec': Math.round(timeOnPage),
                    'is_intentional': isIntentional
                  });

                  // Google Ads Dönüşümü: SADECE sayfada en az 6 saniye kalmış, etkileşim göstermiş ve ilk kez tıklayan gerçek kullanıcılar için tetiklenir!
                  if (isIntentional && !alreadyTracked) {
                    try { sessionStorage.setItem(sessionKey, '1'); } catch(ex) {}

                    gtag('event', 'conversion', {
                      'send_to': 'AW-11081445035/q5ZlCL6wop4dEKvdhaQp',
                      'value': 100.0,
                      'currency': 'TRY'
                    });

                    gtag('event', 'generate_lead', {
                      'event_category': 'artist_pr_lead',
                      'event_label': channel,
                      'value': 100.0,
                      'currency': 'TRY'
                    });
                  }
                }
              } catch(err) {}
            }, true);
          `,
        }}
      />
    </>
  );
}
