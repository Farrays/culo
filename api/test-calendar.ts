import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  isGoogleCalendarConfigured,
  getGoogleCalendarConfigInfo,
  createBookingEvent,
} from './lib/google-calendar';

/**
 * Test endpoint para verificar Google Calendar
 *
 * GET /api/test-calendar?action=check  → Verifica configuración
 * GET /api/test-calendar?action=test   → Crea evento de prueba
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const configInfo = getGoogleCalendarConfigInfo();

  // Solo verificar config
  if (req.query['action'] === 'check') {
    return res.status(200).json({
      configured: isGoogleCalendarConfigured(),
      config: configInfo,
    });
  }

  // Test crear evento (requiere ?action=test)
  if (req.query['action'] === 'test') {
    if (!isGoogleCalendarConfigured()) {
      return res.status(400).json({
        error: 'Google Calendar not configured',
        config: configInfo,
      });
    }

    const result = await createBookingEvent({
      firstName: 'Test',
      lastName: 'Vercel',
      email: 'test@example.com',
      phone: '+34600000000',
      className: 'TEST - Bachata Sensual',
      classDate: new Date().toISOString().split('T')[0],
      classTime: '19:00',
      category: 'bailes_sociales',
      eventId: `test-${Date.now()}`,
    });

    return res.status(200).json({
      testResult: result,
      message: result.success
        ? '✅ Google Calendar funciona! Revisa tu calendario.'
        : '❌ Error al crear evento',
    });
  }

  return res.status(400).json({
    error: 'Use ?action=check or ?action=test',
    configured: isGoogleCalendarConfigured(),
  });
}
