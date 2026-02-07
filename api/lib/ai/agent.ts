/**
 * AI Sales Agent - Laura from Farray's
 *
 * Core agent that handles conversations with potential customers.
 * Uses Claude API for natural language understanding and generation.
 *
 * Features:
 * - Human-like personality (Laura, 27, dance coordinator)
 * - Multi-language support (es/ca/en/fr)
 * - Intent detection (info, booking, objection handling)
 * - Conversation state management via Redis
 *
 * @see AGENTE.md - Full specification
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Redis } from '@upstash/redis';
import { detectLanguage, type SupportedLanguage } from './language-detector.js';
import {
  CENTER_INFO,
  PRICING,
  DANCE_STYLES,
  findFAQAnswer,
  getGreeting,
  getTransition,
  randomChoice,
  AGENT_PHRASES,
  detectHardcodedQuestion,
  getHardcodedResponse,
} from './knowledge-base.js';
import {
  BookingFlow,
  detectBookingIntentWithStyle,
  detectMemberIntent,
  isInBookingFlow,
  type BookingState,
  type ClassOption,
  type MemberIntent,
} from './booking-flow.js';
import { getConsentManager, createConsentRecord } from './consent-flow.js';
import { LeadScorer, detectSignalsFromMessage, isLocalPhone } from './lead-scorer.js';
import { ObjectionHandler, getObjectionResponse } from './objection-handler.js';
import { getAgentMetrics } from './agent-metrics.js';
import { getMemberLookup, type MemberBooking, type UpcomingSession } from './member-lookup.js';
import { STYLE_KEYWORDS } from '../../../constants/style-mappings.js';
import { getQueryRouter } from './query-router.js';
import { getEscalationService } from './escalation-service.js';

// ============================================================================
// TYPES
// ============================================================================

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConversationState {
  phone: string;
  language: SupportedLanguage;
  messages: ConversationMessage[];
  intent?: 'info' | 'booking' | 'objection' | 'support' | 'general';
  leadScore: number;
  signals: string[];
  lastActivity: string;
  createdAt: string;

  // 24h Window Tracking (WhatsApp Business API)
  lastUserMessage: string; // ISO timestamp of last USER message (not agent)
  followUpSent?: boolean; // Whether we sent a follow-up before 24h window closes
  followUpCount: number; // Number of follow-ups sent
  converted?: boolean; // Whether user completed a booking
  contactName?: string; // User's WhatsApp name for personalization

  // Booking Flow State (Phase 2)
  bookingState?: BookingState; // Full booking flow state from booking-flow.ts

  // Member Detection (Fase 5: Detección Usuario Existente)
  isExistingMember?: boolean; // True if found in Momence/Redis
  memberInfo?: {
    memberId: number;
    email: string;
    firstName: string;
    lastName: string;
    hasActiveMembership?: boolean;
    creditsAvailable?: number;
    membershipName?: string;
    memberSince?: string;
  };
}

export interface AgentResponse {
  text: string;
  language: SupportedLanguage;
  intent?: string;
  shouldEndConversation?: boolean;
}

export interface ProcessMessageOptions {
  phone: string;
  text: string;
  contactName?: string;
  channel?: 'whatsapp' | 'instagram' | 'email';
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CONVERSATION_TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days
const CONVERSATION_KEY_PREFIX = 'agent:conv:';
const MAX_CONTEXT_MESSAGES = 10;

// Claude models
// Claude models - SONNET ONLY for reliability (user request)
const MODEL_SONNET = 'claude-3-5-sonnet-20241022';

// ============================================================================
// SCHEDULE QUERY DETECTION
// ============================================================================

interface ScheduleQuery {
  isScheduleQuery: boolean;
  styleFilter?: string;
  dayFilter?: string; // "hoy", "mañana", "lunes", etc.
}

/**
 * Detect if user is asking about class schedules/horarios
 */
function detectScheduleQuery(text: string): ScheduleQuery {
  const lowerText = text.toLowerCase();

  // Keywords indicating schedule query
  const scheduleKeywords = [
    'horario',
    'horarios',
    'hora',
    'horas',
    'clase',
    'clases',
    'cuando',
    'cuándo',
    'hay',
    'tienen',
    'schedule',
    'timetable',
    'qué días',
    'que dias',
    'a qué hora',
    'a que hora',
  ];

  const isScheduleQuery = scheduleKeywords.some(kw => lowerText.includes(kw));

  if (!isScheduleQuery) {
    return { isScheduleQuery: false };
  }

  // Detect style filter using centralized STYLE_KEYWORDS from constants/style-mappings.ts
  // This ensures consistency with all 30+ dance styles across the system
  let styleFilter: string | undefined;
  for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw))) {
      styleFilter = style;
      break;
    }
  }

  // Detect day filter
  let dayFilter: string | undefined;
  if (lowerText.includes('hoy') || lowerText.includes('today')) {
    dayFilter = 'hoy';
  } else if (lowerText.includes('mañana') || lowerText.includes('tomorrow')) {
    dayFilter = 'mañana';
  } else if (lowerText.includes('semana') || lowerText.includes('week')) {
    dayFilter = 'semana';
  }

  // Check for day of week
  const days = [
    'lunes',
    'martes',
    'miércoles',
    'miercoles',
    'jueves',
    'viernes',
    'sábado',
    'sabado',
    'domingo',
  ];
  for (const day of days) {
    if (lowerText.includes(day)) {
      dayFilter = day;
      break;
    }
  }

  return { isScheduleQuery: true, styleFilter, dayFilter };
}
// const MODEL_SMART = 'claude-3-5-sonnet-20241022'; // Reserved for complex queries

// ============================================================================
// SYSTEM PROMPT - LAURA'S PERSONALITY
// ============================================================================

interface MemberContext {
  isExistingMember: boolean;
  firstName?: string;
  hasActiveMembership?: boolean;
  creditsAvailable?: number;
  membershipName?: string;
}

