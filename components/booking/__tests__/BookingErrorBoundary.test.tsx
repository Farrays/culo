/**
 * BookingErrorBoundary Component Tests
 * Tests for error boundary behavior and i18n integration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '../../../test/test-utils';
import { BookingErrorBoundary } from '../components/BookingErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Content rendered successfully</div>;
};

// Suppress console.error for cleaner test output
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

describe('BookingErrorBoundary', () => {
  describe('normal rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <BookingErrorBoundary>
          <div>Test content</div>
        </BookingErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <BookingErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </BookingErrorBoundary>
      );

      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should catch errors and display fallback UI', () => {
      render(
        <BookingErrorBoundary>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      // Should show error UI with translation keys (in test env, keys are shown as-is)
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });

    it('should display retry button', () => {
      render(
        <BookingErrorBoundary>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      const retryButton = screen.getByRole('button');
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toHaveAttribute('type', 'button');
    });

    it('should display error ID for support', () => {
      const { container } = render(
        <BookingErrorBoundary>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      // Error ID should be displayed (format: err_timestamp_random)
      const errorIdElement = container.querySelector('.text-neutral\\/40');
      expect(errorIdElement).toBeInTheDocument();
      expect(errorIdElement?.textContent).toMatch(/err_\d+_\w+/);
    });

    it('should display WhatsApp contact link', () => {
      render(
        <BookingErrorBoundary>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      const whatsappLink = screen.getByRole('link');
      expect(whatsappLink).toBeInTheDocument();
      expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/34666555444');
      expect(whatsappLink).toHaveAttribute('target', '_blank');
      expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('custom fallback', () => {
    it('should render custom fallback when provided', () => {
      render(
        <BookingErrorBoundary fallback={<div>Custom error message</div>}>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });
  });

  describe('retry functionality', () => {
    it('should call onRetry callback when retry button is clicked', () => {
      const onRetry = vi.fn();

      render(
        <BookingErrorBoundary onRetry={onRetry}>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      const retryButton = screen.getByRole('button');
      fireEvent.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('should reset error state on retry', () => {
      let shouldThrow = true;

      const TestComponent = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>Recovered content</div>;
      };

      const { rerender } = render(
        <BookingErrorBoundary>
          <TestComponent />
        </BookingErrorBoundary>
      );

      // Error should be shown
      expect(screen.getByRole('button')).toBeInTheDocument();

      // Fix the error condition
      shouldThrow = false;

      // Click retry
      fireEvent.click(screen.getByRole('button'));

      // Re-render to see the recovered content
      rerender(
        <BookingErrorBoundary>
          <TestComponent />
        </BookingErrorBoundary>
      );

      // Should now show recovered content
      expect(screen.getByText('Recovered content')).toBeInTheDocument();
    });
  });

  describe('error callbacks', () => {
    it('should call onError callback with error details', () => {
      const onError = vi.fn();

      render(
        <BookingErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <BookingErrorBoundary>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it('should have accessible button', () => {
      render(
        <BookingErrorBoundary>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should have accessible link with proper attributes', () => {
      render(
        <BookingErrorBoundary>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('visual elements', () => {
    it('should render error icon', () => {
      const { container } = render(
        <BookingErrorBoundary>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      const svgIcon = container.querySelector('svg.text-red-400');
      expect(svgIcon).toBeInTheDocument();
    });

    it('should render retry icon in button', () => {
      const { container } = render(
        <BookingErrorBoundary>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      const buttonSvg = container.querySelector('button svg');
      expect(buttonSvg).toBeInTheDocument();
    });

    it('should have decorative gradient line', () => {
      const { container } = render(
        <BookingErrorBoundary>
          <ThrowError shouldThrow={true} />
        </BookingErrorBoundary>
      );

      const gradientLine = container.querySelector('.bg-gradient-to-r');
      expect(gradientLine).toBeInTheDocument();
    });
  });
});
