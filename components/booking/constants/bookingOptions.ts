/**
 * Booking Widget Constants
 * All options and configuration for the booking system
 */

// Style option type
export type StyleOption = {
  value: string;
  label?: string;
  labelKey?: string;
  color: string;
};

// Style options with colors for visual UI
export const STYLE_OPTIONS: readonly StyleOption[] = [
  { value: '', labelKey: 'booking_style_all', color: '#B01E3C' },
  { value: 'salsa', label: 'Salsa', color: '#FF6B6B' },
  { value: 'bachata', label: 'Bachata', color: '#C44569' },
  { value: 'hiphop', label: 'Hip Hop', color: '#574B90' },
  { value: 'reggaeton', label: 'Reggaeton', color: '#F8B500' },
  { value: 'heels', label: 'Heels', color: '#FF69B4' },
  { value: 'dancehall', label: 'Dancehall', color: '#00D9A5' },
  { value: 'afro', label: 'Afro', color: '#FF8C00' },
  { value: 'twerk', label: 'Twerk', color: '#FF1493' },
  { value: 'commercial', label: 'Commercial', color: '#4834D4' },
  { value: 'kpop', label: 'K-Pop', color: '#A29BFE' },
  { value: 'yoga', label: 'Yoga', color: '#00B894' },
  { value: 'stretching', label: 'Stretching', color: '#81ECEC' },
];

// Level options
export const LEVEL_OPTIONS = [
  { value: '', labelKey: 'booking_filter_all' },
  { value: 'iniciacion', labelKey: 'booking_filter_level_iniciacion' },
  { value: 'basico', labelKey: 'booking_filter_level_basico' },
  { value: 'intermedio', labelKey: 'booking_filter_level_intermedio' },
  { value: 'avanzado', labelKey: 'booking_filter_level_avanzado' },
  { value: 'abierto', labelKey: 'booking_filter_level_abierto' },
] as const;

// Day options
export const DAY_OPTIONS = [
  { value: '', labelKey: 'booking_filter_all' },
  { value: 'Lunes', labelKey: 'booking_filter_day_monday' },
  { value: 'Martes', labelKey: 'booking_filter_day_tuesday' },
  { value: 'Miércoles', labelKey: 'booking_filter_day_wednesday' },
  { value: 'Jueves', labelKey: 'booking_filter_day_thursday' },
  { value: 'Viernes', labelKey: 'booking_filter_day_friday' },
  { value: 'Sábado', labelKey: 'booking_filter_day_saturday' },
  { value: 'Domingo', labelKey: 'booking_filter_day_sunday' },
] as const;

// Time block options with hour ranges
export const TIME_BLOCK_OPTIONS = [
  { value: '', labelKey: 'booking_filter_all', range: undefined },
  { value: 'morning', labelKey: 'booking_filter_time_morning', range: [0, 12] as const },
  { value: 'afternoon', labelKey: 'booking_filter_time_afternoon', range: [12, 18] as const },
  { value: 'evening', labelKey: 'booking_filter_time_evening', range: [18, 24] as const },
] as const;

// Get style label by value
export function getStyleLabel(value: string): string {
  const style = STYLE_OPTIONS.find(s => s.value === value);
  return style?.label || style?.labelKey || value;
}

// Get style color by value
export function getStyleColor(value: string): string {
  const style = STYLE_OPTIONS.find(s => s.value === value);
  return style?.color || '#B01E3C';
}

// Get level label key by value
export function getLevelLabelKey(value: string): string {
  const level = LEVEL_OPTIONS.find(l => l.value === value);
  return level?.labelKey || 'booking_filter_all';
}

// Get day label key by value
export function getDayLabelKey(value: string): string {
  const day = DAY_OPTIONS.find(d => d.value === value);
  return day?.labelKey || 'booking_filter_all';
}

// Get time block label key by value
export function getTimeBlockLabelKey(value: string): string {
  const timeBlock = TIME_BLOCK_OPTIONS.find(t => t.value === value);
  return timeBlock?.labelKey || 'booking_filter_all';
}

// Get time block range by value
export function getTimeBlockRange(value: string): readonly [number, number] | undefined {
  const timeBlock = TIME_BLOCK_OPTIONS.find(t => t.value === value);
  return timeBlock?.range;
}

// Day names in Spanish for display
export const DAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
] as const;

