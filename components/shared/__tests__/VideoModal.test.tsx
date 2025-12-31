/* global PopStateEvent */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import VideoModal from '../VideoModal';

describe('VideoModal', () => {
  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
    videoSrc: 'https://example.com/video.mp4',
    title: 'Test Video',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
    // Mock history
    vi.spyOn(window.history, 'pushState').mockImplementation(() => {});
    vi.spyOn(window.history, 'back').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<VideoModal {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when open', () => {
    render(<VideoModal {...defaultProps} isOpen={true} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays video element when open', () => {
    render(<VideoModal {...defaultProps} isOpen={true} />);
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', defaultProps.videoSrc);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<VideoModal {...defaultProps} isOpen={true} onClose={onClose} />);

    const closeButton = screen.getByRole('button', { name: /cerrar/i });
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<VideoModal {...defaultProps} isOpen={true} onClose={onClose} />);

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<VideoModal {...defaultProps} isOpen={true} onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('blocks body scroll when open', () => {
    render(<VideoModal {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(<VideoModal {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<VideoModal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('');
  });

  it('pushes state to history when opened', () => {
    render(<VideoModal {...defaultProps} isOpen={true} />);
    expect(window.history.pushState).toHaveBeenCalledWith(
      expect.objectContaining({ modal: 'video' }),
      ''
    );
  });

  it('has accessible aria-label', () => {
    render(<VideoModal {...defaultProps} isOpen={true} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label');
  });

  it('uses default title when not provided', () => {
    render(<VideoModal isOpen={true} onClose={vi.fn()} videoSrc="https://example.com/video.mp4" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not call onClose when video container is clicked', () => {
    const onClose = vi.fn();
    render(<VideoModal {...defaultProps} isOpen={true} onClose={onClose} />);

    const video = document.querySelector('video');
    if (video) {
      fireEvent.click(video);
    }

    // Should not close when clicking video itself
    expect(onClose).not.toHaveBeenCalled();
  });

  it('handles popstate event', () => {
    const onClose = vi.fn();
    render(<VideoModal {...defaultProps} isOpen={true} onClose={onClose} />);

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(onClose).toHaveBeenCalled();
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<VideoModal {...defaultProps} isOpen={true} />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