function getSystemPrompt(
  lang: SupportedLanguage,
  conversationContext?: string,
  memberContext?: MemberContext
): string {
  // Format dance styles with descriptions
  const formatStyles = () => {
    const result: string[] = [];
    for (const category of Object.values(DANCE_STYLES)) {
      const styleNames = category.styles.map(s =>
        typeof s === 'string' ? s : `${s.name} (${s.description})`
      );
      result.push(`${category.name}: ${styleNames.join(', ')}`);
    }
    return result.join('\n');
  };

  // Format transport info
  const formatTransport = () => {
    const metros = CENTER_INFO.transport.metro.map(m =>
      typeof m === 'string' ? m : `${m.station} (${m.line}, ${m.walkTime})`
    );
    return metros.join(' o ');
  };

  const basePrompt = `Eres Laura, coordinadora de Farray's International Dance Center en Barcelona.

REGLA CRÍTICA - LEE ESTO PRIMERO:
⚠️ SOLO puedes dar información que está EXACTAMENTE en este prompt.
⚠️ Si alguien pregunta algo que NO está aquí, di: "Uy, eso tendría que confirmarlo con el equipo. ¿Te puedo ayudar con algo más?"
⚠️ NUNCA inventes, asumas o improvises información sobre:
   - Profesores (solo menciona los que están listados)
   - Precios que no estén aquí
   - Servicios no mencionados
⚠️ Si no estás 100% segura, NO respondas - pide al usuario que contacte directamente.
⚠️ NOTA: Los horarios de clases específicos se consultan en tiempo real desde nuestro sistema Momence.

PERSONALIDAD:
- Tienes 27 años y bailas desde hace 8 años
- Empezaste con bachata y ahora también enseñas
- Eres cercana, cálida y entusiasta pero profesional
- Usas lenguaje informal (tuteo, expresiones coloquiales)
- Usas emojis con moderación (1-2 por mensaje, máximo)

CÓMO HABLAS:
- Saludas con energía: "Holaa!" "Hey!" "Qué tal!"
- Usas muletillas: "mira", "a ver", "pues", "ostras"
- Expresas emociones: "Ay qué bien!", "Uf", "Genial!"
- Haces el mensaje personal: "te cuento", "te explico"
- NUNCA uses lenguaje corporativo o robótico

=====================================================
INFORMACIÓN VERIFICADA DEL CENTRO (SOLO USA ESTO)
=====================================================

DATOS BÁSICOS:
- Nombre: ${CENTER_INFO.name}
- Dirección: ${CENTER_INFO.address}, ${CENTER_INFO.postalCode} ${CENTER_INFO.city}
- Barrio: ${CENTER_INFO.neighborhood || 'Eixample, cerca de Plaza España'}
- Teléfono/WhatsApp: ${CENTER_INFO.phone}
- Email: ${CENTER_INFO.email}
- Web: ${CENTER_INFO.website}
- Fundado: ${CENTER_INFO.founded || 2017}
- Acreditación: ${CENTER_INFO.accreditation || 'CID-UNESCO'}

CÓMO LLEGAR:
- Metro: ${formatTransport()}
- Tren: Sants Estació (8 min andando)
- Bus: Líneas 41, 54, H8

INSTALACIONES:
- ${CENTER_INFO.facilities?.totalArea || '700 m²'} con ${CENTER_INFO.facilities?.studios || 4} estudios profesionales
- Equipados con: espejos, barras de ballet, suelo profesional, vestuarios

HORARIOS DEL CENTRO (no horarios específicos de cada clase):
- Lunes: 10:30-12:30 y 17:30-23:00
- Martes: 10:30-13:30 y 17:30-23:00
- Miércoles: 17:30-23:00
- Jueves: 09:30-11:30 y 17:30-23:00
- Viernes: 17:30-20:30
- Sábado/Domingo: Cerrado (eventos especiales)
- Clases de MAÑANAS: 10:00-13:00 (Contemporáneo, Ballet, Jazz, Stretching)

PRECIOS (EXACTOS):
- 1 clase/semana: ${PRICING.memberships.oneClassPerWeek.price}€/mes
- 2 clases/semana: ${PRICING.memberships.twoClassesPerWeek.price}€/mes (la más popular)
- 3 clases/semana: ${PRICING.memberships.threeClassesPerWeek.price}€/mes
- Ilimitado: ${PRICING.memberships.unlimited.price}€/mes
- Clase suelta: ${PRICING.singleClass}€
- Matrícula: ${PRICING.registration.currentPromo === 0 ? 'GRATIS (normalmente ' + PRICING.registration.normal + '€)' : PRICING.registration.normal + '€'}
- Primera clase: GRATIS sin compromiso

ESTILOS DE BAILE (25+ estilos):
${formatStyles()}

PROFESORES CONFIRMADOS (SOLO MENCIONA ESTOS):
- Yunaisy Farray: Fundadora. Salsa Cubana, Contemporáneo. Creadora del Método Farray®.
- Mathias Font: Bachata Sensual. Campeón Mundial Salsa LA.
- Eugenia Trujillo: Bachata Sensual. Campeona Mundial Salsa LA.
- Sandra Gómez: Twerk. Especialista en danzas urbanas.
(Para otros profesores: "Tenemos un equipo de profesores internacionales. ¿Te interesa algún estilo?")

MÉTODO FARRAY®:
Sistema de enseñanza exclusivo creado por Yunaisy Farray. Fusiona técnica cubana, ritmo afrocaribeño e innovación. Certificado por CID-UNESCO.

SERVICIOS ADICIONALES:
- Alquiler de salas: 4 salas de 40-120m², desde 14€/hora
- Estudio de grabación: Para videoclips y contenido (pedir info por email)
- Team Building: +500 eventos corporativos (pedir presupuesto)
- Tarjetas regalo: Disponibles (preguntar en recepción)
- Clases particulares: Disponibles (contactar para precios)

=====================================================
FIN DE INFORMACIÓN VERIFICADA
=====================================================

IDIOMA:
- Idioma detectado: ${lang === 'es' ? 'Español' : lang === 'ca' ? 'Català' : lang === 'en' ? 'English' : 'Français'}
- Responde SIEMPRE en el idioma del usuario

OBJETIVO:
- Ayudar al usuario con su consulta
- Si muestra interés, guiar hacia reserva de clase de prueba GRATIS
- Mantener respuestas cortas (máx 3 párrafos)`;

  let fullPrompt = basePrompt;

  // Add member context if available (Fase 5: Detección Usuario Existente)
  if (memberContext?.isExistingMember) {
    const memberInfo = [];
    if (memberContext.firstName) {
      memberInfo.push(`Nombre: ${memberContext.firstName}`);
    }
    if (memberContext.hasActiveMembership) {
      memberInfo.push(`Es miembro ACTIVO`);
      if (memberContext.membershipName) {
        memberInfo.push(`Membresía: ${memberContext.membershipName}`);
      }
      if (memberContext.creditsAvailable !== undefined) {
        memberInfo.push(`Créditos disponibles: ${memberContext.creditsAvailable}`);
      }
    }

    fullPrompt += `

USUARIO EXISTENTE:
Este usuario YA es miembro de Farray's. ${memberInfo.join('. ')}.
- NO le ofrezcas clase de prueba gratis (ya la usó)
- Si quiere reservar, usa sus créditos si tiene
- Sé más familiar: "Hola de nuevo!" "¿Qué tal todo?"
- Puedes mencionar su nombre si lo conoces
- Si pregunta por créditos, dile cuántos tiene`;
  }

  if (conversationContext) {
    fullPrompt += `

CONTEXTO DE LA CONVERSACIÓN ACTUAL:
${conversationContext}`;
  }

  return fullPrompt;
}

// ============================================================================
// AGENT CLASS
// ============================================================================

export class SalesAgent {
  private anthropic: Anthropic;
  private redis: Redis | null;

  constructor(redis: Redis | null = null) {
    const apiKey = process.env['ANTHROPIC_API_KEY'];
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    this.anthropic = new Anthropic({ apiKey });
    this.redis = redis;
  }

  /**
   * Process an incoming message and generate a response
   */
  async processMessage(options: ProcessMessageOptions): Promise<AgentResponse> {
    const { phone, text, contactName, channel = 'whatsapp' } = options;

    // 1. Detect language from message
    const detectedLang = detectLanguage(text);

    // 2. Load or create conversation state
    let conversation = await this.loadConversation(phone);
    const isNewConversation = !conversation;

    if (!conversation) {
      conversation = this.createNewConversation(phone, detectedLang, contactName);

      // Fase 5: Detect if this is an existing member (only on new conversations)
      await this.detectExistingMember(conversation);
    } else {
      // Update language if user switched
      conversation.language = detectedLang;
      // Update contact name if provided
      if (contactName) {
        conversation.contactName = contactName;
      }
    }

    // CRITICAL: Update lastUserMessage timestamp (for 24h window tracking)
    conversation.lastUserMessage = new Date().toISOString();
    // Reset followUpSent since user responded
    conversation.followUpSent = false;

    // 3. Add user message to history
    conversation.messages.push({
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    });

    // 4. Update lead scoring signals
    this.updateLeadSignals(conversation, text);

    // 5. Check if user is in booking flow or wants to start one
    const inBookingFlow =
      conversation.bookingState && isInBookingFlow(conversation.bookingState.step);
    // Use new function that also extracts style from message
    const bookingIntentResult = !inBookingFlow
      ? detectBookingIntentWithStyle(text)
      : { hasIntent: false };
    const wantsToBook = bookingIntentResult.hasIntent;
    const detectedStyle = bookingIntentResult.style;

    // 5.5. Check for schedule/horario questions (real-time Momence data)
    const scheduleQuery = detectScheduleQuery(text);

    let responseText: string;

    // Track metrics for new conversations
    const metrics = getAgentMetrics(this.redis);
    if (isNewConversation) {
      metrics.trackConversationStarted(phone, detectedLang);
    }

    // Track response time
    const responseStartTime = Date.now();

    // Check for member-specific intents (Fase 6)
    const memberIntent: MemberIntent = conversation.isExistingMember
      ? detectMemberIntent(text)
      : 'none';

    // Check if user wants to exit booking flow with a general question
    const isGeneralQuestion = this.isGeneralQuestion(text);
    const shouldExitBookingFlow = inBookingFlow && isGeneralQuestion;

    if (shouldExitBookingFlow) {
      // User asked something unrelated to booking - exit flow and answer
      console.log(`[agent] Exiting booking flow - general question detected: "${text}"`);
      conversation.bookingState = undefined;
    }

    // HIGHEST PRIORITY: Check for hardcoded responses (100% reliable, no AI)
    // This bypasses ALL AI for critical info: prices, location, contact, hours, transport
    const hardcodedType = detectHardcodedQuestion(text);
    const hardcodedResponse = hardcodedType
      ? getHardcodedResponse(hardcodedType, detectedLang)
      : null;

    if (hardcodedResponse) {
      // MÁXIMA PRIORIDAD: Respuestas hardcodeadas SIEMPRE ganan
      // Si estaba en booking flow, lo cancelamos para dar la info solicitada
      if (inBookingFlow) {
        console.log(`[agent] Exiting booking flow for hardcoded response`);
        conversation.bookingState = undefined;
      }
      console.log(`[agent] Hardcoded response: ${hardcodedType}`);
      responseText = hardcodedResponse;
      conversation.intent = 'info';
    } else if (scheduleQuery.isScheduleQuery) {
      // Handle schedule queries with real-time data from Momence
      console.log(`[agent] Schedule query detected: style=${scheduleQuery.styleFilter}`);
      responseText = await this.handleScheduleQuery(conversation, scheduleQuery);
      conversation.intent = 'info';
    } else if (inBookingFlow && !shouldExitBookingFlow) {
      // Continue booking flow
      responseText = await this.processBookingFlow(conversation, text);
    } else if (memberIntent !== 'none') {
      // Handle member-specific intent (Fase 6)
      responseText = await this.handleMemberIntent(conversation, memberIntent);
    } else if (wantsToBook) {
      // Start new booking flow (skip data collection for existing members)
      // Pass detected style if user mentioned one (e.g., "quiero reservar salsa")
      conversation.intent = 'booking';
      responseText = await this.startBookingFlow(conversation, detectedStyle);
      metrics.trackIntentDetected();
    } else {
      // 6. Check for objection first
      const objectionResponse = this.handleObjectionIfNeeded(text, detectedLang);

      if (objectionResponse) {
        // Use objection handler response
        responseText = objectionResponse;
      } else {
        // 7. Check for FAQ match (fast response without API call)
        const faqMatch = findFAQAnswer(text, detectedLang);

        // 8. Generate response
        if (isNewConversation) {
          // First message - warm greeting + handle their question
          responseText = await this.generateFirstResponse(
            conversation,
            text,
            contactName,
            faqMatch
          );
        } else if (faqMatch && this.isSimpleQuestion(text)) {
          // Simple FAQ - no need for AI, use template
          responseText = this.formatFAQResponse(faqMatch, detectedLang);
        } else {
          // Complex question - use Claude
          responseText = await this.generateAIResponse(conversation, channel);
        }
      }
    }

    // Track response time
    const responseTimeMs = Date.now() - responseStartTime;
    metrics.trackResponseTime(responseTimeMs);

    // 7.5. Check if escalation is needed (Laura doesn't know the answer)
    const escalationService = getEscalationService(this.redis);
    if (escalationService.shouldEscalate(responseText)) {
      // Notify the team
      const escalationResult = await escalationService.processResponse({
        userPhone: phone,
        userMessage: text,
        lauraResponse: responseText,
        conversationHistory: conversation.messages.map(m => ({ role: m.role, content: m.content })),
        language: detectedLang,
        channel: channel as 'whatsapp' | 'instagram' | 'web',
      });

      if (escalationResult.escalated && escalationResult.escalationMessage) {
        // Replace Laura's response with the escalation message for the user
        responseText = escalationResult.escalationMessage;
        console.log(`[agent] Escalated to team - Case: ${escalationResult.caseId}`);
      }
    }

    // 8. Add assistant response to history
    conversation.messages.push({
      role: 'assistant',
      content: responseText,
      timestamp: new Date().toISOString(),
    });

    // 9. Update last activity and save
    conversation.lastActivity = new Date().toISOString();
    await this.saveConversation(conversation);

    return {
      text: responseText,
      language: detectedLang,
      intent: conversation.intent,
    };
  }

