/**
 * TeacherAvatar - Enterprise-level teacher avatar component
 * ==========================================================
 *
 * Features:
 * - SEO: Descriptive alt text with i18n support
 * - Accessibility: ARIA labels, role="img", focus states
 * - Performance: Lazy loading, srcSet, modern formats (WebP/AVIF)
 * - UX: Graceful fallback to gradient initials, smooth transitions
 * - Face-focus: object-position: center 20% to center on face
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TeacherAvatar teacherId="yunaisy-farray" size="sm" />
 *
 * // With custom styling
 * <TeacherAvatar
 *   teacherId="daniel-sene"
 *   size="md"
 *   showBorder
 *   className="shadow-lg"
 * />
 *
 * // In quotes/testimonials (48px, compact)
 * <TeacherAvatar teacherId="sandra-gomez" size="sm" />
 * ```
 */

import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { useI18n } from '../hooks/useI18n';
import {
  TEACHER_IMAGES,
  getTeacherImagePath,
  getTeacherImageSrcSet,
  AVATAR_SIZES,
  getAvatarImageSize,
  type TeacherAvatarSize,
  type TeacherImageConfig,
} from '../constants/teacher-images';

// ============================================================================
// TYPES
// ============================================================================

export interface TeacherAvatarProps {
  /** Teacher ID from TEACHER_IMAGES registry */
  teacherId: string;
  /** Avatar size preset */
  size?: TeacherAvatarSize;
  /** Show border around avatar */
  showBorder?: boolean;
  /** Border color (Tailwind class, e.g., 'border-primary-accent') */
  borderColor?: string;
  /** Additional CSS classes */
  className?: string;
  /** Enable hover effects */
  enableHover?: boolean;
  /** Custom object position (overrides default face-focus) */
  objectPosition?: string;
  /** Loading priority (for above-fold avatars) */
  priority?: 'high' | 'low' | 'auto';
  /** Click handler */
  onClick?: () => void;
  /** Custom aria-label (overrides auto-generated) */
  ariaLabel?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Gradient colors for fallback initials avatar */
const GRADIENT_COLORS = [
  'from-primary-accent to-primary-dark',
  'from-purple-500 to-purple-800',
  'from-pink-500 to-pink-800',
  'from-amber-500 to-amber-800',
  'from-emerald-500 to-emerald-800',
] as const;

/** Size to pixel mapping for styles */
const SIZE_CLASSES: Record<TeacherAvatarSize, string> = {
  xs: 'w-8 h-8',
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40',
};

/** Font sizes for initials based on avatar size */
const INITIALS_SIZE: Record<TeacherAvatarSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

/** Border width based on avatar size */
const BORDER_WIDTH: Record<TeacherAvatarSize, string> = {
  xs: 'border-2',
  sm: 'border-2',
  md: 'border-3',
  lg: 'border-4',
  xl: 'border-4',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract initials from a name
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get a consistent gradient color based on name (deterministic)
 */
function getGradientColor(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % GRADIENT_COLORS.length;
  return GRADIENT_COLORS[index] ?? GRADIENT_COLORS[0];
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Fallback avatar with gradient and initials
 */
const InitialsAvatar: React.FC<{
  name: string;
  size: TeacherAvatarSize;
  showBorder: boolean;
  borderColor: string;
  className?: string;
  ariaLabel: string;
}> = memo(({ name, size, showBorder, borderColor, className = '', ariaLabel }) => {
  const initials = getInitials(name);
  const gradientColor = getGradientColor(name);

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`
        ${SIZE_CLASSES[size]}
        rounded-full overflow-hidden
        bg-gradient-to-br ${gradientColor}
        flex items-center justify-center
        ${showBorder ? `${BORDER_WIDTH[size]} ${borderColor}` : ''}
        ${className}
      `}
    >
      <span
        className={`
          ${INITIALS_SIZE[size]}
          font-black text-white/90
          select-none
        `}
      >
        {initials}
      </span>
    </div>
  );
});

InitialsAvatar.displayName = 'InitialsAvatar';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const TeacherAvatar: React.FC<TeacherAvatarProps> = memo(
  ({
    teacherId,
    size = 'sm',
    showBorder = false,
    borderColor = 'border-primary-accent/50',
    className = '',
    enableHover = false,
    objectPosition,
    priority = 'auto',
    onClick,
    ariaLabel,
  }) => {
    const { t } = useI18n();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Get teacher data
    const teacher: TeacherImageConfig | undefined = TEACHER_IMAGES[teacherId];
    const teacherName = teacher?.name || teacherId;

    // Generate alt text with i18n (manual replacement since t() doesn't support interpolation)
    const translatedAlt = t('teacherAvatarAlt');
    const altText =
      ariaLabel ||
      (translatedAlt ? translatedAlt.replace('{name}', teacherName) : `Foto de ${teacherName}`);

    // Determine if we should show fallback
    const showFallback = !teacher || imageError;

    // Get optimal image size for this avatar
    const imageSize = getAvatarImageSize(size);
    const imagePath = teacher ? getTeacherImagePath(teacherId, imageSize) : '';
    const imageSrcSet = teacher ? getTeacherImageSrcSet(teacherId, 'webp') : '';

    // Object position for face focus
    const finalObjectPosition = objectPosition || teacher?.objectPosition || 'center 20%';

    // Lazy loading with Intersection Observer
    const [isInView, setIsInView] = useState(priority === 'high');

    useEffect(() => {
      if (priority === 'high' || !containerRef.current) return;

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '200px' }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [priority]);

    // Image load handler
    const handleLoad = useCallback(() => {
      setImageLoaded(true);
    }, []);

    // Image error handler
    const handleError = useCallback(() => {
      setImageError(true);
    }, []);

    // Keyboard handler for accessibility
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      },
      [onClick]
    );

