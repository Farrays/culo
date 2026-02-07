/* global Buffer */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import type { Redis } from '@upstash/redis';
import { getRedisClient } from './lib/redis.js';
import { getSupabaseAdmin } from './lib/supabase.js';
import { processAgentMessage } from './lib/ai/agent.js';
import { isFeatureEnabled, FEATURES } from './lib/feature-flags.js';

// ============================================================================
// GOOGLE CALENDAR INLINED (Vercel bundler no incluye ./lib/email)
// ============================================================================

type AttendanceStatus = 'pending' | 'confirmed' | 'not_attending' | 'cancelled' | 'cancelled_late';

// ============================================================================
// PII REDACTION (GDPR-compliant logging)
// ============================================================================

/** Redact phone for logging: "+34612345678" → "+346***78" */
function redactPhone(phone: string | null | undefined): string {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length < 6) return '***';
  return `${cleaned.slice(0, 4)}***${cleaned.slice(-2)}`;
}

/** Redact email for logging */
function redactEmail(email: string | null | undefined): string {
  if (!email) return 'N/A';
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@invalid';
  return `${local.length > 3 ? local.slice(0, 3) + '***' : '***'}@${domain}`;
}

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const CALENDAR_TOKEN_URL = 'https://oauth2.googleapis.com/token';

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  pending: '8', // Graphite (gris)
  confirmed: '10', // Basil (verde)
  not_attending: '11', // Tomato (rojo)
  cancelled: '6', // Tangerine (naranja) - cancelado A TIEMPO (puede reprogramar)
  cancelled_late: '11', // Tomato (rojo) - cancelado TARDE (perdió derecho)
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
      return '🟠 Cancelado a tiempo';
    case 'cancelled_late':
      return '🔴 Cancelado tarde (perdió derecho)';
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

    const colorId = STATUS_COLORS[status];
    console.log(
      `[google-calendar] Updating event ${calendarEventId}: status=${status}, colorId=${colorId}`
    );

    const patchResponse = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events/${calendarEventId}?sendUpdates=none`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ colorId, description }),
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

// ============================================================================
// MOMENCE API (para cancelación de reservas)
// ============================================================================

const MOMENCE_API_URL = 'https://api.momence.com';
const MOMENCE_AUTH_URL = 'https://api.momence.com/api/v2/auth/token';
const MOMENCE_TOKEN_CACHE_KEY = 'momence:access_token';
const MOMENCE_TOKEN_TTL_SECONDS = 3500;

async function getMomenceAccessToken(redis: Redis): Promise<string | null> {
  const { MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD } =
    process.env;
  if (!MOMENCE_CLIENT_ID || !MOMENCE_CLIENT_SECRET || !MOMENCE_USERNAME || !MOMENCE_PASSWORD) {
    return null;
  }

  // Check cache
  try {
    const cached = await redis.get(MOMENCE_TOKEN_CACHE_KEY);
    if (cached) return String(cached);
  } catch (e) {
    console.warn('[webhook-whatsapp] Momence token cache lookup failed:', e);
  }

  const basicAuth = Buffer.from(`${MOMENCE_CLIENT_ID}:${MOMENCE_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await fetch(MOMENCE_AUTH_URL, {
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

    if (token) {
      try {
        await redis.setex(MOMENCE_TOKEN_CACHE_KEY, MOMENCE_TOKEN_TTL_SECONDS, token);
      } catch (e) {
        console.warn('[webhook-whatsapp] Momence token cache save failed:', e);
      }
    }

    return token;
  } catch (error) {
    console.error('[webhook-whatsapp] Momence auth error:', error);
    return null;
  }
}

async function cancelMomenceBooking(
  accessToken: string,
  bookingId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('[webhook-whatsapp] Cancelling Momence booking:', bookingId);
    const response = await fetch(`${MOMENCE_API_URL}/api/v2/host/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[webhook-whatsapp] Momence cancel failed:', response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    console.log('[webhook-whatsapp] Momence booking cancelled successfully');
    return { success: true };
  } catch (error) {
    console.error('[webhook-whatsapp] Momence cancel error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============================================================================
// END MOMENCE API
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
  let cleaned = phone.replace(/[\s\-().]/g, '');
  if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
  // Spanish: 9 digits starting with 6,7,8,9
  if (cleaned.length === 9 && /^[6789]/.test(cleaned)) cleaned = '34' + cleaned;
  // French: 10 digits starting with 0
  if (cleaned.length === 10 && cleaned.startsWith('0')) cleaned = '33' + cleaned.substring(1);
  return cleaned;
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
  momenceBookingId?: number | null; // For Momence API cancellation
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
  // ============================================================================
  // VERIFICACIÓN DE FIRMA - Modo controlado por Feature Flag
  // Flag OFF (default): AUDIT mode - solo log, no bloquea
  // Flag ON: ENFORCEMENT mode - bloquea requests sin firma válida
  // ============================================================================

  const enforcementMode = await isFeatureEnabled(FEATURES.WEBHOOK_ENFORCEMENT);
  const signature = req.headers['x-hub-signature-256'];
  const signatureResult = verifyWebhookSignature(req.body, signature as string | undefined);

  if (!signatureResult.valid) {
    console.warn(`[webhook-whatsapp] ⚠️ Signature verification: ${signatureResult.reason}`);

    // ENFORCEMENT MODE: Bloquear si la firma no es válida
    if (enforcementMode) {
      console.error('[webhook-whatsapp] 🚫 ENFORCEMENT: Request blocked - invalid signature');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid webhook signature',
      });
    }
  } else {
    console.log(`[webhook-whatsapp] ✅ Signature verified successfully`);
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

  console.log(
    `[webhook-whatsapp] Message from ${redactPhone(phone)} (${contactName}): type=${message.type}`
  );

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
    } else if (normalizedTitle.includes('fichar') && normalizedTitle.includes('entrada')) {
      // Fichaje de entrada
      await handleFichajeButton(phone, 'entrada');
    } else if (normalizedTitle.includes('fichar') && normalizedTitle.includes('salida')) {
      // Fichaje de salida
      await handleFichajeButton(phone, 'salida');
    }
  }

  // Procesar mensajes de texto con el agente AI
  if (message.type === 'text' && message.text) {
    const textBody = message.text.body;
    console.log(`[webhook-whatsapp] Text message: "${textBody}"`);

    // Process with AI agent
    try {
      const redis = getRedisClient();

      console.log(`[webhook-whatsapp] Processing with AI agent...`);

      const response = await processAgentMessage(redis, {
        phone,
        text: textBody,
        contactName,
        channel: 'whatsapp',
      });

      console.log(
        `[webhook-whatsapp] Agent response (${response.language}): "${response.text.substring(0, 100)}..."`
      );

      // Send response via WhatsApp
      const sendResult = await sendTextMessage(phone, response.text);

      if (sendResult.success) {
        console.log(`[webhook-whatsapp] Agent response sent successfully`);
      } else {
        console.error(`[webhook-whatsapp] Failed to send agent response:`, sendResult.error);
      }
    } catch (agentError) {
      console.error(`[webhook-whatsapp] Agent processing error:`, agentError);

      // Send fallback message on error
      try {
        await sendTextMessage(
          phone,
          'Perdona, ha habido un problemilla técnico. ¿Me puedes repetir eso? O si prefieres, llámanos al +34 622 247 085'
        );
      } catch (fallbackError) {
        console.error(`[webhook-whatsapp] Fallback message failed:`, fallbackError);
      }
    }
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
    console.error('[webhook-whatsapp] Redis not configured - missing STORAGE_REDIS_URL');
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
      console.warn(`[webhook-whatsapp] No booking found for phone ${redactPhone(phone)}`);
      // Enviar mensaje de error amigable
      await sendTextMessage(
        phone,
        '❓ No encontramos una reserva activa con tu número. ¿Has hecho una reserva recientemente? Visita farrayscenter.com/reservas'
      );
      return;
    }

    // Check if already processed (one-time buttons)
    if (booking.attendance && booking.attendance !== 'pending') {
      console.log(
        `[webhook-whatsapp] Already processed: ${booking.firstName}, attendance=${booking.attendance}`
      );
      await sendTextMessage(
        phone,
        `Tu respuesta ya fue registrada anteriormente. Si necesitas cambiar algo, contacta con nosotros por WhatsApp al +34 622 247 085.`
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
      // Puede reprogramar para otro día
      booking.status = 'cancelled';
      booking.attendance = 'not_attending';
      booking.attendanceUpdatedAt = new Date().toISOString();

      await redis.set(`booking_details:${eventId}`, JSON.stringify(booking));

      // Eliminar deduplicación para que pueda reservar otro día
      const normalizedEmail = booking.email.toLowerCase();
      await redis.del(`booking:${normalizedEmail}`);
      console.log(`[webhook-whatsapp] Deduplication removed for ${redactEmail(normalizedEmail)}`);

      // Eliminar del índice de teléfono
      const normalizedPhone = phone.replace(/[\s\-+]/g, '');
      await redis.del(`phone:${normalizedPhone}`);

      console.log(`[webhook-whatsapp] Booking cancelled (> 1h): ${booking.firstName}`);

      // Cancelar en Momence si existe
      if (booking.momenceBookingId) {
        try {
          const momenceToken = await getMomenceAccessToken(redis);
          if (momenceToken) {
            const momenceResult = await cancelMomenceBooking(
              momenceToken,
              booking.momenceBookingId
            );
            if (momenceResult.success) {
              console.log(`[webhook-whatsapp] Momence booking cancelled`);
            } else {
              console.warn(`[webhook-whatsapp] Momence cancel failed:`, momenceResult.error);
            }
          }
        } catch (e) {
          console.warn('[webhook-whatsapp] Momence cancel exception:', e);
        }
      }

      // Google Calendar - Actualizar a cancelado A TIEMPO (NARANJA)
      if (isGoogleCalendarConfigured() && booking.calendarEventId) {
        try {
          await updateEventAttendance(booking.calendarEventId, 'cancelled');
          console.log(`[webhook-whatsapp] Calendar updated to cancelled (on-time - orange)`);
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
      // CANCELACIÓN TARDÍA: < 1 hora antes de la clase
      // Pierde derecho a clase de prueba, NO puede reprogramar
      booking.status = 'cancelled';
      booking.attendance = 'not_attending';
      booking.attendanceUpdatedAt = new Date().toISOString();

      await redis.set(`booking_details:${eventId}`, JSON.stringify(booking));

      // NO eliminar deduplicación - no puede reservar de nuevo
      console.log(
        `[webhook-whatsapp] Late cancellation (< 1h) - deduplication KEPT: ${booking.firstName}`
      );

      // Eliminar del índice de teléfono
      const normalizedPhone = phone.replace(/[\s\-+]/g, '');
      await redis.del(`phone:${normalizedPhone}`);

      // Cancelar en Momence si existe
      if (booking.momenceBookingId) {
        try {
          const momenceToken = await getMomenceAccessToken(redis);
          if (momenceToken) {
            const momenceResult = await cancelMomenceBooking(
              momenceToken,
              booking.momenceBookingId
            );
            if (momenceResult.success) {
              console.log(`[webhook-whatsapp] Momence booking cancelled`);
            } else {
              console.warn(`[webhook-whatsapp] Momence cancel failed:`, momenceResult.error);
            }
          }
        } catch (e) {
          console.warn('[webhook-whatsapp] Momence cancel exception:', e);
        }
      }

      // Google Calendar - Actualizar a cancelado TARDE (ROJO - perdió derecho)
      if (isGoogleCalendarConfigured() && booking.calendarEventId) {
        try {
          await updateEventAttendance(booking.calendarEventId, 'cancelled_late');
          console.log(`[webhook-whatsapp] Calendar updated to cancelled_late (late - red)`);
        } catch (e) {
          console.warn('[webhook-whatsapp] Calendar update failed:', e);
        }
      }

      await sendTextMessage(
        phone,
        `Entendido ${booking.firstName}. Tu reserva ha sido cancelada.\n\n⚠️ Al cancelar con menos de 1 hora de antelación, has perdido el derecho a la clase de prueba gratuita según nuestra política de cancelación.\n\n💃 Si deseas hacer una clase otro día, puedes coger una clase suelta en:\n👉 www.farrayscenter.com/es/hazte-socio\n\n¡Gracias por tu comprensión!`
      );
    }
  } catch (error) {
    console.error('[webhook-whatsapp] Error handling attendance:', error);
  }
}

// ============================================================================
// FICHAJE DE PROFESORES (Sistema de control horario)
// ============================================================================

/**
 * Maneja los botones de fichaje de entrada/salida de profesores
 * Actualiza Supabase con el timestamp exacto (requisito legal)
 */
// Tipos locales para fichaje
interface ProfesorFichaje {
  id: string;
  nombre: string;
  apellidos: string | null;
  telefono_whatsapp: string;
}

interface FichajeRecord {
  id: string;
  profesor_id: string;
  clase_nombre: string;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  estado: string;
}

async function handleFichajeButton(phone: string, tipo: 'entrada' | 'salida'): Promise<void> {
  console.log(`[webhook-whatsapp] handleFichajeButton: phone=${redactPhone(phone)}, tipo=${tipo}`);

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (error) {
    console.error('[webhook-whatsapp] Supabase not configured:', error);
    await sendTextMessage(phone, '❌ Error del sistema. Contacta con administración.');
    return;
  }

  // Normalizar teléfono para búsqueda (formato E.164)
  let normalizedPhone = phone.replace(/[\s\-+]/g, '');
  if (!normalizedPhone.startsWith('+')) {
    normalizedPhone = '+' + normalizedPhone;
  }

  try {
    // 1. Buscar profesor por teléfono
    const { data: profesorData, error: profesorError } = await supabase
      .from('profesores')
      .select('id, nombre, apellidos, telefono_whatsapp')
      .or(`telefono_whatsapp.eq.${normalizedPhone},telefono_whatsapp.eq.${phone}`)
      .eq('activo', true)
      .single();

    const profesor = profesorData as ProfesorFichaje | null;

    if (profesorError || !profesor) {
      console.warn(`[webhook-whatsapp] Profesor no encontrado: ${redactPhone(phone)}`);
      await sendTextMessage(
        phone,
        '❓ No encontramos tu perfil de profesor. Contacta con administración.'
      );
      return;
    }

    console.log(`[webhook-whatsapp] Profesor encontrado: ${profesor.nombre}`);

    // 2. Obtener fecha actual en España
    const fechaHoy = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });
    const horaActual = new Date().toLocaleTimeString('es-ES', {
      timeZone: 'Europe/Madrid',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const timestampActual = new Date().toISOString();

    // 3. Buscar fichaje pendiente para hoy
    const { data: fichajesData, error: fichajeError } = await supabase
      .from('fichajes')
      .select('*')
      .eq('profesor_id', profesor.id)
      .eq('fecha', fechaHoy)
      .in('estado', tipo === 'entrada' ? ['pendiente'] : ['entrada_registrada'])
      .order('created_at', { ascending: true });

    const fichajes = fichajesData as FichajeRecord[] | null;

    if (fichajeError) {
      console.error('[webhook-whatsapp] Error buscando fichaje:', fichajeError);
      await sendTextMessage(phone, '❌ Error al procesar el fichaje. Intenta de nuevo.');
      return;
    }

    if (!fichajes || fichajes.length === 0) {
      console.warn(`[webhook-whatsapp] No hay fichaje pendiente para ${profesor.nombre}`);
      if (tipo === 'entrada') {
        await sendTextMessage(
          phone,
          `⚠️ ${profesor.nombre}, no tienes clases programadas para hoy o ya fichaste tu entrada.`
        );
      } else {
        await sendTextMessage(
          phone,
          `⚠️ ${profesor.nombre}, no hay fichaje de entrada registrado para fichar la salida.`
        );
      }
      return;
    }

    // Tomar el primer fichaje (el más antiguo del día)
    const fichaje = fichajes[0];
    if (!fichaje) {
      console.warn(`[webhook-whatsapp] Fichaje array vacío para ${profesor.nombre}`);
      await sendTextMessage(phone, '⚠️ No se encontró fichaje pendiente.');
      return;
    }
    console.log(
      `[webhook-whatsapp] Fichaje encontrado: ${fichaje.clase_nombre}, estado=${fichaje.estado}`
    );

    // 4. Actualizar fichaje según tipo
    if (tipo === 'entrada') {
      const { error: updateError } = await supabase
        .from('fichajes')
        // @ts-expect-error - Supabase types are dynamic
        .update({
          hora_inicio: horaActual,
          timestamp_entrada: timestampActual,
          metodo_entrada: 'whatsapp',
          estado: 'entrada_registrada',
          updated_at: timestampActual,
        })
        .eq('id', fichaje.id);

      if (updateError) {
        console.error('[webhook-whatsapp] Error actualizando fichaje entrada:', updateError);
        await sendTextMessage(phone, '❌ Error al registrar la entrada. Intenta de nuevo.');
        return;
      }

      console.log(`[webhook-whatsapp] Entrada registrada: ${profesor.nombre} a las ${horaActual}`);

      // Mensaje de confirmación
      await sendTextMessage(
        phone,
        `✅ Entrada registrada\n\n👤 ${profesor.nombre}\n📍 Farray's Center\n🕐 ${horaActual}h\n\n¡Buena clase!`
      );
    } else {
      // Calcular minutos trabajados
      const horaInicio = fichaje.hora_inicio || horaActual;
      const [hiH = 0, hiM = 0] = horaInicio.split(':').map(Number);
      const [hfH = 0, hfM = 0] = horaActual.split(':').map(Number);
      const minutosTrabajados = Math.max(0, hfH * 60 + hfM - (hiH * 60 + hiM));

      const { error: updateError } = await supabase
        .from('fichajes')
        // @ts-expect-error - Supabase types are dynamic
        .update({
          hora_fin: horaActual,
          timestamp_salida: timestampActual,
          metodo_salida: 'whatsapp',
          estado: 'completado',
          minutos_trabajados: minutosTrabajados,
          updated_at: timestampActual,
        })
        .eq('id', fichaje.id);

      if (updateError) {
        console.error('[webhook-whatsapp] Error actualizando fichaje salida:', updateError);
        await sendTextMessage(phone, '❌ Error al registrar la salida. Intenta de nuevo.');
        return;
      }

      // Formatear duración
      const horas = Math.floor(minutosTrabajados / 60);
      const mins = minutosTrabajados % 60;
      const duracion = horas > 0 ? `${horas}h ${mins}min` : `${mins}min`;

      console.log(
        `[webhook-whatsapp] Salida registrada: ${profesor.nombre} a las ${horaActual} (${duracion})`
      );

      // Mensaje de confirmación
      await sendTextMessage(
        phone,
        `✅ Salida registrada\n\n👤 ${profesor.nombre}\n📍 Farray's Center\n🕐 Entrada: ${horaInicio}h\n🕐 Salida: ${horaActual}h\n⏱️ Duración: ${duracion}\n\n¡Hasta pronto!`
      );
    }
  } catch (error) {
    console.error('[webhook-whatsapp] Error en handleFichajeButton:', error);
    await sendTextMessage(phone, '❌ Error inesperado. Contacta con administración.');
  }
}

