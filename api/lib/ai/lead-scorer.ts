/**
 * Lead Scorer - Behavioral Lead Scoring System
 *
 * Scores leads based on their behavior during conversations.
 * No ML required - uses rule-based scoring with configurable weights.
 *
 * Tiers:
 * - Hot (70-100): High intent, ready to convert → Accelerate close
 * - Warm (40-69): Interested but needs nurturing → Send follow-ups
 * - Cold (0-39): Low engagement → Educate about value
 *
 * @see AGENTE.md - Lead Scoring MVP
 */

import type { SupportedLanguage } from './language-detector';

// ============================================================================
// TYPES
// ============================================================================

export type LeadTier = 'hot' | 'warm' | 'cold';

export interface LeadScore {
  score: number; // 0-100
  tier: LeadTier;
  signals: string[];
  lastUpdated: string;
}

export interface ScoringSignal {
  name: string;
  points: number;
  category: 'behavior' | 'engagement' | 'data' | 'conversion';
  description: string;
}

export interface ConversationMetrics {
  messageCount: number;
  avgResponseTimeMs: number;
  sessionDurationMs: number;
  questionsAsked: number;
  mentionedStyles: string[];
}

// ============================================================================
// SCORING RULES
// ============================================================================

/**
 * Scoring rules by category (max 100 points total):
 * - Behavior: 40 pts max (what they ask about)
 * - Engagement: 30 pts max (how they interact)
 * - Data: 30 pts max (info they share)
 */
export const SCORING_RULES: Record<string, ScoringSignal> = {
  // Behavior signals (40 pts max)
  asked_price: {
    name: 'asked_price',
    points: 15,
    category: 'behavior',
    description: 'Asked about pricing',
  },
  asked_schedule: {
    name: 'asked_schedule',
    points: 10,
    category: 'behavior',
    description: 'Asked about class schedules',
  },
  mentioned_booking: {
    name: 'mentioned_booking',
    points: 20,
    category: 'behavior',
    description: 'Mentioned wanting to book/reserve',
  },
  selected_class: {
    name: 'selected_class',
    points: 15,
    category: 'behavior',
    description: 'Selected a specific class',
  },
  asked_location: {
    name: 'asked_location',
    points: 8,
    category: 'behavior',
    description: 'Asked about location/directions',
  },
  asked_trial: {
    name: 'asked_trial',
    points: 18,
    category: 'behavior',
    description: 'Asked about trial class',
  },
  asked_specific_style: {
    name: 'asked_specific_style',
    points: 12,
    category: 'behavior',
    description: 'Asked about a specific dance style',
  },

  // Engagement signals (30 pts max)
  fast_response: {
    name: 'fast_response',
    points: 10,
    category: 'engagement',
    description: 'Responded within 2 minutes',
  },
  multiple_messages: {
    name: 'multiple_messages',
    points: 10,
    category: 'engagement',
    description: 'Sent 3+ messages in conversation',
  },
  positive_sentiment: {
    name: 'positive_sentiment',
    points: 10,
    category: 'engagement',
    description: 'Used positive language/emojis',
  },
  returned_user: {
    name: 'returned_user',
    points: 15,
    category: 'engagement',
    description: 'Returned for another conversation',
  },
  long_session: {
    name: 'long_session',
    points: 8,
    category: 'engagement',
    description: 'Session lasted 5+ minutes',
  },

  // Data signals (30 pts max)
  shared_email: {
    name: 'shared_email',
    points: 15,
    category: 'data',
    description: 'Shared email address',
  },
  shared_name: {
    name: 'shared_name',
    points: 10,
    category: 'data',
    description: 'Shared full name',
  },
  local_phone: {
    name: 'local_phone',
    points: 5,
    category: 'data',
    description: 'Has Spanish phone number (+34)',
  },
  accepted_consents: {
    name: 'accepted_consents',
    points: 12,
    category: 'data',
    description: 'Accepted terms and privacy',
  },

  // Conversion signals (bonus points)
  started_booking: {
    name: 'started_booking',
    points: 25,
    category: 'conversion',
    description: 'Started the booking flow',
  },
  completed_booking: {
    name: 'completed_booking',
    points: 50,
    category: 'conversion',
    description: 'Completed a booking',
  },
  converted: {
    name: 'converted',
    points: 50,
    category: 'conversion',
    description: 'Successfully converted (booking made)',
  },
};

// Tier thresholds
const TIER_THRESHOLDS = {
  hot: 70,
  warm: 40,
  cold: 0,
};

// ============================================================================
// LEAD SCORER CLASS
// ============================================================================

export class LeadScorer {
  private score: number;
  private signals: Set<string>;

