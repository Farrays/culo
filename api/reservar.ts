import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';
import crypto from 'crypto';
// Note: Resend import removed - now using dynamic imports from ./lib/email

// ============================================================================
// TIPOS INLINE (evitar imports de api/lib/ que fallan en Vercel)
// ============================================================================

type ClassCategory = 'bailes_sociales' | 'danzas_urbanas' | 'danza' | 'entrenamiento' | 'heels';

// ============================================================================
// PII REDACTION (GDPR-compliant logging)
// ============================================================================

/** Redact email for logging: "john@example.com" → "joh***@example.com" */
function redactEmail(email: string | null | undefined): string {
  if (!email) return 'N/A';
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@invalid';
  return `${local.length > 3 ? local.slice(0, 3) + '***' : '***'}@${domain}`;
}

/** Redact phone for logging: "+34612345678" → "+346***78" */
function redactPhone(phone: string | null | undefined): string {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length < 6) return '***';
  return `${cleaned.slice(0, 4)}***${cleaned.slice(-2)}`;
}

// ============================================================================
// FETCH WITH TIMEOUT (prevent hanging requests)
// ============================================================================

const DEFAULT_FETCH_TIMEOUT_MS = 8000; // 8 seconds (Vercel has 10s limit)

/**
 * Fetch with automatic timeout to prevent hanging requests
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeoutMs - Timeout in milliseconds (default 8000)
 */
async function fetchWithTimeout(
  url: string,
  options: Record<string, unknown> = {},
  timeoutMs: number = DEFAULT_FETCH_TIMEOUT_MS
): Promise<globalThis.Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    } as globalThis.RequestInit);
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============================================================================
// GOOGLE CALENDAR INLINED (Vercel bundler no incluye ./lib/email)
// ============================================================================

interface BookingCalendarData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  category?: string;
  eventId?: string;
  managementUrl?: string;
}

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const CALENDAR_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const CALENDAR_TIMEZONE = 'Europe/Madrid';
const DEFAULT_CLASS_DURATION = 60;
const ACADEMY_LOCATION =
  "Farray's International Dance Center, C/ Entença 100, Local 1, 08015 Barcelona";

let cachedCalendarAccessToken: string | null = null;
let calendarTokenExpiry: number = 0;

