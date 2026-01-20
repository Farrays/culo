/**
 * BookingWidgetV2 Integration Tests
 * Tests for the complete booking widget structure and rendering
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import BookingWidgetV2WithErrorBoundary from '../BookingWidgetV2';

// Mock the API and analytics
vi.mock('../../../utils/analytics', () => ({
  pushToDataLayer: vi.fn(),
}));

describe('BookingWidgetV2 Integration', () => {
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

  describe('widget initialization', () => {
    it('should render the booking widget container', () => {
      render(<BookingWidgetV2WithErrorBoundary />);

      // Widget should be visible with region role
      const regions = screen.getAllByRole('region');
      expect(regions.length).toBeGreaterThan(0);
    });

    it('should render with proper structure', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Should have main container with backdrop blur
      const mainContainer = container.querySelector('.backdrop-blur-xl');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should show loading state initially', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Loading skeleton should be visible initially
      const loadingElements = container.querySelectorAll('.animate-pulse');
      expect(loadingElements.length).toBeGreaterThan(0);
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes on widget container', () => {
      render(<BookingWidgetV2WithErrorBoundary />);

      // Main container should have aria-label
      const regions = screen.getAllByRole('region');
      expect(regions[0]).toHaveAttribute('aria-label');
    });

    it('should have heading elements', () => {
      render(<BookingWidgetV2WithErrorBoundary />);

      // Should have at least one heading
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have aria-busy on loading region', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Classes list region should have aria-busy when loading
      const classesRegion = container.querySelector('[aria-busy="true"]');
      expect(classesRegion).toBeInTheDocument();
    });

    it('should have aria-live for screen reader announcements', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Should have aria-live region
      const liveRegion = container.querySelector('[aria-live]');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe('error boundary', () => {
    it('should wrap widget with error boundary', () => {
      // The component should render without throwing
      expect(() => {
        render(<BookingWidgetV2WithErrorBoundary />);
      }).not.toThrow();
    });
  });

  describe('persistence', () => {
    it('should attempt to load saved state on mount', () => {
      const mockLocalStorage = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

      render(<BookingWidgetV2WithErrorBoundary />);

      // Should try to load saved state (called with any key)
      expect(mockLocalStorage.getItem).toHaveBeenCalled();
    });
  });

  describe('visual structure', () => {
    it('should render step indicator', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Step indicator with numbered circles
      const stepIndicator = container.querySelector('.rounded-full');
      expect(stepIndicator).toBeInTheDocument();
    });

    it('should have gradient decorative elements', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Gradient line decoration
      const gradient = container.querySelector('.bg-gradient-to-r');
      expect(gradient).toBeInTheDocument();
    });

    it('should have dark themed container', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Should have dark background
      const darkContainer = container.querySelector('.bg-black\\/80');
      expect(darkContainer).toBeInTheDocument();
    });
  });

  describe('responsive layout', () => {
    it('should render correctly', () => {
      const { container } = render(<BookingWidgetV2WithErrorBoundary />);

      // Container should have mobile-first responsive padding (p-4 sm:p-6 md:p-8)
      const responsiveElement = container.querySelector('.p-4');
      expect(responsiveElement).toBeInTheDocument();
    });
  });
});

describe('BookingWidgetV2 Component Structure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have proper component hierarchy', () => {
    const { container } = render(<BookingWidgetV2WithErrorBoundary />);

    // Should have nested structure
    expect(container.firstChild).toBeInTheDocument();
    expect(container.querySelector('.rounded-3xl')).toBeInTheDocument();
  });

  it('should use semantic HTML', () => {
    render(<BookingWidgetV2WithErrorBoundary />);

    // Should use heading for title
    expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);

    // Should use region for main content
    expect(screen.getAllByRole('region').length).toBeGreaterThan(0);
  });
});
