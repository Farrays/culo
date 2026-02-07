/**
 * Query Router - Hybrid Haiku/Sonnet Architecture
 *
 * This module implements intelligent routing of user queries to the appropriate
 * Claude model based on query complexity:
 *
 * - Haiku (80%): Simple FAQs, greetings, schedule queries, booking intents
 * - Sonnet (20%): Complex comparisons, multi-topic queries, nuanced questions
 *
 * Benefits:
 * - Cost reduction: Haiku is ~10x cheaper than Sonnet
 * - Speed improvement: Haiku responses are ~2x faster
 * - Quality maintained: Sonnet used when reasoning is needed
 *
 * @see ENTERPRISE_AGENT_PLAN.md - Fase 2
 */

import Anthropic from '@anthropic-ai/sdk';
import type { Redis } from '@upstash/redis';
import type { SupportedLanguage } from './language-detector.js';
import {
  FAQS,
  CENTER_INFO,
  PRICING,
  DANCE_STYLES,
  CUSTOMER_POLICIES,
  OPERATIONAL_FAQS,
  type FAQ,
} from './knowledge-base.js';
import { STYLE_KEYWORDS } from '../../../constants/style-mappings.js';
import { getMomenceService, type NormalizedSession } from '../momence-service.js';
import { getAgentMetrics } from './agent-metrics.js';

// ============================================================================
// CONSTANTS
// ============================================================================

// Claude models
const MODEL_HAIKU = 'claude-3-haiku-20240307'; // Fast, cheap (~$0.25/1M tokens)
const MODEL_SONNET = 'claude-3-5-sonnet-20241022'; // Smart (~$3/1M tokens)

// ============================================================================
// TYPES
// ============================================================================

export type QueryType =
  | 'greeting' // Hola, buenos días
  | 'faq_simple' // ¿Cuánto cuesta? ¿Dónde está?
  | 'schedule_query' // ¿Hay bachata mañana?
  | 'style_info' // Cuéntame sobre bachata
  | 'style_comparison' // ¿Diferencia entre salsa y bachata?
  | 'booking_intent' // Quiero reservar
  | 'member_query' // Mis créditos, cancelar
  | 'objection' // Es caro, no tengo tiempo
  | 'complex'; // Multi-topic, requires reasoning

export type ModelChoice = 'haiku' | 'sonnet';

export interface RouteResult {
  queryType: QueryType;
  model: ModelChoice;
  context?: string; // KB snippet relevant to query
  shouldUseMomence?: boolean;
  extractedIntent?: {
    style?: string;
    day?: string;
    timeRange?: 'morning' | 'afternoon' | 'evening';
  };
  confidence: number; // 0-1, how confident we are in the routing
}

export interface RoutingMetrics {
  haiku_calls: number;
  sonnet_calls: number;
  query_type_distribution: Record<QueryType, number>;
}

// ============================================================================
// QUERY ROUTER CLASS
// ============================================================================

