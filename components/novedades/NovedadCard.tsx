/**
 * NovedadCard - Enterprise Carousel Card Component
 * =================================================
 * Individual card for the Novedades carousel
 *
 * Features:
 * - Schema.org Event/Course markup
 * - Lazy loaded images with OptimizedImage
 * - Date/time badge overlay
 * - Accessibility compliant
 * - 3D hover effects
 */

import React, { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import type { Novedad } from '../../types/novedad';
import { BADGE_COLORS } from '../../types/novedad';
import LeadCaptureModal from '../shared/LeadCaptureModal';
import { Link } from 'react-router-dom';

// Lazy load OptimizedImage
const OptimizedImage = lazy(() => import('../OptimizedImage'));

interface NovedadCardProps {
  novedad: Novedad;
  shouldLoadImage?: boolean;
  index?: number;
  total?: number;
}

// Format date for display
const formatDate = (dateStr: string, locale: string): string => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  };
  return date.toLocaleDateString(
    locale === 'ca' ? 'ca-ES' : locale === 'en' ? 'en-GB' : locale === 'fr' ? 'fr-FR' : 'es-ES',
    options
  );
};

// Format date range
const formatDateRange = (
  startDate: string,
  endDate: string | undefined,
  locale: string
): string => {
  if (!endDate) return formatDate(startDate, locale);
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startStr = start.toLocaleDateString(
    locale === 'ca' ? 'ca-ES' : locale === 'en' ? 'en-GB' : locale === 'fr' ? 'fr-FR' : 'es-ES',
    { day: 'numeric', month: 'short' }
  );
  const endStr = end.toLocaleDateString(
    locale === 'ca' ? 'ca-ES' : locale === 'en' ? 'en-GB' : locale === 'fr' ? 'fr-FR' : 'es-ES',
    { day: 'numeric', month: 'short' }
  );
  return `${startStr} - ${endStr}`;
};

const NovedadCard: React.FC<NovedadCardProps> = ({
  novedad,
  shouldLoadImage = true,
  index = 0,
  total = 1,
}) => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCTAClick = (e: React.MouseEvent) => {
    if (novedad.cta?.openModal) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  // Schema.org structured data
  const schemaData =
    novedad.schema === 'Event' || novedad.schema === 'Course'
      ? {
          '@context': 'https://schema.org',
          '@type': novedad.schema,
          name: t(novedad.titleKey),
          description: novedad.descriptionKey ? t(novedad.descriptionKey) : undefined,
          startDate: novedad.date,
          endDate: novedad.endDate || novedad.date,
          location: novedad.location
            ? {
                '@type': 'Place',
                name: novedad.location.name,
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: novedad.location.address?.split(',')[0],
                  addressLocality: 'Barcelona',
                  postalCode: '08011',
                  addressCountry: 'ES',
                },
                geo: novedad.location.geo
                  ? {
                      '@type': 'GeoCoordinates',
                      latitude: novedad.location.geo.lat,
                      longitude: novedad.location.geo.lng,
                    }
                  : undefined,
              }
            : undefined,
          image: `https://farrays.com${novedad.image}_1024.jpg`,
          organizer: {
            '@type': 'Organization',
            name: "Farray's International Dance Center",
            url: 'https://farrays.com',
          },
        }
      : null;

  const isLinkCTA = novedad.cta?.link && !novedad.cta?.openModal;

  return (
    <>
      <article
        className="group relative flex-shrink-0 w-[85vw] sm:w-[400px] md:w-[380px] scroll-snap-align-start"
        role="listitem"
        aria-setsize={total}
        aria-posinset={index + 1}
        aria-label={`${t(novedad.titleKey)}${novedad.date ? `, ${formatDate(novedad.date, locale)}` : ''}`}
        itemScope
        itemType={`https://schema.org/${novedad.schema || 'Event'}`}
      >
        {/* Schema.org JSON-LD */}
        {schemaData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
          />
        )}

        <div className="relative bg-black/60 backdrop-blur-md border border-primary-dark/50 rounded-2xl overflow-hidden transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:border-primary-accent hover:shadow-accent-glow">
          {/* Image Container */}
          <div className="relative aspect-video overflow-hidden">
            {shouldLoadImage ? (
              <Suspense
                fallback={<div className="absolute inset-0 bg-primary-dark/30 animate-pulse" />}
              >
                <OptimizedImage
                  src={novedad.image}
                  altKey={novedad.imageAltKey}
                  alt={t(novedad.imageAltKey)}
                  aspectRatio="16/9"
                  sizes="(max-width: 640px) 85vw, 400px"
                  className="w-full h-full"
                  objectFit="cover"
                  breakpoints={[320, 640, 768, 1024]}
                />
              </Suspense>
            ) : (
              <div className="absolute inset-0 bg-primary-dark/30" />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Date Badge */}
            {novedad.date && (
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary-accent/30">
                <time
                  dateTime={novedad.date}
                  className="text-sm font-bold text-white"
                  itemProp="startDate"
                >
                  {formatDateRange(novedad.date, novedad.endDate, locale)}
                </time>
                {novedad.time && <p className="text-xs text-neutral/80 mt-0.5">{novedad.time}</p>}
              </div>
            )}

            {/* Status Badge */}
            {novedad.badge && (
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${BADGE_COLORS[novedad.badge.variant]}`}
              >
                {t(novedad.badge.textKey)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <h3
              className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-accent transition-colors duration-300"
              itemProp="name"
            >
              {t(novedad.titleKey)}
            </h3>

            {/* Subtitle */}
            {novedad.subtitleKey && (
              <p className="text-primary-accent font-medium text-sm mb-2">
                {t(novedad.subtitleKey)}
              </p>
            )}

            {/* Location */}
            {novedad.location && (
              <p
                className="text-neutral/70 text-sm mb-3 flex items-center gap-1.5"
                itemProp="location"
                itemScope
                itemType="https://schema.org/Place"
              >
                <svg
                  className="w-4 h-4 text-primary-accent flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span itemProp="name">{novedad.location.room || novedad.location.name}</span>
                {novedad.location.geo && (
                  <>
                    <meta itemProp="latitude" content={String(novedad.location.geo.lat)} />
                    <meta itemProp="longitude" content={String(novedad.location.geo.lng)} />
                  </>
                )}
              </p>
            )}

            {/* CTA Button */}
            {novedad.cta && isLinkCTA && novedad.cta.link && (
              <Link
                to={novedad.cta.link}
                className="group/btn inline-flex items-center gap-2 bg-primary-accent/20 hover:bg-primary-accent text-primary-accent hover:text-white font-bold py-2.5 px-5 rounded-full transition-all duration-300 text-sm border border-primary-accent/50 hover:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
              >
                <span>{t(novedad.cta.textKey)}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            )}
            {novedad.cta && !isLinkCTA && (
              <button
                type="button"
                onClick={handleCTAClick}
                className="group/btn inline-flex items-center gap-2 bg-primary-accent/20 hover:bg-primary-accent text-primary-accent hover:text-white font-bold py-2.5 px-5 rounded-full transition-all duration-300 text-sm border border-primary-accent/50 hover:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/50"
              >
                <span>{t(novedad.cta.textKey)}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default NovedadCard;