// Class templates for mock data generation
export const CLASS_TEMPLATES = [
  {
    name: 'Salsa Cubana - Iniciación',
    style: 'salsa',
    level: 'iniciacion',
    instructor: 'Yunaisy Farray',
    time: '19:00',
    dayOfWeek: 1,
    duration: 60,
    description:
      'Aprende los pasos básicos de la salsa cubana en un ambiente divertido. Ideal para principiantes sin experiencia previa.',
  },
  {
    name: 'Bachata Sensual - Básico',
    style: 'bachata',
    level: 'basico',
    instructor: 'Iroel',
    time: '20:00',
    dayOfWeek: 1,
    duration: 60,
    description:
      'Desarrolla tu conexión con la música y tu pareja. Trabajaremos ondas corporales, aislaciones y musicalidad.',
  },
  {
    name: 'Heels - Todos los niveles',
    style: 'heels',
    level: 'abierto',
    instructor: 'Lía',
    time: '18:30',
    dayOfWeek: 2,
    duration: 60,
    description:
      'Baila con tacones y libera tu lado más sensual. Coreografías de estilo comercial que trabajan la feminidad y la confianza.',
  },
  {
    name: 'Dancehall - Intermedio',
    style: 'dancehall',
    level: 'intermedio',
    instructor: 'Yunaisy Farray',
    time: '19:30',
    dayOfWeek: 2,
    duration: 60,
    description:
      'Sumérgete en la cultura jamaicana con movimientos explosivos. Se requiere conocimiento previo de los pasos básicos.',
  },
  {
    name: 'Hip Hop - Iniciación',
    style: 'hiphop',
    level: 'iniciacion',
    instructor: 'Alex',
    time: '17:00',
    dayOfWeek: 3,
    duration: 60,
    description:
      'Descubre los fundamentos del hip hop: grooves, bounces y aislaciones. Perfecto para empezar desde cero.',
  },
  {
    name: 'Reggaeton - Básico',
    style: 'reggaeton',
    level: 'basico',
    instructor: 'Iroel',
    time: '18:00',
    dayOfWeek: 3,
    duration: 60,
    description:
      'Aprende a moverte con el ritmo del reggaeton. Coreografías urbanas con movimientos de cadera y actitud.',
  },
  {
    name: 'Twerk - Todos los niveles',
    style: 'twerk',
    level: 'abierto',
    instructor: 'Lía',
    time: '19:00',
    dayOfWeek: 4,
    duration: 60,
    description:
      'Trabaja la técnica del twerk con ejercicios de aislación de glúteos. Clase divertida y de alto impacto.',
  },
  {
    name: 'Afrobeats - Iniciación',
    style: 'afro',
    level: 'iniciacion',
    instructor: 'Yunaisy Farray',
    time: '20:00',
    dayOfWeek: 4,
    duration: 60,
    description:
      'Explora los ritmos africanos contemporáneos. Movimientos enérgicos que conectan cuerpo y música.',
  },
  {
    name: 'Commercial Dance',
    style: 'commercial',
    level: 'abierto',
    instructor: 'Alex',
    time: '17:30',
    dayOfWeek: 5,
    duration: 60,
    description:
      'Coreografías estilo videoclip mezclando hip hop, jazz y dancehall. El estilo que ves en los videos de tus artistas favoritos.',
  },
  {
    name: 'K-Pop - Iniciación',
    style: 'kpop',
    level: 'iniciacion',
    instructor: 'Lía',
    time: '16:00',
    dayOfWeek: 6,
    duration: 75,
    description:
      'Aprende las coreografías de tus grupos favoritos de K-Pop. Clase perfecta para fans que quieren bailar como sus idols.',
  },
  {
    name: 'Yoga para Bailarines',
    style: 'yoga',
    level: 'abierto',
    instructor: 'María',
    time: '10:00',
    dayOfWeek: 6,
    duration: 90,
    description:
      'Sesión de yoga diseñada para bailarines. Mejora tu flexibilidad, equilibrio y recuperación muscular.',
  },
  {
    name: 'Stretching & Flexibilidad',
    style: 'stretching',
    level: 'abierto',
    instructor: 'María',
    time: '11:30',
    dayOfWeek: 6,
    duration: 45,
    description:
      'Estiramientos profundos para aumentar tu rango de movimiento. Ideal como complemento a cualquier estilo de baile.',
  },
];

// Maximum weeks to show in navigation
export const MAX_WEEKS = 4;

// API endpoints
export const API_ENDPOINTS = {
  CLASSES: '/api/clases',
  RESERVAR: '/api/reservar',
} as const;