export class QueryRouter {
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
   * Route a query to the appropriate model and prepare context
   */
  async route(text: string, lang: SupportedLanguage): Promise<RouteResult> {
    const lowerText = text.toLowerCase().trim();

    // 1. Saludos simples → Template (sin API call)
    if (this.isGreeting(lowerText)) {
      return {
        queryType: 'greeting',
        model: 'haiku',
        confidence: 0.95,
      };
    }

    // 2. Intent de reserva → Booking flow (Haiku)
    if (this.isBookingIntent(lowerText)) {
      return {
        queryType: 'booking_intent',
        model: 'haiku',
        confidence: 0.9,
      };
    }

    // 3. Queries de miembro → Haiku
    if (this.isMemberQuery(lowerText)) {
      return {
        queryType: 'member_query',
        model: 'haiku',
        confidence: 0.85,
      };
    }

    // 4. Objeciones → Handler especializado (Haiku)
    if (this.isObjection(lowerText)) {
      return {
        queryType: 'objection',
        model: 'haiku',
        confidence: 0.85,
      };
    }

    // 5. Query de horarios → Momence + Haiku
    const scheduleIntent = this.detectScheduleIntent(lowerText);
    if (scheduleIntent.isScheduleQuery) {
      return {
        queryType: 'schedule_query',
        model: 'haiku',
        shouldUseMomence: true,
        extractedIntent: {
          style: scheduleIntent.style,
          day: scheduleIntent.day,
          timeRange: scheduleIntent.timeRange,
        },
        confidence: 0.9,
      };
    }

    // 6. Comparación de estilos → Sonnet (necesita razonamiento)
    if (this.isStyleComparison(lowerText)) {
      return {
        queryType: 'style_comparison',
        model: 'sonnet',
        context: this.getStyleComparisonContext(lowerText),
        confidence: 0.85,
      };
    }

    // 7. Info sobre un estilo específico → Haiku + contexto
    const styleInfo = this.detectStyleInfoQuery(lowerText);
    if (styleInfo.isStyleQuery && styleInfo.style) {
      return {
        queryType: 'style_info',
        model: 'haiku',
        context: this.getStyleContext(styleInfo.style),
        confidence: 0.85,
      };
    }

    // 8. FAQ simple → Haiku + snippet de KB
    const faqMatch = this.findFAQMatch(lowerText, lang);
    if (faqMatch) {
      return {
        queryType: 'faq_simple',
        model: 'haiku',
        context: faqMatch.answer,
        confidence: faqMatch.confidence,
      };
    }

    // 9. Query compleja → Sonnet + KB completo
    // Check for complexity indicators
    const complexityScore = this.calculateComplexity(lowerText);

    if (complexityScore > 0.6) {
      return {
        queryType: 'complex',
        model: 'sonnet',
        context: this.getFullKBContext(lang),
        confidence: 0.7,
      };
    }

    // Default: Use Haiku with full context for moderate complexity
    return {
      queryType: 'faq_simple',
      model: 'haiku',
      context: this.getFullKBContext(lang),
      confidence: 0.6,
    };
  }

  /**
   * Generate response using the routed model
   */
  async generateResponse(
    text: string,
    lang: SupportedLanguage,
    route: RouteResult,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    additionalContext?: string
  ): Promise<string> {
    const startTime = Date.now();
    const model = route.model === 'haiku' ? MODEL_HAIKU : MODEL_SONNET;

    // Build context
    let context = route.context || '';

    // Fetch schedule context if needed (using MomenceService)
    if (route.shouldUseMomence) {
      const scheduleContext = await this.fetchScheduleContext(route);
      if (scheduleContext) {
        context += '\n\n' + scheduleContext;
      }
    }

    if (additionalContext) {
      context += '\n\n' + additionalContext;
    }

    const systemPrompt = this.buildSystemPrompt(lang, context, route.queryType);

    // Build messages array with conversation history
    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory.slice(-6), // Last 6 messages for context
      { role: 'user', content: text },
    ];

