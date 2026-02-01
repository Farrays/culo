/**
 * Resend Email Helper - Enterprise Configuration
 *
 * Sistema de emails transaccionales unificado para el sistema de reservas.
 * Este archivo es la ÚNICA fuente de verdad para todos los emails.
 *
 * @see https://resend.com/docs
 *
 * Configuración Resend Dashboard:
 * - Click Tracking: OFF (evita spam filters)
 * - Open Tracking: OFF (mejora entregabilidad)
 * - TLS: Opportunistic (balance seguridad/entrega)
 *
 * DNS Records requeridos:
 * - SPF: ✅ (configurado por Resend)
 * - DKIM: ✅ (configurado por Resend)
 * - DMARC: Añadir manualmente (ver README)
 */

import { Resend } from 'resend';

// ============================================================================
// CONFIGURACIÓN ENTERPRISE
// ============================================================================

/**
 * Colores corporativos de Farray's Center
 */
const BRAND_PRIMARY = '#B01E3C'; // Rojo carmesí del logo
const BRAND_DARK = '#800020'; // Borgoña oscuro
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_DARK} 100%)`;

/**
 * Estilos de botones (como en la web)
 */
const BUTTON_PRIMARY = `display: inline-block; background-color: ${BRAND_PRIMARY}; color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);`;
const BUTTON_SECONDARY = `display: inline-block; background-color: transparent; color: ${BRAND_PRIMARY}; text-decoration: none; padding: 14px 38px; border-radius: 50px; font-weight: bold; font-size: 16px; border: 2px solid ${BRAND_PRIMARY};`;

/**
 * URLs de producción
 */
const BASE_URL = 'https://www.farrayscenter.com';
const LOGO_URL = 'https://www.farrayscenter.com/images/logo/img/logo-fidc_256.png';
const INSTAGRAM_URL = 'https://www.instagram.com/farrays_centerbcn/';
const WHATSAPP_NUMBER = '+34622247085';
const WHATSAPP_URL = `https://wa.me/34622247085`;

/**
 * Ubicación del centro
 */
const LOCATION_ADDRESS = "Farray's International Dance Center";
const LOCATION_STREET = 'C/ Entença 100, 08015 Barcelona';
const LOCATION_FULL = `${LOCATION_ADDRESS}, ${LOCATION_STREET}`;
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/YMTQFik7dB1ykdux9';

/**
 * Email addresses configurados:
 * - FROM: Dirección verificada en Resend (dominio farrayscenter.com)
 * - REPLY_TO: Dirección donde recibes respuestas
 */
const FROM_EMAIL = "Farray's Center <reservas@farrayscenter.com>";
const REPLY_TO = 'info@farrayscenter.com';

/**
 * Headers adicionales para máxima entregabilidad
 */
const EMAIL_HEADERS = {
  'X-Entity-Ref-ID': 'farrayscenter-booking-system',
  'List-Unsubscribe': '<mailto:unsubscribe@farrayscenter.com>',
};

// Singleton Resend
let resendInstance: Resend | null = null;

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
  | 'entrenamiento' // Entrenamiento para bailarines
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
  category?: ClassCategory;
  classDateRaw?: string | null; // ISO date for calendar generation
  eventId?: string; // Para ICS UID
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
  classDateISO?: string; // "2026-01-28" - for calendar generation
  classTime: string;
  managementUrl: string;
  mapUrl?: string;
  reminderType?: '48h' | '24h';
  eventId?: string;
  category?: ClassCategory;
}

export interface FeedbackEmailData {
  to: string;
  firstName: string;
  className: string;
  feedbackToken: string; // Token para generar URLs de feedback
}

// ============================================================================
// CALENDAR GENERATION
// ============================================================================

const SPANISH_MONTHS: Record<string, number> = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
};

/**
 * Parsea fecha en español a Date
 */
