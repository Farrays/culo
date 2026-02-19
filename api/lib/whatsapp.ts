/**
 * WhatsApp Cloud API Helper
 *
 * Helper para envío de mensajes de WhatsApp vía Cloud API.
 * Usa plantillas pre-aprobadas por Meta.
 *
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api
 *
 * Variables de entorno requeridas:
 * - WHATSAPP_TOKEN: Token de acceso de la API
 * - WHATSAPP_PHONE_ID: ID del número de teléfono de WhatsApp Business
 */

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const WHATSAPP_API_VERSION = 'v23.0';

function getConfig() {
  const token = process.env['WHATSAPP_TOKEN'];
  const phoneId = process.env['WHATSAPP_PHONE_ID'];

  if (!token) {
    throw new Error('Missing WHATSAPP_TOKEN environment variable');
  }

  if (!phoneId) {
    throw new Error('Missing WHATSAPP_PHONE_ID environment variable');
  }

  return {
    token,
    phoneId,
    apiUrl: `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneId}/messages`,
  };
}

// ============================================================================
// TIPOS
// ============================================================================

/**
 * Categorías de clases - cada una tiene su propia plantilla de WhatsApp
 */
export type ClassCategory =
  | 'bailes_sociales' // Salsa, Bachata, Kizomba, etc.
  | 'danzas_urbanas' // Hip Hop, House, Breaking, etc.
  | 'danza' // Ballet, Contemporáneo, Jazz, etc.
  | 'entrenamiento' // Entrenamiento para bailarines (usa plantilla de danza)
  | 'heels'; // Heels Dance

/**
 * Mapeo de categoría a nombre de plantilla de WhatsApp
 */
const CATEGORY_TEMPLATES: Record<ClassCategory, string> = {
  bailes_sociales: 'confirmacion_bailes_sociales',
  danzas_urbanas: 'confirmacion_danzas_urbanas_1',
  danza: 'confirmacion_danza_1',
  entrenamiento: 'confirmacion_danza_1', // Usa misma plantilla que danza
  heels: 'confirmacion_heels_1',
};

export interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface BookingWhatsAppData {
  to: string; // Número con código de país (ej: 34612345678)
  firstName: string;
  className: string;
  classDate: string; // "Lunes 28 de Enero"
  classTime: string; // "19:00"
  category: ClassCategory; // Categoría para seleccionar plantilla
}

export interface ReminderWhatsAppData {
  to: string;
  firstName: string;
  className: string;
  classDate: string; // Fecha formateada: "Lunes 28 de Enero"
  classTime: string; // Hora: "19:00"
  category?: 'bailes_sociales' | 'danzas_urbanas' | 'danza' | 'entrenamiento' | 'heels';
  reminderType?: '48h' | '24h';
}

export interface CancellationWhatsAppData {
  to: string;
  firstName: string;
}

// Tipos internos para la API de WhatsApp
interface WhatsAppTemplateComponent {
  type: 'header' | 'body' | 'button';
  parameters: Array<{
    type: 'text' | 'image' | 'document' | 'video';
    text?: string;
    image?: { link: string };
  }>;
  sub_type?: 'url' | 'quick_reply';
  index?: number;
}

interface WhatsAppTemplateMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: WhatsAppTemplateComponent[];
  };
}

interface WhatsAppApiResponse {
  messages?: Array<{ id: string }>;
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Normaliza número de teléfono para WhatsApp (E.164 sin +)
 * Añade código de país si es necesario (ES: 34, FR: 33)
 */
function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-().]/g, '');
  if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
  // Spanish: 9 digits starting with 6,7,8,9
  if (cleaned.length === 9 && /^[6789]/.test(cleaned)) cleaned = '34' + cleaned;
  // French: 10 digits starting with 0
  if (cleaned.length === 10 && cleaned.startsWith('0')) cleaned = '33' + cleaned.substring(1);
  return cleaned;
}

/**
 * Envía un mensaje de plantilla vía WhatsApp Cloud API
 */
