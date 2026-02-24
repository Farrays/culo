/**
 * Query Classifier - Routes messages to GPT-4.1-mini or Claude Sonnet
 *
 * Pure keyword-based classification (no API calls, no dependencies).
 * Patterns extracted from query-router.ts.
 *
 * - 'needs_tools' → Claude Sonnet (bookings, member queries, schedules)
 * - 'simple' → GPT-4.1-mini (greetings, FAQs, info, objections)
 */

export type QueryComplexity = 'simple' | 'needs_tools';

/**
 * Classify whether a message needs tools (Claude) or is simple (GPT).
 */
export function classifyQuery(text: string): QueryComplexity {
  const lower = text.toLowerCase().trim();

  // Needs tools → Claude Sonnet
  if (isBookingIntent(lower)) return 'needs_tools';
  if (isMemberQuery(lower)) return 'needs_tools';
  if (isScheduleQuery(lower)) return 'needs_tools';
  if (isCancellationIntent(lower)) return 'needs_tools';
  if (isPricingQuery(lower)) return 'needs_tools';
  if (isTrialBookingQuery(lower)) return 'needs_tools';

  // Short message with a dance style + question mark → likely asking about schedule
  if (hasStyleKeyword(lower) && (lower.split(/\s+/).length < 8 || lower.includes('?'))) {
    return 'needs_tools';
  }

  // Simple → GPT-4.1-mini
  return 'simple';
}

// ============================================================================
// DETECTION HELPERS (extracted from query-router.ts)
// ============================================================================

function isBookingIntent(text: string): boolean {
  const keywords = [
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
    'me gustaria ir',
    'puedo ir',
    'cómo me apunto',
    'como me apunto',
    'vull reservar',
    "m'apunto",
    'je veux réserver',
    'quiero una clase',
    'primera clase',
    'free class',
    'first class',
  ];
  return keywords.some(kw => text.includes(kw));
}

function isMemberQuery(text: string): boolean {
  const keywords = [
    'mi cuenta',
    'mis clases',
    'mis créditos',
    'mis creditos',
    'cuántas clases me quedan',
    'cuantas clases me quedan',
    'mi membresía',
    'mi membresia',
    'my account',
    'my classes',
    'my credits',
    'el meu compte',
    'les meves classes',
    'mon compte',
    'mes cours',
    'mi bono',
    'mis bonos',
    'mi suscripción',
    'mi suscripcion',
    'check-in',
    'checkin',
    'check in',
  ];
  return keywords.some(kw => text.includes(kw));
}

function isPricingQuery(text: string): boolean {
  const keywords = [
    'precio',
    'precios',
    'cuánto cuesta',
    'cuanto cuesta',
    'cuánto vale',
    'cuanto vale',
    'price',
    'prices',
    'how much',
    'tarifa',
    'tarifas',
    'mensualidad',
  ];
  return keywords.some(kw => text.includes(kw));
}

function isScheduleQuery(text: string): boolean {
  // Schedule queries need tools
  const scheduleKeywords = [
    'horario',
    'horarios',
    'schedule',
    'timetable',
    'a qué hora',
    'a que hora',
    'cuando',
    'when',
    'hora',
    'horas',
    'que clases',
    'qué clases',
    'what classes',
    'clase de',
    'clases de',
    'quin dia',
    'quins dies',
    'quand',
    'quel jour',
    'saturday',
    'sunday',
    'dissabte',
    'diumenge',
    'samedi',
  ];

  // Direct "is there X class" questions
  const classAvailabilityKeywords = [
    'hay clase',
    'hay clases',
    'tienen clase',
    'tienen clases',
    'hay bachata',
    'hay salsa',
    'hay twerk',
    'hay ballet',
    'hay hip hop',
    'hay kizomba',
    'hay reggaeton',
    'hacéis',
    'haceis',
    'dan clase',
    'dan clases',
    'do you have',
    'do you offer',
    'impartís',
    'impartis',
    'is there a class',
    'are there classes',
    'hi ha classe',
    'hi ha classes',
  ];

  // Check for explicit schedule/availability intent
  if (scheduleKeywords.some(kw => text.includes(kw))) return true;
  if (classAvailabilityKeywords.some(kw => text.includes(kw))) return true;

  // Style + time combination (e.g. "bachata mañana", "salsa el jueves")
  const hasStyle = hasStyleKeyword(text);
  const hasTime = hasTimeKeyword(text);
  if (hasStyle && hasTime) return true;

  return false;
}

function isCancellationIntent(text: string): boolean {
  const keywords = [
    'cancelar mi',
    'cancelar la',
    'quitar reserva',
    'quitar mi reserva',
    'cancel my',
    'cancel the',
    'cancel·lar',
    'annuler',
    'desapuntarme',
    'darme de baja',
    'baja de la clase',
    'cambiar mi reserva',
    'reprogramar',
    'mover mi clase',
  ];
  return keywords.some(kw => text.includes(kw));
}

function isTrialBookingQuery(text: string): boolean {
  const keywords = [
    'cambiar mi reserva',
    'cambiar la reserva',
    'cambiar de día',
    'cambiar de dia',
    'reprogramar',
    'reschedule',
    'mover mi clase',
    'mover la clase',
    'mi reserva',
    'mi clase de prueba',
    'my booking',
    'my trial',
    'my reservation',
    'no puedo ir',
    'no puedo asistir',
    'no voy a poder',
    'cambiar fecha',
    'otro día',
    'otro dia',
    'another day',
    'canviar la reserva',
    'canviar de dia',
    'modifier ma réservation',
    'changer le jour',
  ];
  return keywords.some(kw => text.includes(kw));
}

// ============================================================================
// HELPER DETECTORS
// ============================================================================

function hasStyleKeyword(text: string): boolean {
  const styles = [
    'salsa',
    'bachata',
    'twerk',
    'hip hop',
    'hiphop',
    'ballet',
    'contempor',
    'heels',
    'femmology',
    'sexy style',
    'dancehall',
    'kizomba',
    'afrobeat',
    'afro',
    'k-pop',
    'kpop',
    'reggaeton',
    'reparto',
    'stretching',
    'jazz',
    'folklore',
    'rumba',
    'timba',
    'body conditioning',
    'bum bum',
  ];
  return styles.some(s => text.includes(s));
}

function hasTimeKeyword(text: string): boolean {
  const timeWords = [
    'hoy',
    'mañana',
    'today',
    'tomorrow',
    'lunes',
    'martes',
    'miércoles',
    'miercoles',
    'jueves',
    'viernes',
    'sábado',
    'sabado',
    'domingo',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'esta semana',
    'esta tarde',
    'esta noche',
    'por la mañana',
    'por la tarde',
    'this week',
    'próxima',
    'proxima',
    'next',
    'avui',
    'demà',
    'dema',
    'dilluns',
    'dimarts',
    'dimecres',
    'dijous',
    'divendres',
    'aquesta setmana',
    "aujourd'hui",
    'demain',
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'cette semaine',
  ];
  return timeWords.some(w => text.includes(w));
}
