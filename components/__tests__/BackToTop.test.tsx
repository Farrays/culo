import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BackToTop from '../BackToTop';

// Mock useI18n
vi.mock('../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        backToTop: 'Volver arriba',
      };
      return translations[key] || key;
    },
    locale: 'es',
    isLoading: false,
    setLocale: vi.fn(),
  }),
}));

// Mock debounce to execute immediately with cancel method
vi.mock('../../utils/debounce', () => ({
  debounce: (fn: () => void) => {
    const debouncedFn = fn as (() => void) & { cancel: () => void };
    debouncedFn.cancel = () => {};
    return debouncedFn;
  },
}));

describe('BackToTop', () => {
  let scrollToMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders back to top button', () => {
    render(<BackToTop />);
    const button = screen.getByRole('button', { name: /volver arriba/i });
    expect(button).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<BackToTop />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Volver arriba');
  });

  it('has correct title attribute', () => {
    render(<BackToTop />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Volver arriba');
  });

  it('is hidden when scroll is less than 300px', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    render(<BackToTop />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-0');
    expect(button).toHaveClass('pointer-events-none');
  });

  it('becomes visible when scroll exceeds 300px', () => {
    render(<BackToTop />);

    // Simulate scroll
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });

    act(() => {
      fireEvent.scroll(window);
    });

    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-100');
  });

  it('scrolls to top when clicked', () => {
    render(<BackToTop />);

    // Make button visible first
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    act(() => {
      fireEvent.scroll(window);
    });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('contains an svg icon', () => {
    render(<BackToTop />);
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('hides when scrolling back up', () => {
    render(<BackToTop />);

    // First scroll down
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });
    act(() => {
      fireEvent.scroll(window);
    });

    // Then scroll back up
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    act(() => {
      fireEvent.scroll(window);
    });

    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-0');
  });
});
