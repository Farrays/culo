/**
 * Resend Email Helper
 *
 * Helper para envío de emails transaccionales del sistema de reservas.
 * Usa Resend para envío de emails.
 *
 * @see https://resend.com/docs
 *
 * TODO: Verificar dominio farrayscenter.com en Resend para enviar desde @farrayscenter.com
 * Por ahora usa onboarding@resend.dev para testing
 */

import { Resend } from 'resend';

// Singleton
let resendInstance: Resend | null = null;

/**
 * Obtiene la instancia de Resend
 */
function getResend(): Resend {
  if (resendInstance) {
    return resendInstance;
  }

  const apiKey = process.env['RESEND_API_KEY'];

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable');
  }

  resendInstance = new Resend(apiKey);
  return resendInstance;
}

// ============================================================================
// TIPOS
// ============================================================================

export interface BookingEmailData {
  to: string;
  firstName: string;
  className: string;
  classDate: string; // "Lunes 28 de Enero 2026"
  classTime: string; // "19:00"
  instructor?: string;
  managementUrl: string; // URL con magic link
  mapUrl?: string;
}

export interface CancellationEmailData {
  to: string;
  firstName: string;
  className: string;
  bookingUrl: string; // URL para reservar otra clase
}

export interface ReminderEmailData {
  to: string;
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
  managementUrl: string;
  mapUrl?: string;
}

export interface FeedbackEmailData {
  to: string;
  firstName: string;
  className: string;
  reviewUrl: string;
  promoCode?: string;
}

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

// TODO: Cuando se verifique el dominio, cambiar a: reservas@farrayscenter.com
const FROM_EMAIL = "Farray's Center <onboarding@resend.dev>";
const REPLY_TO = 'info@farrayscenter.com';

/**
 * Email de confirmación de reserva
 */