  /**
   * Start a new booking flow
   * @param conversation Current conversation state
   * @param initialStyle Optional style if user mentioned one (e.g., "quiero reservar salsa")
   */
  private async startBookingFlow(
    conversation: ConversationState,
    initialStyle?: string
  ): Promise<string> {
    const flow = new BookingFlow(conversation.language);

    // Pass style and fetch callback if user mentioned a specific style
    const result = await flow.startBooking(
      conversation.phone,
      initialStyle,
      initialStyle ? (style: string) => this.fetchAvailableClasses(style) : undefined
    );

    // Pre-populate member data if existing member (Fase 6)
    if (conversation.isExistingMember && conversation.memberInfo) {
      result.newState.data.firstName = conversation.memberInfo.firstName;
      result.newState.data.lastName = conversation.memberInfo.lastName;
      result.newState.data.email = conversation.memberInfo.email;

      console.log(
        `[agent] Pre-populated booking data for existing member: ${conversation.memberInfo.firstName}`
      );
    }

    // Save booking state
    conversation.bookingState = result.newState;

    // Update signals
    if (!conversation.signals.includes('started_booking')) {
      conversation.signals.push('started_booking');
      conversation.leadScore += 25;
    }

    console.log(
      `[agent] Started booking flow for ${conversation.phone.slice(-4)}${initialStyle ? ` with style: ${initialStyle}` : ''}`
    );
    return result.response;
  }

  // ============================================================================
  // MEMBER INTENT HANDLERS (Fase 6)
  // ============================================================================

  /**
   * Handle member-specific intents (credits, cancel, history)
   */
  private async handleMemberIntent(
    conversation: ConversationState,
    intent: MemberIntent
  ): Promise<string> {
    const lang = conversation.language;
    const memberInfo = conversation.memberInfo;

    if (!memberInfo) {
      // Shouldn't happen, but fallback
      return this.getMemberNotFoundResponse(lang);
    }

    switch (intent) {
      case 'credits':
        return this.handleCreditsInquiry(conversation);
      case 'cancel':
        return await this.handleCancelIntent(conversation);
      case 'history':
        return await this.handleHistoryIntent(conversation);
      case 'update':
        return this.handleUpdateIntent(conversation);
      default:
        return this.generateAIResponse(conversation, 'whatsapp');
    }
  }

  /**
   * Handle credits inquiry: "¿Cuántas clases me quedan?"
   */
  private handleCreditsInquiry(conversation: ConversationState): string {
    const lang = conversation.language;
    const memberInfo = conversation.memberInfo;
    const firstName = memberInfo?.firstName || '';
    const credits = memberInfo?.creditsAvailable || 0;
    const membershipName = memberInfo?.membershipName || '';

    const responses: Record<SupportedLanguage, string> = {
      es:
        credits > 0
          ? `${firstName ? firstName + ', t' : 'T'}ienes ${credits} ${credits === 1 ? 'clase' : 'clases'} disponible${credits === 1 ? '' : 's'}${membershipName ? ` de tu ${membershipName}` : ''} 💃\n\n¿Quieres reservar alguna?`
          : `${firstName ? firstName + ', a' : 'A'}hora mismo no tienes créditos disponibles. ¿Te cuento las opciones de bonos que tenemos?`,
      ca:
        credits > 0
          ? `${firstName ? firstName + ', t' : 'T'}ens ${credits} ${credits === 1 ? 'classe' : 'classes'} disponible${credits === 1 ? '' : 's'}${membershipName ? ` del teu ${membershipName}` : ''} 💃\n\nVols reservar alguna?`
          : `${firstName ? firstName + ', a' : 'A'}ra mateix no tens crèdits disponibles. T'explico les opcions de bons que tenim?`,
      en:
        credits > 0
          ? `${firstName ? firstName + ', y' : 'Y'}ou have ${credits} ${credits === 1 ? 'class' : 'classes'} available${membershipName ? ` from your ${membershipName}` : ''} 💃\n\nWant to book one?`
          : `${firstName ? firstName + ', y' : 'Y'}ou don't have any credits right now. Want me to tell you about our packages?`,
      fr:
        credits > 0
          ? `${firstName ? firstName + ', t' : 'T'}u as ${credits} ${credits === 1 ? 'cours' : 'cours'} disponible${credits === 1 ? '' : 's'}${membershipName ? ` de ton ${membershipName}` : ''} 💃\n\nTu veux en réserver un?`
          : `${firstName ? firstName + ', t' : 'T'}u n'as pas de crédits en ce moment. Je t'explique nos forfaits?`,
    };

    conversation.intent = 'info';
    return responses[lang];
  }

