import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

/** Redact email for GDPR-compliant logging */
function redactEmail(email: string | null | undefined): string {
  if (!email) return 'N/A';
  const [local, domain] = email.split('@');
  if (!domain) return '***@invalid';
  return `${local.length > 3 ? local.slice(0, 3) + '***' : '***'}@${domain}`;
}

/**
 * API Route: /api/exit-intent
 *
 * Endpoint específico para el Exit Intent Modal.
 * Solo requiere email para maximizar la conversión.
 * Envía a Momence con datos placeholder para activar secuencia de emails.
 *
 * Deduplicación con Vercel KV:
 * - TTL de 90 días para evitar leads duplicados
 * - Prefijo diferente: 'exit:' para separar de leads completos
 *
 * Variables de entorno requeridas en Vercel:
 * - MOMENCE_API_URL
 * - MOMENCE_TOKEN
 * - MOMENCE_EXIT_INTENT_SOURCE_ID (crear en Momence para este flujo)
 * - KV_REST_API_URL (auto-configurado por Vercel KV)
 * - KV_REST_API_TOKEN (auto-configurado por Vercel KV)
 */

// TTL de 90 días en segundos
const EXIT_INTENT_TTL_SECONDS = 90 * 24 * 60 * 60; // 7,776,000 segundos

// Prefijo para keys de exit intent en KV (separado de leads completos)
const EXIT_INTENT_KEY_PREFIX = 'exit:';

// Tipos de estado
type ExitIntentStatus = 'new' | 'existing';

// Rate limiting simple (en memoria - se resetea en cada cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX = 5; // 5 requests por minuto por IP

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

// Validacion de email
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Sanitizar input
function sanitize(str: string): string {
  return str.trim().slice(0, 500);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  // Validar variables de entorno
  const MOMENCE_API_URL = process.env['MOMENCE_API_URL'];
  const MOMENCE_TOKEN = process.env['MOMENCE_TOKEN'];
  const MOMENCE_EXIT_INTENT_SOURCE_ID = process.env['MOMENCE_EXIT_INTENT_SOURCE_ID'];

  if (!MOMENCE_API_URL || !MOMENCE_TOKEN || !MOMENCE_EXIT_INTENT_SOURCE_ID) {
    console.error('Missing Momence environment variables for exit-intent');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { email, page, promo, locale } = req.body;

    // Validación: solo email es requerido
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const normalizedEmail = sanitize(email).toLowerCase();
    const kvKey = `${EXIT_INTENT_KEY_PREFIX}${normalizedEmail}`;

    // ===== DEDUPLICACIÓN CON VERCEL KV =====
    let status: ExitIntentStatus = 'new';

    try {
      const existingEntry = await kv.get<{ timestamp: number; promo: string }>(kvKey);

      if (existingEntry) {
        status = 'existing';
        console.warn(
          `Exit intent duplicado: ${normalizedEmail} (registrado: ${new Date(existingEntry.timestamp).toISOString()})`
        );

        // Retornar éxito sin enviar a Momence (ya tiene el descuento)
        return res.status(200).json({
          success: true,
          status,
          message: 'Discount already reserved',
        });
      }
    } catch (kvError) {
      // Si KV falla, continuar sin deduplicación
      console.warn('KV lookup failed for exit-intent:', kvError);
    }

    // ===== PREPARAR PAYLOAD PARA MOMENCE =====
    // Usar placeholders para campos obligatorios de Momence
    const payload = {
      firstName: 'Visitante',
      lastName: '[Exit Intent]',
      email: normalizedEmail,
      phoneNumber: '000000000',
      discoveryAnswer: 'Exit Intent Modal',
      estilo: promo ? `Promo: ${sanitize(promo)}` : 'Exit Intent',
      acceptsMarketing: true,
      sourceId: MOMENCE_EXIT_INTENT_SOURCE_ID,
      url: sanitize(page || ''),
      // Campos adicionales para Momence (si los soporta)
      notes: `Exit Intent - Locale: ${locale || 'es'} - Page: ${page || 'unknown'}`,
    };

    // Enviar a Momence
    const response = await fetch(MOMENCE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MOMENCE_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Momence API error (exit-intent):', response.status, errorText);
      return res.status(502).json({ error: 'Failed to reserve discount' });
    }

    // ===== GUARDAR EN KV CON TTL =====
    try {
      await kv.set(
        kvKey,
        {
          timestamp: Date.now(),
          promo: sanitize(promo || 'default'),
          page: sanitize(page || ''),
          locale: locale || 'es',
        },
        { ex: EXIT_INTENT_TTL_SECONDS }
      );
      console.warn(`Exit intent guardado en KV: ${redactEmail(normalizedEmail)} (TTL: 90 días)`);
    } catch (kvError) {
      console.warn('KV save failed for exit-intent:', kvError);
    }

    // Éxito
    return res.status(200).json({
      success: true,
      status,
      message: 'Discount reserved successfully',
    });
  } catch (error) {
    console.error('Exit intent submission error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
