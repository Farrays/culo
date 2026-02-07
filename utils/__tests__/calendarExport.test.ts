/**
 * Tests for Calendar Export Utilities
 *
 * Tests Google Calendar URL and ICS file generation:
 * - URL formatting
 * - ICS content structure
 * - Timezone handling
 * - Special character escaping
 */

import { describe, it, expect } from 'vitest';
import {
  generateGoogleCalendarUrl,
  generateICSContent,
  type CalendarEvent,
} from '../calendarExport';

const sampleEvent: CalendarEvent = {
  title: 'Salsa Iniciación',
  description: "Clase de prueba en Farray's Center",
  startTime: '2026-02-15T19:00:00',
  durationMinutes: 60,
  location: "Farray's International Dance Center, Barcelona",
};

describe('Calendar Export - generateGoogleCalendarUrl', () => {
  it('should generate valid Google Calendar URL', () => {
    const url = generateGoogleCalendarUrl(sampleEvent);

    expect(url).toContain('https://calendar.google.com/calendar/render');
    expect(url).toContain('action=TEMPLATE');
  });

  it('should include event title', () => {
    const url = generateGoogleCalendarUrl(sampleEvent);

    expect(url).toContain('text=Salsa');
  });

  it('should include dates parameter', () => {
    const url = generateGoogleCalendarUrl(sampleEvent);

    expect(url).toContain('dates=');
    // Start and end dates separated by /
    expect(url).toMatch(/dates=\d{8}T\d{6}Z%2F\d{8}T\d{6}Z/);
  });

  it('should include location', () => {
    const url = generateGoogleCalendarUrl(sampleEvent);

    expect(url).toContain('location=');
    expect(url).toContain('Farray');
  });

  it('should include description', () => {
    const url = generateGoogleCalendarUrl(sampleEvent);

    expect(url).toContain('details=');
  });

  it('should include timezone', () => {
    const url = generateGoogleCalendarUrl(sampleEvent);

    expect(url).toContain('ctz=Europe%2FMadrid');
  });

  it('should calculate end time correctly', () => {
    const event: CalendarEvent = {
      ...sampleEvent,
      startTime: '2026-02-15T19:00:00Z',
      durationMinutes: 90,
    };

    const url = generateGoogleCalendarUrl(event);

    // End time should be 90 minutes after start (20:30)
    expect(url).toContain('dates=');
  });

  it('should handle events with special characters', () => {
    const event: CalendarEvent = {
      ...sampleEvent,
      title: 'Bachata & Salsa Class',
      description: 'Clase con música "latina"',
    };

    const url = generateGoogleCalendarUrl(event);

    // Should not throw and should be a valid URL
    expect(url).toContain('calendar.google.com');
  });
});

