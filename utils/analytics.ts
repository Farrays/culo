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
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
    _fbq?: unknown;
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

// ============================================================================
// META COOKIE HELPERS
// Extract _fbc (click ID) and _fbp (browser ID) for CAPI matching
// ============================================================================

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? (match[2] ?? null) : null;
}

/** Get Meta _fbc and _fbp cookies for server-side CAPI matching */
export function getMetaCookies(): { fbc: string | null; fbp: string | null } {
  return { fbc: getCookie('_fbc'), fbp: getCookie('_fbp') };
}

// ============================================================================
// LEAD VALUES FOR CONVERSION TRACKING
// These values help measure ROI in Google Ads and Meta Ads
// ============================================================================
export const LEAD_VALUES = Object.freeze({
  EXIT_INTENT: 15, // Value of a lead from exit intent modal (EUR)
  CONTACT_FORM: 20, // Value of a lead from contact form (EUR)
  GENERIC_LEAD: 15, // Value of a generic lead modal (EUR)
  TRIAL_CLASS: 25, // Value of a trial class booking (EUR)
  MEMBERSHIP: 100, // Value of a membership purchase (EUR)
  BOOKING_LEAD: 90, // Value of booking widget lead (50€/month × 6 months × 30% conversion)
});

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
 * Use for: Exit Intent Modal, Contact Form, Lead Modals, Booking Widget
 *
 * DEDUPLICATION: Always fires Meta Pixel with eventID + value/currency.
 * - If eventId provided (from server CAPI response): uses it for dedup with server CAPI
 * - If eventId missing: generates one and sends CAPI from browser via /api/meta-event
 *
 * This ensures 100% of Lead events have:
 * 1. Matching eventID on browser + server (for deduplication)
 * 2. value + currency (for ROAS calculation)
 */
export function trackLeadConversion(params: {
  leadSource:
    | 'exit_intent'
    | 'contact_form'
    | 'generic_modal'
    | 'dancehall_modal'
    | 'landing_page'
    | 'booking_widget';
  formName: string;
  leadValue: number;
  email?: string;
  discountCode?: string;
  pagePath?: string;
  eventId?: string; // From server CAPI response (preferred). If missing, auto-generated.
}): void {
  const utmParams = getStoredUTMParams();
  const pagePath =
    params.pagePath || (typeof window !== 'undefined' ? window.location.pathname : '');

  // Ensure we always have an eventId for deduplication.
  // Server form endpoints provide eventId (with full PII hashing).
  // If missing, generate one and send CAPI from browser (lower quality but ensures dedup).
  let eventId = params.eventId;
  if (!eventId) {
    eventId = sendCAPIBrowserEvent(
      'Lead',
      {
        value: params.leadValue,
        currency: 'EUR',
        content_name: params.formName,
        content_category: params.leadSource,
      },
      { skipPixel: true } // We fire pixel below with full params
    );
  }

  // 1. Push to dataLayer for GTM (GA4 + any GTM-based tags)
  // _meta_pixel_handled = true tells GTM to NOT fire its own Meta Pixel Lead tag
  pushToDataLayer({
    event: 'generate_lead',
    lead_source: params.leadSource,
    form_name: params.formName,
    lead_value: params.leadValue,
    currency: 'EUR',
    page_path: pagePath,
    discount_code: params.discountCode,
    event_id: eventId,
    _meta_pixel_handled: true,
    ...utmParams,
  });

  // 2. Always fire Meta Pixel with eventID + value/currency for CAPI deduplication
  if (hasConsentFor('marketing') && window.fbq) {
    window.fbq(
      'track',
      'Lead',
      {
        content_name: params.formName,
        content_category: params.leadSource,
        value: params.leadValue,
        currency: 'EUR',
      },
      { eventID: eventId }
    );
  }
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

  // Send CAPI + pixel (sendCAPIBrowserEvent now fires both with matching eventId)
  const eventId = sendCAPIBrowserEvent('Purchase', {
    value: params.value,
    currency: 'EUR',
    content_name: params.productName,
    content_category: params.productCategory,
  });

  // Push to dataLayer for GTM (GA4)
  pushToDataLayer({
    event: 'purchase',
    transaction_id: params.transactionId,
    value: params.value,
    currency: 'EUR',
    product_name: params.productName,
    product_category: params.productCategory,
    event_id: eventId,
    _meta_pixel_handled: true,
    ...utmParams,
  });
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

  // Send CAPI + pixel (sendCAPIBrowserEvent now fires both with matching eventId)
  const eventId = sendCAPIBrowserEvent('Schedule', {
    value,
    currency: 'EUR',
    content_name: params.className,
    content_category: params.classType,
  });

  // Push to dataLayer for GTM (GA4)
  pushToDataLayer({
    event: 'schedule_class',
    class_name: params.className,
    class_type: params.classType,
    value: value,
    currency: 'EUR',
    event_id: eventId,
    _meta_pixel_handled: true,
    ...utmParams,
  });
}

