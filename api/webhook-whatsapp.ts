/* global Buffer */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { Redis } from '@upstash/redis';

// ============================================================================
// GOOGLE CALENDAR INLINED (Vercel bundler no incluye ./lib/email)
// ============================================================================

type AttendanceStatus = 'pending' | 'confirmed' | 'not_attending' | 'cancelled';

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const CALENDAR_TOKEN_URL = 'https://oauth2.googleapis.com/token';

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  pending: '8', // Graphite (gris)
  confirmed: '10', // Basil (verde)
  not_attending: '11', // Tomato (rojo)
  cancelled: '5', // Banana (amarillo)
};

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
    const response = await fetch(CALENDAR_TOKEN_URL, {
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

function getStatusText(status: AttendanceStatus): string {
  switch (status) {
    case 'pending':
      return '⚪ Pendiente de confirmación';
    case 'confirmed':
      return '🟢 Confirmado - Asistirá';
    case 'not_attending':
      return '🔴 No asistirá';
    case 'cancelled':
      return '⚫ Reserva cancelada';
    default:
      return '❓ Desconocido';
  }
}

async function updateEventAttendance(
  calendarEventId: string,
  status: AttendanceStatus
): Promise<{ success: boolean; error?: string; calendarEventId?: string }> {
  const accessToken = await getCalendarAccessToken();
  if (!accessToken) return { success: false, error: 'Failed to get access token' };

  try {
    const getResponse = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events/${calendarEventId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!getResponse.ok) return { success: false, error: `Event not found: ${calendarEventId}` };

    const currentEvent = await getResponse.json();
    let description = currentEvent.description || '';

    const statusText = getStatusText(status);
    if (description.includes('Estado:')) {
      description = description.replace(/Estado: .+/, `Estado: ${statusText}`);
    } else {
      description += `\n\n━━━━━━━━━━━━━━━━━━━━\nEstado: ${statusText}`;
    }

    const patchResponse = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events/${calendarEventId}`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ colorId: STATUS_COLORS[status], description }),
      }
    );

    if (!patchResponse.ok) {
      const error = await patchResponse.text();
      return { success: false, error: `HTTP ${patchResponse.status}: ${error}` };
    }

    console.log(`[google-calendar] Event ${calendarEventId} updated to ${status}`);
    return { success: true, calendarEventId };
  } catch (error) {
    console.error('[google-calendar] Error updating event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============================================================================
// END GOOGLE CALENDAR INLINED
// ============================================================================

/**
 * API Route: /api/webhook-whatsapp
 *
 * Webhook para recibir eventos de WhatsApp Cloud API.
 * Procesa respuestas de quick reply buttons para confirmación de asistencia.
 *
 * GET: Verificación del webhook (requerido por Meta)
 * POST: Recepción de mensajes y eventos
 *
 * Quick Reply Buttons (plantilla recordatorio_prueba_2):
 * - "Sí, asistiré": El alumno confirma que asistirá → attendance = 'confirmed'
 * - "No podré ir": El alumno no asistirá → attendance = 'not_attending'
 *
 * Variables de entorno requeridas:
 * - WHATSAPP_WEBHOOK_VERIFY_TOKEN: Token para verificación del webhook
 * - WHATSAPP_TOKEN: Token de acceso de WhatsApp
 * - WHATSAPP_PHONE_ID: ID del número de WhatsApp Business
 * - STORAGE_REDIS_URL: URL de Redis
 */

// ============================================================================
// WHATSAPP INLINE (evitar imports de api/lib/ que fallan en Vercel)
// ============================================================================

const WHATSAPP_API_VERSION = 'v23.0';

function getWhatsAppConfig() {
  const token = process.env['WHATSAPP_TOKEN'];
  const phoneId = process.env['WHATSAPP_PHONE_ID'];

  if (!token || !phoneId) {
    return null;
  }

  return {
    token,
    phoneId,
    apiUrl: `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneId}/messages`,
  };
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-+]/g, '');
}

async function sendTextMessage(
  to: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  const config = getWhatsAppConfig();
  if (!config) {
    return { success: false, error: 'WhatsApp not configured' };
  }

  const normalizedPhone = normalizePhone(to);

  const message = {
    messaging_product: 'whatsapp',
    to: normalizedPhone,
    type: 'text',
    text: { body: text },
  };

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`,
      },
      body: JSON.stringify(message),
    });

    const data = (await response.json()) as { error?: { message: string } };

    if (!response.ok || data.error) {
      console.error('WhatsApp API error:', data.error);
      return { success: false, error: data.error?.message || `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============================================================================
// LAZY REDIS (HTTP-based @upstash/redis - more reliable in serverless)
// ============================================================================

let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const url = process.env['UPSTASH_REDIS_REST_URL'];
  const token = process.env['UPSTASH_REDIS_REST_TOKEN'];

  if (!url || !token) return null;

  if (!redisClient) {
    redisClient = new Redis({ url, token });
  }
  return redisClient;
}

// ============================================================================
// TIPOS
// ============================================================================

interface BookingDetails {
  eventId?: string; // Added for tracking
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  category: string;
  calendarEventId?: string | null;
  createdAt: string;
  status?: 'confirmed' | 'cancelled';
  attendance?: 'pending' | 'confirmed' | 'not_attending';
  attendanceUpdatedAt?: string;
}

interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: { name: string };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: 'text' | 'button' | 'interactive';
          text?: { body: string };
          button?: {
            payload: string;
            text: string;
          };
          interactive?: {
            type: 'button_reply' | 'list_reply';
            button_reply?: {
              id: string;
              title: string;
            };
          };
        }>;
        statuses?: Array<{
          id: string;
          status: 'sent' | 'delivered' | 'read' | 'failed';
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

// ============================================================================
// HANDLER
// ============================================================================

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> {
  // GET: Verificación del webhook (Meta challenge)
  if (req.method === 'GET') {
    return handleVerification(req, res);
  }

  // POST: Recibir mensajes y eventos
  if (req.method === 'POST') {
    return handleWebhook(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// ============================================================================
// VERIFICACIÓN (GET)
// ============================================================================

function handleVerification(req: VercelRequest, res: VercelResponse): VercelResponse {
  const verifyToken = process.env['WHATSAPP_WEBHOOK_VERIFY_TOKEN'];

  if (!verifyToken) {
    console.error('[webhook-whatsapp] WHATSAPP_WEBHOOK_VERIFY_TOKEN not configured');
    return res.status(500).send('Webhook not configured');
  }

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[webhook-whatsapp] Webhook verified successfully');
    return res.status(200).send(challenge);
  }

  console.warn('[webhook-whatsapp] Verification failed - token mismatch');
  return res.status(403).send('Verification failed');
}

// ============================================================================
// WEBHOOK (POST)
// ============================================================================

async function handleWebhook(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  // Verificar firma (opcional pero recomendado)
  const signature = req.headers['x-hub-signature-256'];
  if (signature && !verifySignature(req.body, signature as string)) {
    console.warn('[webhook-whatsapp] Invalid signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const payload = req.body as WhatsAppWebhookPayload;

  // IMPORTANTE: Procesar ANTES de responder para evitar que Vercel termine la función
  // Meta permite hasta 20 segundos para responder, nuestro procesamiento es < 5s
  try {
    console.log('[webhook-whatsapp] Processing payload before response...');
    await processWebhookPayload(payload);
    console.log('[webhook-whatsapp] Payload processing completed');
  } catch (error) {
    console.error('[webhook-whatsapp] Error processing payload:', error);
  }

  // Responder 200 DESPUÉS de procesar (Meta requiere respuesta en <20s)
  return res.status(200).json({ status: 'received' });
}

// ============================================================================
// PROCESAMIENTO DE PAYLOAD
// ============================================================================

async function processWebhookPayload(payload: WhatsAppWebhookPayload): Promise<void> {
  if (payload.object !== 'whatsapp_business_account') {
    console.log('[webhook-whatsapp] Ignoring non-whatsapp event');
    return;
  }

  for (const entry of payload.entry) {
    for (const change of entry.changes) {
      const { value } = change;

      // Procesar mensajes
      if (value.messages) {
        for (const message of value.messages) {
          await processMessage(message, value.contacts?.[0]);
        }
      }

      // Log de statuses (para debugging)
      if (value.statuses) {
        for (const status of value.statuses) {
          console.log(`[webhook-whatsapp] Message ${status.id} status: ${status.status}`);
        }
      }
    }
  }
}

async function processMessage(
  message: NonNullable<WhatsAppWebhookPayload['entry'][0]['changes'][0]['value']['messages']>[0],
  contact?: { profile: { name: string }; wa_id: string }
): Promise<void> {
  const phone = message.from;
  const contactName = contact?.profile?.name || 'Usuario';

  console.log(`[webhook-whatsapp] Message from ${phone} (${contactName}): type=${message.type}`);

  // Procesar quick reply buttons
  if (message.type === 'button' && message.button) {
    const payload = message.button.payload;
    console.log(`[webhook-whatsapp] Button payload: ${payload}`);

    // Normalizar payload para comparación (quitar acentos, lowercase)
    const normalizedPayload = payload
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    console.log(`[webhook-whatsapp] Normalized payload: "${normalizedPayload}"`);

    if (normalizedPayload.includes('si') && normalizedPayload.includes('asistir')) {
      // "Sí, asistiré" o variaciones
      console.log(
        `[webhook-whatsapp] Matched: Sí, asistiré - calling handleAttendanceConfirmation`
      );
      try {
        await handleAttendanceConfirmation(phone, 'confirmed');
      } catch (e) {
        console.error(`[webhook-whatsapp] Error in handleAttendanceConfirmation:`, e);
      }
    } else if (normalizedPayload.includes('no') && normalizedPayload.includes('podr')) {
      // "No podré ir" o variaciones
      console.log(`[webhook-whatsapp] Matched: No podré ir - calling handleAttendanceConfirmation`);
      try {
        await handleAttendanceConfirmation(phone, 'not_attending');
      } catch (e) {
        console.error(`[webhook-whatsapp] Error in handleAttendanceConfirmation:`, e);
      }
    } else {
      console.log(`[webhook-whatsapp] No match for payload: "${normalizedPayload}"`);
    }
  }

  // También manejar interactive buttons (otro formato posible)
  if (message.type === 'interactive' && message.interactive?.button_reply) {
    const buttonId = message.interactive.button_reply.id;
    const buttonTitle = message.interactive.button_reply.title;
    console.log(`[webhook-whatsapp] Interactive button: id=${buttonId}, title=${buttonTitle}`);

    // Normalizar para comparación
    const normalizedTitle = (buttonTitle || buttonId)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (normalizedTitle.includes('si') && normalizedTitle.includes('asistir')) {
      await handleAttendanceConfirmation(phone, 'confirmed');
    } else if (normalizedTitle.includes('no') && normalizedTitle.includes('podr')) {
      await handleAttendanceConfirmation(phone, 'not_attending');
    }
  }

  // Log mensajes de texto (para debugging)
  if (message.type === 'text' && message.text) {
    console.log(`[webhook-whatsapp] Text message: "${message.text.body}"`);
  }
}

// ============================================================================
// CONFIRMACIÓN DE ASISTENCIA
// ============================================================================

/**
 * Calcula si faltan más de X horas para la clase
 * @param classDate - Fecha de la clase (puede ser ISO o formato español)
 * @param classTime - Hora de la clase (HH:MM)
 * @param hoursThreshold - Número de horas mínimas (default 1)
 */
function isMoreThanHoursBeforeClass(
  classDate: string,
  classTime: string,
  hoursThreshold: number = 1
): boolean {
  try {
    // Extraer fecha ISO (YYYY-MM-DD) del classDate
    const isoMatch = classDate.match(/\d{4}-\d{2}-\d{2}/);
    if (!isoMatch) {
      console.warn('[webhook-whatsapp] Could not parse classDate:', classDate);
      return true; // Por defecto, permitir cancelación
    }

    const dateStr = isoMatch[0];
    const [hours, minutes] = (classTime || '19:00').split(':').map(Number);

    // Crear fecha de la clase en timezone de España
    const classDateTime = new Date(
      `${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
    );

    // Calcular diferencia en horas
    const now = new Date();
    const diffMs = classDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    console.log(
      `[webhook-whatsapp] Time check: class at ${classDateTime.toISOString()}, now ${now.toISOString()}, diff ${diffHours.toFixed(2)}h`
    );

    return diffHours > hoursThreshold;
  } catch (error) {
    console.error('[webhook-whatsapp] Error checking time:', error);
    return true; // Por defecto, permitir cancelación
  }
}