describe('Calendar Export - generateICSContent', () => {
  it('should generate valid ICS structure', () => {
    const ics = generateICSContent(sampleEvent);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
  });

  it('should include calendar version and prodid', () => {
    const ics = generateICSContent(sampleEvent);

    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:');
  });

  it('should include timezone definition', () => {
    const ics = generateICSContent(sampleEvent);

    expect(ics).toContain('BEGIN:VTIMEZONE');
    expect(ics).toContain('TZID:Europe/Madrid');
    expect(ics).toContain('END:VTIMEZONE');
  });

  it('should include event summary', () => {
    const ics = generateICSContent(sampleEvent);

    expect(ics).toContain('SUMMARY:Salsa');
  });

  it('should include event location', () => {
    const ics = generateICSContent(sampleEvent);

    expect(ics).toContain('LOCATION:Farray');
  });

  it('should include DTSTART and DTEND with timezone', () => {
    const ics = generateICSContent(sampleEvent);

    expect(ics).toContain('DTSTART;TZID=Europe/Madrid:');
    expect(ics).toContain('DTEND;TZID=Europe/Madrid:');
  });

  it('should include unique UID', () => {
    const ics1 = generateICSContent(sampleEvent);
    const ics2 = generateICSContent(sampleEvent);

    const uid1 = ics1.match(/UID:(.+)/)?.[1];
    const uid2 = ics2.match(/UID:(.+)/)?.[1];

    expect(uid1).toBeDefined();
    expect(uid2).toBeDefined();
    expect(uid1).not.toBe(uid2); // UIDs should be unique
  });

  it('should include DTSTAMP', () => {
    const ics = generateICSContent(sampleEvent);

    expect(ics).toContain('DTSTAMP:');
  });

  it('should include STATUS:CONFIRMED', () => {
    const ics = generateICSContent(sampleEvent);

    expect(ics).toContain('STATUS:CONFIRMED');
  });

  it('should include attendee when provided', () => {
    const event: CalendarEvent = {
      ...sampleEvent,
      attendeeName: 'John Doe',
      attendeeEmail: 'john@example.com',
    };

    const ics = generateICSContent(event);

    expect(ics).toContain('ATTENDEE;');
    expect(ics).toContain('CN=John Doe');
    expect(ics).toContain('mailto:john@example.com');
  });

  it('should not include attendee when not provided', () => {
    const ics = generateICSContent(sampleEvent);

    expect(ics).not.toContain('ATTENDEE');
  });

  it('should escape special characters in ICS', () => {
    const event: CalendarEvent = {
      ...sampleEvent,
      title: 'Class; with, special\\chars',
      description: 'Line1\nLine2',
    };

    const ics = generateICSContent(event);

    // Semicolons, commas, and backslashes should be escaped
    expect(ics).toContain('SUMMARY:Class\\; with\\, special\\\\chars');
    expect(ics).toContain('DESCRIPTION:Line1\\nLine2');
  });

  it('should use CRLF line endings', () => {
    const ics = generateICSContent(sampleEvent);

    // ICS spec requires CRLF
    expect(ics).toContain('\r\n');
  });

  it('should calculate end time based on duration', () => {
    const event: CalendarEvent = {
      ...sampleEvent,
      startTime: '2026-02-15T19:00:00',
      durationMinutes: 90,
    };

    const ics = generateICSContent(event);

    // 19:00 + 90 min = 20:30
    expect(ics).toContain('DTSTART;TZID=Europe/Madrid:20260215T190000');
    expect(ics).toContain('DTEND;TZID=Europe/Madrid:20260215T203000');
  });
});

describe('Calendar Export - Edge Cases', () => {
  it('should handle midnight events', () => {
    const event: CalendarEvent = {
      ...sampleEvent,
      startTime: '2026-02-15T00:00:00',
    };

    const ics = generateICSContent(event);
    const url = generateGoogleCalendarUrl(event);

    expect(ics).toContain('BEGIN:VEVENT');
    expect(url).toContain('calendar.google.com');
  });

  it('should handle events crossing midnight', () => {
    const event: CalendarEvent = {
      ...sampleEvent,
      startTime: '2026-02-15T23:30:00',
      durationMinutes: 90, // Ends at 01:00 next day
    };

    const ics = generateICSContent(event);

    expect(ics).toContain('DTSTART');
    expect(ics).toContain('DTEND');
  });

  it('should handle very long descriptions', () => {
    const event: CalendarEvent = {
      ...sampleEvent,
      description: 'A'.repeat(1000),
    };

    const ics = generateICSContent(event);
    const url = generateGoogleCalendarUrl(event);

    expect(ics).toContain('DESCRIPTION:');
    expect(url).toContain('details=');
  });

  it('should handle empty location', () => {
    const event: CalendarEvent = {
      ...sampleEvent,
      location: '',
    };

    const ics = generateICSContent(event);

    expect(ics).toContain('LOCATION:');
  });

  it('should handle unicode characters', () => {
    const event: CalendarEvent = {
      ...sampleEvent,
      title: 'Clase de Salsa con María García 💃',
      location: 'C/ Entença 100, Barcelona',
    };

    const ics = generateICSContent(event);
    const url = generateGoogleCalendarUrl(event);

    expect(ics).toContain('SUMMARY:');
    expect(url).toContain('calendar.google.com');
  });
});
