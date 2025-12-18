/**
 * Horarios Page Data Configuration (Enterprise)
 * ==============================================
 *
 * Datos específicos para la página /horarios-clases-baile-barcelona
 * Estructura Enterprise 10/10 con:
 * - Bloques de tiempo organizados
 * - Badges de demanda/escasez
 * - Testimonios inline
 * - FAQ específicos de horarios
 * - Schema markup data
 *
 * IMPORTANTE: Este archivo extiende schedule-data.ts para la página de horarios.
 */

import {
  SCHEDULE_DATA,
  type ScheduleClass,
  type CategoryKey,
  type DayKey,
  type LevelKey,
} from './schedule-data';

// ============================================================================
// TYPES
// ============================================================================

export type TimeBlock = 'morning' | 'afternoon' | 'evening';
export type BadgeType = 'popular' | 'limited' | 'new' | 'small-group';

export interface ScheduleBadge {
  type: BadgeType;
  i18nKey: string;
  icon: string;
}

export interface ScheduleBlockConfig {
  id: string;
  timeBlock: TimeBlock;
  titleKey: string;
  subtitleKey: string;
  icon: string;
  colorClass: string;
  categories: CategoryKey[];
  testimonialKey?: string;
  testimonialAuthorKey?: string;
  ctaKey: string;
  ctaContext: string;
  anchorId: string;
}

export interface LevelInfo {
  id: LevelKey;
  i18nKey: string;
  descriptionKey: string;
  icon: string;
}

export interface FAQItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

// ============================================================================
// BADGES CONFIGURATION
// ============================================================================

export const SCHEDULE_BADGES: Record<BadgeType, ScheduleBadge> = {
  popular: {
    type: 'popular',
    i18nKey: 'horariosV2_badge_popular',
    icon: '🔥',
  },
  limited: {
    type: 'limited',
    i18nKey: 'horariosV2_badge_limited',
    icon: '⚡',
  },
  new: {
    type: 'new',
    i18nKey: 'horariosV2_badge_new',
    icon: '✨',
  },
  'small-group': {
    type: 'small-group',
    i18nKey: 'horariosV2_badge_smallGroup',
    icon: '👥',
  },
};

// Classes that have special badges (based on demand/availability)
export const CLASS_BADGES: Record<string, BadgeType[]> = {
  // Popular classes
  Dancehall: ['popular', 'limited'],
  'Dancehall Female': ['popular', 'limited'],
  'Dancehall Twerk': ['popular'],
  Twerk: ['popular'],
  'Sexy Reggaeton': ['popular'],
  'Hip Hop Reggaeton': ['popular'],
  Femmology: ['popular'],
  'Salsa Lady Style': ['popular'],
  'Contemporáneo Lírico': ['popular'],
  'Afro Contemporáneo': ['popular'],
  Afrobeat: ['popular'],
  // Limited spots
  Ballet: ['small-group'],
  'Timba en Pareja': ['limited'],
  // New classes
  'Folklore Cubano': ['new'],
};

// ============================================================================
// TIME BLOCK FILTERS
// ============================================================================

export const TIME_BLOCKS = [
  {
    id: 'morning' as TimeBlock,
    i18nKey: 'horariosV2_filter_morning',
    icon: '🕘',
    anchorId: 'mananas',
    timeRange: '09:00 - 13:00',
  },
  {
    id: 'afternoon' as TimeBlock,
    i18nKey: 'horariosV2_filter_afternoon',
    icon: '🌇',
    anchorId: 'tardes',
    timeRange: '17:00 - 19:00',
  },
  {
    id: 'evening' as TimeBlock,
    i18nKey: 'horariosV2_filter_evening',
    icon: '🌙',
    anchorId: 'noches',
    timeRange: '19:00 - 22:00',
  },
];

// ============================================================================
// STYLE CATEGORY FILTERS
// ============================================================================