async function handleAttendanceConfirmation(
  phone: string,
  status: 'confirmed' | 'not_attending'
): Promise<void> {
  console.log(
    `[webhook-whatsapp] handleAttendanceConfirmation called: phone=${phone}, status=${status}`
  );

  const redis = getRedisClient();

  if (!redis) {
    console.error(
      '[webhook-whatsapp] Redis not configured - missing UPSTASH_REDIS_REST_URL or TOKEN'
    );
    return;
  }

  console.log(`[webhook-whatsapp] Redis client obtained, searching for booking...`);

  try {
    // Buscar booking por teléfono
    const booking = await findBookingByPhone(redis, phone);
    console.log(
      `[webhook-whatsapp] findBookingByPhone result:`,
      booking ? `Found: ${booking.firstName}` : 'Not found'
    );

    if (!booking) {
      console.warn(`[webhook-whatsapp] No booking found for phone ${phone}`);
      // Enviar mensaje de error amigable
      await sendTextMessage(
        phone,
        '❓ No encontramos una reserva activa con tu número. ¿Has hecho una reserva recientemente? Visita farrayscenter.com/reservas'
      );
      return;
    }

    const eventId = booking.eventId || '';

    // Si confirma asistencia
    if (status === 'confirmed') {
      booking.attendance = 'confirmed';
      booking.attendanceUpdatedAt = new Date().toISOString();

      await redis.set(`booking_details:${eventId}`, JSON.stringify(booking));
      console.log(`[webhook-whatsapp] Attendance confirmed: ${booking.firstName}`);

      // Google Calendar - Actualizar a confirmado
      if (isGoogleCalendarConfigured() && booking.calendarEventId) {
        try {
          await updateEventAttendance(booking.calendarEventId, 'confirmed');
          console.log(`[webhook-whatsapp] Calendar updated to confirmed`);
        } catch (e) {
          console.warn('[webhook-whatsapp] Calendar update failed:', e);
        }
      }

      await sendTextMessage(
        phone,
        `¡Perfecto ${booking.firstName}! 💃 Te esperamos en tu clase de ${booking.className}.\n\n📍 C/ Entença 100, Local 1, Barcelona\n⏰ Recuerda llegar 10 minutos antes.\n\n¡Nos vemos!`
      );
      return;
    }

    // Si NO puede asistir, verificar si puede cancelar (> 1 hora antes)
    const canCancel = isMoreThanHoursBeforeClass(booking.classDate, booking.classTime, 1);

    if (canCancel) {
      // CANCELACIÓN COMPLETA: > 1 hora antes de la clase
      booking.status = 'cancelled';
      booking.attendance = 'not_attending';
      booking.attendanceUpdatedAt = new Date().toISOString();

      await redis.set(`booking_details:${eventId}`, JSON.stringify(booking));

      // Eliminar deduplicación para que pueda reservar otro día
      const normalizedEmail = booking.email.toLowerCase();
      await redis.del(`booking:${normalizedEmail}`);
      console.log(`[webhook-whatsapp] Deduplication removed for ${normalizedEmail}`);

      // Eliminar del índice de teléfono
      const normalizedPhone = phone.replace(/[\s\-+]/g, '');
      await redis.del(`phone:${normalizedPhone}`);

      console.log(`[webhook-whatsapp] Booking cancelled: ${booking.firstName}`);

      // Google Calendar - Actualizar a cancelado
      if (isGoogleCalendarConfigured() && booking.calendarEventId) {
        try {
          await updateEventAttendance(booking.calendarEventId, 'cancelled');
          console.log(`[webhook-whatsapp] Calendar updated to cancelled`);
        } catch (e) {
          console.warn('[webhook-whatsapp] Calendar update failed:', e);
        }
      }

      // Mensaje con opción de reprogramar
      const reprogramUrl = `farrayscenter.com/es/mi-reserva?email=${encodeURIComponent(booking.email)}&event=${eventId}`;

      await sendTextMessage(
        phone,
        `Entendido ${booking.firstName}. Tu reserva ha sido cancelada. 😊\n\n📋 Reprogramar clase:\n👉 ${reprogramUrl}\n\n¡Te esperamos cuando puedas!`
      );
    } else {
      // NO PUEDE CANCELAR: < 1 hora antes de la clase
      booking.attendance = 'not_attending';
      booking.attendanceUpdatedAt = new Date().toISOString();
      // NO marcamos como cancelled, NO eliminamos deduplicación

      await redis.set(`booking_details:${eventId}`, JSON.stringify(booking));

      console.log(`[webhook-whatsapp] Late cancellation (no dedup removal): ${booking.firstName}`);

      // Google Calendar - Actualizar a not_attending
      if (isGoogleCalendarConfigured() && booking.calendarEventId) {
        try {
          await updateEventAttendance(booking.calendarEventId, 'not_attending');
          console.log(`[webhook-whatsapp] Calendar updated to not_attending`);
        } catch (e) {
          console.warn('[webhook-whatsapp] Calendar update failed:', e);
        }
      }

      await sendTextMessage(
        phone,
        `Entendido ${booking.firstName}. Lamentamos que no puedas venir.\n\n⚠️ Como faltan menos de 1 hora para la clase, no es posible reprogramar.\n\nSi tienes algún problema, contáctanos:\n📞 +34 622 247 085`
      );
    }
  } catch (error) {
    console.error('[webhook-whatsapp] Error handling attendance:', error);
  }
}

