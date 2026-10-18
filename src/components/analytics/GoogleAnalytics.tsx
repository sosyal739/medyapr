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
      {/* 
        Google Consent Mode v2 (Resmi GDPR & KVKK Uyumluluk Standardı)
        1. AB / AEA / İsviçre / Birleşik Krallık için GDPR gereği varsayılan: 'denied' (Açık rıza şartı)
        2. Türkiye (KVKK) ve diğer ülkeler için varsayılan: 'granted' (Kullanıcı dilediğinde reddedebilir)
        3. Kullanıcı daha önce seçim yapmışsa hafızadan anında senkronize edilir
      */}
      <Script
        id="google-consent-mode"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            // AB / AEA Ülkeleri (GDPR Kapsamı) için varsayılan 'denied'
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'region': ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'],
              'wait_for_update': 500
            });

            // Türkiye (KVKK) ve AB dışı ülkeler için varsayılan 'granted'
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted'
            });

            // Kullanıcının kayıtlı çerez tercihini anında uygula
            try {
              var stored = localStorage.getItem('medyapr_cookie_consent');
              if (stored) {
                var p = JSON.parse(stored);
                if (p.consent === 'all' || p.analytics === true) {
                  gtag('consent', 'update', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted'
                  });
                } else if (p.declined === true || p.consent === 'necessary') {
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

            // Temiz ve Doğrudan İletişim Dönüşüm Takibi (WhatsApp, Telegram & E-posta)
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
