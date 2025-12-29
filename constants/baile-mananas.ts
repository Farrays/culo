import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

/**
 * Clases de Baile por las Mañanas en Barcelona - Page Data
 *
 * SEO Keywords:
 * - clases de baile por las mañanas en barcelona
 * - clases baile mañanas barcelona
 * - escuela baile horario mañana
 * - academia baile turnos mañana
 * - baile matinal barcelona
 * - clases baile 10h barcelona
 * - bailar por las mañanas
 */

// FAQs configuration - 14 FAQs for comprehensive SEO
export const BAILE_MANANAS_FAQS_CONFIG: FAQ[] = [
  // 7 FAQs principales
  { id: 'baileman-1', questionKey: 'bailemanananasFaqQ1', answerKey: 'bailemanananasFaqA1' },
  { id: 'baileman-2', questionKey: 'bailemanananasFaqQ2', answerKey: 'bailemanananasFaqA2' },
  { id: 'baileman-3', questionKey: 'bailemanananasFaqQ3', answerKey: 'bailemanananasFaqA3' },
  { id: 'baileman-4', questionKey: 'bailemanananasFaqQ4', answerKey: 'bailemanananasFaqA4' },
  { id: 'baileman-5', questionKey: 'bailemanananasFaqQ5', answerKey: 'bailemanananasFaqA5' },
  { id: 'baileman-6', questionKey: 'bailemanananasFaqQ6', answerKey: 'bailemanananasFaqA6' },
  { id: 'baileman-7', questionKey: 'bailemanananasFaqQ7', answerKey: 'bailemanananasFaqA7' },
  // 7 FAQs adicionales para SEO
  { id: 'baileman-8', questionKey: 'bailemanananasFaqQ8', answerKey: 'bailemanananasFaqA8' },
  { id: 'baileman-9', questionKey: 'bailemanananasFaqQ9', answerKey: 'bailemanananasFaqA9' },
  { id: 'baileman-10', questionKey: 'bailemanananasFaqQ10', answerKey: 'bailemanananasFaqA10' },
  { id: 'baileman-11', questionKey: 'bailemanananasFaqQ11', answerKey: 'bailemanananasFaqA11' },
  { id: 'baileman-12', questionKey: 'bailemanananasFaqQ12', answerKey: 'bailemanananasFaqA12' },
  { id: 'baileman-13', questionKey: 'bailemanananasFaqQ13', answerKey: 'bailemanananasFaqA13' },
  { id: 'baileman-14', questionKey: 'bailemanananasFaqQ14', answerKey: 'bailemanananasFaqA14' },
];

// Testimonials - Using Google Reviews (same pattern as CuerpoFit)
export const BAILE_MANANAS_TESTIMONIALS: Testimonial[] = [...GOOGLE_REVIEWS_TESTIMONIALS];

// Schedule data - 15 clases de mañanas (Lunes, Miércoles, Jueves)
export const BAILE_MANANAS_SCHEDULE_KEYS = [
  // === LUNES ===
  {
    id: '1',
    dayKey: 'monday',
    className: 'Body Conditioning Principiantes',
    time: '10:00 - 11:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'beginnerLevel',
  },
  {
    id: '2',
    dayKey: 'monday',
    className: 'Contemporáneo Lírico Básico',
    time: '11:00 - 12:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicLevel',
  },
  {
    id: '3',
    dayKey: 'monday',
    className: 'Sexy Reggaeton Principiantes',
    time: '11:00 - 12:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'beginnerLevel',
  },
  {
    id: '4',
    dayKey: 'monday',
    className: 'Modern Jazz Básico',
    time: '12:00 - 13:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicLevel',
  },
  {
    id: '5',
    dayKey: 'monday',
    className: 'Sexy Style Principiantes',
    time: '12:00 - 13:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'beginnerLevel',
  },
  // === MIÉRCOLES ===
  {
    id: '6',
    dayKey: 'wednesday',
    className: 'Stretching Principiantes',
    time: '10:00 - 11:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'beginnerLevel',
  },
  {
    id: '7',
    dayKey: 'wednesday',
    className: 'Contemporáneo Suelo & Flow Básico/Intermedio',
    time: '11:00 - 12:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicIntermediateLevel',
  },
  {
    id: '8',
    dayKey: 'wednesday',
    className: 'Salsa Cubana Lady Style Open Level',
    time: '11:00 - 12:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'openLevel',
  },
  {
    id: '9',
    dayKey: 'wednesday',
    className: 'Afro Jazz Básico',
    time: '12:00 - 13:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicLevel',
  },
  {
    id: '14',
    dayKey: 'wednesday',
    className: 'Dancehall Female Principiantes',
    time: '12:00 - 13:00',
    teacher: 'Isabel López',
    levelKey: 'beginnerLevel',
  },
  // === JUEVES ===
  {
    id: '10',
    dayKey: 'thursday',
    className: 'Sexy Reggaeton Básico',
    time: '10:00 - 11:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'basicLevel',
  },
  {
    id: '11',
    dayKey: 'thursday',
    className: 'Reggaeton Cubano (Reparto)',
    time: '10:00 - 11:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'openLevel',
  },
  {
    id: '12',
    dayKey: 'thursday',
    className: 'Ballet Principiantes',
    time: '11:00 - 12:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'beginnerLevel',
  },
  {
    id: '13',
    dayKey: 'thursday',
    className: 'Sexy Style Principiantes',
    time: '11:00 - 12:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'beginnerLevel',
  },
  {
    id: '15',
    dayKey: 'thursday',
    className: 'Twerk Principiantes',
    time: '11:00 - 12:00',
    teacher: 'Isabel López',
    levelKey: 'beginnerLevel',
  },
];

