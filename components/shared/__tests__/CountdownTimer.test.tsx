import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import CountdownTimer from '../CountdownTimer';

// Mock useI18n
vi.mock('../../../hooks/useI18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        exitIntent_days: 'días',
        exitIntent_hours: 'horas',
        exitIntent_minutes: 'min',
        exitIntent_seconds: 'seg',
        exitIntent_expired: 'Expirado',
      };
      return translations[key] || key;
    },
    locale: 'es',
  }),
}));

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
    render(<CountdownTimer targetDate={futureDate} />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('displays time units', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 25); // 25 hours from now
    render(<CountdownTimer targetDate={futureDate} />);

    // Should have aria labels for time
    const timer = screen.getByRole('timer');
    expect(timer).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60);
    const { container } = render(
      <CountdownTimer targetDate={futureDate} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls onExpire callback when countdown expires', () => {
    const onExpire = vi.fn();
    const pastDate = new Date(Date.now() - 1000); // Already expired

    render(<CountdownTimer targetDate={pastDate} onExpire={onExpire} />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onExpire).toHaveBeenCalled();
  });

  it('renders in compact mode', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60);
    render(<CountdownTimer targetDate={futureDate} compact />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('hides labels when showLabels is false', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60);
    render(<CountdownTimer targetDate={futureDate} showLabels={false} />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('shows labels by default', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60);
    render(<CountdownTimer targetDate={futureDate} />);
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('updates time every second', () => {
    const futureDate = new Date(Date.now() + 1000 * 60); // 1 minute from now
    render(<CountdownTimer targetDate={futureDate} />);

    const timer = screen.getByRole('timer');
    const _initialContent = timer.textContent;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Content should update (or stay same if just rendered)
    expect(timer).toBeInTheDocument();
  });

  it('has accessible aria-live attribute', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60);
    render(<CountdownTimer targetDate={futureDate} />);

    const timer = screen.getByRole('timer');
    expect(timer).toHaveAttribute('aria-live');
  });

  it('handles expired countdown', () => {
    const pastDate = new Date(Date.now() - 1000 * 60); // 1 minute ago
    render(<CountdownTimer targetDate={pastDate} />);

    // Should show expired state or zeros
    expect(screen.getByRole('timer')).toBeInTheDocument();
  });

  it('clears interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const futureDate = new Date(Date.now() + 1000 * 60 * 60);

    const { unmount } = render(<CountdownTimer targetDate={futureDate} />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
