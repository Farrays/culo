/**
 * Escalation Service - Notifica al equipo cuando Laura no puede responder
 *
 * Cuando Laura dice "tendría que confirmarlo con el equipo", este servicio:
 * 1. Envía un email a info@farrayscenter.com con el contexto
 * 2. Guarda el caso en Redis para analytics
 * 3. Permite hacer seguimiento de preguntas no respondidas
 *
 * @see ENTERPRISE_AGENT_PLAN.md
 */

import type { Redis } from '@upstash/redis';
import { getAgentMetrics } from './agent-metrics.js';

// ============================================================================
// TYPES
// ============================================================================

export interface EscalationCase {
  id: string;
  timestamp: string;
  userPhone: string;
  userMessage: string;
  lauraResponse: string;
  conversationContext: string[];
  language: string;
  channel: 'whatsapp' | 'instagram' | 'web';
  status: 'pending' | 'resolved' | 'ignored';
  resolvedBy?: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface EscalationStats {
  totalCases: number;
  pendingCases: number;
  resolvedCases: number;
  topQuestions: { question: string; count: number }[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Frases que indican que Laura no supo responder
// IMPORTANTE: Deben coincidir con lo que dice LAURA_PROMPT.md
const ESCALATION_TRIGGERS = [
  // Español - coincide con el prompt: "Tendría que confirmarlo, contacta en info@"
  'tendría que confirmarlo',
  'tendria que confirmarlo',
  'tendría que confirmártelo',
  'tendria que confirmartelo',
  // Catalán
  'hauria de confirmar-ho',
  "m'ho hauria de confirmar",
  // Inglés
  'i would need to confirm',
  'would need to check with',
  // Francés
  'je devrais confirmer',
  'il faudrait confirmer',
  // Frases adicionales de "no sé"
  'no tengo esa información',
  'no tinc aquesta informació',
  "i don't have that information",
  "je n'ai pas cette information",
  // CATCH-ALL: cualquier respuesta que redirija al email de contacto
  'info@farrayscenter.com',
  'escríbeles a info@',
  'escribeles a info@',
  'contacta en info@',
  'escriu a info@',
  'email us at info@',
  'contact us at info@',
];

// Frases que indican enfado o frustración del usuario -> ESCALAR A HUMANO
const ANGRY_USER_TRIGGERS = [
  // Español - enfado directo (con variantes comunes de escritura)
  'estoy enfadado',
  'estoy enfadada',
  'estoy enfado', // variante sin 'a'
  'estoy muy enfadado',
  'estoy muy enfadada',
  'estoy muy enfado', // variante sin 'a'
  'muy enfadado',
  'muy enfadada',
  'muy enfado',
  'estoy cabreado',
  'estoy cabreada',
  'estoy molesto',
  'estoy molesta',
  'estoy furioso',
  'estoy furiosa',
  'me he enfadado',
  'enfadado contigo',
  'enfadada contigo',
  // Español - petición de humano
  'quiero hablar con una persona',
  'quiero hablar con alguien',
  'pasame con un humano',
  'pásame con un humano',
  'hablar con un responsable',
  // Español - frustración
  'esto es una mierda',
  'estoy harto',
  'estoy harta',
  'me voy a dar de baja',
  'voy a cancelar',
  'no me sirve',
  'no funciona',
  'incompetentes',
  'es vergonzoso',
  'me quejo',
  'quiero quejarme',
  'vaya estafa',
  'esto es un robo',
  'devuélveme el dinero',
  'quiero reclamar',
  'una vergüenza',
  'muy mal servicio',
  'pesimo servicio',
  'pésimo servicio',
  'decepcionado',
  'decepcionada',
  'me habéis engañado',
  'me habeis engañado',
  // Catalán
  'vull parlar amb una persona',
  'vull parlar amb algú',
  'estic fart',
  'estic farta',
  'em donaré de baixa',
  'és vergonyós',
  'vull queixar-me',
  // Inglés
  'i want to speak to a person',
  'let me talk to a human',
  'this is ridiculous',
  "i'm frustrated",
  'i want a refund',
  'i want to cancel',
  'terrible service',
  'worst experience',
  'i want to complain',
  // Francés
  "je veux parler à quelqu'un",
  "c'est ridicule",
  'je veux me plaindre',
  'je veux un remboursement',
];

// Respuestas de escalación para cada idioma
const ESCALATION_RESPONSES: Record<string, string> = {
  es: `¡Entendido! 📋 He escalado tu consulta a mi equipo para que puedan darte una respuesta precisa.

Te contactarán lo antes posible por este mismo canal. ¡Gracias por tu paciencia! 🙏`,

  ca: `Entès! 📋 He escalat la teva consulta al meu equip perquè puguin donar-te una resposta precisa.

Et contactaran el més aviat possible per aquest mateix canal. Gràcies per la teva paciència! 🙏`,

  en: `Got it! 📋 I've escalated your question to my team so they can give you an accurate answer.

They'll contact you as soon as possible through this same channel. Thanks for your patience! 🙏`,

  fr: `Compris! 📋 J'ai transmis ta question à mon équipe pour qu'ils puissent te donner une réponse précise.

Ils te contacteront dès que possible par ce même canal. Merci pour ta patience! 🙏`,
};

// Email de destino
const ESCALATION_EMAIL = 'info@farrayscenter.com';

// TTL para casos en Redis (30 días)
const CASE_TTL_SECONDS = 30 * 24 * 60 * 60;

// ============================================================================
// ESCALATION SERVICE
// ============================================================================

export class EscalationService {
  private redis: Redis | null;

  constructor(redis: Redis | null = null) {
    this.redis = redis;
  }

  /**
   * Detectar si la respuesta de Laura indica que no supo responder
   */
  shouldEscalateFromLaura(lauraResponse: string): boolean {
    const lowerResponse = lauraResponse.toLowerCase();
    return ESCALATION_TRIGGERS.some(trigger => lowerResponse.includes(trigger.toLowerCase()));
  }

  /**
   * Detectar si el usuario está enfadado o frustrado
   */
  isUserAngry(userMessage: string): boolean {
    const lowerMessage = userMessage.toLowerCase();
    return ANGRY_USER_TRIGGERS.some(trigger => lowerMessage.includes(trigger.toLowerCase()));
  }

  /**
   * Detectar si hay que escalar (por Laura o por enfado del usuario)
   */
  shouldEscalate(lauraResponse: string, userMessage?: string): boolean {
    // Escalar si Laura no supo responder
    if (this.shouldEscalateFromLaura(lauraResponse)) {
      return true;
    }
    // Escalar si el usuario está enfadado
    if (userMessage && this.isUserAngry(userMessage)) {
      console.log(`[escalation] 🔴 User anger detected: "${userMessage.slice(0, 50)}..."`);
      return true;
    }
    return false;
  }

  /**
   * Procesar una posible escalación
   * Llamar después de cada respuesta de Laura
   */
  /**
   * Obtener respuesta de escalación en el idioma del usuario
   */
  getEscalationResponse(language: string): string {
    return ESCALATION_RESPONSES[language] ?? ESCALATION_RESPONSES['es'] ?? '';
  }

  /**
   * Procesar una posible escalación
   * Llamar después de cada respuesta de Laura
   *
   * Si se escala, devuelve el mensaje que Laura debe enviar al usuario
   */
  async processResponse(params: {
    userPhone: string;
    userMessage: string;
    lauraResponse: string;
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
    language: string;
    channel: 'whatsapp' | 'instagram' | 'web';
  }): Promise<{ escalated: boolean; caseId?: string; escalationMessage?: string }> {
    // Verificar si hay que escalar (por respuesta de Laura O por enfado del usuario)
    if (!this.shouldEscalate(params.lauraResponse, params.userMessage)) {
      return { escalated: false };
    }

    // Crear caso
    const caseId = this.generateCaseId();
    const escalationCase: EscalationCase = {
      id: caseId,
      timestamp: new Date().toISOString(),
      userPhone: this.maskPhone(params.userPhone),
      userMessage: params.userMessage,
      lauraResponse: params.lauraResponse,
      conversationContext: params.conversationHistory.slice(-6).map(m => `${m.role}: ${m.content}`),
      language: params.language,
      channel: params.channel,
      status: 'pending',
    };

    // Guardar en Redis
    await this.saveCase(escalationCase);

    // Enviar email
    await this.sendEscalationEmail(escalationCase);

    // Fase 6: Track escalation metrics
    try {
      const metrics = getAgentMetrics(this.redis);
      // Determine reason based on Laura's response
      const reason = this.determineEscalationReason(params.lauraResponse, params.userMessage);
      await metrics.trackEscalation(reason);
    } catch (e) {
      console.warn('[escalation] Failed to track metrics:', e);
    }

    // Log para monitoreo
    console.log(
      `[escalation] Case ${caseId} created for question: "${params.userMessage.substring(0, 50)}..."`
    );

    // Devolver mensaje de escalación para que Laura lo envíe al usuario
    const escalationMessage = this.getEscalationResponse(params.language);

    return { escalated: true, caseId, escalationMessage };
  }

  /**
   * Determinar la razón de la escalación para métricas
   */
  private determineEscalationReason(
    lauraResponse: string,
    userMessage: string
  ):
    | 'complex_query'
    | 'user_request'
    | 'sentiment_negative'
    | 'repeated_question'
    | 'booking_issue'
    | 'other' {
    const lowerResponse = lauraResponse.toLowerCase();
    const lowerMessage = userMessage.toLowerCase();

    // Check for explicit user request to speak to human
    if (
      lowerMessage.includes('humano') ||
      lowerMessage.includes('persona') ||
      lowerMessage.includes('human')
    ) {
      return 'user_request';
    }

    // Check for booking issues
    if (
      lowerMessage.includes('reserva') ||
      lowerMessage.includes('cancelar') ||
      lowerMessage.includes('booking')
    ) {
      return 'booking_issue';
    }

    // Check for negative sentiment
    if (
      lowerMessage.includes('queja') ||
      lowerMessage.includes('problema') ||
      lowerMessage.includes('molest')
    ) {
      return 'sentiment_negative';
    }

    // Check if Laura couldn't answer (complex query)
    if (lowerResponse.includes('confirmar') || lowerResponse.includes('equipo')) {
      return 'complex_query';
    }

    return 'other';
  }

  /**
   * Guardar caso en Redis
   */
  private async saveCase(escalationCase: EscalationCase): Promise<void> {
    if (!this.redis) {
      console.warn('[escalation] No Redis available, case not persisted');
      return;
    }

    try {
      const key = `escalation:case:${escalationCase.id}`;
      await this.redis.setex(key, CASE_TTL_SECONDS, JSON.stringify(escalationCase));

      // Agregar a lista de casos pendientes
      await this.redis.lpush('escalation:pending', escalationCase.id);

      // Incrementar contador diario
      const today = new Date().toISOString().split('T')[0];
      await this.redis.hincrby(`escalation:stats:${today}`, 'total', 1);

      // Guardar pregunta para análisis de frecuencia
      const questionKey = this.normalizeQuestion(escalationCase.userMessage);
      await this.redis.hincrby('escalation:questions', questionKey, 1);
    } catch (error) {
      console.error('[escalation] Failed to save case:', error);
    }
  }

  /**
   * Enviar email de escalación
   */
  private async sendEscalationEmail(escalationCase: EscalationCase): Promise<void> {
    const resendApiKey = process.env['RESEND_API_KEY'];

    if (!resendApiKey) {
      console.warn('[escalation] RESEND_API_KEY not configured, email not sent');
      // Fallback: log detallado para que al menos quede registrado
      console.log('[escalation] EMAIL WOULD BE SENT:');
      console.log(JSON.stringify(escalationCase, null, 2));
      return;
    }

    const emailBody = this.buildEmailBody(escalationCase);

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Laura AI <laura@farrayscenter.com>',
          to: [ESCALATION_EMAIL],
          subject: `🔔 Pregunta sin responder - ${escalationCase.channel.toUpperCase()}`,
          html: emailBody,
          reply_to: ESCALATION_EMAIL,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('[escalation] Email send failed:', error);
      } else {
        console.log(`[escalation] Email sent for case ${escalationCase.id}`);
      }
    } catch (error) {
      console.error('[escalation] Email send error:', error);
    }
  }

  /**
   * Construir cuerpo del email
   */
  private buildEmailBody(escalationCase: EscalationCase): string {
    const contextHtml = escalationCase.conversationContext
      .map(line => {
        const isUser = line.startsWith('user:');
        const color = isUser ? '#2563eb' : '#059669';
        const label = isUser ? '👤 Usuario' : '🤖 Laura';
        const content = line.replace(/^(user|assistant):/, '').trim();
        return `<p style="margin: 8px 0;"><strong style="color: ${color};">${label}:</strong> ${content}</p>`;
      })
      .join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 20px; border-radius: 12px 12px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; }
    .question { background: white; border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0; border-radius: 0 8px 8px 0; }
    .context { background: white; padding: 15px; margin: 15px 0; border-radius: 8px; border: 1px solid #e5e7eb; }
    .meta { color: #6b7280; font-size: 14px; }
    .cta { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 20px;">🔔 Laura necesita ayuda</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Un usuario hizo una pregunta que no pude responder</p>
    </div>
    <div class="content">
      <div class="question">
        <p style="margin: 0; font-weight: 600; color: #ef4444;">Pregunta del usuario:</p>
        <p style="margin: 10px 0 0 0; font-size: 18px;">"${escalationCase.userMessage}"</p>
      </div>

      <div class="meta">
        <p><strong>📱 Canal:</strong> ${escalationCase.channel.toUpperCase()}</p>
        <p><strong>🌍 Idioma:</strong> ${escalationCase.language.toUpperCase()}</p>
        <p><strong>📞 Teléfono:</strong> ${escalationCase.userPhone}</p>
        <p><strong>🕐 Hora:</strong> ${new Date(escalationCase.timestamp).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</p>
        <p><strong>🔖 Caso ID:</strong> ${escalationCase.id}</p>
      </div>

      <div class="context">
        <p style="margin: 0 0 10px 0; font-weight: 600;">💬 Contexto de la conversación:</p>
        ${contextHtml}
      </div>

      <p style="margin-top: 20px; color: #6b7280;">
        <strong>💡 Sugerencia:</strong> Si esta pregunta es común, considera añadirla al knowledge base de Laura
        para que pueda responderla automáticamente en el futuro.
      </p>

      <a href="https://wa.me/${escalationCase.userPhone.replace(/\D/g, '')}" class="cta">
        📱 Responder por WhatsApp
      </a>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Obtener estadísticas de escalaciones
   */
  async getStats(): Promise<EscalationStats | null> {
    if (!this.redis) return null;

    try {
      // Contar casos pendientes
      const pendingCount = await this.redis.llen('escalation:pending');

      // Obtener preguntas más frecuentes
      const questionsData = await this.redis.hgetall('escalation:questions');
      const topQuestions = Object.entries(questionsData || {})
        .map(([question, count]) => ({ question, count: Number(count) }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Contar total (últimos 30 días)
      let totalCases = 0;
      let resolvedCases = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        const dayStats = await this.redis.hgetall(`escalation:stats:${dateKey}`);
        if (dayStats) {
          totalCases += Number(dayStats['total'] || 0);
          resolvedCases += Number(dayStats['resolved'] || 0);
        }
      }

      return {
        totalCases,
        pendingCases: pendingCount,
        resolvedCases,
        topQuestions,
      };
    } catch (error) {
      console.error('[escalation] Failed to get stats:', error);
      return null;
    }
  }

  /**
   * Marcar caso como resuelto
   */
  async resolveCase(caseId: string, resolvedBy: string, resolution: string): Promise<boolean> {
    if (!this.redis) return false;

    try {
      const key = `escalation:case:${caseId}`;
      const caseData = await this.redis.get(key);

      if (!caseData) return false;

      const escalationCase: EscalationCase = JSON.parse(caseData as string);
      escalationCase.status = 'resolved';
      escalationCase.resolvedBy = resolvedBy;
      escalationCase.resolvedAt = new Date().toISOString();
      escalationCase.resolution = resolution;

      await this.redis.setex(key, CASE_TTL_SECONDS, JSON.stringify(escalationCase));

      // Remover de pendientes
      await this.redis.lrem('escalation:pending', 1, caseId);

      // Incrementar contador de resueltos
      const today = new Date().toISOString().split('T')[0];
      await this.redis.hincrby(`escalation:stats:${today}`, 'resolved', 1);

      return true;
    } catch (error) {
      console.error('[escalation] Failed to resolve case:', error);
      return false;
    }
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private generateCaseId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `ESC-${timestamp}-${random}`.toUpperCase();
  }

  private maskPhone(phone: string): string {
    // Mostrar solo últimos 4 dígitos por privacidad en logs
    // Pero guardar completo para poder responder
    return phone; // En el email se muestra completo para poder responder
  }

  private normalizeQuestion(question: string): string {
    // Normalizar pregunta para agrupar similares
    return question
      .toLowerCase()
      .replace(/[¿?¡!.,]/g, '')
      .trim()
      .substring(0, 100);
  }
}

// ============================================================================
// SINGLETON & EXPORTS
// ============================================================================

let escalationInstance: EscalationService | null = null;

export function getEscalationService(redis: Redis | null = null): EscalationService {
  if (!escalationInstance) {
    escalationInstance = new EscalationService(redis);
  }
  return escalationInstance;
}

/**
 * Helper rápido para procesar escalación
 */
export async function checkAndEscalate(
  redis: Redis | null,
  params: {
    userPhone: string;
    userMessage: string;
    lauraResponse: string;
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
    language: string;
    channel: 'whatsapp' | 'instagram' | 'web';
  }
): Promise<{ escalated: boolean; caseId?: string; escalationMessage?: string }> {
  const service = getEscalationService(redis);
  return service.processResponse(params);
}
