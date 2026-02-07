/**
 * Booking Flow Tests
 *
 * Tests the conversational booking flow for class reservations.
 * Run with: npm test -- booking-flow.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  BookingFlow,
  detectBookingIntent,
  isInBookingFlow,
  type ClassOption,
} from './booking-flow';

describe('BookingFlow', () => {
  let flow: BookingFlow;

  beforeEach(() => {
    flow = new BookingFlow('es');
  });

  describe('startBooking', () => {
    it('should initialize booking flow and ask for style', async () => {
      const result = await flow.startBooking('+34612345678');

      expect(result.newState.step).toBe('style_selection');
      expect(result.newState.data.phone).toBe('+34612345678');
      expect(result.response).toContain('estilo de baile');
    });
  });

  describe('processInput - style selection', () => {
    beforeEach(async () => {
      await flow.startBooking('+34612345678');
    });

    it('should detect salsa style', async () => {
      const mockClasses: ClassOption[] = [
        {
          id: 1,
          name: 'Salsa Iniciación',
          date: '10/02',
          time: '19:00',
          dayOfWeek: 'Lunes',
          spotsAvailable: 10,
          instructor: 'Carlos',
          style: 'salsa',
        },
      ];

      const result = await flow.processInput('Me interesa salsa', () =>
        Promise.resolve(mockClasses)
      );

      expect(result.newState.data.style).toBe('salsa');
      expect(result.newState.step).toBe('class_selection');
    });

    it('should detect bachata style', async () => {
      const mockClasses: ClassOption[] = [
        {
          id: 2,
          name: 'Bachata Sensual',
          date: '11/02',
          time: '20:00',
          dayOfWeek: 'Martes',
          spotsAvailable: 8,
          instructor: 'Laura',
          style: 'bachata',
        },
      ];

      const result = await flow.processInput('Quiero bachata', () => Promise.resolve(mockClasses));

      expect(result.newState.data.style).toBe('bachata');
    });

    it('should handle unknown style gracefully', async () => {
      const result = await flow.processInput('algo raro', () => Promise.resolve([]));

      expect(result.newState.step).toBe('style_selection'); // Stay on same step
      expect(result.response).toContain('estilo');
    });
  });

  describe('processInput - class selection', () => {
    beforeEach(async () => {
      await flow.startBooking('+34612345678');
      const mockClasses: ClassOption[] = [
        {
          id: 1,
          name: 'Salsa Iniciación',
          date: '10/02',
          time: '19:00',
          dayOfWeek: 'Lunes',
          spotsAvailable: 10,
          instructor: 'Carlos',
          style: 'salsa',
        },
        {
          id: 2,
          name: 'Salsa Nivel 1',
          date: '12/02',
          time: '20:00',
          dayOfWeek: 'Miércoles',
          spotsAvailable: 5,
          instructor: 'María',
          style: 'salsa',
        },
      ];
      await flow.processInput('salsa', () => Promise.resolve(mockClasses));
    });

    it('should select class by number', async () => {
      const result = await flow.processInput('1');

      expect(result.newState.data.selectedClassId).toBe(1);
      expect(result.newState.data.selectedClassName).toBe('Salsa Iniciación');
      expect(result.newState.step).toBe('data_collection');
    });

    it('should reject invalid number', async () => {
      const result = await flow.processInput('99');

      expect(result.newState.step).toBe('class_selection'); // Stay on same step
      expect(result.response).toContain('número');
    });
  });

  describe('processInput - data collection', () => {
    beforeEach(async () => {
      await flow.startBooking('+34612345678');
      const mockClasses: ClassOption[] = [
        {
          id: 1,
          name: 'Salsa Iniciación',
          date: '10/02',
          time: '19:00',
          dayOfWeek: 'Lunes',
          spotsAvailable: 10,
          instructor: 'Carlos',
          style: 'salsa',
        },
      ];
      await flow.processInput('salsa', () => Promise.resolve(mockClasses));
      await flow.processInput('1');
    });

    it('should collect name', async () => {
      const result = await flow.processInput('Juan García');

      expect(result.newState.data.firstName).toBe('Juan');
      expect(result.newState.data.lastName).toBe('García');
      expect(result.response).toContain('email');
    });

    it('should validate email', async () => {
      await flow.processInput('Juan García');
      const result = await flow.processInput('invalid-email');

      expect(result.newState.step).toBe('data_collection'); // Stay on same step
      expect(result.response).toContain('email');
    });

    it('should accept valid email and move to consents', async () => {
      await flow.processInput('Juan García');
      const result = await flow.processInput('juan@email.com');

      expect(result.newState.data.email).toBe('juan@email.com');
      expect(result.newState.step).toBe('consent_terms');
    });
  });

  describe('processInput - consents', () => {
    beforeEach(async () => {
      await flow.startBooking('+34612345678');
      const mockClasses: ClassOption[] = [
        {
          id: 1,
          name: 'Salsa Iniciación',
          date: '10/02',
          time: '19:00',
          dayOfWeek: 'Lunes',
          spotsAvailable: 10,
          instructor: 'Carlos',
          style: 'salsa',
        },
      ];
      await flow.processInput('salsa', () => Promise.resolve(mockClasses));
      await flow.processInput('1');
      await flow.processInput('Juan García');
      await flow.processInput('juan@email.com');
    });

    it('should accept terms', async () => {
      const result = await flow.processInput('sí');

      expect(result.newState.data.acceptsTerms).toBe(true);
      expect(result.newState.step).toBe('consent_privacy');
    });

    it('should reject without terms', async () => {
      const result = await flow.processInput('no');

      expect(result.newState.step).toBe('initial');
      expect(result.response).toContain('Entiendo');
    });

    it('should complete full consent flow', async () => {
      await flow.processInput('sí'); // terms
      await flow.processInput('sí'); // privacy
      const result = await flow.processInput('sí'); // marketing

      expect(result.newState.data.acceptsTerms).toBe(true);
      expect(result.newState.data.acceptsPrivacy).toBe(true);
      expect(result.newState.data.acceptsMarketing).toBe(true);
      expect(result.newState.step).toBe('confirmation');
    });
  });

  describe('processInput - confirmation', () => {
    beforeEach(async () => {
      await flow.startBooking('+34612345678');
      const mockClasses: ClassOption[] = [
        {
          id: 1,
          name: 'Salsa Iniciación',
          date: '10/02',
          time: '19:00',
          dayOfWeek: 'Lunes',
          spotsAvailable: 10,
          instructor: 'Carlos',
          style: 'salsa',
        },
      ];
      await flow.processInput('salsa', () => Promise.resolve(mockClasses));
      await flow.processInput('1');
      await flow.processInput('Juan García');
      await flow.processInput('juan@email.com');
      await flow.processInput('sí'); // terms
      await flow.processInput('sí'); // privacy
      await flow.processInput('no'); // marketing (optional)
    });

    it('should confirm booking', async () => {
      const result = await flow.processInput('sí');

      expect(result.shouldBook).toBe(true);
      expect(result.bookingData).toBeDefined();
      expect(result.bookingData?.firstName).toBe('Juan');
      expect(result.bookingData?.email).toBe('juan@email.com');
      expect(result.newState.step).toBe('completed');
    });

    it('should cancel booking on rejection', async () => {
      const result = await flow.processInput('no');

      expect(result.shouldBook).toBeFalsy();
      expect(result.newState.step).toBe('initial');
    });
  });
});

describe('detectBookingIntent', () => {
  it('should detect reservation intent', () => {
    expect(detectBookingIntent('Quiero reservar una clase')).toBe(true);
    expect(detectBookingIntent('Me quiero apuntar')).toBe(true);
    expect(detectBookingIntent('I want to book a class')).toBe(true);
    expect(detectBookingIntent('Je veux réserver')).toBe(true);
  });

  it('should detect trial class intent', () => {
    expect(detectBookingIntent('Quiero probar')).toBe(true);
    expect(detectBookingIntent('clase gratis')).toBe(true);
    expect(detectBookingIntent('primera clase')).toBe(true);
  });

  it('should not detect non-booking intents', () => {
    expect(detectBookingIntent('Hola')).toBe(false);
    expect(detectBookingIntent('¿Cuánto cuesta?')).toBe(false);
    expect(detectBookingIntent('¿Dónde estáis?')).toBe(false);
  });
});

describe('isInBookingFlow', () => {
  it('should return true for active flow steps', () => {
    expect(isInBookingFlow('style_selection')).toBe(true);
    expect(isInBookingFlow('class_selection')).toBe(true);
    expect(isInBookingFlow('data_collection')).toBe(true);
    expect(isInBookingFlow('consent_terms')).toBe(true);
    expect(isInBookingFlow('confirmation')).toBe(true);
  });

  it('should return false for inactive steps', () => {
    expect(isInBookingFlow('initial')).toBe(false);
    expect(isInBookingFlow('completed')).toBe(false);
  });
});

describe('Multi-language support', () => {
  it('should work in Catalan', async () => {
    const flow = new BookingFlow('ca');
    const result = await flow.startBooking('+34612345678');

    expect(result.response).toContain('estil de ball');
  });

  it('should work in English', async () => {
    const flow = new BookingFlow('en');
    const result = await flow.startBooking('+34612345678');

    expect(result.response).toContain('dance style');
  });

  it('should work in French', async () => {
    const flow = new BookingFlow('fr');
    const result = await flow.startBooking('+34612345678');

    expect(result.response).toContain('style de danse');
  });
});