export const STYLE_CATEGORIES = [
  {
    id: 'danza' as CategoryKey,
    i18nKey: 'horariosV2_filter_danza',
    styles: ['Afro', 'Jazz', 'Ballet', 'Contemporáneo'],
    icon: '🩰',
  },
  {
    id: 'latino' as CategoryKey,
    i18nKey: 'horariosV2_filter_latino',
    styles: ['Salsa', 'Bachata', 'Timba'],
    icon: '💃',
  },
  {
    id: 'urbano' as CategoryKey,
    i18nKey: 'horariosV2_filter_urbano',
    styles: ['Urbano', 'Reggaeton', 'Heels', 'Dancehall'],
    icon: '🔥',
  },
  {
    id: 'fitness' as CategoryKey,
    i18nKey: 'horariosV2_filter_fitness',
    styles: ['Stretching', 'Bum Bum', 'Preparación física'],
    icon: '💪',
  },
];

// ============================================================================
// SCHEDULE BLOCK CONFIGURATIONS
// ============================================================================

export const SCHEDULE_BLOCK_CONFIGS: ScheduleBlockConfig[] = [
  {
    id: 'morning-block',
    timeBlock: 'morning',
    titleKey: 'horariosV2_block_morning_title',
    subtitleKey: 'horariosV2_block_morning_subtitle',
    icon: '🟢',
    colorClass: 'emerald',
    categories: ['danza', 'fitness', 'urbano'],
    testimonialKey: 'horariosV2_testimonial_morning',
    testimonialAuthorKey: 'horariosV2_testimonial_morning_author',
    ctaKey: 'horariosV2_cta_morning',
    ctaContext: 'horarios de mañana',
    anchorId: 'mananas',
  },
  {
    id: 'evening-danza-block',
    timeBlock: 'evening',
    titleKey: 'horariosV2_block_evening_title',
    subtitleKey: 'horariosV2_block_evening_subtitle',
    icon: '🌇',
    colorClass: 'amber',
    categories: ['danza'],
    testimonialKey: 'horariosV2_testimonial_evening',
    testimonialAuthorKey: 'horariosV2_testimonial_evening_author',
    ctaKey: 'horariosV2_cta_evening',
    ctaContext: 'horarios de tarde/noche de danza',
    anchorId: 'tardes-danza',
  },
  {
    id: 'salsa-bachata-block',
    timeBlock: 'evening',
    titleKey: 'horariosV2_block_salsa_title',
    subtitleKey: 'horariosV2_block_salsa_subtitle',
    icon: '💃',
    colorClass: 'rose',
    categories: ['latino'],
    testimonialKey: 'horariosV2_testimonial_salsa',
    testimonialAuthorKey: 'horariosV2_testimonial_salsa_author',
    ctaKey: 'horariosV2_cta_salsa',
    ctaContext: 'horarios de salsa y bachata',
    anchorId: 'salsa-bachata',
  },
  {
    id: 'urbano-block',
    timeBlock: 'evening',
    titleKey: 'horariosV2_block_urbano_title',
    subtitleKey: 'horariosV2_block_urbano_subtitle',
    icon: '🔥',
    colorClass: 'orange',
    categories: ['urbano'],
    testimonialKey: 'horariosV2_testimonial_urbano',
    testimonialAuthorKey: 'horariosV2_testimonial_urbano_author',
    ctaKey: 'horariosV2_cta_urbano',
    ctaContext: 'horarios de baile urbano',
    anchorId: 'urbano',
  },
];

// ============================================================================
// LEVELS DATA
// ============================================================================

export const LEVELS: LevelInfo[] = [
  {
    id: 'beginner',
    i18nKey: 'horariosV2_level_principiantes',
    descriptionKey: 'horariosV2_level_principiantes_desc',
    icon: '🌱',
  },
  {
    id: 'basic',
    i18nKey: 'horariosV2_level_basico',
    descriptionKey: 'horariosV2_level_basico_desc',
    icon: '📚',
  },
  {
    id: 'intermediate',
    i18nKey: 'horariosV2_level_intermedio',
    descriptionKey: 'horariosV2_level_intermedio_desc',
    icon: '🎯',
  },
  {
    id: 'advanced',
    i18nKey: 'horariosV2_level_avanzado',
    descriptionKey: 'horariosV2_level_avanzado_desc',
    icon: '🏆',
  },
  {
    id: 'all',
    i18nKey: 'horariosV2_level_open',
    descriptionKey: 'horariosV2_level_open_desc',
    icon: '🌍',
  },
];

