/**
 * FacilitiesFullGallery - Full gallery section for all facility images
 * =====================================================================
 *
 * Features:
 * - Filter tabs by area (All, Studios, Social)
 * - Responsive grid layout
 * - Click to open lightbox
 * - Lazy loading for performance
 * - ImageGallery schema for SEO
 *
 * @example
 * ```tsx
 * <FacilitiesFullGallery />
 * ```
 */

import React, { useState, useMemo, useCallback } from 'react';
import OptimizedImage from './OptimizedImage';
import ImageLightbox, { type LightboxImage } from './ImageLightbox';
import AnimateOnScroll from './AnimateOnScroll';
import { useI18n } from '../hooks/useI18n';

// ============================================================================
// TYPES
// ============================================================================

type FilterType = 'all' | 'salas' | 'social' | 'servicios';

interface GalleryImage extends LightboxImage {
  area: 'salaA' | 'salaB' | 'salaC' | 'salaD' | 'bar' | 'recepcion' | 'rinconDelux' | 'vestuario';
  category: 'salas' | 'social' | 'servicios';
}

// ============================================================================
// IMAGE DATA
// ============================================================================

const ALL_IMAGES: GalleryImage[] = [
  // Sala A (3 images) - with dash
  {
    src: '/images/salas/img/salaa-1',
    altKey: 'facilities.salaA.gallery',
    index: 0,
    area: 'salaA',
    category: 'salas',
  },
  {
    src: '/images/salas/img/salaa-2',
    altKey: 'facilities.salaA.gallery',
    index: 1,
    area: 'salaA',
    category: 'salas',
  },
  {
    src: '/images/salas/img/salaa-3',
    altKey: 'facilities.salaA.gallery',
    index: 2,
    area: 'salaA',
    category: 'salas',
  },
  // Sala B (3 images) - with dash
  {
    src: '/images/salas/img/salab-1',
    altKey: 'facilities.salaB.gallery',
    index: 0,
    area: 'salaB',
    category: 'salas',
  },
  {
    src: '/images/salas/img/salab-2',
    altKey: 'facilities.salaB.gallery',
    index: 1,
    area: 'salaB',
    category: 'salas',
  },
  {
    src: '/images/salas/img/salab-3',
    altKey: 'facilities.salaB.gallery',
    index: 2,
    area: 'salaB',
    category: 'salas',
  },
  // Sala C (3 images) - with dash
  {
    src: '/images/salas/img/salac-1',
    altKey: 'facilities.salaC.gallery',
    index: 0,
    area: 'salaC',
    category: 'salas',
  },
  {
    src: '/images/salas/img/salac-2',
    altKey: 'facilities.salaC.gallery',
    index: 1,
    area: 'salaC',
    category: 'salas',
  },
  {
    src: '/images/salas/img/salac-3',
    altKey: 'facilities.salaC.gallery',
    index: 2,
    area: 'salaC',
    category: 'salas',
  },
  // Sala D (3 images) - with dash
  {
    src: '/images/salas/img/salad-1',
    altKey: 'facilities.salaD.gallery',
    index: 0,
    area: 'salaD',
    category: 'salas',
  },
  {
    src: '/images/salas/img/salad-2',
    altKey: 'facilities.salaD.gallery',
    index: 1,
    area: 'salaD',
    category: 'salas',
  },
  {
    src: '/images/salas/img/salad-3',
    altKey: 'facilities.salaD.gallery',
    index: 2,
    area: 'salaD',
    category: 'salas',
  },
  // Bar (4 images) - no dash
  {
    src: '/images/salas/img/bar1',
    altKey: 'facilities.bar.gallery',
    index: 0,
    area: 'bar',
    category: 'social',
  },
  {
    src: '/images/salas/img/bar2',
    altKey: 'facilities.bar.gallery',
    index: 1,
    area: 'bar',
    category: 'social',
  },
  {
    src: '/images/salas/img/bar3',
    altKey: 'facilities.bar.gallery',
    index: 2,
    area: 'bar',
    category: 'social',
  },
  {
    src: '/images/salas/img/bar4',
    altKey: 'facilities.bar.gallery',
    index: 3,
    area: 'bar',
    category: 'social',
  },
  // Recepcion (2 images) - no dash
  {
    src: '/images/salas/img/recepción1',
    altKey: 'facilities.recepcion.gallery',
    index: 0,
    area: 'recepcion',
    category: 'social',
  },
  {
    src: '/images/salas/img/recepción2',
    altKey: 'facilities.recepcion.gallery',
    index: 1,
    area: 'recepcion',
    category: 'social',
  },
  // Rincon Delux (2 images) - no dash
  {
    src: '/images/salas/img/rincondelux1',
    altKey: 'facilities.rinconDelux.gallery',
    index: 0,
    area: 'rinconDelux',
    category: 'social',
  },
  {
    src: '/images/salas/img/rincondelux2',
    altKey: 'facilities.rinconDelux.gallery',
    index: 1,
    area: 'rinconDelux',
    category: 'social',
  },
  // Vestuarios (4 images) - no dash
  {
    src: '/images/salas/img/vestuario1',
    altKey: 'facilities.vestuario.gallery',
    index: 0,
    area: 'vestuario',
    category: 'servicios',
  },
  {
    src: '/images/salas/img/vestuario2',
    altKey: 'facilities.vestuario.gallery',
    index: 1,
    area: 'vestuario',
    category: 'servicios',
  },
  {
    src: '/images/salas/img/vestuario3',
    altKey: 'facilities.vestuario.gallery',
    index: 2,
    area: 'vestuario',
    category: 'servicios',
  },
  {
    src: '/images/salas/img/vestuario4',
    altKey: 'facilities.vestuario.gallery',
    index: 3,
    area: 'vestuario',
    category: 'servicios',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

const FacilitiesFullGallery: React.FC = () => {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter images based on active filter
  const filteredImages = useMemo(() => {
    if (activeFilter === 'all') return ALL_IMAGES;
    return ALL_IMAGES.filter(img => img.category === activeFilter);
  }, [activeFilter]);

  // Convert to lightbox format
  const lightboxImages: LightboxImage[] = useMemo(() => {
    return filteredImages.map(img => ({
      src: img.src,
      altKey: img.altKey,
      index: img.index,
    }));
  }, [filteredImages]);

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

  // Filter tabs
  const filters: { id: FilterType; labelKey: string }[] = [
    { id: 'all', labelKey: 'facilitiesGalleryAll' },
    { id: 'salas', labelKey: 'facilitiesGallerySalas' },
    { id: 'social', labelKey: 'facilitiesGallerySocial' },
    { id: 'servicios', labelKey: 'facilitiesGalleryServicios' },
  ];

  return (
    <section className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t('facilitiesGalleryTitle')}
            </h2>
            <p className="text-xl text-neutral/70 max-w-3xl mx-auto">
              {t('facilitiesGallerySubtitle')}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Filter Tabs */}
        <AnimateOnScroll delay={100}>
          <div className="flex justify-center gap-4 mb-12">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black ${
                  activeFilter === filter.id
                    ? 'bg-primary-accent text-white shadow-accent-glow'
                    : 'bg-primary-dark/30 text-neutral/80 hover:bg-primary-dark/50 hover:text-neutral'
                }`}
              >
                {t(filter.labelKey) || filter.id}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, idx) => (
            <AnimateOnScroll key={`${image.area}-${image.index}`} delay={idx * 50}>
              <button
                onClick={() => openLightbox(idx)}
                className="relative group w-full aspect-[4/3] rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black"
                aria-label={`View image ${idx + 1}`}
              >
                <OptimizedImage
                  src={image.src}
                  altKey={image.altKey}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  aspectRatio="4/3"
                  className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-3 py-1 bg-black/70 rounded-full text-white text-xs font-medium uppercase tracking-wide">
                    {t(
                      `facilitiesArea${image.area.charAt(0).toUpperCase() + image.area.slice(1)}`
                    ) || image.area}
                  </span>
                </div>
              </button>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Image count */}
        <div className="text-center mt-8 text-neutral/60 text-sm">
          {filteredImages.length} {t('facilitiesGalleryPhotos') || 'fotos'}
        </div>
      </div>

      <ImageLightbox
        images={lightboxImages}
        currentIndex={currentImageIndex}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </section>
  );
};

export default FacilitiesFullGallery;
