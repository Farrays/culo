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
import { LAURA_TOOLS, executeTool } from './laura-tools.js';
import { markdownToWhatsApp, splitIntoBubbles } from './whatsapp-formatter.js';
import { sendTypingIndicator, sendTextMessage as sendWhatsAppText } from '../whatsapp.js';

// Tipos
interface AgentInput {
  phone: string;
  text: string;
  contactName?: string;
  channel?: 'whatsapp' | 'web';
  messageId?: string; // WhatsApp message ID para typing indicator
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

  // 0. Marcar como leido (checkmarks azules) - fire and forget
  if (input.messageId && input.channel === 'whatsapp') {
    sendTypingIndicator(phone, input.messageId).catch(() => {});
  }

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
  let memberId: number | undefined;

  const memberLookupEnabled = process.env['ENABLE_MEMBER_LOOKUP'] === 'true';
  console.log(`[agent-simple] Member lookup enabled: ${memberLookupEnabled}`);

  if (memberLookupEnabled) {
    try {
      const memberService = getMemberLookup(redis);
      const lookup = await memberService.lookupByPhone(phone, input.contactName);

      if (lookup.found && lookup.member) {
        memberId = lookup.member.memberId;
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

  // 5. Preparar mensajes para Claude (con soporte para tool_use)
  const messages: Anthropic.MessageParam[] = [
    ...history.map((m): Anthropic.MessageParam => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: text },
  ];

  // 6. Llamar a Claude Sonnet con tools
  try {
    const anthropic = getAnthropicClient();
    const toolsEnabled = process.env['ENABLE_LAURA_TOOLS'] !== 'false';
    const useTools = toolsEnabled && memberId; // Tools only work for identified members

    let currentResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
      ...(useTools ? { tools: LAURA_TOOLS } : {}),
    });

    // 7. Tool use loop (max 3 iterations to stay within 30s Vercel limit)
    const MAX_TOOL_ITERATIONS = 3;
    let iterations = 0;
    const toolContext = { redis, phone, memberId };

    while (currentResponse.stop_reason === 'tool_use' && iterations < MAX_TOOL_ITERATIONS) {
      iterations++;
      const toolUseBlocks = currentResponse.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
      );

      console.log(
        `[agent-simple] Tool use iteration ${iterations}: ${toolUseBlocks.map(t => t.name).join(', ')}`
      );

      // Execute tools and collect results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const toolUse of toolUseBlocks) {
        const result = await executeTool(
          toolUse.name,
          toolUse.input as Record<string, unknown>,
          toolContext
        );
        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: result,
        });
      }

      // Continue conversation with tool results
      messages.push({ role: 'assistant', content: currentResponse.content });
      messages.push({ role: 'user', content: toolResults });

      currentResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages,
        ...(useTools ? { tools: LAURA_TOOLS } : {}),
      });
    }

    // 8. Extract final text response (ignore any remaining tool_use blocks)
    const textBlocks = currentResponse.content.filter(
      (b): b is Anthropic.TextBlock => b.type === 'text'
    );
    const assistantMessage = textBlocks.map(b => b.text).join('');

    // 8b. Convertir markdown de Claude a formato WhatsApp (*bold* en vez de **bold**)
    const formattedForWhatsApp = markdownToWhatsApp(assistantMessage);

    console.log(
      `[agent-simple] Response generated in ${Date.now() - startTime}ms (${iterations} tool calls): "${assistantMessage.slice(0, 50)}..."`
    );

    // 9. Guardar en historial (original de Claude, no el formateado)
    const updatedHistory: ConversationMessage[] = [
      ...history,
      { role: 'user', content: text },
      { role: 'assistant', content: assistantMessage },
    ];
    await saveConversationHistory(redis, phone, updatedHistory);

    // 10. Escalacion a humano (si esta activado)
    const finalResponse = formattedForWhatsApp;
    const additionalMessages: string[] = [];

    if (process.env['ENABLE_ESCALATION'] === 'true') {
      try {
        const escalation = await checkAndEscalate(redis, {
          userPhone: phone,
          userMessage: text,
          lauraResponse: formattedForWhatsApp,
          conversationHistory: updatedHistory,
          language,
          channel: input.channel || 'whatsapp',
        });
        if (escalation.escalated) {
          console.log(
            `[agent-simple] Escalated (${escalation.type || 'unknown'}): ${escalation.caseId}`
          );

          if (escalation.type === 'IMMEDIATE' && escalation.escalationMessage) {
            // Enfado: mantener respuesta de Laura + anadir aviso como 2a burbuja
            additionalMessages.push(escalation.escalationMessage);
            console.log(`[agent-simple] IMMEDIATE escalation - adding ticket message`);
          }
          // OFFER: Laura ya dice "contacta en info@..." - no reemplazar su respuesta
          // El email al equipo se envio en background
        }
      } catch (escalationError) {
        // Si falla la escalacion, no afecta la respuesta
        console.error('[agent-simple] Escalation error (non-blocking):', escalationError);
      }
    }

    // 11. Dividir en burbujas para WhatsApp (estrategia "last-bubble")
    const mainBubbles = splitIntoBubbles(finalResponse);
    const allBubbles = [...mainBubbles, ...additionalMessages].filter(m => m.trim().length > 0);

    if (allBubbles.length > 1 && input.channel === 'whatsapp') {
      // Enviar todas las burbujas menos la ultima desde aqui
      for (let i = 0; i < allBubbles.length - 1; i++) {
        await sendWhatsAppText(phone, allBubbles[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      // Retornar la ultima para que webhook la envie (flujo normal)
      console.log(
        `[agent-simple] Sent ${allBubbles.length - 1} bubbles, returning last for webhook`
      );
      return {
        text: allBubbles[allBubbles.length - 1],
        language,
      };
    }

    return {
      text: allBubbles[0] || finalResponse,
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
