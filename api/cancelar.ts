import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

/* eslint-disable no-undef */
// Note: Buffer and URLSearchParams are Node.js globals available in Vercel serverless functions

/**
 * API Route: /api/cancelar
 *
 * Cancela una reserva de clase de prueba.
 * Flujo:
 * 1. Validar eventId
 * 2. Obtener datos de la reserva de Redis
 * 3. Cancelar en Momence (si aplica)
 * 4. Eliminar de Redis
 * 5. Enviar WhatsApp de cancelación
 * 6. Enviar Email de cancelación
 *
 * Query params:
 * - eventId: ID único de la reserva (requerido)
 *
 * O POST body:
 * - eventId: ID único de la reserva (requerido)
 */

const MOMENCE_API_URL = 'https://api.momence.com';
const MOMENCE_AUTH_URL = 'https://api.momence.com/api/v2/auth/token';
const TOKEN_CACHE_KEY = 'momence:access_token';
const TOKEN_TTL_SECONDS = 3500;
const BOOKING_KEY_PREFIX = 'booking:';

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
  sessionId: string,
  bookingId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // DELETE /api/v2/host/sessions/{sessionId}/bookings/{bookingId}
    const response = await fetch(
      `${MOMENCE_API_URL}/api/v2/host/sessions/${sessionId}/bookings/${bookingId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Momence Cancel] Failed:', response.status, errorText);
      return { success: false, error: `Momence cancel failed: ${response.status}` };
    }

    console.warn('[Momence Cancel] Success for booking:', bookingId);
    return { success: true };
  } catch (error) {
    console.error('[Momence Cancel] Error:', error);
    return { success: false, error: 'Momence API error' };
  }
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
  createdAt: string;
  status: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Obtener eventId de query o body
    const eventId =
      req.query['eventId'] ||
      (req.method === 'POST' || req.method === 'DELETE' ? req.body?.eventId : null);

    if (!eventId || typeof eventId !== 'string') {
      return res.status(400).json({
        error: 'Missing eventId',
        usage: '/api/cancelar?eventId=booking_xxx',
      });
    }

    const redis = getRedisClient();
    if (!redis) {
      return res.status(500).json({ error: 'Redis not configured' });
    }

    // Obtener datos de la reserva
    const bookingDetailsKey = `booking_details:${eventId}`;
    const bookingData = await redis.get(bookingDetailsKey);

    if (!bookingData) {
      return res.status(404).json({
        success: false,
        error: 'Reserva no encontrada',
        eventId,
      });
    }

    const booking: BookingDetails = JSON.parse(bookingData);

    // Verificar que no esté ya cancelada
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Esta reserva ya fue cancelada',
        eventId,
      });
    }

    // 1. Cancelar en Momence si tenemos los datos necesarios
    let momenceCancelled = false;
    if (booking.sessionId && booking.momenceBookingId) {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const result = await cancelMomenceBooking(
          accessToken,
          booking.sessionId,
          booking.momenceBookingId
        );
        momenceCancelled = result.success;
        if (!result.success) {
          console.warn('[cancelar] Momence cancellation failed:', result.error);
        }
      }
    }

    // 2. Actualizar estado en Redis (marcar como cancelada)
    booking.status = 'cancelled';
    await redis.setex(bookingDetailsKey, 7 * 24 * 60 * 60, JSON.stringify(booking)); // Keep 7 days for reference

    // 3. Eliminar la key de deduplicación
    const dedupeKey = `${BOOKING_KEY_PREFIX}${booking.email}`;
    await redis.del(dedupeKey);

    // 4. Enviar WhatsApp de cancelación
    let whatsappSent = false;
    try {
      const { sendCancellationWhatsApp } = await import('./lib/whatsapp');
      const whatsappResult = await sendCancellationWhatsApp({
        to: booking.phone,
        firstName: booking.firstName,
      });
      whatsappSent = whatsappResult.success;
      if (!whatsappResult.success) {
        console.warn('[cancelar] WhatsApp failed:', whatsappResult.error);
      }
    } catch (e) {
      console.warn('[cancelar] WhatsApp error:', e);
    }

    // 5. Enviar Email de cancelación
    let emailSent = false;
    try {
      const { sendCancellationEmail } = await import('./lib/email');
      const emailResult = await sendCancellationEmail({
        to: booking.email,
        firstName: booking.firstName,
        className: booking.className,
        bookingUrl: 'https://farrayscenter.com/reservas',
      });
      emailSent = emailResult.success;
      if (!emailResult.success) {
        console.warn('[cancelar] Email failed:', emailResult.error);
      }
    } catch (e) {
      console.warn('[cancelar] Email error:', e);
    }

    return res.status(200).json({
      success: true,
      message: 'Reserva cancelada correctamente',
      data: {
        eventId,
        className: booking.className,
        classDate: booking.classDate,
        momenceCancelled,
        whatsappSent,
        emailSent,
      },
    });
  } catch (error) {
    console.error('[cancelar] Error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
