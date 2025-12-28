/**
 * OptimizedImage - Enterprise-level responsive image component
 * =============================================================
 *
 * Features:
 * - Automatic srcset generation with 6 responsive breakpoints
 * - Multi-format support (AVIF, WebP, JPEG fallback)
 * - i18n alt text integration via useImageAlt hook
 * - Advanced lazy loading with Intersection Observer
 * - LQIP blur placeholder with smooth transition
 * - CLS prevention with aspect ratio container
 * - SEO optimized (width/height, decoding, fetchpriority)
 *
 * @example
 * ```tsx
 * // Basic usage with i18n alt
 * <OptimizedImage
 *   src="/images/classes/dancehall/img/dancehall-barcelona"
 *   altKey="classes.dancehall.hero"
 *   aspectRatio="16/9"
 * />
 *
 * // LCP hero image with high priority
 * <OptimizedImage
 *   src="/images/hero/main-hero"
 *   altKey="general.hero"
 *   priority="high"
 *   sizes="100vw"
 *   aspectRatio="16/9"
 *   placeholder="blur"
 *   blurDataURL="data:image/webp;base64,..."
 * />
 * ```
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useImageAlt } from '../hooks/useImageAlt';

// ============================================================================
// TYPES
// ============================================================================

export interface OptimizedImageProps {
  /** Base path without extension or size (e.g., "/images/classes/dancehall/img/dancehall-barcelona") */
  src: string;
  /** Path to alt text in registry (e.g., "classes.dancehall.hero") */
  altKey?: string;
  /** Direct alt text (used if altKey not provided or not found) */
  alt?: string;
  /** Fallback alt text if translation not found */
  altFallback?: string;
  /** Responsive sizes attribute (default: "100vw") */
  sizes?: string;
  /** Loading priority for LCP images */
  priority?: 'high' | 'low' | 'auto';
  /** Aspect ratio for container (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles for container (supports opacity, objectPosition, etc.) */
  style?: React.CSSProperties;
  /** Object-fit behavior */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Placeholder type while loading */
  placeholder?: 'blur' | 'color' | 'none';
  /** Dominant color for 'color' placeholder (default: "#111") */
  placeholderColor?: string;
  /** LQIP blur data URL for 'blur' placeholder */
  blurDataURL?: string;
  /** Explicit width for CLS prevention */
  width?: number;
  /** Explicit height for CLS prevention */
  height?: number;
  /** Custom breakpoints (overrides defaults) */
  breakpoints?: number[];
  /** Available formats in order of preference */
  formats?: ('avif' | 'webp' | 'jpg')[];
  /** Intersection Observer root margin */
  rootMargin?: string;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback on error */
  onError?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Default responsive breakpoints matching common device widths */
const DEFAULT_BREAKPOINTS = [320, 640, 768, 1024, 1440, 1920] as const;

/** Default image formats in order of preference (best compression first) */
const DEFAULT_FORMATS: ('avif' | 'webp' | 'jpg')[] = ['avif', 'webp', 'jpg'];

