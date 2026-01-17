/* eslint-disable no-undef */
/**
 * Calendar Export Utilities
 *
 * Generates Google Calendar links and .ics files for booking confirmations.
 * Supports timezone-aware events for Europe/Madrid.
 */

export interface CalendarEvent {
  title: string;
  description: string;
  startTime: string; // ISO format
  durationMinutes: number;
  location: string;
  attendeeName?: string;
  attendeeEmail?: string;
}

/**
 * Formats a date for Google Calendar URL (YYYYMMDDTHHmmssZ format)
 */
function formatDateForGoogle(isoDate: string): string {
  return new Date(isoDate)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/**
 * Formats a date for ICS file (YYYYMMDDTHHMMSS format, no Z suffix for local time)
 */
function formatDateForICS(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Calculates end time from start time and duration
 */
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const start = new Date(startTime);
  return new Date(start.getTime() + durationMinutes * 60000).toISOString();
}

/**
 * Escapes special characters for ICS format
 */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generates a Google Calendar URL with pre-filled event details
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const endTime = calculateEndTime(event.startTime, event.durationMinutes);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDateForGoogle(event.startTime)}/${formatDateForGoogle(endTime)}`,
    location: event.location,
    details: event.description,
    ctz: 'Europe/Madrid',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates ICS file content for calendar import
 */
export function generateICSContent(event: CalendarEvent): string {
  const endTime = calculateEndTime(event.startTime, event.durationMinutes);
  const now = new Date();
  const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@farrayscenter.com`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    "PRODID:-//Farray's Center//Booking//EN",
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-TIMEZONE:Europe/Madrid',
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Madrid',
    'X-LIC-LOCATION:Europe/Madrid',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDateForICS(now.toISOString())}`,
    `DTSTART;TZID=Europe/Madrid:${formatDateForICS(event.startTime)}`,
    `DTEND;TZID=Europe/Madrid:${formatDateForICS(endTime)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS(event.location)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
  ];

  // Add attendee if provided
  if (event.attendeeName && event.attendeeEmail) {
    lines.push(
      `ATTENDEE;CN=${escapeICS(event.attendeeName)};RSVP=FALSE:mailto:${event.attendeeEmail}`
    );
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Downloads an ICS file to the user's device
 */
export function downloadICSFile(event: CalendarEvent): void {
  const content = generateICSContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Create filename from event title (sanitized)
  const filename = `${event.title.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s-]/g, '').replace(/\s+/g, '-')}.ics`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
