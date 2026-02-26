/**
 * Laura System Prompt Loader
 *
 * Carga el system prompt completo desde api/LAURA_PROMPT.md
 * Este archivo contiene TODA la información que Laura necesita:
 * - Datos del centro
 * - Precios
 * - Horarios
 * - Estilos de baile
 * - Profesores
 * - Políticas
 * - FAQs
 *
 * El prompt está diseñado para ser editado directamente en el archivo MD
 * sin necesidad de tocar código.
 *
 * IMPORTANTE: El archivo está en /api/ para que Vercel lo incluya en el bundle.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { SupportedLanguage } from './language-detector.js';

// Cache del prompt para no leerlo en cada request
let cachedPrompt: string | null = null;
let lastLoadTime = 0;
const CACHE_TTL_MS = 60 * 1000; // Recargar cada 1 minuto en dev

/**
 * Carga el system prompt desde api/LAURA_PROMPT.md
 * Con cache para evitar lecturas repetidas
 */
export function loadLauraPrompt(): string {
  const now = Date.now();

  // Usar cache si no ha expirado
  if (cachedPrompt && now - lastLoadTime < CACHE_TTL_MS) {
    return cachedPrompt;
  }

  try {
    // El archivo está en api/LAURA_PROMPT.md (junto al código para que Vercel lo incluya)
    // Usamos __dirname para obtener la ruta relativa al archivo actual
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    // Subimos 2 niveles: lib/ai/ -> lib/ -> api/
    const promptPath = join(__dirname, '..', '..', 'LAURA_PROMPT.md');
    const rawContent = readFileSync(promptPath, 'utf-8');

    // Limpiar el contenido: quitar el header de comentarios y el separador ---
    const cleanedContent = rawContent
      // Quitar la cabecera del archivo (hasta el primer ---)
      .replace(/^# LAURA - System Prompt[\s\S]*?---\n\n/, '')
      // Quitar formato markdown que no queremos en el prompt
      .replace(/\*\*/g, '') // Quitar negritas **texto**
      .replace(/^###?\s+/gm, '') // Quitar headers ### y ##
      .replace(/^\| .+\|$/gm, line => {
        // Convertir tablas a texto simple
        return line
          .split('|')
          .filter(cell => cell.trim())
          .map(cell => cell.trim())
          .join(' - ');
      })
      .replace(/^\|[-:]+\|$/gm, '') // Quitar líneas de separación de tabla
      .replace(
        /^---$/gm,
        '================================================================================'
      )
      .trim();

    cachedPrompt = cleanedContent;
    lastLoadTime = now;

    console.log(`[laura-prompt] Loaded system prompt (${cleanedContent.length} chars)`);
    return cleanedContent;
  } catch (error) {
    console.error('[laura-prompt] Error loading prompt file:', error);

    // Fallback a prompt mínimo si falla la carga
    return `Eres Laura, asistente virtual de Farray's International Dance Center en Barcelona.
Responde en el idioma del usuario. Si no sabes algo, di que contacten a info@farrayscenter.com`;
  }
}

/**
 * Construye el system prompt completo con contexto adicional
 */
export function getFullSystemPrompt(
  lang: SupportedLanguage,
  memberContext?: {
    isExistingMember: boolean;
    firstName?: string;
    hasActiveMembership?: boolean;
    creditsAvailable?: number;
    membershipName?: string;
  },
  trialContext?: {
    hasTrialBooking: boolean;
    className?: string;
    classDate?: string;
    classTime?: string;
    status?: string;
    canCancel?: boolean;
    canReschedule?: boolean;
  }
): string {
  const basePrompt = loadLauraPrompt();

  // Fecha y hora actual en Madrid (siempre zona horaria de España)
  const now = new Date();
  const madridDate = now.toLocaleDateString('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const madridTime = now.toLocaleTimeString('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
  });
  const madridISODate = now.toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' });

  // Instrucciones de idioma
  const langInstructions: Record<SupportedLanguage, string> = {
    es: 'Responde SIEMPRE en español de España (vale, genial, mola).',
    ca: 'Responde SIEMPRE en català.',
    en: 'Responde SIEMPRE en inglés.',
    fr: 'Responde SIEMPRE en francés.',
  };

  let fullPrompt = `${basePrompt}

================================================================================
FECHA Y HORA ACTUAL (Madrid, España)
================================================================================
Hoy es ${madridDate}.
Hora actual: ${madridTime}.
Fecha ISO: ${madridISODate}.
IMPORTANTE: Usa SIEMPRE esta fecha y hora como referencia. NO inventes ni asumas otro día u hora.

================================================================================
INSTRUCCIONES DE IDIOMA
================================================================================
${langInstructions[lang]}`;

  // Añadir contexto según tipo de usuario
  // Árbol de decisión: trial > miembro real > nuevo/lapsed
  const isRealMember =
    memberContext?.isExistingMember &&
    (memberContext.hasActiveMembership || (memberContext.creditsAvailable ?? 0) > 0);

  if (trialContext?.hasTrialBooking) {
    // RAMA 1: TRIAL USER (con o sin memberContext — reservar.ts crea miembros en Momence)
    const statusLabel = trialContext.status === 'confirmed' ? 'Confirmada' : trialContext.status;
    fullPrompt += `

================================================================================
USUARIO CON CLASE DE PRUEBA RESERVADA
================================================================================
IMPORTANTE: Este usuario reservó su primera clase GRATIS a través de nuestra web.
Aunque aparezca en Momence, NO es un miembro de pago. Trátalo como LEAD.

Datos de la reserva:
- Clase: ${trialContext.className}
- Fecha: ${trialContext.classDate}
- Hora: ${trialContext.classTime}
- Estado: ${statusLabel}
- Puede cancelar: ${trialContext.canCancel ? 'Sí' : 'No'}
- Puede reprogramar: ${trialContext.canReschedule ? 'Sí (1 vez)' : 'No (ya reprogramó)'}
${memberContext?.firstName ? `- Nombre: ${memberContext.firstName}` : ''}

INSTRUCCIONES (PRIORIDAD ABSOLUTA):
- Su clase es GRATIS. NUNCA le pidas que pague ni le compartas class_url
- Para gestionar su reserva → usa manage_trial_booking
- Si quiere cancelar → action='cancel'
- Si quiere cambiar de día → action='reschedule_next_week'
- Si quiere info de su reserva → action='check_status'
- Si canceló y quiere reservar otra → comparte: www.farrayscenter.com/${lang}/reservas
- Para consultar horarios → get_weekly_schedule o search_upcoming_classes
- NO uses herramientas de miembro (get_member_info, create_booking, cancel_booking, etc.)
- NUNCA le compartas enlaces de pago de Momence (class_url). Solo booking_url o el widget de reservas
- NO digas "no te tengo en la base de datos". Trata con naturalidad

Políticas de cancelación:
- Cancelar >= 2h antes de la clase: sin penalización, puede volver a reservar
- Cancelar < 2h antes: se considera cancelación tardía
- Reprogramación: máximo 1 vez, misma clase, semana siguiente`;
  } else if (isRealMember && memberContext) {
    // RAMA 2: MIEMBRO REAL (membresía activa o créditos > 0)
    const memberInfo = [];
    if (memberContext.firstName) {
      memberInfo.push(`Nombre: ${memberContext.firstName}`);
    }

    const credits = memberContext.creditsAvailable ?? 0;
    memberInfo.push(`Créditos disponibles: ${credits}`);

    if (memberContext.hasActiveMembership) {
      memberInfo.push(`Estado: miembro ACTIVO`);
      if (memberContext.membershipName) {
        memberInfo.push(`Membresía: ${memberContext.membershipName}`);
      }
    }

    fullPrompt += `

================================================================================
INFORMACIÓN DEL USUARIO (datos de Momence)
================================================================================
${memberInfo.join('\n')}

INSTRUCCIONES PARA ESTE USUARIO:
- NO le ofrezcas clase de prueba gratis (ya es miembro registrado)
- Si pregunta por créditos, DEBES decirle: "Tienes ${credits} créditos disponibles"
- Si quiere reservar y tiene créditos, puede usarlos
- Si tiene 0 créditos, sugiérele comprar un bono o pack de clases
- Sé familiar: usa su nombre, "Hola de nuevo!", "¿Qué tal?"`;
  } else {
    // RAMA 3: NUEVO USUARIO o LAPSED (sin trial, sin membresía activa)
    const membershipUrl = `www.farrayscenter.com/${lang}/hazte-socio`;

    fullPrompt += `

================================================================================
USUARIO NUEVO (no registrado o sin membresía activa)
================================================================================
Usuario NO miembro. Tienes herramientas para buscar clases.

SEGMENTACIÓN (si no queda claro de la conversación, pregunta si vive en Barcelona):
- LOCALES → booking_url (prueba gratis). Si is_within_24h=true: siguiente clase gratis o esta de pago (class_url)
- TURISTAS → class_url (pago). Sin restricción 24h
- QUIERE SER SOCIO → ${membershipUrl}

CONDICIONES PRUEBA GRATIS: 1 por persona, solo locales, mínimo 24h antelación.

NO digas "no te tengo en la base de datos". Trata con naturalidad.

GESTIÓN DE RESERVAS DE PRUEBA:
Si el usuario ya tiene una reserva de prueba y quiere consultarla, cancelarla o cambiar de día:
1. Usa manage_trial_booking con action='check_status' para verificar su reserva
2. Confirma con el usuario qué quiere hacer
3. Para cancelar: action='cancel'
4. Para cambiar de día: action='reschedule_next_week' (se reprograma a la misma clase la semana siguiente)
5. La reprogramación solo se permite UNA vez por reserva

Políticas de cancelación:
- Cancelar >= 2h antes de la clase: sin penalización, puede volver a reservar
- Cancelar < 2h antes: se considera cancelación tardía
- Reprogramación: máximo 1 vez, misma clase, semana siguiente`;
  }

  return fullPrompt;
}

/**
 * Invalida la cache (útil para tests o hot reload)
 */
export function invalidatePromptCache(): void {
  cachedPrompt = null;
  lastLoadTime = 0;
}
