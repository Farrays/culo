import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route: GET /api/preview-email
 *
 * Preview email templates without sending them.
 *
 * Query params:
 * - type: 'confirmation' | 'reminder' | 'cancellation' | 'feedback'
 *
 * Example: /api/preview-email?type=confirmation
 *
 * NOTE: Functions are inlined to avoid Vercel module resolution issues.
 * See commit 3422202 for reference.
 */

// ============================================================================
// CONFIGURACIÓN ENTERPRISE (copied from lib/email.ts)
// ============================================================================

const BRAND_PRIMARY = '#B01E3C';
const BRAND_DARK = '#800020';
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_DARK} 100%)`;

const BUTTON_PRIMARY = `display: inline-block; background-color: ${BRAND_PRIMARY}; color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);`;
const BUTTON_SECONDARY = `display: inline-block; background-color: transparent; color: ${BRAND_PRIMARY}; text-decoration: none; padding: 14px 38px; border-radius: 50px; font-weight: bold; font-size: 16px; border: 2px solid ${BRAND_PRIMARY};`;

const BASE_URL = 'https://www.farrayscenter.com';
const LOGO_URL = 'https://www.farrayscenter.com/images/logo/img/logo-fidc_256.png';
const INSTAGRAM_URL = 'https://www.instagram.com/farrays_centerbcn/';
const WHATSAPP_URL = 'https://wa.me/34622247085';
const WHATSAPP_NUMBER = '+34622247085';

const LOCATION_ADDRESS = "Farray's International Dance Center";
const LOCATION_STREET = 'C/ Entença 100, 08015 Barcelona';
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/YMTQFik7dB1ykdux9';

// ============================================================================
// TIPOS
// ============================================================================

type ClassCategory = 'bailes_sociales' | 'danzas_urbanas' | 'danza' | 'entrenamiento' | 'heels';

interface ConfirmationHtmlData {
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
  managementUrl: string;
  calendarUrl: string;
  icsUrl: string;
  instructor?: string;
  category?: ClassCategory;
}

interface ReminderHtmlData {
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
  timeframe: string;
  managementUrl: string;
  calendarUrl: string;
  icsUrl: string;
  category?: ClassCategory;
}

interface CancellationHtmlData {
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
}

interface FeedbackHtmlData {
  firstName: string;
  className: string;
  classDate: string;
  feedbackToken: string;
}

// ============================================================================
// COMPONENTES COMUNES
// ============================================================================

function generatePreheader(text: string): string {
  const spacer = '&nbsp;'.repeat(150);
  return `
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${text}${spacer}
  </div>`;
}

function generateHeader(): string {
  return `
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: ${BRAND_PRIMARY}; margin: 0; font-size: 24px; font-weight: bold;">Farray's International Dance Center</h1>
  </div>`;
}

function generateFooter(): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #1a1a1a; margin-top: 30px;">
    <tr>
      <td style="padding: 30px; text-align: center;">
        <img src="${LOGO_URL}" alt="Farray's International Dance Center" width="120" height="120" style="margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
        <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 15px; color: #ffffff;">Farray's International Dance Center</p>
        <p style="margin: 0 0 15px 0; color: #999999; font-size: 13px;">${LOCATION_STREET}</p>
        <p style="margin: 0 0 20px 0;">
          <a href="${BASE_URL}" style="color: ${BRAND_PRIMARY}; text-decoration: none; font-weight: bold; font-size: 14px;">farrayscenter.com</a>
        </p>
        <p style="margin: 0; padding-top: 15px; border-top: 1px solid #333;">
          <a href="${INSTAGRAM_URL}" style="color: #888888; text-decoration: none; margin: 0 12px; font-size: 13px;">Instagram</a>
          <a href="${WHATSAPP_URL}" style="color: #888888; text-decoration: none; margin: 0 12px; font-size: 13px;">WhatsApp</a>
        </p>
      </td>
    </tr>
  </table>`;
}