// Level descriptions for cards - 3 niveles
export const BAILE_MANANAS_LEVELS = [
  {
    id: 'principiante',
    levelKey: 'beginnerLevel',
    titleKey: 'bailemanananasLevelBeginnerTitle',
    descKey: 'bailemanananasLevelBeginnerDesc',
    duration: 'Sin experiencia previa',
    color: 'primary-dark' as const,
  },
  {
    id: 'basico',
    levelKey: 'basicLevel',
    titleKey: 'bailemanananasLevelBasicTitle',
    descKey: 'bailemanananasLevelBasicDesc',
    duration: '1-6 meses de experiencia',
    color: 'primary-accent' as const,
  },
  {
    id: 'basico-intermedio',
    levelKey: 'basicIntermediateLevel',
    titleKey: 'bailemanananasLevelBasicIntermediateTitle',
    descKey: 'bailemanananasLevelBasicIntermediateDesc',
    duration: '6+ meses de experiencia',
    color: 'amber' as const,
  },
];

import { getTeacherQuoteInfo } from './teacher-images';

// Prepare class configuration
export const BAILE_MANANAS_PREPARE_CONFIG = {
  prefix: 'bailemanananasPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: getTeacherQuoteInfo('alejandro-minoso', 'Profesor de Clases de Mañanas'),
};

// Breadcrumb custom keys
export const BAILE_MANANAS_BREADCRUMB_KEYS = {
  home: 'bailemanananasBreadcrumbHome',
  classes: 'bailemanananasBreadcrumbClasses',
  category: 'bailemanananasBreadcrumbCategory',
  current: 'bailemanananasBreadcrumbCurrent',
};

// Course schema configuration
export const BAILE_MANANAS_COURSE_CONFIG = {
  teaches:
    'Contemporáneo, Ballet, Modern Jazz, Afro Jazz, Sexy Style, Sexy Reggaeton, Salsa Lady Style, Stretching, Body Conditioning, Reggaeton Cubano, Dancehall Female, Twerk',
  prerequisites: 'Ninguno - clases para todos los niveles desde principiante',
  lessons: '15 clases semanales de lunes a jueves',
  duration: 'PT1H',
};

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const BAILE_MANANAS_GEO_KEYS = {
  definicion: 'bailemanananasCitableDefinicion', // Qué son las clases de mañana
  beneficios: 'bailemanananasCitableBeneficios', // Beneficios científicos
  horario: 'bailemanananasCitableHorario', // Horario detallado
  ubicacion: 'bailemanananasCitableUbicacion', // Ubicación
  metodologia: 'bailemanananasCitableMetodologia', // Método Farray
  statistics: 'bailemanananasCitableStatistics', // Estadísticas
  fact1: 'bailemanananasCitableFact1', // Dato 1
  fact2: 'bailemanananasCitableFact2', // Dato 2
  fact3: 'bailemanananasCitableFact3', // Dato 3
};
