import { useEffect, useRef, useState } from 'react';
import type * as React from 'react';

interface UseLazyImageOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Custom hook for lazy loading images using Intersection Observer
 * @param src - Image source URL
 * @param placeholder - Optional placeholder image
 * @param options - Intersection Observer options
 */
export const useLazyImage = (
  src: string,
  placeholder?: string,
  options: UseLazyImageOptions = {}
): { imageSrc: string; isLoaded: boolean; imgRef: React.RefObject<HTMLImageElement | null> } => {
  const { threshold = 0.01, rootMargin = '50px' } = options;
  const [imageSrc, setImageSrc] = useState<string>(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
  }, [isInView, src]);

  return { imageSrc, isLoaded, imgRef };
};
