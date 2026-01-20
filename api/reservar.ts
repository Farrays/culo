import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';
import crypto from 'crypto';

/* eslint-disable no-undef */
// Note: Buffer and URLSearchParams are Node.js globals available in Vercel serverless functions

/**
 * API Route: /api/reservar
 *
 * Crea una reserva de clase de prueba gratuita.
 * Flujo completo:
 * 1. Validar datos
 * 2. Crear booking en Momence (o Customer Lead si no hay sessionId)
 * 3. Enviar evento a Meta CAPI (Lead con valor €90)
 * 4. Guardar en Redis para deduplicación
 * 5. Retornar confirmación
 *
 * Variables de entorno requeridas:
 * - MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD
 * - MOMENCE_API_URL (Customer Leads URL)
 * - MOMENCE_TOKEN (Customer Leads Token)
 * - META_PIXEL_ID
 * - META_CAPI_TOKEN
 * - STORAGE_REDIS_URL (opcional)
 */

const MOMENCE_API_URL = 'https://api.momence.com';
const MOMENCE_AUTH_URL = 'https://api.momence.com/api/v2/auth/token';
const META_CAPI_URL = 'https://graph.facebook.com/v18.0';

// Lead value calculado: 50€/mes * 6 meses retención * 30% conversión = €90
const LEAD_VALUE_EUR = 90;

// TTL de 90 días para deduplicación
const BOOKING_TTL_SECONDS = 90 * 24 * 60 * 60;
const BOOKING_KEY_PREFIX = 'booking:';
const TOKEN_CACHE_KEY = 'momence:access_token';
const TOKEN_TTL_SECONDS = 3500;

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 3; // 3 reservas por minuto por IP (más estricto)

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

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count++;
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  // Acepta formatos internacionales:
  // +34666555444 (España)
  // +33612345678 (Francia)
  // +1234567890 (USA)
  // 666555444 (local)
  // Mínimo 7 dígitos, máximo 15 (estándar E.164)
  const digits = phone.replace(/[\s().-]/g, '');
  const cleanDigits = digits.replace(/^\+/, '');
  return cleanDigits.length >= 7 && cleanDigits.length <= 15 && /^\+?\d+$/.test(digits);
}

function sanitize(str: string): string {
  return String(str || '')
    .trim()
    .slice(0, 500);
}

