import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

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
 */

const SPAIN_TIMEZONE = 'Europe/Madrid';
const BOOKING_MANAGEMENT_URL = 'https://www.farrayscenter.com/es/mi-reserva';
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/QwDZvqvz4uyVfSWq7';

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

  // Importar funciones de notificación
  const { sendReminderEmail } = await import('./lib/email');
  const { sendReminderWhatsApp, sendAttendanceReminderWhatsApp } = await import('./lib/whatsapp');

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

      // Extract ISO date for calendar generation (YYYY-MM-DD)
      const classDateISOMatch = booking.classDate?.match(/\d{4}-\d{2}-\d{2}/);
      const classDateISO = classDateISOMatch ? classDateISOMatch[0] : undefined;

      // Enviar Email
      try {
        const emailResult = await sendReminderEmail({
          to: booking.email,
          firstName: booking.firstName,
          className: booking.className,
          classDate: formattedDate || booking.classDate,
          classDateISO,
          classTime: booking.classTime,
          managementUrl,
          mapUrl: GOOGLE_MAPS_URL,
          reminderType,
          eventId,
          category: booking.category as
            | 'bailes_sociales'
            | 'danzas_urbanas'
            | 'danza'
            | 'entrenamiento'
            | 'heels',
        });
        result.email = emailResult.success;
        if (!emailResult.success) {
          console.warn(`[cron-reminders] Email failed for ${eventId}:`, emailResult.error);
        }
      } catch (e) {
        console.warn(`[cron-reminders] Email error for ${eventId}:`, e);
      }

      // Enviar WhatsApp
      // 48h: recordatorio_prueba_0 (solo informativo, sin botones)
      // 24h: recordatorio_prueba_2 (con botones de confirmación de asistencia)
      try {
        const whatsappData = {
          to: booking.phone,
          firstName: booking.firstName,
          className: booking.className,
          classDate: formattedDate || booking.classDate,
          classTime: booking.classTime,
          category: booking.category as
            | 'bailes_sociales'
            | 'danzas_urbanas'
            | 'danza'
            | 'entrenamiento'
            | 'heels',
          reminderType,
        };

        // Usar función con botones para 24h, sin botones para 48h
        const whatsappResult =
          reminderType === '24h'
            ? await sendAttendanceReminderWhatsApp(whatsappData)
            : await sendReminderWhatsApp(whatsappData);

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
