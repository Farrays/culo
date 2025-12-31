import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VideoCard from '../VideoCard';

describe('VideoCard', () => {
  const defaultProps = {
    thumbnail: 'https://example.com/video-thumb.jpg',
    title: 'Test Video Title',
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with required props', () => {
    render(<VideoCard {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Test Video Title')).toBeInTheDocument();
  });

  it('renders thumbnail image', () => {
    render(<VideoCard {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', defaultProps.thumbnail);
    expect(img).toHaveAttribute('alt', defaultProps.title);
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<VideoCard {...defaultProps} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders subtitle when provided', () => {
    render(<VideoCard {...defaultProps} subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<VideoCard {...defaultProps} />);
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<VideoCard {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      `Ver video: ${defaultProps.title}`
    );
  });

  it('renders with vertical aspect ratio by default', () => {
    const { container } = render(<VideoCard {...defaultProps} />);
    const aspectContainer = container.querySelector('.aspect-\\[9\\/16\\]');
    expect(aspectContainer).toBeInTheDocument();
  });

  it('renders with square aspect ratio when specified', () => {
    const { container } = render(<VideoCard {...defaultProps} aspectRatio="square" />);
    const aspectContainer = container.querySelector('.aspect-square');
    expect(aspectContainer).toBeInTheDocument();
  });

  it('has lazy loading on image', () => {
    render(<VideoCard {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('has async decoding on image', () => {
    render(<VideoCard {...defaultProps} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('shows fallback when image fails to load', () => {
    render(<VideoCard {...defaultProps} />);
    const img = screen.getByRole('img');

    fireEvent.error(img);

    // Image should no longer be visible, fallback should show
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('is keyboard accessible', () => {
    render(<VideoCard {...defaultProps} />);
    const button = screen.getByRole('button');

    // Should be focusable
    button.focus();
    expect(document.activeElement).toBe(button);

    // Should have focus styles (ring classes)
    expect(button.className).toContain('focus:ring');
  });

  it('renders play button icon', () => {
    const { container } = render(<VideoCard {...defaultProps} />);
    // Play icon SVG should exist
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });
});