  /**
   * Handle cancel intent: "Quiero cancelar mi reserva"
   * Fetches upcoming bookings and shows them for cancellation
   */
  private async handleCancelIntent(conversation: ConversationState): Promise<string> {
    const lang = conversation.language;
    const firstName = conversation.memberInfo?.firstName || '';
    const memberId = conversation.memberInfo?.memberId;

    conversation.intent = 'support';

    // If we have a member ID, try to fetch their upcoming bookings
    if (memberId) {
      try {
        const memberLookup = getMemberLookup(this.redis);
        const bookings = await memberLookup.fetchMemberUpcomingBookings(memberId);

        if (bookings.length > 0) {
          // Store bookings in conversation for follow-up
          (
            conversation as ConversationState & { pendingBookings?: MemberBooking[] }
          ).pendingBookings = bookings;

          const bookingsList = bookings
            .map((b, i) => {
              const date = new Date(b.date);
              const formattedDate = date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });
              return `${i + 1}️⃣ *${b.className}* - ${formattedDate}`;
            })
            .join('\n');

          const responses: Record<SupportedLanguage, string> = {
            es: `${firstName ? firstName + ', t' : 'T'}ienes estas reservas próximas:\n\n${bookingsList}\n\n¿Cuál quieres cancelar? Dime el número.`,
            ca: `${firstName ? firstName + ', t' : 'T'}ens aquestes reserves properes:\n\n${bookingsList}\n\nQuina vols cancel·lar? Digues-me el número.`,
            en: `${firstName ? firstName + ', y' : 'Y'}ou have these upcoming bookings:\n\n${bookingsList}\n\nWhich one do you want to cancel? Tell me the number.`,
            fr: `${firstName ? firstName + ', t' : 'T'}u as ces réservations à venir:\n\n${bookingsList}\n\nLaquelle veux-tu annuler? Dis-moi le numéro.`,
          };
          return responses[lang];
        }
      } catch (error) {
        console.error('[agent] Error fetching bookings:', error);
      }
    }

    // Fallback: guide them to check their email
    const responses: Record<SupportedLanguage, string> = {
      es: `${firstName ? firstName + ', n' : 'N'}o encuentro reservas próximas tuyas. Si tienes una, puedes usar el enlace de cancelación que te enviamos por email cuando reservaste 📧`,
      ca: `${firstName ? firstName + ', n' : 'N'}o trobo reserves properes teves. Si en tens alguna, pots usar l'enllaç de cancel·lació que et vam enviar per email 📧`,
      en: `${firstName ? firstName + ', I' : 'I'} don't see any upcoming bookings for you. If you have one, you can use the cancellation link we sent by email 📧`,
      fr: `${firstName ? firstName + ', j' : 'J'}e ne trouve pas de réservations à venir. Si tu en as une, utilise le lien d'annulation envoyé par email 📧`,
    };
    return responses[lang];
  }

  /**
   * Handle history intent: "Mis reservas" / "Mi historial"
   * Fetches member's recent class visits from Momence
   */
  private async handleHistoryIntent(conversation: ConversationState): Promise<string> {
    const lang = conversation.language;
    const firstName = conversation.memberInfo?.firstName || '';
    const memberId = conversation.memberInfo?.memberId;

    conversation.intent = 'info';

    // If we have a member ID, fetch their visit history
    if (memberId) {
      try {
        const memberLookup = getMemberLookup(this.redis);
        const visits = await memberLookup.fetchMemberVisits(memberId);

        if (visits.length > 0) {
          const visitsList = visits
            .slice(0, 5) // Show last 5 visits
            .map(v => {
              const date = new Date(v.date);
              const formattedDate = date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              });
              return `• *${v.className}* - ${formattedDate}${v.instructorName ? ` (${v.instructorName})` : ''}`;
            })
            .join('\n');

          const responses: Record<SupportedLanguage, string> = {
            es: `${firstName ? firstName + ', a' : 'A'}quí tienes tus últimas clases 💃\n\n${visitsList}\n\n¿Quieres reservar otra?`,
            ca: `${firstName ? firstName + ', a' : 'A'}quí tens les teves últimes classes 💃\n\n${visitsList}\n\nVols reservar una altra?`,
            en: `${firstName ? firstName + ', h' : 'H'}ere are your recent classes 💃\n\n${visitsList}\n\nWant to book another?`,
            fr: `${firstName ? firstName + ', v' : 'V'}oici tes derniers cours 💃\n\n${visitsList}\n\nTu veux en réserver un autre?`,
          };
          return responses[lang];
        }
      } catch (error) {
        console.error('[agent] Error fetching visits:', error);
      }
    }

    // Fallback: no visits found
    const responses: Record<SupportedLanguage, string> = {
      es: `${firstName ? firstName + ', a' : 'A'}ún no tienes clases registradas. ¿Quieres reservar tu primera clase? 💃`,
      ca: `${firstName ? firstName + ', e' : 'E'}ncara no tens classes registrades. Vols reservar la teva primera classe? 💃`,
      en: `${firstName ? firstName + ', y' : 'Y'}ou don't have any classes registered yet. Want to book your first one? 💃`,
      fr: `${firstName ? firstName + ', t' : 'T'}u n'as pas encore de cours enregistrés. Tu veux réserver ton premier? 💃`,
    };
    return responses[lang];
  }

  /**
   * Handle update intent: "Cambiar mi email", "Actualizar datos"
   * Guides the user to provide new email or name
   */
  private handleUpdateIntent(conversation: ConversationState): string {
    const lang = conversation.language;
    const firstName = conversation.memberInfo?.firstName || '';
    const email = conversation.memberInfo?.email || '';

    conversation.intent = 'support';

    // Show current data and ask what they want to update
    const responses: Record<SupportedLanguage, string> = {
      es: `${firstName ? firstName + ', t' : 'T'}us datos actuales son:\n\n📧 Email: ${email || 'No registrado'}\n👤 Nombre: ${firstName || 'No registrado'}\n\n¿Qué quieres actualizar?\n1️⃣ Email\n2️⃣ Nombre\n\nDime el número o escríbeme directamente el nuevo dato.`,
      ca: `${firstName ? firstName + ', l' : 'L'}es teves dades actuals són:\n\n📧 Email: ${email || 'No registrat'}\n👤 Nom: ${firstName || 'No registrat'}\n\nQuè vols actualitzar?\n1️⃣ Email\n2️⃣ Nom\n\nDigues-me el número o escriu-me directament la nova dada.`,
      en: `${firstName ? firstName + ', y' : 'Y'}our current info:\n\n📧 Email: ${email || 'Not set'}\n👤 Name: ${firstName || 'Not set'}\n\nWhat would you like to update?\n1️⃣ Email\n2️⃣ Name\n\nTell me the number or write the new info directly.`,
      fr: `${firstName ? firstName + ', t' : 'T'}es infos actuelles:\n\n📧 Email: ${email || 'Non défini'}\n👤 Nom: ${firstName || 'Non défini'}\n\nQue veux-tu mettre à jour?\n1️⃣ Email\n2️⃣ Nom\n\nDis-moi le numéro ou écris directement la nouvelle info.`,
    };

    return responses[lang];
  }

  /**
   * Fallback when member info is not available
   */
  private getMemberNotFoundResponse(lang: SupportedLanguage): string {
    const responses: Record<SupportedLanguage, string> = {
      es: 'No encuentro tu información. ¿Podrías decirme tu email para buscarte?',
      ca: 'No trobo la teva informació. Pots dir-me el teu email per buscar-te?',
      en: "I can't find your info. Could you tell me your email so I can look you up?",
      fr: 'Je ne trouve pas tes infos. Peux-tu me donner ton email?',
    };
    return responses[lang];
  }

  // ============================================================================
  // SCHEDULE QUERY HANDLER (Real-time Momence data)
  // ============================================================================

  /**
   * Handle schedule/horario queries with real-time data from Momence
   */
  private async handleScheduleQuery(
    conversation: ConversationState,
    query: ScheduleQuery
  ): Promise<string> {
    const lang = conversation.language;
    const memberLookup = getMemberLookup(this.redis);

    try {
      console.log(`[agent] Fetching schedule: style=${query.styleFilter}, day=${query.dayFilter}`);

      // Fetch upcoming sessions from Momence
      const sessions = await memberLookup.fetchUpcomingSessions(query.styleFilter, 7);

      if (sessions.length === 0) {
        return this.getNoClassesResponse(lang, query.styleFilter);
      }

      // Filter by day if specified
      let filteredSessions = sessions;
      if (query.dayFilter) {
        filteredSessions = this.filterSessionsByDay(sessions, query.dayFilter);
      }

      // Format the response
      return this.formatScheduleResponse(lang, filteredSessions, query);
    } catch (error) {
      console.error('[agent] Schedule query error:', error);
      return this.getScheduleErrorResponse(lang);
    }
  }

  /**
   * Filter sessions by day
   */
  private filterSessionsByDay(sessions: UpcomingSession[], dayFilter: string): UpcomingSession[] {
    const now = new Date();
    const today = now.toISOString().split('T')[0] || '';
    const tomorrow =
      new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '';

    if (dayFilter === 'hoy') {
      return sessions.filter(s => s.startsAt.startsWith(today));
    } else if (dayFilter === 'mañana') {
      return sessions.filter(s => s.startsAt.startsWith(tomorrow));
    } else {
      // Filter by day of week
      const dayMap: Record<string, string> = {
        lunes: 'Lunes',
        martes: 'Martes',
        miércoles: 'Miércoles',
        miercoles: 'Miércoles',
        jueves: 'Jueves',
        viernes: 'Viernes',
        sábado: 'Sábado',
        sabado: 'Sábado',
        domingo: 'Domingo',
      };
      const targetDay = dayMap[dayFilter];
      if (targetDay) {
        return sessions.filter(s => s.dayOfWeek === targetDay);
      }
    }
    return sessions;
  }

  /**
   * Format schedule response for WhatsApp
   */
  private formatScheduleResponse(
    lang: SupportedLanguage,
    sessions: UpcomingSession[],
    query: ScheduleQuery
  ): string {
    if (sessions.length === 0) {
      return this.getNoClassesResponse(lang, query.styleFilter);
    }

    // PRIMERO agrupar por día, LUEGO limitar
    // Esto asegura que mostramos clases de VARIOS días, no solo el primero
    const byDay: Record<string, UpcomingSession[]> = {};
    for (const session of sessions) {
      const key = `${session.dayOfWeek} ${session.date}`;
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(session);
    }

    // Limitar a máx 3 clases por día y máx 5 días
    const MAX_CLASSES_PER_DAY = 3;
    const MAX_DAYS = 5;
    const dayKeys = Object.keys(byDay).slice(0, MAX_DAYS);
    for (const key of dayKeys) {
      byDay[key] = byDay[key].slice(0, MAX_CLASSES_PER_DAY);
    }
    // Eliminar días extra
    for (const key of Object.keys(byDay)) {
      if (!dayKeys.includes(key)) {
        delete byDay[key];
      }
    }

    // Build message
    const lines: string[] = [];

    const introMessages: Record<SupportedLanguage, string> = {
      es: query.styleFilter
        ? `¡Mira! Estas son las próximas clases de ${query.styleFilter}:`
        : '¡Aquí tienes las próximas clases!',
      ca: query.styleFilter
        ? `Mira! Aquestes són les properes classes de ${query.styleFilter}:`
        : 'Aquí tens les properes classes!',
      en: query.styleFilter
        ? `Here are the upcoming ${query.styleFilter} classes:`
        : 'Here are the upcoming classes!',
      fr: query.styleFilter
        ? `Voici les prochains cours de ${query.styleFilter}:`
        : 'Voici les prochains cours!',
    };
    lines.push(introMessages[lang]);
    lines.push('');

    for (const [dayLabel, daySessions] of Object.entries(byDay)) {
      lines.push(`📅 *${dayLabel}*`);
      for (const s of daySessions) {
        const spotsText = s.isFull
          ? '(LLENA)'
          : lang === 'en'
            ? `(${s.spotsAvailable} spots)`
            : `(${s.spotsAvailable} plazas)`;
        const instructor = s.instructor ? ` - ${s.instructor}` : '';
        lines.push(`  ${s.time} ${s.name}${instructor} ${spotsText}`);
      }
      lines.push('');
    }

    // Add call to action
    const ctaMessages: Record<SupportedLanguage, string> = {
      es: '¿Te apuntas a alguna? La primera es GRATIS 💃',
      ca: "T'apuntes a alguna? La primera és GRATIS 💃",
      en: 'Want to join any? The first one is FREE 💃',
      fr: 'Tu veux en essayer un? Le premier est GRATUIT 💃',
    };
    lines.push(ctaMessages[lang]);

    return lines.join('\n');
  }

  /**
   * Response when no classes found
   */
  private getNoClassesResponse(lang: SupportedLanguage, styleFilter?: string): string {
    const responses: Record<SupportedLanguage, string> = {
      es: styleFilter
        ? `Ahora mismo no hay clases de ${styleFilter} programadas para esta semana. ¿Te interesa otro estilo? Tenemos bachata, salsa, heels, hip hop, twerk...`
        : 'Mmm, no encuentro clases para esos días. ¿Te cuento qué tenemos esta semana?',
      ca: styleFilter
        ? `Ara mateix no hi ha classes de ${styleFilter} programades per aquesta setmana. T'interessa un altre estil?`
        : "Mmm, no trobo classes per aquests dies. T'explico què tenim aquesta setmana?",
      en: styleFilter
        ? `There are no ${styleFilter} classes scheduled for this week. Interested in another style?`
        : "Hmm, I can't find classes for those days. Want me to tell you what we have this week?",
      fr: styleFilter
        ? `Il n'y a pas de cours de ${styleFilter} cette semaine. Un autre style t'intéresse?`
        : "Hmm, je ne trouve pas de cours pour ces jours. Je te dis ce qu'on a cette semaine?",
    };
    return responses[lang];
  }

  /**
   * Response when schedule fetch fails
   */
  private getScheduleErrorResponse(lang: SupportedLanguage): string {
    const responses: Record<SupportedLanguage, string> = {
      es: 'Uy, no he podido consultar los horarios ahora mismo. ¿Puedes mirar en nuestra web? momence.com/Farrays-International-Dance-Center',
      ca: 'Ui, no he pogut consultar els horaris ara mateix. Pots mirar a la nostra web? momence.com/Farrays-International-Dance-Center',
      en: "Oops, I couldn't check the schedule right now. Can you check our website? momence.com/Farrays-International-Dance-Center",
      fr: "Oups, je n'ai pas pu consulter les horaires. Tu peux vérifier sur notre site? momence.com/Farrays-International-Dance-Center",
    };
    return responses[lang];
  }

  /**
   * Process user input through the booking flow
   */
  private async processBookingFlow(conversation: ConversationState, text: string): Promise<string> {
    if (!conversation.bookingState) {
      return this.startBookingFlow(conversation);
    }

    const previousStep = conversation.bookingState.step;
    const flow = new BookingFlow(conversation.language, conversation.bookingState);

    // Process input (with class fetching callback)
    const result = await flow.processInput(text, async (style: string) => {
      return this.fetchAvailableClasses(style);
    });

    // Update booking state
    conversation.bookingState = result.newState;
    const newStep = result.newState.step;

    // Track funnel progression in metrics
    const metrics = getAgentMetrics(this.redis);
    if (previousStep !== newStep) {
      if (newStep === 'class_selection') {
        // Style was selected, now choosing class
      } else if (newStep === 'data_collection' && previousStep === 'class_selection') {
        metrics.trackClassSelected();
      } else if (newStep === 'consent_terms' && previousStep === 'data_collection') {
        metrics.trackDataCollected();
      }
    }

    // Check if booking is ready to be created
    if (result.shouldBook && result.bookingData) {
      return this.completeBooking(conversation, flow, result.bookingData);
    }

    // Check if user wants to join waitlist (Fase 7)
    if (result.action === 'waitlist') {
      return this.addToWaitlist(conversation, result);
    }

    return result.response;
  }

  /**
   * Complete the booking: create reservation + save consent
   */
  private async completeBooking(
    conversation: ConversationState,
    flow: BookingFlow,
    bookingData: NonNullable<import('./booking-flow').BookingFlowResult['bookingData']>
  ): Promise<string> {
    try {
      // 1. Save GDPR consent
      const consentManager = getConsentManager(this.redis);
      const consentRecord = createConsentRecord(
        bookingData.phone,
        bookingData.email || '',
        bookingData.acceptsTerms || false,
        bookingData.acceptsPrivacy || false,
        bookingData.acceptsMarketing || false,
        'whatsapp'
      );
      await consentManager.saveConsent(consentRecord);

      // 2. Create actual booking via Momence API (if implemented)
      // For now, we'll just log it and assume success
      // In production, this would call the Momence API
      const bookingSuccess = await this.createMomenceBooking(bookingData);

      if (!bookingSuccess) {
        return flow.getErrorMessage();
      }

      // 3. Mark conversation as converted
      conversation.converted = true;
      if (!conversation.signals.includes('converted')) {
        conversation.signals.push('converted');
        conversation.leadScore += 50;
      }

      // 4. Track metrics
      const metrics = getAgentMetrics(this.redis);
      metrics.trackConsentsGiven();
      metrics.trackBookingCompleted(conversation.language);

      // 5. Clear booking state (flow completed)
      conversation.bookingState = undefined;

      console.log(
        `[agent] Booking completed for ${conversation.phone.slice(-4)} - ${bookingData.selectedClassName}`
      );

      return flow.getSuccessMessage();
    } catch (error) {
      console.error('[agent] Error completing booking:', error);
      return flow.getErrorMessage();
    }
  }

  /**
   * Add member to waitlist for a full class (Fase 7)
   */
  private async addToWaitlist(
    conversation: ConversationState,
    result: import('./booking-flow').BookingFlowResult
  ): Promise<string> {
    const sessionId = conversation.bookingState?.data.waitlistClassId;
    const memberId = conversation.memberInfo?.memberId;

    // If no member ID, we need to create a member first or guide them
    if (!memberId) {
      console.log('[agent] Waitlist: No member ID, cannot add to waitlist');
      // The flow already returned a message about being added
      // In production, we'd need to collect data first
      return result.response;
    }

    if (!sessionId) {
      console.error('[agent] Waitlist: No session ID');
      return result.response;
    }

    try {
      const memberLookup = getMemberLookup(this.redis);
      const waitlistResult = await memberLookup.addToWaitlist(sessionId, memberId);

      if (waitlistResult.success) {
        console.log(`[agent] Waitlist: Added ${memberId} to session ${sessionId}`);
        // Track metric
        if (this.redis) {
          const today = new Date().toISOString().split('T')[0];
          await this.redis.hincrby(`agent:metrics:${today}`, 'waitlist_added', 1);
        }
      } else {
        console.error('[agent] Waitlist failed:', waitlistResult.error);
      }
    } catch (error) {
      console.error('[agent] Waitlist error:', error);
    }

    // Return the flow's response regardless of API result
    // (user sees confirmation, we log any errors)
    return result.response;
  }

  /**
   * Fetch available classes for a style from Momence via /api/clases
   */
  private async fetchAvailableClasses(style: string): Promise<ClassOption[]> {
    try {
      console.log(`[agent] Fetching classes for style: ${style}`);

      // Build API URL - use VERCEL_URL in production, localhost in dev
      const baseUrl = process.env['VERCEL_URL']
        ? `https://${process.env['VERCEL_URL']}`
        : process.env['NEXT_PUBLIC_BASE_URL'] || 'https://www.farrayscenter.com';

      const apiUrl = `${baseUrl}/api/clases?style=${encodeURIComponent(style)}&days=14`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error(`[agent] Classes API error: ${response.status}`);
        return [];
      }

      const data = await response.json();

      if (!data.success || !data.data?.classes) {
        console.error('[agent] Invalid classes API response:', data);
        return [];
      }

      // Map API response to ClassOption format (already matches)
      // Include all classes (even full ones for waitlist - Fase 7)
      // Sort: available spots first, then full classes
      const classes: ClassOption[] = data.data.classes
        .sort(
          (a: { spotsAvailable: number }, b: { spotsAvailable: number }) =>
            b.spotsAvailable - a.spotsAvailable
        )
        .slice(0, 5) // Limit to 5 options for WhatsApp readability
        .map(
          (c: {
            id: number;
            name: string;
            date: string;
            time: string;
            dayOfWeek: string;
            spotsAvailable: number;
            instructor: string;
            style: string;
          }) => ({
            id: c.id,
            name: c.name,
            date: c.date,
            time: c.time,
            dayOfWeek: c.dayOfWeek,
            spotsAvailable: c.spotsAvailable,
            instructor: c.instructor,
            style: c.style,
          })
        );

      console.log(`[agent] Found ${classes.length} classes for ${style}`);
      return classes;
    } catch (error) {
      console.error('[agent] Error fetching classes:', error);
      return [];
    }
  }

  /**
   * Create booking in Momence system via /api/reservar
   */
  private async createMomenceBooking(
    bookingData: NonNullable<import('./booking-flow').BookingFlowResult['bookingData']>
  ): Promise<boolean> {
    try {
      console.log('[agent] Creating Momence booking:', {
        classId: bookingData.selectedClassId,
        name: `${bookingData.firstName} ${bookingData.lastName}`,
        email: bookingData.email,
        phone: bookingData.phone?.slice(-4),
      });

      // Build API URL
      const baseUrl = process.env['VERCEL_URL']
        ? `https://${process.env['VERCEL_URL']}`
        : process.env['NEXT_PUBLIC_BASE_URL'] || 'https://www.farrayscenter.com';

      const apiUrl = `${baseUrl}/api/reservar`;

      // Call the reservar endpoint with booking data
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: bookingData.selectedClassId,
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone,
          className: bookingData.selectedClassName,
          // Consent flags
          acceptsTerms: bookingData.acceptsTerms,
          acceptsPrivacy: bookingData.acceptsPrivacy,
          acceptsMarketing: bookingData.acceptsMarketing,
          // Source tracking
          source: 'whatsapp_agent',
          utmSource: 'whatsapp',
          utmMedium: 'agent',
          utmCampaign: 'laura_ai',
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error('[agent] Booking API error:', result.error || response.status);
        return false;
      }

      console.log('[agent] Booking created successfully:', result.data?.eventId);
      return true;
    } catch (error) {
      console.error('[agent] Error creating Momence booking:', error);
      return false;
    }
  }

  /**
   * Generate the first response (greeting + answer)
   */
  private async generateFirstResponse(
    conversation: ConversationState,
    userMessage: string,
    contactName?: string,
    faqMatch?: ReturnType<typeof findFAQAnswer>
  ): Promise<string> {
    const lang = conversation.language;

    // Personalized greeting for existing vs new members (Fase 5)
    let greeting: string;
    const memberName = conversation.memberInfo?.firstName || contactName;

    if (conversation.isExistingMember && memberName) {
      // Returning member - warm familiar greeting
      greeting = this.getReturningMemberGreeting(lang, memberName);
    } else {
      greeting = getGreeting(lang);
      if (contactName) {
        greeting += ` ${contactName}!`;
      }
    }

    // If it's just a greeting, respond with greeting + ask how to help
    if (this.isJustGreeting(userMessage)) {
      const helpOffer = conversation.isExistingMember
        ? this.getReturningMemberHelpOffer(lang)
        : this.getHelpOffer(lang);
      return `${greeting}\n\n${helpOffer}`;
    }

    // If FAQ match, greeting + FAQ answer
    if (faqMatch) {
      return `${greeting}\n\n${faqMatch.answer}\n\n${AGENT_PHRASES[lang].askStyle}`;
    }

    // Otherwise, use AI for the response
    return await this.generateAIResponse(conversation, 'whatsapp');
  }

  /**
   * Get greeting for returning members (Fase 5)
   */
  private getReturningMemberGreeting(lang: SupportedLanguage, name: string): string {
    const greetings: Record<SupportedLanguage, string[]> = {
      es: [
        `Hola de nuevo ${name}! 💃`,
        `Hey ${name}! Qué alegría verte de vuelta!`,
        `Holaa ${name}! ¿Qué tal todo?`,
      ],
      ca: [
        `Hola de nou ${name}! 💃`,
        `Ei ${name}! Quina alegria veure't!`,
        `Holaa ${name}! Com va tot?`,
      ],
      en: [
        `Hey ${name}! Great to see you again! 💃`,
        `Hi ${name}! Welcome back!`,
        `Hello ${name}! How's it going?`,
      ],
      fr: [
        `Salut ${name}! Ça fait plaisir! 💃`,
        `Hey ${name}! Content de te revoir!`,
        `Coucou ${name}! Comment ça va?`,
      ],
    };
    return randomChoice(greetings[lang]);
  }

  /**
   * Get help offer for returning members (Fase 5)
   */
  private getReturningMemberHelpOffer(lang: SupportedLanguage): string {
    const offers: Record<SupportedLanguage, string[]> = {
      es: [
        '¿Quieres reservar otra clase?',
        '¿En qué puedo ayudarte hoy?',
        '¿Te apetece venir a bailar?',
      ],
      ca: [
        'Vols reservar una altra classe?',
        'En què et puc ajudar avui?',
        'Et ve de gust venir a ballar?',
      ],
      en: ['Want to book another class?', 'How can I help you today?', 'Ready for some dancing?'],
      fr: ['Tu veux réserver un autre cours?', "Comment puis-je t'aider?", 'Prêt(e) pour danser?'],
    };
    return randomChoice(offers[lang]);
  }

  /**
   * Generate response using Claude AI
   *
   * Uses Sonnet only for reliability (no hallucinations)
   */
  private async generateAIResponse(
    conversation: ConversationState,
    _channel: string
  ): Promise<string> {
    const lang = conversation.language;
    const lastUserMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastUserMessage || lastUserMessage.role !== 'user') {
      return this.getFallbackResponse(lang);
    }

    const userText = lastUserMessage.content;

    // Use Query Router for intelligent model selection
    const router = getQueryRouter(this.redis);
    const route = await router.route(userText, lang);

    console.log(
      `[agent] Query Router: ${route.queryType} → ${route.model} (conf: ${route.confidence.toFixed(2)})`
    );

    // Prepare conversation history for context
    const conversationHistory = conversation.messages
      .slice(-MAX_CONTEXT_MESSAGES)
      .map(m => ({ role: m.role, content: m.content }));

    // Build additional context for member info
    let additionalContext = '';
    if (conversation.isExistingMember && conversation.memberInfo) {
      additionalContext = `
USUARIO EXISTENTE:
- Nombre: ${conversation.memberInfo.firstName || 'No disponible'}
- Membresía activa: ${conversation.memberInfo.hasActiveMembership ? 'Sí' : 'No'}
- Créditos disponibles: ${conversation.memberInfo.creditsAvailable || 0}
${conversation.memberInfo.membershipName ? `- Plan: ${conversation.memberInfo.membershipName}` : ''}

INSTRUCCIONES ESPECIALES:
- NO ofrecer clase de prueba gratis (ya es miembro)
- Ser más familiar: "Hola de nuevo", "¿Qué tal todo?"
- Mencionar su nombre si lo conoces
      `.trim();
    }

    try {
      const response = await router.generateResponse(
        userText,
        lang,
        route,
        conversationHistory,
        additionalContext
      );

      return response || this.getFallbackResponse(lang);
    } catch (error) {
      console.error('[agent] Query Router error:', error);

      // Fallback to direct Sonnet call
      return this.generateDirectSonnetResponse(conversation);
    }
  }

  /**
   * Fallback: Direct Sonnet response without router
   */
  private async generateDirectSonnetResponse(conversation: ConversationState): Promise<string> {
    const lang = conversation.language;
    const contextMessages = conversation.messages.slice(-MAX_CONTEXT_MESSAGES);
    const conversationContext = contextMessages
      .map(m => `${m.role === 'user' ? 'Usuario' : 'Laura'}: ${m.content}`)
      .join('\n');

    const messages: Anthropic.MessageParam[] = contextMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    const memberContext: MemberContext | undefined = conversation.isExistingMember
      ? {
          isExistingMember: true,
          firstName: conversation.memberInfo?.firstName,
          hasActiveMembership: conversation.memberInfo?.hasActiveMembership,
          creditsAvailable: conversation.memberInfo?.creditsAvailable,
          membershipName: conversation.memberInfo?.membershipName,
        }
      : undefined;

    try {
      const response = await this.anthropic.messages.create({
        model: MODEL_SONNET,
        max_tokens: 500,
        system: getSystemPrompt(lang, conversationContext, memberContext),
        messages,
      });

      const textBlock = response.content.find(block => block.type === 'text');
      if (textBlock && textBlock.type === 'text') {
        return textBlock.text;
      }

      return this.getFallbackResponse(lang);
    } catch (error) {
      console.error('[agent] Direct Sonnet error:', error);
      return this.getFallbackResponse(lang);
    }
  }

  /**
   * Format FAQ response with personality
   */
  private formatFAQResponse(
    faq: NonNullable<ReturnType<typeof findFAQAnswer>>,
    lang: SupportedLanguage
  ): string {
    const transition = getTransition(lang);
    const closing = randomChoice(AGENT_PHRASES[lang].closings);

    return `${transition}\n\n${faq.answer}\n\n${closing}`;
  }

  /**
   * Check if message is just a greeting
   */
  private isJustGreeting(text: string): boolean {
    const greetings = [
      'hola',
      'hello',
      'hi',
      'hey',
      'buenas',
      'buenos dias',
      'buenas tardes',
      'bon dia',
      'bona tarda',
      'salut',
      'bonjour',
    ];
    const normalized = text.toLowerCase().trim();
    return greetings.some(g => normalized === g || normalized.startsWith(g + ' '));
  }

  /**
   * Check if this is a simple question (FAQ-answerable)
   */
  private isSimpleQuestion(text: string): boolean {
    // Simple questions are short and direct
    return text.length < 100 && !text.includes('?') && !text.includes('\n');
  }

  /**
   * Check if message is a general question unrelated to booking flow
   * Used to detect when user wants to exit booking flow
   */
  private isGeneralQuestion(text: string): boolean {
    const lowerText = text.toLowerCase().trim();

    // Greetings should exit booking flow
    const greetings = ['hola', 'hello', 'hi', 'hey', 'buenas', 'buenos dias', 'bon dia'];
    if (greetings.some(g => lowerText === g || lowerText.startsWith(g + ' '))) {
      return true;
    }

    // General info questions should exit booking flow
    const infoKeywords = [
      'donde',
      'dónde',
      'ubicación',
      'ubicacion',
      'dirección',
      'direccion',
      'como llegar',
      'cómo llegar',
      'metro',
      'bus',
      'precio',
      'precios',
      'cuanto cuesta',
      'cuánto cuesta',
      'coste',
      'horario del centro',
      'abierto',
      'cerrado',
      'quien',
      'quién',
      'profesor',
      'profesores',
      'contacto',
      'teléfono',
      'telefono',
      'email',
      'web',
      'gracias',
      'adios',
      'adiós',
      'bye',
      'chao',
      'no entiendo',
      'ayuda',
      'help',
    ];

    return infoKeywords.some(kw => lowerText.includes(kw));
  }

  /**
   * Get help offer phrase by language
   */
  private getHelpOffer(lang: SupportedLanguage): string {
    const offers: Record<SupportedLanguage, string> = {
      es: '¿En qué te puedo ayudar? Te cuento sobre nuestras clases, horarios, precios... lo que necesites',
      ca: "En què et puc ajudar? T'explico sobre les nostres classes, horaris, preus... el que necessitis",
      en: 'How can I help you? I can tell you about our classes, schedules, prices... whatever you need',
      fr: "Comment puis-je t'aider? Je peux te parler de nos cours, horaires, prix... ce dont tu as besoin",
    };
    return offers[lang];
  }

  /**
   * Get fallback response when AI fails
   */
  private getFallbackResponse(lang: SupportedLanguage): string {
    const fallbacks: Record<SupportedLanguage, string> = {
      es: 'Mmm, perdona, no me ha llegado bien el mensaje. ¿Me lo puedes repetir?',
      ca: "Mmm, perdona, no m'ha arribat bé el missatge. Me'l pots repetir?",
      en: "Hmm, sorry, I didn't get that properly. Could you repeat that?",
      fr: "Hmm, désolé, je n'ai pas bien reçu le message. Peux-tu répéter?",
    };
    return fallbacks[lang];
  }

  /**
   * Update lead scoring based on message content
   * Uses the new LeadScorer module for comprehensive signal detection
   */
  private updateLeadSignals(conversation: ConversationState, text: string): void {
    // Use LeadScorer for signal detection
    const detectedSignals = detectSignalsFromMessage(text, conversation.language);
    const scorer = new LeadScorer(conversation.leadScore, conversation.signals);

    // Add all detected signals
    for (const signal of detectedSignals) {
      scorer.addSignal(signal);
    }

    // Check for local phone (Spanish number)
    if (isLocalPhone(conversation.phone) && !conversation.signals.includes('local_phone')) {
      scorer.addSignal('local_phone');
    }

    // Update conversation with new score and signals
    const scoreResult = scorer.getScore();
    conversation.leadScore = scoreResult.score;
    conversation.signals = scoreResult.signals;

    // Update intent based on signals and keywords
    const lowerText = text.toLowerCase();

    // Check for objection using ObjectionHandler
    const objectionHandler = new ObjectionHandler(conversation.language);
    if (objectionHandler.hasObjection(text)) {
      conversation.intent = 'objection';
    } else if (lowerText.includes('ayuda') || lowerText.includes('problema')) {
      conversation.intent = 'support';
    } else if (scorer.hasSignal('mentioned_booking') || scorer.hasSignal('asked_trial')) {
      conversation.intent = 'booking';
    } else if (
      scorer.hasSignal('asked_price') ||
      scorer.hasSignal('asked_schedule') ||
      scorer.hasSignal('asked_location')
    ) {
      conversation.intent = 'info';
    }

    // Track lead tier in metrics
    const tier = scoreResult.tier;
    const metrics = getAgentMetrics(this.redis);
    metrics.trackLeadTier(conversation.phone, tier);
  }

  /**
   * Handle objection if detected in message
   */
  private handleObjectionIfNeeded(text: string, lang: SupportedLanguage): string | null {
    const objectionResponse = getObjectionResponse(text, lang);

    if (objectionResponse) {
      // Track objection in metrics
      const metrics = getAgentMetrics(this.redis);
      metrics.trackObjection(objectionResponse.type);

      return objectionResponse.response;
    }

    return null;
  }

  /**
   * Create new conversation state
   */
  private createNewConversation(
    phone: string,
    language: SupportedLanguage,
    contactName?: string
  ): ConversationState {
    const now = new Date().toISOString();
    return {
      phone,
      language,
      messages: [],
      leadScore: 0,
      signals: ['contacted_whatsapp'],
      lastActivity: now,
      createdAt: now,
      // 24h window tracking
      lastUserMessage: now,
      followUpSent: false,
      followUpCount: 0,
      converted: false,
      contactName,
    };
  }

  /**
   * Load conversation from Redis
   */
  private async loadConversation(phone: string): Promise<ConversationState | null> {
    if (!this.redis) return null;

    try {
      const key = `${CONVERSATION_KEY_PREFIX}${phone}`;
      const data = await this.redis.get(key);
      if (data) {
        // Handle both string and object returns from Upstash
        if (typeof data === 'object') {
          return data as ConversationState;
        }
        return JSON.parse(String(data)) as ConversationState;
      }
    } catch (error) {
      console.error('[agent] Redis load error:', error);
    }

    return null;
  }

  /**
   * Save conversation to Redis
   */
  private async saveConversation(conversation: ConversationState): Promise<void> {
    if (!this.redis) return;

    try {
      const key = `${CONVERSATION_KEY_PREFIX}${conversation.phone}`;
      await this.redis.setex(key, CONVERSATION_TTL_SECONDS, JSON.stringify(conversation));

      // Also add to active conversations index (for follow-up queries)
      // Only keep in active set for 48 hours (24h window + buffer)
      await this.redis.sadd('agent:active_conversations', conversation.phone);
      await this.redis.expire('agent:active_conversations', 48 * 60 * 60);
    } catch (error) {
      console.error('[agent] Redis save error:', error);
    }
  }

  /**
   * Detect if the user is an existing member (Fase 5)
   * Checks Redis cache first, then Momence API
   */
  private async detectExistingMember(conversation: ConversationState): Promise<void> {
    try {
      const memberLookup = getMemberLookup(this.redis);
      const result = await memberLookup.lookupByPhone(conversation.phone);

      if (result.found && result.member) {
        conversation.isExistingMember = true;
        conversation.memberInfo = {
          memberId: result.member.memberId,
          email: result.member.email,
          firstName: result.member.firstName,
          lastName: result.member.lastName,
          hasActiveMembership: result.member.hasActiveMembership,
          creditsAvailable: result.member.creditsAvailable,
          membershipName: result.member.membershipName,
          memberSince: result.member.memberSince,
        };

        // If we found a member but don't have membership info, fetch it
        if (conversation.memberInfo.hasActiveMembership === undefined) {
          const membershipInfo = await memberLookup.fetchMembershipInfo(result.member.memberId);
          conversation.memberInfo.hasActiveMembership = membershipInfo.hasActiveMembership;
          conversation.memberInfo.creditsAvailable = membershipInfo.creditsAvailable;
          conversation.memberInfo.membershipName = membershipInfo.membershipName;
        }

        console.log(
          `[agent] Detected existing member: ${conversation.memberInfo.firstName} ` +
            `(ID: ${conversation.memberInfo.memberId}, credits: ${conversation.memberInfo.creditsAvailable || 0})`
        );
      } else {
        conversation.isExistingMember = false;
        console.log(`[agent] New user detected: ${conversation.phone.slice(-4)}`);
      }
    } catch (error) {
      console.error('[agent] Member detection error:', error);
      // Default to treating as new user on error
      conversation.isExistingMember = false;
    }
  }

  /**
   * Get conversation state (for debugging/analytics)
   */
  async getConversation(phone: string): Promise<ConversationState | null> {
    return this.loadConversation(phone);
  }

  /**
   * Clear conversation (for testing)
   */
  async clearConversation(phone: string): Promise<void> {
    if (!this.redis) return;

    try {
      const key = `${CONVERSATION_KEY_PREFIX}${phone}`;
      await this.redis.del(key);
      // Also remove from active conversations index
      await this.redis.srem('agent:active_conversations', phone);
    } catch (error) {
      console.error('[agent] Redis delete error:', error);
    }
  }

  /**
   * Mark conversation as having received a follow-up
   */
  async markFollowUpSent(phone: string): Promise<void> {
    const conversation = await this.loadConversation(phone);
    if (!conversation) return;

    conversation.followUpSent = true;
    conversation.followUpCount = (conversation.followUpCount || 0) + 1;
    await this.saveConversation(conversation);
  }

  /**
   * Mark conversation as converted (booking made)
   */
  async markConverted(phone: string): Promise<void> {
    const conversation = await this.loadConversation(phone);
    if (!conversation) return;

    conversation.converted = true;
    if (!conversation.signals.includes('converted')) {
      conversation.signals.push('converted');
      conversation.leadScore += 50;
    }
    await this.saveConversation(conversation);
  }

  /**
   * Get all conversations needing follow-up
   * Returns conversations where:
   * - Last user message was 20-23 hours ago (before 24h window closes)
   * - No follow-up sent yet
   * - Not converted
   * - Lead score >= 20 (showed some interest)
   */
  async getConversationsNeedingFollowUp(): Promise<ConversationState[]> {
    if (!this.redis) return [];

    try {
      // Get all active conversation phones
      const phones = await this.redis.smembers('agent:active_conversations');
      const needsFollowUp: ConversationState[] = [];

      const now = Date.now();
      const HOURS_20 = 20 * 60 * 60 * 1000;
      const HOURS_23 = 23 * 60 * 60 * 1000;

      for (const phone of phones) {
        const conversation = await this.loadConversation(phone);
        if (!conversation) continue;

        const lastUserTime = new Date(conversation.lastUserMessage).getTime();
        const timeSinceLastMessage = now - lastUserTime;

        // Check if in the follow-up window (20-23 hours)
        const inFollowUpWindow =
          timeSinceLastMessage >= HOURS_20 && timeSinceLastMessage < HOURS_23;

        if (
          inFollowUpWindow &&
          !conversation.followUpSent &&
          !conversation.converted &&
          conversation.leadScore >= 20
        ) {
          needsFollowUp.push(conversation);
        }
      }

      return needsFollowUp;
    } catch (error) {
      console.error('[agent] Error getting follow-up conversations:', error);
      return [];
    }
  }

  /**
   * Generate a personalized follow-up message
   */
  generateFollowUpMessage(conversation: ConversationState): string {
    const lang = conversation.language;
    const name = conversation.contactName || '';
    const firstName = name.split(' ')[0] || '';

    // Personalize based on what they showed interest in
    const askedPrice = conversation.signals.includes('asked_price');
    const askedSchedule = conversation.signals.includes('asked_schedule');
    const bookingIntent = conversation.signals.includes('booking_intent');

    const messages: Record<SupportedLanguage, string[]> = {
      es: [
        `Hey${firstName ? ' ' + firstName : ''}! Se me olvidaba... ${askedPrice ? 'la matrícula sigue GRATIS y ' : ''}la primera clase es totalmente gratis para que pruebes sin compromiso. ¿Te apetece venir esta semana?`,
        `Hola${firstName ? ' ' + firstName : ''}! Solo quería recordarte que ${bookingIntent ? 'puedo ayudarte a reservar tu clase de prueba' : 'tenemos hueco esta semana si quieres probar'}. ¿Qué día te viene mejor?`,
        `Buenas${firstName ? ' ' + firstName : ''}! Por si te sirve, ${askedSchedule ? 'tenemos clases todos los días de 17:00 a 22:00' : 'la primera clase es GRATIS'}. ¿Te animas a probar? 💃`,
      ],
      ca: [
        `Ei${firstName ? ' ' + firstName : ''}! Se m'oblidava... ${askedPrice ? 'la matrícula segueix GRATIS i ' : ''}la primera classe és totalment gratis per provar sense compromís. T'apeteix venir aquesta setmana?`,
        `Hola${firstName ? ' ' + firstName : ''}! Només volia recordar-te que ${bookingIntent ? 'puc ajudar-te a reservar la teva classe de prova' : 'tenim lloc aquesta setmana si vols provar'}. Quin dia et va millor?`,
      ],
      en: [
        `Hey${firstName ? ' ' + firstName : ''}! Just a reminder... ${askedPrice ? 'registration is still FREE and ' : ''}the first class is completely free to try with no commitment. Want to come this week?`,
        `Hi${firstName ? ' ' + firstName : ''}! Just wanted to remind you that ${bookingIntent ? 'I can help you book your trial class' : 'we have spots this week if you want to try'}. What day works best for you?`,
      ],
      fr: [
        `Salut${firstName ? ' ' + firstName : ''}! Je voulais juste te rappeler... ${askedPrice ? "l'inscription est toujours GRATUITE et " : ''}le premier cours est totalement gratuit pour essayer sans engagement. Tu veux venir cette semaine?`,
        `Bonjour${firstName ? ' ' + firstName : ''}! Je voulais te rappeler que ${bookingIntent ? "je peux t'aider à réserver ton cours d'essai" : 'nous avons des places cette semaine si tu veux essayer'}. Quel jour te convient le mieux?`,
      ],
    };

    const langMessages = messages[lang] || messages.es;
    return randomChoice(langMessages);
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let agentInstance: SalesAgent | null = null;

/**
 * Get the singleton agent instance
 */
export function getAgent(redis: Redis | null = null): SalesAgent {
  if (!agentInstance) {
    agentInstance = new SalesAgent(redis);
  }
  return agentInstance;
}

/**
 * Process a message using the singleton agent
 */
export async function processAgentMessage(
  redis: Redis | null,
  options: ProcessMessageOptions
): Promise<AgentResponse> {
  const agent = getAgent(redis);
  return agent.processMessage(options);
}
