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
    id: 'puertas-abiertas-enero-2026',
    slug: 'puertas-abiertas-enero-2026',
    type: 'event',
    titleKey: 'novedades_puertasAbiertas_title',
    subtitleKey: 'novedades_puertasAbiertas_subtitle',
    descriptionKey: 'novedades_puertasAbiertas_desc',
    // Placeholder image - replace with actual novedad image
    image: '/images/classes/dancehall/img/dancehall-classes-barcelona-01',
    imageAltKey: 'novedades_puertasAbiertas_alt',
    date: '2026-01-07',
    endDate: '2026-01-31',
    time: 'Horarios variados',
    location: {
      ...FARRAYS_LOCATION,
      room: 'Todas las salas',
    },
    badge: {
      textKey: 'novedades_badge_destacado',
      variant: 'accent',
    },
    cta: {
      textKey: 'novedades_cta_reservar',
      openModal: true,
    },
    featured: true,
    order: 1,
    publishedAt: '2026-01-01T00:00:00+01:00',
    expiresAt: '2026-01-31T23:59:59+01:00',
    schema: 'Event',
  },
  {
    id: 'workshop-afro-febrero',
    slug: 'workshop-afro-febrero',
    type: 'workshop',
    titleKey: 'novedades_workshopAfro_title',
    subtitleKey: 'novedades_workshopAfro_subtitle',
    descriptionKey: 'novedades_workshopAfro_desc',
    // Placeholder image
    image: '/images/classes/afrobeat/img/clases-afrobeat-barcelona',
    imageAltKey: 'novedades_workshopAfro_alt',
    date: '2026-02-15',
    time: '18:00-20:00',
    location: {
      ...FARRAYS_LOCATION,
      room: 'Sala Gran Vía',
    },
    badge: {
      textKey: 'novedades_badge_nuevo',
      variant: 'gold',
    },
    cta: {
      textKey: 'novedades_cta_apuntarse',
      openModal: true,
    },
    featured: true,
    order: 2,
    publishedAt: '2026-01-10T00:00:00+01:00',
    schema: 'Event',
  },
  {
    id: 'formacion-profesional-2026',
    slug: 'formacion-profesional-2026',
    type: 'course',
    titleKey: 'novedades_formacion_title',
    subtitleKey: 'novedades_formacion_subtitle',
    descriptionKey: 'novedades_formacion_desc',
    // Placeholder image
    image: '/images/classes/ballet/img/clases-ballet-barcelona',
    imageAltKey: 'novedades_formacion_alt',
    date: '2026-01-15',
    endDate: '2026-06-30',
    time: '20h semanales',
    location: FARRAYS_LOCATION,
    badge: {
      textKey: 'novedades_badge_plazasLimitadas',
      variant: 'red',
    },
    cta: {
      textKey: 'novedades_cta_info',
      link: '/es/formacion-profesional',
    },
    featured: true,
    order: 3,
    publishedAt: '2026-01-01T00:00:00+01:00',
    schema: 'Course',
  },
  {
    id: 'bachata-intensivo',
    slug: 'bachata-intensivo',
    type: 'workshop',
    titleKey: 'novedades_bachataIntensivo_title',
    subtitleKey: 'novedades_bachataIntensivo_subtitle',
    descriptionKey: 'novedades_bachataIntensivo_desc',
    // Placeholder image
    image: '/images/classes/Bachata/img/clases-bachata-sensual-barcelona',
    imageAltKey: 'novedades_bachataIntensivo_alt',
    date: '2026-02-08',
    time: '16:00-18:00',
    location: {
      ...FARRAYS_LOCATION,
      room: 'Sala Latina',
    },
    badge: {
      textKey: 'novedades_badge_ultimasPlazas',
      variant: 'red',
    },
    cta: {
      textKey: 'novedades_cta_reservar',
      openModal: true,
    },
    order: 4,
    publishedAt: '2026-01-05T00:00:00+01:00',
    schema: 'Event',
  },
  {
    id: 'heels-showcase',
    slug: 'heels-showcase',
    type: 'event',
    titleKey: 'novedades_heelsShowcase_title',
    subtitleKey: 'novedades_heelsShowcase_subtitle',
    descriptionKey: 'novedades_heelsShowcase_desc',
    // Placeholder image
    image: '/images/classes/Heels/img/clases-heels-barcelona',
    imageAltKey: 'novedades_heelsShowcase_alt',
    date: '2026-03-08',
    time: '19:00-21:00',
    location: {
      ...FARRAYS_LOCATION,
      room: 'Sala Principal',
    },
    badge: {
      textKey: 'novedades_badge_evento',
      variant: 'accent',
    },
    cta: {
      textKey: 'novedades_cta_entradas',
      openModal: true,
    },
    order: 5,
    publishedAt: '2026-01-15T00:00:00+01:00',
    schema: 'Event',
  },
  {
    id: 'hip-hop-battle',
    slug: 'hip-hop-battle',
    type: 'event',
    titleKey: 'novedades_hipHopBattle_title',
    subtitleKey: 'novedades_hipHopBattle_subtitle',
    descriptionKey: 'novedades_hipHopBattle_desc',
    // Placeholder image
    image: '/images/classes/hip-hop/img/clases-hip-hop-barcelona',
    imageAltKey: 'novedades_hipHopBattle_alt',
    date: '2026-02-22',
    time: '17:00-21:00',
    location: {
      ...FARRAYS_LOCATION,
      room: 'Sala Gran Vía',
    },
    badge: {
      textKey: 'novedades_badge_competicion',
      variant: 'blue',
    },
    cta: {
      textKey: 'novedades_cta_inscribirse',
      openModal: true,
    },
    order: 6,
    publishedAt: '2026-01-12T00:00:00+01:00',
    schema: 'Event',
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
