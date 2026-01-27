import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';
import crypto from 'crypto';
import { Resend } from 'resend';

// ============================================================================
// TIPOS INLINE (evitar imports de api/lib/ que fallan en Vercel)
// ============================================================================

type ClassCategory = 'bailes_sociales' | 'danzas_urbanas' | 'danza' | 'entrenamiento' | 'heels';

// ============================================================================
// EMAIL HELPER INLINE
// ============================================================================

const EMAIL_FROM = "Farray's Center <onboarding@resend.dev>";
const EMAIL_REPLY_TO = 'info@farrayscenter.com';

// Colores corporativos
const BRAND_PRIMARY = '#B01E3C'; // Rojo carmesí del logo
const BRAND_DARK = '#800020';
const LOGO_URL = 'https://farrayscenter.vercel.app/images/logo/img/logo-fidc_256.png';
// TODO: Cambiar a farrayscenter.com cuando esté listo
const BASE_URL = 'https://farrayscenter.vercel.app';

interface CategoryInstructions {
  title: string;
  items: string[];
  color: string;
}

function getCategoryInstructions(category?: ClassCategory): CategoryInstructions {
  const commonItems = [
    '💧 Botella de agua',
    '🧴 Toalla pequeña',
    '🔐 Candado para taquilla (opcional)',
  ];

  switch (category) {
    case 'bailes_sociales':
      return {
        title: '¿Qué traer a tu clase de Bailes Sociales?',
        color: BRAND_PRIMARY,
        items: [
          '👠 <strong>Chicas:</strong> Bambas o zapatos de tacón cómodos',
          '👞 <strong>Chicos:</strong> Bambas o zapatos de baile',
          '📝 <strong>Folklore:</strong> Sin calzado (se baila descalzo)',
          ...commonItems,
        ],
      };
    case 'danzas_urbanas':
      return {
        title: '¿Qué traer a tu clase de Danzas Urbanas?',
        color: BRAND_PRIMARY,
        items: [
          '👟 Bambas cómodas (suela limpia)',
          '👖 Leggings, pantalones cortos o chándal',
          '👕 Ropa cómoda y ligera (tipo fitness)',
          '💃 <strong>Sexy Style:</strong> Bambas o tacones Stiletto. Rodilleras recomendadas',
          '🍑 <strong>Twerk:</strong> Rodilleras recomendadas',
          ...commonItems,
        ],
      };
    case 'danza':
    case 'entrenamiento':
      return {
        title:
          category === 'entrenamiento'
            ? '¿Qué traer a tu Entrenamiento?'
            : '¿Qué traer a tu clase de Danza?',
        color: BRAND_PRIMARY,
        items: [
          '🦶 <strong>Sin calzado</strong> o calcetines antideslizantes',
          '🦵 Rodilleras recomendadas (especialmente para floorwork)',
          '👖 Ropa ajustada que permita ver la línea del cuerpo',
          ...commonItems,
        ],
      };
    case 'heels':
      return {
        title: '¿Qué traer a tu clase de Heels?',
        color: BRAND_PRIMARY,
        items: [
          '👠 <strong>Tacones Stiletto</strong> (obligatorios)',
          '💃 Ropa femenina y atrevida que te haga sentir poderosa',
          '🎽 Top o body que permita libertad de movimiento',
          ...commonItems,
        ],
      };
    default:
      return {
        title: '¿Qué traer?',
        color: BRAND_PRIMARY,
        items: ['👟 Ropa cómoda para bailar', '👠 Calzado según el estilo', ...commonItems],
      };
  }
}

