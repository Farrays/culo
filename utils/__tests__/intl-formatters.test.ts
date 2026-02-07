/**
 * Tests for Intl Formatters
 *
 * Verifies that internationalized formatting works correctly
 * across all supported locales (es, ca, en, fr).
 */

import { describe, it, expect } from 'vitest';
import {
  getIntlLocale,
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatRelativeTime,
  getWeekdayName,
  getWeekdays,
  getMonthName,
  getMonths,
} from '../intl-formatters';

// ============================================================================
// LOCALE MAPPING
// ============================================================================

describe('getIntlLocale', () => {
  it('should map supported languages to BCP 47 locales', () => {
    expect(getIntlLocale('es')).toBe('es-ES');
    expect(getIntlLocale('ca')).toBe('ca-ES');
    expect(getIntlLocale('en')).toBe('en-GB');
    expect(getIntlLocale('fr')).toBe('fr-FR');
  });

  it('should fallback to es-ES for unknown languages', () => {
    expect(getIntlLocale('de')).toBe('es-ES');
    expect(getIntlLocale('')).toBe('es-ES');
  });
});

// ============================================================================
// DATE FORMATTING
// ============================================================================

describe('formatDate', () => {
  const testDate = new Date('2024-01-15T19:30:00Z');

  it('should format dates in Spanish', () => {
    const result = formatDate(testDate, 'es', 'short');
    expect(result).toContain('15');
    expect(result.toLowerCase()).toMatch(/ene/);
  });

  it('should format dates in Catalan', () => {
    const result = formatDate(testDate, 'ca', 'short');
    expect(result).toContain('15');
    expect(result.toLowerCase()).toMatch(/gen/);
  });

  it('should format dates in English', () => {
    const result = formatDate(testDate, 'en', 'short');
    expect(result).toContain('15');
    expect(result.toLowerCase()).toMatch(/jan/);
  });

  it('should format dates in French', () => {
    const result = formatDate(testDate, 'fr', 'short');
    expect(result).toContain('15');
    expect(result.toLowerCase()).toMatch(/janv/);
  });

  it('should support medium format', () => {
    const result = formatDate(testDate, 'es', 'medium');
    expect(result).toContain('15');
    expect(result.toLowerCase()).toContain('enero');
  });

  it('should support long format with year', () => {
    const result = formatDate(testDate, 'es', 'long');
    expect(result).toContain('15');
    expect(result.toLowerCase()).toContain('enero');
    expect(result).toContain('2024');
  });

  it('should support weekday format', () => {
    const result = formatDate(testDate, 'es', 'weekday');
    expect(result.toLowerCase()).toMatch(/lunes/);
  });

  it('should accept string dates', () => {
    const result = formatDate('2024-01-15T19:30:00Z', 'es', 'short');
    expect(result).toContain('15');
  });
});

// ============================================================================
// TIME FORMATTING
// ============================================================================

