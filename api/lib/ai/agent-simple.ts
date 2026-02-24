/**
 * LAURA 2.0 - Agente Simple (Hybrid Model)
 *
 * Routes messages to the best model:
 * - Simple queries (greetings, FAQs, info) → GPT-4.1-mini (cheap)
 * - Complex queries (bookings, member ops, schedules) → Claude Sonnet (tool_use)
 *
 * Controlled by LAURA_MODEL_ROUTING env var:
 * - 'anthropic' (default): all messages go to Claude Sonnet
 * - 'hybrid': simple → GPT-4.1-mini, complex → Claude Sonnet
 *
 * El prompt se carga desde api/LAURA_PROMPT.md
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Redis } from '@upstash/redis';
import { detectLanguage, type SupportedLanguage } from './language-detector.js';
import { getFullSystemPrompt } from './laura-system-prompt.js';
import { checkAndEscalate } from './escalation-service.js';
import { getMemberLookup } from './member-lookup.js';
import { LAURA_TOOLS_MEMBER, LAURA_TOOLS_NEW_USER, executeTool } from './laura-tools.js';
import { markdownToWhatsApp, splitIntoBubbles } from './whatsapp-formatter.js';
import { sendTypingIndicator, sendTextMessage as sendWhatsAppText } from '../whatsapp.js';
import { classifyQuery } from './query-classifier.js';
import { generateSimpleResponse } from './openai-client.js';

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

/**
 * Wrapper around Anthropic messages.create with retry on 429 (rate limit).
 * Waits for retry-after header value (or 5s fallback) and retries once.
 */
