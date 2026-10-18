'use client';

import React from 'react';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId?: string;
  measurementId?: string;
}

export default function GoogleAnalytics({ gaId, measurementId }: GoogleAnalyticsProps) {
  const id = measurementId || gaId || process.env.NEXT_PUBLIC_GA_ID || 'G-EEBZ16SNQ9';

  if (!id) return null;

  return (
    <>
      {/* Google Consent Mode v2 Setup (Default: Granted so all visitors appear in GA4 immediately unless explicitly declined) */}
      <Script
        id="google-consent-mode"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted',
              'wait_for_update': 500
            });

            // Only restrict if user explicitly declined in CookieConsent
            try {
              var storedConsent = localStorage.getItem('medyapr_cookie_consent');
              if (storedConsent) {
                var parsed = JSON.parse(storedConsent);
                if (parsed.declined === true || parsed.analytics === false) {
                  gtag('consent', 'update', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied'
                  });
                }
              }
            } catch (e) {}
          `,
        }}
      />

      {/* Global Site Tag (gtag.js) - Google Analytics 4 & Google Ads */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
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
            gtag('config', '${id}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
            gtag('config', 'AW-11081445035');

            // Direct & Clean Lead Conversion Tracking (WhatsApp, Telegram & Email)
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

                  gtag('event', channel + '_click', {
                    'event_category': 'artist_pr_lead',
                    'event_label': channel
                  });

                  gtag('event', 'generate_lead', {
                    'event_category': 'artist_pr_lead',
                    'event_label': channel,
                    'value': 100.0,
                    'currency': 'TRY'
                  });

                  gtag('event', 'conversion', {
                    'send_to': 'AW-11081445035/q5ZlCL6wop4dEKvdhaQp',
                    'value': 100.0,
                    'currency': 'TRY'
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
