import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

// Tipos inline (evitar imports de api/lib/ que fallan en Vercel)
type AttendanceStatus = 'pending' | 'confirmed' | 'not_attending' | 'cancelled';

// Verificar si Google Calendar está configurado
function isGoogleCalendarConfigured(): boolean {
  return !!(
    process.env['GOOGLE_CALENDAR_CLIENT_ID'] &&
    process.env['GOOGLE_CALENDAR_CLIENT_SECRET'] &&
    process.env['GOOGLE_CALENDAR_REFRESH_TOKEN']
  );
}

/**
 * API Route: /api/attendance
 *
 * Actualiza el estado de asistencia de una reserva.
 * Se puede llamar via:
 * - Webhook de WhatsApp (POST con phone + status)
 * - Link directo (GET con token + status)
 *
 * Estados válidos:
 * - 'confirmed': El alumno confirma que asistirá
 * - 'not_attending': El alumno dice que no podrá ir
 *
 * Acciones:
 * 1. Actualiza booking en Redis (attendance status)
 * 2. Actualiza color del evento en Google Calendar
 */

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
  calendarEventId?: string;
  attendance?: 'pending' | 'confirmed' | 'not_attending';
  attendanceUpdatedAt?: string;
}

const VALID_ATTENDANCE_STATUS = ['confirmed', 'not_attending'] as const;
type ValidAttendanceStatus = (typeof VALID_ATTENDANCE_STATUS)[number];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Link directo con token (desde email si se añade en el futuro)
  if (req.method === 'GET') {
    return handleGetRequest(req, res);
  }

  // POST: Webhook interno (desde webhook-whatsapp)
  if (req.method === 'POST') {
    return handlePostRequest(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Maneja GET requests (link directo)
 * /api/attendance?token=xxx&status=confirmed
 */
async function handleGetRequest(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> {
  const { token, status } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token required' });
  }

  if (!status || !VALID_ATTENDANCE_STATUS.includes(status as ValidAttendanceStatus)) {
    return res.status(400).json({
      error: 'Invalid status. Must be: confirmed or not_attending',
    });
  }

  const redis = getRedisClient();
  if (!redis) {
    console.error('[attendance] Redis not configured');
    return res.status(500).json({ error: 'Service unavailable' });
  }

  try {
    // Buscar eventId por token
    const eventId = await redis.get(`mgmt:${token}`);
    if (!eventId) {
      // Redirigir a página de error amigable
      return res.redirect(302, '/es/asistencia-confirmada?status=error&reason=token_expired');
    }

    // Actualizar asistencia
    const result = await updateAttendance(redis, eventId, status as ValidAttendanceStatus);

    if (!result.success) {
      return res.redirect(302, `/es/asistencia-confirmada?status=error&reason=${result.error}`);
    }

    // Redirigir a página de confirmación
    return res.redirect(302, `/es/asistencia-confirmada?status=${status}`);
  } catch (error) {
    console.error('[attendance] GET error:', error);
    return res.redirect(302, '/es/asistencia-confirmada?status=error&reason=server_error');
  }
}

/**
 * Maneja POST requests (webhook interno)
 * Body: { phone: string, status: 'confirmed' | 'not_attending' }
 */
async function handlePostRequest(req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  const { phone, status, eventId: providedEventId } = req.body;

  if (!status || !VALID_ATTENDANCE_STATUS.includes(status)) {
    return res.status(400).json({
      error: 'Invalid status. Must be: confirmed or not_attending',
    });
  }

  if (!phone && !providedEventId) {
    return res.status(400).json({ error: 'Phone or eventId required' });
  }

  const redis = getRedisClient();
  if (!redis) {
    console.error('[attendance] Redis not configured');
    return res.status(500).json({ error: 'Service unavailable' });
  }

  try {
    let eventId = providedEventId;

    // Si tenemos phone, buscar el booking más reciente
    if (phone && !eventId) {
      eventId = await findBookingByPhone(redis, phone);
      if (!eventId) {
        return res.status(404).json({ error: 'Booking not found for this phone' });
      }
    }

    // Actualizar asistencia
    const result = await updateAttendance(redis, eventId, status);

    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('[attendance] POST error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Actualiza el estado de asistencia de un booking
 */
async function updateAttendance(
  redis: Redis,
  eventId: string,
  status: ValidAttendanceStatus
): Promise<{ success: boolean; error?: string; booking?: Partial<BookingDetails> }> {
  try {
    // Obtener booking
    const bookingData = await redis.get(`booking_details:${eventId}`);
    if (!bookingData) {
      return { success: false, error: 'booking_not_found' };
    }

    const booking: BookingDetails = JSON.parse(bookingData);

    // Verificar que la reserva no esté cancelada
    if (booking.status === 'cancelled') {
      return { success: false, error: 'booking_cancelled' };
    }

    // Actualizar estado de asistencia
    booking.attendance = status;
    booking.attendanceUpdatedAt = new Date().toISOString();

    // Guardar en Redis
    await redis.set(`booking_details:${eventId}`, JSON.stringify(booking));

    console.log(`[attendance] Updated ${eventId}: ${booking.firstName} - ${status}`);

    // Actualizar Google Calendar si está configurado
    if (isGoogleCalendarConfigured() && booking.calendarEventId) {
      try {
        // Dynamic import para evitar errores de Vercel con imports de subdirectorios
        const { updateEventAttendance } = await import('./lib/google-calendar');
        const calendarResult = await updateEventAttendance(
          booking.calendarEventId,
          status as AttendanceStatus
        );

        if (!calendarResult.success) {
          console.warn('[attendance] Calendar update failed:', calendarResult.error);
          // No fallar la operación por esto
        }
      } catch (calendarError) {
        console.warn('[attendance] Calendar update error:', calendarError);
      }
    }

    return {
      success: true,
      booking: {
        eventId: booking.eventId,
        firstName: booking.firstName,
        className: booking.className,
        attendance: booking.attendance,
      },
    };
  } catch (error) {
    console.error('[attendance] Update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'unknown_error',
    };
  }
}

/**
 * Busca un booking por número de teléfono
 * Retorna el eventId del booking más reciente con clase pendiente
 */
async function findBookingByPhone(redis: Redis, phone: string): Promise<string | null> {
  // Normalizar teléfono (quitar +, espacios, guiones)
  const normalizedPhone = phone.replace(/[\s\-+]/g, '');

  // Buscar en índice de teléfonos si existe
  const phoneIndex = await redis.get(`phone:${normalizedPhone}`);
  if (phoneIndex) {
    return phoneIndex;
  }

  // Fallback: buscar en todos los bookings recientes (menos eficiente)
  // Nota: En producción, deberíamos mantener un índice phone -> eventId
  console.warn('[attendance] Phone index not found, scanning recent bookings');

  // Buscar en los últimos 7 días de índices
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];

    const eventIds = await redis.smembers(`booking_index:${dateKey}`);

    for (const eventId of eventIds) {
      const bookingData = await redis.get(`booking_details:${eventId}`);
      if (bookingData) {
        const booking: BookingDetails = JSON.parse(bookingData);
        const bookingPhone = booking.phone.replace(/[\s\-+]/g, '');

        if (bookingPhone === normalizedPhone || bookingPhone.endsWith(normalizedPhone.slice(-9))) {
          // Guardar índice para futuras búsquedas
          await redis.set(`phone:${normalizedPhone}`, eventId, 'EX', 30 * 24 * 60 * 60);
          return eventId;
        }
      }
    }
  }

  return null;
}
