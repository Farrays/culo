/**
 * BookingWidgetV2 E2E Flow Test
 * Tests the complete user journey structure and component integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import BookingWidgetV2WithErrorBoundary from '../BookingWidgetV2';

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

describe('BookingWidgetV2 E2E Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    const mockLocalStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  });

  describe('Widget Structure', () => {
    it('should render the booking widget with all structural elements', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Main container with backdrop blur
      expect(container.querySelector('.backdrop-blur-xl')).toBeInTheDocument();

      // Rounded container
      expect(container.querySelector('.rounded-3xl')).toBeInTheDocument();

      // Dark themed container
      expect(container.querySelector('.bg-black\\/80')).toBeInTheDocument();
    });

    it('should have skip link for accessibility', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      const skipLink = container.querySelector('a[href="#booking-content"]');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveClass('sr-only');
    });

    it('should render step indicator on initial load', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Step indicator with numbered circles
      const stepCircles = container.querySelectorAll('.rounded-full');
      expect(stepCircles.length).toBeGreaterThan(0);
    });

    it('should show loading state initially', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Should have loading animation
      const loadingElements = container.querySelectorAll('.animate-pulse');
      expect(loadingElements.length).toBeGreaterThan(0);
    });

    it('should have aria-busy on loading region', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      const busyRegion = container.querySelector('[aria-busy="true"]');
      expect(busyRegion).toBeInTheDocument();
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA attributes on widget container', () => {
      render(<BookingWidgetV2WithErrorBoundary />);

      const regions = screen.getAllByRole('region');
      expect(regions.length).toBeGreaterThan(0);
      expect(regions[0]).toHaveAttribute('aria-label');
    });

    it('should have heading elements for screen readers', () => {
      render(<BookingWidgetV2WithErrorBoundary />);

      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have booking content target for skip link', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      const contentTarget = container.querySelector('#booking-content');
      expect(contentTarget).toBeInTheDocument();
    });

    it('should have aria-live regions for announcements', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe('Error Boundary Integration', () => {
    it('should wrap widget with error boundary', () => {
      // Should render without throwing
      expect(() => {
        render(<BookingWidgetV2WithErrorBoundary />);
      }).not.toThrow();
    });

    it('should render content through error boundary', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Content should be visible (error boundary is transparent when no error)
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Persistence Integration', () => {
    it('should attempt to load saved state on mount', () => {
      const mockLocalStorage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

      render(<BookingWidgetV2WithErrorBoundary />);

      // Should try to load saved state
      expect(mockLocalStorage.getItem).toHaveBeenCalled();
    });
  });

  describe('Visual Design', () => {
    it('should have decorative gradient elements', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      const gradient = container.querySelector('.bg-gradient-to-r');
      expect(gradient).toBeInTheDocument();
    });

    it('should have responsive padding', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Mobile-first padding: p-4 sm:p-6 md:p-8
      const responsiveElement = container.querySelector('.p-4');
      expect(responsiveElement).toBeInTheDocument();
    });

    it('should have proper border styling', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      const borderElement = container.querySelector('.border-white\\/10');
      expect(borderElement).toBeInTheDocument();
    });
  });

  describe('Component Hierarchy', () => {
    it('should use semantic HTML structure', () => {
      render(<BookingWidgetV2WithErrorBoundary />);

      // Should use heading for title
      expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);

      // Should use region for main content
      expect(screen.getAllByRole('region').length).toBeGreaterThan(0);
    });

    it('should have proper nesting structure', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Should have nested structure with rounded corners
      expect(container.querySelector('.rounded-3xl')).toBeInTheDocument();

      // Should have decorative elements marked as aria-hidden
      const decorativeElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });
  });

  describe('i18n Integration', () => {
    it('should render with translation keys', () => {
      render(<BookingWidgetV2WithErrorBoundary />);

      // Title should be rendered (translation key or actual text)
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      expect(headings[0]?.textContent).toBeTruthy();
    });
  });
});

describe('BookingWidgetV2 Component Exports', () => {
  it('should export default with error boundary', async () => {
    const module = await import('../BookingWidgetV2');
    expect(module.default).toBeDefined();
    expect(module.default.displayName).toBe('BookingWidgetV2WithErrorBoundary');
  });

  it('should export unwrapped component for testing', async () => {
    const module = await import('../BookingWidgetV2');
    expect(module.BookingWidgetV2).toBeDefined();
    expect(module.BookingWidgetV2.displayName).toBe('BookingWidgetV2');
  });
});
