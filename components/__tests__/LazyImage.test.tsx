import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LazyImage from '../LazyImage';

// Mock useLazyImage hook
vi.mock('../../hooks/useLazyImage', () => ({
  useLazyImage: (src: string, _placeholder: string) => ({
    imageSrc: src,
    isLoaded: true,
    imgRef: { current: null },
  }),
}));

describe('LazyImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders image with correct src', () => {
    render(<LazyImage src="/images/test.jpg" alt="Test image" />);

    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/test.jpg');
  });

  it('renders image with correct alt text', () => {
    render(<LazyImage src="/images/test.jpg" alt="Test description" />);

    const img = screen.getByAltText('Test description');
    expect(img).toBeInTheDocument();
  });

  it('has lazy loading attribute', () => {
    render(<LazyImage src="/images/test.jpg" alt="Test image" />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('has async decoding attribute', () => {
    render(<LazyImage src="/images/test.jpg" alt="Test image" />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('applies custom className', () => {
    render(<LazyImage src="/images/test.jpg" alt="Test image" className="custom-class" />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveClass('custom-class');
  });

  it('applies transition opacity class when loaded', () => {
    render(<LazyImage src="/images/test.jpg" alt="Test image" />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveClass('opacity-100');
    expect(img).toHaveClass('transition-opacity');
  });

  it('accepts priority prop', () => {
    render(<LazyImage src="/images/test.jpg" alt="Test image" priority="high" />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('fetchPriority', 'high');
  });

  it('defaults priority to auto', () => {
    render(<LazyImage src="/images/test.jpg" alt="Test image" />);

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('fetchPriority', 'auto');
  });

  it('passes through additional props', () => {
    render(
      <LazyImage
        src="/images/test.jpg"
        alt="Test image"
        width={400}
        height={300}
        data-testid="lazy-img"
      />
    );

    const img = screen.getByTestId('lazy-img');
    expect(img).toHaveAttribute('width', '400');
    expect(img).toHaveAttribute('height', '300');
  });
});
