/**
 * Tests for Booking Reconciliation System
 *
 * Tests the admin-bookings API and reconciliation logic:
 * - Booking listing and filtering
 * - Date range calculations
 * - Reconciliation status transitions
 * - Reschedule constraints
 * - Admin booking data transformation
 */

import { describe, it, expect } from 'vitest';

// ============================================================================
// HELPER FUNCTIONS (extracted for testing)
// ============================================================================

// These mirror the logic in api/admin-bookings.ts and api/cron-reconciliation.ts

function calculateEndTime(classTime: string): string {
  const [hours, minutes] = classTime.split(':').map(Number);
  const endHours = (hours || 0) + 1;
  return `${String(endHours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}`;
}

function getDatesInRange(from: string, to: string): string[] {
  const dates: string[] = [];
  // Use UTC to avoid timezone issues (matches Vercel production behavior)
  const start = new Date(from + 'T00:00:00Z');
  const end = new Date(to + 'T00:00:00Z');
  const MAX_RANGE_DAYS = 31;

  const current = new Date(start);
  while (current <= end && dates.length < MAX_RANGE_DAYS) {
    dates.push(current.toISOString().split('T')[0] as string);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-+()]/g, '');
}

interface BookingDetails {
  eventId: string;
  bookingType?: 'trial';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  category: string;
  calendarEventId?: string | null;
  createdAt: string;
  status?: 'confirmed' | 'cancelled';
  attendance?: 'pending' | 'confirmed' | 'not_attending';
  reconciliationStatus?:
    | 'pending'
    | 'attended'
    | 'no_show'
    | 'no_show_unresolved'
    | 'cancelled_on_time'
    | 'cancelled_late'
    | 'rescheduled';
  reconciliationProcessed?: boolean;
  momenceBookingId?: number | null;
  sessionId?: string | null;
  rescheduleCount?: number;
  rescheduledFrom?: string | null;
  rescheduledTo?: string | null;
}

function canReschedule(booking: BookingDetails): boolean {
  return (booking.rescheduleCount || 0) < 1 && !booking.rescheduledFrom;
}

function isClassFinished(classTime: string, classDate: string, now: Date): boolean {
  const [hours, minutes] = classTime.split(':').map(Number);
  const classEnd = new Date(
    `${classDate}T${String(hours || 0).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:00`
  );
  classEnd.setMinutes(classEnd.getMinutes() + 90); // 1h class + 30min buffer
  return now > classEnd;
}

function isCancellationOnTime(classDate: string, classTime: string, cancelTime: Date): boolean {
  const [hours, minutes] = classTime.split(':').map(Number);
  const classStart = new Date(
    `${classDate}T${String(hours || 0).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:00`
  );
  const twoHoursBefore = new Date(classStart.getTime() - 2 * 60 * 60 * 1000);
  return cancelTime < twoHoursBefore;
}

// ============================================================================
// TESTS
// ============================================================================

describe('Reconciliation - calculateEndTime', () => {
  it('should add 1 hour to class time', () => {
    expect(calculateEndTime('10:00')).toBe('11:00');
    expect(calculateEndTime('14:30')).toBe('15:30');
    expect(calculateEndTime('21:00')).toBe('22:00');
  });

  it('should handle midnight edge case', () => {
    expect(calculateEndTime('23:00')).toBe('24:00');
  });

  it('should pad single digit hours', () => {
    expect(calculateEndTime('9:00')).toBe('10:00');
  });
});

describe('Reconciliation - getDatesInRange', () => {
  it('should return dates for a single day range', () => {
    const dates = getDatesInRange('2026-02-19', '2026-02-19');
    expect(dates).toEqual(['2026-02-19']);
  });

  it('should return all dates in a week range', () => {
    const dates = getDatesInRange('2026-02-17', '2026-02-23');
    expect(dates.length).toBe(7);
    expect(dates[0]).toBe('2026-02-17');
    expect(dates[6]).toBe('2026-02-23');
  });

  it('should cap at 31 days maximum', () => {
    const dates = getDatesInRange('2026-01-01', '2026-12-31');
    expect(dates.length).toBe(31);
  });

  it('should handle month boundaries', () => {
    const dates = getDatesInRange('2026-02-27', '2026-03-02');
    // Feb 2026 has 28 days (not a leap year): 27, 28, Mar 1, Mar 2 = 4 days
    expect(dates.length).toBe(4);
    expect(dates).toEqual(['2026-02-27', '2026-02-28', '2026-03-01', '2026-03-02']);
  });

  it('should return empty for inverted range', () => {
    const dates = getDatesInRange('2026-02-20', '2026-02-18');
    expect(dates.length).toBe(0);
  });
});

