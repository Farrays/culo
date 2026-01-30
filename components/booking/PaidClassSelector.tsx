/**
 * PaidClassSelector Component
 *
 * Selector de clases para productos de pago (10€ clase individual, 20€ pack 3 clases).
 * El usuario selecciona una clase y es redirigido a Momence para completar el pago.
 *
 * Features:
 * - Muestra clases filtradas por estilo con agrupación por día
 * - Dos botones de compra por clase: 10€ (single) y 20€ (pack)
 * - Redirect directo a Momence checkout con sessionId
 * - UX idéntico al BookingWidgetV2 (navegación semanal, sticky headers)
 *
 * @example
 * ```tsx
 * <PaidClassSelector
 *   initialFilters={{ style: 'bachata' }}
 *   showSocialProof={true}
 * />
 * ```
 */

import React, { memo, useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Hooks
import { useBookingFilters } from './hooks/useBookingFilters';
import { useBookingClasses } from './hooks/useBookingClasses';

// Components
import { FilterBar } from './components/FilterBar';
import { WeekNavigation } from './components/WeekNavigation';
import { SkeletonClassList } from './components/SkeletonClassCard';
import { BookingError } from './components/BookingError';
import { SocialProofTicker } from './components/SocialProofTicker';
import { ActiveFilterBadges } from './components/ActiveFilterBadges';

// Types
import type { ClassData, FilterState } from './types/booking';

// Analytics
import { pushToDataLayer } from '../../utils/analytics';

// Icons
const CalendarIcon: React.FC<{ className?: string }> = memo(({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
));
CalendarIcon.displayName = 'CalendarIcon';

const ClockIcon: React.FC<{ className?: string }> = memo(({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
));
ClockIcon.displayName = 'ClockIcon';

const UserIcon: React.FC<{ className?: string }> = memo(({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
));
UserIcon.displayName = 'UserIcon';

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
  if (hours > 0) return `${hours}h`;
  return `${mins}min`;
};

// Day group structure for day separators (same as ClassListStep)
interface DayGroup {
  dateKey: string;
  dayLabel: string;
  dayOfWeek: string;
  classes: ClassData[];
}

/**
 * Groups classes by day based on rawStartsAt
 * Returns sorted array of day groups with localized labels
 */
function groupClassesByDay(classes: ClassData[], locale: string): DayGroup[] {
  if (classes.length === 0) return [];

  const dayMap = new Map<string, DayGroup>();

  classes.forEach(classData => {
    const classDate = new Date(classData.rawStartsAt);
    const dateKey = classDate.toISOString().split('T')[0] ?? '';

    if (!dayMap.has(dateKey)) {
      const dayOfWeek = classDate.toLocaleDateString(locale === 'ca' ? 'ca-ES' : `${locale}-ES`, {
        weekday: 'long',
      });
      const dateFormatted = classDate.toLocaleDateString(
        locale === 'ca' ? 'ca-ES' : `${locale}-ES`,
        { day: 'numeric', month: 'short' }
      );
      const dayOfWeekCapitalized = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

      dayMap.set(dateKey, {
        dateKey,
        dayLabel: `${dayOfWeekCapitalized} ${dateFormatted}`,
        dayOfWeek: dayOfWeekCapitalized,
        classes: [],
      });
    }

    dayMap.get(dateKey)?.classes.push(classData);
  });

  return Array.from(dayMap.values())
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .map(group => ({
      ...group,
      classes: group.classes.sort(
        (a, b) => new Date(a.rawStartsAt).getTime() - new Date(b.rawStartsAt).getTime()
      ),
    }));
}

/**
 * Day header component with sticky positioning
 */
const DayHeader: React.FC<{
  dayLabel: string;
  classCount: number;
  isFirst?: boolean;
}> = memo(({ dayLabel, classCount, isFirst = false }) => {
  const { t } = useTranslation('booking');

  return (
    <div
      className={`
        sticky top-0 z-10 flex items-center gap-2 py-2.5 px-3 sm:px-4
        bg-gradient-to-r from-primary-accent/20 via-black to-primary-accent/20
        backdrop-blur-md border-y border-primary-accent/30
        ${isFirst ? '' : 'mt-4'}
      `}
      role="heading"
      aria-level={3}
    >
      <CalendarIcon className="w-4 h-4 text-primary-accent flex-shrink-0" />
      <span className="font-semibold text-neutral text-sm md:text-base truncate">{dayLabel}</span>
      <span className="ml-auto text-xs text-neutral/50 bg-white/5 px-2 py-0.5 rounded-full flex-shrink-0">
        {t('booking_classes_count', { count: classCount ?? 0 })}
      </span>
    </div>
  );
});
DayHeader.displayName = 'DayHeader';

// Product configuration
export interface PaidProduct {
  id: 'single' | 'pack';
  labelKey: string;
  price: number;
  credits?: number;
  /** Momence product key for building checkout URL */
  momenceProductKey: 'SINGLE_CLASS' | 'PACK_3_CLASSES';
  /** Badge to show (e.g., "POPULAR", "MEJOR VALOR") */
  badgeKey?: string;
  /** Subtitle text (e.g., "7 días para usarlas") */
  subtitleKey?: string;
}

// Momence deep link configuration
const MOMENCE_CONFIG = {
  BUSINESS_SLUG: "Farray's-International-Dance-Center",
  PRODUCTS: {
    SINGLE_CLASS: {
      id: '189422',
      slug: "Clase-Especial-de-Bienvenida-Farray's-Center---1-Clase-x-10%E2%82%AC",
    },
    PACK_3_CLASSES: {
      id: '518447',
      slug: "Pack-Especial-de-Bienvenida-Farray's-Center---3-Clases-x-20%E2%82%AC",
    },
  },
};

// Build Momence checkout URL with product and session
function buildMomenceCheckoutUrl(
  productKey: 'SINGLE_CLASS' | 'PACK_3_CLASSES',
  sessionId: number
): string {
  const product = MOMENCE_CONFIG.PRODUCTS[productKey];
  return `https://momence.com/${MOMENCE_CONFIG.BUSINESS_SLUG}/membership/${product.slug}/${product.id}?sessionId=${sessionId}`;
}

interface PaidClassSelectorProps {
  /** Initial filters (e.g., { style: 'bachata' }) */
  initialFilters?: Partial<FilterState>;
  /** Show social proof ticker */
  showSocialProof?: boolean;
  /** Custom products configuration */
  products?: PaidProduct[];
  /** Callback when purchase button is clicked (for analytics or custom behavior) */
  onPurchaseClick?: (classData: ClassData, product: PaidProduct) => void;
}

// Single class card with purchase buttons - matches ClassCard styling
const PaidClassCard: React.FC<{
  classData: ClassData;
  products: PaidProduct[];
  onPurchase: (product: PaidProduct) => void;
}> = memo(({ classData, products, onPurchase }) => {
  const { t } = useTranslation(['booking', 'common', 'pages']);

  return (
    <div className="w-full p-4 rounded-2xl border-2 border-primary-accent/30 bg-white/5 hover:border-primary-accent hover:bg-white/10 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        {/* Class info - same layout as ClassCard */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-neutral mb-1 leading-tight">{classData.name}</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral/70">
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4 flex-shrink-0" />
              {classData.dayOfWeek} {classData.date}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4 flex-shrink-0" />
              {classData.time}
            </span>
            <span className="text-neutral/50">{formatDuration(classData.duration)}</span>
          </div>
          {classData.instructor && (
            <div className="mt-1 text-sm">
              <span className="flex items-center gap-1 text-neutral/70">
                <UserIcon className="w-4 h-4 flex-shrink-0" />
                {classData.instructor}
              </span>
            </div>
          )}

          {/* Full indicator inline */}
          {classData.isFull && (
            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium text-red-400 bg-red-400/10 rounded">
              {t('booking_class_full')}
            </span>
          )}
        </div>

        {/* Purchase buttons - equal size, rounded, with depth */}
        {!classData.isFull && (
          <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0 min-w-[140px]">
            {products.map(product => (
              <button
                key={product.id}
                onClick={() => onPurchase(product)}
                className={`
                  relative w-full py-2.5 px-4 rounded-xl font-semibold text-xs
                  transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]
                  ${
                    product.id === 'pack'
                      ? 'bg-primary-accent text-white shadow-lg shadow-primary-accent/40 hover:shadow-xl hover:shadow-primary-accent/50'
                      : 'bg-white/10 text-neutral border border-white/20 shadow-md shadow-black/20 hover:bg-white/15 hover:shadow-lg'
                  }
                `}
              >
                {product.badgeKey && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] font-bold bg-amber-500 text-black rounded-full uppercase leading-none whitespace-nowrap">
                    {t(product.badgeKey)}
                  </span>
                )}
                <span className="block whitespace-nowrap text-center">
                  {product.price}€ · {t(product.labelKey)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
PaidClassCard.displayName = 'PaidClassCard';

export const PaidClassSelector: React.FC<PaidClassSelectorProps> = memo(
  ({ initialFilters = {}, showSocialProof = true, products: customProducts, onPurchaseClick }) => {
    const { t, i18n } = useTranslation(['booking', 'common', 'pages']);
    const locale = i18n.language;
    const [weekOffset, setWeekOffset] = useState(0);

    // Use existing booking filters hook
    const { filters, setFilter, clearFilter, clearAllFilters, setFilters } = useBookingFilters();

    // Apply initial filters on mount
    React.useEffect(() => {
      if (Object.keys(initialFilters).length > 0) {
        setFilters(initialFilters);
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Check if any filters are active
    const hasActiveFilters = Object.values(filters).some(v => v !== '');

    // Use existing booking classes hook
    const { classes, loading, error, filterOptions, refetch, allWeeksClasses } = useBookingClasses({
      filters,
      weekOffset,
      fetchAllWeeks: hasActiveFilters,
    });

    // Use filtered all weeks classes when filters are active
    const displayClasses = hasActiveFilters ? allWeeksClasses : classes;

    // Group classes by day (same as ClassListStep)
    const dayGroups = useMemo(() => {
      if (displayClasses.length === 0) return [];
      return groupClassesByDay(displayClasses, locale);
    }, [displayClasses, locale]);

    // Default products configuration
    const products: PaidProduct[] = customProducts || [
      {
        id: 'single',
        labelKey: 'paidSelector_singleClass',
        price: 10,
        credits: 1,
        momenceProductKey: 'SINGLE_CLASS',
      },
      {
        id: 'pack',
        labelKey: 'paidSelector_packClass',
        price: 20,
        credits: 3,
        momenceProductKey: 'PACK_3_CLASSES',
        badgeKey: 'paidSelector_bestValue',
      },
    ];

    // Handle purchase click - redirects to Momence product page
    const handlePurchase = useCallback(
      (classData: ClassData, product: PaidProduct) => {
        // Track analytics
        pushToDataLayer({
          event: 'purchase_intent',
          product_type: product.id,
          product_price: product.price,
          class_id: classData.id,
          class_name: classData.name,
          class_style: classData.style,
        });

        // Custom callback if provided
        if (onPurchaseClick) {
          onPurchaseClick(classData, product);
          return;
        }

        // Build Momence checkout URL with product + session
        const checkoutUrl = buildMomenceCheckoutUrl(product.momenceProductKey, classData.id);
        window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
      },
      [onPurchaseClick]
    );

    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Social Proof */}
        {showSocialProof && <SocialProofTicker className="mb-6" />}

        {/* Title */}
        <h2 className="text-2xl font-bold text-neutral text-center mb-4">
          {t('booking_step1_classes')}
        </h2>

        {/* Filters */}
        <FilterBar
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={setFilter}
          loading={loading}
        />

        {/* Active Filter Badges */}
        <ActiveFilterBadges
          filters={filters}
          onClearFilter={clearFilter}
          onClearAll={clearAllFilters}
        />

        {/* Week Navigation */}
        <WeekNavigation weekOffset={weekOffset} onWeekChange={setWeekOffset} loading={loading} />

        {/* Loading State */}
        {loading && (
          <SkeletonClassList count={4} loadingMessage={t('booking_loading_please_wait')} />
        )}

        {/* Error State */}
        {error && <BookingError errorMessage={error} onRetry={refetch} />}

        {/* Classes List - grouped by day with sticky headers */}
        {!loading && !error && (
          <div className="mt-4" role="region" aria-label={t('booking_classes_region')}>
            {displayClasses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <CalendarIcon className="w-8 h-8 text-neutral/40" />
                </div>
                <p className="text-neutral/60 mb-4">
                  {hasActiveFilters ? t('booking_no_classes_match') : t('booking_class_empty')}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="px-4 py-2 text-primary-accent hover:underline transition-colors"
                  >
                    {t('booking_clear_filters')}
                  </button>
                )}
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-1">
                  {dayGroups.map((group, groupIndex) => (
                    <div key={group.dateKey}>
                      {/* Day Header - Sticky */}
                      <DayHeader
                        dayLabel={group.dayLabel}
                        classCount={group.classes.length}
                        isFirst={groupIndex === 0}
                      />
                      {/* Classes for this day */}
                      <div className="grid gap-3 py-2">
                        {group.classes.map(classData => (
                          <PaidClassCard
                            key={classData.id}
                            classData={classData}
                            products={products}
                            onPurchase={product => handlePurchase(classData, product)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results count */}
        {!loading && !error && displayClasses.length > 0 && (
          <p className="text-center text-sm text-neutral/50 mt-6">
            {t('booking_classes_found', { count: displayClasses.length })}
          </p>
        )}
      </div>
    );
  }
);

PaidClassSelector.displayName = 'PaidClassSelector';

export default PaidClassSelector;
