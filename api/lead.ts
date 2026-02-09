import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';
import { isRateLimitedRedis } from './lib/rate-limit-helper.js';
import { sendLeadWelcomeEmail } from './lib/email.js';
import { sendLeadWelcomeWhatsApp, isWhatsAppConfigured } from './lib/whatsapp.js';

/** Redact email for GDPR-compliant logging */
function redactEmail(email: string | null | undefined): string {
  if (!email) return 'N/A';
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@invalid';
  return `${local.length > 3 ? local.slice(0, 3) + '***' : '***'}@${domain}`;
}

/**
 * API Route: /api/lead
 *
 * Recibe datos del formulario de captacion y los envia a Momence
 * El token se guarda en variables de entorno de Vercel (nunca expuesto al cliente)
 *
 * Deduplicación con Redis:
 * - TTL de 90 días para evitar leads duplicados
 * - Si el email ya existe en Redis (dentro de TTL), no se envía a Momence
 * - Si el TTL expiró, se re-envía y actualiza el timestamp
 *
 * Variables de entorno requeridas en Vercel:
 * - MOMENCE_API_URL
 * - MOMENCE_TOKEN
 * - MOMENCE_SOURCE_ID (default, puede override con sourceId en body)
 * - STORAGE_REDIS_URL (conexión a Redis)
 */

// Lazy Redis connection (se crea solo cuando se necesita)
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const redisUrl = process.env['STORAGE_REDIS_URL'];
  if (!redisUrl) {
    console.warn('STORAGE_REDIS_URL not configured, deduplication disabled');
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });
  }
  return redisClient;
}

// TTL de 90 días en segundos
const LEAD_TTL_SECONDS = 90 * 24 * 60 * 60; // 7,776,000 segundos

// Prefijo para keys de leads en KV
const LEAD_KEY_PREFIX = 'lead:';

// Tipos de estado de lead
type LeadStatus = 'new' | 'existing';

// Rate limiting now uses Redis (persistent across cold starts)
// See lib/rate-limit-helper.ts for implementation

