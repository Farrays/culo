import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';
import { Resend } from 'resend';

/**
 * API Route: /api/cron-reminders
 *
 * Cron job para enviar recordatorios automáticos de clases.
 * - 48h antes: Primer recordatorio
 * - 24h antes: Segundo recordatorio
 *
 * Ejecutar cada hora vía Vercel Cron.
 *
 * Headers requeridos:
 * - Authorization: Bearer {CRON_SECRET}
 *
 * NOTA: Código de Email y WhatsApp inlineado para evitar problemas de bundling en Vercel
 */

const SPAIN_TIMEZONE = 'Europe/Madrid';

// ============================================================================
// WHATSAPP INLINE (evita problemas de bundling de Vercel)
// ============================================================================

const WHATSAPP_API_VERSION = 'v23.0';

interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

function getWhatsAppConfig() {
  const token = process.env['WHATSAPP_TOKEN'];
  const phoneId = process.env['WHATSAPP_PHONE_ID'];
  if (!token || !phoneId) return null;
  return {
    token,
    phoneId,
    apiUrl: `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneId}/messages`,
  };
}

function normalizePhone(phone: string): string {
  let normalized = phone.replace(/[\s\-().]/g, '');
  if (normalized.startsWith('+')) normalized = normalized.slice(1);
  if (normalized.startsWith('00')) normalized = normalized.slice(2);
  if (/^[67]\d{8}$/.test(normalized)) normalized = '34' + normalized;
  return normalized;
}

async function sendWhatsAppTemplate(
  templateName: string,
  to: string,
  params: { type: string; text: string }[]
): Promise<WhatsAppResult> {
  const config = getWhatsAppConfig();
  if (!config) return { success: false, error: 'WhatsApp not configured' };

  const message = {
    messaging_product: 'whatsapp',
    to: normalizePhone(to),
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'es_ES' },
      components: [{ type: 'body', parameters: params }],
    },
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

    const data = await response.json();
    if (!response.ok || data.error) {
      console.error('[cron] WhatsApp error:', data.error);
      return { success: false, error: data.error?.message || `HTTP ${response.status}` };
    }
    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    console.error('[cron] WhatsApp error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown' };
  }
}

// 48h: recordatorio_prueba_0 (sin botones)
async function sendReminderWhatsAppInline(data: {
  to: string;
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
}): Promise<WhatsAppResult> {
  return sendWhatsAppTemplate('recordatorio_prueba_0', data.to, [
    { type: 'text', text: data.firstName },
    { type: 'text', text: data.className },
    { type: 'text', text: data.classDate || '' },
    { type: 'text', text: data.classTime || '' },
  ]);
}

// 24h: recordatorio_prueba_2 (con botones)
async function sendAttendanceReminderWhatsAppInline(data: {
  to: string;
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
}): Promise<WhatsAppResult> {
  return sendWhatsAppTemplate('recordatorio_prueba_2', data.to, [
    { type: 'text', text: data.firstName },
    { type: 'text', text: data.className },
    { type: 'text', text: data.classDate || '' },
    { type: 'text', text: data.classTime || '' },
  ]);
}

// ============================================================================
// EMAIL INLINE (evita problemas de bundling de Vercel)
// ============================================================================

const EMAIL_FROM = "Farray's Center <noreply@farrayscenter.com>";
const EMAIL_REPLY_TO = 'info@farrayscenter.com';
const BRAND_PRIMARY = '#B01E3C';

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

