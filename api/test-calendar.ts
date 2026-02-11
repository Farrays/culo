import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { Buffer } from 'buffer';

/**
 * Test endpoint para verificar Google Calendar
 * SELF-CONTAINED: No imports de api/lib/ para evitar problemas de bundling de Vercel
 *
 * GET /api/test-calendar?action=check  -> Verifica configuracion
 * GET /api/test-calendar?action=test   -> Crea evento de prueba
 */

// ============================================================================
// GOOGLE CALENDAR INLINE (evita problemas de bundling)
// ============================================================================

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const TIMEZONE = 'Europe/Madrid';
const DEFAULT_CLASS_DURATION = 60;
const ACADEMY_LOCATION =
  "Farray's International Dance Center, C/ Entenca 100, Local 1, 08015 Barcelona";

interface CalendarResult {
  success: boolean;
  calendarEventId?: string;
  error?: string;
}

let cachedAccessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Creates a JWT for Service Account authentication
 */
function createServiceAccountJWT(email: string, privateKey: string): string {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600, // 1 hour
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const unsignedToken = `${base64Header}.${base64Payload}`;

  // Sign with private key
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsignedToken);
  const signature = sign.sign(privateKey, 'base64url');

  return `${unsignedToken}.${signature}`;
}

async function getAccessToken(): Promise<string | null> {
  // Check for Service Account credentials first (preferred)
  const serviceEmail = process.env['GOOGLE_SERVICE_ACCOUNT_EMAIL'];
  const serviceKey = process.env['GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY'];

  if (serviceEmail && serviceKey) {
    // Use Service Account authentication
    if (cachedAccessToken && Date.now() < tokenExpiry - 60000) {
      return cachedAccessToken;
    }

    try {
      // Handle escaped newlines in private key
      const formattedKey = serviceKey.replace(/\\n/g, '\n');
      const jwt = createServiceAccountJWT(serviceEmail, formattedKey);

      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[test-calendar] Service Account token error:', errorText);
        return null;
      }

      const data = await response.json();
      cachedAccessToken = data.access_token;
      tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
      console.log('[test-calendar] Service Account token obtained successfully');
      return cachedAccessToken;
    } catch (error) {
      console.error('[test-calendar] Service Account auth error:', error);
      return null;
    }
  }

  // Fallback to OAuth2 refresh token (legacy)
  const clientId = process.env['GOOGLE_CALENDAR_CLIENT_ID'];
  const clientSecret = process.env['GOOGLE_CALENDAR_CLIENT_SECRET'];
  const refreshToken = process.env['GOOGLE_CALENDAR_REFRESH_TOKEN'];

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('[test-calendar] Missing credentials');
    return null;
  }

  if (cachedAccessToken && Date.now() < tokenExpiry - 60000) {
    return cachedAccessToken;
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[test-calendar] Token refresh failed:', error);
      return null;
    }

    const data = await response.json();
    cachedAccessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;

    return cachedAccessToken;
  } catch (error) {
    console.error('[test-calendar] Token refresh error:', error);
    return null;
  }
}

function getCalendarId(): string {
  return process.env['GOOGLE_CALENDAR_ID'] || 'primary';
}

function isGoogleCalendarConfigured(): boolean {
  // Check Service Account first, then OAuth2
  const hasServiceAccount = !!(
    process.env['GOOGLE_SERVICE_ACCOUNT_EMAIL'] && process.env['GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY']
  );
  const hasOAuth = !!(
    process.env['GOOGLE_CALENDAR_CLIENT_ID'] &&
    process.env['GOOGLE_CALENDAR_CLIENT_SECRET'] &&
    process.env['GOOGLE_CALENDAR_REFRESH_TOKEN']
  );
  return hasServiceAccount || hasOAuth;
}