describe('formatTime', () => {
  const testDate = new Date('2024-01-15T19:30:00Z');

  it('should format time in 24-hour format', () => {
    const result = formatTime(testDate, 'es', 'short');
    // Time depends on timezone, but should contain colon
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it('should support 12-hour format', () => {
    const result = formatTime(testDate, 'en', 'hour12');
    expect(result.toLowerCase()).toMatch(/am|pm/);
  });
});

// ============================================================================
// DATE TIME FORMATTING
// ============================================================================

describe('formatDateTime', () => {
  const testDate = new Date('2024-01-15T19:30:00Z');

  it('should combine date and time', () => {
    const result = formatDateTime(testDate, 'es', 'short', 'short');
    expect(result).toContain('15');
    expect(result).toContain(',');
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

describe('formatNumber', () => {
  it('should format numbers with Spanish locale (comma as decimal)', () => {
    const result = formatNumber(1234.56, 'es');
    // Spanish uses comma for decimal and period for thousands
    expect(result).toMatch(/1[.\s]?234[,.]56/);
  });

  it('should format numbers with English locale (period as decimal)', () => {
    const result = formatNumber(1234.56, 'en');
    // English uses period for decimal and comma for thousands
    expect(result).toMatch(/1[,\s]?234\.56/);
  });

  it('should format numbers with French locale', () => {
    const result = formatNumber(1234.56, 'fr');
    // French uses comma for decimal and space for thousands
    expect(result).toMatch(/1[\s\u00A0]?234[,.]56/);
  });
});

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

describe('formatCurrency', () => {
  it('should format currency in Spanish', () => {
    const result = formatCurrency(25, 'es');
    expect(result).toContain('25');
    expect(result).toContain('€');
  });

  it('should format currency in English', () => {
    const result = formatCurrency(25, 'en');
    expect(result).toContain('25');
    expect(result).toContain('€');
  });

  it('should support different currencies', () => {
    const result = formatCurrency(25, 'en', 'USD');
    expect(result).toContain('25');
    expect(result).toMatch(/\$|USD/);
  });

  it('should format with 2 decimal places', () => {
    const result = formatCurrency(25, 'es');
    expect(result).toMatch(/25[,.]00/);
  });
});

// ============================================================================
// PERCENT FORMATTING
// ============================================================================

describe('formatPercent', () => {
  it('should format percentages', () => {
    const result = formatPercent(0.15, 'es');
    expect(result).toContain('15');
    expect(result).toContain('%');
  });

  it('should support decimal places', () => {
    const result = formatPercent(0.156, 'es', 1);
    expect(result).toMatch(/15[,.]6/);
  });
});

// ============================================================================
// RELATIVE TIME FORMATTING
// ============================================================================

describe('formatRelativeTime', () => {
  it('should format past time in Spanish', () => {
    const result = formatRelativeTime(-2, 'day', 'es');
    // Intl may use special words like "anteayer" for 2 days ago
    expect(result.toLowerCase()).toMatch(/hace.*2.*días|anteayer/);
  });

  it('should format future time in Spanish', () => {
    const result = formatRelativeTime(3, 'hour', 'es');
    expect(result.toLowerCase()).toMatch(/dentro de.*3.*horas|en 3 horas/);
  });

  it('should format relative time in English', () => {
    const result = formatRelativeTime(-1, 'day', 'en');
    expect(result.toLowerCase()).toMatch(/yesterday|1 day ago/);
  });

  it('should format relative time in Catalan', () => {
    const result = formatRelativeTime(-2, 'day', 'ca');
    // Intl may use special words like "abans-d'ahir" for 2 days ago
    expect(result.toLowerCase()).toMatch(/fa.*2.*dies|abans/);
  });
});

// ============================================================================
// WEEKDAY UTILITIES
// ============================================================================

describe('getWeekdayName', () => {
  it('should return weekday names in Spanish', () => {
    expect(getWeekdayName(1, 'es', 'long').toLowerCase()).toBe('lunes');
    expect(getWeekdayName(0, 'es', 'long').toLowerCase()).toBe('domingo');
  });

  it('should return weekday names in Catalan', () => {
    expect(getWeekdayName(1, 'ca', 'long').toLowerCase()).toBe('dilluns');
  });

  it('should return weekday names in English', () => {
    expect(getWeekdayName(1, 'en', 'long').toLowerCase()).toBe('monday');
  });

  it('should return weekday names in French', () => {
    expect(getWeekdayName(1, 'fr', 'long').toLowerCase()).toBe('lundi');
  });

  it('should support short format', () => {
    const result = getWeekdayName(1, 'es', 'short').toLowerCase();
    expect(result).toMatch(/lun/);
  });
});

describe('getWeekdays', () => {
  it('should return all weekdays starting with Monday', () => {
    const days = getWeekdays('es', 'long', true);
    expect(days).toHaveLength(7);
    expect(days[0]?.toLowerCase()).toBe('lunes');
    expect(days[6]?.toLowerCase()).toBe('domingo');
  });

  it('should return all weekdays starting with Sunday', () => {
    const days = getWeekdays('es', 'long', false);
    expect(days).toHaveLength(7);
    expect(days[0]?.toLowerCase()).toBe('domingo');
    expect(days[1]?.toLowerCase()).toBe('lunes');
  });
});

// ============================================================================
// MONTH UTILITIES
// ============================================================================

describe('getMonthName', () => {
  it('should return month names in Spanish', () => {
    expect(getMonthName(0, 'es', 'long').toLowerCase()).toBe('enero');
    expect(getMonthName(11, 'es', 'long').toLowerCase()).toBe('diciembre');
  });

  it('should return month names in Catalan', () => {
    expect(getMonthName(0, 'ca', 'long').toLowerCase()).toMatch(/gener/);
  });

  it('should return month names in English', () => {
    expect(getMonthName(0, 'en', 'long').toLowerCase()).toBe('january');
  });

  it('should return month names in French', () => {
    expect(getMonthName(0, 'fr', 'long').toLowerCase()).toBe('janvier');
  });

  it('should support short format', () => {
    const result = getMonthName(0, 'es', 'short').toLowerCase();
    expect(result).toMatch(/ene/);
  });
});

describe('getMonths', () => {
  it('should return all 12 months', () => {
    const months = getMonths('es', 'long');
    expect(months).toHaveLength(12);
    expect(months[0]?.toLowerCase()).toBe('enero');
    expect(months[11]?.toLowerCase()).toBe('diciembre');
  });
});

// ============================================================================
// CACHING (Performance)
// ============================================================================

describe('Formatter Caching', () => {
  it('should return consistent results for repeated calls', () => {
    const date = new Date('2024-01-15T19:30:00Z');

    // Call multiple times to test caching
    const result1 = formatDate(date, 'es', 'short');
    const result2 = formatDate(date, 'es', 'short');
    const result3 = formatDate(date, 'es', 'short');

    expect(result1).toBe(result2);
    expect(result2).toBe(result3);
  });

  it('should handle different locales independently', () => {
    const date = new Date('2024-01-15T19:30:00Z');

    const esResult = formatDate(date, 'es', 'short');
    const caResult = formatDate(date, 'ca', 'short');

    expect(esResult).not.toBe(caResult);
  });
});