// Hash SHA256 para Meta CAPI (normalizado)
function hashForMeta(value: string): string {
  const normalized = value.toLowerCase().trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

// Normalizar teléfono para Meta CAPI (E.164: solo dígitos con código país)
function normalizePhone(phone: string): string {
  // Eliminar todo excepto dígitos y el + inicial
  const cleaned = phone.replace(/[\s().-]/g, '');

  // Si empieza con +, quitar el + y devolver solo dígitos
  if (cleaned.startsWith('+')) {
    return cleaned.substring(1);
  }

  // Si es un número español sin código (9 dígitos empezando por 6,7,8,9)
  if (cleaned.length === 9 && /^[6789]/.test(cleaned)) {
    return '34' + cleaned;
  }

  // Si es un número francés sin código (10 dígitos empezando por 0)
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return '33' + cleaned.substring(1);
  }

  // Devolver tal cual (ya tiene código país o formato desconocido)
  return cleaned;
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

// Crear booking en Momence (clase de prueba gratuita)
async function createMomenceBooking(
  accessToken: string,
  sessionId: number,
  customerData: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  }
): Promise<{ success: boolean; bookingId?: number; error?: string }> {
  try {
    console.warn(
      '[Momence Booking] Starting for sessionId:',
      sessionId,
      'email:',
      customerData.email
    );

    // Primero, buscar o crear el customer
    console.warn('[Momence Booking] Searching for existing member...');
    const memberResponse = await fetch(`${MOMENCE_API_URL}/api/v2/host/members/list`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: 0,
        pageSize: 1,
        email: customerData.email,
      }),
    });

    let customerId: number | null = null;

    if (memberResponse.ok) {
      const memberData = await memberResponse.json();
      console.warn('[Momence Booking] Member search response:', JSON.stringify(memberData));
      if (memberData.payload && memberData.payload.length > 0) {
        customerId = memberData.payload[0].id;
        console.warn('[Momence Booking] Found existing member ID:', customerId);
      } else {
        console.warn('[Momence Booking] No existing member found, will create new one');
      }
    } else {
      const errorText = await memberResponse.text();
      console.error('[Momence Booking] Member search failed:', memberResponse.status, errorText);
    }

    // Si no existe, crear el customer
    if (!customerId) {
      console.warn('[Momence Booking] Creating new member...');
      const createMemberResponse = await fetch(`${MOMENCE_API_URL}/api/v2/host/members`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerData.email,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
        }),
      });

      if (createMemberResponse.ok) {
        const newMember = await createMemberResponse.json();
        console.warn('[Momence Booking] Member creation response:', JSON.stringify(newMember));
        customerId = newMember.payload?.id || newMember.id;
        console.warn('[Momence Booking] Created new member ID:', customerId);
      } else {
        const errorText = await createMemberResponse.text();
        console.error(
          '[Momence Booking] Member creation failed:',
          createMemberResponse.status,
          errorText
        );
      }
    }

    if (!customerId) {
      console.error('[Momence Booking] Could not create or find customer');
      return { success: false, error: 'Could not create or find customer' };
    }

    // Crear el booking gratuito
    // API docs: POST /api/v2/host/sessions/{sessionId}/add-for-free
    // Body: { memberId: number (required) }
    // Ref: https://api.docs.momence.com/reference/apiv2hostsessionbookingcontroller_addforfree
    console.warn(
      '[Momence Booking] Creating booking for memberId:',
      customerId,
      'sessionId:',
      sessionId
    );
    const bookingResponse = await fetch(
      `${MOMENCE_API_URL}/api/v2/host/sessions/${sessionId}/add-for-free`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: customerId,
        }),
      }
    );

    if (!bookingResponse.ok) {
      const errorText = await bookingResponse.text();
      console.error(
        '[Momence Booking] Booking creation failed:',
        bookingResponse.status,
        errorText
      );
      return { success: false, error: `Booking failed: ${bookingResponse.status} - ${errorText}` };
    }

    const bookingData = await bookingResponse.json();
    console.warn('[Momence Booking] Full response:', JSON.stringify(bookingData));

    const bookingId = bookingData.payload?.id || bookingData.id;

    // Validate we actually got a booking ID
    if (!bookingId) {
      console.error('[Momence Booking] No booking ID in response:', bookingData);
      return { success: false, error: 'Momence returned no booking ID' };
    }

    console.warn('[Momence Booking] SUCCESS! Created booking:', bookingId);
    return { success: true, bookingId };
  } catch (error) {
    console.error('[Momence Booking] Error:', error);
    return { success: false, error: 'Momence API error' };
  }
}

// Timezone de España para formatear fechas
const SPAIN_TIMEZONE = 'Europe/Madrid';