function generateWhatToBringSection(category?: ClassCategory): string {
  const inst = getCategoryInstructions(category);
  return `
  <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h3 style="margin: 0 0 15px 0; color: ${inst.color};">${inst.title}</h3>
    <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
      ${inst.items.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-top: 15px;">
      <strong style="color: #1976d2;">⏰ Importante:</strong>
      <p style="margin: 5px 0 0 0; color: #666;">Llega <strong>10 minutos antes</strong> para cambiarte.</p>
    </div>
  </div>
  <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h4 style="margin: 0 0 10px 0; color: #333;">📍 Cómo llegar</h4>
    <p style="margin: 0; color: #666;">
      <strong>Farray's International Dance Center</strong><br>
      C/ Entença 100, 08015 Barcelona<br><br>
      🚇 <strong>Metro:</strong> Rocafort (L1) o Entença (L5)<br>
      🚌 <strong>Bus:</strong> Líneas 41, 54, H8
    </p>
  </div>`;
}

async function sendBookingConfirmationEmail(data: {
  to: string;
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
  managementUrl: string;
  mapUrl?: string;
  category?: ClassCategory;
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) return { success: false, error: 'Missing RESEND_API_KEY' };

  const resend = new Resend(apiKey);
  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.to,
      replyTo: EMAIL_REPLY_TO,
      subject: `Reserva confirmada: ${data.className}`,
      html: `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: ${BRAND_PRIMARY}; margin: 0;">Farray's International Dance Center</h1>
  </div>
  <div style="background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_DARK} 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0 0 10px 0;">¡Reserva Confirmada!</h2>
    <p style="margin: 0; opacity: 0.9;">Tu clase de prueba está lista</p>
  </div>
  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${data.firstName}</strong>,</p>
    <p style="margin: 0;">Tu reserva ha sido confirmada. Aquí están los detalles:</p>
  </div>
  <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Clase</span><br><strong style="font-size: 18px;">${data.className}</strong></td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Fecha</span><br><strong>${data.classDate}</strong></td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Hora</span><br><strong>${data.classTime}</strong></td></tr>
      <tr><td style="padding: 10px 0;"><span style="color: #666;">Ubicación</span><br><strong>Farray's International Dance Center</strong><br><span style="color: #666;">C/ Entença 100, 08015 Barcelona</span></td></tr>
    </table>
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${data.managementUrl}" style="display: inline-block; background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_DARK} 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 5px;">Ver mi reserva</a>
    ${data.mapUrl ? `<a href="${data.mapUrl}" style="display: inline-block; background: #4285f4; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 5px;">Cómo llegar</a>` : ''}
  </div>
  ${generateWhatToBringSection(data.category)}
  <div style="text-align: center; padding: 25px 0;">
    <p style="color: #666; font-size: 14px; margin: 0 0 15px 0;">¿No puedes asistir?</p>
    <a href="${data.managementUrl}" style="display: inline-block; background: #ffffff; color: ${BRAND_PRIMARY}; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; border: 2px solid ${BRAND_PRIMARY};">Reprogramar / Cancelar Reserva</a>
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #1a1a1a; margin-top: 30px;">
    <tr>
      <td style="padding: 30px; text-align: center;">
        <img src="${LOGO_URL}" alt="Farray's International Dance Center" width="70" height="70" style="margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
        <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 15px; color: #ffffff;">Farray's International Dance Center</p>
        <p style="margin: 0 0 15px 0; color: #999999; font-size: 13px;">C/ Entença 100, 08015 Barcelona</p>
        <p style="margin: 0 0 20px 0;">
          <a href="${BASE_URL}" style="color: ${BRAND_PRIMARY}; text-decoration: none; font-weight: bold; font-size: 14px;">farrayscenter.com</a>
        </p>
        <p style="margin: 0; padding-top: 15px; border-top: 1px solid #333;">
          <a href="https://instagram.com/farrayscenter" style="color: #888888; text-decoration: none; margin: 0 12px; font-size: 13px;">Instagram</a>
          <a href="https://wa.me/34622247085" style="color: #888888; text-decoration: none; margin: 0 12px; font-size: 13px;">WhatsApp</a>
        </p>
      </td>
    </tr>
  </table>
</body></html>`,
    });
    if (result.error) return { success: false, error: result.error.message };
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============================================================================
// WHATSAPP HELPER INLINE
// ============================================================================