// ============================================================================
// BÚSQUEDA DE BOOKING POR TELÉFONO
// ============================================================================

/**
 * Verifica si la fecha de la clase es hoy o futura
 */
function isClassDateValid(classDate: string): boolean {
  try {
    const isoMatch = classDate.match(/\d{4}-\d{2}-\d{2}/);
    if (!isoMatch) return true; // Si no se puede parsear, asumir válida

    const classDateObj = new Date(isoMatch[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return classDateObj >= today;
  } catch {
    return true;
  }
}

async function findBookingByPhone(redis: Redis, phone: string): Promise<BookingDetails | null> {
  // Normalizar teléfono
  const normalizedPhone = phone.replace(/[\s\-+]/g, '');
  console.log(
    `[webhook-whatsapp] findBookingByPhone: normalized phone = ${redactPhone(normalizedPhone)}`
  );

  // Buscar en índice de teléfonos (creado en reservar.ts en STORAGE_REDIS_URL)
  console.log(`[webhook-whatsapp] Checking phone index: phone:${redactPhone(normalizedPhone)}`);
  let eventId: string | null = null;
  try {
    const result = await redis.get(`phone:${normalizedPhone}`);
    eventId = result ? String(result) : null;
    console.log(
      `[webhook-whatsapp] phone index result: ${eventId || 'null'} (type: ${typeof eventId})`
    );
  } catch (redisError) {
    console.error(`[webhook-whatsapp] Redis get error:`, redisError);
    return null;
  }

  if (eventId) {
    const bookingData = await redis.get(`booking_details:${eventId}`);
    console.log(
      `[webhook-whatsapp] booking_details:${eventId} = ${bookingData ? 'found' : 'not found'}`
    );
    if (bookingData) {
      const booking: BookingDetails = JSON.parse(bookingData as string);
      // Solo retornar si no está cancelada Y la fecha es válida (hoy o futura)
      if (booking.status !== 'cancelled' && isClassDateValid(booking.classDate)) {
        console.log(
          `[webhook-whatsapp] Found booking via phone index: ${booking.firstName} - ${booking.className}`
        );
        return booking;
      }
      console.log(
        `[webhook-whatsapp] Booking found but invalid: status=${booking.status}, classDate=${booking.classDate}`
      );
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
        const booking: BookingDetails = JSON.parse(bookingData as string);
        const bookingPhone = booking.phone.replace(/[\s\-+]/g, '');

        // Comparar teléfonos (también últimos 9 dígitos por diferencias de formato)
        if (
          bookingPhone === normalizedPhone ||
          bookingPhone.endsWith(normalizedPhone.slice(-9)) ||
          normalizedPhone.endsWith(bookingPhone.slice(-9))
        ) {
          // Solo retornar si no está cancelada Y fecha válida
          if (booking.status !== 'cancelled' && isClassDateValid(booking.classDate)) {
            console.log(
              `[webhook-whatsapp] Found via reminders fallback: ${booking.firstName} - ${booking.className}`
            );
            // Guardar índice para futuras búsquedas (30 días TTL)
            await redis.setex(`phone:${normalizedPhone}`, 30 * 24 * 60 * 60, evId);
            return booking;
          }
        }
      }
    }
  }

  return null;
}

// ============================================================================
// VERIFICACIÓN DE FIRMA (Modo Audit - Solo logging, no bloquea)
// ============================================================================

interface SignatureVerificationResult {
  valid: boolean;
  reason: string;
}

/**
 * Verifica la firma HMAC del webhook de WhatsApp
 * MODO AUDIT: Retorna resultado detallado para logging, pero NO bloquea
 *
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
 */
function verifyWebhookSignature(
  body: unknown,
  signature: string | undefined
): SignatureVerificationResult {
  const appSecret = process.env['WHATSAPP_APP_SECRET'];

  // Si no hay secret configurado, no podemos verificar
  if (!appSecret) {
    return {
      valid: false,
      reason: 'WHATSAPP_APP_SECRET not configured (add to env for signature verification)',
    };
  }

  // Si no hay firma en el request
  if (!signature) {
    return {
      valid: false,
      reason: 'No x-hub-signature-256 header in request',
    };
  }

  try {
    const expectedSignature =
      'sha256=' + crypto.createHmac('sha256', appSecret).update(JSON.stringify(body)).digest('hex');

    // Verificar longitud antes de timingSafeEqual para evitar errores
    if (signature.length !== expectedSignature.length) {
      return {
        valid: false,
        reason: `Signature length mismatch (got ${signature.length}, expected ${expectedSignature.length})`,
      };
    }

    const isValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

    if (isValid) {
      return { valid: true, reason: 'Signature matches' };
    } else {
      return {
        valid: false,
        reason: 'Signature mismatch (HMAC does not match)',
      };
    }
  } catch (error) {
    return {
      valid: false,
      reason: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
