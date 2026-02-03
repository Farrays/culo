import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';
import { Resend } from 'resend';

/**
 * API Route: /api/cron-reminders
 *
 * Cron job para enviar recordatorios automáticos de clases.
 * - 48h antes: Primer recordatorio
 * - 24h antes: Segundo recordatorio (con promoción matrícula gratis)
 *
 * Ejecutar cada hora vía Vercel Cron.
 *
 * Headers requeridos:
 * - Authorization: Bearer {CRON_SECRET}
 *
 * NOTA: Este archivo tiene las plantillas de email/WhatsApp inlineadas
 * para evitar problemas de bundling en Vercel serverless functions.
 */

// ============================================================================
// CONSTANTES ENTERPRISE
// ============================================================================

const SPAIN_TIMEZONE = 'Europe/Madrid';
const BOOKING_MANAGEMENT_URL = 'https://www.farrayscenter.com/es/mi-reserva';

// Brand colors
const BRAND_PRIMARY = '#B01E3C';
const BRAND_DARK = '#800020';

// Button styles
const BUTTON_SECONDARY = `display: inline-block; background-color: transparent; color: ${BRAND_PRIMARY}; text-decoration: none; padding: 14px 38px; border-radius: 50px; font-weight: bold; font-size: 16px; border: 2px solid ${BRAND_PRIMARY};`;

// URLs
const BASE_URL = 'https://www.farrayscenter.com';
const LOGO_URL = 'https://www.farrayscenter.com/images/logo/img/logo-fidc_256.png';
const INSTAGRAM_URL = 'https://www.instagram.com/farrays_centerbcn/';
const WHATSAPP_URL = `https://wa.me/34622247085`;
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/YMTQFik7dB1ykdux9';

// Location
const LOCATION_ADDRESS = "Farray's International Dance Center";
const LOCATION_STREET = 'C/ Entença 100, 08015 Barcelona';
const LOCATION_FULL = `${LOCATION_ADDRESS}, ${LOCATION_STREET}`;

// Email config
const FROM_EMAIL = "Farray's Center <reservas@farrayscenter.com>";
const REPLY_TO = 'info@farrayscenter.com';
const EMAIL_HEADERS = {
  'X-Entity-Ref-ID': 'farrayscenter-booking-system',
  'List-Unsubscribe': '<mailto:unsubscribe@farrayscenter.com>',
};

// WhatsApp Cloud API
const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';
const WHATSAPP_PHONE_NUMBER_ID = '576045082';

// Category types
type ClassCategory = 'bailes_sociales' | 'danzas_urbanas' | 'danza' | 'entrenamiento' | 'heels';

// ============================================================================
// REDIS CLIENT
// ============================================================================

let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const redisUrl = process.env['STORAGE_REDIS_URL'];
  if (!redisUrl) return null;

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });
  }
  return redisClient;
}

// ============================================================================
// TYPES
// ============================================================================

interface BookingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  category: string;
  calendarEventId?: string | null;
  createdAt: string;
  status?: 'confirmed' | 'cancelled';
  reminder48hSent?: boolean;
  reminder24hSent?: boolean;
}

interface ReminderResult {
  eventId: string;
  type: '48h' | '24h';
  email: boolean;
  whatsapp: boolean;
  error?: string;
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

function getDateInTimezone(date: Date, timezone: string): string {
  return date.toLocaleDateString('en-CA', { timeZone: timezone });
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDateSpanish(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;

    const formatter = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: SPAIN_TIMEZONE,
    });

    const formatted = formatter.format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return isoDate;
  }
}

// ============================================================================
// CALENDAR GENERATION UTILITIES
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

function parseSpanishDate(classDate: string, classDateRaw?: string | null): Date {
  if (classDateRaw) {
    return new Date(classDateRaw);
  }
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

function parseTime(timeStr: string, date: Date): void {
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch && timeMatch[1] && timeMatch[2]) {
    date.setHours(parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), 0, 0);
  }
}

