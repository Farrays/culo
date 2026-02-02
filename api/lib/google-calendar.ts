/**
 * Google Calendar REST API Helper
 *
 * Integración con Google Calendar para el Calendario Académico.
 * Las reservas aparecen automáticamente en el calendario de la academia
 * con colores según estado de asistencia.
 *
 * IMPORTANTE - Por qué usamos REST API en lugar de googleapis:
 * ============================================================
 * El paquete `googleapis` de npm (~50MB) NO es compatible con Vercel serverless functions.
 * Causa errores de bundling tipo ERR_MODULE_NOT_FOUND en producción.
 * Después de 6 intentos fallidos (commits 36b1610 → a285e54), se decidió
 * reescribir usando fetch() nativo que funciona perfectamente en Vercel (~0KB overhead).
 *
 * @see https://developers.google.com/calendar/api/v3/reference
 * @see Commits fallidos: 36b1610, 8c7d3a2, f1e9b4c, 2a8d5e1, 7c3f6b9, a285e54
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
  classDate: string; // ISO date: YYYY-MM-DD o "Lunes 28 de Enero (2026-01-28)"
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

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const TIMEZONE = 'Europe/Madrid';
const DEFAULT_CLASS_DURATION = 60; // minutos

const ACADEMY_LOCATION =
  "Farray's International Dance Center, C/ Entença 100, Local 1, 08015 Barcelona";

// Colores de Google Calendar por estado
const STATUS_COLORS: Record<AttendanceStatus, string> = {
  pending: '8', // Graphite (gris)
  confirmed: '10', // Basil (verde)
  not_attending: '11', // Tomato (rojo)
  cancelled: '5', // Banana (amarillo)
};

// ============================================================================
// TOKEN MANAGEMENT (OAuth2 refresh token flow)
// ============================================================================

let cachedAccessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Obtiene un access token válido usando el refresh token.
 * Cachea el token en memoria para evitar llamadas innecesarias.
 */
async function getAccessToken(): Promise<string | null> {
  const clientId = process.env['GOOGLE_CALENDAR_CLIENT_ID'];
  const clientSecret = process.env['GOOGLE_CALENDAR_CLIENT_SECRET'];
  const refreshToken = process.env['GOOGLE_CALENDAR_REFRESH_TOKEN'];

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn('[google-calendar] Missing credentials');
    return null;
  }

  // Return cached token if still valid (with 60s buffer)
  if (cachedAccessToken && Date.now() < tokenExpiry - 60000) {
    return cachedAccessToken;
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[google-calendar] Token refresh failed:', error);
      return null;
    }

    const data = await response.json();
    cachedAccessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;

    return cachedAccessToken;
  } catch (error) {
    console.error('[google-calendar] Token refresh error:', error);
    return null;
  }
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
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { success: false, error: 'Failed to get access token' };
  }

  try {
    // Calcular fecha/hora de inicio y fin
    const startDateTime = parseClassDateTime(booking.classDate, booking.classTime);
    const endDateTime = new Date(startDateTime.getTime() + DEFAULT_CLASS_DURATION * 60 * 1000);

    // Crear evento
    const event = {
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

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('[google-calendar] Create event failed:', error);
      return { success: false, error: `HTTP ${response.status}: ${error}` };
    }

    const data = await response.json();
    console.log(`[google-calendar] Event created: ${data.id}`);

    return {
      success: true,
      calendarEventId: data.id,
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
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { success: false, error: 'Failed to get access token' };
  }

  try {
    // Obtener evento actual para preservar descripción
    const getResponse = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events/${calendarEventId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!getResponse.ok) {
      return { success: false, error: `Event not found: ${calendarEventId}` };
    }

    const currentEvent = await getResponse.json();
    let description = currentEvent.description || '';

    // Actualizar o añadir línea de estado
    const statusText = getStatusText(status);
    if (description.includes('Estado:')) {
      description = description.replace(/Estado: .+/, `Estado: ${statusText}`);
    } else {
      description += `\n\n━━━━━━━━━━━━━━━━━━━━\nEstado: ${statusText}`;
    }

    // PATCH para actualizar
    const patchResponse = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events/${calendarEventId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          colorId: STATUS_COLORS[status],
          description,
        }),
      }
    );

    if (!patchResponse.ok) {
      const error = await patchResponse.text();
      return { success: false, error: `HTTP ${patchResponse.status}: ${error}` };
    }

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
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { success: false, error: 'Failed to get access token' };
  }

  try {
    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(getCalendarId())}/events/${calendarEventId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // 204 No Content = éxito, 404 = ya eliminado (también OK)
    if (response.status === 204 || response.status === 404) {
      console.log(`[google-calendar] Event ${calendarEventId} deleted`);
      return { success: true };
    }

    const error = await response.text();
    return { success: false, error: `HTTP ${response.status}: ${error}` };
  } catch (error) {
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
