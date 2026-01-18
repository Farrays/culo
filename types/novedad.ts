/**
 * Novedad Types - Enterprise Carousel
 * ====================================
 * Types for the "Últimas Novedades" carousel section
 * Supports events, workshops, news, promos, and courses
 */

export type NovedadType = 'event' | 'workshop' | 'news' | 'promo' | 'course';
export type BadgeVariant = 'accent' | 'gold' | 'green' | 'red' | 'blue';
export type SchemaType = 'Event' | 'Course' | 'Article';

export interface NovedadLocation {
  name: string;
  room?: string;
  address?: string;
  geo?: {
    lat: number;
    lng: number;
  };
}

export interface NovedadBadge {
  textKey: string;
  variant: BadgeVariant;
}

export interface NovedadCTA {
  textKey: string;
  link?: string;
  openModal?: boolean;
}

export interface Novedad {
  // Identification
  id: string;
  slug: string;
  type: NovedadType;

  // Content (i18n keys)
  titleKey: string;
  subtitleKey?: string;
  descriptionKey?: string;

  // Image
  image: string; // Base path without extension
  imageAltKey: string;

  // Temporal
  date?: string; // ISO 8601
  endDate?: string;
  time?: string; // "18:00-19:30"

  // Location (GEO/Local SEO)
  location?: NovedadLocation;

  // Visual
  badge?: NovedadBadge;

  // CTA
  cta?: NovedadCTA;

  // Meta
  featured?: boolean;
  order?: number;
  publishedAt: string; // ISO 8601
  expiresAt?: string; // Auto-hide after date

  // SEO Schema type
  schema?: SchemaType;
}

// Badge variant colors mapping
export const BADGE_COLORS: Record<BadgeVariant, string> = {
  accent: 'bg-primary-accent text-white',
  gold: 'bg-yellow-500 text-black',
  green: 'bg-green-500 text-white',
  red: 'bg-red-500 text-white',
  blue: 'bg-blue-500 text-white',
};

// Schema.org type icons
export const SCHEMA_ICONS: Record<NovedadType, string> = {
  event: 'CalendarIcon',
  workshop: 'AcademicCapIcon',
  news: 'NewspaperIcon',
  promo: 'TagIcon',
  course: 'BookOpenIcon',
};
