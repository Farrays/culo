/**
 * FacilityGallery - Enterprise gallery component for facility areas
 * =================================================================
 *
 * Displays a responsive grid of images for a facility area with:
 * - Main image + thumbnails layout
 * - Click to open lightbox
 * - Optimized images with lazy loading
 * - Accessible with keyboard navigation
 * - Respects prefers-reduced-motion
 *
 * @example
 * ```tsx
 * <FacilityGallery
 *   areaId="salaA"
 *   imageCount={3}
 * />
 * ```
 */

import React, { useState, useCallback } from 'react';
import OptimizedImage from './OptimizedImage';
import ImageLightbox, { type LightboxImage } from './ImageLightbox';

// ============================================================================
// TYPES
// ============================================================================

export type FacilityAreaId =
  | 'salaA'
  | 'salaB'
  | 'salaC'
  | 'salaD'
  | 'bar'
  | 'recepcion'
  | 'rinconDelux'
  | 'vestuario';

export interface FacilityGalleryProps {
  /** The facility area ID */
  areaId: FacilityAreaId;
  /** Number of images for this area */
  imageCount: number;
  /** Optional additional CSS classes */
  className?: string;
  /** Whether to show in compact mode (for cards) */
  compact?: boolean;
}

// ============================================================================
// IMAGE PATH MAPPING
// ============================================================================

// Path format: salas have dash (salaa-1), social areas don't (bar1)
const IMAGE_PATH_MAP: Record<FacilityAreaId, { base: string; hasDash: boolean }> = {
  salaA: { base: '/images/salas/img/salaa-', hasDash: true },
  salaB: { base: '/images/salas/img/salab-', hasDash: true },
  salaC: { base: '/images/salas/img/salac-', hasDash: true },
  salaD: { base: '/images/salas/img/salad-', hasDash: true },
  bar: { base: '/images/salas/img/bar', hasDash: false },
  recepcion: { base: '/images/salas/img/recepción', hasDash: false },
  rinconDelux: { base: '/images/salas/img/rincondelux', hasDash: false },
  vestuario: { base: '/images/salas/img/vestuario', hasDash: false },
};

const ALT_KEY_MAP: Record<FacilityAreaId, string> = {
  salaA: 'facilities.salaA.gallery',
  salaB: 'facilities.salaB.gallery',
  salaC: 'facilities.salaC.gallery',
  salaD: 'facilities.salaD.gallery',
  bar: 'facilities.bar.gallery',
  recepcion: 'facilities.recepcion.gallery',
  rinconDelux: 'facilities.rinconDelux.gallery',
  vestuario: 'facilities.vestuario.gallery',
};

// ============================================================================
// COMPONENT
// ============================================================================

const FacilityGallery: React.FC<FacilityGalleryProps> = ({
  areaId,
  imageCount,
  className = '',
  compact = false,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const pathConfig = IMAGE_PATH_MAP[areaId];
  const altKeyBase = ALT_KEY_MAP[areaId];

  // Generate image data for all images in this area
  const images: LightboxImage[] = Array.from({ length: imageCount }, (_, i) => ({
    src: `${pathConfig.base}${i + 1}`,
    altKey: altKeyBase,
    index: i,
  }));

  // Get first image safely
  const firstImage = images[0];

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const navigateLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  // If no images, return null
  if (!firstImage || imageCount === 0) {
    return null;
  }

  // Compact mode: Just main image with overlay
  if (compact) {
    return (
      <>
        <div className={`relative group cursor-pointer ${className}`}>
          <button
            onClick={() => openLightbox(0)}
            className="w-full h-full focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black rounded-xl overflow-hidden"
            aria-label={`View gallery for ${areaId}`}
          >
            <OptimizedImage
              src={firstImage.src}
              altKey={firstImage.altKey}
              sizes="(max-width: 768px) 100vw, 50vw"
              aspectRatio="16/9"
              className="w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay with gallery icon */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex items-center gap-2 text-white font-medium">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{imageCount} fotos</span>
              </div>
            </div>
          </button>
        </div>

        <ImageLightbox
          images={images}
          currentIndex={currentImageIndex}
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      </>
    );
  }

  // Full mode: Grid with main image + thumbnails
  return (
    <>
      <div className={`grid gap-2 ${className}`}>
        {/* Main image */}
        <button
          onClick={() => openLightbox(0)}
          className="relative group w-full focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black rounded-xl overflow-hidden"
          aria-label="View main image in gallery"
        >
          <OptimizedImage
            src={firstImage.src}
            altKey={firstImage.altKey}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            aspectRatio="16/9"
            className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* Thumbnails row */}
        {imageCount > 1 && (
          <div className="grid grid-cols-2 gap-2">
            {images.slice(1, 3).map((image, idx) => (
              <button
                key={idx}
                onClick={() => openLightbox(idx + 1)}
                className="relative group w-full focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black rounded-lg overflow-hidden"
                aria-label={`View image ${idx + 2} in gallery`}
              >
                <OptimizedImage
                  src={image.src}
                  altKey={image.altKey}
                  sizes="(max-width: 768px) 50vw, 200px"
                  aspectRatio="4/3"
                  className="w-full transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}

            {/* "See more" button if more than 3 images */}
            {imageCount > 3 && images[3] && (
              <button
                onClick={() => openLightbox(3)}
                className="relative group w-full focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black rounded-lg overflow-hidden"
                aria-label={`View all ${imageCount} images`}
              >
                <OptimizedImage
                  src={images[3].src}
                  altKey={images[3].altKey}
                  sizes="(max-width: 768px) 50vw, 200px"
                  aspectRatio="4/3"
                  className="w-full"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">+{imageCount - 3}</span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      <ImageLightbox
        images={images}
        currentIndex={currentImageIndex}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </>
  );
};

export default FacilityGallery;
