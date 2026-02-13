/**
 * Meta Conversions API (CAPI) - Shared Library
 *
 * Extracted from api/reservar.ts to be reused across all form endpoints.
 * Sends server-side events to Meta for deduplication with browser pixel.
 *
 * Environment variables required:
 * - META_PIXEL_ID
 * - META_CAPI_TOKEN
 */

import crypto from 'crypto';
import { normalizePhone } from './phone-utils.js';

const META_CAPI_URL = 'https://graph.facebook.com/v18.0';
const CAPI_TIMEOUT_MS = 5000;

/** SHA256 hash a value for Meta CAPI (lowercase, trimmed) */
export function hashForMeta(value: string): string {
  const normalized = value.toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/** Generate a unique event ID for pixel/CAPI deduplication */
export function generateServerEventId(prefix: string = 'evt'): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export interface MetaConversionEventData {
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  eventName: string;
  eventId: string;
  sourceUrl: string;
  userAgent: string;
  clientIp: string;
  fbc?: string;
  fbp?: string;
  customData?: Record<string, unknown>;
}

export async function sendMetaConversionEvent(
  data: MetaConversionEventData
): Promise<{ success: boolean; error?: string }> {
  const PIXEL_ID = process.env['META_PIXEL_ID'];
  const ACCESS_TOKEN = process.env['META_CAPI_TOKEN'];

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('[meta-capi] Not configured (missing META_PIXEL_ID or META_CAPI_TOKEN)');
    return { success: false, error: 'not_configured' };
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // Build user_data based on available fields
  const userData: Record<string, unknown> = {
    em: [hashForMeta(data.email)],
    client_ip_address: data.clientIp,
    client_user_agent: data.userAgent,
  };

  if (data.phone) {
    const normalizedPhone = normalizePhone(data.phone);
    userData['ph'] = [hashForMeta(normalizedPhone)];
    // Auto-detect country from phone prefix
    if (normalizedPhone.startsWith('34')) {
      userData['country'] = [hashForMeta('es')];
      userData['ct'] = [hashForMeta('barcelona')];
    } else if (normalizedPhone.startsWith('33')) {
      userData['country'] = [hashForMeta('fr')];
    }
  }

  if (data.firstName) userData['fn'] = [hashForMeta(data.firstName)];
  if (data.lastName) userData['ln'] = [hashForMeta(data.lastName)];
  if (data.fbc) userData['fbc'] = data.fbc;
  if (data.fbp) userData['fbp'] = data.fbp;

  const eventPayload = {
    data: [
      {
        event_name: data.eventName,
        event_time: timestamp,
        event_id: data.eventId,
        event_source_url: data.sourceUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: data.customData || {},
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
      console.error('[meta-capi] API error:', response.status, errorText);
      return { success: false, error: errorText };
    }

    await response.json();
    return { success: true };
  } catch (error) {
    console.error('[meta-capi] Error:', error);
    return { success: false, error: String(error) };
  } finally {
    clearTimeout(timeoutId);
  }
}