    try {
      const response = await this.anthropic.messages.create({
        model,
        max_tokens: route.model === 'haiku' ? 400 : 600,
        system: systemPrompt,
        messages,
      });

      const elapsed = Date.now() - startTime;

      // Track metrics
      await this.trackRouting(route, elapsed);

      const textBlock = response.content.find(b => b.type === 'text');
      return textBlock?.type === 'text' ? textBlock.text : '';
    } catch (error) {
      console.error(`[query-router] ${route.model} API error:`, error);

      // Fallback: if Sonnet fails, try Haiku
      if (route.model === 'sonnet') {
        console.log('[query-router] Falling back to Haiku');
        return this.generateResponse(
          text,
          lang,
          { ...route, model: 'haiku' },
          conversationHistory,
          additionalContext
        );
      }

      throw error;
    }
  }

  // ============================================================================
  // DETECTION HELPERS
  // ============================================================================

  private isGreeting(text: string): boolean {
    const greetings = [
      'hola',
      'hello',
      'hi',
      'hey',
      'buenas',
      'buenos dias',
      'buenos días',
      'buenas tardes',
      'buenas noches',
      'bon dia',
      'bona tarda',
      'salut',
      'bonjour',
      'bonsoir',
      'que tal',
      'qué tal',
      "what's up",
      'howdy',
    ];

    // Check if message is ONLY a greeting (not greeting + question)
    const isOnlyGreeting = greetings.some(g => text === g || text === g + '!' || text === g + '?');

    // Or starts with greeting but is short
    const startsWithGreeting =
      greetings.some(g => text.startsWith(g + ' ') || text.startsWith(g + ',')) && text.length < 30;

    return isOnlyGreeting || startsWithGreeting;
  }

  private isBookingIntent(text: string): boolean {
    const bookingKeywords = [
      'reservar',
      'reserva',
      'apuntar',
      'apuntarme',
      'inscribir',
      'inscribirme',
      'book',
      'booking',
      'sign up',
      'register',
      'probar',
      'clase de prueba',
      'trial class',
      'quiero ir',
      'me gustaría ir',
      'puedo ir',
      'cómo me apunto',
      'como me apunto',
      'vull reservar',
      "m'apunto",
      'je veux réserver',
    ];
    return bookingKeywords.some(kw => text.includes(kw));
  }

  private isMemberQuery(text: string): boolean {
    const memberKeywords = [
      'mi cuenta',
      'mis clases',
      'mis créditos',
      'mis creditos',
      'cuántas clases me quedan',
      'cuantas clases me quedan',
      'mi membresía',
      'mi membresia',
      'cancelar mi',
      'my account',
      'my classes',
      'my credits',
      'cancel my',
      'el meu compte',
      'les meves classes',
      'mon compte',
      'mes cours',
    ];
    return memberKeywords.some(kw => text.includes(kw));
  }

  private isObjection(text: string): boolean {
    const objectionKeywords = [
      // Price objections
      'caro',
      'cara',
      'expensive',
      'mucho dinero',
      'no puedo pagar',
      'muy caro',
      'precio alto',
      // Time objections
      'no tengo tiempo',
      'no time',
      'muy ocupado',
      'too busy',
      'horarios no me van',
      // Location objections
      'lejos',
      'far',
      'muy lejos',
      'no me pilla bien',
      // Skill objections
      'no sé bailar',
      'no se bailar',
      "can't dance",
      "don't know how",
      'nunca he bailado',
      'soy muy malo',
      'tengo dos pies izquierdos',
      // Commitment objections
      'no estoy seguro',
      'lo tengo que pensar',
      'need to think',
      'maybe later',
      'quizás más adelante',
    ];
    return objectionKeywords.some(kw => text.includes(kw));
  }

  private detectScheduleIntent(text: string): {
    isScheduleQuery: boolean;
    style?: string;
    day?: string;
    timeRange?: 'morning' | 'afternoon' | 'evening';
  } {
    const scheduleKeywords = [
      'horario',
      'horarios',
      'hora',
      'horas',
      'cuando',
      'cuándo',
      'clase',
      'clases',
      'hay',
      'tienen',
      'schedule',
      'timetable',
      'when',
      'what time',
      'quin dia',
      'quins dies',
      'quand',
      'quel jour',
    ];

    const isScheduleQuery = scheduleKeywords.some(kw => text.includes(kw));

    if (!isScheduleQuery) {
      return { isScheduleQuery: false };
    }

    // Detect style using centralized STYLE_KEYWORDS
    let detectedStyle: string | undefined;
    for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
        detectedStyle = style;
        break;
      }
    }

    // Detect day
    let day: string | undefined;
    const dayPatterns: Record<string, string[]> = {
      hoy: ['hoy', 'today', 'avui', "aujourd'hui"],
      mañana: ['mañana', 'tomorrow', 'demà', 'demain'],
      lunes: ['lunes', 'monday', 'dilluns', 'lundi'],
      martes: ['martes', 'tuesday', 'dimarts', 'mardi'],
      miércoles: ['miércoles', 'miercoles', 'wednesday', 'dimecres', 'mercredi'],
      jueves: ['jueves', 'thursday', 'dijous', 'jeudi'],
      viernes: ['viernes', 'friday', 'divendres', 'vendredi'],
      sábado: ['sábado', 'sabado', 'saturday', 'dissabte', 'samedi'],
      domingo: ['domingo', 'sunday', 'diumenge', 'dimanche'],
      semana: ['esta semana', 'this week', 'aquesta setmana', 'cette semaine'],
    };

    for (const [dayKey, patterns] of Object.entries(dayPatterns)) {
      if (patterns.some(p => text.includes(p))) {
        day = dayKey;
        break;
      }
    }

    // Detect time range
    let timeRange: 'morning' | 'afternoon' | 'evening' | undefined;
    if (
      text.includes('por la mañana') ||
      text.includes('morning') ||
      text.includes('matí') ||
      text.includes('matin')
    ) {
      timeRange = 'morning';
    } else if (
      text.includes('por la tarde') ||
      text.includes('afternoon') ||
      text.includes('tarda') ||
      text.includes('après-midi')
    ) {
      timeRange = 'afternoon';
    } else if (
      text.includes('por la noche') ||
      text.includes('evening') ||
      text.includes('nit') ||
      text.includes('soir')
    ) {
      timeRange = 'evening';
    }

    return {
      isScheduleQuery: true,
      style: detectedStyle,
      day,
      timeRange,
    };
  }

  private isStyleComparison(text: string): boolean {
    const comparisonKeywords = [
      'diferencia',
      'diferencias',
      'difference',
      'vs',
      'versus',
      'comparar',
      'compare',
      'mejor',
      'which is better',
      'cuál es mejor',
      'cual es mejor',
      'qué me recomiendas',
      'que me recomiendas',
      'o',
      'or', // "salsa o bachata"
    ];

    // Check for comparison patterns
    const hasComparisonKeyword = comparisonKeywords.some(kw => text.includes(kw));

    // Also check for "X o Y" pattern with dance styles
    let styleCount = 0;
    for (const keywords of Object.values(STYLE_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
        styleCount++;
      }
    }

    return hasComparisonKeyword || styleCount >= 2;
  }

  private detectStyleInfoQuery(text: string): {
    isStyleQuery: boolean;
    style?: string;
  } {
    const styleInfoKeywords = [
      'qué es',
      'que es',
      'what is',
      "qu'est-ce que",
      'cuéntame sobre',
      'cuentame sobre',
      'tell me about',
      'info sobre',
      'información sobre',
      'explicame',
      'explícame',
      'explain',
    ];

    const hasInfoKeyword = styleInfoKeywords.some(kw => text.includes(kw));

    // Detect which style
    let detectedStyle: string | undefined;
    for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
        detectedStyle = style;
        break;
      }
    }

    return {
      isStyleQuery: hasInfoKeyword && !!detectedStyle,
      style: detectedStyle,
    };
  }

  private findFAQMatch(
    text: string,
    lang: SupportedLanguage
  ): { answer: string; confidence: number; isOperational?: boolean } | null {
    // First, check OPERATIONAL_FAQS for account/booking questions
    // These are high-priority customer service questions
    const operationalMatch = this.findOperationalFAQ(text);
    if (operationalMatch) {
      return {
        answer: operationalMatch.answer,
        confidence: operationalMatch.confidence,
        isOperational: true,
      };
    }

    // Then check regular FAQs
    const faqs: FAQ[] = FAQS[lang] || FAQS.es;

    let bestMatch: { faq: FAQ; score: number } | null = null;

    for (const faq of faqs) {
      // Count matching keywords
      const matchedKeywords = faq.keywords.filter(kw => text.includes(kw.toLowerCase()));
      const score = matchedKeywords.length / faq.keywords.length;

      if (matchedKeywords.length >= 1 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { faq, score };
      }
    }

    if (bestMatch) {
      return {
        answer: bestMatch.faq.answer,
        confidence: Math.min(0.9, 0.5 + bestMatch.score * 0.4),
      };
    }

    return null;
  }

  /**
   * Find matching operational FAQ for account/booking questions
   * These are critical customer service questions about:
   * - Account access, login, password
   * - Reservations, cancellations, recovery
   * - Subscriptions, pauses, unsubscribe
   * - Credits, packs, payments
   */
  private findOperationalFAQ(text: string): { answer: string; confidence: number } | null {
    const entries = Object.entries(OPERATIONAL_FAQS);

    let bestMatch: { key: string; answer: string; score: number } | null = null;

    for (const [key, faq] of entries) {
      const matchedKeywords = faq.keywords.filter((kw: string) => text.includes(kw.toLowerCase()));
      const score = matchedKeywords.length / faq.keywords.length;

      if (matchedKeywords.length >= 1 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { key, answer: faq.answer, score };
      }
    }

    if (bestMatch) {
      return {
        answer: bestMatch.answer,
        // Higher confidence for operational FAQs (these are precise answers)
        confidence: Math.min(0.95, 0.6 + bestMatch.score * 0.35),
      };
    }

    return null;
  }

  private calculateComplexity(text: string): number {
    let score = 0;

    // Length factor (longer = potentially more complex)
    if (text.length > 100) score += 0.2;
    if (text.length > 200) score += 0.2;

    // Question count
    const questionMarks = (text.match(/\?/g) || []).length;
    if (questionMarks > 1) score += 0.2 * questionMarks;

    // Multiple topics
    let topicCount = 0;
    const topics = ['precio', 'horario', 'profesor', 'estilo', 'ubicación', 'nivel'];
    for (const topic of topics) {
      if (text.includes(topic)) topicCount++;
    }
    if (topicCount > 1) score += 0.15 * topicCount;

    // Conjunctions suggesting complexity
    const complexConjunctions = [
      'además',
      'también',
      'y también',
      'pero',
      'sin embargo',
      'although',
    ];
    for (const conj of complexConjunctions) {
      if (text.includes(conj)) score += 0.1;
    }

    return Math.min(1, score);
  }

  // ============================================================================
  // CONTEXT BUILDERS
  // ============================================================================

  private getStyleContext(style: string): string {
    const styleInfo = this.findStyleInfo(style);
    if (!styleInfo) return '';

    return `
INFORMACIÓN SOBRE ${style.toUpperCase()}:
${styleInfo.description || "Estilo de baile disponible en Farray's."}

Categoría: ${styleInfo.category || 'Urbano'}
Niveles disponibles: Iniciación, Básico, Intermedio, Avanzado

Primera clase GRATIS para probar.
    `.trim();
  }

  private findStyleInfo(style: string): { description?: string; category?: string } | null {
    // Search in DANCE_STYLES
    for (const category of Object.values(DANCE_STYLES)) {
      for (const s of category.styles) {
        const styleName = typeof s === 'string' ? s : s.name;
        if (styleName.toLowerCase().includes(style.toLowerCase())) {
          return {
            description: typeof s === 'string' ? undefined : s.description,
            category: category.name,
          };
        }
      }
    }
    return null;
  }

  private getStyleComparisonContext(text: string): string {
    // Detect which styles are being compared
    const mentionedStyles: string[] = [];
    for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
        mentionedStyles.push(style);
      }
    }

    return `
COMPARACIONES DE ESTILOS DE BAILE:

${
  mentionedStyles.includes('salsa') || mentionedStyles.includes('bachata')
    ? `