// ============================================================================
// DAY TRANSLATIONS
// ============================================================================

export const DAYS_I18N: Record<DayKey, string> = {
  monday: 'horariosV2_day_monday',
  tuesday: 'horariosV2_day_tuesday',
  wednesday: 'horariosV2_day_wednesday',
  thursday: 'horariosV2_day_thursday',
  friday: 'horariosV2_day_friday',
  saturday: 'horariosV2_day_saturday',
  sunday: 'horariosV2_day_sunday',
};

// ============================================================================
// AUTHORITY BADGES
// ============================================================================

export const AUTHORITY_BADGES = [
  { icon: '🏆', i18nKey: 'horariosV2_authority_since2017' },
  { icon: '📜', i18nKey: 'horariosV2_authority_cidUnesco' },
  { icon: '👥', i18nKey: 'horariosV2_authority_members' },
  { icon: '💃', i18nKey: 'horariosV2_authority_styles' },
  { icon: '⭐', i18nKey: 'horariosV2_authority_rating' },
  { icon: '🎓', i18nKey: 'horariosV2_authority_teachers' },
];

// ============================================================================
// ORIENTATION POINTS (Anti-anxiety)
// ============================================================================

export const ORIENTATION_POINTS = [
  { icon: '✓', i18nKey: 'horariosV2_orientation_noExperience' },
  { icon: '✓', i18nKey: 'horariosV2_orientation_byLevel' },
  { icon: '✓', i18nKey: 'horariosV2_orientation_startAnytime' },
  { icon: '✓', i18nKey: 'horariosV2_orientation_weHelp' },
];

// ============================================================================
// HOW TO START STEPS
// ============================================================================

export const HOW_TO_START_STEPS = [
  { number: 1, i18nKey: 'horariosV2_howToStart_step1', iconKey: '📩' },
  { number: 2, i18nKey: 'horariosV2_howToStart_step2', iconKey: '📋' },
  { number: 3, i18nKey: 'horariosV2_howToStart_step3', iconKey: '👋' },
  { number: 4, i18nKey: 'horariosV2_howToStart_step4', iconKey: '🎉' },
];

// ============================================================================
// FAQ DATA (SEO optimized for /horarios-clases-baile-barcelona)
// ============================================================================

export const SCHEDULE_FAQ: FAQItem[] = [
  {
    id: 'faq-1',
    questionKey: 'horariosV2_faq1_q',
    answerKey: 'horariosV2_faq1_a',
  },
  {
    id: 'faq-2',
    questionKey: 'horariosV2_faq2_q',
    answerKey: 'horariosV2_faq2_a',
  },
  {
    id: 'faq-3',
    questionKey: 'horariosV2_faq3_q',
    answerKey: 'horariosV2_faq3_a',
  },
  {
    id: 'faq-4',
    questionKey: 'horariosV2_faq4_q',
    answerKey: 'horariosV2_faq4_a',
  },
  {
    id: 'faq-5',
    questionKey: 'horariosV2_faq5_q',
    answerKey: 'horariosV2_faq5_a',
  },
  {
    id: 'faq-6',
    questionKey: 'horariosV2_faq6_q',
    answerKey: 'horariosV2_faq6_a',
  },
  {
    id: 'faq-7',
    questionKey: 'horariosV2_faq7_q',
    answerKey: 'horariosV2_faq7_a',
  },
];

// ============================================================================
// SEASON NOTICE
// ============================================================================

export const SEASON_CONFIG = {
  winter: {
    i18nKey: 'horariosV2_season_winter',
    descKey: 'horariosV2_season_winter_desc',
    months: [9, 10, 11, 12, 1, 2, 3, 4, 5, 6], // Sept - June
    icon: '📅',
  },
  summer: {
    i18nKey: 'horariosV2_season_summer',
    descKey: 'horariosV2_season_summer_desc',
    months: [7, 8], // July - August
    icon: '☀️',
  },
};

// ============================================================================
// WEEKLY AVAILABILITY MATRIX
// ============================================================================

export const WEEK_DAYS: DayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get current season based on month
 */