function generateBookingDetails(data: {
  className: string;
  classDate: string;
  classTime: string;
  instructor?: string;
}): string {
  return `
  <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Clase</span><br><strong style="font-size: 18px;">${data.className}</strong></td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Fecha</span><br><strong>${data.classDate}</strong></td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Hora</span><br><strong>${data.classTime}</strong></td></tr>
      ${data.instructor ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Instructor</span><br><strong>${data.instructor}</strong></td></tr>` : ''}
      <tr><td style="padding: 10px 0;"><span style="color: #666;">Ubicación</span><br><strong>${LOCATION_ADDRESS}</strong><br><span style="color: #666;">${LOCATION_STREET}</span></td></tr>
    </table>
  </div>`;
}

function generateActionButtons(data: {
  managementUrl: string;
  mapUrl?: string;
  googleCalUrl: string;
  icsUrl: string;
}): string {
  return `
  <div style="text-align: center; margin-bottom: 30px;">
    <table align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
      <tr>
        <td style="padding: 8px;"><a href="${data.managementUrl}" style="${BUTTON_SECONDARY}">Ver mi reserva</a></td>
        ${data.mapUrl ? `<td style="padding: 8px;"><a href="${data.mapUrl}" style="${BUTTON_SECONDARY}">Cómo llegar</a></td>` : ''}
      </tr>
      <tr>
        <td style="padding: 8px;"><a href="${data.googleCalUrl}" target="_blank" style="${BUTTON_SECONDARY}">Google Calendar</a></td>
        <td style="padding: 8px;"><a href="${data.icsUrl}" download="farrays-clase.ics" style="${BUTTON_SECONDARY}">Descargar .ics</a></td>
      </tr>
    </table>
  </div>`;
}

function generateWhatToBringSection(category?: ClassCategory): string {
  const commonItems = [
    '💧 Botella de agua',
    '🧴 Toalla pequeña',
    '🔐 Candado para taquilla (opcional)',
  ];

  let title = '¿Qué traer?';
  let items: string[] = [
    '👟 Ropa cómoda para bailar',
    '👠 Calzado según el estilo',
    ...commonItems,
  ];

  switch (category) {
    case 'bailes_sociales':
      title = '¿Qué traer a tu clase de Bailes Sociales?';
      items = [
        '👠 <strong>Chicas:</strong> Bambas o zapatos de tacón cómodos',
        '👞 <strong>Chicos:</strong> Bambas o zapatos de baile',
        '📝 <strong>Folklore:</strong> Sin calzado (se baila descalzo)',
        ...commonItems,
      ];
      break;
    case 'danzas_urbanas':
      title = '¿Qué traer a tu clase de Danzas Urbanas?';
      items = [
        '👟 Bambas cómodas (suela limpia)',
        '👖 Leggings, pantalones cortos o chándal',
        '👕 Ropa cómoda y ligera (tipo fitness)',
        '💃 <strong>Sexy Style:</strong> Bambas o tacones Stiletto. Rodilleras recomendadas',
        '🍑 <strong>Twerk:</strong> Rodilleras recomendadas',
        ...commonItems,
      ];
      break;
    case 'danza':
    case 'entrenamiento':
      title =
        category === 'entrenamiento'
          ? '¿Qué traer a tu Entrenamiento?'
          : '¿Qué traer a tu clase de Danza?';
      items = [
        '🦶 <strong>Sin calzado</strong> o calcetines antideslizantes',
        '🦵 Rodilleras recomendadas (especialmente para floorwork)',
        '👖 Ropa ajustada que permita ver la línea del cuerpo',
        ...commonItems,
      ];
      break;
    case 'heels':
      title = '¿Qué traer a tu clase de Heels?';
      items = [
        '👠 <strong>Tacones Stiletto</strong> (obligatorios)',
        '💃 Ropa femenina y atrevida que te haga sentir poderosa',
        '🎽 Top o body que permita libertad de movimiento',
        ...commonItems,
      ];
      break;
  }

  return `
  <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h3 style="margin: 0 0 15px 0; color: ${BRAND_PRIMARY};">${title}</h3>
    <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
      ${items.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <div style="background: #fdf2f4; padding: 15px; border-radius: 8px; margin-top: 15px;">
      <strong style="color: ${BRAND_PRIMARY};">⏰ Importante:</strong>
      <p style="margin: 5px 0 0 0; color: #666;">Llega <strong>10 minutos antes</strong> para cambiarte.</p>
    </div>
  </div>
  <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h4 style="margin: 0 0 10px 0; color: #333;">📍 Cómo llegar</h4>
    <p style="margin: 0; color: #666;">
      <strong>${LOCATION_ADDRESS}</strong><br>
      ${LOCATION_STREET}<br><br>
      🚇 <strong>Metro:</strong> Rocafort (L1) o Entença (L5)<br>
      🚌 <strong>Bus:</strong> Líneas 41, 54, H8
    </p>
  </div>`;
}

// ============================================================================
// HTML GENERATION FUNCTIONS (inlined for Vercel compatibility)
// ============================================================================

function generateConfirmationEmailHtml(data: ConfirmationHtmlData): string {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${generatePreheader(`${data.firstName}, tu clase de ${data.className} está confirmada para el ${data.classDate} a las ${data.classTime}. ¡Te esperamos!`)}
  ${generateHeader()}
  <div style="background: ${BRAND_GRADIENT}; color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0 0 10px 0;">¡Reserva Confirmada!</h2>
    <p style="margin: 0; opacity: 0.9;">Tu clase de prueba está lista</p>
  </div>
  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${data.firstName}</strong>,</p>
    <p style="margin: 0;">Tu reserva ha sido confirmada. Aquí están los detalles:</p>
  </div>
  ${generateBookingDetails({ className: data.className, classDate: data.classDate, classTime: data.classTime, instructor: data.instructor })}
  ${generateActionButtons({ managementUrl: data.managementUrl, mapUrl: GOOGLE_MAPS_URL, googleCalUrl: data.calendarUrl, icsUrl: data.icsUrl })}
  ${generateWhatToBringSection(data.category)}
  <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 0; color: #856404;">
      <strong>⚠️ Política de cancelación:</strong><br>
      Recuerda que si no puedes asistir, tienes hasta <strong>1 hora antes</strong> del inicio
      de la clase para cancelar y reprogramar para otro día. Pasado ese tiempo, la clase contará
      como asistida y perderás el derecho a la clase de prueba gratuita.
    </p>
  </div>
  <div style="text-align: center; padding: 25px 0;">
    <p style="color: #666; font-size: 14px; margin: 0 0 15px 0;">¿No puedes asistir?</p>
    <a href="${data.managementUrl}" style="${BUTTON_SECONDARY}">Reprogramar / Cancelar Reserva</a>
  </div>
  ${generateFooter()}
</body></html>`;
}

