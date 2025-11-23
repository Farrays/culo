import React from 'react';
import { useLazyImage } from '../hooks/useLazyImage';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  priority?: 'high' | 'low' | 'auto'; // For LCP images
}

const DEFAULT_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23111"%3E%3C/rect%3E%3C/svg%3E';

/**
 * Lazy-loaded image component with Intersection Observer
 * Automatically loads images when they enter the viewport
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
  className = '',
  ...props
}) => {
  const { imageSrc, isLoaded, imgRef } = useLazyImage(src, placeholder, {
    threshold,
    rootMargin,
  });

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-50'
      } ${className}`}
      loading="lazy"
      decoding="async"
      fetchPriority={priority}
      {...props}
    />
  );
};

export default LazyImage;
