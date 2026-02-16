import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route: /api/meta-event
 *
 * Lightweight endpoint to send browser events to Meta Conversions API (CAPI).
 * No PII — uses IP + User-Agent + fbp/fbc for matching.
 *
 * Covers all standard pixel events that need a server-side CAPI match:
 * - PageView (high volume, sendBeacon)
 * - ViewContent, InitiateCheckout (funnel events)
 * - Purchase, Schedule (conversions with value)
 *
 * Client sends via navigator.sendBeacon (non-blocking, fire-and-forget).
 * Server forwards to Meta CAPI with matching identifiers.
 */

const META_CAPI_URL = 'https://graph.facebook.com/v18.0';
const CAPI_TIMEOUT_MS = 5000;

// Whitelist of allowed event names to prevent abuse
const ALLOWED_EVENTS = new Set([
  'PageView',
  'ViewContent',
  'InitiateCheckout',
  'Purchase',
  'Schedule',
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight (for dev environments)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const PIXEL_ID = process.env['META_PIXEL_ID'];
  const ACCESS_TOKEN = process.env['META_CAPI_TOKEN'];

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    // Return 200 to not block the client — CAPI just isn't configured
    res.status(200).json({ success: false, error: 'not_configured' });
    return;
  }

  const { eventName, eventId, sourceUrl, fbp, fbc, customData } = req.body || {};

  // Validate event name (whitelist)
  if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
    res.status(400).json({ error: 'Invalid or missing eventName' });
    return;
  }

  // Validate required fields with length bounds
  if (!eventId || typeof eventId !== 'string' || eventId.length > 100) {
    res.status(400).json({ error: 'Invalid or missing eventId' });
    return;
  }

  if (!sourceUrl || typeof sourceUrl !== 'string' || sourceUrl.length > 2000) {
    res.status(400).json({ error: 'Invalid or missing sourceUrl' });
    return;
  }

  // Sanitize sourceUrl — validate domain via URL parsing (prevents injection like evil.com.farrayscenter.com)
  let sanitizedUrl: string;
  try {
    const parsed = new URL(sourceUrl);
    sanitizedUrl =
      parsed.hostname === 'www.farrayscenter.com' || parsed.hostname === 'farrayscenter.com'
        ? sourceUrl
        : `https://www.farrayscenter.com${parsed.pathname}`;
  } catch {
    // sourceUrl is not a valid full URL (e.g., just a path) — prepend domain
    const path = sourceUrl.startsWith('/') ? sourceUrl : `/${sourceUrl}`;
    sanitizedUrl = `https://www.farrayscenter.com${path.slice(0, 500)}`;
  }

  // Build minimal user_data (no PII for PageView — just browser identifiers)
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '';
  const userAgent = (req.headers['user-agent'] as string) || '';

  const userData: Record<string, unknown> = {
    client_ip_address: clientIp,
    client_user_agent: userAgent,
  };

  // Include Meta browser identifiers if available (for deduplication with pixel)
  if (fbp && typeof fbp === 'string') userData['fbp'] = fbp;
  if (fbc && typeof fbc === 'string') userData['fbc'] = fbc;

  // Build custom_data if provided (value, currency, content_name, etc.)
  const safeCustomData: Record<string, unknown> = {};
  if (customData && typeof customData === 'object' && !Array.isArray(customData)) {
    const allowed = ['value', 'currency', 'content_name', 'content_category', 'content_type'];
    for (const key of allowed) {
      if (key in customData) safeCustomData[key] = customData[key];
    }
  }

  const eventPayload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: sanitizedUrl,
        action_source: 'website',
        user_data: userData,
        ...(Object.keys(safeCustomData).length > 0 && {
          custom_data: safeCustomData,
        }),
      },
    ],
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CAPI_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${META_CAPI_URL}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[meta-event] CAPI error (${response.status}):`, errorText);
      res.status(200).json({ success: false });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.warn('[meta-event] CAPI timeout (5s)');
    } else {
      console.warn('[meta-event] Error:', error);
    }
    // Always return 200 — this is fire-and-forget telemetry
    res.status(200).json({ success: false });
  } finally {
    clearTimeout(timeoutId);
  }
}