function generateReminderEmailHtml(data: ReminderHtmlData): string {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${generatePreheader(`${data.firstName}, tu clase de ${data.className} es ${data.timeframe} a las ${data.classTime}. ¡No olvides traer ropa cómoda!`)}
  ${generateHeader()}
  <div style="background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0 0 10px 0;">📅 Recordatorio de clase</h2>
    <p style="margin: 0; opacity: 0.9;">Tu clase es ${data.timeframe}</p>
  </div>
  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${data.firstName}</strong>,</p>
    <p style="margin: 0;">Te recordamos que ${data.timeframe} tienes tu clase de prueba:</p>
  </div>
  ${generateBookingDetails({ className: data.className, classDate: data.classDate, classTime: data.classTime })}
  ${generateActionButtons({ managementUrl: data.managementUrl, mapUrl: GOOGLE_MAPS_URL, googleCalUrl: data.calendarUrl, icsUrl: data.icsUrl })}
  ${data.category ? generateWhatToBringSection(data.category) : ''}
  <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h4 style="margin: 0 0 10px 0; color: #333;">📍 Cómo llegar</h4>
    <p style="margin: 0; color: #666;">
      <strong>${LOCATION_ADDRESS}</strong><br>
      ${LOCATION_STREET}<br><br>
      🚇 <strong>Metro:</strong> Rocafort (L1) o Entença (L5)<br>
      🚌 <strong>Bus:</strong> Líneas 41, 54, H8
    </p>
  </div>

  <!-- PROMOCIÓN ESPECIAL 24H -->
  <div style="background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_DARK} 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
    <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9;">💥 Promoción Especial 24h 💥</p>
    <h3 style="margin: 0 0 15px 0; font-size: 24px;">MATRÍCULA GRATIS</h3>
    <div style="background: rgba(255,255,255,0.15); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
      <p style="margin: 0; font-size: 14px;"><span style="text-decoration: line-through; opacity: 0.7;">ANTES 60€</span></p>
      <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold;">AHORA 0€</p>
    </div>
    <p style="margin: 0; font-size: 13px; opacity: 0.9; line-height: 1.5;">
      Oferta exclusiva para nuevos estudiantes.<br>
      Válida solo si te apuntas <strong>mañana después de tu clase de prueba</strong><br>
      y realizas el primer pago en efectivo.
    </p>
    <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">
      💡 Tú te ahorras la matrícula... y nosotros las comisiones bancarias.<br>
      ¡Ganamos todos! Recibirás tu recibo al momento del alta.
    </p>
  </div>

  <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 0; color: #856404;">
      <strong>⚠️ Política de cancelación:</strong><br>
      Recuerda que si no puedes asistir, tienes hasta <strong>1 hora antes</strong> del inicio
      de la clase para cancelar y reprogramar para otro día. Pasado ese tiempo, la clase contará
      como asistida y perderás el derecho a la clase de prueba gratuita.
    </p>
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    <p style="color: #666; margin-bottom: 15px;">¿Necesitas cambiar la fecha?</p>
    <a href="${data.managementUrl}" style="${BUTTON_SECONDARY}">
      Cancelar/Reprogramar
    </a>
  </div>
  ${generateFooter()}
</body></html>`;
}

function generateCancellationEmailHtml(data: CancellationHtmlData): string {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${generatePreheader(`Tu reserva ha sido cancelada. ¿Te arrepientes? Puedes reservar otra clase gratis cuando quieras.`)}
  ${generateHeader()}
  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0; font-size: 18px;">¡Hola <strong>${data.firstName}</strong>!</p>
    <p style="margin: 0 0 15px 0;">¡Vaya! Sentimos que no puedas venir a la clase. 😔</p>
    <p style="margin: 0;">Tu clase de <strong>${data.className}</strong> del ${data.classDate} a las ${data.classTime} ha sido cancelada ✅ y la plaza liberada para que otra persona pueda aprovecharla.</p>
  </div>
  <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 10px 0;"><strong>¿Te arrepientes?</strong> 😉</p>
    <p style="margin: 0;">Puedes reservar tu clase gratis cuando quieras, siempre que la promo siga activa y queden plazas.</p>
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${BASE_URL}/es/reservas" style="${BUTTON_PRIMARY}">
      Reprogramar Clase
    </a>
  </div>
  <div style="background: #e8f5e9; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 10px 0;"><strong>💡 ¿Sabías que...?</strong></p>
    <p style="margin: 0;">Las clases sueltas están desde <strong>20€</strong>. Y la clase gratis... ¡es una oferta top por tiempo limitado y las plazas vuelan!</p>
  </div>
  <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
    <p style="margin: 0 0 10px 0;"><strong>¿Tienes dudas? 💬</strong></p>
    <p style="margin: 0;">Escríbenos por WhatsApp al <strong>${WHATSAPP_NUMBER}</strong><br>y te responderemos lo antes posible.</p>
  </div>
  ${generateFooter()}
</body></html>`;
}

