/**
 * Cron endpoint para enviar recordatorios de clase 48h antes
 *
 * GET /api/cron-reminders
 *
 * Este endpoint debe ser llamado por un cron job (ej: Vercel Cron)
 * Se recomienda ejecutar cada hora para no perder ninguna ventana de 48h
 *
 * Flujo:
 * 1. Escanear todas las reservas en Redis (booking:*)
 * 2. Verificar si la clase es en ~48h (ventana de 47-49h)
 * 3. Verificar si ya se envió recordatorio (reminderSent flag)
 * 4. Enviar WhatsApp de recordatorio
 * 5. Marcar como enviado
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

// Constantes
const REMINDER_WINDOW_HOURS = 48; // Recordatorio 48h antes de la clase
const REMINDER_TOLERANCE_HOURS = 1; // +/- 1 hora de tolerancia

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  className: string;
  classDate: string;
  classTime: string;
  classDateRaw: string | null;
  momenceEventId: string;
  bookedAt: string;
  category?: string;
  reminderSent?: boolean;
}

interface ReminderResult {
  email: string;
  phone: string;
  className: string;
  classDateTime: string;
  success: boolean;
  error?: string;
}

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

/**
 * Parsea la fecha de Momence (formato ISO o similar) y devuelve un Date
 */
function parseClassDate(classDateRaw: string | null, classTime: string): Date | null {
  if (!classDateRaw) return null;

  try {
    // Intentar parsear directamente como ISO
    let date = new Date(classDateRaw);

    // Si no es válido, intentar otros formatos
    if (isNaN(date.getTime())) {
      // Formato: "2026-01-30T19:00:00" o similar
      const isoMatch = classDateRaw.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        const [, year, month, day] = isoMatch;
        const [hours, minutes] = (classTime || '19:00').split(':').map(Number);
        date = new Date(Number(year), Number(month) - 1, Number(day), hours, minutes);
      }
    }

    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Formatea fecha y hora para el parámetro {{3}} de la plantilla
 * Formato: "17/07/2025, 19:00"
 */
function formatDateTimeForTemplate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year}, ${hours}:${minutes}`;
}

/**
 * Verifica si una fecha está dentro de la ventana de recordatorio (48h +/- 1h)
 */
function isInReminderWindow(classDate: Date): boolean {
  const now = new Date();
  const hoursUntilClass = (classDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  const minHours = REMINDER_WINDOW_HOURS - REMINDER_TOLERANCE_HOURS;
  const maxHours = REMINDER_WINDOW_HOURS + REMINDER_TOLERANCE_HOURS;

  return hoursUntilClass >= minHours && hoursUntilClass <= maxHours;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verificar cron secret (opcional, para seguridad)
  const cronSecret = process.env['CRON_SECRET'];
  const authHeader = req.headers['authorization'];

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const redis = getRedisClient();
  if (!redis) {
    return res.status(500).json({ error: 'Redis not configured' });
  }

  const results: ReminderResult[] = [];
  const errors: string[] = [];

  try {
    // Escanear todas las reservas
    const bookingKeys = await redis.keys('booking:*');
    console.warn(`[Reminders] Found ${bookingKeys.length} bookings to check`);

    for (const key of bookingKeys) {
      try {
        const bookingDataStr = await redis.get(key);
        if (!bookingDataStr) continue;

        const booking: BookingData = JSON.parse(bookingDataStr);

        // Saltar si ya se envió recordatorio
        if (booking.reminderSent) {
          continue;
        }

        // Saltar si no tiene teléfono
        if (!booking.phone) {
          continue;
        }

        // Parsear fecha de la clase
        const classDate = parseClassDate(booking.classDateRaw, booking.classTime);
        if (!classDate) {
          console.warn(`[Reminders] Could not parse date for ${key}:`, booking.classDateRaw);
          continue;
        }

        // Verificar si está en la ventana de 48h
        if (!isInReminderWindow(classDate)) {
          continue;
        }

        // Formatear fecha/hora para la plantilla
        const classDateTime = formatDateTimeForTemplate(classDate);

        console.warn(`[Reminders] Sending reminder to ${booking.email} for ${booking.className}`);

        // Enviar WhatsApp
        const { sendReminderWhatsApp } = await import('./lib/whatsapp');
        const whatsappResult = await sendReminderWhatsApp({
          to: booking.phone,
          firstName: booking.firstName,
          className: booking.className,
          classDateTime,
        });

        if (whatsappResult.success) {
          // Marcar como enviado
          booking.reminderSent = true;
          await redis.set(key, JSON.stringify(booking), 'KEEPTTL');

          results.push({
            email: booking.email,
            phone: booking.phone.slice(0, 4) + '***',
            className: booking.className,
            classDateTime,
            success: true,
          });
        } else {
          results.push({
            email: booking.email,
            phone: booking.phone.slice(0, 4) + '***',
            className: booking.className,
            classDateTime,
            success: false,
            error: whatsappResult.error,
          });
        }
      } catch (bookingError) {
        errors.push(`Error processing ${key}: ${String(bookingError)}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${bookingKeys.length} bookings`,
      reminders: results,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Reminders] Error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