function parseSpanishDate(classDate: string, classDateRaw?: string | null): Date {
  if (classDateRaw) {
    return new Date(classDateRaw);
  }
  // Parse from formatted date "Lunes, 27 de enero de 2026"
  const match = classDate.match(/(\d{1,2}) de (\w+) de (\d{4})/);
  if (match && match[1] && match[2] && match[3]) {
    const day = parseInt(match[1], 10);
    const monthName = match[2].toLowerCase();
    const month = SPANISH_MONTHS[monthName] ?? 0;
    const year = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  return new Date();
}

/**
 * Parsea hora y la aplica a una fecha
 */
function parseTime(timeStr: string, date: Date): void {
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch && timeMatch[1] && timeMatch[2]) {
    date.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0, 0);
  }
}

/**
 * Formatea fecha para calendarios (formato iCal)
 */
function formatCalendarDate(d: Date): string {
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/**
 * Genera URL de Google Calendar
 */
export function generateGoogleCalendarUrl(data: {
  className: string;
  classDate: string;
  classTime: string;
  classDateRaw?: string | null;
}): string {
  const startDate = parseSpanishDate(data.classDate, data.classDateRaw);
  parseTime(data.classTime, startDate);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${data.className} - Farray's Center`,
    dates: `${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}`,
    details: `Clase de prueba en Farray's International Dance Center.\n\nRecuerda llegar 10 minutos antes para cambiarte.\n\nMás info: ${BASE_URL}`,
    location: LOCATION_FULL,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Genera contenido ICS como Data URL
 */
export function generateIcsDataUrl(data: {
  className: string;
  classDate: string;
  classTime: string;
  classDateRaw?: string | null;
  eventId?: string;
}): string {
  const startDate = parseSpanishDate(data.classDate, data.classDateRaw);
  parseTime(data.classTime, startDate);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const uid =
    data.eventId ||
    `${Date.now()}-${Math.random().toString(36).substring(2, 11)}@farrayscenter.com`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Farrays Center//Booking System//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatCalendarDate(new Date())}`,
    `DTSTART:${formatCalendarDate(startDate)}`,
    `DTEND:${formatCalendarDate(endDate)}`,
    `SUMMARY:${data.className} - Farray's Center`,
    `DESCRIPTION:Clase de prueba en Farray's International Dance Center.\\nRecuerda llegar 10 minutos antes.`,
    `LOCATION:${LOCATION_FULL}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
}

/**
 * Genera sección unificada de 4 botones de acción
 * Usado en emails de confirmación y recordatorio
 */
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

// ============================================================================
// INSTRUCCIONES POR CATEGORÍA
// ============================================================================

interface CategoryInstructions {
  title: string;
  items: string[];
  color: string;
}

/**
 * Obtiene las instrucciones específicas de "¿Qué traer?" según la categoría
 */
export function getCategoryInstructions(category?: ClassCategory): CategoryInstructions {
  const commonItems = [
    '💧 Botella de agua',
    '🧴 Toalla pequeña',
    '🔐 Candado para taquilla (opcional)',
  ];

  switch (category) {
    case 'bailes_sociales':
      return {
        title: '¿Qué traer a tu clase de Bailes Sociales?',
        color: BRAND_PRIMARY,
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
        color: BRAND_PRIMARY,
        items: [
          '👟 Bambas cómodas (suela limpia)',
          '👖 Leggings, pantalones cortos o chándal',
          '👕 Ropa cómoda y ligera (tipo fitness)',
          '💃 <strong>Sexy Style:</strong> Bambas o tacones Stiletto. Rodilleras recomendadas',
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
        color: BRAND_PRIMARY,
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
        color: BRAND_PRIMARY,
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
        color: BRAND_PRIMARY,
        items: ['👟 Ropa cómoda para bailar', '👠 Calzado según el estilo', ...commonItems],
      };
  }
}

/**
 * Genera el HTML de la sección "¿Qué traer?" personalizada por categoría
 */
export function generateWhatToBringSection(category?: ClassCategory): string {
  const inst = getCategoryInstructions(category);
  return `
  <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h3 style="margin: 0 0 15px 0; color: ${inst.color};">${inst.title}</h3>
    <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
      ${inst.items.map(item => `<li>${item}</li>`).join('')}
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
// COMPONENTES COMUNES
// ============================================================================

/**
 * Genera el preheader (texto oculto que aparece en la preview del inbox)
 * Aumenta el open rate mostrando info relevante antes de abrir
 */
function generatePreheader(text: string): string {
  // El preheader debe ser invisible pero presente en el HTML
  // Usamos espacios para evitar que el cliente de email muestre contenido adicional
  const spacer = '&nbsp;'.repeat(150);
  return `
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${text}${spacer}
  </div>`;
}

/**
 * Header común para todos los emails
 */
function generateHeader(): string {
  return `
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: ${BRAND_PRIMARY}; margin: 0; font-size: 24px; font-weight: bold;">Farray's International Dance Center</h1>
  </div>`;
}

/**
 * Footer común para todos los emails
 */
function generateFooter(): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #1a1a1a; margin-top: 30px;">
    <tr>
      <td style="padding: 30px; text-align: center;">
        <img src="${LOGO_URL}" alt="Farray's International Dance Center" width="120" height="120" style="margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">
        <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 15px; color: #ffffff;">Farray's International Dance Center</p>
        <p style="margin: 0 0 15px 0; color: #999999; font-size: 13px;">${LOCATION_STREET}</p>
        <p style="margin: 0 0 20px 0;">
          <a href="${BASE_URL}" style="color: ${BRAND_PRIMARY}; text-decoration: none; font-weight: bold; font-size: 14px;">www.farrayscenter.com</a>
        </p>
        <p style="margin: 0; padding-top: 15px; border-top: 1px solid #333;">
          <a href="${INSTAGRAM_URL}" style="color: #888888; text-decoration: none; margin: 0 12px; font-size: 13px;">Instagram</a>
          <a href="${WHATSAPP_URL}" style="color: #888888; text-decoration: none; margin: 0 12px; font-size: 13px;">WhatsApp</a>
        </p>
      </td>
    </tr>
  </table>`;
}

/**
 * Tabla de detalles de reserva
 */
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

// ============================================================================
// HTML GENERATION FUNCTIONS (for preview-email.ts)
// ============================================================================

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

/**
 * Genera HTML del email de confirmación (sin enviarlo)
 */
export function generateConfirmationEmailHtml(data: ConfirmationHtmlData): string {
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

/**
 * Genera HTML del email de recordatorio (sin enviarlo)
 */
export function generateReminderEmailHtml(data: ReminderHtmlData): string {
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

  <!-- PROMOCIÓN ESPECIAL 24H - justo después de info de clase -->
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

  ${generateActionButtons({ managementUrl: data.managementUrl, mapUrl: GOOGLE_MAPS_URL, googleCalUrl: data.calendarUrl, icsUrl: data.icsUrl })}
  ${data.category ? generateWhatToBringSection(data.category) : ''}

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

/**
 * Genera HTML del email de cancelación (sin enviarlo)
 */
export function generateCancellationEmailHtml(data: CancellationHtmlData): string {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${generatePreheader(`Tu reserva ha sido cancelada. ¿Te arrepientes? Puedes reservar otra clase gratis cuando quieras.`)}
  ${generateHeader()}
  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0; font-size: 18px;">¡Hola <strong>${data.firstName}</strong>!</p>
    <p style="margin: 0 0 15px 0;">¡Vaya! Sentimos que no puedas venir a la clase. 😔</p>
    <p style="margin: 0;">Tu clase de <strong>${data.className}</strong> del ${data.classDate} a las ${data.classTime} ha sido cancelada y la plaza liberada para que otra persona pueda aprovecharla.</p>
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
    <p style="margin: 0;">Escríbenos por WhatsApp al <a href="${WHATSAPP_URL}" style="color: ${BRAND_PRIMARY}; text-decoration: none;"><strong>${WHATSAPP_NUMBER}</strong></a><br>y te responderemos lo antes posible.</p>
  </div>
  ${generateFooter()}
</body></html>`;
}

/**
 * Genera HTML del email de feedback (sin enviarlo)
 */
export function generateFeedbackEmailHtml(data: FeedbackHtmlData): string {
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
// EMAIL TEMPLATES
// ============================================================================

/**
 * Email de confirmación de reserva
 */
export async function sendBookingConfirmation(
  data: BookingEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResend();

  const googleCalUrl = generateGoogleCalendarUrl({
    className: data.className,
    classDate: data.classDate,
    classTime: data.classTime,
    classDateRaw: data.classDateRaw,
  });
  const icsUrl = generateIcsDataUrl({
    className: data.className,
    classDate: data.classDate,
    classTime: data.classTime,
    classDateRaw: data.classDateRaw,
    eventId: data.eventId,
  });

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      replyTo: REPLY_TO,
      headers: EMAIL_HEADERS,
      subject: `Reserva confirmada: ${data.className}`,
      html: `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
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
  ${generateBookingDetails(data)}
  ${generateActionButtons({ managementUrl: data.managementUrl, mapUrl: data.mapUrl || GOOGLE_MAPS_URL, googleCalUrl, icsUrl })}
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
</body></html>`,
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
      headers: EMAIL_HEADERS,
      subject: `Reserva cancelada: ${data.className}`,
      html: `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${generatePreheader(`Tu reserva ha sido cancelada. ¿Te arrepientes? Puedes reservar otra clase gratis cuando quieras.`)}
  ${generateHeader()}
  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0; font-size: 18px;">¡Hola <strong>${data.firstName}</strong>!</p>
    <p style="margin: 0 0 15px 0;">¡Vaya! Sentimos que no puedas venir a la clase. 😔</p>
    <p style="margin: 0;">Tu clase de <strong>${data.className}</strong> ha sido cancelada y la plaza liberada para que otra persona pueda aprovecharla.</p>
  </div>
  <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 10px 0;"><strong>¿Te arrepientes?</strong> 😉</p>
    <p style="margin: 0;">Puedes reservar tu clase gratis cuando quieras, siempre que la promo siga activa y queden plazas.</p>
  </div>
  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${data.bookingUrl}" style="${BUTTON_PRIMARY}">
      Reprogramar Clase
    </a>
  </div>
  <div style="background: #e8f5e9; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 10px 0;"><strong>💡 ¿Sabías que...?</strong></p>
    <p style="margin: 0;">Las clases sueltas están desde <strong>20€</strong>. Y la clase gratis... ¡es una oferta top por tiempo limitado y las plazas vuelan!</p>
  </div>
  <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
    <p style="margin: 0 0 10px 0;"><strong>¿Tienes dudas? 💬</strong></p>
    <p style="margin: 0;">Escríbenos por WhatsApp al <a href="${WHATSAPP_URL}" style="color: ${BRAND_PRIMARY}; text-decoration: none;"><strong>${WHATSAPP_NUMBER}</strong></a><br>y te responderemos lo antes posible.</p>
  </div>
  ${generateFooter()}
</body></html>`,
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
 * Email de recordatorio (48h o 24h antes)
 */
export async function sendReminderEmail(
  data: ReminderEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResend();

  const is48h = data.reminderType === '48h';
  const timeText = is48h ? 'pasado mañana' : 'mañana';
  const headerText = is48h ? 'en 48 horas' : 'mañana';

  // Generate calendar URLs
  const googleCalUrl = generateGoogleCalendarUrl({
    className: data.className,
    classDate: data.classDate,
    classTime: data.classTime,
    classDateRaw: data.classDateISO,
  });
  const icsUrl = generateIcsDataUrl({
    className: data.className,
    classDate: data.classDate,
    classTime: data.classTime,
    classDateRaw: data.classDateISO,
    eventId: data.eventId,
  });

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      replyTo: REPLY_TO,
      headers: EMAIL_HEADERS,
      subject: `Recordatorio: Tu clase de ${data.className} es ${timeText}`,
      html: `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${generatePreheader(`${data.firstName}, tu clase de ${data.className} es ${timeText} a las ${data.classTime}. ¡No olvides traer ropa cómoda!`)}
  ${generateHeader()}
  <div style="background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
    <h2 style="margin: 0 0 10px 0;">📅 Recordatorio de clase</h2>
    <p style="margin: 0; opacity: 0.9;">Tu clase es ${headerText}</p>
  </div>
  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${data.firstName}</strong>,</p>
    <p style="margin: 0;">Te recordamos que ${timeText} tienes tu clase de prueba:</p>
  </div>
  ${generateBookingDetails({ className: data.className, classDate: data.classDate, classTime: data.classTime })}
  ${
    !is48h
      ? `
  <!-- PROMOCIÓN ESPECIAL 24H - justo después de info de clase -->
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
  </div>`
      : ''
  }
  ${generateActionButtons({ managementUrl: data.managementUrl, mapUrl: data.mapUrl || GOOGLE_MAPS_URL, googleCalUrl, icsUrl })}
  ${data.category ? generateWhatToBringSection(data.category) : ''}
  ${
    !is48h
      ? `
  <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 0; color: #856404;">
      <strong>⚠️ Política de cancelación:</strong><br>
      Recuerda que si no puedes asistir, tienes hasta <strong>1 hora antes</strong> del inicio
      de la clase para cancelar y reprogramar para otro día. Pasado ese tiempo, la clase contará
      como asistida y perderás el derecho a la clase de prueba gratuita.
    </p>
  </div>`
      : ''
  }
  <div style="text-align: center; margin-bottom: 30px;">
    <p style="color: #666; margin-bottom: 15px;">¿Necesitas cambiar la fecha?</p>
    <a href="${data.managementUrl}" style="${BUTTON_SECONDARY}">
      Cancelar/Reprogramar
    </a>
  </div>
  ${generateFooter()}
</body></html>`,
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
 * Email de feedback post-clase con caritas clickeables
 */
export async function sendFeedbackEmail(
  data: FeedbackEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResend();

  // Generar URLs para cada rating
  const feedbackBaseUrl = `${BASE_URL}/api/feedback?token=${data.feedbackToken}`;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      replyTo: REPLY_TO,
      headers: EMAIL_HEADERS,
      subject: `¿Qué tal tu clase de ${data.className}?`,
      html: `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  ${generatePreheader(`${data.firstName}, ¿qué tal tu clase? Cuéntanos con un click.`)}
  ${generateHeader()}
  <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
    <p style="margin: 0 0 15px 0;">Hola <strong>${data.firstName}</strong>,</p>
    <p style="margin: 0;">¿Qué tal tu clase de <strong>${data.className}</strong>?</p>
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
</body></html>`,
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
 * Enviar email de prueba
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
      headers: EMAIL_HEADERS,
      subject: "Test de conexión - Farray's Center",
      html: `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; padding: 20px;">
  <h1 style="color: ${BRAND_PRIMARY};">Test de Email</h1>
  <p>Si recibes este email, la conexión con Resend funciona correctamente.</p>
  <p>Timestamp: ${new Date().toISOString()}</p>
  ${generateFooter()}
</body></html>`,
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

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Verifica si el email está configurado
 */
export function isEmailConfigured(): boolean {
  return !!process.env['RESEND_API_KEY'];
}

/**
 * Exportar constantes para uso externo
 */
export const EMAIL_CONFIG = {
  FROM_EMAIL,
  REPLY_TO,
  BRAND_PRIMARY,
  BRAND_DARK,
  BASE_URL,
  LOGO_URL,
  LOCATION_FULL,
  GOOGLE_MAPS_URL,
};
