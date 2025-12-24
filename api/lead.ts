import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

/**
 * API Route: /api/lead
 *
 * Recibe datos del formulario de captacion y los envia a Momence
 * El token se guarda en variables de entorno de Vercel (nunca expuesto al cliente)
 *
 * Deduplicación con Vercel KV:
 * - TTL de 90 días para evitar leads duplicados
 * - Si el email ya existe en KV (dentro de TTL), no se envía a Momence
 * - Si el TTL expiró, se re-envía y actualiza el timestamp
 *
 * Variables de entorno requeridas en Vercel:
 * - MOMENCE_API_URL
 * - MOMENCE_TOKEN
 * - MOMENCE_SOURCE_ID (default, puede override con sourceId en body)
 * - KV_REST_API_URL (auto-configurado por Vercel KV)
 * - KV_REST_API_TOKEN (auto-configurado por Vercel KV)
 */

// TTL de 90 días en segundos
const LEAD_TTL_SECONDS = 90 * 24 * 60 * 60; // 7,776,000 segundos

// Prefijo para keys de leads en KV
const LEAD_KEY_PREFIX = 'lead:';

// Tipos de estado de lead
type LeadStatus = 'new' | 'existing' | 'refresh';

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
      estilo,
      acceptsMarketing,
      url,
      sourceId: customSourceId, // Permite override del sourceId por landing
    } = req.body;

    // Validaciones
    if (!firstName || !lastName || !email || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // RGPD: El consentimiento es obligatorio
    if (!acceptsMarketing) {
      return res.status(400).json({ error: 'Consent required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const normalizedEmail = sanitize(email).toLowerCase();
    const kvKey = `${LEAD_KEY_PREFIX}${normalizedEmail}`;

    // ===== DEDUPLICACIÓN CON VERCEL KV =====
    let leadStatus: LeadStatus = 'new';

    try {
      // Verificar si el lead ya existe en KV
      const existingLead = await kv.get<{ timestamp: number; sourceId: string }>(kvKey);

      if (existingLead) {
        // Lead existe en KV (dentro del TTL de 90 días)
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
    } catch (kvError) {
      // Si KV falla, continuar sin deduplicación (graceful degradation)
      console.warn('KV lookup failed, continuing without deduplication:', kvError);
    }

    // Usar sourceId del body si se proporciona, sino el default de env
    const finalSourceId = customSourceId ? String(customSourceId) : MOMENCE_SOURCE_ID;

    // Preparar payload para Momence
    const payload = {
      firstName: sanitize(firstName),
      lastName: sanitize(lastName),
      email: normalizedEmail,
      phoneNumber: sanitize(phoneNumber),
      discoveryAnswer: sanitize(discoveryAnswer || 'Not specified'),
      estilo: sanitize(estilo || 'Not specified'),
      acceptsMarketing: Boolean(acceptsMarketing),
      sourceId: finalSourceId,
      url: sanitize(url || ''),
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
      console.error('Momence API error:', response.status, errorText);
      return res.status(502).json({ error: 'Failed to submit lead' });
    }

    // ===== GUARDAR EN KV CON TTL =====
    try {
      await kv.set(
        kvKey,
        {
          timestamp: Date.now(),
          sourceId: finalSourceId,
          estilo: sanitize(estilo || 'Not specified'),
        },
        { ex: LEAD_TTL_SECONDS } // TTL de 90 días
      );
      console.warn(`Lead guardado en KV: ${normalizedEmail} (TTL: 90 días)`);
    } catch (kvError) {
      // Si KV falla al guardar, solo logear (el lead ya se envió a Momence)
      console.warn('KV save failed:', kvError);
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
