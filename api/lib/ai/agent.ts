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
import { detectLanguage, type SupportedLanguage } from './language-detector';
import {
  CENTER_INFO,
  PRICING,
  DANCE_STYLES,
  findFAQAnswer,
  getGreeting,
  getTransition,
  randomChoice,
  AGENT_PHRASES,
} from './knowledge-base';
import {
  BookingFlow,
  detectBookingIntent,
  isInBookingFlow,
  type BookingState,
  type ClassOption,
} from './booking-flow';
import { getConsentManager, createConsentRecord } from './consent-flow';
import { LeadScorer, detectSignalsFromMessage, isLocalPhone } from './lead-scorer';
import { ObjectionHandler, getObjectionResponse } from './objection-handler';
import { getAgentMetrics } from './agent-metrics';
import { getMemberLookup } from './member-lookup';

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
const MODEL_FAST = 'claude-3-haiku-20240307';
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
  const basePrompt = `Eres Laura, coordinadora de Farray's International Dance Center en Barcelona.

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
- NUNCA digas "Claro que sí" o frases de servicio al cliente

INFORMACIÓN DEL CENTRO:
- Nombre: ${CENTER_INFO.name}
- Dirección: ${CENTER_INFO.address}, ${CENTER_INFO.postalCode} ${CENTER_INFO.city}
- Teléfono/WhatsApp: ${CENTER_INFO.phone}
- Web: ${CENTER_INFO.website}
- Metro: ${CENTER_INFO.transport.metro.join(' o ')}

PRECIOS:
- 1 clase/semana: ${PRICING.memberships.oneClassPerWeek.price}€/mes
- 2 clases/semana: ${PRICING.memberships.twoClassesPerWeek.price}€/mes (la más popular)
- 3 clases/semana: ${PRICING.memberships.threeClassesPerWeek.price}€/mes
- Ilimitado: ${PRICING.memberships.unlimited.price}€/mes
- Clase suelta: ${PRICING.singleClass}€
- Matrícula: GRATIS (normalmente ${PRICING.registration.normal}€)
- Primera clase: GRATIS para probar

ESTILOS DE BAILE:
${Object.values(DANCE_STYLES)
  .map(cat => `- ${cat.name}: ${cat.styles.join(', ')}`)
  .join('\n')}

REGLAS IMPORTANTES:
1. Responde SOLO con la información que tienes
2. Si no sabes algo, di "deja que lo confirme con el equipo"
3. NUNCA inventes precios, horarios o información
4. Siempre intenta avanzar hacia una reserva de clase de prueba
5. Mantén las respuestas cortas y conversacionales (máx 3-4 párrafos)
6. Si detectas objeción de precio, menciona que la primera clase es gratis

IDIOMA:
- Detecta el idioma del usuario y responde SIEMPRE en ese mismo idioma
- Idioma actual detectado: ${lang === 'es' ? 'Español' : lang === 'ca' ? 'Català' : lang === 'en' ? 'English' : 'Français'}
- Mantén la personalidad cercana en todos los idiomas`;

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
    const wantsToBook = !inBookingFlow && detectBookingIntent(text);

    let responseText: string;

    // Track metrics for new conversations
    const metrics = getAgentMetrics(this.redis);
    if (isNewConversation) {
      metrics.trackConversationStarted(phone, detectedLang);
    }

    // Track response time
    const responseStartTime = Date.now();

    if (inBookingFlow) {
      // Continue booking flow
      responseText = await this.processBookingFlow(conversation, text);
    } else if (wantsToBook) {
      // Start new booking flow
      conversation.intent = 'booking';
      responseText = this.startBookingFlow(conversation);
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
   */
  private startBookingFlow(conversation: ConversationState): string {
    const flow = new BookingFlow(conversation.language);
    const result = flow.startBooking(conversation.phone);

    // Save booking state
    conversation.bookingState = result.newState;

    // Update signals
    if (!conversation.signals.includes('started_booking')) {
      conversation.signals.push('started_booking');
      conversation.leadScore += 25;
    }

    console.log(`[agent] Started booking flow for ${conversation.phone.slice(-4)}`);
    return result.response;
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
      const classes: ClassOption[] = data.data.classes
        .filter((c: { spotsAvailable: number }) => c.spotsAvailable > 0)
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
   */
  private async generateAIResponse(
    conversation: ConversationState,
    _channel: string
  ): Promise<string> {
    const lang = conversation.language;

    // Prepare conversation context
    const contextMessages = conversation.messages.slice(-MAX_CONTEXT_MESSAGES);
    const conversationContext = contextMessages
      .map(m => `${m.role === 'user' ? 'Usuario' : 'Laura'}: ${m.content}`)
      .join('\n');

    // Build messages for Claude
    const messages: Anthropic.MessageParam[] = contextMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Build member context (Fase 5)
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
        model: MODEL_FAST, // Use Haiku for speed
        max_tokens: 500,
        system: getSystemPrompt(lang, conversationContext, memberContext),
        messages,
      });

      // Extract text from response
      const textBlock = response.content.find(block => block.type === 'text');
      if (textBlock && textBlock.type === 'text') {
        return textBlock.text;
      }

      // Fallback
      return this.getFallbackResponse(lang);
    } catch (error) {
      console.error('[agent] Claude API error:', error);
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