export const getCurrentSeason = (): 'winter' | 'summer' => {
  const month = new Date().getMonth() + 1; // 1-12
  return SEASON_CONFIG.summer.months.includes(month) ? 'summer' : 'winter';
};

/**
 * Get time block from hour string (e.g., "10:00" -> "morning")
 */
export const getTimeBlock = (time: string): TimeBlock => {
  const hourStr = time.split(':')[0] ?? '0';
  const hour = parseInt(hourStr, 10);
  if (hour < 14) return 'morning';
  if (hour < 19) return 'afternoon';
  return 'evening';
};

/**
 * Get classes filtered by time block
 */
export const getClassesByTimeBlock = (timeBlock: TimeBlock): ScheduleClass[] => {
  return SCHEDULE_DATA.filter(cls => getTimeBlock(cls.time) === timeBlock);
};

/**
 * Get classes by category and optional time block
 */
export const getClassesByBlockConfig = (config: ScheduleBlockConfig): ScheduleClass[] => {
  return SCHEDULE_DATA.filter(cls => {
    const matchesCategory = config.categories.includes(cls.category);
    const matchesTime = getTimeBlock(cls.time) === config.timeBlock;
    return matchesCategory && matchesTime;
  }).sort((a, b) => a.time.localeCompare(b.time));
};

/**
 * Get badges for a class
 */
export const getClassBadges = (className: string): BadgeType[] => {
  return CLASS_BADGES[className] || [];
};

/**
 * Check if a day has classes for a specific time block
 */
export const hasClassesOnDay = (day: DayKey, timeBlock: TimeBlock): boolean => {
  return SCHEDULE_DATA.some(cls => cls.day === day && getTimeBlock(cls.time) === timeBlock);
};

/**
 * Get availability matrix for weekly view
 */
export const getWeeklyAvailability = (): Record<TimeBlock, Record<DayKey, boolean>> => {
  const availability: Record<TimeBlock, Record<DayKey, boolean>> = {
    morning: {} as Record<DayKey, boolean>,
    afternoon: {} as Record<DayKey, boolean>,
    evening: {} as Record<DayKey, boolean>,
  };

  TIME_BLOCKS.forEach(block => {
    WEEK_DAYS.forEach(day => {
      availability[block.id][day] = hasClassesOnDay(day, block.id);
    });
  });

  return availability;
};

/**
 * Get unique styles for a category
 */
export const getUniqueStylesByCategory = (category: CategoryKey): string[] => {
  const classes = SCHEDULE_DATA.filter(cls => cls.category === category);
  return [...new Set(classes.map(cls => cls.styleName))].sort();
};

/**
 * Get WhatsApp URL with context
 */
export const getWhatsAppUrl = (context: string, phoneNumber = '34622122122'): string => {
  const message = encodeURIComponent(
    `Hola! Me interesan los ${context}. ¿Podrían darme más información?`
  );
  return `https://wa.me/${phoneNumber}?text=${message}`;
};

/**
 * Generate Google Calendar URL for a class
 */
export const getGoogleCalendarUrl = (
  className: string,
  _day: string,
  _time: string,
  location = "Farray's International Dance Center, Barcelona"
): string => {
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new globalThis.URLSearchParams({
    action: 'TEMPLATE',
    text: `Clase de ${className}`,
    details: `Recordatorio: Clase de ${className} en Farray Center`,
    location,
  });
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Format schedule time range
 */
export const formatTimeRange = (time: string, durationMinutes = 60): string => {
  const parts = time.split(':').map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  const endHours = hours + Math.floor((minutes + durationMinutes) / 60);
  const endMinutes = (minutes + durationMinutes) % 60;
  return `${time} - ${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

/**
 * Get classes count by block
 */
export const getClassCountByBlock = (): Record<string, number> => {
  const counts: Record<string, number> = {};

  SCHEDULE_BLOCK_CONFIGS.forEach(config => {
    counts[config.id] = getClassesByBlockConfig(config).length;
  });

  return counts;
};

/**
 * Get total active classes
 */
export const getTotalClassCount = (): number => {
  return SCHEDULE_DATA.length;
};

/**
 * Get unique teachers count
 */
export const getUniqueTeachersCount = (): number => {
  return new Set(SCHEDULE_DATA.map(cls => cls.teacher)).size;
};
