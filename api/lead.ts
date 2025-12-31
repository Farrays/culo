import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route: /api/lead
 *
 * Recibe datos del formulario de captacion y los envia a Momence
 * El token se guarda en variables de entorno de Vercel (nunca expuesto al cliente)
 *
 * Variables de entorno requeridas en Vercel:
 * - MOMENCE_API_URL
 * - MOMENCE_TOKEN
 * - MOMENCE_SOURCE_ID (default, puede override con sourceId en body)
 */

// Tipos de estado de lead
type LeadStatus = 'new';

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
    const leadStatus: LeadStatus = 'new';

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
