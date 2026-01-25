import React from 'react';
import { useLazyImage } from '../hooks/useLazyImage';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  priority?: 'high' | 'low' | 'auto'; // For LCP images
  srcSet?: string;
  sizes?: string;
}

const DEFAULT_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23111"%3E%3C/rect%3E%3C/svg%3E';

/**
 * Helper to convert WebP srcSet to AVIF srcSet
 * e.g., "/images/hero-480.webp 480w" -> "/images/hero-480.avif 480w"
 */
const toAvifSrcSet = (webpSrcSet?: string): string | undefined => {
  if (!webpSrcSet) return undefined;
  return webpSrcSet.replace(/\.webp/g, '.avif');
};

/**
 * Lazy-loaded image component with modern format support
 *
 * Features:
 * - AVIF with WebP fallback (via <picture> element)
 * - Intersection Observer for lazy loading
 * - Priority loading for LCP images
 * - Responsive srcSet support
 *
 * @param priority - 'high' for LCP images (above-the-fold), 'auto' for others
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = DEFAULT_PLACEHOLDER,
  threshold,
  rootMargin,
  priority = 'auto',
  srcSet,
  sizes,
  className = '',
  ...props
}) => {
  const { imageSrc, isLoaded, imgRef } = useLazyImage(src, placeholder, {
    threshold,
    rootMargin,
  });

  // High priority images (LCP) should NOT be lazy loaded
  const shouldLazyLoad = priority !== 'high';
  const finalSrc = priority === 'high' ? src : imageSrc;
  const avifSrcSet = toAvifSrcSet(srcSet);

  // Common img attributes
  const imgAttrs = {
    alt,
    className: `transition-opacity duration-300 ${
      isLoaded || priority === 'high' ? 'opacity-100' : 'opacity-50'
    } ${className}`,
    loading: shouldLazyLoad ? ('lazy' as const) : ('eager' as const),
    decoding: shouldLazyLoad ? ('async' as const) : ('sync' as const),
    fetchPriority: priority,
    ...props,
  };

  // If we have srcSet, use <picture> for AVIF/WebP with fallback
  if (srcSet && avifSrcSet) {
    return (
      <picture>
        {/* AVIF - best compression, modern browsers */}
        <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
        {/* WebP - fallback for older browsers */}
        <source type="image/webp" srcSet={srcSet} sizes={sizes} />
        {/* JPG/PNG fallback */}
        <img ref={shouldLazyLoad ? imgRef : undefined} src={finalSrc} {...imgAttrs} />
      </picture>
    );
  }

  // Simple img for non-responsive images
  return <img ref={shouldLazyLoad ? imgRef : undefined} src={finalSrc} {...imgAttrs} />;
};

export default LazyImage;
