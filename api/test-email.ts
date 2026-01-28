/**
 * Test endpoint para verificar conexión con Resend
 *
 * GET /api/test-email?to=tu@email.com
 * GET /api/test-email?to=tu@email.com&template=confirmation&firstName=Juan&className=Salsa&classDate=Viernes 31 de Enero&classTime=19:00
 * GET /api/test-email?to=tu@email.com&template=cancellation&firstName=Juan
 * GET /api/test-email?to=tu@email.com&template=reminder&firstName=Juan&className=Salsa&classDate=Viernes 31 de Enero&classTime=19:00
 *
 * Query params:
 * - to: Email de destino (requerido)
 * - template: Plantilla a usar (opcional, default: test)
 *   - test: Email de prueba básico
 *   - confirmation: Email de confirmación de reserva
 *   - cancellation: Email de cancelación de reserva
 *   - reminder: Email de recordatorio 48h
 * - firstName: Nombre (opcional, default: Usuario)
 * - className: Nombre de la clase (opcional, default: Clase)
 * - classDate: Fecha de la clase (opcional, default: Viernes 31 de Enero)
 * - classTime: Hora de la clase (opcional, default: 19:00)
 *
 * @note Este endpoint es solo para testing. Eliminar o proteger en producción.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, template, firstName, className, classDate, classTime } = req.query;

  if (!to || typeof to !== 'string') {
    return res.status(400).json({
      error: 'Missing "to" query parameter',
      usage: '/api/test-email?to=tu@email.com',
      templates: {
        test: '/api/test-email?to=tu@email.com',
        confirmation:
          '/api/test-email?to=tu@email.com&template=confirmation&firstName=Juan&className=Salsa&classDate=Viernes 31 de Enero&classTime=19:00',
        cancellation: '/api/test-email?to=tu@email.com&template=cancellation&firstName=Juan',
        reminder:
          '/api/test-email?to=tu@email.com&template=reminder&firstName=Juan&className=Salsa&classDate=Viernes 31 de Enero&classTime=19:00',
      },
    });
  }

  const templateName = (template as string) || 'test';
  const userFirstName = (firstName as string) || 'Usuario';
  const userClassName = (className as string) || 'Clase';
  const userClassDate = (classDate as string) || 'Viernes 31 de Enero';
  const userClassTime = (classTime as string) || '19:00';

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
    const apiKey = process.env['RESEND_API_KEY'];

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing RESEND_API_KEY environment variable',
        hasApiKey,
      });
    }

    const resend = new Resend(apiKey);

    // Plantilla de confirmación
    if (templateName === 'confirmation') {
      const { sendBookingConfirmation } = await import('./lib/email');
      const result = await sendBookingConfirmation({
        to,
        firstName: userFirstName,
        className: userClassName,
        classDate: userClassDate,
        classTime: userClassTime,
        managementUrl: 'https://farrayscenter.com/mis-reservas',
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error,
          template: templateName,
          hasApiKey,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Confirmation email sent to ${to}`,
        template: templateName,
        emailId: result.id,
        hasApiKey,
        timestamp: new Date().toISOString(),
      });
    }

    // Plantilla de recordatorio
    if (templateName === 'reminder') {
      const { sendReminderEmail } = await import('./lib/email');
      const result = await sendReminderEmail({
        to,
        firstName: userFirstName,
        className: userClassName,
        classDate: userClassDate,
        classTime: userClassTime,
        managementUrl: 'https://farrayscenter.com/mis-reservas',
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error,
          template: templateName,
          hasApiKey,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Reminder email sent to ${to}`,
        template: templateName,
        emailId: result.id,
        hasApiKey,
        timestamp: new Date().toISOString(),
      });
    }

    // Plantilla de cancelación
    if (templateName === 'cancellation' || templateName === 'cancelar') {
      const bookingUrl = 'https://farrayscenter.com/reservas';

      const result = await resend.emails.send({
        from: "Farray's Center <onboarding@resend.dev>",
        replyTo: 'info@farrayscenter.com',
        to,
        subject: `Reserva cancelada - ${userClassName}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #e91e63; margin: 0;">Farray's Center</h1>
    <p style="color: #666; margin: 5px 0;">International Dance Center</p>
  </div>

  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0; font-size: 18px;">¡Hola <strong>${userFirstName}</strong>!</p>
    <p style="margin: 0 0 15px 0;">¡Vaya! Sentimos que no puedas venir a la clase. 😔</p>
    <p style="margin: 0;">Tu clase de <strong>${userClassName}</strong> ha sido cancelada ✅ y la plaza liberada para que otra persona pueda aprovecharla.</p>
  </div>

  <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 10px 0;"><strong>¿Te arrepientes?</strong> 😉</p>
    <p style="margin: 0;">Puedes reservar tu clase gratis cuando quieras, siempre que la promo siga activa y queden plazas.</p>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${bookingUrl}" style="display: inline-block; background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
      Reservar otra clase gratis
    </a>
  </div>

  <div style="background: #e8f5e9; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 10px 0;"><strong>💡 ¿Sabías que...?</strong></p>
    <p style="margin: 0;">Las clases sueltas están desde <strong>20€</strong>. Y la clase gratis... ¡es una oferta top por tiempo limitado y las plazas vuelan!</p>
  </div>

  <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
    <p style="margin: 0 0 10px 0;"><strong>¿Tienes dudas? 💬</strong></p>
    <p style="margin: 0;">Escríbenos por WhatsApp al <strong>+34 622 247 085</strong><br>y te responderemos lo antes posible.</p>
  </div>

  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
    <p style="margin: 0 0 10px 0;">¡Mil gracias por pensar en nosotros!</p>
    <p style="margin: 0 0 20px 0;">Esperamos verte muy pronto para que vengas a vivir<br>la experiencia Farray's a tope. 💃🕺</p>
    <p style="margin: 0;">
      <strong>Farray's International Dance Center</strong><br>
      C/ Entença 100, 08015 Barcelona<br>
      <a href="https://farrayscenter.com" style="color: #e91e63;">farrayscenter.com</a> |
      <a href="https://www.instagram.com/farrays_centerbcn/" style="color: #e91e63;">Instagram</a>
    </p>
  </div>
</body>
</html>
        `,
      });

      if (result.error) {
        return res.status(500).json({
          success: false,
          error: result.error.message,
          template: templateName,
          hasApiKey,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Cancellation email sent to ${to}`,
        template: templateName,
        firstName: userFirstName,
        className: userClassName,
        emailId: result.data?.id,
        hasApiKey,
        timestamp: new Date().toISOString(),
      });
    }

    // Plantilla de test por defecto
    const result = await resend.emails.send({
      from: "Farray's Center <onboarding@resend.dev>",
      to,
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
        template: templateName,
        hasApiKey,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Test email sent to ${to}`,
      template: templateName,
      emailId: result.data?.id,
      hasApiKey,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error sending test email:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      template: templateName,
      hasApiKey,
    });
  }
}
