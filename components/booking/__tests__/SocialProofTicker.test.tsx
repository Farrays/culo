/**
 * SocialProofTicker Component Tests
 * Tests for the real-time social proof ticker displaying recent bookings
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock the entire component's dependencies before importing
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        socialProofBooked: '{name} booked {className}',
        socialProofMinutesAgo: '{minutes} min ago',
        socialProofJustNow: 'just now',
        socialProofClickToBook: 'Click to book your class',
      };
      return translations[key] || key;
    },
    locale: 'en',
  }),
  I18nProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../../utils/analytics', () => ({
  trackEvent: vi.fn(),
}));

// Import after mocks
import { SocialProofTicker } from '../components/SocialProofTicker';
import { trackEvent } from '../../../utils/analytics';

// Sample booking data
const mockBookings = [
  { name: 'María', class: 'Bachata', minutesAgo: 2 },
  { name: 'Carlos', class: 'Hip Hop', minutesAgo: 15 },
];

const mockApiResponse = {
  success: true,
  bookings: mockBookings,
};

// Mock fetch
const mockFetch = vi.fn();

describe('SocialProofTicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render nothing when no bookings available', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, bookings: [] }),
      });

      const { container } = render(<SocialProofTicker />);

      // Wait a bit for the fetch to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(container.querySelector('.social-proof-ticker')).not.toBeInTheDocument();
    });

    it('should render ticker after successful API fetch', async () => {
      render(<SocialProofTicker />);

      await waitFor(
        () => {
          expect(screen.getByRole('button')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('should display booking name and class', async () => {
      render(<SocialProofTicker />);

      await waitFor(
        () => {
          expect(screen.getByText(/María booked Bachata/)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('should display time ago text', async () => {
      render(<SocialProofTicker />);

      await waitFor(
        () => {
          expect(screen.getByText(/2 min ago/)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('callbacks', () => {
    it('should call onShow when bookings are loaded', async () => {
      const onShow = vi.fn();
      render(<SocialProofTicker onShow={onShow} />);

      await waitFor(
        () => {
          expect(onShow).toHaveBeenCalledTimes(1);
        },
        { timeout: 3000 }
      );
    });

    it('should call onClick when clicked', async () => {
      const onClick = vi.fn();
      render(<SocialProofTicker onClick={onClick} />);

      await waitFor(
        () => {
          expect(screen.getByRole('button')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('click behavior', () => {
    it('should scroll to target element when clicked', async () => {
      // Create target element
      const targetElement = document.createElement('div');
      targetElement.id = 'test-target';
      document.body.appendChild(targetElement);

      render(<SocialProofTicker scrollTargetId="test-target" />);

      await waitFor(
        () => {
          expect(screen.getByRole('button')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      fireEvent.click(screen.getByRole('button'));

      expect(targetElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });

      // Cleanup
      document.body.removeChild(targetElement);
    });

    it('should track click event with analytics', async () => {
      render(<SocialProofTicker />);

      await waitFor(
        () => {
          expect(screen.getByRole('button')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      fireEvent.click(screen.getByRole('button'));

      expect(trackEvent).toHaveBeenCalledWith('social_proof_click', expect.any(Object));
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-label', async () => {
      render(<SocialProofTicker />);

      await waitFor(
        () => {
          const button = screen.getByRole('button');
          expect(button).toHaveAttribute('aria-label');
          expect(button.getAttribute('aria-label')).toContain('Click to book');
        },
        { timeout: 3000 }
      );
    });

    it('should have aria-live region for screen readers', async () => {
      render(<SocialProofTicker />);

      await waitFor(
        () => {
          const statusRegion = screen.getByRole('status');
          expect(statusRegion).toHaveAttribute('aria-live', 'polite');
        },
        { timeout: 3000 }
      );
    });
  });

  describe('API interaction', () => {
    it('should fetch with correct limit parameter', async () => {
      render(<SocialProofTicker limit={3} />);

      await waitFor(
        () => {
          expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('limit=3'));
        },
        { timeout: 3000 }
      );
    });
  });

  describe('analytics tracking', () => {
    it('should track impression when ticker becomes visible', async () => {
      render(<SocialProofTicker />);

      await waitFor(
        () => {
          expect(trackEvent).toHaveBeenCalledWith('social_proof_impression', expect.any(Object));
        },
        { timeout: 3000 }
      );
    });
  });

  describe('time display', () => {
    it('should show "just now" for bookings <= 1 minute ago', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            bookings: [{ name: 'Test', class: 'Class', minutesAgo: 1 }],
          }),
      });

      render(<SocialProofTicker />);

      await waitFor(
        () => {
          expect(screen.getByText(/just now/)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('should show minutes for bookings > 1 minute ago', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            bookings: [{ name: 'Test', class: 'Class', minutesAgo: 5 }],
          }),
      });

      render(<SocialProofTicker />);

      await waitFor(
        () => {
          expect(screen.getByText(/5 min ago/)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });
});