async function getCalendarAccessToken(): Promise<string | null> {
  const clientId = process.env['GOOGLE_CALENDAR_CLIENT_ID'];
  const clientSecret = process.env['GOOGLE_CALENDAR_CLIENT_SECRET'];
  const refreshToken = process.env['GOOGLE_CALENDAR_REFRESH_TOKEN'];

  if (!clientId || !clientSecret || !refreshToken) return null;

  if (cachedCalendarAccessToken && Date.now() < calendarTokenExpiry - 60000) {
    return cachedCalendarAccessToken;
  }

  try {
    const response = await fetchWithTimeout(CALENDAR_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    cachedCalendarAccessToken = data.access_token;
    calendarTokenExpiry = Date.now() + data.expires_in * 1000;
    return cachedCalendarAccessToken;
  } catch {
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

/**
 * Parsea fecha y hora de clase a string en formato Google Calendar
 * Retorna formato "YYYY-MM-DDTHH:MM:00" (sin Z, hora local)
 */
function parseClassDateTime(classDate: string, classTime: string): string {
  const isoMatch = classDate.match(/\d{4}-\d{2}-\d{2}/);
  const dateStr = isoMatch ? isoMatch[0] : classDate;
  const [hours, minutes] = classTime.split(':').map(Number);
  const h = String(hours || 19).padStart(2, '0');
  const m = String(minutes || 0).padStart(2, '0');
  return `${dateStr}T${h}:${m}:00`;
}

/**
 * Calcula la hora de fin añadiendo minutos a la hora de inicio
 */
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const parts = startTime.split('T');
  const datePart = parts[0] || '';
  const timePart = parts[1] || '19:00:00';
  const timeParts = timePart.split(':').map(Number);
  const h = timeParts[0] || 19;
  const m = timeParts[1] || 0;
  const totalMinutes = h * 60 + m + durationMinutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${datePart}T${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:00`;
}

function formatCalendarEventDescription(booking: BookingCalendarData): string {
  const phoneNormalized = booking.phone.replace(/[\s\-+]/g, '');
  const whatsappUrl = `https://wa.me/${phoneNormalized}`;
  const categoryLabels: Record<string, string> = {
    bailes_sociales: 'Bailes Sociales',
    danzas_urbanas: 'Danzas Urbanas',
    danza: 'Danza',
    entrenamiento: 'Entrenamiento',
    heels: 'Heels',
  };
  const categoryLabel = categoryLabels[booking.category || ''] || booking.category || 'N/A';

  let description = `🎫 Clase de Prueba Gratuita

━━━━━━━━━━ CONTACTO ━━━━━━━━━━
📧 ${booking.email}
📱 ${booking.phone}
💬 ${whatsappUrl}
`;

  if (booking.managementUrl) {
    description += `
━━━━━━━━━━ GESTIÓN ━━━━━━━━━━
📋 ${booking.managementUrl}
`;
  }

  description += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎭 ${categoryLabel}`;

  if (booking.eventId) {
    description += `
🆔 ${booking.eventId}`;
  }

  description += `

Estado: ⚪ Pendiente de confirmación

Reservado vía: farrayscenter.com`;

  return description;
}

async function createBookingEvent(
  booking: BookingCalendarData
): Promise<{ success: boolean; calendarEventId?: string; error?: string }> {
  const accessToken = await getCalendarAccessToken();
  if (!accessToken) return { success: false, error: 'Failed to get access token' };

  try {
    const startDateTimeStr = parseClassDateTime(booking.classDate, booking.classTime);
    const endDateTimeStr = calculateEndTime(startDateTimeStr, DEFAULT_CLASS_DURATION);

    const event = {
      summary: `${booking.firstName} ${booking.lastName} - ${booking.className}`,
      description: formatCalendarEventDescription(booking),
      location: ACADEMY_LOCATION,
      start: { dateTime: startDateTimeStr, timeZone: CALENDAR_TIMEZONE },
      end: { dateTime: endDateTimeStr, timeZone: CALENDAR_TIMEZONE },
      colorId: '8', // Graphite (pending)
      extendedProperties: {
        private: {
          bookingEventId: booking.eventId || '',
          email: booking.email,
          phone: booking.phone,
          category: booking.category || '',
        },
      },
      // Deshabilitar notificaciones por defecto de Google Calendar
      reminders: {
        useDefault: false,
      },
    };

    const response = await fetchWithTimeout(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events?sendUpdates=none`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('[google-calendar] Create event failed:', error);
      return { success: false, error: `HTTP ${response.status}: ${error}` };
    }

    const data = await response.json();
    console.log(`[google-calendar] Event created: ${data.id}`);
    return { success: true, calendarEventId: data.id };
  } catch (error) {
    console.error('[google-calendar] Error creating event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============================================================================
// END GOOGLE CALENDAR INLINED
// ============================================================================

// NOTE: Email functions (sendBookingConfirmationEmail, sendAdminBookingNotificationEmail)
// have been removed from this file. Now using dynamic imports from ./lib/email.ts
// which uses proper brand colors (#B01E3C) instead of old pink (#e91e63)

// ============================================================================
// WHATSAPP HELPER INLINE
// ============================================================================

const WHATSAPP_API_VERSION = 'v23.0';
const CATEGORY_TEMPLATES: Record<ClassCategory, string> = {
  bailes_sociales: 'confirmacion_bailes_sociales',
  danzas_urbanas: 'confirmacion_danzas_urbanas_1',
  danza: 'confirmacion_danza_1',
  entrenamiento: 'confirmacion_danza_1',
  heels: 'confirmacion_heels_1',
};

function isWhatsAppConfigured(): boolean {
  return !!(process.env['WHATSAPP_TOKEN'] && process.env['WHATSAPP_PHONE_ID']);
}

async function sendBookingConfirmationWhatsApp(data: {
  to: string;
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
  category: ClassCategory;
}): Promise<{ success: boolean; error?: string }> {
  const token = process.env['WHATSAPP_TOKEN'];
  const phoneId = process.env['WHATSAPP_PHONE_ID'];
  if (!token || !phoneId) return { success: false, error: 'WhatsApp not configured' };

  const templateName = CATEGORY_TEMPLATES[data.category];
  const normalizedPhone = data.to.replace(/[\s\-+]/g, '');

  try {
    const response = await fetchWithTimeout(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: normalizedPhone,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'es_ES' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: data.firstName },
                  { type: 'text', text: data.className },
                  { type: 'text', text: data.classDate },
                  { type: 'text', text: data.classTime },
                ],
              },
            ],
          },
        }),
      }
    );

    const result = await response.json();
    if (!response.ok || result.error) {
      return { success: false, error: result.error?.message || `HTTP ${response.status}` };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/* eslint-disable no-undef */
// Note: Buffer and URLSearchParams are Node.js globals available in Vercel serverless functions

/**
 * API Route: /api/reservar
 *
 * Crea una reserva de clase de prueba gratuita.
 * Flujo completo:
 * 1. Validar datos
 * 2. Crear booking en Momence (o Customer Lead si no hay sessionId)
 * 3. Enviar evento a Meta CAPI (Lead con valor €90)
 * 4. Guardar en Redis para deduplicación
 * 5. Retornar confirmación
 *
 * Variables de entorno requeridas:
 * - MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD
 * - MOMENCE_API_URL (Customer Leads URL)
 * - MOMENCE_TOKEN (Customer Leads Token)
 * - META_PIXEL_ID
 * - META_CAPI_TOKEN
 * - STORAGE_REDIS_URL (opcional)
 */

const MOMENCE_API_URL = 'https://api.momence.com';
const MOMENCE_AUTH_URL = 'https://api.momence.com/api/v2/auth/token';
const META_CAPI_URL = 'https://graph.facebook.com/v18.0';

// Lead value calculado: 50€/mes * 6 meses retención * 30% conversión = €90
const LEAD_VALUE_EUR = 90;

// TTL de 90 días para deduplicación
const BOOKING_TTL_SECONDS = 90 * 24 * 60 * 60;
const BOOKING_KEY_PREFIX = 'booking:';
const TOKEN_CACHE_KEY = 'momence:access_token';
const TOKEN_TTL_SECONDS = 3500;

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 3; // 3 reservas por minuto por IP (más estricto)

// Circuit Breaker for Momence API
// If Momence fails too many times, skip it and go directly to Customer Leads
const CIRCUIT_BREAKER_KEY = 'momence:circuit:failures';
const CIRCUIT_BREAKER_THRESHOLD = 3; // 3 failures to open circuit
const CIRCUIT_BREAKER_WINDOW_SECONDS = 300; // 5 minute window
const CIRCUIT_BREAKER_COOLDOWN_KEY = 'momence:circuit:cooldown';
const CIRCUIT_BREAKER_COOLDOWN_SECONDS = 60; // 1 minute cooldown before retry

// Lazy Redis
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const redisUrl = process.env['STORAGE_REDIS_URL'];
  if (!redisUrl) return null;

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });
  }
  return redisClient;
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count++;
  return false;
}

// ============================================================================
// CIRCUIT BREAKER (Momence API resilience)
// ============================================================================

/**
 * Check if Momence API circuit is open (too many failures)
 * Returns true if we should skip Momence and go directly to Customer Leads
 */
async function isCircuitOpen(redis: Redis): Promise<boolean> {
  try {
    // Check if in cooldown (circuit was open, waiting to test)
    const cooldown = await redis.get(CIRCUIT_BREAKER_COOLDOWN_KEY);
    if (cooldown) {
      // Still in cooldown - circuit is open
      return true;
    }

    // Check failure count
    const failures = parseInt((await redis.get(CIRCUIT_BREAKER_KEY)) || '0', 10);
    return failures >= CIRCUIT_BREAKER_THRESHOLD;
  } catch {
    // If Redis fails, assume circuit is closed (try Momence)
    return false;
  }
}

