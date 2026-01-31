/**
 * Test endpoint para verificar conexión con Resend
 *
 * GET /api/test-email?to=tu@email.com
 *
 * Query params:
 * - to: Email de destino (requerido)
 *
 * @note Este endpoint es solo para testing. Eliminar o proteger en producción.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

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
      usage: '/api/test-email?to=tu@email.com',
    });
  }

  // Validar formato de email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return res.status(400).json({
      error: 'Invalid email format',
    });
  }

  // Debug: Verificar variable de entorno
  const hasApiKey = !!process.env['RESEND_API_KEY'];

  try {
    // Importar dinámicamente para evitar errores de módulo
    const { Resend } = await import('resend');

    const apiKey = process.env['RESEND_API_KEY'];

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing RESEND_API_KEY environment variable',
        hasApiKey,
      });
    }

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: "Farray's Center <reservas@farrayscenter.com>",
      to,
      replyTo: 'info@farrayscenter.com',
      subject: "Test de conexión - Farray's Center",
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; padding: 20px;">
  <h1 style="color: #e91e63;">Test de Email</h1>
  <p>Si recibes este email, la conexión con Resend funciona correctamente.</p>
  <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
  <hr>
  <p style="color: #666; font-size: 12px;">Este es un email de prueba del sistema de reservas de Farray's Center.</p>
</body>
</html>
      `,
    });

    if (result.error) {
      return res.status(500).json({
        success: false,
        error: result.error.message,
        hasApiKey,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Test email sent to ${to}`,
      emailId: result.data?.id,
      hasApiKey,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error sending test email:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hasApiKey,
    });
  }
}