async function sendTemplate(
  templateName: string,
  to: string,
  languageCode: string,
  components?: WhatsAppTemplateComponent[]
): Promise<WhatsAppResult> {
  const config = getConfig();
  const normalizedPhone = normalizePhone(to);

  const message: WhatsAppTemplateMessage = {
    messaging_product: 'whatsapp',
    to: normalizedPhone,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
    },
  };

  if (components && components.length > 0) {
    message.template.components = components;
  }

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`,
      },
      body: JSON.stringify(message),
    });

    const data = (await response.json()) as WhatsAppApiResponse;

    if (!response.ok || data.error) {
      console.error('WhatsApp API error:', data.error);
      return {
        success: false,
        error: data.error?.message || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// MENSAJES DE RESERVA
// ============================================================================

/**
 * Envía confirmación de reserva por WhatsApp
 * Selecciona automáticamente la plantilla según la categoría de la clase
 *
 * Plantillas disponibles:
 * - confirmacion_bailes_sociales (Salsa, Bachata, Kizomba, etc.)
 * - confirmacion_danzas_urbanas (Hip Hop, House, Breaking, etc.)
 * - confirmacion_danza (Ballet, Contemporáneo, Jazz, Entrenamiento)
 * - confirmacion_heels (Heels Dance)
 *
 * Parámetros de todas las plantillas (mismo formato):
 * - {{1}} firstName
 * - {{2}} type (nombre de la clase)
 * - {{3}} fecha_formateada
 * - {{4}} time
 */
export async function sendBookingConfirmationWhatsApp(
  data: BookingWhatsAppData
): Promise<WhatsAppResult> {
  const templateName = CATEGORY_TEMPLATES[data.category];

  return sendTemplate(templateName, data.to, 'es_ES', [
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

/**
 * Envía recordatorio de clase por WhatsApp (48h antes)
 * Este recordatorio es SOLO INFORMATIVO, sin botones de confirmación.
 *
 * Plantilla: recordatorio_prueba_0
 * Parámetros:
 * - {{1}} firstName
 * - {{2}} className
 * - {{3}} classDate (ej: "Lunes 28 de Enero")
 * - {{4}} classTime (ej: "19:00")
 */
export async function sendReminderWhatsApp(data: ReminderWhatsAppData): Promise<WhatsAppResult> {
  return sendTemplate('recordatorio_prueba_0', data.to, 'es_ES', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: data.firstName },
        { type: 'text', text: data.className },
        { type: 'text', text: data.classDate || '' },
        { type: 'text', text: data.classTime || '' },
      ],
    },
  ]);
}

/**
 * Envía recordatorio de clase por WhatsApp (24h antes) CON BOTONES de confirmación
 * Este recordatorio incluye 2 quick reply buttons para confirmar asistencia:
 * - "Sí, asistiré" → El alumno confirma que asistirá
 * - "No podré ir" → El alumno no podrá asistir
 *
 * Las respuestas se procesan en api/webhook-whatsapp.ts
 *
 * Plantilla: recordatorio_prueba_2
 * Parámetros:
 * - {{1}} firstName
 * - {{2}} className
 * - {{3}} classDate (ej: "Lunes 28 de Enero")
 * - {{4}} classTime (ej: "19:00")
 *
 * Quick Reply Buttons:
 * - Button 1: "Sí, asistiré" (payload = "Sí, asistiré")
 * - Button 2: "No podré ir" (payload = "No podré ir")
 */
export async function sendAttendanceReminderWhatsApp(
  data: ReminderWhatsAppData
): Promise<WhatsAppResult> {
  // Usar plantilla recordatorio_prueba_2 con botones de quick reply
  return sendTemplate('recordatorio_prueba_2', data.to, 'es_ES', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: data.firstName },
        { type: 'text', text: data.className },
        { type: 'text', text: data.classDate || '' },
        { type: 'text', text: data.classTime || '' },
      ],
    },
  ]);
}

/**
 * Envía confirmación de cancelación por WhatsApp
 *
 * Plantilla: cancelacion_reserva
 * Parámetros:
 * - {{1}} firstName
 *
 * NOTA: Debes crear esta plantilla en Meta Business Suite antes de usar esta función.
 */
export async function sendCancellationWhatsApp(
  data: CancellationWhatsAppData
): Promise<WhatsAppResult> {
  return sendTemplate('cancelar', data.to, 'es_ES', [
    {
      type: 'body',
      parameters: [{ type: 'text', text: data.firstName }],
    },
  ]);
}

/**
 * Envía mensaje de prueba usando la plantilla hello_world de Meta
 * Esta plantilla viene por defecto en todas las cuentas de WhatsApp Business
 */
export async function sendTestWhatsApp(to: string): Promise<WhatsAppResult> {
  return sendTemplate('hello_world', to, 'en_US');
}

/**
 * Envía mensaje usando plantilla personalizada
 * Útil para probar nuevas plantillas
 */
export async function sendCustomTemplate(
  templateName: string,
  to: string,
  languageCode: string,
  parameters?: string[]
): Promise<WhatsAppResult> {
  const components: WhatsAppTemplateComponent[] | undefined = parameters
    ? [
        {
          type: 'body',
          parameters: parameters.map(text => ({ type: 'text', text })),
        },
      ]
    : undefined;

  return sendTemplate(templateName, to, languageCode, components);
}

// ============================================================================
// MENSAJES DE TEXTO (RESPUESTAS AUTOMÁTICAS)
// ============================================================================

/**
 * Envía un mensaje de texto libre por WhatsApp
 * Usado para respuestas automáticas del webhook
 *
 * NOTA: Solo se puede enviar a usuarios que han iniciado conversación
 * en las últimas 24 horas (ventana de servicio de WhatsApp)
 */
export async function sendTextMessage(to: string, text: string): Promise<WhatsAppResult> {
  const config = getConfig();
  const normalizedPhone = normalizePhone(to);

  const message = {
    messaging_product: 'whatsapp',
    to: normalizedPhone,
    type: 'text',
    text: {
      body: text,
    },
  };

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`,
      },
      body: JSON.stringify(message),
    });

    const data = (await response.json()) as WhatsAppApiResponse;

    if (!response.ok || data.error) {
      console.error('WhatsApp API error (text):', data.error);
      return {
        success: false,
        error: data.error?.message || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    console.error('Error sending WhatsApp text message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// TYPING INDICATOR / READ RECEIPT
// ============================================================================

/**
 * Marca un mensaje como leido (checkmarks azules) via WhatsApp Cloud API.
 * Esto le da feedback al usuario de que Laura "vio" su mensaje.
 *
 * Es fire-and-forget: si falla, no afecta al flujo principal.
 *
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/messages/mark-messages-as-read
 */
export async function sendTypingIndicator(_to: string, messageId: string): Promise<WhatsAppResult> {
  try {
    const config = getConfig();

    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }),
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    // Non-blocking: si falla, no pasa nada (es cosmetico)
    console.warn('[whatsapp] Typing indicator failed (non-blocking):', error);
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
 * Verifica si las credenciales de WhatsApp están configuradas
 */
export function isWhatsAppConfigured(): boolean {
  return !!(process.env['WHATSAPP_TOKEN'] && process.env['WHATSAPP_PHONE_ID']);
}

/**
 * Obtiene información de la configuración (para debugging)
 */
export function getWhatsAppConfigInfo(): {
  hasToken: boolean;
  hasPhoneId: boolean;
  phoneId?: string;
} {
  return {
    hasToken: !!process.env['WHATSAPP_TOKEN'],
    hasPhoneId: !!process.env['WHATSAPP_PHONE_ID'],
    phoneId: process.env['WHATSAPP_PHONE_ID'],
  };
}

/**
 * Obtiene el nombre de la plantilla para una categoría
 */
export function getTemplateForCategory(category: ClassCategory): string {
  return CATEGORY_TEMPLATES[category];
}

/**
 * Lista de todas las categorías disponibles
 */
export const CLASS_CATEGORIES: ClassCategory[] = [
  'bailes_sociales',
  'danzas_urbanas',
  'danza',
  'entrenamiento',
  'heels',
];

/**
 * Mapeo de categorías a nombres legibles (para UI)
 */
export const CATEGORY_LABELS: Record<ClassCategory, string> = {
  bailes_sociales: 'Bailes Sociales',
  danzas_urbanas: 'Danzas Urbanas',
  danza: 'Danza',
  entrenamiento: 'Entrenamiento para Bailarines',
  heels: 'Heels',
};

// ============================================================================
// MENSAJES DE FICHAJE (Sistema de Control de Jornada)
// ============================================================================

/**
 * Datos para notificación de fichaje de entrada
 */
export interface FichajeEntradaData {
  to: string;
  nombreProfesor: string;
  clases: string[];
  horaInicio: string;
}

/**
 * Datos para notificación de fichaje de salida
 */
export interface FichajeSalidaData {
  to: string;
  nombreProfesor: string;
  clases: string[];
  siguienteBloqueHora?: string;
}

/**
 * Datos para confirmación de fichaje
 */
export interface FichajeConfirmacionData {
  to: string;
  nombreProfesor: string;
  tipo: 'entrada' | 'salida';
  hora: string;
  clases: string[];
  duracion?: string;
  siguienteBloqueHora?: string;
}

/**
 * Envía notificación de fichaje de entrada
 * Plantilla: fichaje_entrada1
 * Variables: {{1}}=nombre, {{2}}=hora
 * Mensaje: "Hola {{1}}, tu turno en Farray's Center empieza a las {{2}}h."
 */
export async function sendFichajeEntradaWhatsApp(
  data: FichajeEntradaData
): Promise<WhatsAppResult> {
  return sendTemplate('fichaje_entrada1', data.to, 'es_ES', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: data.nombreProfesor },
        { type: 'text', text: data.horaInicio },
      ],
    },
  ]);
}

