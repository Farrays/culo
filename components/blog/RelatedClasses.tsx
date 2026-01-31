/**
 * RelatedClasses Component
 *
 * Displays a grid of related dance class cards at the end of blog posts.
 * Improves conversion by linking blog readers to relevant class pages.
 *
 * @accessibility
 * - Uses semantic HTML with proper heading hierarchy
 * - All interactive elements are keyboard accessible
 * - Screen reader optimized with descriptive aria-labels
 * - SVG icons marked as decorative with aria-hidden
 *
 * @seo
 * - Includes Schema.org ItemList markup for rich snippets
 * - Optimized images with explicit dimensions (prevents CLS)
 * - Semantic section with aria-labelledby
 *
 * @performance
 * - Memoized to prevent unnecessary re-renders
 * - Lazy loaded images with LazyImage component
 * - Explicit image dimensions prevent layout shift
 */

import React, { memo, useId, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';
import LazyImage from '../LazyImage';
import { getRelatedClassImageUrl } from '../../constants/style-images';

// ============================================================================
// CONSTANTS
// ============================================================================

/** Image dimensions for consistent layout and CLS prevention */
const IMAGE_DIMENSIONS = {
  width: 480,
  height: 320,
} as const;

// ============================================================================
// CLASS DATA MAPPING
// ============================================================================

interface ClassData {
  /** Translation key for class name (uses danceClassesHub_style_* pattern) */
  nameKey: string;
  /** URL path for the class page (without locale prefix) */
  url: string;
  /** Category for Schema.org */
  category: 'latin' | 'urban' | 'contemporary' | 'fitness';
}

/**
 * Maps class slugs to their display data.
 * Uses existing danceClassesHub_style_* translation keys.
 *
 * Images are now obtained from the centralized system via getRelatedClassImageUrl()
 * which uses STYLE_IMAGES from style-images.ts for consistency across the entire website.
 */
const CLASS_DATA_MAP: Record<string, ClassData> = {
  // ===== LATIN DANCE =====
  'salsa-cubana-barcelona': {
    nameKey: 'danceClassesHub_style_salsa_cubana',
    url: '/clases/salsa-cubana-barcelona',
    category: 'latin',
  },
  'bachata-barcelona': {
    nameKey: 'danceClassesHub_style_bachata_sensual',
    url: '/clases/bachata-barcelona',
    category: 'latin',
  },
  'salsa-bachata-barcelona': {
    nameKey: 'danceClassesHub_style_salsa_bachata',
    url: '/clases/salsa-bachata-barcelona',
    category: 'latin',
  },
  'salsa-lady-style-barcelona': {
    nameKey: 'danceClassesHub_style_salsa_lady_style',
    url: '/clases/salsa-lady-style-barcelona',
    category: 'latin',
  },
  'timba-barcelona': {
    nameKey: 'danceClassesHub_style_timba_cubana',
    url: '/clases/timba-barcelona',
    category: 'latin',
  },
  'folklore-cubano': {
    nameKey: 'danceClassesHub_style_folklore_cubano',
    url: '/clases/folklore-cubano',
    category: 'latin',
  },

  // ===== URBAN DANCE =====
  'dancehall-barcelona': {
    nameKey: 'danceClassesHub_style_dancehall',
    url: '/clases/dancehall-barcelona',
    category: 'urban',
  },
  'hip-hop-reggaeton-barcelona': {
    nameKey: 'danceClassesHub_style_hip_hop_reggaeton',
    url: '/clases/hip-hop-reggaeton-barcelona',
    category: 'urban',
  },
  'reggaeton-cubano-barcelona': {
    nameKey: 'danceClassesHub_style_reggaeton_cubano',
    url: '/clases/reggaeton-cubano-barcelona',
    category: 'urban',
  },
  'twerk-barcelona': {
    nameKey: 'danceClassesHub_style_twerk',
    url: '/clases/twerk-barcelona',
    category: 'urban',
  },
  'sexy-reggaeton-barcelona': {
    nameKey: 'danceClassesHub_style_sexy_reggaeton',
    url: '/clases/sexy-reggaeton-barcelona',
    category: 'urban',
  },
  'sexy-style-barcelona': {
    nameKey: 'danceClassesHub_style_sexy_style',
    url: '/clases/sexy-style-barcelona',
    category: 'urban',
  },
  'afrobeats-barcelona': {
    nameKey: 'danceClassesHub_style_afrobeat',
    url: '/clases/afrobeats-barcelona',
    category: 'urban',
  },
  femmology: {
    nameKey: 'danceClassesHub_style_femmology_heels',
    url: '/clases/femmology',
    category: 'urban',
  },
  'heels-barcelona': {
    nameKey: 'danceClassesHub_style_heels_barcelona',
    url: '/clases/heels-barcelona',
    category: 'urban',
  },
  'hip-hop-barcelona': {
    nameKey: 'danceClassesHub_style_hip_hop',
    url: '/clases/hip-hop-barcelona',
    category: 'urban',
  },

  // ===== CONTEMPORARY DANCE =====
  'ballet-barcelona': {
    nameKey: 'danceClassesHub_style_ballet_clasico',
    url: '/clases/ballet-barcelona',
    category: 'contemporary',
  },
  'contemporaneo-barcelona': {
    nameKey: 'danceClassesHub_style_danza_contemporanea',
    url: '/clases/contemporaneo-barcelona',
    category: 'contemporary',
  },
  'modern-jazz-barcelona': {
    nameKey: 'danceClassesHub_style_modern_jazz',
    url: '/clases/modern-jazz-barcelona',
    category: 'contemporary',
  },
  'afro-contemporaneo-barcelona': {
    nameKey: 'danceClassesHub_style_afro_contemporaneo',
    url: '/clases/afro-contemporaneo-barcelona',
    category: 'contemporary',
  },
  'afro-jazz': {
    nameKey: 'danceClassesHub_style_afro_jazz',
    url: '/clases/afro-jazz',
    category: 'contemporary',
  },

  // ===== FITNESS =====
  'stretching-barcelona': {
    nameKey: 'danceClassesHub_style_stretching',
    url: '/clases/stretching-barcelona',
    category: 'fitness',
  },
  'ejercicios-gluteos-barcelona': {
    nameKey: 'danceClassesHub_style_bum_bum',
    url: '/clases/ejercicios-gluteos-barcelona',
    category: 'fitness',
  },
  'cuerpo-fit': {
    nameKey: 'danceClassesHub_style_cuerpo_fit',
    url: '/clases/cuerpo-fit',
    category: 'fitness',
  },
  'acondicionamiento-fisico-bailarines': {
    nameKey: 'danceClassesHub_style_body_conditioning',
    url: '/clases/acondicionamiento-fisico-bailarines',
    category: 'fitness',
  },
};

// ============================================================================
// SCHEMA MARKUP COMPONENT
// ============================================================================

interface RelatedClassesSchemaProps {
  items: Array<{
    slug: string;
    nameKey: string;
    url: string;
  }>;
  locale: string;
  t: (key: string) => string;
}

/**
 * Generates Schema.org ItemList markup for related classes.
 * Improves SEO and enables rich snippets in search results.
 */
const RelatedClassesSchema: React.FC<RelatedClassesSchemaProps> = memo(({ items, locale, t }) => {
  const baseUrl = 'https://www.bailemananas.com';

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('blog_relatedClasses_title'),
    description: t('blog_relatedClasses_subtitle'),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        '@id': `${baseUrl}/${locale}${item.url}`,
        name: t(item.nameKey),
        url: `${baseUrl}/${locale}${item.url}`,
        image: `${baseUrl}${getRelatedClassImageUrl(item.slug)}`,
        provider: {
          '@type': 'DanceSchool',
          name: "Farray's International Dance Center",
          url: baseUrl,
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'onsite',
          location: {
            '@type': 'Place',
            name: "Farray's International Dance Center",
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Carrer de Pallars, 85',
              addressLocality: 'Barcelona',
              postalCode: '08018',
              addressCountry: 'ES',
            },
          },
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
});

RelatedClassesSchema.displayName = 'RelatedClassesSchema';

// ============================================================================
// ARROW ICON COMPONENT
// ============================================================================

/**
 * Decorative arrow icon for CTA buttons.
 * Marked as aria-hidden since it's purely decorative.
 * Matches FullDanceClassTemplate RelatedClassArrowIcon for visual consistency.
 */
const ArrowIcon: React.FC = memo(() => (
  <svg
    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
));

ArrowIcon.displayName = 'ArrowIcon';

// ============================================================================
// CLASS CARD COMPONENT
// ============================================================================

interface ClassCardProps {
  classItem: {
    slug: string;
    nameKey: string;
    url: string;
  };
  classUrl: string;
  className: string;
  ctaText: string;
  index: number;
}

/**
 * Individual class card with image, title, and CTA.
 * Optimized for accessibility and performance.
 *
 * Design matches FullDanceClassTemplate RelatedClassCard for visual consistency.
 */
const ClassCard: React.FC<ClassCardProps> = memo(
  ({ classItem, classUrl, className, ctaText, index }) => {
    // Generate unique ID for this card's heading
    const headingId = useId();

    return (
      <AnimateOnScroll delay={index * 100} className="[perspective:1000px]">
        <article className="h-full" aria-labelledby={headingId}>
          <Link
            to={classUrl}
            className="group block h-full bg-black/70 backdrop-blur-md
                       border border-primary-dark/50 rounded-2xl shadow-lg overflow-hidden
                       transition-all duration-500
                       [transform-style:preserve-3d]
                       hover:border-primary-accent hover:shadow-accent-glow
                       hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)]
                       focus:outline-none focus:ring-2 focus:ring-primary-accent
                       focus:ring-offset-2 focus:ring-offset-black"
            aria-label={`${className} - ${ctaText}`}
          >
            {/* Image Container with fixed height for consistency */}
            <div className="relative overflow-hidden h-48 sm:h-52">
              <LazyImage
                src={getRelatedClassImageUrl(classItem.slug)}
                alt={`Clase de ${className} en Barcelona - Farray's Dance Center`}
                className="w-full h-full object-cover transition-transform duration-500
                           group-hover:scale-110"
                width={IMAGE_DIMENSIONS.width}
                height={IMAGE_DIMENSIONS.height}
              />

              {/* Overlay gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                aria-hidden="true"
              />
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <h3
                id={headingId}
                className="text-lg sm:text-xl font-bold text-neutral mb-4
                           group-hover:text-primary-accent transition-colors duration-300"
              >
                {className}
              </h3>

              {/* CTA with arrow - matches FullDanceClassTemplate style */}
              <div
                className="flex items-center gap-2 text-primary-accent font-semibold text-sm
                           group-hover:gap-3 transition-all duration-300"
                aria-hidden="true"
              >
                <span>{ctaText}</span>
                <ArrowIcon />
              </div>
            </div>
          </Link>
        </article>
      </AnimateOnScroll>
    );
  }
);

