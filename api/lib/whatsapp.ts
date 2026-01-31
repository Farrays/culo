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
  danzas_urbanas: 'confirmacion_danzas_urbanas',
  danza: 'confirmacion_danza',
  entrenamiento: 'confirmacion_danza', // Usa misma plantilla que danza
  heels: 'confirmacion_heels',
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
  classDateTime: string; // Fecha y hora combinadas: "17/07/2025, 19:00"
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
 * Normaliza número de teléfono para WhatsApp
 * Elimina espacios, guiones y el + inicial
 */
function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-+]/g, '');
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
 *
 * Plantilla: recordatorio_prueba_0
 * Parámetros:
 * - {{1}} firstName
 * - {{2}} className
 * - {{3}} dateTime (fecha y hora combinadas, ej: "17/07/2025, 19:00")
 */
export async function sendReminderWhatsApp(data: ReminderWhatsAppData): Promise<WhatsAppResult> {
  return sendTemplate('recordatorio_prueba_0', data.to, 'es_ES', [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: data.firstName },
        { type: 'text', text: data.className },
        { type: 'text', text: data.classDateTime },
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
