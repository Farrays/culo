/**
 * Calendar Events Configuration
 * ==============================
 *
 * Este archivo contiene todos los eventos del calendario de FIDC.
 * Es fácil de editar: solo añade, modifica o elimina eventos aquí.
 *
 * TIPOS DE EVENTOS (todos con efecto glow neón):
 * - 'vacation'  → Vacaciones (holográfico/magenta)
 * - 'holiday'   → Festivos (glow rosa/rose)
 * - 'event'     → Eventos especiales/galas (glow violeta)
 * - 'workshop'  → Workshops/masterclasses (glow esmeralda)
 * - 'info'      → Información importante (glow cian)
 *
 * FORMATO DE FECHAS:
 * - startDate: 'YYYY-MM-DD' (obligatorio)
 * - endDate: 'YYYY-MM-DD' (opcional, para rangos)
 *
 * TRADUCCIONES:
 * - Usa claves i18n para title y description
 * - El sistema buscará automáticamente las traducciones
 */

export type CalendarEventType = 'vacation' | 'holiday' | 'event' | 'workshop' | 'info';

export type CalendarIconType =
  | 'sun'
  | 'calendarX'
  | 'sparkles'
  | 'academicCap'
  | 'megaphone'
  | 'rocket'
  | 'star';

export interface CalendarEvent {
  /** Unique identifier */
  id: string;
  /** Event type for styling and filtering */
  type: CalendarEventType;
  /** i18n key for the event title */
  titleKey: string;
  /** i18n key for the event description (optional) */
  descriptionKey?: string;
  /** Start date in YYYY-MM-DD format */
  startDate: string;
  /** End date in YYYY-MM-DD format (optional, for date ranges) */
  endDate?: string;
  /** Whether this affects class schedules (shows "No hay clases" badge) */
  noClasses?: boolean;
  /** Optional icon override */
  iconType?: CalendarIconType;
}

/**
 * EVENT COLOR SCHEME
 * Maps event types to Tailwind color classes
 */
export const EVENT_COLORS: Record<
  CalendarEventType,
  {
    bg: string;
    border: string;
    text: string;
    iconType: CalendarIconType;
    badge: string;
  }
> = {
  vacation: {
    bg: 'bg-primary-accent/20',
    border: 'border-primary-accent/50',
    text: 'holographic-text',
    iconType: 'sun',
    badge: 'bg-primary-accent',
  },
  holiday: {
    bg: 'bg-rose-500/20',
    border: 'border-rose-500/50',
    text: 'glow-rose',
    iconType: 'calendarX',
    badge: 'bg-rose-500',
  },
  event: {
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/50',
    text: 'glow-violet',
    iconType: 'sparkles',
    badge: 'bg-violet-500',
  },
  workshop: {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/50',
    text: 'glow-emerald',
    iconType: 'academicCap',
    badge: 'bg-emerald-500',
  },
  info: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/50',
    text: 'glow-cyan',
    iconType: 'megaphone',
    badge: 'bg-cyan-500',
  },
};

/**
 * CALENDAR EVENTS 2025-2026
 * =========================
 * Añade tus eventos aquí. El orden no importa, se ordenarán por fecha automáticamente.
 */
export const CALENDAR_EVENTS: CalendarEvent[] = [
  // ============ NAVIDAD 2025 ============
  {
    id: 'navidad-2025',
    type: 'vacation',
    titleKey: 'calendar_event_christmas_vacation',
    descriptionKey: 'calendar_event_christmas_vacation_desc',
    startDate: '2025-12-23',
    endDate: '2026-01-05',
    noClasses: true,
  },

  // ============ ENERO 2026 ============
  {
    id: 'reyes-2026',
    type: 'holiday',
    titleKey: 'calendar_event_three_kings',
    descriptionKey: 'calendar_event_three_kings_desc',
    startDate: '2026-01-06',
    noClasses: true,
  },

  // ============ SEMANA SANTA 2026 ============
  {
    id: 'semana-santa-2026',
    type: 'vacation',
    titleKey: 'calendar_event_easter_vacation',
    descriptionKey: 'calendar_event_easter_vacation_desc',
    startDate: '2026-03-30',
    endDate: '2026-04-06',
    noClasses: true,
  },

  // ============ MAYO 2026 ============
  {
    id: 'dia-trabajador-2026',
    type: 'holiday',
    titleKey: 'calendar_event_labor_day',
    descriptionKey: 'calendar_event_labor_day_desc',
    startDate: '2026-05-01',
    noClasses: true,
  },

  // ============ JUNIO 2026 ============
  {
    id: 'san-juan-2026',
    type: 'holiday',
    titleKey: 'calendar_event_san_juan',
    descriptionKey: 'calendar_event_san_juan_desc',
    startDate: '2026-06-24',
    noClasses: true,
  },
  {
    id: 'gala-fin-curso-2026',
    type: 'event',
    titleKey: 'calendar_event_end_year_gala',
    descriptionKey: 'calendar_event_end_year_gala_desc',
    startDate: '2026-06-27',
    noClasses: false,
    iconType: 'star',
  },

  // ============ VERANO 2026 ============
  {
    id: 'vacaciones-verano-2026',
    type: 'vacation',
    titleKey: 'calendar_event_summer_vacation',
    descriptionKey: 'calendar_event_summer_vacation_desc',
    startDate: '2026-07-28',
    endDate: '2026-08-30',
    noClasses: true,
  },

  // ============ SEPTIEMBRE 2026 ============
  {
    id: 'inicio-curso-2026',
    type: 'info',
    titleKey: 'calendar_event_course_start',
    descriptionKey: 'calendar_event_course_start_desc',
    startDate: '2026-08-31',
    noClasses: false,
    iconType: 'rocket',
  },
];

/**
 * Helper function to sort events by start date
 */
export const getSortedEvents = (): CalendarEvent[] => {
  return [...CALENDAR_EVENTS].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
};

/**
 * Get upcoming events (from today onwards)
 * @param limit - Maximum number of events to return
 */
export const getUpcomingEvents = (limit?: number): CalendarEvent[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = getSortedEvents().filter(event => {
    const endDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
    return endDate >= today;
  });

  return limit ? upcoming.slice(0, limit) : upcoming;
};

/**
 * Get events for a specific month
 * @param year - Year (e.g., 2026)
 * @param month - Month (0-11)
 */
export const getEventsForMonth = (year: number, month: number): CalendarEvent[] => {
  return getSortedEvents().filter(event => {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    // Event overlaps with this month
    return startDate <= monthEnd && endDate >= monthStart;
  });
};

/**
 * Check if a specific date has events
 * @param date - Date to check
 */
export const getEventsForDate = (date: Date): CalendarEvent[] => {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  return getSortedEvents().filter(event => {
    const startDate = new Date(event.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
    endDate.setHours(0, 0, 0, 0);

    return checkDate >= startDate && checkDate <= endDate;
  });
};

/**
 * Filter events by type
 * @param type - Event type to filter
 */
export const getEventsByType = (type: CalendarEventType): CalendarEvent[] => {
  return getSortedEvents().filter(event => event.type === type);
};
