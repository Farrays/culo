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
  }
): string {
  const basePrompt = loadLauraPrompt();

  // Instrucciones de idioma
  const langInstructions: Record<SupportedLanguage, string> = {
    es: 'Responde SIEMPRE en español de España (vale, genial, mola).',
    ca: 'Responde SIEMPRE en català.',
    en: 'Responde SIEMPRE en inglés.',
    fr: 'Responde SIEMPRE en francés.',
  };

  let fullPrompt = `${basePrompt}

================================================================================
INSTRUCCIONES DE IDIOMA
================================================================================
${langInstructions[lang]}`;

  // Añadir contexto según tipo de usuario
  if (!memberContext) {
    const membershipUrl = `www.farrayscenter.com/${lang}/hazte-socio`;

    fullPrompt += `

================================================================================
USUARIO NUEVO (no registrado en Momence)
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

  if (memberContext?.isExistingMember) {
    const memberInfo = [];
    if (memberContext.firstName) {
      memberInfo.push(`Nombre: ${memberContext.firstName}`);
    }

    // Siempre mostrar los créditos, aunque sean 0
    const credits = memberContext.creditsAvailable ?? 0;
    memberInfo.push(`Créditos disponibles: ${credits}`);

    if (memberContext.hasActiveMembership) {
      memberInfo.push(`Estado: miembro ACTIVO`);
      if (memberContext.membershipName) {
        memberInfo.push(`Membresía: ${memberContext.membershipName}`);
      }
    } else {
      memberInfo.push(`Estado: sin membresía activa`);
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