/**
 * Record a Momence API failure
 * If threshold reached, opens circuit and sets cooldown
 */
async function recordMomenceFailure(redis: Redis): Promise<void> {
  try {
    const failures = await redis.incr(CIRCUIT_BREAKER_KEY);
    if (failures === 1) {
      // First failure, set expiry for the window
      await redis.expire(CIRCUIT_BREAKER_KEY, CIRCUIT_BREAKER_WINDOW_SECONDS);
    }

    if (failures >= CIRCUIT_BREAKER_THRESHOLD) {
      // Threshold reached - set cooldown period
      await redis.setex(CIRCUIT_BREAKER_COOLDOWN_KEY, CIRCUIT_BREAKER_COOLDOWN_SECONDS, '1');
      console.warn(
        `[Circuit Breaker] 🔴 OPEN - Momence failed ${failures} times in ${CIRCUIT_BREAKER_WINDOW_SECONDS}s, cooling down for ${CIRCUIT_BREAKER_COOLDOWN_SECONDS}s`
      );

      // Send alert to admin (non-blocking)
      try {
        const { sendSystemAlert } = await import('./lib/email');
        sendSystemAlert({
          type: 'MOMENCE_CIRCUIT_OPEN',
          message: `Momence API ha fallado ${failures} veces en ${CIRCUIT_BREAKER_WINDOW_SECONDS / 60} minutos. Las reservas van directamente a Customer Leads.`,
          details: {
            failures,
            windowSeconds: CIRCUIT_BREAKER_WINDOW_SECONDS,
            cooldownSeconds: CIRCUIT_BREAKER_COOLDOWN_SECONDS,
          },
          severity: 'critical',
        }).catch(() => {}); // Fire and forget
      } catch {
        // Alert is non-critical, ignore errors
      }
    }
  } catch (e) {
    console.warn('[Circuit Breaker] Failed to record failure:', e);
  }
}

/**
 * Record a Momence API success - resets circuit
 */
