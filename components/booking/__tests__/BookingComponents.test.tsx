/**
 * BookingSuccess and BookingError Component Tests
 * Tests for success and error states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import { BookingSuccess } from '../components/BookingSuccess';
import { BookingError } from '../components/BookingError';
import type { ClassData } from '../types/booking';

// Mock calendar utilities
vi.mock('../../../utils/calendarExport', () => ({
  generateGoogleCalendarUrl: vi.fn(() => 'https://calendar.google.com/mock'),
  downloadICSFile: vi.fn(),
}));

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', { value: mockWindowOpen, writable: true });

// Mock class data
const mockClass: ClassData = {
  id: 1,
  name: 'Salsa Nivel Básico',
  date: '20/01/2025',
  time: '19:00',
  dayOfWeek: 'Lunes',
  spotsAvailable: 10,
  isFull: false,
  location: "Farray's Center",
  instructor: 'Carlos',
  style: 'salsa',
  level: 'basico',
  rawStartsAt: '2025-01-20T19:00:00',
  duration: 60,
  description: 'Clase de salsa para principiantes',
};

describe('BookingSuccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render success title', () => {
      render(<BookingSuccess selectedClass={mockClass} />);

      // The translation key will be shown
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should render class name', () => {
      render(<BookingSuccess selectedClass={mockClass} />);

      expect(screen.getByText('Salsa Nivel Básico')).toBeInTheDocument();
    });

    it('should render class date info', () => {
      render(<BookingSuccess selectedClass={mockClass} />);

      // Check for day of week and time in the combined text
      const dateTimeText = screen.getByText(/Lunes.*19:00/);
      expect(dateTimeText).toBeInTheDocument();
    });

    it('should render calendar buttons', () => {
      render(<BookingSuccess selectedClass={mockClass} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('should render link to dance classes', () => {
      render(<BookingSuccess selectedClass={mockClass} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', expect.stringContaining('/clases/baile-barcelona'));
    });
  });

  describe('calendar interactions', () => {
    it('should open Google Calendar when first button clicked', async () => {
      const { generateGoogleCalendarUrl } = await import('../../../utils/calendarExport');
      render(<BookingSuccess selectedClass={mockClass} />);

      // Get all buttons - first one is Google Calendar
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      const googleButton = buttons[0] as HTMLElement;

      fireEvent.click(googleButton);

      expect(generateGoogleCalendarUrl).toHaveBeenCalledWith({
        title: mockClass.name,
        startTime: mockClass.rawStartsAt,
        durationMinutes: mockClass.duration,
        description: mockClass.description,
        location: expect.stringContaining("Farray's"),
      });
      expect(mockWindowOpen).toHaveBeenCalledWith('https://calendar.google.com/mock', '_blank');
    });

    it('should download ICS file when second button clicked', async () => {
      const { downloadICSFile } = await import('../../../utils/calendarExport');
      render(<BookingSuccess selectedClass={mockClass} />);

      // Get all buttons - second one is ICS download
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(1);
      const downloadButton = buttons[1] as HTMLElement;

      fireEvent.click(downloadButton);

      expect(downloadICSFile).toHaveBeenCalledWith({
        title: mockClass.name,
        startTime: mockClass.rawStartsAt,
        durationMinutes: mockClass.duration,
        description: mockClass.description,
        location: expect.stringContaining("Farray's"),
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      render(<BookingSuccess selectedClass={mockClass} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should have button types set', () => {
      render(<BookingSuccess selectedClass={mockClass} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });
  });
});

describe('BookingError', () => {
  const mockOnRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render error title', () => {
      render(<BookingError onRetry={mockOnRetry} />);

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should render error message paragraph', () => {
      render(<BookingError onRetry={mockOnRetry} />);

      // Find paragraph containing error message (Spanish translation)
      expect(screen.getByText(/Ha ocurrido un error/)).toBeInTheDocument();
    });

    it('should render custom error message when provided', () => {
      render(<BookingError errorMessage="Custom error occurred" onRetry={mockOnRetry} />);

      expect(screen.getByText('Custom error occurred')).toBeInTheDocument();
    });

    it('should render retry button', () => {
      render(<BookingError onRetry={mockOnRetry} />);

      const retryButton = screen.getByRole('button');
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onRetry when retry button clicked', () => {
      render(<BookingError onRetry={mockOnRetry} />);

      const retryButton = screen.getByRole('button');
      fireEvent.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      render(<BookingError onRetry={mockOnRetry} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it('should have button type set', () => {
      render(<BookingError onRetry={mockOnRetry} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