async function createMessageWithRetry(
  params: Anthropic.MessageCreateParamsNonStreaming
): Promise<Anthropic.Message> {
  const anthropic = getAnthropicClient();
  try {
    return await anthropic.messages.create(params);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      // Extract retry-after from headers (seconds) or default to 5s
      const retryAfterRaw = error.headers?.get?.('retry-after');
      const retryAfter = (retryAfterRaw ? Number(retryAfterRaw) : 0) || 5;
      const waitMs = Math.min(retryAfter * 1000, 15000); // cap at 15s
      console.warn(`[agent-simple] 429 rate limit hit, retrying in ${waitMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitMs));
      return await anthropic.messages.create(params);
    }
    throw error;
  }
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
// POST-RESPONSE HANDLER (shared by GPT and Claude paths)
// ============================================================================

async function handleResponse(params: {
  assistantMessage: string;
  history: ConversationMessage[];
  text: string;
  phone: string;
  redis: Redis;
  language: SupportedLanguage;
  input: AgentInput;
  startTime: number;
  model: string;
  iterations: number;
}): Promise<AgentResponse> {
  const {
    assistantMessage,
    history,
    text,
    phone,
    redis,
    language,
    input,
    startTime,
    model,
    iterations,
  } = params;

  // Format for WhatsApp
  const formattedForWhatsApp = markdownToWhatsApp(assistantMessage);

  console.log(
    `[agent-simple] [${model}] Response in ${Date.now() - startTime}ms (${iterations} tool calls): "${assistantMessage.slice(0, 50)}..."`
  );

  // Save to history (original, not formatted)
  const updatedHistory: ConversationMessage[] = [
    ...history,
    { role: 'user', content: text },
    { role: 'assistant', content: assistantMessage },
  ];
  await saveConversationHistory(redis, phone, updatedHistory);

  // Escalation check
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
          additionalMessages.push(escalation.escalationMessage);
          console.log(`[agent-simple] IMMEDIATE escalation - adding ticket message`);
        }
      }
    } catch (escalationError) {
      console.error('[agent-simple] Escalation error (non-blocking):', escalationError);
    }
  }

  // Split into WhatsApp bubbles
  const mainBubbles = splitIntoBubbles(finalResponse);
  const allBubbles = [...mainBubbles, ...additionalMessages].filter(m => m.trim().length > 0);

  if (allBubbles.length > 1 && input.channel === 'whatsapp') {
    for (let i = 0; i < allBubbles.length - 1; i++) {
      const bubble = allBubbles[i] ?? '';
      await sendWhatsAppText(phone, bubble);
      const nextLen = allBubbles[i + 1]?.length || 100;
      const typingDelay = Math.min(Math.max(nextLen * 15, 1500), 4000);
      await new Promise(resolve => setTimeout(resolve, typingDelay));
    }
    console.log(`[agent-simple] Sent ${allBubbles.length - 1} bubbles, returning last for webhook`);
    const lastBubble = allBubbles[allBubbles.length - 1] ?? finalResponse;
    return { text: lastBubble, language };
  }

  return {
    text: allBubbles[0] || finalResponse,
    language,
  };
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

  // 2b. Si no es miembro, buscar si tiene reserva de clase de prueba
  let trialContext:
    | {
        hasTrialBooking: boolean;
        className?: string;
        classDate?: string;
        classTime?: string;
        status?: string;
        canCancel?: boolean;
        canReschedule?: boolean;
      }
    | undefined;

  if (!memberContext) {
    try {
      const normalizedPhone = phone.replace(/[\s\-+()]/g, '');
      const eventId = (await redis.get(`phone:${normalizedPhone}`)) as string | null;

      if (eventId) {
        const booking = (await redis.get(`booking_details:${eventId}`)) as Record<
          string,
          unknown
        > | null;

        if (booking && booking['status'] !== 'cancelled') {
          trialContext = {
            hasTrialBooking: true,
            className: booking['className'] as string,
            classDate: booking['classDate'] as string,
            classTime: booking['classTime'] as string,
            status: booking['status'] as string,
            canCancel: booking['status'] !== 'cancelled',
            canReschedule:
              ((booking['rescheduleCount'] as number) || 0) < 1 && !booking['rescheduledFrom'],
          };
          console.log(
            `[agent-simple] 🎫 Trial booking found: ${booking['className']} on ${booking['classDate']}`
          );
        }
      }
    } catch (trialError) {
      console.error('[agent-simple] Trial lookup error (non-blocking):', trialError);
    }
  }

  // 3. Cargar system prompt desde LAURA_PROMPT.md (con contexto de miembro si existe)
  const systemPrompt = getFullSystemPrompt(language, memberContext, trialContext);

  // 4. Obtener historial de conversación
  const history = await getConversationHistory(redis, phone);

  // 5. Hybrid routing: GPT-4.1-mini for simple, Claude Sonnet for tools
  const modelRouting = process.env['LAURA_MODEL_ROUTING'] || 'anthropic';
  const queryComplexity = modelRouting === 'hybrid' ? classifyQuery(text) : 'needs_tools';

  console.log(`[agent-simple] Routing: mode=${modelRouting}, complexity=${queryComplexity}`);

  // 5a. GPT-4.1-mini path (simple queries, no tools)
  if (queryComplexity === 'simple') {
    try {
      const gptResponse = await generateSimpleResponse({
        systemPrompt,
        messages: [
          ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
          { role: 'user' as const, content: text },
        ],
      });

      if (gptResponse) {
        return handleResponse({
          assistantMessage: gptResponse,
          history,
          text,
          phone,
          redis,
          language,
          input,
          startTime,
          model: 'gpt-4.1-mini',
          iterations: 0,
        });
      }
      // Empty response → fall through to Claude
      console.warn('[agent-simple] GPT returned empty response, falling back to Claude');
    } catch (gptError) {
      console.error('[agent-simple] GPT error, falling back to Claude:', gptError);
      // Fall through to Claude Sonnet
    }
  }

  // 5b. Claude Sonnet path (complex queries with tool_use)
  const messages: Anthropic.MessageParam[] = [
    ...history.map((m): Anthropic.MessageParam => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: text },
  ];

  try {
    const toolsEnabled = process.env['ENABLE_LAURA_TOOLS'] !== 'false';
    const useTools = toolsEnabled;
    const toolSet = memberId ? LAURA_TOOLS_MEMBER : LAURA_TOOLS_NEW_USER;

    let currentResponse = await createMessageWithRetry({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages,
      ...(useTools ? { tools: toolSet } : {}),
    });

    // Tool use loop (max 3 iterations to stay within 30s Vercel limit)
    const MAX_TOOL_ITERATIONS = 3;
    let iterations = 0;
    const toolContext = { redis, phone, memberId, lang: language };

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

      currentResponse = await createMessageWithRetry({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages,
        ...(useTools ? { tools: toolSet } : {}),
      });
    }

    // Extract final text response
    const textBlocks = currentResponse.content.filter(
      (b): b is Anthropic.TextBlock => b.type === 'text'
    );
    const assistantMessage = textBlocks.map(b => b.text).join('');

    return handleResponse({
      assistantMessage,
      history,
      text,
      phone,
      redis,
      language,
      input,
      startTime,
      model: 'claude-sonnet',
      iterations,
    });
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