// Formatear fecha ISO a formato ISO local de Madrid (para automatizaciones de Momence)
// Entrada: "2024-01-20T18:00:00.000Z" (UTC)
// Salida: "2024-01-20T19:00:00" (Madrid local, sin Z)
function formatDateForLeads(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;

    // Obtener componentes en timezone de Madrid
    const parts = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: SPAIN_TIMEZONE,
    }).formatToParts(date);

    // Construir ISO string local (sin Z = interpretado como local)
    const get = (type: string) => parts.find(p => p.type === type)?.value || '00';
    return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`;
  } catch {
    return isoDate; // Fallback al original si hay error
  }
}

// Enviar a Customer Leads (alternativa cuando no hay sessionId específico)
async function sendToCustomerLeads(data: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  className?: string; // Nombre real de la clase (ej: "Sexy Style Iniciación")
  estilo?: string; // Estilo normalizado (legacy, como fallback)
  date?: string;
  comoconoce?: string;
}): Promise<{ success: boolean }> {
  const MOMENCE_LEADS_URL = process.env['MOMENCE_API_URL'];
  const MOMENCE_TOKEN = process.env['MOMENCE_TOKEN'];

  if (!MOMENCE_LEADS_URL || !MOMENCE_TOKEN) {
    console.error('Missing Customer Leads credentials');
    return { success: false };
  }

  try {
    const payload = {
      token: MOMENCE_TOKEN,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phone,
      // Enviar nombre de clase real, no el estilo normalizado
      estilo: data.className || data.estilo || '',
      // Formatear fecha con hora de Madrid
      date: formatDateForLeads(data.date || ''),
      comoconoce: data.comoconoce || 'Web - Formulario Reservas',
    };

    console.warn('[Customer Leads] Sending to:', MOMENCE_LEADS_URL);
    console.warn('[Customer Leads] Payload:', { ...payload, token: '[REDACTED]' });

    const response = await fetch(MOMENCE_LEADS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.warn('[Customer Leads] Response status:', response.status);
    console.warn('[Customer Leads] Response body:', responseText);

    return { success: response.ok };
  } catch (error) {
    console.error('[Customer Leads] Error:', error);
    return { success: false };
  }
}

// Enviar evento a Meta Conversions API
async function sendMetaConversionEvent(data: {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  eventName: string;
  eventId: string;
  sourceUrl: string;
  userAgent: string;
  clientIp: string;
  fbc?: string;
  fbp?: string;
}): Promise<{ success: boolean }> {
  const PIXEL_ID = process.env['META_PIXEL_ID'];
  const ACCESS_TOKEN = process.env['META_CAPI_TOKEN'];

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('Meta CAPI not configured');
    return { success: false };
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const normalizedPhone = normalizePhone(data.phone);

  const eventData = {
    data: [
      {
        event_name: data.eventName,
        event_time: timestamp,
        event_id: data.eventId,
        event_source_url: data.sourceUrl,
        action_source: 'website',
        user_data: {
          em: [hashForMeta(data.email)],
          ph: [hashForMeta(normalizedPhone)],
          fn: [hashForMeta(data.firstName)],
          ln: [hashForMeta(data.lastName)],
          // Detectar país por prefijo telefónico
          ...(normalizedPhone.startsWith('34') ? { country: [hashForMeta('es')] } : {}),
          ...(normalizedPhone.startsWith('33') ? { country: [hashForMeta('fr')] } : {}),
          ...(normalizedPhone.startsWith('34') ? { ct: [hashForMeta('barcelona')] } : {}),
          client_ip_address: data.clientIp,
          client_user_agent: data.userAgent,
          fbc: data.fbc || undefined,
          fbp: data.fbp || undefined,
        },
        custom_data: {
          currency: 'EUR',
          value: LEAD_VALUE_EUR,
          content_name: 'Clase de Prueba Gratuita',
          content_category: 'Dance Class',
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `${META_CAPI_URL}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Meta CAPI error:', response.status, errorText);
      return { success: false };
    }

    await response.json();
    return { success: true };
  } catch (error) {
    console.error('Meta CAPI error:', error);
    return { success: false };
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  // Rate limiting
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Espera un momento.' });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      sessionId, // ID de la clase en Momence (opcional)
      className, // Nombre de la clase (para display)
      classDate, // Fecha de la clase
      estilo, // Estilo de baile
      comoconoce, // Cómo nos conoció
      acceptsTerms, // UI checkbox (consolidates marketing, no-refund, image)
      acceptsMarketing, // Legacy: kept for backwards compatibility
      // Meta tracking cookies
      fbc,
      fbp,
      sourceUrl,
      eventId, // Para deduplicación Pixel + CAPI
    } = req.body;

    // Validaciones
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Check acceptsTerms (current UI) OR acceptsMarketing (legacy support)
    if (!acceptsTerms && !acceptsMarketing) {
      return res.status(400).json({ error: 'Debes aceptar los términos y condiciones' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email no válido' });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Teléfono no válido' });
    }

    const normalizedEmail = sanitize(email).toLowerCase();
    const bookingKey = `${BOOKING_KEY_PREFIX}${normalizedEmail}`;

    // Deduplicación con Redis
    const redis = getRedisClient();
    if (redis) {
      try {
        const existing = await redis.get(bookingKey);
        if (existing) {
          // Ya existe una reserva reciente
          return res.status(200).json({
            success: true,
            status: 'existing',
            message: 'Ya tienes una reserva registrada. ¡Te esperamos!',
          });
        }
      } catch (e) {
        console.warn('Redis lookup failed:', e);
      }
    }

    // Generar eventId único si no viene del frontend
    const finalEventId =
      eventId || `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 1. Crear booking en Momence o enviar a Customer Leads
    let momenceResult: { success: boolean; bookingId?: number; error?: string } = {
      success: false,
    };

    console.warn('[reservar] Starting booking process:', {
      hasSessionId: !!sessionId,
      sessionId,
      email: normalizedEmail,
      className,
    });

    if (sessionId) {
      // Si tenemos sessionId, crear booking real
      const accessToken = await getAccessToken();
      console.warn('[reservar] Got access token:', !!accessToken);

      if (accessToken) {
        momenceResult = await createMomenceBooking(accessToken, parseInt(sessionId), {
          email: normalizedEmail,
          firstName: sanitize(firstName),
          lastName: sanitize(lastName),
          phone: sanitize(phone),
        });
        console.warn('[reservar] Momence booking result:', momenceResult);
      } else {
        console.error('[reservar] Failed to get Momence access token - check OAuth credentials');
      }
    } else {
      console.warn('[reservar] No sessionId provided, will use Customer Leads');
    }

    // Si no hay sessionId o el booking falló, enviar a Customer Leads
    if (!momenceResult.success) {
      console.warn('[reservar] Booking failed or no sessionId, trying Customer Leads...');
      console.warn('[reservar] Customer Leads env check:', {
        hasLeadsUrl: !!process.env['MOMENCE_API_URL'],
        hasToken: !!process.env['MOMENCE_TOKEN'],
      });

      const leadsResult = await sendToCustomerLeads({
        email: normalizedEmail,
        firstName: sanitize(firstName),
        lastName: sanitize(lastName),
        phone: sanitize(phone),
        className: sanitize(className || ''), // Nombre real de la clase
        estilo: sanitize(estilo || ''), // Fallback al estilo normalizado
        date: sanitize(classDate || ''),
        comoconoce: sanitize(comoconoce || ''),
      });
      console.warn('[reservar] Customer Leads result:', leadsResult);
      momenceResult = { success: leadsResult.success };
    }

    // 2. Enviar evento a Meta CAPI (siempre, independiente de Momence)
    const userAgent = req.headers['user-agent'] || '';
    const metaResult = await sendMetaConversionEvent({
      email: normalizedEmail,
      phone: sanitize(phone),
      firstName: sanitize(firstName),
      lastName: sanitize(lastName),
      eventName: 'Lead',
      eventId: finalEventId,
      sourceUrl: sourceUrl || 'https://www.farrayscenter.com/reservas',
      userAgent,
      clientIp,
      fbc,
      fbp,
    });

    // 3. Guardar en Redis
    if (redis) {
      try {
        const bookingTimestamp = Date.now();
        await redis.setex(
          bookingKey,
          BOOKING_TTL_SECONDS,
          JSON.stringify({
            timestamp: bookingTimestamp,
            sessionId,
            className,
            classDate,
            eventId: finalEventId,
          })
        );

        // Añadir a lista de reservas recientes para Social Proof Ticker
        const firstNameOnly = sanitize(firstName).split(' ')[0] || 'Usuario';
        await redis.lpush(
          'recent_bookings',
          JSON.stringify({
            firstName: firstNameOnly,
            className: className || estilo || 'Clase de Prueba',
            timestamp: bookingTimestamp,
          })
        );
        // Mantener solo las últimas 50 reservas
        await redis.ltrim('recent_bookings', 0, 49);
      } catch (e) {
        console.warn('Redis save failed:', e);
      }
    }

    // Respuesta
    return res.status(200).json({
      success: true,
      status: 'new',
      message: '¡Reserva confirmada! Te hemos enviado un email con los detalles.',
      data: {
        eventId: finalEventId,
        className: className || 'Clase de Prueba',
        classDate: classDate || '',
        momenceSuccess: momenceResult.success,
        trackingSuccess: metaResult.success,
      },
    });
  } catch (error) {
    console.error('Booking API error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