/** MIME types for each format */
const FORMAT_MIME_TYPES: Record<string, string> = {
  avif: 'image/avif',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

/** Default LQIP placeholder (dark gray) */
const DEFAULT_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23111"%3E%3C/rect%3E%3C/svg%3E';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates srcset string for a given format
 */
const generateSrcSet = (
  baseSrc: string,
  format: string,
  breakpoints: readonly number[] | number[]
): string => {
  return breakpoints.map(width => `${baseSrc}_${width}.${format} ${width}w`).join(', ');
};

/**
 * Gets the closest available breakpoint for fallback src
 */
const getClosestBreakpoint = (
  breakpoints: readonly number[] | number[],
  preferredWidth: number = 640
): number => {
  return [...breakpoints].reduce((prev, curr) =>
    Math.abs(curr - preferredWidth) < Math.abs(prev - preferredWidth) ? curr : prev
  );
};

// ============================================================================
// COMPONENT
// ============================================================================

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  altKey,
  alt,
  altFallback,
  sizes = '100vw',
  priority = 'auto',
  aspectRatio,
  className = '',
  style: externalStyle,
  objectFit = 'cover',
  placeholder = 'blur',
  placeholderColor = '#111',
  blurDataURL,
  width,
  height,
  breakpoints = DEFAULT_BREAKPOINTS,
  formats = DEFAULT_FORMATS,
  rootMargin = '200px 0px',
  onLoad,
  onError,
}) => {
  const { getAlt } = useImageAlt();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority === 'high');

  // Get alt text - prioritize altKey, then alt, then altFallback
  const altText = useMemo(() => {
    if (altKey) {
      const translated = getAlt(altKey);
      if (translated && translated !== altKey) {
        return translated;
      }
    }
    return alt || altFallback || 'Image';
  }, [altKey, alt, altFallback, getAlt]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority === 'high') {
      setIsInView(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [priority, rootMargin]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Generate srcsets for each format
  const srcSets = useMemo(() => {
    return formats.reduce(
      (acc, format) => {
        acc[format] = generateSrcSet(src, format, breakpoints);
        return acc;
      },
      {} as Record<string, string>
    );
  }, [src, formats, breakpoints]);

  // Fallback src for browsers without srcset support
  const fallbackSrc = useMemo(() => {
    const fallbackFormat = formats[formats.length - 1] || 'jpg';
    const fallbackWidth = getClosestBreakpoint(breakpoints, 640);
    return `${src}_${fallbackWidth}.${fallbackFormat}`;
  }, [src, formats, breakpoints]);

  // Placeholder background
  const placeholderBackground = useMemo(() => {
    if (placeholder === 'none') return 'transparent';
    if (placeholder === 'color') return placeholderColor;
    return blurDataURL || DEFAULT_PLACEHOLDER;
  }, [placeholder, placeholderColor, blurDataURL]);

  // Container styles
  const containerStyles: React.CSSProperties = useMemo(
    () => ({
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: placeholder !== 'none' ? placeholderColor : undefined,
      aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined),
    }),
    [aspectRatio, width, height, placeholder, placeholderColor]
  );

  // Image styles - merge external styles with internal ones
  const imageStyles: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit,
      transition: 'opacity 0.3s ease-in-out',
      // Apply external opacity or default loaded state
      opacity: isLoaded ? (externalStyle?.opacity ?? 1) : 0,
      // Support custom objectPosition from external style
      objectPosition: externalStyle?.objectPosition ?? 'center',
    }),
    [objectFit, isLoaded, externalStyle?.opacity, externalStyle?.objectPosition]
  );

  // Loading attributes based on priority
  const loadingAttr = priority === 'high' ? 'eager' : 'lazy';
  const decodingAttr = priority === 'high' ? 'sync' : 'async';

  const shouldRenderImage = priority === 'high' || isInView;

  return (
    <div
      ref={containerRef}
      className={`optimized-image-container ${className}`}
      style={containerStyles}
    >
      {/* Blur placeholder overlay */}
      {placeholder === 'blur' && !isLoaded && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${placeholderBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            transition: 'opacity 0.3s ease-in-out',
            opacity: isLoaded ? 0 : 1,
          }}
        />
      )}

      {/* Main picture element */}
      {shouldRenderImage && (
        <picture>
          {/* AVIF source (best compression) */}
          {formats.includes('avif') && srcSets['avif'] && (
            <source type={FORMAT_MIME_TYPES['avif']} srcSet={srcSets['avif']} sizes={sizes} />
          )}

          {/* WebP source (good compression, wide support) */}
          {formats.includes('webp') && srcSets['webp'] && (
            <source type={FORMAT_MIME_TYPES['webp']} srcSet={srcSets['webp']} sizes={sizes} />
          )}

          {/* JPEG fallback */}
          <img
            src={fallbackSrc}
            srcSet={srcSets['jpg']}
            sizes={sizes}
            alt={altText}
            width={width}
            height={height}
            loading={loadingAttr}
            decoding={decodingAttr}
            fetchPriority={priority}
            onLoad={handleLoad}
            onError={onError}
            style={imageStyles}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;

// ============================================================================
// EXPORTS
// ============================================================================

export { generateSrcSet, getClosestBreakpoint };