function getGoogleCalendarConfigInfo() {
  return {
    // Service Account (preferred)
    hasServiceAccountEmail: !!process.env['GOOGLE_SERVICE_ACCOUNT_EMAIL'],
    hasServiceAccountKey: !!process.env['GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY'],
    serviceAccountEmail: process.env['GOOGLE_SERVICE_ACCOUNT_EMAIL'] || null,
    // OAuth2 (legacy)
    hasClientId: !!process.env['GOOGLE_CALENDAR_CLIENT_ID'],
    hasClientSecret: !!process.env['GOOGLE_CALENDAR_CLIENT_SECRET'],
    hasRefreshToken: !!process.env['GOOGLE_CALENDAR_REFRESH_TOKEN'],
    // Calendar
    calendarId: getCalendarId(),
    // Auth method being used
    authMethod: process.env['GOOGLE_SERVICE_ACCOUNT_EMAIL'] ? 'service_account' : 'oauth2',
  };
}

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  category: string;
  eventId: string;
}

async function createBookingEvent(booking: BookingData): Promise<CalendarResult> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { success: false, error: 'Failed to get access token' };
  }

  try {
    const [hours, minutes] = booking.classTime.split(':').map(Number);
    const startDateTime = new Date(booking.classDate);
    startDateTime.setHours(hours || 19, minutes || 0, 0, 0);
    const endDateTime = new Date(startDateTime.getTime() + DEFAULT_CLASS_DURATION * 60 * 1000);

    const phoneNormalized = booking.phone.replace(/[\s\-+]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNormalized}`;

    const description = `Clase de Prueba Gratuita

CONTACTO
Email: ${booking.email}
Tel: ${booking.phone}
WhatsApp: ${whatsappUrl}

Categoria: ${booking.category}
ID: ${booking.eventId}

Estado: Pendiente de confirmacion

Reservado via: farrayscenter.com`;

    const event = {
      summary: `${booking.firstName} ${booking.lastName} - ${booking.className}`,
      description,
      location: ACADEMY_LOCATION,
      start: { dateTime: startDateTime.toISOString(), timeZone: TIMEZONE },
      end: { dateTime: endDateTime.toISOString(), timeZone: TIMEZONE },
      colorId: '8', // Graphite (pending)
      // Deshabilitar notificaciones de Google Calendar
      reminders: {
        useDefault: false,
        overrides: [],
      },
    };

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events?sendUpdates=none`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('[test-calendar] Create event failed:', error);
      return { success: false, error: `HTTP ${response.status}: ${error}` };
    }

    const data = await response.json();
    console.log(`[test-calendar] Event created: ${data.id}`);

    return { success: true, calendarEventId: data.id };
  } catch (error) {
    console.error('[test-calendar] Error creating event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============================================================================
// HANDLER
// ============================================================================

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const configInfo = getGoogleCalendarConfigInfo();

  // Verificar configuracion
  if (req.query['action'] === 'check') {
    return res.status(200).json({
      configured: isGoogleCalendarConfigured(),
      config: configInfo,
    });
  }

  // Listar eventos recientes
  if (req.query['action'] === 'list') {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return res.status(500).json({ error: 'Failed to get access token' });
    }

    try {
      const now = new Date();
      const timeMin = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago
      const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ahead

      const response = await fetch(
        `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=20&orderBy=startTime&singleEvents=true`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }

      const data = await response.json();
      return res.status(200).json({
        calendarId: getCalendarId(),
        eventCount: data.items?.length || 0,
        events: data.items?.map(
          (e: { id: string; summary: string; start: { dateTime?: string }; colorId?: string }) => ({
            id: e.id,
            summary: e.summary,
            start: e.start?.dateTime,
            colorId: e.colorId,
          })
        ),
      });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown' });
    }
  }

  // Test crear evento genérico
  if (req.query['action'] === 'test') {
    if (!isGoogleCalendarConfigured()) {
      return res.status(400).json({
        error: 'Google Calendar not configured',
        config: configInfo,
      });
    }

    const result = await createBookingEvent({
      firstName: 'Test',
      lastName: 'Vercel',
      email: 'test@example.com',
      phone: '+34600000000',
      className: 'TEST - Bachata Sensual',
      classDate:
        new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10),
      classTime: '19:00',
      category: 'bailes_sociales',
      eventId: `test-${Date.now()}`,
    });

    return res.status(200).json({
      testResult: result,
      message: result.success
        ? 'Google Calendar funciona! Revisa tu calendario.'
        : 'Error al crear evento',
    });
  }

  // Crear evento con datos personalizados
  // Uso: ?action=create&firstName=Test&lastName=Test&email=...&phone=...&className=...&classDate=2026-02-12&classTime=18:00&category=bailes_sociales&eventId=evt_xxx
  if (req.query['action'] === 'create') {
    if (!isGoogleCalendarConfigured()) {
      return res.status(400).json({
        error: 'Google Calendar not configured',
        config: configInfo,
      });
    }

    const firstName = req.query['firstName'] as string;
    const lastName = req.query['lastName'] as string;
    const email = req.query['email'] as string;
    const phone = req.query['phone'] as string;
    const className = req.query['className'] as string;
    const classDate = req.query['classDate'] as string;
    const classTime = req.query['classTime'] as string;
    const category = (req.query['category'] as string) || 'bailes_sociales';
    const eventId = (req.query['eventId'] as string) || `manual-${Date.now()}`;

    if (!firstName || !lastName || !email || !className || !classDate || !classTime) {
      return res.status(400).json({
        error: 'Missing required parameters',
        usage: '?action=create&firstName=X&lastName=X&email=X&phone=X&className=X&classDate=YYYY-MM-DD&classTime=HH:MM',
        required: ['firstName', 'lastName', 'email', 'className', 'classDate', 'classTime'],
        optional: ['phone', 'category', 'eventId'],
      });
    }

    const result = await createBookingEvent({
      firstName,
      lastName,
      email,
      phone: phone || '+34000000000',
      className,
      classDate,
      classTime,
      category,
      eventId,
    });

    return res.status(200).json({
      success: result.success,
      calendarEventId: result.calendarEventId,
      error: result.error,
      booking: { firstName, lastName, email, className, classDate, classTime },
    });
  }

  // Test cambiar color de evento
  // Uso: ?action=color&eventId=xxx&color=green (green, red, orange, gray)
  if (req.query['action'] === 'color') {
    const eventId = req.query['eventId'] as string;
    const colorName = (req.query['color'] as string) || 'green';

    if (!eventId) {
      return res.status(400).json({
        error: 'Missing eventId parameter',
        usage: '?action=color&eventId=EVENT_ID&color=green',
        colors: { green: '10 (confirmado)', red: '11 (cancelado)', orange: '6 (cancelado a tiempo)', gray: '8 (pendiente)' },
      });
    }

    const colorMap: Record<string, string> = {
      green: '10',    // Basil - confirmado
      red: '11',      // Tomato - cancelado tarde
      orange: '6',    // Tangerine - cancelado a tiempo
      gray: '8',      // Graphite - pendiente
    };

    const colorId = colorMap[colorName] || '10';
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return res.status(500).json({ error: 'Failed to get access token' });
    }

    try {
      // Primero obtener el evento actual
      const getResponse = await fetch(
        `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events/${eventId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!getResponse.ok) {
        return res.status(404).json({ error: `Event not found: ${eventId}` });
      }

      // Actualizar solo el color
      const updateResponse = await fetch(
        `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events/${eventId}?sendUpdates=none`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ colorId }),
        }
      );

      if (!updateResponse.ok) {
        const error = await updateResponse.text();
        return res.status(500).json({ error: `Update failed: ${error}` });
      }

      return res.status(200).json({
        success: true,
        eventId,
        color: colorName,
        colorId,
        message: `Color cambiado a ${colorName} (${colorId})`,
      });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown' });
    }
  }

  return res.status(200).json({
    error: 'Use ?action=check, ?action=test, ?action=list, or ?action=color&eventId=X&color=green',
    configured: isGoogleCalendarConfigured(),
  });
}