Salsa Cubana vs Bachata:
- Salsa: Ritmo rápido (180+ BPM), movimientos circulares, giros, origen Cuba
- Bachata: Ritmo lento (130 BPM), movimientos sensuales de cadera, origen República Dominicana
- Salsa es más energética; Bachata es más íntima
`
    : ''
}

${
  mentionedStyles.includes('hiphop') || mentionedStyles.includes('reparto')
    ? `
Hip Hop vs Reggaeton:
- Hip Hop: Origen USA, técnica de aislamiento, popping, locking, freestyle
- Reggaeton: Origen latino, movimientos de cadera, perreo, dembow
- Hip Hop es más técnico; Reggaeton es más sensual
`
    : ''
}

${
  mentionedStyles.includes('heels') || mentionedStyles.includes('femmology')
    ? `
Heels vs Femmology:
- Heels: Coreografía con tacones stiletto, técnica de caminar
- Femmology: Empoderamiento femenino, actitud, no requiere tacones
- Ambos trabajan feminidad; Heels añade dificultad del tacón
`
    : ''
}

${
  mentionedStyles.includes('contemporaneo') || mentionedStyles.includes('ballet')
    ? `
Ballet vs Contemporáneo:
- Ballet: Técnica clásica, puntas, posiciones definidas, disciplina
- Contemporáneo: Más libre, expresión emocional, fusión de técnicas
- Ballet es la base; Contemporáneo es más experimental
`
    : ''
}

En Farray's ofrecemos todos estos estilos con profesores especializados.
Primera clase GRATIS para que pruebes el que más te llame.
    `.trim();
  }

  private getFullKBContext(lang: SupportedLanguage): string {
    // Build comprehensive context (~2KB)
    const langTexts: Record<SupportedLanguage, { priceLabel: string; trialLabel: string }> = {
      es: { priceLabel: 'PRECIOS', trialLabel: 'Primera clase GRATIS' },
      ca: { priceLabel: 'PREUS', trialLabel: 'Primera classe GRATIS' },
      en: { priceLabel: 'PRICES', trialLabel: 'First class FREE' },
      fr: { priceLabel: 'PRIX', trialLabel: 'Premier cours GRATUIT' },
    };

    const texts = langTexts[lang];

    return `
INFORMACIÓN DEL CENTRO:
- Nombre: ${CENTER_INFO.name}
- Dirección: ${CENTER_INFO.address}, ${CENTER_INFO.postalCode} ${CENTER_INFO.city}
- Barrio: Eixample, cerca de Plaza España
- Teléfono/WhatsApp: ${CENTER_INFO.phone}
- Email: ${CENTER_INFO.email}
- Web: ${CENTER_INFO.website}
- Metro: Rocafort (L1, 4 min) o Entença (L5, 5 min)

${texts.priceLabel}:
- 1 clase/semana: ${PRICING.memberships.oneClassPerWeek.price}€/mes
- 2 clases/semana: ${PRICING.memberships.twoClassesPerWeek.price}€/mes (la más popular)
- 3 clases/semana: ${PRICING.memberships.threeClassesPerWeek.price}€/mes
- Ilimitado: ${PRICING.memberships.unlimited.price}€/mes
- Clase suelta: ${PRICING.singleClass}€
- Matrícula: GRATIS (normalmente ${PRICING.registration.normal}€)
- ${texts.trialLabel}

PROFESORES DESTACADOS:
- Yunaisy Farray: Fundadora, Salsa Cubana, Contemporáneo. Creadora del Método Farray®.
- Mathias Font: Bachata Sensual. Campeón Mundial Salsa LA.
- Eugenia Trujillo: Bachata Sensual. Campeona Mundial Salsa LA.
- Sandra Gómez: Twerk. Especialista en danzas urbanas.

25+ ESTILOS: Salsa Cubana, Bachata, Reggaeton, Hip Hop, Heels, Twerk, Ballet, Contemporáneo, K-Pop, Afrobeat, Dancehall, Stretching, y más.

HORARIOS: Clases de lunes a viernes, mañanas (10:00-13:00) y tardes (17:30-23:00).

POLÍTICAS IMPORTANTES:
- Reservas: Obligatorias por app Momence. Check-in al llegar.
- Cancelaciones: Mínimo ${CUSTOMER_POLICIES.cancellation.minimumNoticeHours}h de antelación.
- Recuperar clases: ${CUSTOMER_POLICIES.cancellation.recoveryPeriodDays} días para recuperar (solo miembros activos).
- Baja: Avisar con ${CUSTOMER_POLICIES.membership.unsubscribeNoticesDays} días por email a ${CUSTOMER_POLICIES.membership.unsubscribeEmail}.
- Pausas: Cuota mantenimiento ${CUSTOMER_POLICIES.membership.pauseMaintenanceFee}€/mes, avisar ${CUSTOMER_POLICIES.membership.pauseNoticesDays} días antes.
- Bonos: Válidos ${CUSTOMER_POLICIES.classPacks.validityMonths} meses desde primera reserva.
- Matrícula: ${CUSTOMER_POLICIES.registration.firstYear}€ primer año, ${CUSTOMER_POLICIES.registration.renewalAnnual}€ renovación.
    `.trim();
  }

  // ============================================================================
  // SYSTEM PROMPT BUILDER
  // ============================================================================

  private buildSystemPrompt(
    lang: SupportedLanguage,
    context: string,
    queryType: QueryType
  ): string {
    const langInstructions: Record<SupportedLanguage, string> = {
      es: 'Responde en español. Tutea al usuario, sé cercana y cálida.',
      ca: "Respon en català. Tuteja l'usuari, sigues propera i càlida.",
      en: 'Reply in English. Be friendly, warm, and approachable.',
      fr: "Réponds en français. Tutoie l'utilisateur, sois chaleureuse.",
    };

    // Adjust instructions based on query type
    let specificInstructions = '';
    switch (queryType) {
      case 'greeting':
        specificInstructions = 'Saluda con energía y ofrece ayuda.';
        break;
      case 'faq_simple':
        specificInstructions = 'Responde de forma directa y concisa.';
        break;
      case 'schedule_query':
        specificInstructions = 'Muestra los horarios de forma clara y organizada.';
        break;
      case 'style_comparison':
        specificInstructions = 'Explica las diferencias de forma educativa, sin favoritismos.';
        break;
      case 'objection':
        specificInstructions = 'Empatiza primero, luego ofrece soluciones.';
        break;
      case 'complex':
        specificInstructions = 'Responde de forma completa pero organizada.';
        break;
      default:
        specificInstructions = 'Sé útil y guía hacia la reserva de clase de prueba.';
    }

    return `Eres Laura, coordinadora de Farray's International Dance Center (27 años, bailarina desde hace 8 años).

PERSONALIDAD:
- Cercana, entusiasta, profesional pero informal
- Usas emojis con moderación (1-2 por mensaje, máximo)
- Muletillas: "mira", "a ver", "pues", "ostras"
- Respuestas cortas (máximo 3 párrafos)

REGLAS CRÍTICAS:
- SOLO usa la información proporcionada abajo
- Si no sabes algo, di "tendría que confirmarlo con el equipo"
- NUNCA inventes información sobre profesores, precios o horarios
- Guía hacia reservar clase de prueba GRATIS cuando sea apropiado

${langInstructions[lang]}

${specificInstructions}

${context ? `\nINFORMACIÓN DISPONIBLE:\n${context}` : ''}`;
  }

  // ============================================================================
  // MOMENCE INTEGRATION
  // ============================================================================

  /**
   * Fetch schedule context using MomenceService
   * Returns formatted session list for context injection
   */
  async fetchScheduleContext(route: RouteResult): Promise<string> {
    if (!route.shouldUseMomence || !route.extractedIntent) {
      return '';
    }

    try {
      const momenceService = getMomenceService(this.redis);
      const sessions = await momenceService.queryClasses({
        style: route.extractedIntent.style,
        dayOfWeek: route.extractedIntent.day,
        timeRange: route.extractedIntent.timeRange,
        daysAhead: 7,
        includeFullClasses: true, // Show full classes for waitlist
        limit: 10,
      });

      if (sessions.length === 0) {
        return `No hay clases de ${route.extractedIntent.style || 'ese estilo'} disponibles${route.extractedIntent.day ? ` el ${route.extractedIntent.day}` : ''}.`;
      }

      // Format for context
      const lines = ['CLASES DISPONIBLES:'];
      for (const s of sessions) {
        const status = s.isFull ? ' [LLENA]' : ` (${s.spotsAvailable} plazas)`;
        lines.push(
          `- ${s.dayOfWeek} ${s.date} ${s.time}: ${s.name}${s.instructor ? ` con ${s.instructor}` : ''}${status}`
        );
      }

      return lines.join('\n');
    } catch (error) {
      console.error('[query-router] Momence fetch error:', error);
      return 'No he podido consultar los horarios ahora mismo.';
    }
  }

  /**
   * Get formatted sessions for WhatsApp display
   */
  async getFormattedSchedule(
    style?: string,
    day?: string,
    timeRange?: 'morning' | 'afternoon' | 'evening'
  ): Promise<NormalizedSession[]> {
    const momenceService = getMomenceService(this.redis);
    return momenceService.queryClasses({
      style,
      dayOfWeek: day,
      timeRange,
      daysAhead: 7,
      limit: 8,
    });
  }

  // ============================================================================
  // METRICS TRACKING
  // ============================================================================

  private async trackRouting(route: RouteResult, responseTimeMs: number): Promise<void> {
    if (!this.redis) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const metricsKey = `agent:routing:${today}`;

      // Track model usage (legacy key)
      await this.redis.hincrby(metricsKey, route.model, 1);

      // Track query type
      await this.redis.hincrby(metricsKey, `type:${route.queryType}`, 1);

      // Track response time (rolling average would be better but this is simpler)
      await this.redis.hincrby(metricsKey, `${route.model}_total_ms`, responseTimeMs);

      // Set TTL (7 days)
      await this.redis.expire(metricsKey, 7 * 24 * 60 * 60);

      // Fase 6: Track in centralized metrics system
      const metrics = getAgentMetrics(this.redis);
      await Promise.all([
        metrics.trackModelUsage(route.model, responseTimeMs),
        metrics.trackQuery(route.queryType),
      ]);

      console.log(
        `[query-router] ${route.model} | ${route.queryType} | ${responseTimeMs}ms | conf: ${route.confidence.toFixed(2)}`
      );
    } catch (error) {
      console.warn('[query-router] Metrics tracking error:', error);
    }
  }

  /**
   * Get routing metrics for a specific day
   */
  async getMetrics(date?: string): Promise<RoutingMetrics | null> {
    if (!this.redis) return null;

    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const metricsKey = `agent:routing:${targetDate}`;
      const data = await this.redis.hgetall(metricsKey);

      if (!data || Object.keys(data).length === 0) return null;

      return {
        haiku_calls: parseInt(String(data['haiku'] || '0'), 10),
        sonnet_calls: parseInt(String(data['sonnet'] || '0'), 10),
        query_type_distribution: {
          greeting: parseInt(String(data['type:greeting'] || '0'), 10),
          faq_simple: parseInt(String(data['type:faq_simple'] || '0'), 10),
          schedule_query: parseInt(String(data['type:schedule_query'] || '0'), 10),
          style_info: parseInt(String(data['type:style_info'] || '0'), 10),
          style_comparison: parseInt(String(data['type:style_comparison'] || '0'), 10),
          booking_intent: parseInt(String(data['type:booking_intent'] || '0'), 10),
          member_query: parseInt(String(data['type:member_query'] || '0'), 10),
          objection: parseInt(String(data['type:objection'] || '0'), 10),
          complex: parseInt(String(data['type:complex'] || '0'), 10),
        },
      };
    } catch (error) {
      console.error('[query-router] Get metrics error:', error);
      return null;
    }
  }
}

// ============================================================================
// SINGLETON & EXPORTS
// ============================================================================

let routerInstance: QueryRouter | null = null;

/**
 * Get singleton QueryRouter instance
 */
export function getQueryRouter(redis: Redis | null = null): QueryRouter {
  if (!routerInstance) {
    routerInstance = new QueryRouter(redis);
  }
  return routerInstance;
}
