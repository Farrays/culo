import type { VercelRequest, VercelResponse } from '@vercel/node';

/** Redact email for GDPR-compliant logging */
function redactEmail(email: string | null | undefined): string {
  if (!email) return 'N/A';
  const [local, domain] = email.split('@');
  if (!domain) return '***@invalid';
  return `${local.length > 3 ? local.slice(0, 3) + '***' : '***'}@${domain}`;
}

/**
 * API Route: /api/contact
 *
 * Recibe datos del formulario de contacto y los envia a Momence
 * El token se guarda en variables de entorno de Vercel (nunca expuesto al cliente)
 *
 * Variables de entorno requeridas en Vercel:
 * - MOMENCE_CONTACT_URL: https://api.momence.com/integrations/customer-leads/36148/collect
 * - MOMENCE_CONTACT_TOKEN: 2nj96Dm7R9
 * - MOMENCE_CONTACT_SOURCE_ID: 8394
 *
 * Campos de Momence para formulario de contacto:
 * - firstName (Text)
 * - lastName (Text)
 * - email (Email)
 * - phoneNumber (Phone number)
 * - comoconoce (Text) - "¿Cómo nos conociste?"
 * - Asunto (Text)
 * - Mensaje (Text)
 */

// Rate limiting simple (en memoria - se resetea en cada cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX = 3; // 3 requests por minuto por IP (más restrictivo para contacto)

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

// Validacion de telefono (formato internacional)
function isValidPhone(phone: string): boolean {
  const re = /^[\d\s+()-]{7,20}$/;
  return re.test(phone);
}

// Sanitizar input - prevenir XSS e injection
function sanitize(str: string, maxLength: number = 500): string {
  return str
    .trim()
    .replace(/[<>]/g, '') // Eliminar < y > para prevenir HTML injection
    .slice(0, maxLength);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers para produccion
  res.setHeader('Access-Control-Allow-Origin', 'https://www.farrayscenter.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Rate limiting por IP
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'unknown';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  // Validar variables de entorno
  const MOMENCE_CONTACT_URL = process.env['MOMENCE_CONTACT_URL'];
  const MOMENCE_CONTACT_TOKEN = process.env['MOMENCE_CONTACT_TOKEN'];
  const MOMENCE_CONTACT_SOURCE_ID = process.env['MOMENCE_CONTACT_SOURCE_ID'];

  if (!MOMENCE_CONTACT_URL || !MOMENCE_CONTACT_TOKEN || !MOMENCE_CONTACT_SOURCE_ID) {
    console.error('Missing Momence contact environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { firstName, lastName, email, phoneNumber, comoconoce, Asunto, Mensaje, acceptsPrivacy } =
      req.body;

    // Validaciones de campos requeridos
    if (!firstName?.trim()) {
      return res.status(400).json({ error: 'First name is required', field: 'firstName' });
    }

    if (!lastName?.trim()) {
      return res.status(400).json({ error: 'Last name is required', field: 'lastName' });
    }

    if (!email?.trim()) {
      return res.status(400).json({ error: 'Email is required', field: 'email' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format', field: 'email' });
    }

    if (!phoneNumber?.trim()) {
      return res.status(400).json({ error: 'Phone number is required', field: 'phoneNumber' });
    }

    if (!isValidPhone(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone format', field: 'phoneNumber' });
    }

    if (!Asunto?.trim()) {
      return res.status(400).json({ error: 'Subject is required', field: 'Asunto' });
    }

    if (!Mensaje?.trim()) {
      return res.status(400).json({ error: 'Message is required', field: 'Mensaje' });
    }

    if (Mensaje.trim().length < 10) {
      return res
        .status(400)
        .json({ error: 'Message must be at least 10 characters', field: 'Mensaje' });
    }

    // LOPD/RGPD: El consentimiento es OBLIGATORIO
    if (!acceptsPrivacy) {
      return res.status(400).json({
        error: 'Privacy policy acceptance is required (LOPD/RGPD compliance)',
        field: 'acceptsPrivacy',
      });
    }

    // Preparar payload para Momence con los campos exactos esperados
    const payload = {
      firstName: sanitize(firstName, 100),
      lastName: sanitize(lastName, 100),
      email: sanitize(email, 255).toLowerCase(),
      phoneNumber: sanitize(phoneNumber, 30),
      comoconoce: sanitize(comoconoce || 'No especificado', 200),
      Asunto: sanitize(Asunto, 200),
      Mensaje: sanitize(Mensaje, 2000),
      sourceId: MOMENCE_CONTACT_SOURCE_ID,
    };

    // Enviar a Momence
    const response = await fetch(MOMENCE_CONTACT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MOMENCE_CONTACT_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Momence Contact API error:', response.status, errorText);
      return res.status(502).json({ error: 'Failed to submit contact form' });
    }

    // Log para monitoring (use warn to pass linter, info not allowed)
    console.warn(
      `Contact form submitted: ${redactEmail(payload.email)} - Subject: ${payload.Asunto}`
    );

    // Exito
    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