const WHATSAPP_API_VERSION = 'v23.0';
const CATEGORY_TEMPLATES: Record<ClassCategory, string> = {
  bailes_sociales: 'confirmacion_bailes_sociales',
  danzas_urbanas: 'confirmacion_danzas_urbanas',
  danza: 'confirmacion_danza',
  entrenamiento: 'confirmacion_danza',
  heels: 'confirmacion_heels',
};

function isWhatsAppConfigured(): boolean {
  return !!(process.env['WHATSAPP_TOKEN'] && process.env['WHATSAPP_PHONE_ID']);
}

async function sendBookingConfirmationWhatsApp(data: {
  to: string;
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
  category: ClassCategory;
}): Promise<{ success: boolean; error?: string }> {
  const token = process.env['WHATSAPP_TOKEN'];
  const phoneId = process.env['WHATSAPP_PHONE_ID'];
  if (!token || !phoneId) return { success: false, error: 'WhatsApp not configured' };

  const templateName = CATEGORY_TEMPLATES[data.category];
  const normalizedPhone = data.to.replace(/[\s\-+]/g, '');

  try {
    const response = await fetch(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneId}/messages`,
      {
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
            name: templateName,
            language: { code: 'es_ES' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: data.firstName },
                  { type: 'text', text: data.className },
                  { type: 'text', text: data.classDate },
                  { type: 'text', text: data.classTime },
                ],
              },
            ],
          },
        }),
      }
    );

    const result = await response.json();
    if (!response.ok || result.error) {
      return { success: false, error: result.error?.message || `HTTP ${response.status}` };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

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
  if (!redisUrl) {
    console.warn('[Redis] STORAGE_REDIS_URL not configured');
    return null;
  }

  if (!redisClient) {
    console.warn('[Redis] Creating new Redis client');
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 2,
      connectTimeout: 10000,
      lazyConnect: true,
      retryStrategy: times => {
        if (times > 3) return null;
        return Math.min(times * 100, 2000);
      },
    });
  }
  return redisClient;
}

// Helper to ensure Redis is connected
async function ensureRedisConnected(redis: Redis): Promise<boolean> {
  try {
    if (redis.status !== 'ready') {
      await redis.connect();
    }
    // Quick ping to verify connection
    await redis.ping();
    return true;
  } catch (e) {
    console.error('[Redis] Connection check failed:', e);
    return false;
  }
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

    // Get hostLocationId from environment variable or use hardcoded fallback
    let hostLocationId: number | null = null;

    // Farray's Center location ID in Momence (from dashboard URL: /locations/26485)
    const FARRAY_LOCATION_ID = 26485;

    // First check environment variable, then use hardcoded fallback
    const envLocationId = process.env['MOMENCE_LOCATION_ID'];
    if (envLocationId) {
      hostLocationId = parseInt(envLocationId, 10);
      console.warn('[Momence Booking] Using MOMENCE_LOCATION_ID from env:', hostLocationId);
    } else {
      hostLocationId = FARRAY_LOCATION_ID;
      console.warn('[Momence Booking] Using hardcoded location ID:', hostLocationId);
    }

    // If not in env, try to get it from the session
    if (!hostLocationId) {
      try {
        const sessionResponse = await fetch(
          `${MOMENCE_API_URL}/api/v2/host/sessions/${sessionId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          console.warn('[Momence Booking] Session data:', JSON.stringify(sessionData));
          // Try different field names
          const session = sessionData.payload || sessionData;
          hostLocationId = session.hostLocationId || session.locationId || session.location?.id;
          console.warn('[Momence Booking] hostLocationId from session:', hostLocationId);
        }
      } catch (err) {
        console.warn('[Momence Booking] Could not fetch session details:', err);
      }
    }

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
        pageSize: 100,
        filters: {
          email: customerData.email,
        },
      }),
    });

    let customerId: number | null = null;

    if (memberResponse.ok) {
      const memberData = await memberResponse.json();
      console.warn('[Momence Booking] Member search response:', JSON.stringify(memberData));
      if (memberData.payload && memberData.payload.length > 0) {
        // Verify the email matches - API may return all members instead of filtering
        const foundMember = memberData.payload.find(
          (m: { email?: string }) => m.email?.toLowerCase() === customerData.email.toLowerCase()
        );
        if (foundMember) {
          customerId = foundMember.id;
          console.warn('[Momence Booking] Found existing member ID:', customerId);
        } else {
          console.warn(
            '[Momence Booking] API returned members but none match email:',
            customerData.email
          );
        }
      } else {
        console.warn('[Momence Booking] No existing member found, will create new one');
      }
    } else {
      const errorText = await memberResponse.text();
      console.error('[Momence Booking] Member search failed:', memberResponse.status, errorText);
    }

    // Si no existe, crear el customer
    if (!customerId) {
      if (!hostLocationId) {
        console.error('[Momence Booking] Cannot create member without hostLocationId');
        return { success: false, error: 'Missing hostLocationId for member creation' };
      }
      console.warn('[Momence Booking] Creating new member with homeLocationId:', hostLocationId);
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
          phoneNumber: customerData.phone,
          homeLocationId: hostLocationId,
        }),
      });

      if (createMemberResponse.ok) {
        const newMember = await createMemberResponse.json();
        console.warn('[Momence Booking] Member creation response:', JSON.stringify(newMember));
        // API docs say response has 'memberId' field
        customerId = newMember.memberId || newMember.payload?.id || newMember.id;
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
    // Endpoint: POST /api/v2/host/sessions/{sessionId}/bookings/free
    // Body: { memberId: number (required) }
    // Docs: https://api.docs.momence.com
    console.warn(
      '[Momence Booking] Creating booking for memberId:',
      customerId,
      'sessionId:',
      sessionId
    );
    const bookingResponse = await fetch(
      `${MOMENCE_API_URL}/api/v2/host/sessions/${sessionId}/bookings/free`,
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

    const bookingId = bookingData.sessionBookingId || bookingData.payload?.id || bookingData.id;

    // Validate we actually got a booking ID
    if (!bookingId) {
      console.error('[Momence Booking] No booking ID in response:', bookingData);
      return { success: false, error: 'Momence returned no booking ID' };
    }

    console.warn('[Momence Booking] SUCCESS! Created booking:', bookingId);

    // Verify booking exists by fetching session bookings
    try {
      const verifyResponse = await fetch(
        `${MOMENCE_API_URL}/api/v2/host/sessions/${sessionId}/bookings`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.warn(
          '[Momence Booking] Session bookings after creation:',
          JSON.stringify(verifyData)
        );
        // Check if our booking is in the list
        const bookings = verifyData.payload || verifyData || [];
        const ourBooking = Array.isArray(bookings)
          ? bookings.find(
              (b: { id?: number; sessionBookingId?: number; memberId?: number }) =>
                b.id === bookingId || b.sessionBookingId === bookingId || b.memberId === customerId
            )
          : null;
        console.warn(
          '[Momence Booking] Our booking found in list:',
          ourBooking ? 'YES' : 'NO',
          ourBooking
        );
      } else {
        console.warn('[Momence Booking] Could not verify booking:', verifyResponse.status);
      }
    } catch (verifyError) {
      console.warn('[Momence Booking] Verification error:', verifyError);
    }

    return { success: true, bookingId };
  } catch (error) {
    console.error('[Momence Booking] Error:', error);
    return { success: false, error: 'Momence API error' };
  }
}