// ============================================================================
// META CAPI: BROWSER-TO-SERVER EVENT BRIDGE
// Sends browser events to /api/meta-event for CAPI forwarding.
// Uses sendBeacon (non-blocking, fire-and-forget). No PII — just IP/UA/fbp/fbc.
// ============================================================================

/** Generate a unique event ID for pixel/CAPI deduplication */
function generateEventId(prefix: string): string {
  try {
    return `${prefix}_${window.crypto.randomUUID()}`;
  } catch {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }
}

/**
 * Send any standard Meta event to CAPI via server endpoint AND fire matching pixel.
 * Ensures every CAPI event has a paired browser pixel event with the same eventID.
 *
 * DEDUPLICATION: Fires both pixel + CAPI with identical eventId so Meta
 * can match browser ↔ server events and count only once.
 *
 * @param eventName - Standard Meta event name (PageView, Lead, Purchase, etc.)
 * @param customData - Optional custom data (value, currency, content_name, etc.)
 * @param options - { skipPixel: true } to skip browser pixel fire (if caller handles it)
 * @returns The generated eventId
 */
export function sendCAPIBrowserEvent(
  eventName: string,
  customData?: Record<string, unknown>,
  options?: { skipPixel?: boolean }
): string {
  const prefix = eventName
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .slice(0, 6);
  const eventId = generateEventId(prefix);

  if (typeof window === 'undefined' || typeof navigator === 'undefined') return eventId;

  // 1. Fire pixel with matching eventID for deduplication
  if (!options?.skipPixel && hasConsentFor('marketing') && window.fbq) {
    window.fbq('track', eventName as 'Lead', customData || {}, { eventID: eventId });
  }

  // 2. Signal GTM to NOT fire its own pixel event (prevents double-fire)
  pushToDataLayer({
    event: `capi_${eventName.toLowerCase()}`,
    _meta_pixel_handled: true,
    meta_event_id: eventId,
  });

  // 3. Send matching event to CAPI via server endpoint
  const { fbc, fbp } = getMetaCookies();

  const payload = JSON.stringify({
    eventName,
    eventId,
    sourceUrl: window.location.href,
    fbp: fbp || undefined,
    fbc: fbc || undefined,
    ...(customData && { customData }),
  });

  const url = '/api/meta-event';

  if (navigator.sendBeacon) {
    const blob = new window.Blob([payload], { type: 'application/json' });
    const sent = navigator.sendBeacon(url, blob);
    if (!sent) {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } else {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }

  return eventId;
}

// ============================================================================
// META CAPI: PAGE VIEW SERVER-SIDE TRACKING
// Sends PageView events to Meta Conversions API via /api/meta-event endpoint.
// This closes the CAPI coverage gap (GTM fires pixel PageView, but CAPI was missing).
// Uses navigator.sendBeacon for non-blocking delivery (no impact on page performance).
// ============================================================================

/** Track if we already sent CAPI PageView for current path (prevent duplicates) */
let lastCAPIPageViewPath = '';

/**
 * Send PageView event to Meta CAPI via server endpoint AND fire pixel with matching eventID.
 * Call this on every route change.
 *
 * DEDUPLICATION FIX: Fires browser pixel with eventID so Meta can match
 * the browser event with the server CAPI event. Without this, GTM fires
 * PageView without eventID → Meta can't deduplicate → double-counted.
 *
 * IMPORTANT: After deploying this, disable the GTM "Meta Pixel - PageView" tag
 * (or add blocking trigger: _meta_pixel_handled equals true) to prevent
 * GTM from firing a second PageView without eventID.
 */
export function sendCAPIPageView(): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  // Deduplicate: don't send if same path as last call
  const currentPath = window.location.pathname;
  if (currentPath === lastCAPIPageViewPath) return;
  lastCAPIPageViewPath = currentPath;

  // Generate unique event ID for pixel/CAPI deduplication
  let eventId: string;
  try {
    eventId = `pv_${window.crypto.randomUUID()}`;
  } catch {
    eventId = `pv_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  // 1. Fire pixel PageView with eventID for deduplication with CAPI
  if (hasConsentFor('marketing') && window.fbq) {
    window.fbq('track', 'PageView', {}, { eventID: eventId });
  }

  // 2. Signal GTM to NOT fire its own PageView pixel (prevents double-fire)
  pushToDataLayer({
    event: 'capi_pageview',
    _meta_pixel_handled: true,
    meta_event_id: eventId,
  });

  // 3. Send matching event to CAPI via server endpoint
  const { fbc, fbp } = getMetaCookies();

  const payload = JSON.stringify({
    eventName: 'PageView',
    eventId,
    sourceUrl: window.location.href,
    fbp: fbp || undefined,
    fbc: fbc || undefined,
  });

  const url = '/api/meta-event';

  if (navigator.sendBeacon) {
    const blob = new window.Blob([payload], { type: 'application/json' });
    const sent = navigator.sendBeacon(url, blob);
    if (!sent) {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } else {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
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