function generateFeedbackEmailHtml(data: FeedbackHtmlData): string {
  const feedbackBaseUrl = `${BASE_URL}/api/feedback?token=${data.feedbackToken}`;

  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${generatePreheader(`${data.firstName}, ¿qué tal tu clase? Cuéntanos con un click.`)}
  ${generateHeader()}
  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${data.firstName}</strong>,</p>
    <p style="margin: 0;">¿Qué tal tu clase de <strong>${data.className}</strong> del ${data.classDate}?</p>
    <p style="margin: 15px 0 0 0;">Cuéntanos con un click:</p>
  </div>

  <!-- Caritas clickeables -->
  <div style="text-align: center; margin-bottom: 30px;">
    <table align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
      <tr>
        <td style="padding: 0 8px;">
          <a href="${feedbackBaseUrl}&rating=1" style="text-decoration: none; font-size: 40px; display: block;">😡</a>
        </td>
        <td style="padding: 0 8px;">
          <a href="${feedbackBaseUrl}&rating=2" style="text-decoration: none; font-size: 40px; display: block;">😟</a>
        </td>
        <td style="padding: 0 8px;">
          <a href="${feedbackBaseUrl}&rating=3" style="text-decoration: none; font-size: 40px; display: block;">😐</a>
        </td>
        <td style="padding: 0 8px;">
          <a href="${feedbackBaseUrl}&rating=4" style="text-decoration: none; font-size: 40px; display: block;">🙂</a>
        </td>
        <td style="padding: 0 8px;">
          <a href="${feedbackBaseUrl}&rating=5" style="text-decoration: none; font-size: 40px; display: block;">🤩</a>
        </td>
      </tr>
      <tr>
        <td style="text-align: center; font-size: 12px; color: #999; padding-top: 5px;">1</td>
        <td style="text-align: center; font-size: 12px; color: #999; padding-top: 5px;">2</td>
        <td style="text-align: center; font-size: 12px; color: #999; padding-top: 5px;">3</td>
        <td style="text-align: center; font-size: 12px; color: #999; padding-top: 5px;">4</td>
        <td style="text-align: center; font-size: 12px; color: #999; padding-top: 5px;">5</td>
      </tr>
    </table>
    <p style="color: #666; font-size: 14px; margin-top: 15px;">Haz click en la carita que mejor represente tu experiencia</p>
  </div>

  <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="color: #666; margin-bottom: 15px;">¿Quieres contarnos más?</p>
    <a href="${BASE_URL}/es/feedback-comentario?token=${data.feedbackToken}" style="${BUTTON_SECONDARY}">
      Dejar un comentario
    </a>
  </div>

  <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
    <p>¡Gracias por elegirnos! 💃🕺</p>
  </div>
  ${generateFooter()}
</body></html>`;
}

// ============================================================================
// SAMPLE DATA
// ============================================================================

const SAMPLE_BOOKING = {
  firstName: 'María',
  lastName: 'García',
  email: 'maria.garcia@example.com',
  phone: '+34612345678',
  className: 'Bachata Principiantes',
  classDate: 'Viernes, 7 de febrero de 2026',
  classTime: '19:00',
  category: 'bailes_sociales' as ClassCategory,
  eventId: 'sample-event-123',
  managementToken: 'sample-token-abc123def456',
};

// ============================================================================
// HANDLER
// ============================================================================

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  const { type } = req.query;

  if (!type || typeof type !== 'string') {
    // Show index of available previews
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
    h1 { color: #B01E3C; }
    ul { list-style: none; padding: 0; }
    li { margin: 10px 0; }
    a { display: block; padding: 15px 20px; background: #f5f5f5; border-radius: 8px; text-decoration: none; color: #333; }
    a:hover { background: #e0e0e0; }
    .emoji { margin-right: 10px; }
  </style>
</head>
<body>
  <h1>📧 Email Preview</h1>
  <p>Selecciona un email para previsualizar:</p>
  <ul>
    <li><a href="?type=confirmation"><span class="emoji">✅</span> Confirmación de Reserva</a></li>
    <li><a href="?type=reminder"><span class="emoji">⏰</span> Recordatorio 24h</a></li>
    <li><a href="?type=cancellation"><span class="emoji">❌</span> Cancelación</a></li>
    <li><a href="?type=feedback"><span class="emoji">⭐</span> Feedback (caritas)</a></li>
  </ul>
</body>
</html>
    `;
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }

  // Generate calendar URLs for sample data
  const classDateTime = new Date('2026-02-07T19:00:00+01:00');
  const classEndTime = new Date('2026-02-07T20:00:00+01:00');

  const calendarParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Clase de ${SAMPLE_BOOKING.className} - Farray's Center`,
    dates: `${classDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${classEndTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    details: `Tu clase de prueba de ${SAMPLE_BOOKING.className} en Farray's Center Barcelona.`,
    location: "Farray's Center, C/ Entença 100, Barcelona",
  });

  const managementUrl = `${BASE_URL}/es/mi-reserva?token=${SAMPLE_BOOKING.managementToken}`;
  const calendarUrl = `https://calendar.google.com/calendar/render?${calendarParams.toString()}`;
  const icsUrl = `${BASE_URL}/api/calendar-ics?eventId=${SAMPLE_BOOKING.eventId}`;

  let html = '';

  try {
    switch (type) {
      case 'confirmation':
        html = generateConfirmationEmailHtml({
          firstName: SAMPLE_BOOKING.firstName,
          className: SAMPLE_BOOKING.className,
          classDate: SAMPLE_BOOKING.classDate,
          classTime: SAMPLE_BOOKING.classTime,
          managementUrl,
          calendarUrl,
          icsUrl,
          category: SAMPLE_BOOKING.category,
        });
        break;

      case 'reminder':
        html = generateReminderEmailHtml({
          firstName: SAMPLE_BOOKING.firstName,
          className: SAMPLE_BOOKING.className,
          classDate: SAMPLE_BOOKING.classDate,
          classTime: SAMPLE_BOOKING.classTime,
          timeframe: 'mañana',
          managementUrl,
          calendarUrl,
          icsUrl,
          category: SAMPLE_BOOKING.category,
        });
        break;

      case 'cancellation':
        html = generateCancellationEmailHtml({
          firstName: SAMPLE_BOOKING.firstName,
          className: SAMPLE_BOOKING.className,
          classDate: SAMPLE_BOOKING.classDate,
          classTime: SAMPLE_BOOKING.classTime,
        });
        break;

      case 'feedback':
        html = generateFeedbackEmailHtml({
          firstName: SAMPLE_BOOKING.firstName,
          className: SAMPLE_BOOKING.className,
          classDate: SAMPLE_BOOKING.classDate,
          feedbackToken: SAMPLE_BOOKING.managementToken,
        });
        break;

      default:
        return res.status(400).json({
          error: 'Invalid type. Use: confirmation, reminder, cancellation, or feedback',
        });
    }

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    console.error('[preview-email] Error generating preview:', error);
    return res.status(500).json({
      error: 'Error generating email preview',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