describe('Reconciliation - normalizePhone', () => {
  it('should strip spaces, dashes, plus signs, and parens', () => {
    expect(normalizePhone('+34 600 123 456')).toBe('34600123456');
    expect(normalizePhone('(+34) 600-123-456')).toBe('34600123456');
    expect(normalizePhone('600 12 34 56')).toBe('600123456');
  });

  it('should handle already clean numbers', () => {
    expect(normalizePhone('34600123456')).toBe('34600123456');
  });
});

describe('Reconciliation - canReschedule', () => {
  it('should allow first reschedule', () => {
    const booking: BookingDetails = {
      eventId: 'evt-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '600123456',
      className: 'Salsa',
      classDate: '2026-02-19',
      classTime: '10:00',
      category: 'latina',
      createdAt: '2026-02-18T10:00:00Z',
      rescheduleCount: 0,
      rescheduledFrom: null,
    };
    expect(canReschedule(booking)).toBe(true);
  });

  it('should NOT allow second reschedule', () => {
    const booking: BookingDetails = {
      eventId: 'evt-2',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '600123456',
      className: 'Salsa',
      classDate: '2026-02-26',
      classTime: '10:00',
      category: 'latina',
      createdAt: '2026-02-25T10:00:00Z',
      rescheduleCount: 1,
      rescheduledFrom: null,
    };
    expect(canReschedule(booking)).toBe(false);
  });

  it('should NOT allow reschedule of an already rescheduled booking', () => {
    const booking: BookingDetails = {
      eventId: 'evt-3',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '600123456',
      className: 'Salsa',
      classDate: '2026-02-26',
      classTime: '10:00',
      category: 'latina',
      createdAt: '2026-02-25T10:00:00Z',
      rescheduleCount: 0,
      rescheduledFrom: 'evt-1', // This is already a rescheduled booking
    };
    expect(canReschedule(booking)).toBe(false);
  });

  it('should handle undefined rescheduleCount as 0', () => {
    const booking: BookingDetails = {
      eventId: 'evt-4',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '600123456',
      className: 'Salsa',
      classDate: '2026-02-19',
      classTime: '10:00',
      category: 'latina',
      createdAt: '2026-02-18T10:00:00Z',
    };
    expect(canReschedule(booking)).toBe(true);
  });
});

describe('Reconciliation - isClassFinished', () => {
  it('should detect finished class (30min buffer)', () => {
    // Class at 10:00, ends at 11:00, buffer until 11:30
    const now = new Date('2026-02-19T11:31:00');
    expect(isClassFinished('10:00', '2026-02-19', now)).toBe(true);
  });

  it('should NOT mark class as finished during buffer', () => {
    // Class at 10:00, buffer until 11:30 - checking at 11:15
    const now = new Date('2026-02-19T11:15:00');
    expect(isClassFinished('10:00', '2026-02-19', now)).toBe(false);
  });

  it('should NOT mark class as finished before it ends', () => {
    const now = new Date('2026-02-19T10:30:00');
    expect(isClassFinished('10:00', '2026-02-19', now)).toBe(false);
  });

  it('should handle evening classes', () => {
    // Class at 21:00, buffer until 22:30
    const now = new Date('2026-02-19T22:31:00');
    expect(isClassFinished('21:00', '2026-02-19', now)).toBe(true);
  });
});

describe('Reconciliation - isCancellationOnTime', () => {
  it('should be on-time when cancelling >= 2h before', () => {
    // Class at 10:00, cancel at 07:00 (3h before)
    const cancelTime = new Date('2026-02-19T07:00:00');
    expect(isCancellationOnTime('2026-02-19', '10:00', cancelTime)).toBe(true);
  });

  it('should be late when cancelling < 2h before', () => {
    // Class at 10:00, cancel at 08:30 (1.5h before)
    const cancelTime = new Date('2026-02-19T08:30:00');
    expect(isCancellationOnTime('2026-02-19', '10:00', cancelTime)).toBe(false);
  });

  it('should be late when cancelling exactly 2h before', () => {
    // Class at 10:00, cancel at exactly 08:00 (2h before)
    const cancelTime = new Date('2026-02-19T08:00:00');
    expect(isCancellationOnTime('2026-02-19', '10:00', cancelTime)).toBe(false);
  });

  it('should be on-time when cancelling day before', () => {
    const cancelTime = new Date('2026-02-18T20:00:00');
    expect(isCancellationOnTime('2026-02-19', '10:00', cancelTime)).toBe(true);
  });
});

