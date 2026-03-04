/**
 * OpenAI Client - GPT-4.1-mini for simple queries
 *
 * Handles simple conversational queries (greetings, FAQs, info)
 * that don't need tool_use. Uses the same LAURA_PROMPT.md system prompt
 * as Claude for consistent personality.
 *
 * Cost: $0.40/$1.60 per M tokens (vs Claude Sonnet $3/$15)
 */

import OpenAI from 'openai';

// Singleton client
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI(); // uses OPENAI_API_KEY from env
  }
  return openaiClient;
}

/**
 * Generate a simple text response with GPT-4.1-mini.
 * No tools — text only. Same system prompt as Claude for consistent Laura personality.
 *
 * @throws if OpenAI API fails (caller should fallback to Claude)
 */
/**
 * Guardrail appended to GPT system prompt.
 * GPT has NO tools, so it must never list specific classes, times, or URLs.
 * If someone asks about classes, tell them to wait while you check (returns empty → falls back to Claude).
 */
const GPT_GUARDRAIL = `

RESTRICCION CRITICA (GPT sin herramientas):
- NO tienes acceso a herramientas. NO puedes consultar horarios, clases ni disponibilidad.
- NUNCA menciones nombres de clases concretas, horarios especificos, dias, profesores ni URLs de reserva.
- Si el usuario pregunta por una clase, estilo de baile, horario, disponibilidad o quiere reservar: responde EXACTAMENTE "Déjame buscar las opciones disponibles para ti..." y NADA MAS.
- Solo puedes responder preguntas generales: saludos, ubicacion, como llegar, preguntas frecuentes, info general de la escuela.
- Si no estas seguro de si necesitas datos de herramientas, responde "Déjame buscar las opciones disponibles para ti..." y NADA MAS.`;

export async function generateSimpleResponse(params: {
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    max_tokens: 400,
    temperature: 0.2,
    messages: [
      { role: 'system', content: params.systemPrompt + GPT_GUARDRAIL },
      ...params.messages,
    ],
  });

  const text = response.choices[0]?.message?.content || '';

  // If GPT deferred to tools (guardrail triggered), return empty to fall back to Claude
  if (text.includes('Déjame buscar') || text.includes('Dejame buscar')) {
    return '';
  }

  return text;
}
