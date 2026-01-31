/**
 * Google Calendar API Helper
 *
 * Integración con Google Calendar para el Calendario Académico.
 * Las reservas aparecen automáticamente en el calendario de la academia
 * con colores según estado de asistencia.
 *
 * Colores Google Calendar:
 * - 8 (Graphite/Gris): Pendiente
 * - 10 (Basil/Verde): Confirmado
 * - 11 (Tomato/Rojo): No asistirá
 * - 5 (Banana/Amarillo): Cancelado
 *
 * Variables de entorno requeridas:
 * - GOOGLE_CALENDAR_CLIENT_ID
 * - GOOGLE_CALENDAR_CLIENT_SECRET
 * - GOOGLE_CALENDAR_REFRESH_TOKEN
 * - GOOGLE_CALENDAR_ID (opcional, default: 'primary')
 */

import { google, calendar_v3 } from 'googleapis';

// ============================================================================
// TIPOS
// ============================================================================

export type AttendanceStatus = 'pending' | 'confirmed' | 'not_attending' | 'cancelled';

export interface BookingCalendarData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string; // ISO date: YYYY-MM-DD
  classTime: string; // HH:MM
  category?: string;
  eventId?: string; // Internal booking ID
  managementUrl?: string; // Magic link for booking management
}

export interface CalendarResult {
  success: boolean;
  calendarEventId?: string;
  error?: string;
}

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

// Colores de Google Calendar por estado
const STATUS_COLORS: Record<AttendanceStatus, string> = {
  pending: '8', // Graphite (gris)
  confirmed: '10', // Basil (verde)
  not_attending: '11', // Tomato (rojo)
  cancelled: '5', // Banana (amarillo)
};

// Duración por defecto de clase (en minutos)
const DEFAULT_CLASS_DURATION = 60;

// Ubicación de la academia
const ACADEMY_LOCATION =
  "Farray's International Dance Center, C/ Entença 100, Local 1, 08015 Barcelona";

// Timezone
const TIMEZONE = 'Europe/Madrid';

// ============================================================================
// CLIENTE GOOGLE CALENDAR (LAZY)
// ============================================================================

let calendarClient: calendar_v3.Calendar | null = null;

function getCalendarClient(): calendar_v3.Calendar | null {
  const clientId = process.env['GOOGLE_CALENDAR_CLIENT_ID'];
  const clientSecret = process.env['GOOGLE_CALENDAR_CLIENT_SECRET'];
  const refreshToken = process.env['GOOGLE_CALENDAR_REFRESH_TOKEN'];

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('[google-calendar] Missing credentials');
    return null;
  }

  if (!calendarClient) {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    calendarClient = google.calendar({ version: 'v3', auth: oauth2Client });
  }

  return calendarClient;
}

function getCalendarId(): string {
  return process.env['GOOGLE_CALENDAR_ID'] || 'primary';
}

// ============================================================================
// FUNCIONES PRINCIPALES
// ============================================================================

/**
 * Verifica si Google Calendar está configurado
 */
export function isGoogleCalendarConfigured(): boolean {
  return !!(
    process.env['GOOGLE_CALENDAR_CLIENT_ID'] &&
    process.env['GOOGLE_CALENDAR_CLIENT_SECRET'] &&
    process.env['GOOGLE_CALENDAR_REFRESH_TOKEN']
  );
}

/**
 * Crea un evento de reserva en el Calendario Académico
 *
 * @param booking - Datos de la reserva
 * @returns ID del evento creado en Google Calendar
 */
