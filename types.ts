import type * as React from 'react';

export type Locale = 'en' | 'es' | 'ca' | 'fr';

/** Supported locales array - use this instead of hardcoding ['es', 'en', 'ca', 'fr'] */
export const SUPPORTED_LOCALES: readonly Locale[] = ['es', 'en', 'ca', 'fr'] as const;
export type Page = 'home' | 'classes' | 'dancehall';

export interface ClassInfo {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
}

export interface DetailedClassInfo extends ClassInfo {
  detailedDescriptionKey: string;
  substylesKey: string;
  levelKey: string;
}

export interface Testimonial {
  id: number;
  name: string;
  city: Record<Locale, string>;
  quote: Record<Locale, string>;
  image: string;
  rating: number;
}

export interface ValuePillar {
  id: string;
  titleKey: string;
  contentKey: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Teacher {
  id: number;
  name: string;
  image?: string;
  specialtyKey: string;
  bioKey: string;
}

export interface ServiceInfo {
  id: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  titleKey: string;
  descriptionKey: string;
  ctaKey: string;
}

export interface TransportOption {
  id: string;
  titleKey: string;
  options: string[];
}