async function sendReminderEmailInline(data: {
  to: string;
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
  managementUrl: string;
  reminderType: '48h' | '24h';
}): Promise<EmailResult> {
  const resendKey = process.env['RESEND_API_KEY'];
  if (!resendKey) return { success: false, error: 'Resend not configured' };

  const resend = new Resend(resendKey);
  const is48h = data.reminderType === '48h';
  const timeText = is48h ? 'pasado mañana' : 'mañana';

  const promoSection = is48h
    ? ''
    : `
  <div style="background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #8B1730 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
    <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase;">💥 Promoción Especial 24h 💥</p>
    <h3 style="margin: 0 0 15px 0; font-size: 24px;">MATRÍCULA GRATIS</h3>
    <p style="margin: 0; font-size: 14px;"><span style="text-decoration: line-through;">ANTES 60€</span> → <strong style="font-size: 20px;">AHORA 0€</strong></p>
    <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.9;">Válida solo si te apuntas mañana después de tu clase de prueba</p>
  </div>`;

  const cancelPolicy = is48h
    ? ''
    : `
  <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 0; color: #856404;">
      <strong>⚠️ Política de cancelación:</strong><br>
      Si no puedes asistir, tienes hasta <strong>1 hora antes</strong> para cancelar.
    </p>
  </div>`;

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.to,
      replyTo: EMAIL_REPLY_TO,
      subject: `Recordatorio: Tu clase de ${data.className} es ${timeText}`,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://www.farrayscenter.com/images/logo.webp" alt="Farray's Center" style="height: 60px;">
  </div>
  <div style="background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0;">📅 Recordatorio de clase</h2>
    <p style="margin: 10px 0 0 0;">Tu clase es ${timeText}</p>
  </div>
  <p>Hola <strong>${data.firstName}</strong>,</p>
  <p>Te recordamos que ${timeText} tienes tu clase de prueba:</p>
  <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
    <p style="margin: 0;"><strong>📚 Clase:</strong> ${data.className}</p>
    <p style="margin: 10px 0 0 0;"><strong>📅 Fecha:</strong> ${data.classDate}</p>
    <p style="margin: 10px 0 0 0;"><strong>⏰ Hora:</strong> ${data.classTime}</p>
    <p style="margin: 10px 0 0 0;"><strong>📍 Lugar:</strong> C/ Entença 100, Barcelona</p>
  </div>
  ${promoSection}
  ${cancelPolicy}
  <div style="text-align: center; margin: 30px 0;">
    <a href="${data.managementUrl}" style="background: ${BRAND_PRIMARY}; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; display: inline-block;">
      Ver mi reserva
    </a>
  </div>
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="text-align: center; color: #666; font-size: 12px;">
    Farray's International Dance Center<br>
    C/ Entença 100, Barcelona
  </p>
</body></html>`,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('[cron] Email error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown' };
  }
}
const BOOKING_MANAGEMENT_URL = 'https://www.farrayscenter.com/es/mi-reserva';

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

interface BookingDetails {
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
  reminder48hSent?: boolean;
  reminder24hSent?: boolean;
}

interface ReminderResult {
  eventId: string;
  type: '48h' | '24h';
  email: boolean;
  whatsapp: boolean;
  error?: string;
}

/**
 * Obtiene la fecha en formato YYYY-MM-DD para una zona horaria
 */
function getDateInTimezone(date: Date, timezone: string): string {
  return date.toLocaleDateString('en-CA', { timeZone: timezone });
}

/**
 * Añade días a una fecha
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Formatea fecha para emails/WhatsApp (ej: "Lunes 28 de Enero 2026")
 */
function formatDateSpanish(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;

    const formatter = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: SPAIN_TIMEZONE,
    });

    const formatted = formatter.format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return isoDate;
  }
}

/**
 * Procesa recordatorios para una fecha específica
 */
async function processRemindersForDate(
  redis: Redis,
  targetDate: string,
  reminderType: '48h' | '24h'
): Promise<ReminderResult[]> {
  const results: ReminderResult[] = [];
  const reminderKey = `reminders:${targetDate}`;

  // Obtener todos los eventIds para esta fecha
  const eventIds = await redis.smembers(reminderKey);

  if (eventIds.length === 0) {
    console.log(`[cron-reminders] No bookings found for ${targetDate}`);
    return results;
  }

  console.log(`[cron-reminders] Found ${eventIds.length} bookings for ${targetDate}`);

  // Usando funciones inlineadas (evita problemas de bundling en Vercel)

  for (const eventId of eventIds) {
    const result: ReminderResult = {
      eventId,
      type: reminderType,
      email: false,
      whatsapp: false,
    };

    try {
      // Obtener detalles de la reserva
      const bookingData = await redis.get(`booking_details:${eventId}`);
      if (!bookingData) {
        result.error = 'Booking not found';
        results.push(result);
        continue;
      }

      const booking: BookingDetails = JSON.parse(bookingData);

      // Verificar si la reserva está cancelada
      if (booking.status === 'cancelled') {
        console.log(`[cron-reminders] Skipping cancelled booking ${eventId}`);
        continue;
      }

      // Verificar si ya se envió este recordatorio
      const sentFlag = reminderType === '48h' ? 'reminder48hSent' : 'reminder24hSent';
      if (booking[sentFlag]) {
        console.log(`[cron-reminders] ${reminderType} already sent for ${eventId}`);
        continue;
      }

      console.log(`[cron-reminders] Sending ${reminderType} reminder for ${eventId}`);

      const managementUrl = `${BOOKING_MANAGEMENT_URL}?email=${encodeURIComponent(booking.email)}&event=${eventId}`;
      const formattedDate = formatDateSpanish(booking.classDate);

      // Enviar Email (usando función inlineada)
      try {
        const emailResult = await sendReminderEmailInline({
          to: booking.email,
          firstName: booking.firstName,
          className: booking.className,
          classDate: formattedDate || booking.classDate,
          classTime: booking.classTime,
          managementUrl,
          reminderType,
        });
        result.email = emailResult.success;
        if (!emailResult.success) {
          console.warn(`[cron-reminders] Email failed for ${eventId}:`, emailResult.error);
        }
      } catch (e) {
        console.warn(`[cron-reminders] Email error for ${eventId}:`, e);
      }

      // Enviar WhatsApp (usando funciones inlineadas)
      // 48h: recordatorio_prueba_0 (solo informativo, sin botones)
      // 24h: recordatorio_prueba_2 (con botones de confirmación de asistencia)
      try {
        const whatsappData = {
          to: booking.phone,
          firstName: booking.firstName,
          className: booking.className,
          classDate: formattedDate || booking.classDate,
          classTime: booking.classTime,
        };

        // Usar función con botones para 24h, sin botones para 48h
        const whatsappResult =
          reminderType === '24h'
            ? await sendAttendanceReminderWhatsAppInline(whatsappData)
            : await sendReminderWhatsAppInline(whatsappData);

        result.whatsapp = whatsappResult.success;
        if (!whatsappResult.success) {
          console.warn(`[cron-reminders] WhatsApp failed for ${eventId}:`, whatsappResult.error);
        }
      } catch (e) {
        console.warn(`[cron-reminders] WhatsApp error for ${eventId}:`, e);
      }

      // Marcar como enviado si al menos uno tuvo éxito
      if (result.email || result.whatsapp) {
        const updatedBooking = { ...booking, [sentFlag]: true };
        await redis.setex(
          `booking_details:${eventId}`,
          90 * 24 * 60 * 60, // 90 días TTL
          JSON.stringify(updatedBooking)
        );
        console.log(`[cron-reminders] Marked ${sentFlag}=true for ${eventId}`);
      }

      results.push(result);
    } catch (e) {
      result.error = e instanceof Error ? e.message : 'Unknown error';
      results.push(result);
      console.error(`[cron-reminders] Error processing ${eventId}:`, e);
    }
  }

  return results;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Verificar autorización
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env['CRON_SECRET'];

  // En desarrollo, permitir sin auth
  const isDev =
    process.env['NODE_ENV'] === 'development' || process.env['VERCEL_ENV'] === 'development';

  if (!isDev && cronSecret) {
    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      console.error('[cron-reminders] Unauthorized request');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // Solo GET o POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const redis = getRedisClient();
  if (!redis) {
    console.error('[cron-reminders] Redis not configured');
    return res.status(500).json({ error: 'Redis not configured' });
  }

  try {
    const now = new Date();
    const results: {
      timestamp: string;
      results48h: ReminderResult[];
      results24h: ReminderResult[];
    } = {
      timestamp: now.toISOString(),
      results48h: [],
      results24h: [],
    };

    // Calcular fechas objetivo en timezone de España
    // Para 48h: clases que son pasado mañana
    // Para 24h: clases que son mañana
    const tomorrow = addDays(now, 1);
    const dayAfterTomorrow = addDays(now, 2);

    const tomorrowStr = getDateInTimezone(tomorrow, SPAIN_TIMEZONE);
    const dayAfterTomorrowStr = getDateInTimezone(dayAfterTomorrow, SPAIN_TIMEZONE);

    console.log(`[cron-reminders] Processing reminders:`);
    console.log(`  - 48h reminders for classes on: ${dayAfterTomorrowStr}`);
    console.log(`  - 24h reminders for classes on: ${tomorrowStr}`);

    // Procesar recordatorios de 48h (clases pasado mañana)
    results.results48h = await processRemindersForDate(redis, dayAfterTomorrowStr, '48h');

    // Procesar recordatorios de 24h (clases mañana)
    results.results24h = await processRemindersForDate(redis, tomorrowStr, '24h');

    const totalSent = results.results48h.length + results.results24h.length;
    console.log(`[cron-reminders] Completed. Total reminders processed: ${totalSent}`);

    return res.status(200).json({
      success: true,
      message: `Processed ${totalSent} reminders`,
      data: results,
    });
  } catch (error) {
    console.error('[cron-reminders] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
