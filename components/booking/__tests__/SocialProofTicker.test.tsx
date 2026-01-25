/**
 * SocialProofTicker Component Tests
 * Tests for the toast-style social proof notification displaying recent bookings
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '../../../test/test-utils';
import React from 'react';

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

describe('SocialProofTicker', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fetchSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock fetch using vi.spyOn for proper restoration
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    } as globalThis.Response);

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

    // Mock scrollIntoView and focus
    Element.prototype.scrollIntoView = vi.fn();
    HTMLElement.prototype.focus = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // Helper to advance timers and flush promises
  async function advanceTimers(ms: number) {
    await act(async () => {
      vi.advanceTimersByTime(ms);
      // Flush microtasks
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  describe('rendering', () => {
    it('should render nothing when no bookings available', async () => {
      // Reset and set new mock for this test
      fetchSpy.mockReset();
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, bookings: [] }),
      } as globalThis.Response);

      const { container } = render(<SocialProofTicker />);

      // Wait for fetch and timers
      await advanceTimers(2000);

      expect(container.querySelector('button')).not.toBeInTheDocument();
    });

    it('should render toast after successful API fetch and initial delay', async () => {
      render(<SocialProofTicker />);

      // Wait for fetch to resolve, then initial 1000ms delay
      await advanceTimers(100);
      await advanceTimers(1100);

      // Should have main button and close button
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(2);
    });

    it('should display booking name', async () => {
      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      expect(screen.getByText('María')).toBeInTheDocument();
    });

    it('should display class name', async () => {
      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      expect(screen.getByText('Bachata')).toBeInTheDocument();
    });

    it('should display time ago text', async () => {
      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      expect(screen.getByText(/2 min ago/)).toBeInTheDocument();
    });
  });

  describe('callbacks', () => {
    it('should call onShow when bookings are loaded', async () => {
      const onShow = vi.fn();
      render(<SocialProofTicker onShow={onShow} />);

      // Wait for fetch to complete
      await advanceTimers(100);

      expect(onShow).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when clicked', async () => {
      const onClick = vi.fn();
      render(<SocialProofTicker onClick={onClick} />);

      await advanceTimers(100);
      await advanceTimers(1100);

      // Click the main content button (not the close button)
      const mainButton = screen.getByLabelText(/Click to book/);
      fireEvent.click(mainButton);
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

      await advanceTimers(100);
      await advanceTimers(1100);

      const mainButton = screen.getByLabelText(/Click to book/);
      fireEvent.click(mainButton);

      expect(targetElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });

      // Cleanup
      document.body.removeChild(targetElement);
    });

    it('should track click event with analytics', async () => {
      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      const mainButton = screen.getByLabelText(/Click to book/);
      fireEvent.click(mainButton);

      expect(trackEvent).toHaveBeenCalledWith('social_proof_click', expect.any(Object));
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-label', async () => {
      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      const mainButton = screen.getByLabelText(/Click to book/);
      expect(mainButton).toHaveAttribute('aria-label');
      expect(mainButton.getAttribute('aria-label')).toContain('Click to book');
    });

    it('should have aria-live region for screen readers', async () => {
      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('API interaction', () => {
    it('should fetch with correct limit parameter', async () => {
      render(<SocialProofTicker limit={3} />);

      await advanceTimers(100);

      expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('limit=3'));
    });
  });

  describe('analytics tracking', () => {
    it('should track impression when toast becomes visible', async () => {
      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      expect(trackEvent).toHaveBeenCalledWith('social_proof_impression', expect.any(Object));
    });
  });

  describe('time display', () => {
    it('should show "just now" for bookings <= 1 minute ago', async () => {
      // Reset and set new mock for this test
      fetchSpy.mockReset();
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            bookings: [{ name: 'Test', class: 'Class', minutesAgo: 1 }],
          }),
      } as globalThis.Response);

      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      expect(screen.getByText(/just now/)).toBeInTheDocument();
    });

    it('should show minutes for bookings > 1 minute ago', async () => {
      // Reset and set new mock for this test
      fetchSpy.mockReset();
      fetchSpy.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            bookings: [{ name: 'Test', class: 'Class', minutesAgo: 5 }],
          }),
      } as globalThis.Response);

      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      expect(screen.getByText(/5 min ago/)).toBeInTheDocument();
    });
  });

  describe('toast behavior', () => {
    it('should have fixed positioning at bottom', async () => {
      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      const container = screen.getByRole('status');
      expect(container).toHaveClass('fixed', 'bottom-4');
    });

    it('should have dismiss button', async () => {
      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      const dismissButton = screen.getByLabelText('Close');
      expect(dismissButton).toBeInTheDocument();
    });

    it('should hide when dismiss button is clicked', async () => {
      render(<SocialProofTicker />);

      await advanceTimers(100);
      await advanceTimers(1100);

      const dismissButton = screen.getByLabelText('Close');
      fireEvent.click(dismissButton);

      // Advance through animation
      await advanceTimers(500);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});