  constructor(initialScore = 0, initialSignals: string[] = []) {
    this.score = initialScore;
    this.signals = new Set(initialSignals);
  }

  /**
   * Get current lead score
   */
  getScore(): LeadScore {
    return {
      score: Math.min(100, this.score),
      tier: this.getTier(),
      signals: Array.from(this.signals),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get tier based on score
   */
  getTier(): LeadTier {
    if (this.score >= TIER_THRESHOLDS.hot) return 'hot';
    if (this.score >= TIER_THRESHOLDS.warm) return 'warm';
    return 'cold';
  }

  /**
   * Add a signal and update score
   */
  addSignal(signalName: string): number {
    // Don't add duplicate signals
    if (this.signals.has(signalName)) {
      return this.score;
    }

    const rule = SCORING_RULES[signalName];
    if (rule) {
      this.signals.add(signalName);
      this.score += rule.points;
    }

    return this.score;
  }

  /**
   * Remove a signal (e.g., if user shows disinterest)
   */
  removeSignal(signalName: string): number {
    if (!this.signals.has(signalName)) {
      return this.score;
    }

    const rule = SCORING_RULES[signalName];
    if (rule) {
      this.signals.delete(signalName);
      this.score = Math.max(0, this.score - rule.points);
    }

    return this.score;
  }

  /**
   * Check if lead has a specific signal
   */
  hasSignal(signalName: string): boolean {
    return this.signals.has(signalName);
  }

  /**
   * Get signals by category
   */
  getSignalsByCategory(category: ScoringSignal['category']): string[] {
    return Array.from(this.signals).filter(signal => SCORING_RULES[signal]?.category === category);
  }
}

// ============================================================================
// SIGNAL DETECTION FUNCTIONS
// ============================================================================

/**
 * Detect signals from message text
 */
export function detectSignalsFromMessage(text: string, lang: SupportedLanguage = 'es'): string[] {
  const signals: string[] = [];
  const lowerText = text.toLowerCase();

  // Price interest
  const priceKeywords = {
    es: ['precio', 'cuanto', 'cuánto', 'cuesta', 'tarifa', 'coste', 'euros', '€'],
    ca: ['preu', 'quant', 'costa', 'tarifa', 'euros', '€'],
    en: ['price', 'cost', 'how much', 'rate', 'fee', 'euros', '€'],
    fr: ['prix', 'coût', 'combien', 'tarif', 'euros', '€'],
  };

  if (priceKeywords[lang].some(kw => lowerText.includes(kw))) {
    signals.push('asked_price');
  }

  // Schedule interest
  const scheduleKeywords = {
    es: ['horario', 'hora', 'cuando', 'cuándo', 'día', 'dias', 'lunes', 'martes', 'miércoles'],
    ca: ['horari', 'hora', 'quan', 'dia', 'dies', 'dilluns', 'dimarts', 'dimecres'],
    en: ['schedule', 'time', 'when', 'day', 'monday', 'tuesday', 'wednesday'],
    fr: ['horaire', 'heure', 'quand', 'jour', 'lundi', 'mardi', 'mercredi'],
  };

  if (scheduleKeywords[lang].some(kw => lowerText.includes(kw))) {
    signals.push('asked_schedule');
  }

  // Booking intent
  const bookingKeywords = {
    es: ['reservar', 'reserva', 'apuntar', 'apuntarme', 'inscribir', 'quiero ir'],
    ca: ['reservar', 'apuntar', "m'apunto", 'inscriure', 'vull anar'],
    en: ['book', 'reserve', 'sign up', 'enroll', 'register'],
    fr: ['réserver', 'inscrire', "s'inscrire", 'inscription'],
  };

  if (bookingKeywords[lang].some(kw => lowerText.includes(kw))) {
    signals.push('mentioned_booking');
  }

  // Trial class interest
  const trialKeywords = {
    es: ['probar', 'prueba', 'gratis', 'primera clase', 'clase de prueba'],
    ca: ['provar', 'prova', 'gratis', 'primera classe', 'classe de prova'],
    en: ['try', 'trial', 'free', 'first class', 'test class'],
    fr: ['essayer', 'essai', 'gratuit', 'premier cours', "cours d'essai"],
  };

  if (trialKeywords[lang].some(kw => lowerText.includes(kw))) {
    signals.push('asked_trial');
  }

  // Location interest
  const locationKeywords = {
    es: ['donde', 'dónde', 'direccion', 'dirección', 'ubicacion', 'ubicación', 'llegar', 'metro'],
    ca: ['on', 'adreça', 'ubicació', 'arribar', 'metro'],
    en: ['where', 'location', 'address', 'directions', 'metro', 'subway'],
    fr: ['où', 'adresse', 'emplacement', 'directions', 'métro'],
  };

  if (locationKeywords[lang].some(kw => lowerText.includes(kw))) {
    signals.push('asked_location');
  }

  // Specific style interest
  const styleKeywords = [
    'salsa',
    'bachata',
    'kizomba',
    'hip hop',
    'reggaeton',
    'heels',
    'ballet',
    'contempor',
    'jazz',
    'twerk',
    'dancehall',
    'afro',
    'stretching',
    'fitness',
    'urbano',
    'urban',
  ];

  if (styleKeywords.some(kw => lowerText.includes(kw))) {
    signals.push('asked_specific_style');
  }

  // Positive sentiment
  const positiveKeywords = [
    'genial',
    'perfecto',
    'bien',
    'guay',
    'super',
    'gracias',
    '!',
    '😊',
    '👍',
    '🎉',
    'great',
    'awesome',
    'love',
  ];

  if (positiveKeywords.some(kw => lowerText.includes(kw))) {
    signals.push('positive_sentiment');
  }

  return signals;
}

/**
 * Detect engagement signals from conversation metrics
 */
export function detectEngagementSignals(metrics: ConversationMetrics): string[] {
  const signals: string[] = [];

  // Fast response (< 2 minutes average)
  if (metrics.avgResponseTimeMs > 0 && metrics.avgResponseTimeMs < 2 * 60 * 1000) {
    signals.push('fast_response');
  }

  // Multiple messages (3+)
  if (metrics.messageCount >= 3) {
    signals.push('multiple_messages');
  }

  // Long session (5+ minutes)
  if (metrics.sessionDurationMs >= 5 * 60 * 1000) {
    signals.push('long_session');
  }

  return signals;
}

/**
 * Check if phone is local (Spanish)
 */
export function isLocalPhone(phone: string): boolean {
  const normalized = phone.replace(/\D/g, '');
  return normalized.startsWith('34') || normalized.startsWith('0034');
}

// ============================================================================
// SCORING UTILITIES
// ============================================================================

/**
 * Calculate score from a list of signals
 */
export function calculateScore(signals: string[]): number {
  return signals.reduce((total, signal) => {
    const rule = SCORING_RULES[signal];
    return total + (rule?.points || 0);
  }, 0);
}

/**
 * Get tier from score
 */
export function getTierFromScore(score: number): LeadTier {
  if (score >= TIER_THRESHOLDS.hot) return 'hot';
  if (score >= TIER_THRESHOLDS.warm) return 'warm';
  return 'cold';
}

/**
 * Get recommended action based on tier
 */
export function getRecommendedAction(tier: LeadTier, lang: SupportedLanguage = 'es'): string {
  const actions: Record<LeadTier, Record<SupportedLanguage, string>> = {
    hot: {
      es: 'Ofrecer reserva inmediata con clase de prueba gratis',
      ca: 'Oferir reserva immediata amb classe de prova gratis',
      en: 'Offer immediate booking with free trial class',
      fr: "Proposer réservation immédiate avec cours d'essai gratuit",
    },
    warm: {
      es: 'Enviar información de valor y seguimiento en 24h',
      ca: 'Enviar informació de valor i seguiment en 24h',
      en: 'Send valuable info and follow up in 24h',
      fr: 'Envoyer des informations utiles et suivre dans 24h',
    },
    cold: {
      es: 'Educar sobre beneficios del baile y primera clase gratis',
      ca: 'Educar sobre beneficis del ball i primera classe gratis',
      en: 'Educate about dance benefits and free first class',
      fr: 'Éduquer sur les avantages de la danse et premier cours gratuit',
    },
  };

  return actions[tier][lang];
}

/**
 * Format lead score summary for display
 */
export function formatLeadScoreSummary(
  leadScore: LeadScore,
  lang: SupportedLanguage = 'es'
): string {
  const tierLabels: Record<LeadTier, Record<SupportedLanguage, string>> = {
    hot: { es: '🔥 Caliente', ca: '🔥 Calent', en: '🔥 Hot', fr: '🔥 Chaud' },
    warm: { es: '🌡️ Templado', ca: '🌡️ Temperat', en: '🌡️ Warm', fr: '🌡️ Tiède' },
    cold: { es: '❄️ Frío', ca: '❄️ Fred', en: '❄️ Cold', fr: '❄️ Froid' },
  };

  const action = getRecommendedAction(leadScore.tier, lang);

  return `Lead Score: ${leadScore.score}/100
Tier: ${tierLabels[leadScore.tier][lang]}
Señales: ${leadScore.signals.join(', ')}
Acción: ${action}`;
}
