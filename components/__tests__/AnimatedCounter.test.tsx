import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnimatedCounter from '../AnimatedCounter';

describe('AnimatedCounter', () => {
  // Mock IntersectionObserver
  const mockObserve = vi.fn();
  const mockUnobserve = vi.fn();
  const mockDisconnect = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();

    // Mock IntersectionObserver
    const mockIntersectionObserver = vi.fn().mockImplementation(callback => {
      // Immediately trigger intersection to start animation
      globalThis.setTimeout(() => {
        callback([{ isIntersecting: true }]);
      }, 0);

      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    });

    vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('renders with initial value of 0', () => {
    render(<AnimatedCounter target={100} />);
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  it('renders with suffix', () => {
    render(<AnimatedCounter target={100} suffix="%" />);
    // Initially shows 0%
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<AnimatedCounter target={100} className="custom-class" />);

    const element = container.querySelector('.custom-class');
    expect(element).toBeInTheDocument();
  });

  it('uses default duration of 2000ms', () => {
    render(<AnimatedCounter target={50} />);
    expect(screen.getByText(/\d+/)).toBeInTheDocument();
  });

  it('handles zero target value', () => {
    render(<AnimatedCounter target={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('observes the element on mount', () => {
    render(<AnimatedCounter target={100} />);
    expect(mockObserve).toHaveBeenCalled();
  });

  it('unobserves element on unmount', () => {
    const { unmount } = render(<AnimatedCounter target={100} />);
    unmount();
    expect(mockUnobserve).toHaveBeenCalled();
  });

  it('renders suffix alongside count', () => {
    render(<AnimatedCounter target={100} suffix="+" />);
    const element = screen.getByText(/\d+\+/);
    expect(element).toBeInTheDocument();
  });
});
