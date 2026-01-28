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

/**
 * Categorías de clases - cada una tiene instrucciones específicas
 */
export type ClassCategory =
  | 'bailes_sociales' // Salsa, Bachata, Kizomba, etc.
  | 'danzas_urbanas' // Hip Hop, House, Breaking, etc.
  | 'danza' // Ballet, Contemporáneo, Jazz, etc.
  | 'entrenamiento' // Entrenamiento para bailarines (usa mismas instrucciones que danza)
  | 'heels'; // Heels Dance

export interface BookingEmailData {
  to: string;
  firstName: string;
  className: string;
  classDate: string; // "Lunes 28 de Enero 2026"
  classTime: string; // "19:00"
  instructor?: string;
  managementUrl: string; // URL con magic link
  mapUrl?: string;
  category?: ClassCategory; // Categoría para instrucciones específicas
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

// ============================================================================
// INSTRUCCIONES POR CATEGORÍA
// ============================================================================

interface CategoryInstructions {
  title: string;
  items: string[];
  color: string; // Color del header de la sección
}

/**
 * Obtiene las instrucciones específicas de "¿Qué traer?" según la categoría
 */
function getCategoryInstructions(category?: ClassCategory): CategoryInstructions {
  const commonItems = [
    '💧 Botella de agua',
    '🧴 Toalla pequeña',
    '🔐 Candado para taquilla (opcional)',
  ];

  switch (category) {
    case 'bailes_sociales':
      return {
        title: '¿Qué traer a tu clase de Bailes Sociales?',
        color: '#e91e63',
        items: [
          '👠 <strong>Chicas:</strong> Bambas o zapatos de tacón cómodos',
          '👞 <strong>Chicos:</strong> Bambas o zapatos de baile',
          '📝 <strong>Folklore:</strong> Sin calzado (se baila descalzo)',
          ...commonItems,
        ],
      };

    case 'danzas_urbanas':
      return {
        title: '¿Qué traer a tu clase de Danzas Urbanas?',
        color: '#673ab7',
        items: [
          '👟 Bambas cómodas (suela limpia)',
          '👖 Leggings, pantalones cortos o chándal',
          '👕 Ropa cómoda y ligera (tipo fitness)',
          '💃 <strong>Sexy Style:</strong> Bambas o tacones Stiletto con suela antideslizante. Rodilleras recomendadas',
          '🍑 <strong>Twerk:</strong> Rodilleras recomendadas',
          ...commonItems,
        ],
      };

    case 'danza':
    case 'entrenamiento':
      return {
        title:
          category === 'entrenamiento'
            ? '¿Qué traer a tu Entrenamiento?'
            : '¿Qué traer a tu clase de Danza?',
        color: '#9c27b0',
        items: [
          '🦶 <strong>Sin calzado</strong> o calcetines antideslizantes',
          '🦵 Rodilleras recomendadas (especialmente para floorwork)',
          '👖 Ropa ajustada que permita ver la línea del cuerpo',
          ...commonItems,
        ],
      };

    case 'heels':
      return {
        title: '¿Qué traer a tu clase de Heels?',
        color: '#e91e63',
        items: [
          '👠 <strong>Tacones Stiletto</strong> (obligatorios)',
          '💃 Ropa femenina y atrevida que te haga sentir poderosa',
          '🎽 Top o body que permita libertad de movimiento',
          ...commonItems,
        ],
      };

    default:
      return {
        title: '¿Qué traer?',
        color: '#e91e63',
        items: [
          '👟 Ropa cómoda para bailar',
          '👠 Calzado según el estilo de baile',
          ...commonItems,
        ],
      };
  }
}

/**
 * Genera el HTML de la sección "¿Qué traer?" personalizada por categoría
 */
function generateWhatToBringSection(category?: ClassCategory): string {
  const instructions = getCategoryInstructions(category);

  return `
  <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h3 style="margin: 0 0 15px 0; color: ${instructions.color};">${instructions.title}</h3>
    <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
      ${instructions.items.map(item => `<li>${item}</li>`).join('\n      ')}
    </ul>
    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-top: 15px;">
      <strong style="color: #1976d2;">⏰ Importante:</strong>
      <p style="margin: 5px 0 0 0; color: #666;">Llega <strong>10 minutos antes</strong> para cambiarte y prepararte.</p>
    </div>
  </div>

  <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h4 style="margin: 0 0 10px 0; color: #333;">📍 Cómo llegar</h4>
    <p style="margin: 0; color: #666;">
      <strong>Farray's International Dance Center</strong><br>
      C/ Entença 100, 08015 Barcelona<br><br>
      🚇 <strong>Metro:</strong> Rocafort (L1) o Entença (L5)<br>
      🚌 <strong>Bus:</strong> Líneas 41, 54, H8
    </p>
  </div>
  `;
}

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

  ${generateWhatToBringSection(data.category)}

  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
    <p>¿Necesitas cambiar o cancelar tu reserva?<br>
    <a href="${data.managementUrl}" style="color: #e91e63;">Gestionar mi reserva</a></p>
    <p style="margin-top: 20px;">
      Farray's International Dance Center<br>
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
    <p style="color: #666; margin: 5px 0;">International Dance Center</p>
  </div>

  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0; font-size: 18px;">¡Hola <strong>${data.firstName}</strong>!</p>
    <p style="margin: 0 0 15px 0;">¡Vaya! Sentimos que no puedas venir a la clase. 😔</p>
    <p style="margin: 0;">Tu clase de <strong>${data.className}</strong> ha sido cancelada ✅ y la plaza liberada para que otra persona pueda aprovecharla.</p>
  </div>

  <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 10px 0;"><strong>¿Te arrepientes?</strong> 😉</p>
    <p style="margin: 0;">Puedes reservar tu clase gratis cuando quieras, siempre que la promo siga activa y queden plazas.</p>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${data.bookingUrl}" style="display: inline-block; background: linear-gradient(135deg, #e91e63 0%, #9c27b0 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
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
      subject: `Recordatorio: Tu clase de ${data.className} es pasado mañana`,
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

  <div style="background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0 0 10px 0;">📅 Recordatorio de clase</h2>
    <p style="margin: 0; opacity: 0.9;">Tu clase es en 48 horas</p>
  </div>

  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${data.firstName}</strong>,</p>
    <p style="margin: 0;">Te recordamos que pasado mañana tienes tu clase de prueba:</p>
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
    <a href="${data.managementUrl}" style="display: inline-block; background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 5px;">
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

  <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h4 style="margin: 0 0 10px 0; color: #333;">📍 Cómo llegar</h4>
    <p style="margin: 0; color: #666;">
      <strong>Farray's International Dance Center</strong><br>
      C/ Entença 100, 08015 Barcelona<br><br>
      🚇 <strong>Metro:</strong> Rocafort (L1) o Entença (L5)<br>
      🚌 <strong>Bus:</strong> Líneas 41, 54, H8
    </p>
  </div>

  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
    <p>¿Necesitas cambiar o cancelar tu reserva?<br>
    <a href="${data.managementUrl}" style="color: #4caf50;">Gestionar mi reserva</a></p>
    <p style="margin-top: 20px;">
      Farray's International Dance Center<br>
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