    // Base container classes
    const containerClasses = `
      ${SIZE_CLASSES[size]}
      rounded-full overflow-hidden
      ${showBorder ? `${BORDER_WIDTH[size]} ${borderColor}` : ''}
      ${enableHover ? 'transition-all duration-300 hover:scale-105 hover:border-primary-accent' : ''}
      ${onClick ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2' : ''}
      ${className}
    `.trim();

    // If no teacher data or image error, show initials
    if (showFallback) {
      return (
        <InitialsAvatar
          name={teacherName}
          size={size}
          showBorder={showBorder}
          borderColor={borderColor}
          className={`${enableHover ? 'transition-all duration-300 hover:scale-105' : ''} ${className}`}
          ariaLabel={altText}
        />
      );
    }

    return (
      <div
        ref={containerRef}
        role="img"
        aria-label={altText}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={onClick ? handleKeyDown : undefined}
        className={containerClasses}
      >
        {/* Skeleton placeholder while loading */}
        {!imageLoaded && (
          <div
            className={`
              absolute inset-0
              bg-gradient-to-br from-primary-dark/30 to-primary-dark/50
              animate-pulse
            `}
            aria-hidden="true"
          />
        )}

        {/* Actual image */}
        {isInView && (
          <picture>
            {/* AVIF source (best compression) */}
            {teacher.formats.includes('avif') && (
              <source
                type="image/avif"
                srcSet={teacher.sizes.map(s => `${teacher.basePath}_${s}.avif ${s}w`).join(', ')}
                sizes={`${AVATAR_SIZES[size] * 2}px`}
              />
            )}
            {/* WebP source (good compression, wide support) */}
            {teacher.formats.includes('webp') && (
              <source
                type="image/webp"
                srcSet={imageSrcSet}
                sizes={`${AVATAR_SIZES[size] * 2}px`}
              />
            )}
            {/* JPEG fallback */}
            <img
              ref={imgRef}
              src={imagePath}
              alt={altText}
              width={AVATAR_SIZES[size]}
              height={AVATAR_SIZES[size]}
              loading={priority === 'high' ? 'eager' : 'lazy'}
              decoding={priority === 'high' ? 'sync' : 'async'}
              fetchPriority={priority === 'high' ? 'high' : undefined}
              onLoad={handleLoad}
              onError={handleError}
              className={`
                w-full h-full object-cover
                transition-opacity duration-300
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              style={{ objectPosition: finalObjectPosition }}
            />
          </picture>
        )}
      </div>
    );
  }
);

TeacherAvatar.displayName = 'TeacherAvatar';

export default TeacherAvatar;

// ============================================================================
// VARIANT COMPONENTS FOR COMMON USE CASES
// ============================================================================

/**
 * Small avatar for quotes and inline usage (48px)
 */
export const TeacherAvatarQuote: React.FC<Omit<TeacherAvatarProps, 'size'>> = props => (
  <TeacherAvatar {...props} size="sm" showBorder />
);

/**
 * Medium avatar for cards and listings (64px)
 */
export const TeacherAvatarCard: React.FC<Omit<TeacherAvatarProps, 'size'>> = props => (
  <TeacherAvatar {...props} size="md" showBorder enableHover />
);

/**
 * Large avatar for teacher profiles (128px)
 */
export const TeacherAvatarProfile: React.FC<Omit<TeacherAvatarProps, 'size'>> = props => (
  <TeacherAvatar {...props} size="lg" showBorder enableHover />
);

/**
 * Extra large avatar for featured sections (160px)
 */
export const TeacherAvatarFeatured: React.FC<Omit<TeacherAvatarProps, 'size'>> = props => (
  <TeacherAvatar {...props} size="xl" showBorder enableHover />
);
