/**
 * LAURA 2.0 - Agente Simple
 *
 * Agente minimalista que usa Claude Sonnet con el system prompt completo.
 * Sin routing complejo, sin máquinas de estado, solo prompt + Claude.
 *
 * El prompt se carga desde api/LAURA_PROMPT.md
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Redis } from '@upstash/redis';
import { detectLanguage, type SupportedLanguage } from './language-detector.js';
import { getFullSystemPrompt } from './laura-system-prompt.js';
import { checkAndEscalate } from './escalation-service.js';
import { getMemberLookup } from './member-lookup.js';

// Tipos
interface AgentInput {
  phone: string;
  text: string;
  contactName?: string;
  channel?: 'whatsapp' | 'web';
}

interface AgentResponse {
  text: string;
  language: SupportedLanguage;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Cliente Anthropic (singleton)
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic();
  }
  return anthropicClient;
}

// ============================================================================
// HISTORIAL DE CONVERSACIÓN (Redis)
// ============================================================================

async function getConversationHistory(redis: Redis, phone: string): Promise<ConversationMessage[]> {
  try {
    const key = `conv:${phone}`;
    const data = await redis.get(key);
    if (data) {
      // Upstash puede devolver objeto ya parseado o string
      if (typeof data === 'object') {
        return data as ConversationMessage[];
      }
      return JSON.parse(data as string);
    }
  } catch (error) {
    console.error('[agent-simple] Error getting conversation history:', error);
  }
  return [];
}

async function saveConversationHistory(
  redis: Redis,
  phone: string,
  messages: ConversationMessage[]
): Promise<void> {
  try {
    const key = `conv:${phone}`;
    // Mantener últimos 20 mensajes, TTL 90 días
    const recent = messages.slice(-20);
    await redis.set(key, JSON.stringify(recent), { ex: 90 * 24 * 60 * 60 });
  } catch (error) {
    console.error('[agent-simple] Error saving conversation history:', error);
  }
}

// ============================================================================
// PROCESAMIENTO DE MENSAJES
// ============================================================================

export async function processSimpleMessage(
  redis: Redis,
  input: AgentInput
): Promise<AgentResponse> {
  const startTime = Date.now();
  const { phone, text } = input;

  console.log(
    `[agent-simple] Processing message from ${phone.slice(-4)}: "${text.slice(0, 50)}..."`
  );

  // 1. Detectar idioma
  const language = detectLanguage(text);
  console.log(`[agent-simple] Detected language: ${language}`);

  // 2. Buscar si es miembro existente (si está activado)
  let memberContext:
    | {
        isExistingMember: boolean;
        firstName?: string;
        hasActiveMembership?: boolean;
        creditsAvailable?: number;
        membershipName?: string;
      }
    | undefined;

  const memberLookupEnabled = process.env['ENABLE_MEMBER_LOOKUP'] === 'true';
  console.log(`[agent-simple] Member lookup enabled: ${memberLookupEnabled}`);

  if (memberLookupEnabled) {
    try {
      const memberService = getMemberLookup(redis);
      const lookup = await memberService.lookupByPhone(phone);

      if (lookup.found && lookup.member) {
        // Obtener info de membresía
        const membershipInfo = await memberService.fetchMembershipInfo(lookup.member.memberId);

        memberContext = {
          isExistingMember: true,
          firstName: lookup.member.firstName,
          hasActiveMembership: membershipInfo.hasActiveMembership,
          creditsAvailable: membershipInfo.creditsAvailable,
          membershipName: membershipInfo.membershipName,
        };

        console.log(
          `[agent-simple] ✅ Member context built: name=${lookup.member.firstName}, credits=${membershipInfo.creditsAvailable}, hasActive=${membershipInfo.hasActiveMembership}, membership=${membershipInfo.membershipName || 'none'}`
        );
      } else {
        console.log(`[agent-simple] Member not found for phone: ${phone.slice(-4)}`);
      }
    } catch (lookupError) {
      // Si falla el lookup, continuamos sin contexto de miembro
      console.error('[agent-simple] Member lookup error (non-blocking):', lookupError);
    }
  }

  // 3. Cargar system prompt desde LAURA_PROMPT.md (con contexto de miembro si existe)
  const systemPrompt = getFullSystemPrompt(language, memberContext);

  // 4. Obtener historial de conversación
  const history = await getConversationHistory(redis, phone);

  // 5. Preparar mensajes para Claude
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...history,
    { role: 'user' as const, content: text },
  ];

  // 6. Llamar a Claude Sonnet
  try {
    const anthropic = getAnthropicClient();

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: messages,
    });

    // 7. Extraer respuesta
    const firstBlock = response.content[0];
    const assistantMessage = firstBlock && firstBlock.type === 'text' ? firstBlock.text : '';

    console.log(
      `[agent-simple] Response generated in ${Date.now() - startTime}ms: "${assistantMessage.slice(0, 50)}..."`
    );

    // 8. Guardar en historial
    const updatedHistory: ConversationMessage[] = [
      ...history,
      { role: 'user', content: text },
      { role: 'assistant', content: assistantMessage },
    ];
    await saveConversationHistory(redis, phone, updatedHistory);

    // 9. Escalación a humano (si está activado)
    let finalResponse = assistantMessage;
    if (process.env['ENABLE_ESCALATION'] === 'true') {
      try {
        const escalation = await checkAndEscalate(redis, {
          userPhone: phone,
          userMessage: text,
          lauraResponse: assistantMessage,
          conversationHistory: updatedHistory,
          language,
          channel: input.channel || 'whatsapp',
        });
        if (escalation.escalated) {
          console.log(`[agent-simple] 🚨 Escalated to team: ${escalation.caseId}`);
          // Usar el mensaje de escalación si está disponible
          if (escalation.escalationMessage) {
            finalResponse = escalation.escalationMessage;
            console.log(`[agent-simple] 📧 Escalation email sent, response replaced`);
          }
        }
      } catch (escalationError) {
        // Si falla la escalación, no afecta la respuesta
        console.error('[agent-simple] Escalation error (non-blocking):', escalationError);
      }
    }

    return {
      text: finalResponse,
      language,
    };
  } catch (error) {
    console.error('[agent-simple] Claude API error:', error);

    // Mensaje de fallback
    const fallbackMessages: Record<SupportedLanguage, string> = {
      es: 'Perdona, ha habido un problemilla técnico. ¿Me puedes repetir eso? O si prefieres, escríbenos a info@farrayscenter.com',
      ca: 'Perdona, hi ha hagut un problemeta tècnic. Em pots repetir això? O si prefereixes, escriu-nos a info@farrayscenter.com',
      en: 'Sorry, there was a technical issue. Can you repeat that? Or you can email us at info@farrayscenter.com',
      fr: 'Désolé, il y a eu un problème technique. Peux-tu répéter? Ou écris-nous à info@farrayscenter.com',
    };

    return {
      text: fallbackMessages[language],
      language,
    };
  }
}

/**
 * Wrapper para mantener compatibilidad con el webhook actual
 */
export async function processAgentMessage(redis: Redis, input: AgentInput): Promise<AgentResponse> {
  return processSimpleMessage(redis, input);
}
