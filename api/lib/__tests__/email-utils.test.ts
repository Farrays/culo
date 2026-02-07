/**
 * Tests for Email Utilities (Pure Functions)
 *
 * Tests calendar generation and category instructions:
 * - Google Calendar URL generation
 * - ICS file content generation
 * - Category-specific instructions
 *
 * Note: Only tests pure functions that don't require Resend/Redis mocking
 */

import { describe, it, expect } from 'vitest';
import { generateGoogleCalendarUrl, generateIcsDataUrl, getCategoryInstructions } from '../email';

describe('Email Utils - generateGoogleCalendarUrl', () => {
  it('should generate valid Google Calendar URL', () => {
    const url = generateGoogleCalendarUrl({
      className: 'Salsa Iniciación',
      classDate: 'Lunes, 27 de enero de 2026',
      classTime: '19:00',
    });

    expect(url).toContain('https://calendar.google.com/calendar/render');
    expect(url).toContain('action=TEMPLATE');
    expect(url).toContain('Salsa');
    expect(url).toContain('Farray'); // URL-encoded as Farray%27s
  });

  it('should use classDateRaw when provided (ISO format)', () => {
    const url = generateGoogleCalendarUrl({
      className: 'Bachata',
      classDate: 'Martes, 28 de enero de 2026', // This should be ignored
      classTime: '20:00',
      classDateRaw: '2026-01-28',
    });

    expect(url).toContain('calendar.google.com');
    // The date in the URL should be from classDateRaw
    expect(url).toContain('20260128');
  });

  it('should include class time in the event', () => {
    const url = generateGoogleCalendarUrl({
      className: 'Hip Hop',
      classDate: 'Miércoles, 15 de febrero de 2026',
      classTime: '18:30',
    });

    // Time should be encoded in the dates parameter
    expect(url).toContain('dates=');
  });

  it('should include location in URL', () => {
    const url = generateGoogleCalendarUrl({
      className: 'Twerk',
      classDate: 'Jueves, 16 de febrero de 2026',
      classTime: '21:00',
    });

    expect(url).toContain('location=');
    expect(url).toContain('Farray');
  });

  it('should handle various Spanish month names', () => {
    const months = [
      { date: '1 de enero de 2026', expected: '202601' },
      { date: '15 de marzo de 2026', expected: '202603' },
      { date: '20 de julio de 2026', expected: '202607' },
      { date: '31 de diciembre de 2026', expected: '202612' },
    ];

    for (const { date, expected } of months) {
      const url = generateGoogleCalendarUrl({
        className: 'Test',
        classDate: date,
        classTime: '10:00',
      });

      expect(url, `Failed for date: ${date}`).toContain(expected);
    }
  });
});

describe('Email Utils - generateIcsDataUrl', () => {
  it('should generate valid ICS data URL', () => {
    const url = generateIcsDataUrl({
      className: 'Salsa Iniciación',
      classDate: 'Lunes, 27 de enero de 2026',
      classTime: '19:00',
    });

    expect(url).toContain('data:text/calendar;charset=utf-8');
    expect(url).toContain('BEGIN%3AVCALENDAR');
    expect(url).toContain('END%3AVCALENDAR');
  });

  it('should include VEVENT structure', () => {
    const url = generateIcsDataUrl({
      className: 'Bachata',
      classDate: 'Martes, 28 de enero de 2026',
      classTime: '20:00',
    });

    const decoded = decodeURIComponent(url);

    expect(decoded).toContain('BEGIN:VEVENT');
    expect(decoded).toContain('END:VEVENT');
    expect(decoded).toContain('SUMMARY:Bachata');
  });

  it('should use eventId for UID when provided', () => {
    const url = generateIcsDataUrl({
      className: 'Hip Hop',
      classDate: 'Miércoles, 15 de febrero de 2026',
      classTime: '18:30',
      eventId: 'custom-event-123',
    });

    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('UID:custom-event-123');
  });

  it('should generate unique UID when eventId not provided', () => {
    const url1 = generateIcsDataUrl({
      className: 'Twerk',
      classDate: 'Jueves, 16 de febrero de 2026',
      classTime: '21:00',
    });

    const url2 = generateIcsDataUrl({
      className: 'Twerk',
      classDate: 'Jueves, 16 de febrero de 2026',
      classTime: '21:00',
    });

    // UIDs should be different (contain random component)
    expect(url1).not.toBe(url2);
  });

  it('should include location and description', () => {
    const url = generateIcsDataUrl({
      className: 'Sexy Style',
      classDate: 'Viernes, 17 de febrero de 2026',
      classTime: '20:00',
    });

    const decoded = decodeURIComponent(url);

    expect(decoded).toContain('LOCATION:');
    expect(decoded).toContain('DESCRIPTION:');
    expect(decoded).toContain("Farray's");
  });

  it('should use classDateRaw when provided', () => {
    const url = generateIcsDataUrl({
      className: 'Afrobeats',
      classDate: 'Sábado, 18 de febrero de 2026',
      classTime: '11:00',
      classDateRaw: '2026-02-18',
    });

    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('DTSTART:20260218');
  });
});

describe('Email Utils - getCategoryInstructions', () => {
  it('should return instructions for bailes_sociales', () => {
    const instructions = getCategoryInstructions('bailes_sociales');

    expect(instructions.title).toContain('Bailes Sociales');
    expect(instructions.items.length).toBeGreaterThan(3);
    expect(instructions.items.some(item => item.includes('Chicas'))).toBe(true);
    expect(instructions.items.some(item => item.includes('Chicos'))).toBe(true);
  });

  it('should return instructions for danzas_urbanas', () => {
    const instructions = getCategoryInstructions('danzas_urbanas');

    expect(instructions.title).toContain('Danzas Urbanas');
    expect(instructions.items.some(item => item.includes('Bambas'))).toBe(true);
    expect(instructions.items.some(item => item.includes('Sexy Style'))).toBe(true);
    expect(instructions.items.some(item => item.includes('Twerk'))).toBe(true);
  });

  it('should return instructions for danza category', () => {
    const instructions = getCategoryInstructions('danza');

    expect(instructions.title).toBeDefined();
    expect(instructions.items.length).toBeGreaterThan(0);
  });

  it('should return instructions for entrenamiento category', () => {
    const instructions = getCategoryInstructions('entrenamiento');

    expect(instructions.title).toBeDefined();
    expect(instructions.items.length).toBeGreaterThan(0);
  });

  it('should return default instructions when no category provided', () => {
    const instructions = getCategoryInstructions(undefined);

    expect(instructions).toBeDefined();
    expect(instructions.title).toBeDefined();
    expect(instructions.items.length).toBeGreaterThan(0);
  });

  it('should include common items in all categories', () => {
    const categories = ['bailes_sociales', 'danzas_urbanas', 'danza'] as const;

    for (const category of categories) {
      const instructions = getCategoryInstructions(category);

      // Common items should be present
      expect(
        instructions.items.some(item => item.includes('agua')),
        `${category} should include water`
      ).toBe(true);
    }
  });

  it('should have a color defined for each category', () => {
    const categories = ['bailes_sociales', 'danzas_urbanas', 'danza', undefined] as const;

    for (const category of categories) {
      const instructions = getCategoryInstructions(category);
      expect(instructions.color).toBeDefined();
      expect(instructions.color.length).toBeGreaterThan(0);
    }
  });
});