// Timezone de España para formatear fechas
const SPAIN_TIMEZONE = 'Europe/Madrid';

// ============================================================================
// CATEGORIZACIÓN DE CLASES
// ============================================================================

/**
 * Determina la categoría de una clase basándose en su nombre o estilo
 */
function determineCategory(className: string, estilo?: string): ClassCategory {
  const text = `${className} ${estilo || ''}`.toLowerCase();

  // Heels / Femmology
  if (text.includes('heel') || text.includes('femmology') || text.includes('stiletto')) {
    return 'heels';
  }

  // Bailes Sociales
  if (
    text.includes('salsa') ||
    text.includes('bachata') ||
    text.includes('kizomba') ||
    text.includes('zouk') ||
    text.includes('merengue') ||
    text.includes('rueda') ||
    text.includes('casino') ||
    text.includes('timba') ||
    text.includes('son cubano') ||
    text.includes('folklore')
  ) {
    return 'bailes_sociales';
  }

  // Danzas Urbanas
  if (
    text.includes('hip hop') ||
    text.includes('hiphop') ||
    text.includes('house') ||
    text.includes('breaking') ||
    text.includes('break') ||
    text.includes('dancehall') ||
    text.includes('afrobeat') ||
    text.includes('twerk') ||
    text.includes('sexy style') ||
    text.includes('sexy reggaeton') ||
    text.includes('reggaeton') ||
    text.includes('k-pop') ||
    text.includes('kpop') ||
    text.includes('commercial')
  ) {
    return 'danzas_urbanas';
  }

  // Danza
  if (
    text.includes('ballet') ||
    text.includes('contempor') ||
    text.includes('jazz') ||
    text.includes('modern') ||
    text.includes('afro jazz') ||
    text.includes('afro contempor')
  ) {
    return 'danza';
  }

  // Entrenamiento / Fitness
  if (
    text.includes('entrenamiento') ||
    text.includes('training') ||
    text.includes('fitness') ||
    text.includes('stretch') ||
    text.includes('cardio') ||
    text.includes('bum bum') ||
    text.includes('cuerpo fit')
  ) {
    return 'entrenamiento';
  }

  // Default: danzas urbanas (la más común)
  return 'danzas_urbanas';
}

