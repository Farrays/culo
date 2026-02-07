/**
 * Intl Formatters - Internationalized Date/Number Formatting
 *
 * Uses native Intl.DateTimeFormat and Intl.NumberFormat for proper
 * locale-aware formatting across all supported languages (es, ca, en, fr).
 *
 * Benefits over toLocaleString:
 * - Cached formatters for better performance
 * - Consistent locale mapping (ca -> ca-ES, etc.)
 * - Explicit format options
 * - Type safety
 *
 * @see IMPLEMENTACION-SEGURA.md (FASE 2: SEO/i18n)
 */

// ============================================================================
// LOCALE MAPPING
// ============================================================================

/**
 * Maps i18n language codes to proper BCP 47 locale codes
 * Used for Intl formatters
 */
const LOCALE_MAP: Record<string, string> = {
  es: 'es-ES',
  ca: 'ca-ES',
  en: 'en-GB', // Use British English for European context
  fr: 'fr-FR',
};

/**
 * Get proper BCP 47 locale code from i18n language
 */
export function getIntlLocale(language: string): string {
  return LOCALE_MAP[language] || 'es-ES';
}

// ============================================================================
// DATE FORMATTERS
// ============================================================================

/**
 * Cached DateTimeFormat instances for performance
 * Key format: "locale:format"
 */
const dateFormattersCache = new Map<string, Intl.DateTimeFormat>();

/**
 * Predefined date format options
 */
export const DATE_FORMATS = {
  /** "15 ene" - Day and short month */
  short: {
    day: 'numeric',
    month: 'short',
  } as const,

  /** "15 de enero" - Day and long month */
  medium: {
    day: 'numeric',
    month: 'long',
  } as const,

  /** "15 de enero de 2024" - Full date */
  long: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  } as const,

  /** "lunes, 15 de enero" - Weekday and date */
  weekday: {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  } as const,

  /** "lun, 15 ene" - Short weekday and date */
  weekdayShort: {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  } as const,

  /** "15/01/2024" - Numeric date */
  numeric: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  } as const,
};

export type DateFormatType = keyof typeof DATE_FORMATS;

/**
 * Get or create a cached DateTimeFormat instance
 */
function getDateFormatter(
  locale: string,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const key = `${locale}:${JSON.stringify(options)}`;

  let formatter = dateFormattersCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options);
    dateFormattersCache.set(key, formatter);
  }

  return formatter;
}

/**
 * Format a date using Intl.DateTimeFormat
 *
 * @param date - Date to format
 * @param language - i18n language code (es, ca, en, fr)
 * @param format - Predefined format name or custom options
 * @param timezone - Optional timezone (defaults to Europe/Madrid)
 *
 * @example
 * formatDate(new Date(), 'es', 'short') // "15 ene"
 * formatDate(new Date(), 'ca', 'weekday') // "dilluns, 15 de gener"
 */
export function formatDate(
  date: Date | string,
  language: string,
  format: DateFormatType | Intl.DateTimeFormatOptions = 'short',
  timezone: string = 'Europe/Madrid'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = getIntlLocale(language);

  // Get format options
  const options: Intl.DateTimeFormatOptions =
    typeof format === 'string'
      ? { ...DATE_FORMATS[format], timeZone: timezone }
      : { ...format, timeZone: timezone };

  const formatter = getDateFormatter(locale, options);
  return formatter.format(dateObj);
}

// ============================================================================
// TIME FORMATTERS
// ============================================================================

/**
 * Predefined time format options
 */
export const TIME_FORMATS = {
  /** "19:30" - Hour and minute */
  short: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  } as const,

  /** "19:30:00" - Hour, minute, second */
  long: {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  } as const,

  /** "7:30 PM" - 12-hour format */
  hour12: {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  } as const,
};

export type TimeFormatType = keyof typeof TIME_FORMATS;

/**
 * Format a time using Intl.DateTimeFormat
 *
 * @param date - Date to format
 * @param language - i18n language code
 * @param format - Predefined format name or custom options
 * @param timezone - Optional timezone (defaults to Europe/Madrid)
 *
 * @example
 * formatTime(new Date(), 'es', 'short') // "19:30"
 */
