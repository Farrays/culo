/**
 * Test endpoint para verificar conexión con WhatsApp Cloud API
 *
 * GET /api/test-whatsapp?to=34612345678
 * GET /api/test-whatsapp?to=34612345678&category=bailes_sociales&name=Juan
 *
 * Query params:
 * - to: Número de teléfono con código de país (requerido)
 * - template: Nombre de la plantilla (opcional, default: hello_world)
 * - category: Categoría de clase para probar plantilla específica
 *   (bailes_sociales, danzas_urbanas, danza, entrenamiento, heels)
 * - name: Nombre para el mensaje de prueba (default: Test)
 *
 * @note Este endpoint es solo para testing. Eliminar o proteger en producción.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { ClassCategory } from './lib/whatsapp';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, template, category, name } = req.query;

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

  // Debug: Verificar variables de entorno
  const envCheck = {
    hasToken: !!process.env['WHATSAPP_TOKEN'],
    hasPhoneId: !!process.env['WHATSAPP_PHONE_ID'],
    phoneId: process.env['WHATSAPP_PHONE_ID'],
  };

  try {
    // Importar dinámicamente para capturar errores
    const {
      sendTestWhatsApp,
      sendCustomTemplate,
      sendBookingConfirmationWhatsApp,
      getWhatsAppConfigInfo,
      CLASS_CATEGORIES,
      CATEGORY_LABELS,
    } = await import('./lib/whatsapp');

    const configInfo = getWhatsAppConfigInfo();

    if (!configInfo.hasToken || !configInfo.hasPhoneId) {
      return res.status(500).json({
        success: false,
        error: 'Missing WhatsApp environment variables',
        envCheck,
        hint: 'Set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID in Vercel',
      });
    }

    let result;
    const templateName = typeof template === 'string' ? template : 'hello_world';
    const testName = typeof name === 'string' ? name : 'Test';

    // Si se especifica una categoría, probar la plantilla de confirmación
    if (category && typeof category === 'string') {
      const validCategories = CLASS_CATEGORIES as readonly string[];

      if (!validCategories.includes(category)) {
        return res.status(400).json({
          error: 'Invalid category',
          validCategories: CLASS_CATEGORIES,
          categoryLabels: CATEGORY_LABELS,
        });
      }

      // Probar plantilla de confirmación con datos de ejemplo
      result = await sendBookingConfirmationWhatsApp({
        to: normalizedPhone,
        firstName: testName,
        className: `Clase de prueba (${CATEGORY_LABELS[category as ClassCategory]})`,
        classDate: 'Lunes 28 de Enero',
        classTime: '19:00',
        category: category as ClassCategory,
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error,
          category,
          to: normalizedPhone,
          envCheck,
        });
      }

      return res.status(200).json({
        success: true,
        message: `WhatsApp confirmation sent to ${normalizedPhone}`,
        messageId: result.messageId,
        category,
        categoryLabel: CATEGORY_LABELS[category as ClassCategory],
        testData: {
          firstName: testName,
          className: `Clase de prueba (${CATEGORY_LABELS[category as ClassCategory]})`,
          classDate: 'Lunes 28 de Enero',
          classTime: '19:00',
        },
        envCheck,
        timestamp: new Date().toISOString(),
      });
    }

    // Si no hay categoría, usar hello_world o plantilla personalizada
    if (templateName === 'hello_world') {
      result = await sendTestWhatsApp(normalizedPhone);
    } else {
      result = await sendCustomTemplate(templateName, normalizedPhone, 'es_ES');
    }

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
        template: templateName,
        to: normalizedPhone,
        envCheck,
      });
    }

    return res.status(200).json({
      success: true,
      message: `WhatsApp message sent to ${normalizedPhone}`,
      messageId: result.messageId,
      template: templateName,
      envCheck,
      timestamp: new Date().toISOString(),
      hint: 'Use ?category=bailes_sociales to test booking confirmation templates',
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
