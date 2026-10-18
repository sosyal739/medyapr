'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId?: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const measurementId = gaId || process.env.NEXT_PUBLIC_GA_ID || 'G-EEBZ16SNQ9';

  if (!measurementId) return null;

  return (
    <>
      {/* Google Consent Mode v2 Default Setup */}
      <Script
        id="google-consent-mode"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Default: Deny marketing and analytics storage until user consents
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });

            // If user previously granted consent in CookieConsent, immediately restore
            try {
              var storedConsent = localStorage.getItem('medyapr_cookie_consent');
              if (storedConsent) {
                var parsed = JSON.parse(storedConsent);
                if (parsed.analytics) {
                  gtag('consent', 'update', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted'
                  });
                }
              }
            } catch(e) {}
          `,
        }}
      />

      {/* Google Tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
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

            // Automatic Google Ads Lead Conversion Tracking (WhatsApp, Telegram & Email Briefs)
            document.addEventListener('click', function(e) {
              try {
                var target = e.target && e.target.closest ? e.target.closest('a') : null;
                if (!target || !target.href) return;
                var href = target.href.toLowerCase();
                if (href.indexOf('wa.me/') !== -1 || href.indexOf('api.whatsapp.com') !== -1 || href.indexOf('t.me/') !== -1 || href.indexOf('mailto:info@medyapr.com') !== -1) {
                  var channel = href.indexOf('t.me/') !== -1 ? 'telegram' : (href.indexOf('mailto:') !== -1 ? 'email' : 'whatsapp');
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
                  gtag('event', channel + '_click', {
                    'event_category': 'artist_pr_lead',
                    'event_label': channel
                  });
                }
              } catch(err) {}
            }, true);
          `,
        }}
      />
    </>
  );
}