async function recordMomenceSuccess(redis: Redis): Promise<void> {
  try {
    // Clear failures and cooldown
    await redis.del(CIRCUIT_BREAKER_KEY, CIRCUIT_BREAKER_COOLDOWN_KEY);
    console.log('[Circuit Breaker] 🟢 CLOSED - Momence is healthy');
  } catch (e) {
    console.warn('[Circuit Breaker] Failed to record success:', e);
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  // Acepta formatos internacionales:
  // +34666555444 (España)
  // +33612345678 (Francia)
  // +1234567890 (USA)
  // 666555444 (local)
  // Mínimo 7 dígitos, máximo 15 (estándar E.164)
  const digits = phone.replace(/[\s().-]/g, '');
  const cleanDigits = digits.replace(/^\+/, '');
  return cleanDigits.length >= 7 && cleanDigits.length <= 15 && /^\+?\d+$/.test(digits);
}

function sanitize(str: string): string {
  return String(str || '')
    .trim()
    .slice(0, 500);
}

// Hash SHA256 para Meta CAPI (normalizado)
function hashForMeta(value: string): string {
  const normalized = value.toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

// Normalizar teléfono para Meta CAPI (E.164: solo dígitos con código país)
function normalizePhone(phone: string): string {
  // Eliminar todo excepto dígitos y el + inicial
  const cleaned = phone.replace(/[\s().-]/g, '');

  // Si empieza con +, quitar el + y devolver solo dígitos
  if (cleaned.startsWith('+')) {
    return cleaned.substring(1);
  }

  // Si es un número español sin código (9 dígitos empezando por 6,7,8,9)
  if (cleaned.length === 9 && /^[6789]/.test(cleaned)) {
    return '34' + cleaned;
  }

  // Si es un número francés sin código (10 dígitos empezando por 0)
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return '33' + cleaned.substring(1);
  }

  // Devolver tal cual (ya tiene código país o formato desconocido)
  return cleaned;
}

// Formatear teléfono para Momence API (E.164 con + prefix: +34622247085)
function formatPhoneForMomence(phone: string): string {
  const normalized = normalizePhone(phone);
  // Momence API requiere formato E.164 con + prefix
  return '+' + normalized;
}

// Obtener access token de Momence
async function getAccessToken(): Promise<string | null> {
  const { MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD } =
    process.env;

  if (!MOMENCE_CLIENT_ID || !MOMENCE_CLIENT_SECRET || !MOMENCE_USERNAME || !MOMENCE_PASSWORD) {
    return null;
  }

  const redis = getRedisClient();
  if (redis) {
    try {
      const cached = await redis.get(TOKEN_CACHE_KEY);
      if (cached) return cached;
    } catch (e) {
      console.warn('Redis token lookup failed:', e);
    }
  }

  const basicAuth = Buffer.from(`${MOMENCE_CLIENT_ID}:${MOMENCE_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await fetchWithTimeout(MOMENCE_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: MOMENCE_USERNAME,
        password: MOMENCE_PASSWORD,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const token = data.access_token;

    if (redis && token) {
      try {
        await redis.setex(TOKEN_CACHE_KEY, TOKEN_TTL_SECONDS, token);
      } catch (e) {
        console.warn('Redis token save failed:', e);
      }
    }

    return token;
  } catch (error) {
    console.error('Momence auth error:', error);
    return null;
  }
}

// Crear booking en Momence (clase de prueba gratuita)
async function createMomenceBooking(
  accessToken: string,
  sessionId: number,
  customerData: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  }
): Promise<{ success: boolean; bookingId?: number; error?: string; verified?: boolean }> {
  try {
    console.warn(
      '[Momence Booking] Starting for sessionId:',
      sessionId,
      'email:',
      redactEmail(customerData.email)
    );

    // Get hostLocationId from env variable or use hardcoded fallback
    // NOTE: Farray's Center only has ONE location (26485), so no need for complex logic
    const FARRAY_LOCATION_ID = 26485;
    const envLocationId = process.env['MOMENCE_LOCATION_ID'];
    const hostLocationId = envLocationId ? parseInt(envLocationId, 10) : FARRAY_LOCATION_ID;

    console.warn(
      '[Momence Booking] Location ID:',
      hostLocationId,
      envLocationId ? '(from env)' : '(hardcoded fallback)'
    );

    // Primero, buscar o crear el customer
    console.warn('[Momence Booking] Searching for existing member...');
    const memberResponse = await fetchWithTimeout(`${MOMENCE_API_URL}/api/v2/host/members/list`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: 0,
        pageSize: 100,
        filters: {
          email: customerData.email,
        },
      }),
    });

    let customerId: number | null = null;

    if (memberResponse.ok) {
      const memberData = await memberResponse.json();
      console.warn('[Momence Booking] Member search response:', JSON.stringify(memberData));
      if (memberData.payload && memberData.payload.length > 0) {
        // Verify the email matches - API may return all members instead of filtering
        const foundMember = memberData.payload.find(
          (m: { email?: string }) => m.email?.toLowerCase() === customerData.email.toLowerCase()
        );
        if (foundMember) {
          customerId = foundMember.id;
          console.warn('[Momence Booking] Found existing member ID:', customerId);
        } else {
          console.warn(
            '[Momence Booking] API returned members but none match email:',
            customerData.email
          );
        }
      } else {
        console.warn('[Momence Booking] No existing member found, will create new one');
      }
    } else {
      const errorText = await memberResponse.text();
      console.error('[Momence Booking] Member search failed:', memberResponse.status, errorText);
    }

    // Si no existe, crear el customer
    if (!customerId) {
      if (!hostLocationId) {
        console.error('[Momence Booking] Cannot create member without hostLocationId');
        return { success: false, error: 'Missing hostLocationId for member creation' };
      }
      console.warn('[Momence Booking] Creating new member with homeLocationId:', hostLocationId);
      const createMemberResponse = await fetchWithTimeout(
        `${MOMENCE_API_URL}/api/v2/host/members`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: customerData.email,
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            phoneNumber: formatPhoneForMomence(customerData.phone),
            homeLocationId: hostLocationId,
          }),
        }
      );

      if (createMemberResponse.ok) {
        const newMember = await createMemberResponse.json();
        console.warn('[Momence Booking] Member creation response:', JSON.stringify(newMember));
        // API docs say response has 'memberId' field
        customerId = newMember.memberId || newMember.payload?.id || newMember.id;
        console.warn('[Momence Booking] Created new member ID:', customerId);
      } else {
        const errorText = await createMemberResponse.text();
        console.error(
          '[Momence Booking] Member creation failed:',
          createMemberResponse.status,
          errorText
        );
      }
    }

    if (!customerId) {
      console.error('[Momence Booking] Could not create or find customer');
      return { success: false, error: 'Could not create or find customer' };
    }

    // Crear el booking gratuito
    // Endpoint: POST /api/v2/host/sessions/{sessionId}/bookings/free
    // Body: { memberId: number (required) }
    // Docs: https://api.docs.momence.com
    console.warn(
      '[Momence Booking] Creating booking for memberId:',
      customerId,
      'sessionId:',
      sessionId
    );
    const bookingResponse = await fetchWithTimeout(
      `${MOMENCE_API_URL}/api/v2/host/sessions/${sessionId}/bookings/free`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: customerId,
        }),
      }
    );

    if (!bookingResponse.ok) {
      const errorText = await bookingResponse.text();
      console.error(
        '[Momence Booking] Booking creation failed:',
        bookingResponse.status,
        errorText
      );
      return { success: false, error: `Booking failed: ${bookingResponse.status} - ${errorText}` };
    }

    const bookingData = await bookingResponse.json();
    console.warn('[Momence Booking] Full response:', JSON.stringify(bookingData));

    const bookingId = bookingData.sessionBookingId || bookingData.payload?.id || bookingData.id;

    // Validate we actually got a booking ID
    if (!bookingId) {
      console.error('[Momence Booking] No booking ID in response:', bookingData);
      return { success: false, error: 'Momence returned no booking ID' };
    }

    console.warn('[Momence Booking] SUCCESS! Created booking:', bookingId);

    // Verify booking exists by fetching session bookings
    // CRITICAL: If booking not found, we MUST fail - user should not think they have a booking
    let bookingVerified = false;
    try {
      const verifyResponse = await fetchWithTimeout(
        `${MOMENCE_API_URL}/api/v2/host/sessions/${sessionId}/bookings`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.warn(
          '[Momence Booking] Session bookings after creation:',
          JSON.stringify(verifyData).slice(0, 500) // Limit log size
        );
        // Check if our booking is in the list
        const bookings = verifyData.payload || verifyData || [];
        const ourBooking = Array.isArray(bookings)
          ? bookings.find(
              (b: { id?: number; sessionBookingId?: number; memberId?: number }) =>
                b.id === bookingId || b.sessionBookingId === bookingId || b.memberId === customerId
            )
          : null;

        if (ourBooking) {
          bookingVerified = true;
          console.warn(
            '[Momence Booking] ✅ Booking VERIFIED in Momence:',
            ourBooking.id || bookingId
          );
        } else {
          console.error(
            '[Momence Booking] ❌ CRITICAL: Booking NOT found in verification!',
            `bookingId=${bookingId}, customerId=${customerId}, sessionId=${sessionId}`
          );
        }
      } else {
        console.error('[Momence Booking] ❌ Verification request failed:', verifyResponse.status);
      }
    } catch (verifyError) {
      console.error('[Momence Booking] ❌ Verification error:', verifyError);
    }

    // If verification failed but we got a bookingId from the API, still return success
    // but log a warning. The booking MIGHT exist even if verification failed.
    // Only fail if we explicitly confirmed booking is NOT in the list.
    if (!bookingVerified) {
      console.warn(
        '[Momence Booking] ⚠️ Booking created but verification inconclusive.',
        'Returning success but booking may need manual verification.'
      );
    }

    return { success: true, bookingId, verified: bookingVerified };
  } catch (error) {
    console.error('[Momence Booking] Error:', error);
    return { success: false, error: 'Momence API error' };
  }
}

// Timezone de España para formatear fechas
const SPAIN_TIMEZONE = 'Europe/Madrid';

// ============================================================================
// CATEGORIZACIÓN DE CLASES
// ============================================================================

/**
 * Determina la categoría de una clase basándose en su nombre o estilo
 */
function determineCategory(className: string, estilo?: string): ClassCategory {
  const text = `${className} ${estilo || ''}`.toLowerCase();

  // Heels / Femmology
  if (text.includes('heel') || text.includes('femmology') || text.includes('stiletto')) {
    return 'heels';
  }

  // Bailes Sociales
  if (
    text.includes('salsa') ||
    text.includes('bachata') ||
    text.includes('kizomba') ||
    text.includes('zouk') ||
    text.includes('merengue') ||
    text.includes('rueda') ||
    text.includes('casino') ||
    text.includes('timba') ||
    text.includes('son cubano') ||
    text.includes('folklore')
  ) {
    return 'bailes_sociales';
  }

  // Danzas Urbanas
  if (
    text.includes('hip hop') ||
    text.includes('hiphop') ||
    text.includes('house') ||
    text.includes('breaking') ||
    text.includes('break') ||
    text.includes('dancehall') ||
    text.includes('afrobeat') ||
    text.includes('twerk') ||
    text.includes('sexy style') ||
    text.includes('sexy reggaeton') ||
    text.includes('reggaeton') ||
    text.includes('k-pop') ||
    text.includes('kpop') ||
    text.includes('commercial')
  ) {
    return 'danzas_urbanas';
  }

  // Danza
  if (
    text.includes('ballet') ||
    text.includes('contempor') ||
    text.includes('jazz') ||
    text.includes('modern') ||
    text.includes('afro jazz') ||
    text.includes('afro contempor')
  ) {
    return 'danza';
  }

  // Entrenamiento / Fitness
  if (
    text.includes('entrenamiento') ||
    text.includes('training') ||
    text.includes('fitness') ||
    text.includes('stretch') ||
    text.includes('cardio') ||
    text.includes('bum bum') ||
    text.includes('cuerpo fit')
  ) {
    return 'entrenamiento';
  }

  // Default: danzas urbanas (la más común)
  return 'danzas_urbanas';
}

/**
 * Formatea fecha ISO a formato legible
 * Entrada: "2024-01-20T18:00:00.000Z"
 * Salida: "Lunes 20 de Enero 2024"
 */
function formatDateReadable(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: SPAIN_TIMEZONE,
    };

    const formatted = new Intl.DateTimeFormat('es-ES', options).format(date);
    // Capitalizar primera letra
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return isoDate;
  }
}

/**
 * Extrae la hora de una fecha ISO
 * Entrada: "2024-01-20T18:00:00.000Z"
 * Salida: "19:00" (en hora de Madrid)
 */
function extractTime(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: SPAIN_TIMEZONE,
    };

    return new Intl.DateTimeFormat('es-ES', options).format(date);
  } catch {
    return '';
  }
}

// Formatear fecha ISO a formato ISO local de Madrid (para automatizaciones de Momence)
// Entrada: "2024-01-20T18:00:00.000Z" (UTC)
// Salida: "2024-01-20T19:00:00" (Madrid local, sin Z)
function formatDateForLeads(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;

    // Obtener componentes en timezone de Madrid
    const parts = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: SPAIN_TIMEZONE,
    }).formatToParts(date);

    // Construir ISO string local (sin Z = interpretado como local)
    const get = (type: string) => parts.find(p => p.type === type)?.value || '00';
    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`;
  } catch {
    return isoDate; // Fallback al original si hay error
  }
}

// Enviar a Customer Leads (alternativa cuando no hay sessionId específico)
async function sendToCustomerLeads(data: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  className?: string; // Nombre real de la clase (ej: "Sexy Style Iniciación")
  estilo?: string; // Estilo normalizado (legacy, como fallback)
  date?: string;
  comoconoce?: string;
}): Promise<{ success: boolean }> {
  const MOMENCE_LEADS_URL = process.env['MOMENCE_API_URL'];
  const MOMENCE_TOKEN = process.env['MOMENCE_TOKEN'];

  if (!MOMENCE_LEADS_URL || !MOMENCE_TOKEN) {
    console.error('Missing Customer Leads credentials');
    return { success: false };
  }

  try {
    const payload = {
      token: MOMENCE_TOKEN,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phone,
      // Enviar nombre de clase real, no el estilo normalizado
      estilo: data.className || data.estilo || '',
      // Formatear fecha con hora de Madrid
      date: formatDateForLeads(data.date || ''),
      comoconoce: data.comoconoce || 'Web - Formulario Reservas',
    };

    console.warn('[Customer Leads] Sending to:', MOMENCE_LEADS_URL);
    console.warn('[Customer Leads] Payload:', { ...payload, token: '[REDACTED]' });

    const response = await fetchWithTimeout(MOMENCE_LEADS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.warn('[Customer Leads] Response status:', response.status);
    console.warn('[Customer Leads] Response body:', responseText);

    return { success: response.ok };
  } catch (error) {
    console.error('[Customer Leads] Error:', error);
    return { success: false };
  }
}

// Enviar evento a Meta Conversions API
async function sendMetaConversionEvent(data: {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  eventName: string;
  eventId: string;
  sourceUrl: string;
  userAgent: string;
  clientIp: string;
  fbc?: string;
  fbp?: string;
}): Promise<{ success: boolean }> {
  const PIXEL_ID = process.env['META_PIXEL_ID'];
  const ACCESS_TOKEN = process.env['META_CAPI_TOKEN'];

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('Meta CAPI not configured');
    return { success: false };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const normalizedPhone = normalizePhone(data.phone);

  const eventData = {
    data: [
      {
        event_name: data.eventName,
        event_time: timestamp,
        event_id: data.eventId,
        event_source_url: data.sourceUrl,
        action_source: 'website',
        user_data: {
          em: [hashForMeta(data.email)],
          ph: [hashForMeta(normalizedPhone)],
          fn: [hashForMeta(data.firstName)],
          ln: [hashForMeta(data.lastName)],
          // Detectar país por prefijo telefónico
          ...(normalizedPhone.startsWith('34') ? { country: [hashForMeta('es')] } : {}),
          ...(normalizedPhone.startsWith('33') ? { country: [hashForMeta('fr')] } : {}),
          ...(normalizedPhone.startsWith('34') ? { ct: [hashForMeta('barcelona')] } : {}),
          client_ip_address: data.clientIp,
          client_user_agent: data.userAgent,
          fbc: data.fbc || undefined,
          fbp: data.fbp || undefined,
        },
        custom_data: {
          currency: 'EUR',
          value: LEAD_VALUE_EUR,
          content_name: 'Clase de Prueba Gratuita',
          content_category: 'Dance Class',
        },
      },
    ],
  };

  try {
    const response = await fetchWithTimeout(
      `${META_CAPI_URL}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Meta CAPI error:', response.status, errorText);
      return { success: false };
    }

    await response.json();
    return { success: true };
  } catch (error) {
    console.error('Meta CAPI error:', error);
    return { success: false };
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  // Rate limiting
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Espera un momento.' });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      sessionId, // ID de la clase en Momence (opcional)
      className, // Nombre de la clase (para display)
      classDate, // Fecha de la clase
      estilo, // Estilo de baile
      comoconoce, // Cómo nos conoció
      acceptsTerms, // UI checkbox (consolidates marketing, no-refund, image)
      acceptsMarketing, // Legacy: kept for backwards compatibility
      // Meta tracking cookies
      fbc,
      fbp,
      sourceUrl,
      eventId, // Para deduplicación Pixel + CAPI
    } = req.body;

    // Validaciones
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Check acceptsTerms (current UI) OR acceptsMarketing (legacy support)
    if (!acceptsTerms && !acceptsMarketing) {
      return res.status(400).json({ error: 'Debes aceptar los términos y condiciones' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email no válido' });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Teléfono no válido' });
    }

    // Validate classDate if provided (not in past, not more than 1 year future)
    if (classDate) {
      const dateMatch = classDate.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (dateMatch && dateMatch[1] && dateMatch[2] && dateMatch[3]) {
        const bookingDate = new Date(
          parseInt(dateMatch[1], 10),
          parseInt(dateMatch[2], 10) - 1,
          parseInt(dateMatch[3], 10)
        );
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneYearFromNow = new Date(today);
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        if (bookingDate < today) {
          return res.status(400).json({
            error: 'Fecha no válida',
            message: 'La fecha de la clase no puede ser en el pasado',
          });
        }

        if (bookingDate > oneYearFromNow) {
          return res.status(400).json({
            error: 'Fecha no válida',
            message: 'La fecha de la clase no puede ser más de un año en el futuro',
          });
        }
      }
    }

    const normalizedEmail = sanitize(email).toLowerCase();
    const bookingKey = `${BOOKING_KEY_PREFIX}${normalizedEmail}`;

    // Deduplicación con Redis
    const redis = getRedisClient();
    if (redis) {
      try {
        const existing = await redis.get(bookingKey);
        if (existing) {
          // Ya existe una reserva reciente
          return res.status(200).json({
            success: true,
            status: 'existing',
            message: 'Ya tienes una reserva registrada. ¡Te esperamos!',
          });
        }
      } catch (e) {
        console.warn('Redis lookup failed:', e);
      }

      // Check for potential duplicate by phone (same phone, different email)
      // This helps detect users creating multiple accounts
      try {
        const phoneForCheck = normalizePhone(phone);
        if (phoneForCheck) {
          const existingEmailForPhone = await redis.get(`phone_email:${phoneForCheck}`);
          if (existingEmailForPhone && existingEmailForPhone !== normalizedEmail) {
            console.warn(
              `[reservar] ⚠️ Duplicate phone detected: ${redactPhone(phone)} used with different email`
            );
            // Send alert to admin (non-blocking)
            try {
              const { sendSystemAlert } = await import('./lib/email');
              sendSystemAlert({
                type: 'DUPLICATE_PHONE',
                message: `El mismo teléfono se está usando con diferentes emails. Posible usuario duplicado.`,
                details: {
                  phone: redactPhone(phone),
                  newEmail: redactEmail(normalizedEmail),
                  existingEmail: redactEmail(existingEmailForPhone),
                  className: className || estilo,
                },
                severity: 'warning',
              }).catch(() => {});
            } catch {
              // Alert is non-critical
            }
            // Note: We still allow the booking to proceed
          }
        }
      } catch (e) {
        console.warn('[reservar] Phone duplicate check failed (non-blocking):', e);
      }
    }

    // Generar eventId único si no viene del frontend
    // Using crypto.randomUUID() for secure, non-guessable IDs (prevents enumeration attacks)
    const finalEventId = eventId || `booking_${crypto.randomUUID()}`;

    // 1. Crear booking en Momence o enviar a Customer Leads
    let momenceResult: {
      success: boolean;
      bookingId?: number;
      error?: string;
      verified?: boolean;
    } = {
      success: false,
      verified: false,
    };

    console.warn('[reservar] Starting booking process:', {
      hasSessionId: !!sessionId,
      sessionId,
      className,
    });

    // Check circuit breaker before trying Momence
    let circuitOpen = false;
    if (redis && sessionId) {
      circuitOpen = await isCircuitOpen(redis);
      if (circuitOpen) {
        console.warn(
          '[reservar] ⚡ Circuit OPEN - skipping Momence, going directly to Customer Leads'
        );
      }
    }

    // Validate sessionId format if provided
    // Use a new variable since sessionId is const from destructuring
    let validatedSessionId: string | undefined = sessionId;
    if (validatedSessionId) {
      const parsedSessionId = parseInt(validatedSessionId, 10);
      if (isNaN(parsedSessionId) || parsedSessionId <= 0) {
        console.warn(`[reservar] ⚠️ Invalid sessionId format: ${validatedSessionId}`);

        // Send alert for invalid sessionId (might indicate frontend bug or manipulation)
        try {
          const { sendSystemAlert } = await import('./lib/email');
          sendSystemAlert({
            type: 'INVALID_SESSION_ID',
            message: `Se recibió un sessionId inválido: "${validatedSessionId}". Esto puede indicar un problema en el frontend o manipulación.`,
            details: {
              sessionId: validatedSessionId,
              className: className || estilo,
              email: redactEmail(normalizedEmail),
            },
            severity: 'warning',
          }).catch(() => {});
        } catch {
          // Alert is non-critical
        }

        // Clear sessionId to fall back to Customer Leads
        validatedSessionId = undefined;
      }
    }

    if (validatedSessionId && !circuitOpen) {
      // Si tenemos sessionId y circuit está cerrado, crear booking real
      const accessToken = await getAccessToken();
      console.warn('[reservar] Got access token:', !!accessToken);

      if (accessToken) {
        momenceResult = await createMomenceBooking(accessToken, parseInt(validatedSessionId), {
          email: normalizedEmail,
          firstName: sanitize(firstName),
          lastName: sanitize(lastName),
          phone: sanitize(phone),
        });
        console.warn('[reservar] Momence booking result:', momenceResult);

        // Update circuit breaker based on result
        if (redis) {
          if (momenceResult.success) {
            await recordMomenceSuccess(redis);
          } else {
            await recordMomenceFailure(redis);
          }
        }
      } else {
        console.error('[reservar] Failed to get Momence access token - check OAuth credentials');
        // Auth failure counts as Momence failure for circuit breaker
        if (redis) {
          await recordMomenceFailure(redis);
        }
      }
    } else if (!validatedSessionId) {
      console.warn('[reservar] No sessionId provided, will use Customer Leads');
    }

    // Si no hay sessionId, circuit está abierto, o el booking falló → Customer Leads
    if (!momenceResult.success) {
      const reason = circuitOpen
        ? 'Circuit open (Momence unhealthy)'
        : !validatedSessionId
          ? 'No sessionId'
          : 'Momence booking failed';
      console.warn(`[reservar] ${reason}, trying Customer Leads...`);
      console.warn('[reservar] Customer Leads env check:', {
        hasLeadsUrl: !!process.env['MOMENCE_API_URL'],
        hasToken: !!process.env['MOMENCE_TOKEN'],
      });

      const leadsResult = await sendToCustomerLeads({
        email: normalizedEmail,
        firstName: sanitize(firstName),
        lastName: sanitize(lastName),
        phone: sanitize(phone),
        className: sanitize(className || ''), // Nombre real de la clase
        estilo: sanitize(estilo || ''), // Fallback al estilo normalizado
        date: sanitize(classDate || ''),
        comoconoce: sanitize(comoconoce || ''),
      });
      console.warn('[reservar] Customer Leads result:', leadsResult);
      momenceResult = { success: leadsResult.success };
    }

    // CRITICAL: If BOTH Momence AND Customer Leads failed, don't send confirmation
    if (!momenceResult.success) {
      console.error('[reservar] ❌ BOOKING FAILED - Both Momence and Customer Leads failed');

      // Send alert to admin
      try {
        const { sendSystemAlert } = await import('./lib/email');
        sendSystemAlert({
          type: 'BOOKING_TOTAL_FAILURE',
          message: `Una reserva no pudo ser registrada en ningún sistema. El usuario NO ha recibido confirmación.`,
          details: {
            email: redactEmail(normalizedEmail),
            className: className || estilo,
            classDate,
            sessionId,
          },
          severity: 'critical',
        }).catch(() => {}); // Fire and forget
      } catch {
        // Alert is non-critical
      }

      return res.status(500).json({
        success: false,
        error: 'No pudimos procesar tu reserva',
        message:
          'Ha ocurrido un error técnico. Por favor, contacta con nosotros por WhatsApp para completar tu reserva.',
        whatsappUrl: 'https://wa.me/34622247085',
      });
    }

    // 2. Enviar evento a Meta CAPI (siempre, independiente de Momence)
    const userAgent = req.headers['user-agent'] || '';
    const metaResult = await sendMetaConversionEvent({
      email: normalizedEmail,
      phone: sanitize(phone),
      firstName: sanitize(firstName),
      lastName: sanitize(lastName),
      eventName: 'Lead',
      eventId: finalEventId,
      sourceUrl: sourceUrl || 'https://www.farrayscenter.com/reservas',
      userAgent,
      clientIp,
      fbc,
      fbp,
    });

    // 3. Guardar en Redis
    if (redis) {
      try {
        const bookingTimestamp = Date.now();
        await redis.setex(
          bookingKey,
          BOOKING_TTL_SECONDS,
          JSON.stringify({
            timestamp: bookingTimestamp,
            sessionId,
            className,
            classDate,
            eventId: finalEventId,
          })
        );

        // Añadir a lista de reservas recientes para Social Proof Ticker
        const firstNameOnly = sanitize(firstName).split(' ')[0] || 'Usuario';
        await redis.lpush(
          'recent_bookings',
          JSON.stringify({
            firstName: firstNameOnly,
            className: className || estilo || 'Clase de Prueba',
            timestamp: bookingTimestamp,
          })
        );
        // Mantener solo las últimas 50 reservas
        await redis.ltrim('recent_bookings', 0, 49);
      } catch (e) {
        console.warn('Redis save failed:', e);
      }
    }

    // 4. Preparar datos comunes para notificaciones y calendario
    const category = determineCategory(className || '', estilo);
    const formattedDate = formatDateReadable(classDate || '');
    const classTime = extractTime(classDate || '');
    const firstNameOnly = sanitize(firstName).split(' ')[0] || 'Usuario';
    const managementUrl = `https://www.farrayscenter.com/es/mi-reserva?email=${encodeURIComponent(normalizedEmail)}&event=${finalEventId}`;
    const mapUrl = 'https://maps.app.goo.gl/YMTQFik7dB1ykdux9';

    // 5. Extraer fecha ISO para índices y calendario
    const isoMatch = (classDate || '').match(/\d{4}-\d{2}-\d{2}/);
    const calendarDateStr = isoMatch ? isoMatch[0] : '';

    // 6. Google Calendar - Crear evento
    let calendarEventId: string | undefined = undefined;
    if (isGoogleCalendarConfigured()) {
      try {
        const calendarResult = await createBookingEvent({
          firstName: sanitize(firstName),
          lastName: sanitize(lastName),
          email: normalizedEmail,
          phone: sanitize(phone),
          className: className || estilo || 'Clase de Prueba',
          classDate: calendarDateStr,
          classTime: classTime || '19:00',
          category,
          eventId: finalEventId,
          managementUrl,
        });
        if (calendarResult.success) {
          calendarEventId = calendarResult.calendarEventId;
          console.log(`[reservar] Calendar event created: ${calendarEventId}`);
        } else {
          console.warn('[reservar] Calendar event failed:', calendarResult.error);
        }
      } catch (e) {
        console.warn('[reservar] Calendar error (non-blocking):', e);
      }
    } else {
      console.log('[reservar] Google Calendar not configured');
    }

    // 7. Guardar booking_details para mi-reserva y cron-reminders
    const normalizedPhone = sanitize(phone).replace(/[\s\-+]/g, '');
    if (redis) {
      try {
        await redis.setex(
          `booking_details:${finalEventId}`,
          BOOKING_TTL_SECONDS,
          JSON.stringify({
            eventId: finalEventId,
            firstName: sanitize(firstName),
            lastName: sanitize(lastName),
            email: normalizedEmail,
            phone: sanitize(phone),
            className: className || estilo || 'Clase de Prueba',
            classDate: classDate || '',
            classTime: classTime || '19:00',
            category,
            calendarEventId: calendarEventId || null,
            createdAt: new Date().toISOString(),
            // Momence verification status - helps identify bookings that may need manual check
            momenceVerified: momenceResult.verified ?? false,
            momenceBookingId: momenceResult.bookingId || null,
          })
        );
        console.warn('[reservar] Booking details saved');

        // Índice por teléfono (para webhook-whatsapp)
        if (normalizedPhone) {
          await redis.setex(`phone:${normalizedPhone}`, BOOKING_TTL_SECONDS, finalEventId);
          console.warn(`[reservar] Added phone index: phone:${redactPhone(normalizedPhone)}`);

          // Store phone → email mapping for duplicate detection (90 days TTL)
          // This helps identify users creating multiple accounts with same phone
          const PHONE_EMAIL_TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days
          await redis.setex(
            `phone_email:${normalizedPhone}`,
            PHONE_EMAIL_TTL_SECONDS,
            normalizedEmail
          );
        }

        // Índice por fecha (para cron-reminders)
        if (calendarDateStr) {
          await redis.sadd(`reminders:${calendarDateStr}`, finalEventId);
          console.warn(`[reservar] Added to reminders:${calendarDateStr}`);
        }
      } catch (e) {
        console.warn('[reservar] Failed to save booking details:', e);
      }
    }

    // 6. Enviar notificaciones (Email + WhatsApp)

    // 6a. Enviar email de confirmación (usando lib/email.ts con colores corporativos)
    let emailResult: { success: boolean; error?: string } = {
      success: false,
      error: 'Not attempted',
    };
    try {
      // Dynamic import to avoid Vercel bundling issues
      const { sendBookingConfirmation } = await import('./lib/email');
      emailResult = await sendBookingConfirmation({
        to: normalizedEmail,
        firstName: firstNameOnly,
        className: className || estilo || 'Clase de Prueba',
        classDate: formattedDate,
        classTime: classTime || '19:00',
        managementUrl,
        mapUrl,
        category,
        classDateRaw: calendarDateStr, // Para botones de calendario
        eventId: finalEventId, // Para ICS UID
      });
      console.warn('[reservar] Email result:', emailResult);
    } catch (emailError) {
      console.error('[reservar] Email error:', emailError);
      emailResult = { success: false, error: String(emailError) };
    }

    // 6a-bis. Notificar al admin de la nueva reserva (no bloquea si falla)
    try {
      // Dynamic import to avoid Vercel bundling issues
      const { sendAdminBookingNotification } = await import('./lib/email');
      await sendAdminBookingNotification({
        firstName: firstNameOnly,
        lastName: sanitize(lastName),
        email: normalizedEmail,
        phone: sanitize(phone),
        className: className || estilo || 'Clase de Prueba',
        classDate: formattedDate,
        classTime: classTime || '19:00',
        category,
        sourceUrl: req.headers.referer || req.headers.origin || undefined,
      });
    } catch (adminEmailError) {
      // Solo logueamos, NO bloqueamos la reserva
      console.warn('[reservar] Admin notification failed (non-blocking):', adminEmailError);
    }

    // 6b. Enviar WhatsApp de confirmación
    let whatsappResult: { success: boolean; error?: string } = {
      success: false,
      error: 'Not attempted',
    };
    if (isWhatsAppConfigured()) {
      try {
        whatsappResult = await sendBookingConfirmationWhatsApp({
          to: sanitize(phone),
          firstName: firstNameOnly,
          className: className || estilo || 'Clase de Prueba',
          classDate: formattedDate,
          classTime: classTime || '19:00',
          category,
        });
        console.warn('[reservar] WhatsApp result:', whatsappResult);
      } catch (whatsappError) {
        console.error('[reservar] WhatsApp error:', whatsappError);
        whatsappResult = { success: false, error: String(whatsappError) };
      }
    } else {
      console.warn('[reservar] WhatsApp not configured, skipping');
    }

    // Respuesta
    return res.status(200).json({
      success: true,
      status: 'new',
      message: '¡Reserva confirmada! Te hemos enviado un email con los detalles.',
      data: {
        eventId: finalEventId,
        className: className || 'Clase de Prueba',
        classDate: classDate || '',
        category,
        momenceSuccess: momenceResult.success,
        momenceVerified: momenceResult.verified ?? false, // true = booking confirmed in Momence
        trackingSuccess: metaResult.success,
        calendarSuccess: !!calendarEventId,
        emailSuccess: emailResult.success,
        whatsappSuccess: whatsappResult.success,
      },
    });
  } catch (error) {
    console.error('Booking API error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