ClassCard.displayName = 'ClassCard';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface RelatedClassesProps {
  /** Array of class slugs to display */
  relatedClasses: string[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Displays a grid of related dance class cards at the end of blog posts.
 *
 * @example
 * ```tsx
 * <RelatedClasses
 *   relatedClasses={['salsa-cubana-barcelona', 'bachata-barcelona']}
 * />
 * ```
 */
const RelatedClasses: React.FC<RelatedClassesProps> = memo(({ relatedClasses, className = '' }) => {
  const { t, i18n } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);
  const locale = i18n.language;

  // Generate unique IDs for accessibility
  const sectionId = useId();
  const headingId = `${sectionId}-heading`;

  // Filter and map classes - memoized for performance
  const validClasses = useMemo(
    () =>
      relatedClasses
        .map(slug => {
          const classData = CLASS_DATA_MAP[slug];
          return classData ? { slug, ...classData } : null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    [relatedClasses]
  );

  // Grid layout based on number of items - must be before any conditional returns
  const gridClasses = useMemo(() => {
    if (validClasses.length === 1) {
      return 'grid-cols-1 max-w-md mx-auto';
    }
    if (validClasses.length === 2) {
      return 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto';
    }
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  }, [validClasses.length]);

  // Don't render if no valid classes
  if (validClasses.length === 0) return null;

  // Get translated texts
  const title = t('blog_relatedClasses_title');
  const subtitle = t('blog_relatedClasses_subtitle');
  const ctaText = t('blog_relatedClasses_viewClass');

  return (
    <>
      {/* Schema.org markup for SEO */}
      <RelatedClassesSchema items={validClasses} locale={locale} t={t} />

      {/* Main section */}
      <section className={`mt-16 pt-12 ${className}`} aria-labelledby={headingId}>
        {/* Section Header - z-10 to stay above cards on hover */}
        <AnimateOnScroll>
          <header className="text-center mb-8 relative z-10">
            <h2 id={headingId} className="text-3xl md:text-4xl font-black text-neutral mb-3">
              {title}
            </h2>
            <p className="text-neutral/70 max-w-2xl mx-auto">{subtitle}</p>
          </header>
        </AnimateOnScroll>

        {/* Classes Grid - z-0 to stay below header */}
        <div className={`grid gap-6 ${gridClasses} relative z-0`} role="list" aria-label={title}>
          {validClasses.map((classItem, index) => {
            const classUrl = `/${locale}${classItem.url}`;
            const className = t(classItem.nameKey);

            return (
              <div key={classItem.slug} role="listitem">
                <ClassCard
                  classItem={classItem}
                  classUrl={classUrl}
                  className={className}
                  ctaText={ctaText}
                  index={index}
                />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
});

RelatedClasses.displayName = 'RelatedClasses';

export default RelatedClasses;