// Validacion de email
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Sanitizar input
function sanitize(str: string): string {
  return str.trim().slice(0, 500); // Limitar longitud
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting (uses Redis for persistence across cold starts)
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'unknown';

  if (await isRateLimitedRedis('/api/lead', clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  // Validar variables de entorno
  const MOMENCE_API_URL = process.env['MOMENCE_API_URL'];
  const MOMENCE_TOKEN = process.env['MOMENCE_TOKEN'];
  const MOMENCE_SOURCE_ID = process.env['MOMENCE_SOURCE_ID'];

  if (!MOMENCE_API_URL || !MOMENCE_TOKEN || !MOMENCE_SOURCE_ID) {
    console.error('Missing Momence environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      discoveryAnswer,
      estilo, // No se envía a Momence, pero se guarda en KV para analytics
      acceptsMarketing,
      acceptsWhatsApp, // RGPD: consentimiento explícito para WhatsApp
      sourceId: customSourceId, // Permite override del sourceId por landing
    } = req.body;

    // Validaciones
    if (!firstName || !lastName || !email || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // RGPD: El consentimiento es obligatorio (validamos en frontend, pero no enviamos a Momence)
    if (!acceptsMarketing) {
      return res.status(400).json({ error: 'Consent required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const normalizedEmail = sanitize(email).toLowerCase();
    const kvKey = `${LEAD_KEY_PREFIX}${normalizedEmail}`;

    // ===== DEDUPLICACIÓN CON REDIS =====
    let leadStatus: LeadStatus = 'new';
    const redis = getRedisClient();

    if (redis) {
      try {
        // Verificar si el lead ya existe en Redis
        const existingData = await redis.get(kvKey);

        if (existingData) {
          const existingLead = JSON.parse(existingData) as { timestamp: number; sourceId: string };
          // Lead existe en Redis (dentro del TTL de 90 días)
          leadStatus = 'existing';
          console.warn(
            `Lead duplicado detectado: ${normalizedEmail} (registrado: ${new Date(existingLead.timestamp).toISOString()})`
          );

          // Retornar éxito pero indicando que es duplicado (no se envía a Momence)
          return res.status(200).json({
            success: true,
            status: leadStatus,
            message: 'Lead already registered within 90 days',
          });
        }
        // Si no existe o TTL expiró, continuar como nuevo lead
      } catch (redisError) {
        // Si Redis falla, continuar sin deduplicación (graceful degradation)
        console.warn('Redis lookup failed, continuing without deduplication:', redisError);
      }
    }

    // Usar sourceId del body si se proporciona, sino el default de env
    const finalSourceId = customSourceId ? String(customSourceId) : MOMENCE_SOURCE_ID;

    // Preparar payload para Momence (token va en el body, no en header)
    const payload = {
      token: MOMENCE_TOKEN,
      firstName: sanitize(firstName),
      lastName: sanitize(lastName),
      email: normalizedEmail,
      phoneNumber: sanitize(phoneNumber),
      discoveryAnswer: sanitize(discoveryAnswer || 'Not specified'),
      sourceId: finalSourceId,
    };

    // Enviar a Momence
    const response = await fetch(MOMENCE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Momence API error:', response.status, errorText);
      // Intentar parsear el error de Momence para mostrar mensaje más útil
      try {
        const momenceError = JSON.parse(errorText);
        if (momenceError.error?.phoneNumber) {
          return res.status(400).json({
            error: 'Invalid phone number format',
            details: momenceError.error.phoneNumber,
          });
        }
      } catch {
        // Si no se puede parsear, devolver error genérico
      }
      return res.status(502).json({ error: 'Failed to submit lead' });
    }

    // ===== GUARDAR EN REDIS CON TTL =====
    if (redis) {
      try {
        const leadData = JSON.stringify({
          timestamp: Date.now(),
          sourceId: finalSourceId,
          estilo: sanitize(estilo || 'Not specified'),
        });
        await redis.setex(kvKey, LEAD_TTL_SECONDS, leadData); // TTL de 90 días
        console.warn(`Lead guardado en Redis: ${redactEmail(normalizedEmail)} (TTL: 90 días)`);
      } catch (redisError) {
        // Si Redis falla al guardar, solo logear (el lead ya se envió a Momence)
        console.warn('Redis save failed:', redisError);
      }
    }

    // ===== ENVIAR EMAIL DE BIENVENIDA CON RESEND =====
    try {
      const emailResult = await sendLeadWelcomeEmail({
        to: normalizedEmail,
        firstName: sanitize(firstName),
        estilo: sanitize(estilo || ''),
        locale: 'es',
      });

      if (emailResult.success) {
        console.log(`[lead] Welcome email sent to ${redactEmail(normalizedEmail)}`);
      } else {
        console.warn(`[lead] Welcome email failed: ${emailResult.error}`);
      }
    } catch (emailError) {
      console.warn('[lead] Welcome email exception:', emailError);
    }

    // ===== ENVIAR WHATSAPP DE BIENVENIDA (si el usuario dio consentimiento) =====
    if (acceptsWhatsApp && isWhatsAppConfigured()) {
      try {
        const whatsappResult = await sendLeadWelcomeWhatsApp({
          to: sanitize(phoneNumber),
          firstName: sanitize(firstName),
        });

        if (whatsappResult.success) {
          console.log(`[lead] Welcome WhatsApp sent to ${phoneNumber.slice(-4)}`);
        } else {
          console.warn(`[lead] Welcome WhatsApp failed: ${whatsappResult.error}`);
        }
      } catch (whatsappError) {
        console.warn('[lead] Welcome WhatsApp exception:', whatsappError);
      }
    }

    // Éxito - nuevo lead registrado
    return res.status(200).json({
      success: true,
      status: leadStatus,
      message: 'Lead submitted successfully',
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
