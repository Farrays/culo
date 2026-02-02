import type { VercelRequest, VercelResponse } from '@vercel/node';

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

async function getAccessToken(): Promise<string | null> {
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
  return !!(
    process.env['GOOGLE_CALENDAR_CLIENT_ID'] &&
    process.env['GOOGLE_CALENDAR_CLIENT_SECRET'] &&
    process.env['GOOGLE_CALENDAR_REFRESH_TOKEN']
  );
}

function getGoogleCalendarConfigInfo() {
  return {
    hasClientId: !!process.env['GOOGLE_CALENDAR_CLIENT_ID'],
    hasClientSecret: !!process.env['GOOGLE_CALENDAR_CLIENT_SECRET'],
    hasRefreshToken: !!process.env['GOOGLE_CALENDAR_REFRESH_TOKEN'],
    calendarId: getCalendarId(),
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
    };

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events`,
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

  // Test crear evento
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
      classDate: new Date().toISOString().split('T')[0],
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

  return res.status(200).json({
    error: 'Use ?action=check or ?action=test',
    configured: isGoogleCalendarConfigured(),
  });
}
