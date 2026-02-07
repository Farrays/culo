/**
 * useIntlFormat - React Hook for Internationalized Formatting
 *
 * Provides convenient access to Intl formatters using the current i18n language.
 * Uses memoization for optimal performance.
 *
 * @example
 * const { formatDate, formatCurrency } = useIntlFormat();
 * return <p>{formatDate(event.date, 'weekday')} - {formatCurrency(event.price)}</p>
 *
 * @see utils/intl-formatters.ts for underlying implementation
 * @see IMPLEMENTACION-SEGURA.md (FASE 2: SEO/i18n)
 */

import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  formatDate as formatDateFn,
  formatTime as formatTimeFn,
  formatDateTime as formatDateTimeFn,
  formatNumber as formatNumberFn,
  formatCurrency as formatCurrencyFn,
  formatPercent as formatPercentFn,
  formatRelativeTime as formatRelativeTimeFn,
  formatRelativeTimeAuto as formatRelativeTimeAutoFn,
  getWeekdayName as getWeekdayNameFn,
  getWeekdays as getWeekdaysFn,
  getMonthName as getMonthNameFn,
  getMonths as getMonthsFn,
  getIntlLocale,
  DATE_FORMATS,
  TIME_FORMATS,
  type DateFormatType,
  type TimeFormatType,
} from '../utils/intl-formatters';

// Default timezone for Spain
const DEFAULT_TIMEZONE = 'Europe/Madrid';

/**
 * Hook return type for better IDE support
 */
export interface UseIntlFormatReturn {
  /** Current language code (es, ca, en, fr) */
  language: string;
  /** Current BCP 47 locale (es-ES, ca-ES, en-GB, fr-FR) */
  locale: string;

  // Date formatting
  formatDate: (date: Date | string, format?: DateFormatType | Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string, format?: TimeFormatType | Intl.DateTimeFormatOptions) => string;
  formatDateTime: (
    date: Date | string,
    dateFormat?: DateFormatType,
    timeFormat?: TimeFormatType
  ) => string;

  // Number formatting
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatPercent: (value: number, decimals?: number) => string;

  // Relative time
  formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit) => string;
  formatRelativeTimeAuto: (date: Date | string) => string;

  // Utilities
  getWeekdayName: (dayIndex: number, format?: 'long' | 'short' | 'narrow') => string;
  getWeekdays: (format?: 'long' | 'short' | 'narrow', startMonday?: boolean) => string[];
  getMonthName: (monthIndex: number, format?: 'long' | 'short' | 'narrow') => string;
  getMonths: (format?: 'long' | 'short' | 'narrow') => string[];

  // Available formats (for reference)
  dateFormats: typeof DATE_FORMATS;
  timeFormats: typeof TIME_FORMATS;
}

/**
 * React hook for internationalized date/number formatting
 *
 * Automatically uses the current i18n language from react-i18next.
 *
 * @param timezone - Override timezone (defaults to Europe/Madrid)
 * @returns Object with formatting functions bound to current language
 *
 * @example
 * function EventCard({ event }) {
 *   const { formatDate, formatTime, formatCurrency } = useIntlFormat();
 *
 *   return (
 *     <div>
 *       <p>{formatDate(event.date, 'weekday')}</p>
 *       <p>{formatTime(event.date)}</p>
 *       <p>{formatCurrency(event.price)}</p>
 *     </div>
 *   );
 * }
 */
