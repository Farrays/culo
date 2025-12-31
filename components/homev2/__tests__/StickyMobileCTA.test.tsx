/* global Event */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import StickyMobileCTA from '../StickyMobileCTA';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        sticky_cta: 'Reserva tu clase',
        sticky_trust1: 'Sin compromiso',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock LeadCaptureModal
vi.mock('../../shared/LeadCaptureModal', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="lead-capture-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('StickyMobileCTA', () => {
  let originalScrollY: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    originalScrollY = window.scrollY;
    originalInnerHeight = window.innerHeight;

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'scrollY', { value: originalScrollY, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, writable: true });
  });

  it('renders without crashing', () => {
    render(<StickyMobileCTA />);
    expect(screen.getByText('Reserva tu clase')).toBeInTheDocument();
  });

  it('is hidden initially (before scrolling)', () => {
    const { container } = render(<StickyMobileCTA />);

    const ctaContainer = container.querySelector('.fixed.bottom-0');
    expect(ctaContainer).toHaveClass('translate-y-full', 'opacity-0');
  });

  it('becomes visible after scrolling past hero (50% of viewport height)', () => {
    const { container } = render(<StickyMobileCTA />);

    // Simulate scrolling past 50% of viewport
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    const ctaContainer = container.querySelector('.fixed.bottom-0');
    expect(ctaContainer).toHaveClass('translate-y-0', 'opacity-100');
  });

  it('hides again when scrolling back up', () => {
    const { container } = render(<StickyMobileCTA />);

    // First scroll down
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 500, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    // Then scroll back up
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    const ctaContainer = container.querySelector('.fixed.bottom-0');
    expect(ctaContainer).toHaveClass('translate-y-full', 'opacity-0');
  });

  it('opens modal when CTA button is clicked', () => {
    render(<StickyMobileCTA />);

    const ctaButton = screen.getByText('Reserva tu clase');
    fireEvent.click(ctaButton);

    expect(screen.getByTestId('lead-capture-modal')).toBeInTheDocument();
  });

  it('closes modal when close button is clicked', () => {
    render(<StickyMobileCTA />);

    // Open modal
    fireEvent.click(screen.getByText('Reserva tu clase'));
    expect(screen.getByTestId('lead-capture-modal')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('lead-capture-modal')).not.toBeInTheDocument();
  });

  it('displays trust badges', () => {
    render(<StickyMobileCTA />);

    expect(screen.getByText('Sin compromiso')).toBeInTheDocument();
    expect(screen.getByText('4.9/5')).toBeInTheDocument();
  });

  it('renders star icons for rating', () => {
    const { container } = render(<StickyMobileCTA />);

    const starsContainer = container.querySelector('.text-yellow-400');
    expect(starsContainer).toBeInTheDocument();

    const stars = starsContainer?.querySelectorAll('svg');
    expect(stars?.length).toBe(5);
  });

  it('cleans up scroll listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<StickyMobileCTA />);
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('has md:hidden class for mobile-only display', () => {
    const { container } = render(<StickyMobileCTA />);

    const ctaContainer = container.querySelector('.fixed.bottom-0');
    expect(ctaContainer).toHaveClass('md:hidden');
  });
});