export function formatTime(
  date: Date | string,
  language: string,
  format: TimeFormatType | Intl.DateTimeFormatOptions = 'short',
  timezone: string = 'Europe/Madrid'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = getIntlLocale(language);

  const options: Intl.DateTimeFormatOptions =
    typeof format === 'string'
      ? { ...TIME_FORMATS[format], timeZone: timezone }
      : { ...format, timeZone: timezone };

  const formatter = getDateFormatter(locale, options);
  return formatter.format(dateObj);
}

/**
 * Format date and time together
 *
 * @example
 * formatDateTime(new Date(), 'es', 'short', 'short') // "15 ene, 19:30"
 */
export function formatDateTime(
  date: Date | string,
  language: string,
  dateFormat: DateFormatType = 'short',
  timeFormat: TimeFormatType = 'short',
  timezone: string = 'Europe/Madrid'
): string {
  return `${formatDate(date, language, dateFormat, timezone)}, ${formatTime(date, language, timeFormat, timezone)}`;
}

// ============================================================================
// NUMBER FORMATTERS
// ============================================================================

/**
 * Cached NumberFormat instances
 */
const numberFormattersCache = new Map<string, Intl.NumberFormat>();

/**
 * Get or create a cached NumberFormat instance
 */
function getNumberFormatter(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale}:${JSON.stringify(options)}`;

  let formatter = numberFormattersCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    numberFormattersCache.set(key, formatter);
  }

  return formatter;
}

/**
 * Format a number using Intl.NumberFormat
 *
 * @param value - Number to format
 * @param language - i18n language code
 * @param options - NumberFormat options
 *
 * @example
 * formatNumber(1234.56, 'es') // "1.234,56"
 * formatNumber(1234.56, 'en') // "1,234.56"
 */
export function formatNumber(
  value: number,
  language: string,
  options: Intl.NumberFormatOptions = {}
): string {
  const locale = getIntlLocale(language);
  const formatter = getNumberFormatter(locale, options);
  return formatter.format(value);
}

/**
 * Format a currency value
 *
 * @param value - Amount to format
 * @param language - i18n language code
 * @param currency - Currency code (default: EUR)
 *
 * @example
 * formatCurrency(25, 'es') // "25,00 €"
 * formatCurrency(25, 'en') // "€25.00"
 */
export function formatCurrency(value: number, language: string, currency: string = 'EUR'): string {
  const locale = getIntlLocale(language);
  const formatter = getNumberFormatter(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

/**
 * Format a percentage value
 *
 * @param value - Value to format (0.15 = 15%)
 * @param language - i18n language code
 * @param decimals - Number of decimal places
 *
 * @example
 * formatPercent(0.15, 'es') // "15 %"
 * formatPercent(0.156, 'es', 1) // "15,6 %"
 */
export function formatPercent(value: number, language: string, decimals: number = 0): string {
  const locale = getIntlLocale(language);
  const formatter = getNumberFormatter(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(value);
}

// ============================================================================
// RELATIVE TIME FORMATTING
// ============================================================================

/**
 * Cached RelativeTimeFormat instances
 */
const relativeTimeFormattersCache = new Map<string, Intl.RelativeTimeFormat>();

type RelativeTimeUnit = Intl.RelativeTimeFormatUnit;

/**
 * Format relative time (e.g., "hace 2 días", "in 3 hours")
 *
 * @param value - Numeric value (negative for past, positive for future)
 * @param unit - Time unit (second, minute, hour, day, week, month, year)
 * @param language - i18n language code
 *
 * @example
 * formatRelativeTime(-2, 'day', 'es') // "hace 2 días"
 * formatRelativeTime(3, 'hour', 'en') // "in 3 hours"
 */
export function formatRelativeTime(
  value: number,
  unit: RelativeTimeUnit,
  language: string
): string {
  const locale = getIntlLocale(language);

  let formatter = relativeTimeFormattersCache.get(locale);
  if (!formatter) {
    formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    relativeTimeFormattersCache.set(locale, formatter);
  }

  return formatter.format(value, unit);
}

/**
 * Auto-detect best unit and format relative time from a date
 *
 * @param date - Date to compare against now
 * @param language - i18n language code
 *
 * @example
 * formatRelativeTimeAuto(twoDaysAgo, 'es') // "hace 2 días"
 * formatRelativeTimeAuto(inThreeHours, 'en') // "in 3 hours"
 */
export function formatRelativeTimeAuto(date: Date | string, language: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffWeeks = Math.round(diffDays / 7);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  if (Math.abs(diffSeconds) < 60) {
    return formatRelativeTime(diffSeconds, 'second', language);
  } else if (Math.abs(diffMinutes) < 60) {
    return formatRelativeTime(diffMinutes, 'minute', language);
  } else if (Math.abs(diffHours) < 24) {
    return formatRelativeTime(diffHours, 'hour', language);
  } else if (Math.abs(diffDays) < 7) {
    return formatRelativeTime(diffDays, 'day', language);
  } else if (Math.abs(diffWeeks) < 4) {
    return formatRelativeTime(diffWeeks, 'week', language);
  } else if (Math.abs(diffMonths) < 12) {
    return formatRelativeTime(diffMonths, 'month', language);
  } else {
    return formatRelativeTime(diffYears, 'year', language);
  }
}

// ============================================================================
// WEEKDAY UTILITIES
// ============================================================================

/**
 * Get localized weekday name
 *
 * @param dayIndex - Day of week (0 = Sunday, 1 = Monday, etc.)
 * @param language - i18n language code
 * @param format - 'long' (lunes), 'short' (lun), or 'narrow' (L)
 *
 * @example
 * getWeekdayName(1, 'es', 'long') // "lunes"
 * getWeekdayName(1, 'ca', 'short') // "dl."
 */
export function getWeekdayName(
  dayIndex: number,
  language: string,
  format: 'long' | 'short' | 'narrow' = 'long'
): string {
  const locale = getIntlLocale(language);
  // Create a date for the given day of week (using a known Sunday as base)
  const baseDate = new Date(2024, 0, 7); // Sunday, January 7, 2024
  const targetDate = new Date(baseDate);
  targetDate.setDate(baseDate.getDate() + dayIndex);

  const formatter = getDateFormatter(locale, { weekday: format });
  return formatter.format(targetDate);
}

/**
 * Get all weekday names for a locale
 *
 * @param language - i18n language code
 * @param format - 'long', 'short', or 'narrow'
 * @param startMonday - If true, start with Monday instead of Sunday
 *
 * @example
 * getWeekdays('es', 'short', true) // ["lun.", "mar.", "mié.", ...]
 */
export function getWeekdays(
  language: string,
  format: 'long' | 'short' | 'narrow' = 'long',
  startMonday: boolean = true
): string[] {
  const days = Array.from({ length: 7 }, (_, i) => getWeekdayName(i, language, format));

  if (startMonday) {
    // Move Sunday to end
    const sunday = days.shift();
    if (sunday) {
      days.push(sunday);
    }
  }

  return days;
}

// ============================================================================
// MONTH UTILITIES
// ============================================================================

/**
 * Get localized month name
 *
 * @param monthIndex - Month index (0 = January, 11 = December)
 * @param language - i18n language code
 * @param format - 'long' (enero), 'short' (ene), or 'narrow' (E)
 *
 * @example
 * getMonthName(0, 'es', 'long') // "enero"
 * getMonthName(0, 'ca', 'short') // "gen."
 */
export function getMonthName(
  monthIndex: number,
  language: string,
  format: 'long' | 'short' | 'narrow' = 'long'
): string {
  const locale = getIntlLocale(language);
  const date = new Date(2024, monthIndex, 1);
  const formatter = getDateFormatter(locale, { month: format });
  return formatter.format(date);
}

/**
 * Get all month names for a locale
 *
 * @param language - i18n language code
 * @param format - 'long', 'short', or 'narrow'
 *
 * @example
 * getMonths('es', 'short') // ["ene", "feb", "mar", ...]
 */
export function getMonths(
  language: string,
  format: 'long' | 'short' | 'narrow' = 'long'
): string[] {
  return Array.from({ length: 12 }, (_, i) => getMonthName(i, language, format));
}