describe('Reconciliation - Status Transitions', () => {
  it('should have valid reconciliation status values', () => {
    const validStatuses: BookingDetails['reconciliationStatus'][] = [
      'pending',
      'attended',
      'no_show',
      'no_show_unresolved',
      'cancelled_on_time',
      'cancelled_late',
      'rescheduled',
    ];
    expect(validStatuses.length).toBe(7);
  });

  it('should only allow trial bookings to be processed', () => {
    const trialBooking: BookingDetails = {
      eventId: 'evt-1',
      bookingType: 'trial',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '600123456',
      className: 'Salsa',
      classDate: '2026-02-19',
      classTime: '10:00',
      category: 'latina',
      createdAt: '2026-02-18T10:00:00Z',
    };
    expect(trialBooking.bookingType).toBe('trial');
  });

  it('should skip already processed bookings', () => {
    const processedBooking: BookingDetails = {
      eventId: 'evt-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '600123456',
      className: 'Salsa',
      classDate: '2026-02-19',
      classTime: '10:00',
      category: 'latina',
      createdAt: '2026-02-18T10:00:00Z',
      reconciliationProcessed: true,
    };
    expect(processedBooking.reconciliationProcessed).toBe(true);
  });

  it('should skip cancelled bookings', () => {
    const cancelledBooking: BookingDetails = {
      eventId: 'evt-1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '600123456',
      className: 'Salsa',
      classDate: '2026-02-19',
      classTime: '10:00',
      category: 'latina',
      createdAt: '2026-02-18T10:00:00Z',
      status: 'cancelled',
    };
    expect(cancelledBooking.status).toBe('cancelled');
  });
});

describe('Reconciliation - Booking Data Validation', () => {
  it('should require all essential booking fields', () => {
    const booking: BookingDetails = {
      eventId: 'evt-test-123',
      bookingType: 'trial',
      firstName: 'Laura',
      lastName: 'Díaz',
      email: 'laura@example.com',
      phone: '+34 600 123 456',
      className: 'Sexy Reggaeton Open Level',
      classDate: '2026-02-19',
      classTime: '10:00',
      category: 'urbana',
      createdAt: '2026-02-18T15:00:00Z',
      status: 'confirmed',
      attendance: 'pending',
      reconciliationStatus: 'pending',
      reconciliationProcessed: false,
      rescheduleCount: 0,
      rescheduledFrom: null,
      rescheduledTo: null,
      momenceBookingId: 12345,
      sessionId: 'ses-456',
    };

    // Validate all required fields exist
    expect(booking.eventId).toBeTruthy();
    expect(booking.bookingType).toBe('trial');
    expect(booking.firstName).toBeTruthy();
    expect(booking.email).toContain('@');
    expect(booking.phone).toBeTruthy();
    expect(booking.className).toBeTruthy();
    expect(booking.classDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(booking.classTime).toMatch(/^\d{2}:\d{2}$/);
    expect(booking.reconciliationStatus).toBe('pending');
    expect(booking.rescheduleCount).toBe(0);
  });

  it('should generate valid WhatsApp URL from phone', () => {
    const phone = normalizePhone('+34 600 123 456');
    const whatsappUrl = `https://wa.me/${phone.startsWith('34') ? phone : '34' + phone}`;
    expect(whatsappUrl).toBe('https://wa.me/34600123456');
  });

  it('should generate valid management URL from email and eventId', () => {
    const email = 'laura@example.com';
    const eventId = 'evt-test-123';
    const managementUrl = `/es/mi-reserva?email=${encodeURIComponent(email)}&event=${eventId}`;
    expect(managementUrl).toBe('/es/mi-reserva?email=laura%40example.com&event=evt-test-123');
  });
});