function formatCalendarDate(d: Date): string {
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function generateGoogleCalendarUrl(data: {
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

function generateIcsDataUrl(data: {
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

// ============================================================================
// EMAIL HTML COMPONENTS
// ============================================================================

function generatePreheader(text: string): string {
  const spacer = '&nbsp;'.repeat(150);
  return `<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${text}${spacer}</div>`;
}

function generateHeader(): string {
  return `<div style="text-align: center; margin-bottom: 30px;"><h1 style="color: ${BRAND_PRIMARY}; margin: 0; font-size: 24px; font-weight: bold;">Farray's International Dance Center</h1></div>`;
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

function generateBookingDetails(data: {
  className: string;
  classDate: string;
  classTime: string;
}): string {
  return `
  <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Clase</span><br><strong style="font-size: 18px;">${data.className}</strong></td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Fecha</span><br><strong>${data.classDate}</strong></td></tr>
      <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><span style="color: #666;">Hora</span><br><strong>${data.classTime}</strong></td></tr>
      <tr><td style="padding: 10px 0;"><span style="color: #666;">Ubicación</span><br><strong>${LOCATION_ADDRESS}</strong><br><span style="color: #666;">${LOCATION_STREET}</span></td></tr>
    </table>
  </div>`;
}

function generateActionButtons(data: {
  managementUrl: string;
  googleCalUrl: string;
  icsUrl: string;
}): string {
  return `
  <div style="text-align: center; margin-bottom: 30px;">
    <table align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
      <tr>
        <td style="padding: 8px;"><a href="${data.managementUrl}" style="${BUTTON_SECONDARY}">Ver mi reserva</a></td>
        <td style="padding: 8px;"><a href="${GOOGLE_MAPS_URL}" style="${BUTTON_SECONDARY}">Cómo llegar</a></td>
      </tr>
      <tr>
        <td style="padding: 8px;"><a href="${data.googleCalUrl}" target="_blank" style="${BUTTON_SECONDARY}">Google Calendar</a></td>
        <td style="padding: 8px;"><a href="${data.icsUrl}" download="farrays-clase.ics" style="${BUTTON_SECONDARY}">Descargar .ics</a></td>
      </tr>
    </table>
  </div>`;
}

function getCategoryInstructions(category?: ClassCategory): {
  title: string;
  items: string[];
  color: string;
} {
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

function generateWhatToBringSection(category?: ClassCategory): string {
  const inst = getCategoryInstructions(category);
  return `
  <div style="background: #fff3e0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h3 style="margin: 0 0 15px 0; color: ${inst.color};">${inst.title}</h3>
    <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">${inst.items.map(item => `<li>${item}</li>`).join('')}</ul>
    <div style="background: #fdf2f4; padding: 15px; border-radius: 8px; margin-top: 15px;">
      <strong style="color: ${BRAND_PRIMARY};">⏰ Importante:</strong>
      <p style="margin: 5px 0 0 0; color: #666;">Llega <strong>10 minutos antes</strong> para cambiarte.</p>
    </div>
  </div>
  <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
    <h4 style="margin: 0 0 10px 0; color: #333;">📍 Cómo llegar</h4>
    <p style="margin: 0; color: #666;"><strong>${LOCATION_ADDRESS}</strong><br>${LOCATION_STREET}<br><br>🚇 <strong>Metro:</strong> Rocafort (L1) o Entença (L5)<br>🚌 <strong>Bus:</strong> Líneas 41, 54, H8</p>
  </div>`;
}

// ============================================================================
// INLINED EMAIL FUNCTION
// ============================================================================

interface ReminderEmailData {
  to: string;
  firstName: string;
  className: string;
  classDate: string;
  classDateISO?: string;
  classTime: string;
  managementUrl: string;
  reminderType?: '48h' | '24h';
  eventId?: string;
  category?: ClassCategory;
}

async function sendReminderEmailInline(
  data: ReminderEmailData
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) return { success: false, error: 'Missing RESEND_API_KEY' };

  const resend = new Resend(apiKey);
  const is48h = data.reminderType === '48h';
  const timeText = is48h ? 'pasado mañana' : 'mañana';
  const headerText = is48h ? 'en 48 horas' : 'mañana';

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
      ? `<div style="background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, ${BRAND_DARK} 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
    <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9;">💥 Promoción Especial 24h 💥</p>
    <h3 style="margin: 0 0 15px 0; font-size: 24px;">MATRÍCULA GRATIS</h3>
    <div style="background: rgba(255,255,255,0.15); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
      <p style="margin: 0; font-size: 14px;"><span style="text-decoration: line-through; opacity: 0.7;">ANTES 60€</span></p>
      <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold;">AHORA 0€</p>
    </div>
    <p style="margin: 0; font-size: 13px; opacity: 0.9; line-height: 1.5;">Oferta exclusiva para nuevos estudiantes.<br>Válida solo si te apuntas <strong>mañana después de tu clase de prueba</strong><br>y realizas el primer pago en efectivo.</p>
    <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">💡 Tú te ahorras la matrícula... y nosotros las comisiones bancarias.<br>¡Ganamos todos! Recibirás tu recibo al momento del alta.</p>
  </div>`
      : ''
  }
  ${generateActionButtons({ managementUrl: data.managementUrl, googleCalUrl, icsUrl })}
  ${data.category ? generateWhatToBringSection(data.category) : ''}
  ${
    !is48h
      ? `<div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <p style="margin: 0; color: #856404;"><strong>⚠️ Política de cancelación:</strong><br>Recuerda que si no puedes asistir, tienes hasta <strong>1 hora antes</strong> del inicio de la clase para cancelar y reprogramar para otro día. Pasado ese tiempo, la clase contará como asistida y perderás el derecho a la clase de prueba gratuita.</p>
  </div>`
      : ''
  }
  <div style="text-align: center; margin-bottom: 30px;">
    <p style="color: #666; margin-bottom: 15px;">¿Necesitas cambiar la fecha?</p>
    <a href="${data.managementUrl}" style="${BUTTON_SECONDARY}">Cancelar/Reprogramar</a>
  </div>
  ${generateFooter()}
</body></html>`,
    });

    if (result.error) return { success: false, error: result.error.message };
    return { success: true };
  } catch (error) {
    console.error('[cron-reminders] Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============================================================================
// INLINED WHATSAPP FUNCTIONS
// ============================================================================

function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-().]/g, '');
  if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
  if (cleaned.startsWith('00')) cleaned = cleaned.substring(2);
  if (/^[67]\d{8}$/.test(cleaned)) cleaned = '34' + cleaned;
  return cleaned;
}

async function sendWhatsAppTemplate(
  templateName: string,
  to: string,
  components: Array<{ type: string; parameters?: Array<{ type: string; text: string }> }>
): Promise<{ success: boolean; error?: string }> {
  const accessToken = process.env['WHATSAPP_ACCESS_TOKEN'];
  if (!accessToken) return { success: false, error: 'Missing WHATSAPP_ACCESS_TOKEN' };

  try {
    const response = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalizePhoneNumber(to),
        type: 'template',
        template: { name: templateName, language: { code: 'es' }, components },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function sendReminderWhatsAppInline(data: {
  to: string;
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
}): Promise<{ success: boolean; error?: string }> {
  return sendWhatsAppTemplate('recordatorio_prueba_0', data.to, [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: data.firstName },
        { type: 'text', text: data.className },
        { type: 'text', text: data.classDate },
        { type: 'text', text: data.classTime },
      ],
    },
  ]);
}

async function sendAttendanceReminderWhatsAppInline(data: {
  to: string;
  firstName: string;
  className: string;
  classDate: string;
  classTime: string;
}): Promise<{ success: boolean; error?: string }> {
  return sendWhatsAppTemplate('recordatorio_prueba_2', data.to, [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: data.firstName },
        { type: 'text', text: data.className },
        { type: 'text', text: data.classDate },
        { type: 'text', text: data.classTime },
      ],
    },
  ]);
}

// ============================================================================
// MAIN PROCESSING FUNCTION
// ============================================================================

async function processRemindersForDate(
  redis: Redis,
  targetDate: string,
  reminderType: '48h' | '24h'
): Promise<ReminderResult[]> {
  const results: ReminderResult[] = [];
  const reminderKey = `reminders:${targetDate}`;
  const eventIds = await redis.smembers(reminderKey);

  if (eventIds.length === 0) {
    console.log(`[cron-reminders] No bookings found for ${targetDate}`);
    return results;
  }

  console.log(`[cron-reminders] Found ${eventIds.length} bookings for ${targetDate}`);

  for (const eventId of eventIds) {
    const result: ReminderResult = { eventId, type: reminderType, email: false, whatsapp: false };

    try {
      const bookingData = await redis.get(`booking_details:${eventId}`);
      if (!bookingData) {
        result.error = 'Booking not found';
        results.push(result);
        continue;
      }

      const booking: BookingDetails = JSON.parse(bookingData);

      if (booking.status === 'cancelled') {
        console.log(`[cron-reminders] Skipping cancelled booking ${eventId}`);
        continue;
      }

      const sentFlag = reminderType === '48h' ? 'reminder48hSent' : 'reminder24hSent';
      if (booking[sentFlag]) {
        console.log(`[cron-reminders] ${reminderType} already sent for ${eventId}`);
        continue;
      }

      console.log(`[cron-reminders] Sending ${reminderType} reminder for ${eventId}`);

      const managementUrl = `${BOOKING_MANAGEMENT_URL}?email=${encodeURIComponent(booking.email)}&event=${eventId}`;
      const formattedDate = formatDateSpanish(booking.classDate);
      const classDateISOMatch = booking.classDate?.match(/\d{4}-\d{2}-\d{2}/);
      const classDateISO = classDateISOMatch ? classDateISOMatch[0] : undefined;

      // Email
      try {
        const emailResult = await sendReminderEmailInline({
          to: booking.email,
          firstName: booking.firstName,
          className: booking.className,
          classDate: formattedDate || booking.classDate,
          classDateISO,
          classTime: booking.classTime,
          managementUrl,
          reminderType,
          eventId,
          category: booking.category as ClassCategory,
        });
        result.email = emailResult.success;
        if (!emailResult.success)
          console.warn(`[cron-reminders] Email failed for ${eventId}:`, emailResult.error);
      } catch (e) {
        console.warn(`[cron-reminders] Email error for ${eventId}:`, e);
      }

      // WhatsApp
      try {
        const whatsappResult =
          reminderType === '24h'
            ? await sendAttendanceReminderWhatsAppInline({
                to: booking.phone,
                firstName: booking.firstName,
                className: booking.className,
                classDate: formattedDate || booking.classDate,
                classTime: booking.classTime,
              })
            : await sendReminderWhatsAppInline({
                to: booking.phone,
                firstName: booking.firstName,
                className: booking.className,
                classDate: formattedDate || booking.classDate,
                classTime: booking.classTime,
              });
        result.whatsapp = whatsappResult.success;
        if (!whatsappResult.success)
          console.warn(`[cron-reminders] WhatsApp failed for ${eventId}:`, whatsappResult.error);
      } catch (e) {
        console.warn(`[cron-reminders] WhatsApp error for ${eventId}:`, e);
      }

      if (result.email || result.whatsapp) {
        const updatedBooking = { ...booking, [sentFlag]: true };
        await redis.setex(
          `booking_details:${eventId}`,
          90 * 24 * 60 * 60,
          JSON.stringify(updatedBooking)
        );
        console.log(`[cron-reminders] Marked ${sentFlag}=true for ${eventId}`);
      }

      results.push(result);
    } catch (e) {
      result.error = e instanceof Error ? e.message : 'Unknown error';
      results.push(result);
      console.error(`[cron-reminders] Error processing ${eventId}:`, e);
    }
  }

  return results;
}

// ============================================================================
// HANDLER
// ============================================================================

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env['CRON_SECRET'];
  const isDev =
    process.env['NODE_ENV'] === 'development' || process.env['VERCEL_ENV'] === 'development';

  if (!isDev && cronSecret) {
    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      console.error('[cron-reminders] Unauthorized request');
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const redis = getRedisClient();
  if (!redis) {
    console.error('[cron-reminders] Redis not configured');
    return res.status(500).json({ error: 'Redis not configured' });
  }

  try {
    const now = new Date();
    const results = {
      timestamp: now.toISOString(),
      results48h: [] as ReminderResult[],
      results24h: [] as ReminderResult[],
    };

    const tomorrow = addDays(now, 1);
    const dayAfterTomorrow = addDays(now, 2);
    const tomorrowStr = getDateInTimezone(tomorrow, SPAIN_TIMEZONE);
    const dayAfterTomorrowStr = getDateInTimezone(dayAfterTomorrow, SPAIN_TIMEZONE);

    console.log(`[cron-reminders] Processing reminders:`);
    console.log(`  - 48h reminders for classes on: ${dayAfterTomorrowStr}`);
    console.log(`  - 24h reminders for classes on: ${tomorrowStr}`);

    results.results48h = await processRemindersForDate(redis, dayAfterTomorrowStr, '48h');
    results.results24h = await processRemindersForDate(redis, tomorrowStr, '24h');

    const totalSent = results.results48h.length + results.results24h.length;
    console.log(`[cron-reminders] Completed. Total reminders processed: ${totalSent}`);

    return res
      .status(200)
      .json({ success: true, message: `Processed ${totalSent} reminders`, data: results });
  } catch (error) {
    console.error('[cron-reminders] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
