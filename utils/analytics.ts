import { hasConsentFor } from '../hooks/useCookieConsent';

// Declare gtag, fbq, and clarity on window for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'js' | 'config' | 'event' | 'consent',
      targetOrAction: Date | string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: Record<string, unknown>[];
    fbq?: (
      command: 'init' | 'track' | 'trackCustom',
      eventOrPixelId: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq?: unknown;
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

// ============================================================================
// LEAD VALUES FOR CONVERSION TRACKING
// These values help measure ROI in Google Ads and Meta Ads
// ============================================================================
export const LEAD_VALUES = {
  EXIT_INTENT: 15, // Value of a lead from exit intent modal (EUR)
  CONTACT_FORM: 20, // Value of a lead from contact form (EUR)
  GENERIC_LEAD: 15, // Value of a generic lead modal (EUR)
  TRIAL_CLASS: 25, // Value of a trial class booking (EUR)
  MEMBERSHIP: 100, // Value of a membership purchase (EUR)
} as const;

// ============================================================================
// UTM PARAMETER TRACKING
// Captures campaign attribution from URL parameters
// ============================================================================
export function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const params = new window.URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  const utmKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
  ];

  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  // Store in sessionStorage for later use (e.g., form submissions)
  if (Object.keys(utmParams).length > 0) {
    try {
      sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
    } catch {
      // sessionStorage not available
    }
  }

  return utmParams;
}

export function getStoredUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = sessionStorage.getItem('utm_params');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

let consentUpdated = false;
let clarityLoaded = false;

// Microsoft Clarity Project ID
const CLARITY_PROJECT_ID = 'urluk2l5up';

/**
 * Load Microsoft Clarity for heatmaps and session recordings
 * Only loads if user has given analytics consent (GDPR compliant)
 */
export function loadClarity(): void {
  if (clarityLoaded) return;
  if (!hasConsentFor('analytics')) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Clarity initialization code
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const w = window as any;
  w.clarity =
    w.clarity ||
    function (...args: unknown[]) {
      (w.clarity.q = w.clarity.q || []).push(args);
    };
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);
  /* eslint-enable @typescript-eslint/no-explicit-any */

  clarityLoaded = true;
}

/**
 * Update GTM Consent Mode when user accepts cookies
 * GTM is already loaded in index.html with consent defaulted to 'denied'
 * This function updates the consent state when user accepts
 */
export function updateGTMConsent(): void {
  if (consentUpdated) return;

  const analyticsConsent = hasConsentFor('analytics');
  const marketingConsent = hasConsentFor('marketing');

  // Only update if user has given some consent
  if (!analyticsConsent && !marketingConsent) return;

  // gtag is already defined in index.html by GTM
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: analyticsConsent ? 'granted' : 'denied',
      ad_storage: marketingConsent ? 'granted' : 'denied',
      ad_user_data: marketingConsent ? 'granted' : 'denied',
      ad_personalization: marketingConsent ? 'granted' : 'denied',
    });
    consentUpdated = true;
  }
}

/**
 * @deprecated Use updateGTMConsent instead - GTM handles GA4 loading
 * Kept for backwards compatibility
 */
export function loadGoogleAnalytics(): void {
  updateGTMConsent();
}

// NOTE: Meta Pixel is now loaded exclusively via GTM (Google Tag Manager)
// The loadMetaPixel() function has been removed to avoid duplicate pixel loading
// GTM handles: pixel initialization, PageView tracking, and Lead events
// Code still uses window.fbq for events not configured in GTM (Purchase, Schedule, etc.)

/**
 * Initialize all analytics based on user consent
 * Call this after user gives consent or on page load if consent exists
 * Note: Meta Pixel is loaded via GTM, not from code
 */
export function initializeAnalytics(): void {
  // Update GTM consent (GTM handles GA4 and Meta Pixel)
  updateGTMConsent();

  // Load Clarity if analytics consent given (GDPR)
  if (hasConsentFor('analytics')) {
    loadClarity();
  }
}

/**
 * Update consent state in GTM/GA4
 * Call this when user changes their preferences
 */
export function updateGAConsent(analytics: boolean, marketing: boolean): void {
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
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

/**
 * Track standard Meta Pixel event (Lead, Purchase, etc.)
 * Use for events that Meta recognizes for optimization
 */
export function trackMetaStandardEvent(
  eventName: 'Lead' | 'Purchase' | 'CompleteRegistration' | 'Schedule' | 'Contact',
  eventParams?: Record<string, unknown>
): void {
  if (!hasConsentFor('marketing') || !window.fbq) return;

  window.fbq('track', eventName, eventParams);
}

// ============================================================================
// DATALAYER PUSH FOR GTM
// These functions push events to dataLayer for GTM to pick up
// ============================================================================

/**
 * Push event to dataLayer for GTM
 * This is the main function for GTM-based tracking
 */
export function pushToDataLayer(eventData: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventData);
}

