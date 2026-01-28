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

    // Plantilla de confirmación (usa lib/email.ts directamente)
    if (templateName === 'confirmation') {
      const result = await resend.emails.send({
        from: "Farray's Center <onboarding@resend.dev>",
        to,
        replyTo: 'info@farrayscenter.com',
        subject: `Reserva confirmada: ${userClassName}`,
        html: `<!DOCTYPE html><html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="text-align: center; margin-bottom: 30px;"><h1 style="color: #e91e63; margin: 0;">Farray's Center</h1><p style="color: #666; margin: 5px 0;">International Dance Center</p></div><div style="background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;"><h2 style="margin: 0 0 10px 0;">¡Reserva Confirmada!</h2></div><div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;"><p style="margin: 0 0 15px 0;">Hola <strong>${userFirstName}</strong>,</p><p style="margin: 0;">Tu reserva ha sido confirmada:</p></div><div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; margin-bottom: 30px;"><table style="width: 100%; border-collapse: collapse;"><tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Clase</span><br><strong style="font-size: 18px;">${userClassName}</strong></td></tr><tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Fecha</span><br><strong>${userClassDate}</strong></td></tr><tr><td style="padding: 10px 0;"><span style="color: #666;">Hora</span><br><strong>${userClassTime}</strong></td></tr></table></div><div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;"><p>Farray's International Dance Center<br><a href="https://farrayscenter.com" style="color: #e91e63;">farrayscenter.com</a> | <a href="https://www.instagram.com/farrays_centerbcn/" style="color: #e91e63;">Instagram</a></p></div></body></html>`,
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
        message: `Confirmation email sent to ${to}`,
        template: templateName,
        emailId: result.data?.id,
        hasApiKey,
        timestamp: new Date().toISOString(),
      });
    }

    // Plantilla de recordatorio
    if (templateName === 'reminder') {
      const result = await resend.emails.send({
        from: "Farray's Center <onboarding@resend.dev>",
        to,
        replyTo: 'info@farrayscenter.com',
        subject: `Recordatorio: Tu clase de ${userClassName} es pasado mañana`,
        html: `<!DOCTYPE html><html><body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;"><div style="text-align: center; margin-bottom: 30px;"><h1 style="color: #e91e63; margin: 0;">Farray's Center</h1><p style="color: #666; margin: 5px 0;">International Dance Center</p></div><div style="background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;"><h2 style="margin: 0 0 10px 0;">📅 Recordatorio de clase</h2><p style="margin: 0; opacity: 0.9;">Tu clase es en 48 horas</p></div><div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;"><p style="margin: 0 0 15px 0;">Hola <strong>${userFirstName}</strong>,</p><p style="margin: 0;">Te recordamos que pasado mañana tienes tu clase de prueba:</p></div><div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; margin-bottom: 30px;"><table style="width: 100%; border-collapse: collapse;"><tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Clase</span><br><strong style="font-size: 18px;">${userClassName}</strong></td></tr><tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Fecha</span><br><strong>${userClassDate}</strong></td></tr><tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Hora</span><br><strong>${userClassTime}</strong></td></tr><tr><td style="padding: 10px 0;"><span style="color: #666;">Ubicación</span><br><strong>Farray's International Dance Center</strong><br><span style="color: #666;">C/ Entença 100, 08015 Barcelona</span></td></tr></table></div><div style="text-align: center; margin-bottom: 30px;"><a href="https://farrayscenter.com/mis-reservas" style="display: inline-block; background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 5px;">Ver mi reserva</a><a href="https://maps.app.goo.gl/4AtNaEzTAhNUuFfJ6" style="display: inline-block; background: #4285f4; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 5px;">Cómo llegar</a></div><div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px;"><h4 style="margin: 0 0 10px 0; color: #333;">📍 Cómo llegar</h4><p style="margin: 0; color: #666;"><strong>Farray's International Dance Center</strong><br>C/ Entença 100, 08015 Barcelona<br><br>🚇 <strong>Metro:</strong> Rocafort (L1) o Entença (L5)<br>🚌 <strong>Bus:</strong> Líneas 41, 54, H8</p></div><div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;"><p>¿Necesitas cambiar o cancelar tu reserva?<br><a href="https://farrayscenter.com/mis-reservas" style="color: #e91e63;">Gestionar mi reserva</a></p><p style="margin-top: 20px;">Farray's International Dance Center<br>C/ Entença 100, 08015 Barcelona<br><a href="https://farrayscenter.com" style="color: #e91e63;">farrayscenter.com</a> | <a href="https://www.instagram.com/farrays_centerbcn/" style="color: #e91e63;">Instagram</a></p></div></body></html>`,
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
        message: `Reminder email sent to ${to}`,
        template: templateName,
        emailId: result.data?.id,
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
