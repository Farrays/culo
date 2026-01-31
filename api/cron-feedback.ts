import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

/**
 * API Route: /api/cron-feedback
 *
 * Cron job para enviar emails de feedback después de las clases.
 * Se ejecuta 2 horas después de que termine la clase.
 *
 * Ejecutar cada hora vía Vercel Cron.
 *
 * Headers requeridos:
 * - Authorization: Bearer {CRON_SECRET}
 */

import { sendFeedbackEmail } from '../lib/email';

const SPAIN_TIMEZONE = 'Europe/Madrid';

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
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  sessionId: string | null;
  momenceBookingId: number | null;
  category: string;
  managementToken: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
  reminder48hSent?: boolean;
  reminder24hSent?: boolean;
  feedbackSent?: boolean;
}

interface FeedbackResult {
  eventId: string;
  email: boolean;
  error?: string;
}

/**
 * Obtiene la fecha en formato YYYY-MM-DD para una zona horaria
 */
function getDateInTimezone(date: Date, timezone: string): string {
  return date.toLocaleDateString('en-CA', { timeZone: timezone });
}

/**
 * Parsea hora de clase y crea un Date completo
 */
function parseClassDateTime(isoDate: string, classTime: string): Date {
  const [hours, minutes] = classTime.split(':').map(Number);
  const date = new Date(isoDate);
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificar autenticación (excepto en desarrollo)
  const cronSecret = process.env['CRON_SECRET'];
  const authHeader = req.headers['authorization'];

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn('[cron-feedback] Unauthorized request');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const redis = getRedisClient();
  if (!redis) {
    console.error('[cron-feedback] Redis not configured');
    return res.status(500).json({ error: 'Redis not configured' });
  }

  try {
    const now = new Date();
    const todayISO = getDateInTimezone(now, SPAIN_TIMEZONE);
    const yesterdayISO = getDateInTimezone(
      new Date(now.getTime() - 24 * 60 * 60 * 1000),
      SPAIN_TIMEZONE
    );

    console.log(`[cron-feedback] Checking feedback for dates: ${yesterdayISO}, ${todayISO}`);

    // Buscar reservas de hoy y ayer (para capturar clases que acaban de terminar)
    const datesToCheck = [yesterdayISO, todayISO];
    const results: FeedbackResult[] = [];
    let processed = 0;
    let skipped = 0;

    for (const dateISO of datesToCheck) {
      // Obtener eventIds de reservas de esta fecha
      const indexKey = `bookings_by_date:${dateISO}`;
      const eventIds = await redis.smembers(indexKey);

      console.log(`[cron-feedback] Found ${eventIds.length} bookings for ${dateISO}`);

      for (const eventId of eventIds) {
        const bookingData = await redis.get(`booking_details:${eventId}`);
        if (!bookingData) {
          console.warn(`[cron-feedback] No data found for ${eventId}`);
          continue;
        }

        const booking: BookingDetails = JSON.parse(bookingData);

        // Skip si ya enviamos feedback o está cancelada
        if (booking.feedbackSent) {
          skipped++;
          continue;
        }

        if (booking.status === 'cancelled') {
          skipped++;
          continue;
        }

        // Verificar si la clase ya terminó hace al menos 2 horas
        // Extraer fecha ISO de classDate si es necesario
        const classDateISO = booking.classDate?.match(/\d{4}-\d{2}-\d{2}/)?.[0] || dateISO;
        const classEndTime = parseClassDateTime(classDateISO, booking.classTime);
        classEndTime.setHours(classEndTime.getHours() + 1); // Clase dura 1 hora

        const twoHoursAfterClass = new Date(classEndTime.getTime() + 2 * 60 * 60 * 1000);

        if (now < twoHoursAfterClass) {
          // La clase aún no ha terminado hace 2+ horas
          skipped++;
          continue;
        }

        // Límite: no enviar feedback si pasaron más de 48h desde la clase
        const maxFeedbackTime = new Date(classEndTime.getTime() + 48 * 60 * 60 * 1000);
        if (now > maxFeedbackTime) {
          console.log(`[cron-feedback] Too late for feedback: ${eventId}`);
          // Marcar como enviado para no volver a procesar
          booking.feedbackSent = true;
          await redis.set(`booking_details:${eventId}`, JSON.stringify(booking));
          skipped++;
          continue;
        }

        console.log(`[cron-feedback] Sending feedback for ${eventId} (${booking.className})`);

        const result: FeedbackResult = {
          eventId,
          email: false,
        };

        // Enviar email de feedback
        try {
          const emailResult = await sendFeedbackEmail({
            to: booking.email,
            firstName: booking.firstName,
            className: booking.className,
            feedbackToken: booking.managementToken,
          });
          result.email = emailResult.success;
          if (!emailResult.success) {
            console.warn(`[cron-feedback] Email failed for ${eventId}:`, emailResult.error);
            result.error = emailResult.error;
          }
        } catch (e) {
          console.warn(`[cron-feedback] Email error for ${eventId}:`, e);
          result.error = e instanceof Error ? e.message : 'Unknown error';
        }

        // Marcar como enviado
        if (result.email) {
          booking.feedbackSent = true;
          await redis.set(`booking_details:${eventId}`, JSON.stringify(booking));
          processed++;
        }

        results.push(result);
      }
    }

    console.log(
      `[cron-feedback] Completed: ${processed} sent, ${skipped} skipped, ${results.length} processed`
    );

    return res.status(200).json({
      success: true,
      timestamp: now.toISOString(),
      datesToCheck,
      processed,
      skipped,
      results,
    });
  } catch (error) {
    console.error('[cron-feedback] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