// ============================================================================
// BÚSQUEDA DE BOOKING POR TELÉFONO
// ============================================================================

async function findBookingByPhone(redis: Redis, phone: string): Promise<BookingDetails | null> {
  // Normalizar teléfono
  const normalizedPhone = phone.replace(/[\s\-+]/g, '');
  console.log(`[webhook-whatsapp] findBookingByPhone: normalized phone = ${normalizedPhone}`);

  // Buscar en índice de teléfonos (creado en reservar.ts)
  console.log(`[webhook-whatsapp] Checking phone index: phone:${normalizedPhone}`);
  let eventId: string | null = null;
  try {
    console.log(`[webhook-whatsapp] About to call redis.get with timeout...`);
    // Add timeout to detect hanging calls
    const timeoutPromise = new Promise<string | null>((_, reject) =>
      setTimeout(() => reject(new Error('Redis timeout after 5s')), 5000)
    );
    const result = await Promise.race([
      redis.get<string>(`phone:${normalizedPhone}`),
      timeoutPromise,
    ]);
    eventId = result;
    console.log(
      `[webhook-whatsapp] phone index result: ${eventId || 'null'} (type: ${typeof eventId})`
    );
  } catch (redisError) {
    console.error(`[webhook-whatsapp] Redis get error:`, redisError);
    // Try creating a fresh Redis client
    console.log(`[webhook-whatsapp] Trying fresh Redis client...`);
    try {
      const url = process.env['UPSTASH_REDIS_REST_URL'];
      const token = process.env['UPSTASH_REDIS_REST_TOKEN'];
      if (url && token) {
        const freshRedis = new Redis({ url, token });
        const freshResult = await freshRedis.get<string>(`phone:${normalizedPhone}`);
        eventId = freshResult;
        console.log(`[webhook-whatsapp] Fresh client result: ${eventId || 'null'}`);
      }
    } catch (freshError) {
      console.error(`[webhook-whatsapp] Fresh Redis also failed:`, freshError);
      return null;
    }
  }

  if (eventId) {
    const bookingData = await redis.get(`booking_details:${eventId}`);
    console.log(
      `[webhook-whatsapp] booking_details:${eventId} = ${bookingData ? 'found' : 'not found'}`
    );
    if (bookingData) {
      const booking: BookingDetails = JSON.parse(bookingData);
      // Solo retornar si no está cancelada
      if (booking.status !== 'cancelled') {
        console.log(`[webhook-whatsapp] Found booking via phone index: ${booking.firstName}`);
        return booking;
      }
      console.log(`[webhook-whatsapp] Booking found but status = ${booking.status}`);
    }
  }

  // Fallback: buscar en reminders de próximos 7 días
  console.log(`[webhook-whatsapp] Phone index not found, trying reminders fallback...`);
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];

    const eventIds = await redis.smembers(`reminders:${dateKey}`);
    console.log(`[webhook-whatsapp] reminders:${dateKey} = ${eventIds.length} events`);

    for (const evId of eventIds) {
      const bookingData = await redis.get(`booking_details:${evId}`);
      if (bookingData) {
        const booking: BookingDetails = JSON.parse(bookingData);
        const bookingPhone = booking.phone.replace(/[\s\-+]/g, '');

        // Comparar teléfonos (también últimos 9 dígitos por diferencias de formato)
        if (
          bookingPhone === normalizedPhone ||
          bookingPhone.endsWith(normalizedPhone.slice(-9)) ||
          normalizedPhone.endsWith(bookingPhone.slice(-9))
        ) {
          // Solo retornar si no está cancelada
          if (booking.status !== 'cancelled') {
            // Guardar índice para futuras búsquedas
            await redis.set(`phone:${normalizedPhone}`, evId, { ex: 30 * 24 * 60 * 60 });
            return booking;
          }
        }
      }
    }
  }

  return null;
}

// ============================================================================
// VERIFICACIÓN DE FIRMA
// ============================================================================

function verifySignature(body: unknown, signature: string): boolean {
  const appSecret = process.env['WHATSAPP_APP_SECRET'];

  if (!appSecret) {
    // Si no hay secret configurado, skip verificación (para desarrollo)
    console.warn('[webhook-whatsapp] WHATSAPP_APP_SECRET not configured, skipping verification');
    return true;
  }

  try {
    const expectedSignature =
      'sha256=' + crypto.createHmac('sha256', appSecret).update(JSON.stringify(body)).digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}
