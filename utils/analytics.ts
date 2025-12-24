import { hasConsentFor } from '../hooks/useCookieConsent';

// Declare gtag and fbq on window for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'js' | 'config' | 'event' | 'consent',
      targetOrAction: Date | string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
    fbq?: (
      command: 'init' | 'track' | 'trackCustom',
      eventOrPixelId: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq?: unknown;
  }
}

let gaLoaded = false;
let metaPixelLoaded = false;

/**
 * Load Google Analytics (GA4) script
 * Only loads if user has given analytics consent
 */
export function loadGoogleAnalytics(): void {
  if (gaLoaded) return;
  if (!hasConsentFor('analytics')) return;

  const measurementId = import.meta.env['VITE_GA_MEASUREMENT_ID'];
  if (!measurementId) {
    console.warn('[Analytics] VITE_GA_MEASUREMENT_ID not configured');
    return;
  }

  // Initialize dataLayer
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  const dataLayer = window.dataLayer;
  window.gtag = function gtag(...args: [string, Date | string, Record<string, unknown>?]) {
    dataLayer.push(args);
  };
  window.gtag('js', new Date());

  // Set default consent state
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: hasConsentFor('marketing') ? 'granted' : 'denied',
  });

  window.gtag('config', measurementId, {
    anonymize_ip: true, // GDPR compliance
    cookie_flags: 'SameSite=None;Secure',
  });

  // Load gtag.js script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  gaLoaded = true;
}

/**
 * Load Meta (Facebook) Pixel script
 * Only loads if user has given marketing consent
 */
export function loadMetaPixel(): void {
  if (metaPixelLoaded) return;
  if (!hasConsentFor('marketing')) return;

  const pixelId = import.meta.env['VITE_FACEBOOK_PIXEL_ID'];
  if (!pixelId) {
    // Meta Pixel is optional, don't warn if not configured
    return;
  }

  // Meta Pixel initialization code
  /* eslint-disable */
  (function (f: Window, b: Document, e: string, v: string) {
    let n: unknown;
    let t: HTMLScriptElement;
    let s: HTMLScriptElement | null;
    if (f.fbq) return;
    n = f.fbq = function (...args: unknown[]) {
      if ((n as { callMethod?: (...a: unknown[]) => void }).callMethod) {
        (n as { callMethod: (...a: unknown[]) => void }).callMethod(...args);
      } else {
        (n as { queue: unknown[] }).queue.push(args);
      }
    };
    (n as { push: typeof Array.prototype.push }).push = (
      n as { push: typeof Array.prototype.push }
    ).push;
    (n as { loaded: boolean }).loaded = true;
    (n as { version: string }).version = '2.0';
    (n as { queue: unknown[] }).queue = [];
    t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0] as HTMLScriptElement | null;
    s?.parentNode?.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  if (window.fbq) {
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }

  metaPixelLoaded = true;
}

/**
 * Initialize all analytics based on user consent
 * Call this after user gives consent or on page load if consent exists
 */
export function initializeAnalytics(): void {
  if (hasConsentFor('analytics')) {
    loadGoogleAnalytics();
  }

  if (hasConsentFor('marketing')) {
    loadMetaPixel();
  }
}

/**
 * Update consent state in Google Analytics
 * Call this when user changes their preferences
 */
export function updateGAConsent(analytics: boolean, marketing: boolean): void {
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
    });
  }
}

/**
 * Track custom event to Google Analytics
 * Only sends if analytics consent is given
 */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>): void {
  if (!hasConsentFor('analytics') || !window.gtag) return;

  window.gtag('event', eventName, eventParams);
}

/**
 * Track custom event to Meta Pixel
 * Only sends if marketing consent is given
 */
export function trackMetaEvent(eventName: string, eventParams?: Record<string, unknown>): void {
  if (!hasConsentFor('marketing') || !window.fbq) return;

  window.fbq('trackCustom', eventName, eventParams);
}

// Listen for consent changes and initialize analytics accordingly
if (typeof window !== 'undefined') {
  window.addEventListener('cookieConsentChanged', event => {
    const preferences = (event as CustomEvent).detail;

    if (preferences.analytics) {
      loadGoogleAnalytics();
    }

    if (preferences.marketing) {
      loadMetaPixel();
    }

    // Update GA consent state
    updateGAConsent(preferences.analytics, preferences.marketing);
  });
}
