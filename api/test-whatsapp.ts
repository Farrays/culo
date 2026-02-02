/**
 * Test endpoint para verificar conexión con WhatsApp Cloud API
 *
 * GET /api/test-whatsapp?to=34612345678
 * GET /api/test-whatsapp?to=34612345678&template=cancelar&firstName=Juan
 * GET /api/test-whatsapp?to=34612345678&template=recordatorio_prueba_0&firstName=Juan&className=Salsa&dateTime=30/01/2026,%2019:00
 *
 * Query params:
 * - to: Número de teléfono con código de país (requerido)
 * - template: Plantilla a usar (opcional, default: hello_world)
 *   - hello_world: Plantilla de prueba por defecto
 *   - cancelar: Plantilla de cancelación (requiere firstName)
 *   - recordatorio_prueba_0: Plantilla de recordatorio 48h (requiere firstName, className, dateTime)
 * - firstName: Nombre para plantillas (default: Usuario)
 * - className: Nombre de la clase para recordatorio (default: Clase)
 * - dateTime: Fecha y hora para recordatorio (default: fecha actual + 48h)
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

  const { to, template, firstName, className, dateTime } = req.query;

  if (!to || typeof to !== 'string') {
    return res.status(400).json({
      error: 'Missing "to" query parameter',
      usage: '/api/test-whatsapp?to=34612345678',
      templates: {
        hello_world: '/api/test-whatsapp?to=34612345678',
        cancelar: '/api/test-whatsapp?to=34612345678&template=cancelar&firstName=Juan',
        recordatorio_prueba_0:
          '/api/test-whatsapp?to=34612345678&template=recordatorio_prueba_0&firstName=Juan&className=Salsa&dateTime=30/01/2026,%2019:00',
      },
      note: 'Phone number must include country code without + (e.g., 34 for Spain)',
    });
  }

  const templateName = (template as string) || 'hello_world';
  const userFirstName = (firstName as string) || 'Usuario';
  const userClassName = (className as string) || 'Clase';

  // Generar fecha/hora por defecto (48h desde ahora)
  const defaultDateTime = (() => {
    const date = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  })();
  const userDateTime = (dateTime as string) || defaultDateTime;

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

    // Construir mensaje según plantilla
    interface TemplateMessage {
      messaging_product: 'whatsapp';
      to: string;
      type: 'template';
      template: {
        name: string;
        language: { code: string };
        components?: Array<{
          type: 'body';
          parameters: Array<{ type: 'text'; text: string }>;
        }>;
      };
    }

    let message: TemplateMessage;

    if (templateName === 'cancelar') {
      // Plantilla de cancelación con parámetro firstName
      message = {
        messaging_product: 'whatsapp',
        to: normalizedPhone,
        type: 'template',
        template: {
          name: 'cancelar',
          language: { code: 'es_ES' },
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: userFirstName }],
            },
          ],
        },
      };
    } else if (templateName === 'recordatorio_prueba_0') {
      // Plantilla de recordatorio 48h con firstName, className, dateTime
      message = {
        messaging_product: 'whatsapp',
        to: normalizedPhone,
        type: 'template',
        template: {
          name: 'recordatorio_prueba_0',
          language: { code: 'es_ES' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: userFirstName },
                { type: 'text', text: userClassName },
                { type: 'text', text: userDateTime },
              ],
            },
          ],
        },
      };
    } else if (templateName === 'recordatorio_prueba_2') {
      // Plantilla de recordatorio 24h con botones (firstName, className, classDate, classTime)
      // dateTime format: "04/02/2026, 18:00" -> split into date and time
      const [dateStr, timeStr] = userDateTime.split(',').map(s => s.trim());
      message = {
        messaging_product: 'whatsapp',
        to: normalizedPhone,
        type: 'template',
        template: {
          name: 'recordatorio_prueba_2',
          language: { code: 'es' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: userFirstName },
                { type: 'text', text: userClassName },
                { type: 'text', text: dateStr || userDateTime },
                { type: 'text', text: timeStr || '19:00' },
              ],
            },
          ],
        },
      };
    } else {
      // Plantilla hello_world por defecto
      message = {
        messaging_product: 'whatsapp',
        to: normalizedPhone,
        type: 'template',
        template: {
          name: 'hello_world',
          language: { code: 'en_US' },
        },
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(message),
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
      template: templateName,
      firstName: templateName === 'cancelar' ? userFirstName : undefined,
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
