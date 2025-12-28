/**
 * ImageLightbox - Enterprise-level accessible image lightbox
 * ===========================================================
 *
 * Features:
 * - Keyboard navigation (ESC, Arrow Left/Right)
 * - Touch/swipe support for mobile
 * - Focus trap for accessibility
 * - Preload next/prev images
 * - ARIA attributes for screen readers
 * - Respects prefers-reduced-motion
 * - Smooth transitions
 *
 * @example
 * ```tsx
 * <ImageLightbox
 *   images={[
 *     { src: '/images/sala-a', altKey: 'facilities.salaA.gallery', index: 0 },
 *     { src: '/images/sala-a', altKey: 'facilities.salaA.gallery', index: 1 },
 *   ]}
 *   currentIndex={0}
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   onNavigate={(index) => setCurrentIndex(index)}
 * />
 * ```
 */

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../hooks/useI18n';

// ============================================================================
// TYPES
// ============================================================================

export interface LightboxImage {
  /** Base path without extension (e.g., "/images/salas/img/salaa-1") */
  src: string;
  /** Path to alt text in registry (e.g., "facilities.salaA.gallery") */
  altKey: string;
  /** Index in the gallery array for alt text lookup */
  index: number;
}

export interface ImageLightboxProps {
  /** Array of images to display */
  images: LightboxImage[];
  /** Currently displayed image index */
  currentIndex: number;
  /** Whether the lightbox is open */
  isOpen: boolean;
  /** Callback when lightbox is closed */
  onClose: () => void;
  /** Callback when navigating to a different image */
  onNavigate: (index: number) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { t } = useI18n();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext]);

  // Focus trap - focus close button when opened
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (!touch) return;
    setTouchEnd(null);
    setTouchStart(touch.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (!touch) return;
    setTouchEnd(touch.clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  // Handle click on overlay (not on image)
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen) return;

    const preloadImage = (index: number) => {
      if (index >= 0 && index < images.length) {
        const imageData = images[index];
        if (imageData) {
          const img = new Image();
          img.src = `${imageData.src}_1920.jpg`;
        }
      }
    };

    // Preload next and previous images
    preloadImage(currentIndex + 1);
    preloadImage(currentIndex - 1);
  }, [isOpen, currentIndex, images]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  const lightboxContent = (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('lightboxTitle') || 'Image gallery'}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm motion-safe:animate-fadeIn"
      onClick={handleOverlayClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label={t('closeLightbox') || 'Close gallery'}
        className="absolute top-4 right-4 z-10 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          aria-label={t('previousImage') || 'Previous image'}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          aria-label={t('nextImage') || 'Next image'}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4 flex items-center justify-center">
        <img
          src={`${currentImage.src}_1920.jpg`}
          alt={currentImage.altKey}
          className="max-w-full max-h-[85vh] object-contain rounded-lg"
          loading="eager"
        />
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 rounded-full text-white/90 text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Keyboard hint (hidden on mobile) */}
      <div className="hidden md:block absolute bottom-4 right-4 text-white/50 text-xs">
        <span className="mr-4">
          <kbd className="px-2 py-1 bg-black/50 rounded">ESC</kbd> {t('toClose') || 'to close'}
        </span>
        <span>
          <kbd className="px-2 py-1 bg-black/50 rounded">←</kbd>
          <kbd className="px-2 py-1 bg-black/50 rounded ml-1">→</kbd>{' '}
          {t('toNavigate') || 'to navigate'}
        </span>
      </div>
    </div>
  );

  // Use portal to render at document root
  return createPortal(lightboxContent, document.body);
};

export default ImageLightbox;