/**
 * Track micro-conversion: Lead captured
 * Use for: Exit Intent Modal, Contact Form, Lead Modals
 */
export function trackLeadConversion(params: {
  leadSource: 'exit_intent' | 'contact_form' | 'generic_modal' | 'dancehall_modal' | 'landing_page';
  formName: string;
  leadValue: number;
  email?: string; // Optional, only pass if user consented
  discountCode?: string;
  pagePath?: string;
}): void {
  const utmParams = getStoredUTMParams();
  const pagePath =
    params.pagePath || (typeof window !== 'undefined' ? window.location.pathname : '');

  // 1. Push to dataLayer for GTM
  pushToDataLayer({
    event: 'generate_lead',
    lead_source: params.leadSource,
    form_name: params.formName,
    lead_value: params.leadValue,
    currency: 'EUR',
    page_path: pagePath,
    discount_code: params.discountCode,
    ...utmParams,
  });

  // 2. Track in GA4 directly (backup, GTM should handle this)
  if (hasConsentFor('analytics') && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'Lead',
      event_label: params.formName,
      value: params.leadValue,
      currency: 'EUR',
      lead_source: params.leadSource,
      page_path: pagePath,
    });
  }

  // NOTE: Meta Pixel Lead event is handled by GTM (listens to 'generate_lead' dataLayer event)
  // Removed direct fbq('track', 'Lead') call to avoid duplicate events
}

/**
 * Track macro-conversion: Purchase/Membership
 * Note: This should be called from Momence webhook or thank-you page
 */
export function trackPurchaseConversion(params: {
  transactionId: string;
  value: number;
  productName: string;
  productCategory: 'membership' | 'class_pack' | 'single_class' | 'trial';
}): void {
  const utmParams = getStoredUTMParams();

  // 1. Push to dataLayer for GTM
  pushToDataLayer({
    event: 'purchase',
    transaction_id: params.transactionId,
    value: params.value,
    currency: 'EUR',
    product_name: params.productName,
    product_category: params.productCategory,
    ...utmParams,
  });

  // 2. Track in GA4 directly
  if (hasConsentFor('analytics') && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: params.transactionId,
      value: params.value,
      currency: 'EUR',
      items: [
        {
          item_name: params.productName,
          item_category: params.productCategory,
          price: params.value,
          quantity: 1,
        },
      ],
    });
  }

  // 3. Track in Meta Pixel
  if (hasConsentFor('marketing') && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_name: params.productName,
      content_category: params.productCategory,
      value: params.value,
      currency: 'EUR',
    });
  }
}

/**
 * Track class reservation/scheduling
 * For when user books a trial or regular class via Acuity
 */
export function trackScheduleConversion(params: {
  className: string;
  classType: 'trial' | 'regular' | 'workshop';
  value?: number;
}): void {
  const utmParams = getStoredUTMParams();
  const value = params.value || (params.classType === 'trial' ? 0 : LEAD_VALUES.TRIAL_CLASS);

  // 1. Push to dataLayer for GTM
  pushToDataLayer({
    event: 'schedule_class',
    class_name: params.className,
    class_type: params.classType,
    value: value,
    currency: 'EUR',
    ...utmParams,
  });

  // 2. Track in GA4
  if (hasConsentFor('analytics') && window.gtag) {
    window.gtag('event', 'schedule', {
      event_category: 'Booking',
      event_label: params.className,
      value: value,
      currency: 'EUR',
      class_type: params.classType,
    });
  }

  // 3. Track in Meta Pixel with Schedule event
  if (hasConsentFor('marketing') && window.fbq) {
    window.fbq('track', 'Schedule', {
      content_name: params.className,
      content_category: params.classType,
      value: value,
      currency: 'EUR',
    });
  }
}

// Listen for consent changes and update GTM consent accordingly
if (typeof window !== 'undefined') {
  window.addEventListener('cookieConsentChanged', event => {
    const preferences = (event as CustomEvent).detail;

    // Update GTM/GA4 consent state (GTM handles Meta Pixel)
    updateGAConsent(preferences.analytics, preferences.marketing);

    // Load Clarity if analytics consent given (GDPR)
    if (preferences.analytics) {
      loadClarity();
    }
  });

  // Check if user already has consent stored (e.g., returning visitor)
  // This runs on page load to update GTM consent if user previously accepted
  setTimeout(() => {
    if (hasConsentFor('analytics') || hasConsentFor('marketing')) {
      updateGTMConsent();
    }
  }, 100);
}
