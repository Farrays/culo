/**
 * Language Detector for AI Agent
 *
 * Detects the language of incoming messages (es/ca/en/fr)
 * Uses keyword-based detection for fast, reliable results
 *
 * @see AGENTE.md - Idiomas: 4 (es/ca/en/fr) con detección automática
 */

export type SupportedLanguage = 'es' | 'ca' | 'en' | 'fr';

// Keywords and patterns unique to each language
const LANGUAGE_PATTERNS: Record<SupportedLanguage, RegExp[]> = {
  // Catalan - check first (shares many words with Spanish)
  // IMPORTANTE: NO incluir palabras compartidas con español (hola, gracias, etc.)
  ca: [
    /\b(vull|puc|estic|tinc|sóc)\b/i, // Verbs (quitado "som" - ambiguo)
    /\b(classes|informació|gràcies|sisplau|adéu|benvingut)\b/i, // Catalan-only words
    /\b(què|com\s+estàs|com\s+va|quan|quant)\b/i, // Question words (com solo en frase catalana)
    /\b(dilluns|dimarts|dimecres|dijous|divendres|dissabte|diumenge)\b/i, // Days
    /\b(preu|preus|horaris)\b/i, // Key booking terms (quitado "horari" - similar a español)
    /\b(voldria|m'agradaria)\b/i, // Want/need (quitado "necessito" - similar a español)
    /\b(els|les|d'|l')\b.*\b(classe|classes|ball)\b/i, // Catalan articles + words
    /\b(molt\s+bé|si\s+us\s+plau|bon\s+dia|bona\s+tarda|bona\s+nit)\b/i, // Catalan phrases
  ],

  // French
  fr: [
    /\b(je|tu|il|elle|nous|vous|ils|elles)\b/i, // Pronouns
    /\b(suis|es|est|sommes|êtes|sont)\b/i, // Être conjugation
    /\b(voudrais|veux|peux|puis)\b/i, // Modal verbs
    /\b(bonjour|salut|bonsoir|merci|s'il vous plaît|svp)\b/i, // Greetings
    /\b(cours|classe|prix|horaire|information)\b/i, // Key words
    /\b(comment|quand|où|combien|pourquoi)\b/i, // Question words
    /\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/i, // Days
  ],

  // English
  en: [
    /\b(i|you|he|she|we|they)\b.*\b(want|need|would|can|am|is|are)\b/i, // Pronouns + verbs
    /\b(hello|hi|hey|thanks|thank you|please)\b/i, // Greetings
    /\b(class|classes|price|prices|schedule|information)\b/i, // Key words
    /\b(how|when|where|what|how much)\b/i, // Question words
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, // Days
    /\b(would like|want to|looking for|interested in)\b/i, // Intent phrases
    /\b(book|booking|reserve|sign up)\b/i, // Booking terms
  ],

  // Spanish (default) - checked last
  es: [
    /\b(quiero|puedo|estoy|tengo|soy|somos|voy|hay)\b/i, // Verbs
    /\b(hola|gracias|por favor|buenos días|buenas tardes|buenas|oye|vale|genial)\b/i, // Greetings
    /\b(clase|clases|precio|precios|horario|horarios|información)\b/i, // Key words
    /\b(cómo|cuándo|dónde|cuánto|qué)\b/i, // Question words (con acento)
    /\b(como|cuando|donde|cuanto|que tal)\b/i, // Question words (SIN acento - WhatsApp común)
    /\b(lunes|martes|miércoles|jueves|viernes|sábado|domingo)\b/i, // Days
    /\b(me gustaría|quisiera|necesito|me interesa)\b/i, // Want/need
    /\b(reservar|apuntar|inscribir|apuntarme|reserva)\b/i, // Booking terms
    /\b(muchas gracias|buen día|buenas noches|hasta luego)\b/i, // Common Spanish phrases
  ],
};

// Minimum confidence threshold (number of pattern matches)
const MIN_CONFIDENCE = 1;

/**
 * Detects the language of a text message
 * Returns the most likely language based on keyword matching
 *
 * @param text - The text to analyze
 * @returns The detected language code (defaults to 'es' if uncertain)
 */
export function detectLanguage(text: string): SupportedLanguage {
  if (!text || text.trim().length === 0) {
    return 'es'; // Default to Spanish
  }

  const normalizedText = text.toLowerCase().trim();

  // Count matches for each language
  const scores: Record<SupportedLanguage, number> = {
    ca: 0,
    fr: 0,
    en: 0,
    es: 0,
  };

  // Check patterns for each language
  for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(normalizedText)) {
        scores[lang as SupportedLanguage]++;
      }
    }
  }

  // Find language with highest score
  let bestLang: SupportedLanguage = 'es';
  let bestScore = 0;

  // Check in order: es last so it wins ties (most common language)
  // A non-Spanish language must score STRICTLY higher to win
  const checkOrder: SupportedLanguage[] = ['ca', 'fr', 'en', 'es'];

  for (const lang of checkOrder) {
    // Spanish wins ties (>=), other languages must beat strictly (>)
    if (lang === 'es' ? scores[lang] >= bestScore : scores[lang] > bestScore) {
      bestScore = scores[lang];
      bestLang = lang;
    }
  }

  // Return detected language if confidence is high enough
  if (bestScore >= MIN_CONFIDENCE) {
    return bestLang;
  }

  // Default to Spanish (most common for Barcelona dance school)
  return 'es';
}

/**
 * Gets the language name in that language (for greeting)
 */
export function getLanguageName(lang: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    es: 'Español',
    ca: 'Català',
    en: 'English',
    fr: 'Français',
  };
  return names[lang];
}

/**
 * Check if a language is supported
 */
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return ['es', 'ca', 'en', 'fr'].includes(lang);
}
