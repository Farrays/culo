/**
 * Cron endpoint para enviar recordatorios de clase 24h antes
 *
 * GET /api/cron-reminders-24h
 *
 * Este endpoint debe ser llamado por un cron job (ej: Vercel Cron)
 * Se recomienda ejecutar cada hora para no perder ninguna ventana de 24h
 *
 * Flujo:
 * 1. Escanear todas las reservas en Redis (booking:*)
 * 2. Verificar si la clase es en ~24h (ventana de 23-25h)
 * 3. Verificar si ya se envió recordatorio 24h (reminder24hSent flag)
 * 4. Enviar WhatsApp de recordatorio con plantilla recordatorio_prueba_2
 * 5. Enviar Email de recordatorio 24h
 * 6. Marcar como enviado
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

// Constantes
const REMINDER_WINDOW_HOURS = 24; // Recordatorio 24h antes de la clase
const REMINDER_TOLERANCE_HOURS = 1; // +/- 1 hora de tolerancia
const WHATSAPP_API_VERSION = 'v23.0';

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
  reminder24hSent?: boolean;
}

interface ReminderResult {
  email: string;
  phone: string;
  className: string;
  classDateTime: string;
  whatsappSuccess: boolean;
  emailSuccess: boolean;
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
 * Verifica si una fecha está dentro de la ventana de recordatorio (24h +/- 1h)
 */