export function useIntlFormat(timezone: string = DEFAULT_TIMEZONE): UseIntlFormatReturn {
  const { i18n } = useTranslation();
  const language = i18n.language || 'es';
  const locale = getIntlLocale(language);

  // Date formatting - memoized for performance
  const formatDate = useCallback(
    (date: Date | string, format: DateFormatType | Intl.DateTimeFormatOptions = 'short') =>
      formatDateFn(date, language, format, timezone),
    [language, timezone]
  );

  const formatTime = useCallback(
    (date: Date | string, format: TimeFormatType | Intl.DateTimeFormatOptions = 'short') =>
      formatTimeFn(date, language, format, timezone),
    [language, timezone]
  );

  const formatDateTime = useCallback(
    (
      date: Date | string,
      dateFormat: DateFormatType = 'short',
      timeFormat: TimeFormatType = 'short'
    ) => formatDateTimeFn(date, language, dateFormat, timeFormat, timezone),
    [language, timezone]
  );

  // Number formatting
  const formatNumber = useCallback(
    (value: number, options: Intl.NumberFormatOptions = {}) =>
      formatNumberFn(value, language, options),
    [language]
  );

  const formatCurrency = useCallback(
    (value: number, currency: string = 'EUR') => formatCurrencyFn(value, language, currency),
    [language]
  );

  const formatPercent = useCallback(
    (value: number, decimals: number = 0) => formatPercentFn(value, language, decimals),
    [language]
  );

  // Relative time
  const formatRelativeTime = useCallback(
    (value: number, unit: Intl.RelativeTimeFormatUnit) =>
      formatRelativeTimeFn(value, unit, language),
    [language]
  );

  const formatRelativeTimeAuto = useCallback(
    (date: Date | string) => formatRelativeTimeAutoFn(date, language),
    [language]
  );

  // Weekday utilities
  const getWeekdayName = useCallback(
    (dayIndex: number, format: 'long' | 'short' | 'narrow' = 'long') =>
      getWeekdayNameFn(dayIndex, language, format),
    [language]
  );

  const getWeekdays = useCallback(
    (format: 'long' | 'short' | 'narrow' = 'long', startMonday: boolean = true) =>
      getWeekdaysFn(language, format, startMonday),
    [language]
  );

  // Month utilities
  const getMonthName = useCallback(
    (monthIndex: number, format: 'long' | 'short' | 'narrow' = 'long') =>
      getMonthNameFn(monthIndex, language, format),
    [language]
  );

  const getMonths = useCallback(
    (format: 'long' | 'short' | 'narrow' = 'long') => getMonthsFn(language, format),
    [language]
  );

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      language,
      locale,
      formatDate,
      formatTime,
      formatDateTime,
      formatNumber,
      formatCurrency,
      formatPercent,
      formatRelativeTime,
      formatRelativeTimeAuto,
      getWeekdayName,
      getWeekdays,
      getMonthName,
      getMonths,
      dateFormats: DATE_FORMATS,
      timeFormats: TIME_FORMATS,
    }),
    [
      language,
      locale,
      formatDate,
      formatTime,
      formatDateTime,
      formatNumber,
      formatCurrency,
      formatPercent,
      formatRelativeTime,
      formatRelativeTimeAuto,
      getWeekdayName,
      getWeekdays,
      getMonthName,
      getMonths,
    ]
  );
}

/**
 * Return type for standalone formatters
 */
export interface StandaloneFormattersReturn {
  language: string;
  locale: string;
  formatDate: (date: Date | string, format?: DateFormatType | Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string, format?: TimeFormatType | Intl.DateTimeFormatOptions) => string;
  formatDateTime: (
    date: Date | string,
    dateFormat?: DateFormatType,
    timeFormat?: TimeFormatType
  ) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatPercent: (value: number, decimals?: number) => string;
  formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit) => string;
  formatRelativeTimeAuto: (date: Date | string) => string;
  getWeekdayName: (dayIndex: number, format?: 'long' | 'short' | 'narrow') => string;
  getWeekdays: (format?: 'long' | 'short' | 'narrow', startMonday?: boolean) => string[];
  getMonthName: (monthIndex: number, format?: 'long' | 'short' | 'narrow') => string;
  getMonths: (format?: 'long' | 'short' | 'narrow') => string[];
}

/**
 * Standalone format functions for use outside React components
 * (e.g., in utility functions or API handlers)
 *
 * @example
 * import { standaloneFormatters } from './hooks/useIntlFormat';
 * const { formatDate } = standaloneFormatters('es');
 * console.log(formatDate(new Date(), 'short')); // "15 ene"
 */
export function standaloneFormatters(
  language: string,
  timezone: string = DEFAULT_TIMEZONE
): StandaloneFormattersReturn {
  return {
    language,
    locale: getIntlLocale(language),
    formatDate: (
      date: Date | string,
      format: DateFormatType | Intl.DateTimeFormatOptions = 'short'
    ) => formatDateFn(date, language, format, timezone),
    formatTime: (
      date: Date | string,
      format: TimeFormatType | Intl.DateTimeFormatOptions = 'short'
    ) => formatTimeFn(date, language, format, timezone),
    formatDateTime: (
      date: Date | string,
      dateFormat?: DateFormatType,
      timeFormat?: TimeFormatType
    ) => formatDateTimeFn(date, language, dateFormat, timeFormat, timezone),
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumberFn(value, language, options),
    formatCurrency: (value: number, currency?: string) =>
      formatCurrencyFn(value, language, currency),
    formatPercent: (value: number, decimals?: number) => formatPercentFn(value, language, decimals),
    formatRelativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit) =>
      formatRelativeTimeFn(value, unit, language),
    formatRelativeTimeAuto: (date: Date | string) => formatRelativeTimeAutoFn(date, language),
    getWeekdayName: (dayIndex: number, format?: 'long' | 'short' | 'narrow') =>
      getWeekdayNameFn(dayIndex, language, format),
    getWeekdays: (format?: 'long' | 'short' | 'narrow', startMonday?: boolean) =>
      getWeekdaysFn(language, format, startMonday),
    getMonthName: (monthIndex: number, format?: 'long' | 'short' | 'narrow') =>
      getMonthNameFn(monthIndex, language, format),
    getMonths: (format?: 'long' | 'short' | 'narrow') => getMonthsFn(language, format),
  };
}

export default useIntlFormat;