/**
 * Envía notificación de fichaje de salida
 * Plantilla: fichaje_salida
 * Variables: {{1}}=nombre
 * Mensaje: "Hola {{1}}, tu turno en Farray's Center ha terminado."
 */
export async function sendFichajeSalidaWhatsApp(data: FichajeSalidaData): Promise<WhatsAppResult> {
  return sendTemplate('fichaje_salida', data.to, 'es_ES', [
    {
      type: 'body',
      parameters: [{ type: 'text', text: data.nombreProfesor }],
    },
  ]);
}

/**
 * Envía confirmación de fichaje registrado
 * Plantilla: fichaje_confirmacion (crear en Meta Business)
 */
export async function sendFichajeConfirmacionWhatsApp(
  data: FichajeConfirmacionData
): Promise<WhatsAppResult> {
  const tipoTexto = data.tipo === 'entrada' ? 'Entrada' : 'Salida';
  const infoAdicional =
    data.tipo === 'salida' && data.duracion
      ? `Tiempo trabajado: ${data.duracion}`
      : data.siguienteBloqueHora
        ? `Siguiente bloque: ${data.siguienteBloqueHora}`
        : '';

  return sendTemplate('fichaje_confirmacion', data.to, 'es_ES', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: tipoTexto },
        { type: 'text', text: data.hora },
        { type: 'text', text: data.clases.join(', ') },
        { type: 'text', text: infoAdicional },
      ],
    },
  ]);
}