export async function sendBookingConfirmation(
  data: BookingEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResend();

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      replyTo: REPLY_TO,
      subject: `Reserva confirmada: ${data.className}`,
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

  <div style="background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0 0 10px 0;">¡Reserva Confirmada!</h2>
    <p style="margin: 0; opacity: 0.9;">Tu clase de prueba está lista</p>
  </div>

  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${data.firstName}</strong>,</p>
    <p style="margin: 0;">Tu reserva ha sido confirmada. Aquí están los detalles:</p>
  </div>

  <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <span style="color: #666;">Clase</span><br>
          <strong style="font-size: 18px;">${data.className}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <span style="color: #666;">Fecha</span><br>
          <strong>${data.classDate}</strong>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <span style="color: #666;">Hora</span><br>
          <strong>${data.classTime}</strong>
        </td>
      </tr>
      ${
        data.instructor
          ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <span style="color: #666;">Instructor</span><br>
          <strong>${data.instructor}</strong>
        </td>
      </tr>
      `
          : ''
      }
      <tr>
        <td style="padding: 10px 0;">
          <span style="color: #666;">Ubicación</span><br>
          <strong>Farray's International Dance Center</strong><br>
          <span style="color: #666;">C/ Entença 100, 08015 Barcelona</span>
        </td>
      </tr>
    </table>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${data.managementUrl}" style="display: inline-block; background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 5px;">
      Ver mi reserva
    </a>
    ${
      data.mapUrl
        ? `
    <a href="${data.mapUrl}" style="display: inline-block; background: #4285f4; color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 5px;">
      Cómo llegar
    </a>
    `
        : ''
    }
  </div>

  <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h3 style="margin: 0 0 10px 0; color: #e65100;">¿Qué traer?</h3>
    <ul style="margin: 0; padding-left: 20px; color: #666;">
      <li>Ropa cómoda para bailar</li>
      <li>Agua</li>
      <li>¡Muchas ganas de pasarlo bien!</li>
    </ul>
  </div>

  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
    <p>¿Necesitas cambiar o cancelar tu reserva?<br>
    <a href="${data.managementUrl}" style="color: #e91e63;">Gestionar mi reserva</a></p>
    <p style="margin-top: 20px;">
      Farray's International Dance Center<br>
      C/ Entença 100, 08015 Barcelona<br>
      <a href="https://farrayscenter.com" style="color: #e91e63;">farrayscenter.com</a>
    </p>
  </div>
</body>
</html>
      `,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Email de cancelación de reserva
 */
export async function sendCancellationEmail(
  data: CancellationEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResend();

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      replyTo: REPLY_TO,
      subject: `Reserva cancelada: ${data.className}`,
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
  </div>

  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${data.firstName}</strong>,</p>
    <p style="margin: 0;">Tu reserva para <strong>${data.className}</strong> ha sido cancelada correctamente.</p>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <p style="color: #666;">¿Quieres reservar otra clase?</p>
    <a href="${data.bookingUrl}" style="display: inline-block; background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold;">
      Ver clases disponibles
    </a>
  </div>

  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
    <p>¡Esperamos verte pronto!</p>
    <p>Farray's International Dance Center</p>
  </div>
</body>
</html>
      `,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Email de recordatorio (24h antes)
 */
export async function sendReminderEmail(
  data: ReminderEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResend();

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      replyTo: REPLY_TO,
      subject: `Recordatorio: Mañana tienes clase de ${data.className}`,
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
  </div>

  <div style="background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0 0 10px 0;">¡Mañana es el día!</h2>
  </div>

  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${data.firstName}</strong>,</p>
    <p style="margin: 0;">Te recordamos que mañana tienes tu clase de prueba:</p>
  </div>

  <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; margin-bottom: 30px; text-align: center;">
    <h3 style="margin: 0 0 15px 0; color: #e91e63;">${data.className}</h3>
    <p style="margin: 5px 0;"><strong>${data.classDate}</strong></p>
    <p style="margin: 5px 0;"><strong>${data.classTime}</strong></p>
    <p style="margin: 15px 0 0 0; color: #666;">C/ Entença 100, Barcelona</p>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${data.managementUrl}" style="display: inline-block; background: #666; color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; margin: 5px;">
      Ver/Cancelar reserva
    </a>
    ${
      data.mapUrl
        ? `
    <a href="${data.mapUrl}" style="display: inline-block; background: #4285f4; color: white; text-decoration: none; padding: 12px 25px; border-radius: 8px; margin: 5px;">
      Cómo llegar
    </a>
    `
        : ''
    }
  </div>

  <div style="text-align: center; color: #666; font-size: 14px;">
    <p>¡Te esperamos!</p>
  </div>
</body>
</html>
      `,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Email de feedback post-clase
 */
export async function sendFeedbackEmail(
  data: FeedbackEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResend();

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      replyTo: REPLY_TO,
      subject: `¿Qué tal tu clase de ${data.className}?`,
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
  </div>

  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${data.firstName}</strong>,</p>
    <p style="margin: 0;">¿Qué tal tu clase de <strong>${data.className}</strong>?</p>
    <p style="margin: 15px 0 0 0;">Nos encantaría conocer tu opinión.</p>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${data.reviewUrl}" style="display: inline-block; background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold;">
      Dejar mi opinión
    </a>
  </div>

  ${
    data.promoCode
      ? `
  <div style="background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h3 style="margin: 0 0 10px 0;">¡Oferta especial para ti!</h3>
    <p style="margin: 0 0 15px 0;">20% de descuento en tu primera mensualidad</p>
    <div style="background: white; color: #ff5722; padding: 10px 20px; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 20px;">
      ${data.promoCode}
    </div>
  </div>
  `
      : ''
  }

  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
    <p>¡Gracias por elegirnos!</p>
    <p>Farray's International Dance Center</p>
  </div>
</body>
</html>
      `,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error sending feedback email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Enviar email genérico (para testing)
 */
export async function sendTestEmail(
  to: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResend();

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      subject: "Test de conexión - Farray's Center",
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; padding: 20px;">
  <h1 style="color: #e91e63;">Test de Email</h1>
  <p>Si recibes este email, la conexión con Resend funciona correctamente.</p>
  <p>Timestamp: ${new Date().toISOString()}</p>
</body>
</html>
      `,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Error sending test email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
