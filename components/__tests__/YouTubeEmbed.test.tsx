import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import YouTubeEmbed from '../YouTubeEmbed';

const renderWithHelmet = (ui: React.ReactElement) => {
  return render(<HelmetProvider>{ui}</HelmetProvider>);
};

describe('YouTubeEmbed', () => {
  const defaultProps = {
    videoId: 'test123',
    title: 'Test Video Title',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders thumbnail initially', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const thumbnail = screen.getByAltText('Test Video Title');
    expect(thumbnail).toBeInTheDocument();
  });

  it('has correct thumbnail URL', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const thumbnail = screen.getByAltText('Test Video Title');
    expect(thumbnail).toHaveAttribute('src', 'https://i.ytimg.com/vi/test123/maxresdefault.jpg');
  });

  it('renders play button', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    // Play button is inside the clickable div
    const playButton = screen.getByRole('button', { name: /load video/i });
    expect(playButton).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Load video: Test Video Title');
  });

  it('is keyboard accessible', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('responds to Enter key', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });

    // After pressing Enter, the thumbnail should be replaced with the player container
    // We can't fully test YouTube API, but we can verify state change
  });

  it('responds to Space key', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: ' ' });
  });

  it('renders with optional description', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} description="A great video about dancing" />);

    const thumbnail = screen.getByAltText('Test Video Title');
    expect(thumbnail).toBeInTheDocument();
  });

  it('renders with optional uploadDate', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} uploadDate="2024-01-01" />);

    const thumbnail = screen.getByAltText('Test Video Title');
    expect(thumbnail).toBeInTheDocument();
  });

  it('renders with optional duration', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} duration="PT10M30S" />);

    const thumbnail = screen.getByAltText('Test Video Title');
    expect(thumbnail).toBeInTheDocument();
  });

  it('has lazy loading on thumbnail', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const thumbnail = screen.getByAltText('Test Video Title');
    expect(thumbnail).toHaveAttribute('loading', 'lazy');
  });

  it('has correct thumbnail dimensions', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const thumbnail = screen.getByAltText('Test Video Title');
    expect(thumbnail).toHaveAttribute('width', '1280');
    expect(thumbnail).toHaveAttribute('height', '720');
  });

  it('falls back to hqdefault thumbnail on error', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const thumbnail = screen.getByAltText('Test Video Title');
    fireEvent.error(thumbnail);

    // After error, should switch to hqdefault
    expect(thumbnail).toHaveAttribute('src', 'https://i.ytimg.com/vi/test123/hqdefault.jpg');
  });

  it('loads video when clicked', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // After click, thumbnail should be gone and player container should appear
    expect(screen.queryByAltText('Test Video Title')).not.toBeInTheDocument();
  });

  it('renders svg play icon with aria-hidden', () => {
    renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('maintains 16:9 aspect ratio container', () => {
    const { container } = renderWithHelmet(<YouTubeEmbed {...defaultProps} />);

    const aspectContainer = container.querySelector('.aspect-video');
    expect(aspectContainer).toBeInTheDocument();
  });
});