export async function createBookingEvent(booking: BookingCalendarData): Promise<CalendarResult> {
  const calendar = getCalendarClient();

  if (!calendar) {
    return { success: false, error: 'Google Calendar not configured' };
  }

  try {
    // Calcular fecha/hora de inicio y fin
    const startDateTime = parseClassDateTime(booking.classDate, booking.classTime);
    const endDateTime = new Date(startDateTime.getTime() + DEFAULT_CLASS_DURATION * 60 * 1000);

    // Crear evento
    const event: calendar_v3.Schema$Event = {
      summary: `${booking.firstName} ${booking.lastName} - ${booking.className}`,
      description: formatEventDescription(booking),
      location: ACADEMY_LOCATION,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: TIMEZONE,
      },
      colorId: STATUS_COLORS.pending,
      // Metadata para identificar el booking
      extendedProperties: {
        private: {
          bookingEventId: booking.eventId || '',
          email: booking.email,
          phone: booking.phone,
          category: booking.category || '',
        },
      },
    };

    const result = await calendar.events.insert({
      calendarId: getCalendarId(),
      requestBody: event,
    });

    console.log(`[google-calendar] Event created: ${result.data.id}`);

    return {
      success: true,
      calendarEventId: result.data.id || undefined,
    };
  } catch (error) {
    console.error('[google-calendar] Error creating event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Actualiza el estado de asistencia de un evento
 * Cambia el color del evento según el nuevo estado
 *
 * @param calendarEventId - ID del evento en Google Calendar
 * @param status - Nuevo estado de asistencia
 */
export async function updateEventAttendance(
  calendarEventId: string,
  status: AttendanceStatus
): Promise<CalendarResult> {
  const calendar = getCalendarClient();

  if (!calendar) {
    return { success: false, error: 'Google Calendar not configured' };
  }

  try {
    // Obtener evento actual para preservar descripción
    const currentEvent = await calendar.events.get({
      calendarId: getCalendarId(),
      eventId: calendarEventId,
    });

    // Actualizar descripción con estado
    const statusText = getStatusText(status);
    let description = currentEvent.data.description || '';

    // Actualizar o añadir línea de estado
    if (description.includes('Estado:')) {
      description = description.replace(/Estado: .+/, `Estado: ${statusText}`);
    } else {
      description += `\n\n━━━━━━━━━━━━━━━━━━━━\nEstado: ${statusText}`;
    }

    await calendar.events.patch({
      calendarId: getCalendarId(),
      eventId: calendarEventId,
      requestBody: {
        colorId: STATUS_COLORS[status],
        description,
      },
    });

    console.log(`[google-calendar] Event ${calendarEventId} updated to ${status}`);

    return { success: true, calendarEventId };
  } catch (error) {
    console.error('[google-calendar] Error updating event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Elimina un evento del calendario (cuando se cancela la reserva)
 *
 * @param calendarEventId - ID del evento en Google Calendar
 */
export async function deleteBookingEvent(calendarEventId: string): Promise<CalendarResult> {
  const calendar = getCalendarClient();

  if (!calendar) {
    return { success: false, error: 'Google Calendar not configured' };
  }

  try {
    await calendar.events.delete({
      calendarId: getCalendarId(),
      eventId: calendarEventId,
    });

    console.log(`[google-calendar] Event ${calendarEventId} deleted`);

    return { success: true };
  } catch (error) {
    // Si el evento no existe, considerarlo como éxito
    if (error instanceof Error && error.message.includes('404')) {
      console.warn(`[google-calendar] Event ${calendarEventId} not found (already deleted?)`);
      return { success: true };
    }

    console.error('[google-calendar] Error deleting event:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Parsea fecha y hora de clase a Date object
 */
function parseClassDateTime(classDate: string, classTime: string): Date {
  // classDate puede ser "2026-01-31" o "Lunes 28 de Enero (2026-01-28)"
  const isoMatch = classDate.match(/\d{4}-\d{2}-\d{2}/);
  const dateStr = isoMatch ? isoMatch[0] : classDate;

  // classTime: "19:00"
  const [hours, minutes] = classTime.split(':').map(Number);

  const date = new Date(dateStr);
  date.setHours(hours || 19, minutes || 0, 0, 0);

  return date;
}

/**
 * Formatea la descripción del evento con información enterprise
 * Incluye: contacto, enlace de gestión, WhatsApp directo, booking ID
 */
function formatEventDescription(booking: BookingCalendarData): string {
  // Normalizar teléfono para enlace de WhatsApp (sin +, espacios, guiones)
  const phoneNormalized = booking.phone.replace(/[\s\-+]/g, '');
  const whatsappUrl = `https://wa.me/${phoneNormalized}`;

  // Categoría legible
  const categoryLabels: Record<string, string> = {
    bailes_sociales: 'Bailes Sociales',
    danzas_urbanas: 'Danzas Urbanas',
    danza: 'Danza',
    entrenamiento: 'Entrenamiento',
    heels: 'Heels',
  };
  const categoryLabel = categoryLabels[booking.category || ''] || booking.category || 'N/A';

  // Construir descripción
  let description = `🎫 Clase de Prueba Gratuita

━━━━━━━━━━ CONTACTO ━━━━━━━━━━
📧 ${booking.email}
📱 ${booking.phone}
💬 ${whatsappUrl}
`;

  // Sección de gestión (solo si hay managementUrl)
  if (booking.managementUrl) {
    description += `
━━━━━━━━━━ GESTIÓN ━━━━━━━━━━
📋 ${booking.managementUrl}
`;
  }

  // Información adicional
  description += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎭 ${categoryLabel}`;

  // Booking ID (útil para soporte)
  if (booking.eventId) {
    description += `
🆔 ${booking.eventId}`;
  }

  description += `

Estado: ⚪ Pendiente de confirmación

Reservado vía: farrayscenter.com`;

  return description;
}

/**
 * Obtiene el texto de estado para la descripción
 */
function getStatusText(status: AttendanceStatus): string {
  switch (status) {
    case 'pending':
      return '⚪ Pendiente de confirmación';
    case 'confirmed':
      return '🟢 Confirmado - Asistirá';
    case 'not_attending':
      return '🔴 No asistirá';
    case 'cancelled':
      return '⚫ Reserva cancelada';
    default:
      return '❓ Desconocido';
  }
}

/**
 * Obtiene información de configuración (para debugging)
 */
export function getGoogleCalendarConfigInfo(): {
  hasClientId: boolean;
  hasClientSecret: boolean;
  hasRefreshToken: boolean;
  calendarId: string;
} {
  return {
    hasClientId: !!process.env['GOOGLE_CALENDAR_CLIENT_ID'],
    hasClientSecret: !!process.env['GOOGLE_CALENDAR_CLIENT_SECRET'],
    hasRefreshToken: !!process.env['GOOGLE_CALENDAR_REFRESH_TOKEN'],
    calendarId: getCalendarId(),
  };
}
