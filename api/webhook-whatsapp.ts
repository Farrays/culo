/* global Buffer */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import Redis from 'ioredis';

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
// LAZY REDIS
// ============================================================================

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

  // Siempre responder 200 rápido (Meta requiere respuesta en <20s)
  res.status(200).json({ status: 'received' });

  // Procesar en background
  try {
    await processWebhookPayload(payload);
  } catch (error) {
    console.error('[webhook-whatsapp] Error processing payload:', error);
  }

  return res;
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

    if (normalizedPayload.includes('si') && normalizedPayload.includes('asistir')) {
      // "Sí, asistiré" o variaciones
      await handleAttendanceConfirmation(phone, 'confirmed');
    } else if (normalizedPayload.includes('no') && normalizedPayload.includes('podr')) {
      // "No podré ir" o variaciones
      await handleAttendanceConfirmation(phone, 'not_attending');
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

async function handleAttendanceConfirmation(
  phone: string,
  status: 'confirmed' | 'not_attending'
): Promise<void> {
  const redis = getRedisClient();

  if (!redis) {
    console.error('[webhook-whatsapp] Redis not configured');
    return;
  }

  try {
    // Buscar booking por teléfono
    const booking = await findBookingByPhone(redis, phone);

    if (!booking) {
      console.warn(`[webhook-whatsapp] No booking found for phone ${phone}`);
      // Enviar mensaje de error amigable
      await sendTextMessage(
        phone,
        '❓ No encontramos una reserva activa con tu número. ¿Has hecho una reserva recientemente? Visita farrayscenter.com/reservas'
      );
      return;
    }

    // Actualizar estado de asistencia
    booking.attendance = status;
    booking.attendanceUpdatedAt = new Date().toISOString();

    const eventId = booking.eventId || '';
    await redis.set(`booking_details:${eventId}`, JSON.stringify(booking));

    console.log(`[webhook-whatsapp] Attendance updated: ${booking.firstName} - ${status}`);

    // Actualizar Google Calendar si está configurado
    if (booking.calendarEventId) {
      try {
        const { updateEventAttendance } = await import('./lib/google-calendar');
        const calendarStatus = status === 'confirmed' ? 'confirmed' : 'not_attending';
        const calendarResult = await updateEventAttendance(booking.calendarEventId, calendarStatus);
        console.log(`[webhook-whatsapp] Calendar updated: ${calendarResult.success}`);
      } catch (calendarError) {
        console.error('[webhook-whatsapp] Calendar update error:', calendarError);
      }
    }

    // Enviar respuesta automática
    if (status === 'confirmed') {
      await sendTextMessage(
        phone,
        `¡Perfecto ${booking.firstName}! 💃 Te esperamos en tu clase de ${booking.className}.\n\n📍 C/ Entença 100, Local 1, Barcelona\n⏰ Recuerda llegar 10 minutos antes.\n\n¡Nos vemos!`
      );
    } else {
      // Magic link con email+event
      const managementUrl = `farrayscenter.com/es/mi-reserva?email=${encodeURIComponent(booking.email)}&event=${eventId}`;

      await sendTextMessage(
        phone,
        `Entendido ${booking.firstName}. Lamentamos que no puedas venir. 😊\n\n¿Qué te gustaría hacer?\n\n📋 Gestionar reserva:\n👉 ${managementUrl}\n\n📅 Reservar otra fecha:\n👉 farrayscenter.com/reservas\n\n¡Te esperamos pronto!`
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

  // Buscar en índice de teléfonos (creado en reservar.ts)
  const eventId = await redis.get(`phone:${normalizedPhone}`);
  if (eventId) {
    const bookingData = await redis.get(`booking_details:${eventId}`);
    if (bookingData) {
      const booking: BookingDetails = JSON.parse(bookingData);
      // Solo retornar si no está cancelada
      if (booking.status !== 'cancelled') {
        return booking;
      }
    }
  }

  // Fallback: buscar en reminders de próximos 7 días
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];

    const eventIds = await redis.smembers(`reminders:${dateKey}`);

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
            await redis.set(`phone:${normalizedPhone}`, evId, 'EX', 30 * 24 * 60 * 60);
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