function isInReminderWindow(classDate: Date): boolean {
  const now = new Date();
  const hoursUntilClass = (classDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  const minHours = REMINDER_WINDOW_HOURS - REMINDER_TOLERANCE_HOURS;
  const maxHours = REMINDER_WINDOW_HOURS + REMINDER_TOLERANCE_HOURS;

  return hoursUntilClass >= minHours && hoursUntilClass <= maxHours;
}

/**
 * Envía recordatorio de WhatsApp 24h con plantilla recordatorio_prueba_2
 */
async function sendReminder24hWhatsApp(
  to: string,
  firstName: string,
  className: string,
  classDateTime: string
): Promise<{ success: boolean; error?: string }> {
  const token = process.env['WHATSAPP_TOKEN'];
  const phoneId = process.env['WHATSAPP_PHONE_ID'];

  if (!token || !phoneId) {
    return { success: false, error: 'Missing WhatsApp credentials' };
  }

  const normalizedPhone = to.replace(/[\s\-+]/g, '');
  const apiUrl = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneId}/messages`;

  try {
    const response = await fetch(apiUrl, {
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
          name: 'recordatorio_prueba_2',
          language: { code: 'es_ES' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: firstName },
                { type: 'text', text: className },
                { type: 'text', text: classDateTime },
                { type: 'text', text: 'C/ Entença 100, 08015 Barcelona' },
              ],
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data.error?.message || `HTTP ${response.status}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Envía recordatorio 24h por email
 */
async function sendReminder24hEmailInline(
  to: string,
  firstName: string,
  className: string,
  classDate: string,
  classTime: string,
  managementUrl: string
): Promise<{ success: boolean; error?: string }> {
  const { Resend } = await import('resend');
  const apiKey = process.env['RESEND_API_KEY'];

  if (!apiKey) {
    return { success: false, error: 'Missing Resend API key' };
  }

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: "Farray's Center <noreply@farrayscenter.com>",
      to,
      replyTo: 'info@farrayscenter.com',
      subject: `¡Tu clase de ${className} es mañana! 🎁 Promoción especial 24h`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #e91e63; margin: 0; font-size: 26px; font-weight: bold;">Farray's International Dance Center</h1>
  </div>
  <div style="background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0 0 10px 0;">⏰ ¡Tu clase es mañana!</h2>
    <p style="margin: 0; opacity: 0.9; font-size: 18px;">Recordatorio de 24 horas</p>
  </div>
  <div style="background: #fff3cd; border-left: 4px solid #ff9800; padding: 20px; margin-bottom: 30px; border-radius: 8px;">
    <h3 style="margin: 0 0 10px 0; color: #ff9800;">🎁 PROMOCIÓN ESPECIAL 24H</h3>
    <p style="margin: 0 0 10px 0; color: #856404; font-size: 16px;"><strong>👉 MATRÍCULA GRATIS</strong></p>
    <p style="margin: 0 0 15px 0; color: #856404; font-size: 15px;">
      <strong style="font-size: 18px;">🔝 ANTES 60€ — AHORA 0€</strong>
    </p>
    <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px;">
      <strong>📜 Condiciones:</strong> promoción válida solo si te apuntas mañana después de tu clase de prueba y realizas el primer pago en efectivo.
    </p>
    <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px;">
      Así tú te ahorras la matrícula… y nosotros las comisiones bancarias. <strong>¡Ganamos todos! 😉</strong>
    </p>
    <p style="margin: 0 0 10px 0; color: #856404; font-size: 13px;">
      Todo de forma transparente: recibirás tu recibo correspondiente al momento del alta. 💥
    </p>
    <p style="margin: 0; color: #856404; font-size: 14px;">
      Aquí puedes ver todas las tarifas: <a href="https://www.farrayscenter.com/es/horarios-precios" style="color: #ff9800; font-weight: bold; text-decoration: none;">www.farrayscenter.com/horarios-precios</a>
    </p>
  </div>
  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${firstName}</strong>,</p>
    <p style="margin: 0 0 15px 0;">¡Te esperamos mañana en tu clase de prueba!</p>
    <p style="margin: 0; font-weight: bold; color: #333;">¿Nos confirmas tu asistencia? 🙏</p>
  </div>
  <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Clase</span><br><strong style="font-size: 18px;">${className}</strong></td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Fecha</span><br><strong>${classDate}</strong></td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Hora</span><br><strong>${classTime}</strong></td></tr>
      <tr><td style="padding: 10px 0;"><span style="color: #666;">Ubicación</span><br><strong>Farray's International Dance Center</strong><br><span style="color: #666;">C/ Entença 100, 08015 Barcelona</span></td></tr>
    </table>
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${managementUrl}" style="display: inline-block; background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 5px;">Ver mi reserva</a>
    <a href="https://maps.app.goo.gl/4AtNaEzTAhNUuFfJ6" style="display: inline-block; background: #4285f4; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 5px;">Cómo llegar</a>
  </div>
  <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h4 style="margin: 0 0 10px 0; color: #333;">📍 Cómo llegar</h4>
    <p style="margin: 0; color: #666;">
      <strong>Farray's International Dance Center</strong><br>
      C/ Entença 100, 08015 Barcelona<br><br>
      🚇 <strong>Metro:</strong> Rocafort (L1) o Entença (L5)<br>
      🚌 <strong>Bus:</strong> Líneas 41, 54, H8
    </p>
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    <p style="color: #666; margin-bottom: 15px;">¿Necesitas cambiar la fecha?</p>
    <a href="${managementUrl}" style="display: inline-block; background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
      Cancelar/Reprogramar
    </a>
  </div>
  <div style="background: #1a1a1a; color: #fff; text-align: center; padding: 30px 20px; border-top: 1px solid #333;">
    <img src="https://farrayscenter.com/images/logo/img/logo-fidc_512.png" alt="Farray's International Dance Center" style="max-width: 200px; height: auto; margin-bottom: 20px;">
    <p style="margin: 10px 0; color: #ccc; font-size: 14px;">
      <strong style="color: #fff;">Farray's International Dance Center</strong><br>
      C/ Entença 100, 08015 Barcelona<br>
      <a href="tel:+34622247085" style="color: #e91e63; text-decoration: none;">+34 622 247 085</a> (WhatsApp)<br>
      <a href="https://farrayscenter.com" style="color: #e91e63; text-decoration: none;">farrayscenter.com</a> |
      <a href="https://www.instagram.com/farrays_centerbcn/" style="color: #e91e63; text-decoration: none;">Instagram</a>
    </p>
  </div>
</body>
</html>
      `,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
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
    console.warn(`[Reminders24h] Found ${bookingKeys.length} bookings to check`);

    for (const key of bookingKeys) {
      try {
        const bookingDataStr = await redis.get(key);
        if (!bookingDataStr) continue;

        const booking: BookingData = JSON.parse(bookingDataStr);

        // Saltar si ya se envió recordatorio 24h
        if (booking.reminder24hSent) {
          continue;
        }

        // Saltar si no tiene teléfono
        if (!booking.phone) {
          continue;
        }

        // Parsear fecha de la clase
        const classDate = parseClassDate(booking.classDateRaw, booking.classTime);
        if (!classDate) {
          console.warn(`[Reminders24h] Could not parse date for ${key}:`, booking.classDateRaw);
          continue;
        }

        // Verificar si está en la ventana de 24h
        if (!isInReminderWindow(classDate)) {
          continue;
        }

        // Formatear fecha/hora para la plantilla
        const classDateTime = formatDateTimeForTemplate(classDate);

        console.warn(
          `[Reminders24h] Sending reminder to ${booking.email} for ${booking.className}`
        );

        // Enviar WhatsApp y Email en paralelo
        const [whatsappResult, emailResult] = await Promise.all([
          sendReminder24hWhatsApp(
            booking.phone,
            booking.firstName,
            booking.className,
            classDateTime
          ),
          sendReminder24hEmailInline(
            booking.email,
            booking.firstName,
            booking.className,
            booking.classDate,
            booking.classTime,
            '' // TODO: Add management URL
          ),
        ]);

        // Marcar como enviado si al menos uno tuvo éxito
        if (whatsappResult.success || emailResult.success) {
          booking.reminder24hSent = true;
          await redis.set(key, JSON.stringify(booking), 'KEEPTTL');
        }

        results.push({
          email: booking.email,
          phone: booking.phone.slice(0, 4) + '***',
          className: booking.className,
          classDateTime,
          whatsappSuccess: whatsappResult.success,
          emailSuccess: emailResult.success,
          error:
            !whatsappResult.success || !emailResult.success
              ? `WhatsApp: ${whatsappResult.error || 'OK'}, Email: ${emailResult.error || 'OK'}`
              : undefined,
        });
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
    console.error('[Reminders24h] Error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
