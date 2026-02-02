/**
 * Novedades Data - Enterprise Carousel Content
 * =============================================
 * Placeholder data for the "Últimas Novedades" carousel
 * Replace images with actual novedades images when ready
 *
 * Image path format: /images/novedades/img/{slug}
 * Currently using class images as placeholders
 */

import type { Novedad } from '../types/novedad';

// Farray's location for all events
const FARRAYS_LOCATION = {
  name: "Farray's International Dance Center",
  address: 'C/ Villarroel 91, 08011 Barcelona',
  geo: {
    lat: 41.3851,
    lng: 2.1564,
  },
};

export const NOVEDADES_DATA: Novedad[] = [
  {
    id: 'inscripciones-abiertas-2026',
    slug: 'inscripciones-abiertas-2026',
    type: 'event',
    titleKey: 'novedades_inscripciones_title',
    subtitleKey: 'novedades_inscripciones_subtitle',
    descriptionKey: 'novedades_inscripciones_desc',
    image: '/images/novedades/img/inscripciones-abiertas-2026',
    imageAltKey: 'novedades_inscripciones_alt',
    // Event dates: Open enrollment period for 2026
    date: '2026-01-07T10:00:00+01:00', // Start of enrollment period
    endDate: '2026-06-30T22:00:00+02:00', // End of enrollment period (summer)
    location: FARRAYS_LOCATION,
    badge: {
      textKey: 'novedades_badge_inscripciones',
      variant: 'accent',
    },
    cta: {
      textKey: 'novedades_cta_descubre',
      openModal: true,
    },
    featured: true,
    order: 1,
    publishedAt: '2026-01-01T00:00:00+01:00',
  },
];

// Helper to get active novedades (not expired)
export const getActiveNovedades = (): Novedad[] => {
  // Temporarily disable date filtering for development
  // const now = new Date();
  // return NOVEDADES_DATA.filter((novedad) => {
  //   if (novedad.expiresAt) {
  //     return new Date(novedad.expiresAt) > now;
  //   }
  //   return true;
  // }).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  // Return all novedades sorted by order
  return [...NOVEDADES_DATA].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
};

// Helper to get featured novedades
export const getFeaturedNovedades = (): Novedad[] => {
  return getActiveNovedades().filter(n => n.featured);
};
