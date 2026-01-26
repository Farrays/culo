/**
 * Test endpoint para verificar conexión con WhatsApp Cloud API
 *
 * GET /api/test-whatsapp?to=34612345678
 *
 * Query params:
 * - to: Número de teléfono con código de país (requerido)
 *
 * @note Este endpoint es solo para testing. Eliminar o proteger en producción.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const WHATSAPP_API_VERSION = 'v23.0';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to } = req.query;

  if (!to || typeof to !== 'string') {
    return res.status(400).json({
      error: 'Missing "to" query parameter',
      usage: '/api/test-whatsapp?to=34612345678',
      note: 'Phone number must include country code without + (e.g., 34 for Spain)',
    });
  }

  // Validar formato de teléfono básico (solo números, min 10 dígitos)
  const phoneRegex = /^\d{10,15}$/;
  const normalizedPhone = to.replace(/[\s\-+]/g, '');

  if (!phoneRegex.test(normalizedPhone)) {
    return res.status(400).json({
      error: 'Invalid phone format',
      expected: 'Phone number with country code, 10-15 digits',
      example: '34612345678',
      received: normalizedPhone,
    });
  }

  const token = process.env['WHATSAPP_TOKEN'];
  const phoneId = process.env['WHATSAPP_PHONE_ID'];

  // Debug: Verificar variables de entorno
  const envCheck = {
    hasToken: !!token,
    hasPhoneId: !!phoneId,
    phoneId,
  };

  if (!token || !phoneId) {
    return res.status(500).json({
      success: false,
      error: 'Missing WhatsApp environment variables',
      envCheck,
      hint: 'Set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID in Vercel',
    });
  }

  try {
    const apiUrl = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneId}/messages`;

    // Enviar plantilla hello_world (plantilla por defecto de Meta)
    const response = await fetch(apiUrl, {
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
          name: 'hello_world',
          language: {
            code: 'en_US',
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(500).json({
        success: false,
        error: data.error?.message || `HTTP ${response.status}`,
        details: data.error,
        envCheck,
      });
    }

    return res.status(200).json({
      success: true,
      message: `WhatsApp test message sent to ${normalizedPhone}`,
      messageId: data.messages?.[0]?.id,
      envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error sending WhatsApp test:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      envCheck,
    });
  }
}