/**
 * Payloads de respuesta de fichaje para el webhook
 * Simplificado: un botón por acción (entrada/salida)
 */
export const FICHAJE_PAYLOADS = {
  ENTRADA: 'FICHAJE_ENTRADA',
  SALIDA: 'FICHAJE_SALIDA',
} as const;

export type FichajePayload = (typeof FICHAJE_PAYLOADS)[keyof typeof FICHAJE_PAYLOADS];

// ============================================================================
// MENSAJES DE LEADS (Formulario "Descubre cómo empezar")
// ============================================================================

/**
 * Datos para el mensaje de bienvenida a leads
 */
export interface LeadWelcomeWhatsAppData {
  to: string; // Número con código de país (ej: 34612345678)
  firstName: string;
}

/**
 * Envía mensaje de bienvenida a lead por WhatsApp
 *
 * Plantilla: lead_descubre_empezar
 * Variables: {{1}}=firstName
 * Botón: "Ver Horarios y Reservar" → horarios-precios con UTM
 *
 * IMPORTANTE: Solo enviar si el lead marcó el checkbox de WhatsApp (RGPD)
 */
export async function sendLeadWelcomeWhatsApp(
  data: LeadWelcomeWhatsAppData
): Promise<WhatsAppResult> {
  return sendTemplate('lead_descubre_empezar', data.to, 'es_ES', [
    {
      type: 'body',
      parameters: [{ type: 'text', text: data.firstName }],
    },
  ]);
}

// ============================================================================
// NO-SHOW RESCHEDULE MESSAGE
// ============================================================================

export interface NoShowRescheduleWhatsAppData {
  to: string;
  firstName: string;
  className: string;
  newDate: string;
  newTime: string;
  managementUrl: string;
}

/**
 * Send no-show reschedule notification via WhatsApp.
 *
 * Strategy: Try free-text message first (within 24h window from last reminder).
 * If that fails (window expired, error 131047), fall back to approved template.
 *
 * Template fallback: reprogramacion_no_show (must be approved in Meta Business Manager)
 * Variables: {{1}}=firstName, {{2}}=className, {{3}}=newDate, {{4}}=newTime
 */
export async function sendNoShowRescheduleWhatsApp(
  data: NoShowRescheduleWhatsAppData
): Promise<WhatsAppResult> {
  const freeText = [
    `Hola ${data.firstName} 👋`,
    '',
    `Sentimos que no hayas podido venir a tu clase de ${data.className} hoy.`,
    '',
    `Entendemos que surgen imprevistos, por eso hemos reprogramado tu clase de forma excepcional para el ${data.newDate} a las ${data.newTime} 💃`,
    '',
    '⚠️ Esta reprogramación es por única vez.',
    '',
    `📋 Gestiona tu reserva aquí: ${data.managementUrl}`,
    '',
    '¡Te esperamos! 🎶',
  ].join('\n');

  // Try free-text first (works within 24h window)
  const textResult = await sendTextMessage(data.to, freeText);

  if (textResult.success) {
    return textResult;
  }

  // If free-text failed (likely 24h window expired), try template
  console.warn(
    `[whatsapp] Free-text failed for ${data.to}, trying template fallback:`,
    textResult.error
  );

  try {
    return await sendTemplate('reprogramacion_no_show', data.to, 'es_ES', [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: data.firstName },
          { type: 'text', text: data.className },
          { type: 'text', text: data.newDate },
          { type: 'text', text: data.newTime },
        ],
      },
    ]);
  } catch (e) {
    // Template might not be approved yet - return original error
    console.warn('[whatsapp] Template fallback also failed:', e);
    return textResult;
  }
}
