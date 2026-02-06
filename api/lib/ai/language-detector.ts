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
  ca: [
    /\b(vull|puc|estic|tinc|som|sóc)\b/i, // Verbs
    /\b(classes|informació|gràcies|sisplau|hola|adéu)\b/i, // Common words
    /\b(què|com|quan|on|quant)\b/i, // Question words
    /\b(dilluns|dimarts|dimecres|dijous|divendres|dissabte|diumenge)\b/i, // Days
    /\b(preu|preus|horari|horaris)\b/i, // Key booking terms
    /\b(voldria|m'agradaria|necessito)\b/i, // Want/need
    /\b(el|la|els|les|d'|l')\b.*\b(classe|classes|ball|salsa|bachata)\b/i, // Articles + dance
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
    /\b(quiero|puedo|estoy|tengo|soy|somos)\b/i, // Verbs
    /\b(hola|gracias|por favor|buenos días|buenas tardes)\b/i, // Greetings
    /\b(clase|clases|precio|precios|horario|horarios|información)\b/i, // Key words
    /\b(cómo|cuándo|dónde|cuánto|qué)\b/i, // Question words
    /\b(lunes|martes|miércoles|jueves|viernes|sábado|domingo)\b/i, // Days
    /\b(me gustaría|quisiera|necesito)\b/i, // Want/need
    /\b(reservar|apuntar|inscribir)\b/i, // Booking terms
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

  // Check in order: ca, fr, en, es (Catalan first because it's similar to Spanish)
  const checkOrder: SupportedLanguage[] = ['ca', 'fr', 'en', 'es'];

  for (const lang of checkOrder) {
    if (scores[lang] > bestScore) {
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
