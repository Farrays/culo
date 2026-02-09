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

  // 2. Cargar system prompt desde LAURA_PROMPT.md
  const systemPrompt = getFullSystemPrompt(language);

  // 3. Obtener historial de conversación
  const history = await getConversationHistory(redis, phone);

  // 4. Preparar mensajes para Claude
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
    ...history,
    { role: 'user' as const, content: text },
  ];

  // 5. Llamar a Claude Sonnet
  try {
    const anthropic = getAnthropicClient();

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: messages,
    });

    // 6. Extraer respuesta
    const firstBlock = response.content[0];
    const assistantMessage = firstBlock && firstBlock.type === 'text' ? firstBlock.text : '';

    console.log(
      `[agent-simple] Response generated in ${Date.now() - startTime}ms: "${assistantMessage.slice(0, 50)}..."`
    );

    // 7. Guardar en historial
    const updatedHistory: ConversationMessage[] = [
      ...history,
      { role: 'user', content: text },
      { role: 'assistant', content: assistantMessage },
    ];
    await saveConversationHistory(redis, phone, updatedHistory);

    return {
      text: assistantMessage,
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