/**
 * Formatea fecha ISO a formato legible
 * Entrada: "2024-01-20T18:00:00.000Z"
 * Salida: "Lunes 20 de Enero 2024"
 */
function formatDateReadable(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: SPAIN_TIMEZONE,
    };

    const formatted = new Intl.DateTimeFormat('es-ES', options).format(date);
    // Capitalizar primera letra
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return isoDate;
  }
}

/**
 * Extrae la hora de una fecha ISO
 * Entrada: "2024-01-20T18:00:00.000Z"
 * Salida: "19:00" (en hora de Madrid)
 */
function extractTime(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: SPAIN_TIMEZONE,
    };

    return new Intl.DateTimeFormat('es-ES', options).format(date);
  } catch {
    return '';
  }
}

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

    console.warn('[reservar] Deduplication check for:', { email: normalizedEmail, bookingKey });

    // Deduplicación con Redis
    const redis = getRedisClient();
    if (redis) {
      const isConnected = await ensureRedisConnected(redis);
      console.warn('[reservar] Redis connected:', isConnected);

      if (isConnected) {
        try {
          const existing = await redis.get(bookingKey);
          console.warn('[reservar] Existing booking found:', !!existing);

          if (existing) {
            // Ya existe una reserva reciente
            console.warn('[reservar] DUPLICATE DETECTED! Returning existing status');
            return res.status(200).json({
              success: true,
              status: 'existing',
              message: 'Ya tienes una reserva registrada. ¡Te esperamos!',
            });
          }
        } catch (e) {
          console.error('[reservar] Redis lookup failed:', e);
        }
      }
    } else {
      console.warn('[reservar] Redis not available for deduplication');
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

    // Variables comunes para Redis y notificaciones
    const category = determineCategory(className || '', estilo);
    const formattedDate = formatDateReadable(classDate || '');
    const classTime = extractTime(classDate || '');
    const firstNameOnly = sanitize(firstName).split(' ')[0] || 'Usuario';

    // 3. Guardar en Redis (datos completos para página mi-reserva)
    if (redis) {
      const isConnected = await ensureRedisConnected(redis);
      console.warn('[reservar] Redis connected for save:', isConnected);

      if (isConnected) {
        try {
          const bookingTimestamp = Date.now();
          const bookingData = {
            timestamp: bookingTimestamp,
            sessionId,
            // Datos para MyBookingPage
            firstName: firstNameOnly,
            lastName: sanitize(lastName),
            email: normalizedEmail,
            phone: phone || null,
            className: className || estilo || 'Clase de Prueba',
            classDate: formattedDate,
            classTime: classTime || '19:00',
            momenceEventId: finalEventId,
            bookedAt: new Date().toISOString(),
            category: category || null,
            // Datos de Momence para cancelar/reprogramar
            momenceBookingId: momenceResult.bookingId || null,
            classDateRaw: classDate || null,
          };

          await redis.setex(bookingKey, BOOKING_TTL_SECONDS, JSON.stringify(bookingData));

          // Verify the save worked
          const saved = await redis.get(bookingKey);
          console.warn('[reservar] Booking saved successfully:', {
            key: bookingKey,
            verified: !!saved,
          });

          // Añadir a lista de reservas recientes para Social Proof Ticker
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
          console.error('[reservar] Redis save failed:', e);
        }
      }
    } else {
      console.warn('[reservar] Redis not available for save');
    }

    // 4. Enviar notificaciones (Email + WhatsApp)

    // 4a. Enviar email de confirmación
    let emailResult: { success: boolean; error?: string } = {
      success: false,
      error: 'Not attempted',
    };
    console.warn('[reservar] Email attempt starting...');
    console.warn('[reservar] RESEND_API_KEY configured:', !!process.env['RESEND_API_KEY']);
    try {
      // Generar URL de gestión con magic link (básico por ahora)
      const managementUrl = `${BASE_URL}/es/mi-reserva?email=${encodeURIComponent(normalizedEmail)}&event=${finalEventId}`;
      const mapUrl = 'https://maps.app.goo.gl/YMTQFik7dB1ykdux9';

      emailResult = await sendBookingConfirmationEmail({
        to: normalizedEmail,
        firstName: firstNameOnly,
        className: className || estilo || 'Clase de Prueba',
        classDate: formattedDate,
        classTime: classTime || '19:00',
        managementUrl,
        mapUrl,
        category,
      });
      console.warn('[reservar] Email result:', emailResult);
    } catch (emailError) {
      console.error('[reservar] Email error:', emailError);
      emailResult = { success: false, error: String(emailError) };
    }

    // 4b. Enviar WhatsApp de confirmación
    let whatsappResult: { success: boolean; error?: string } = {
      success: false,
      error: 'Not attempted',
    };
    console.warn('[reservar] WhatsApp config check:', {
      hasToken: !!process.env['WHATSAPP_TOKEN'],
      hasPhoneId: !!process.env['WHATSAPP_PHONE_ID'],
      isConfigured: isWhatsAppConfigured(),
      phoneToSend: phone ? phone.substring(0, 6) + '...' : 'none',
    });
    if (isWhatsAppConfigured()) {
      try {
        whatsappResult = await sendBookingConfirmationWhatsApp({
          to: sanitize(phone),
          firstName: firstNameOnly,
          className: className || estilo || 'Clase de Prueba',
          classDate: formattedDate,
          classTime: classTime || '19:00',
          category,
        });
        console.warn('[reservar] WhatsApp result:', whatsappResult);
      } catch (whatsappError) {
        console.error('[reservar] WhatsApp error:', whatsappError);
        whatsappResult = { success: false, error: String(whatsappError) };
      }
    } else {
      console.warn('[reservar] WhatsApp not configured, skipping');
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
        category,
        momenceSuccess: momenceResult.success,
        trackingSuccess: metaResult.success,
        emailSuccess: emailResult.success,
        whatsappSuccess: whatsappResult.success,
      },
    });
  } catch (error) {
    console.error('Booking API error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
