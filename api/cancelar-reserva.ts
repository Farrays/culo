import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';
import { isGoogleCalendarConfigured, deleteBookingEvent } from './lib/google-calendar';

/**
 * API endpoint para cancelar una reserva
 * POST /api/cancelar-reserva
 *
 * Body: { email: string, eventId: string }
 *
 * Flujo:
 * 1. Buscar datos de la reserva en Redis
 * 2. Cancelar el booking en Momence (si existe bookingId)
 * 3. Eliminar de Redis
 * 4. Retornar confirmación
 */

const MOMENCE_API_URL = 'https://api.momence.com';
const MOMENCE_AUTH_URL = 'https://api.momence.com/api/v2/auth/token';
const TOKEN_CACHE_KEY = 'momence:access_token';
const TOKEN_TTL_SECONDS = 3500;
const BOOKING_KEY_PREFIX = 'booking:';

/* eslint-disable no-undef */

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

// Cancelar booking en Momence
async function cancelMomenceBooking(
  accessToken: string,
  bookingId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    console.warn('[Momence Cancel] Cancelling booking:', bookingId);

    const response = await fetch(`${MOMENCE_API_URL}/api/v2/host/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Momence Cancel] Failed:', response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    console.warn('[Momence Cancel] SUCCESS! Booking cancelled');
    return { success: true };
  } catch (error) {
    console.error('[Momence Cancel] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  className: string;
  classDate: string;
  classTime: string;
  momenceEventId: string;
  momenceBookingId?: number | null;
  bookedAt: string;
  category?: string;
  calendarEventId?: string; // Google Calendar event ID
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  const { email, eventId } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email parameter required' });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const bookingKey = `${BOOKING_KEY_PREFIX}${normalizedEmail}`;

  const redis = getRedisClient();
  if (!redis) {
    return res.status(500).json({ error: 'Redis not configured' });
  }

  try {
    // 1. Buscar la reserva en Redis
    const bookingDataStr = await redis.get(bookingKey);

    if (!bookingDataStr) {
      return res.status(404).json({
        error: 'Booking not found',
        message: 'No se encontró ninguna reserva con este email',
      });
    }

    const bookingData: BookingData = JSON.parse(bookingDataStr);

    // Validar que el eventId coincida (si se proporciona)
    if (eventId && bookingData.momenceEventId !== eventId) {
      return res.status(404).json({
        error: 'Booking mismatch',
        message: 'El evento no coincide con la reserva encontrada',
      });
    }

    // 2. Cancelar en Momence si tenemos bookingId
    let momenceCancelled = false;
    if (bookingData.momenceBookingId) {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const cancelResult = await cancelMomenceBooking(accessToken, bookingData.momenceBookingId);
        momenceCancelled = cancelResult.success;
        if (!cancelResult.success) {
          console.warn('[Cancel] Momence cancellation failed:', cancelResult.error);
          // Continuamos de todos modos para limpiar Redis
        }
      } else {
        console.warn('[Cancel] Could not get Momence access token');
      }
    } else {
      console.warn('[Cancel] No momenceBookingId found, skipping Momence API');
    }

    // 2b. Google Calendar - Eliminar evento si está configurado
    let calendarDeleted = false;
    if (isGoogleCalendarConfigured() && bookingData.calendarEventId) {
      try {
        const calendarResult = await deleteBookingEvent(bookingData.calendarEventId);
        calendarDeleted = calendarResult.success;
        if (!calendarResult.success) {
          console.warn('[Cancel] Calendar delete failed:', calendarResult.error);
        } else {
          console.log('[Cancel] Calendar event deleted:', bookingData.calendarEventId);
        }
      } catch (e) {
        console.warn('[Cancel] Calendar error (non-blocking):', e);
      }
    } else {
      console.warn('[Cancel] Google Calendar not configured or no calendarEventId');
    }

    // 3. Eliminar de Redis
    await redis.del(bookingKey);
    console.warn('[Cancel] Redis key deleted:', bookingKey);

    // 4. Enviar notificaciones de cancelación

    // 4a. WhatsApp de cancelación
    let whatsappSent = false;
    if (bookingData.phone) {
      try {
        const { sendCancellationWhatsApp } = await import('./lib/whatsapp');
        const whatsappResult = await sendCancellationWhatsApp({
          to: bookingData.phone,
          firstName: bookingData.firstName,
        });
        whatsappSent = whatsappResult.success;
        if (!whatsappResult.success) {
          console.warn('[Cancel] WhatsApp failed:', whatsappResult.error);
        }
      } catch (e) {
        console.warn('[Cancel] WhatsApp error:', e);
      }
    }

    // 4b. Email de cancelación
    let emailSent = false;
    try {
      const { sendCancellationEmail } = await import('./lib/email');
      const emailResult = await sendCancellationEmail({
        to: bookingData.email,
        firstName: bookingData.firstName,
        className: bookingData.className,
        bookingUrl: 'https://farrayscenter.com/reservas',
      });
      emailSent = emailResult.success;
      if (!emailResult.success) {
        console.warn('[Cancel] Email failed:', emailResult.error);
      }
    } catch (e) {
      console.warn('[Cancel] Email error:', e);
    }

    // 4c. Email de notificación al admin (non-blocking)
    try {
      const { Resend } = await import('resend');
      const resendKey = process.env['RESEND_API_KEY'];
      if (resendKey) {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: `"${bookingData.firstName} ${bookingData.lastName}" <noreply@farrayscenter.com>`,
          to: 'info@farrayscenter.com',
          replyTo: bookingData.email,
          subject: `Cancelación de ${bookingData.className} (${bookingData.firstName} ${bookingData.lastName}) el ${bookingData.classDate}`,
          html: `
            <h2>Cancelación de Reserva</h2>
            <p><strong>Alumno:</strong> ${bookingData.firstName} ${bookingData.lastName}</p>
            <p><strong>Email:</strong> ${bookingData.email}</p>
            <p><strong>Teléfono:</strong> ${bookingData.phone || 'No proporcionado'}</p>
            <hr>
            <p><strong>Clase:</strong> ${bookingData.className}</p>
            <p><strong>Fecha:</strong> ${bookingData.classDate}</p>
            <p><strong>Hora:</strong> ${bookingData.classTime}</p>
            <hr>
            <p style="color: #dc3545;"><strong>Estado:</strong> CANCELADA</p>
            <p><em>Cancelado el ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</em></p>
          `,
        });
        console.log('[Cancel] Admin notification email sent');
      }
    } catch (adminError) {
      // Non-blocking: solo log, no afecta la respuesta
      console.warn('[Cancel] Admin notification failed:', adminError);
    }

    // 5. Retornar confirmación
    return res.status(200).json({
      success: true,
      message: 'Reserva cancelada correctamente',
      data: {
        className: bookingData.className,
        classDate: bookingData.classDate,
        momenceCancelled,
        calendarDeleted,
        whatsappSent,
        emailSent,
      },
    });
  } catch (error) {
    console.error('Cancel API error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
