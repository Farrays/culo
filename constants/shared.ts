// ===== SHARED CONSTANTS =====
// Constantes compartidas entre todas las páginas de clases de baile
// Extraídas para evitar duplicación en 23+ archivos

// Barcelona nearby areas - IDENTICAL across all dance class pages
export const BARCELONA_NEARBY_AREAS = [
  { name: 'Plaza España', time: '5 min andando' },
  { name: 'Hostafrancs', time: '5 min andando' },
  { name: 'Sants Estació', time: '10 min andando' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
] as const;

// Animation delay constants for consistent UX across all pages
export const ANIMATION_DELAYS = {
  STAGGER_SMALL: 100,
  STAGGER_MEDIUM: 150,
  STAGGER_LARGE: 200,
} as const;

// Default course configuration for schema markup
export const DEFAULT_COURSE_CONFIG = {
  prerequisites: 'Ninguno - clases para todos los niveles desde principiante absoluto',
  duration: 'PT1H',
} as const;

// Hero stats defaults
export const DEFAULT_HERO_STATS = {
  minutes: 60,
  funPercent: 100,
} as const;

// Social proof stats (Google Reviews)
export const SOCIAL_PROOF = {
  rating: '4.9',
  reviewCount: '508+',
  ratingValue: 4.9,
} as const;

// Farray's Center location data
export const FARRAYS_LOCATION = {
  name: "Farray's International Dance Center",
  streetAddress: 'Calle Entenca 100',
  addressLocality: 'Barcelona',
  postalCode: '08015',
  addressCountry: 'ES',
  telephone: '+34622247085',
  email: 'info@farrayscenter.com',
  geo: {
    latitude: '41.380421',
    longitude: '2.148014',
  },
  priceRange: '€€',
} as const;

// Transport options to the center
export const TRANSPORT_OPTIONS = {
  metro: ['L1 Hostafrancs', 'L3 Plaza España'],
  bus: ['27', '50', '65', 'H12'],
  parking: 'Parking BSM Plaza España',
} as const;

// Type exports for TypeScript
export type NearbyArea = (typeof BARCELONA_NEARBY_AREAS)[number];
export type AnimationDelay = keyof typeof ANIMATION_DELAYS;
