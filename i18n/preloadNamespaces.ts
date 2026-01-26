/**
 * Namespace Preloading Utility
 *
 * This utility handles lazy loading of i18next namespaces based on routes.
 * It ensures translations are loaded before they're needed, preventing FOUC.
 *
 * Usage:
 * - Called in App.tsx on route change
 * - Components can also call preloadNamespaces() directly if needed
 */

import i18n from './i18n';

/**
 * Available namespaces in the application
 */
export const ALL_NAMESPACES = [
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
] as const;

export type Namespace = (typeof ALL_NAMESPACES)[number];

/**
 * Route-to-namespace mapping
 *
 * Maps URL patterns to the namespaces they require.
 * Keys are base paths (without locale prefix).
 */
export const ROUTE_NAMESPACES: Record<string, Namespace[]> = {
  // Home page
  '/': ['home', 'classes', 'booking'],
  '/test-home-v2': ['home', 'classes', 'booking'],

  // Classes overview
  '/clases/baile-barcelona': ['classes', 'home'],

  // Individual class pages (use pages namespace for landing content)
  '/clases/dancehall-barcelona': ['classes', 'pages'],
  '/clases/twerk-barcelona': ['classes', 'pages'],
  '/clases/afrobeats-barcelona': ['classes', 'pages'],
  '/clases/hip-hop-reggaeton-barcelona': ['classes', 'pages'],
  '/clases/sexy-reggaeton-barcelona': ['classes', 'pages'],
  '/clases/reggaeton-cubano-barcelona': ['classes', 'pages'],
  '/clases/danza-barcelona': ['classes', 'pages'],
  '/clases/heels-barcelona': ['classes', 'pages'],
  '/clases/femmology': ['classes', 'pages'],
  '/clases/sexy-style-barcelona': ['classes', 'pages'],
  '/clases/modern-jazz-barcelona': ['classes', 'pages'],
  '/clases/ballet-barcelona': ['classes', 'pages'],
  '/clases/contemporaneo-barcelona': ['classes', 'pages'],
  '/clases/afro-contemporaneo-barcelona': ['classes', 'pages'],
  '/clases/afro-jazz': ['classes', 'pages'],
  '/clases/salsa-bachata-barcelona': ['classes', 'pages'],
  '/clases/salsa-cubana-barcelona': ['classes', 'pages'],
  '/clases/salsa-lady-style-barcelona': ['classes', 'pages'],
  '/clases/salsa-lady-style-v2': ['classes', 'pages'],
  '/clases/bachata-barcelona': ['classes', 'pages'],
  '/clases/bachata-lady-style-barcelona': ['classes', 'pages'],
  '/clases/folklore-cubano': ['classes', 'pages'],
  '/clases/timba-barcelona': ['classes', 'pages'],
  '/clases/danzas-urbanas-barcelona': ['classes', 'pages'],
  '/clases/entrenamiento-bailarines-barcelona': ['classes', 'pages'],
  '/clases/stretching-barcelona': ['classes', 'pages'],
  '/clases/ejercicios-gluteos-barcelona': ['classes', 'pages'],
  '/clases/acondicionamiento-fisico-bailarines': ['classes', 'pages'],
  '/clases/baile-mananas': ['classes', 'pages'],
  '/clases/cuerpo-fit': ['classes', 'pages'],
  '/clases/hip-hop-barcelona': ['classes', 'pages'],
  '/clases/kpop-dance-barcelona': ['classes', 'pages'],
  '/clases/commercial-dance-barcelona': ['classes', 'pages'],
  '/clases/kizomba-barcelona': ['classes', 'pages'],

  // Booking & Schedule
  '/reservas': ['booking', 'schedule', 'calendar'],
  '/horarios-clases-baile-barcelona': ['schedule', 'calendar', 'classes'],
  '/horarios-precios': ['schedule', 'classes'],
  '/precios-clases-baile-barcelona': ['classes', 'schedule'],
  '/calendario': ['calendar', 'schedule'],

  // Blog
  '/blog': ['blog'],

  // About & Info
  '/sobre-nosotros': ['about'],
  '/yunaisy-farray': ['about'],
  '/metodo-farray': ['about'],
  '/profesores-baile-barcelona': ['about'],
  '/instalaciones-escuela-baile-barcelona': ['about'],
  '/preguntas-frecuentes': ['faq'],

  // Contact
  '/contacto': ['contact'],

  // Services
  '/servicios-baile-barcelona': ['classes'],
  '/clases-particulares-baile': ['classes', 'booking'],
  '/alquiler-salas-baile-barcelona': ['classes'],
  '/estudio-grabacion-barcelona': ['classes'],
  '/regala-baile': ['classes', 'booking'],
  '/team-building-barcelona': ['classes'],
  '/merchandising': ['classes'],

  // Landing pages (promotional - use pages namespace which has all landing content)
  '/dancehall': ['pages', 'classes'],
  '/twerk': ['pages', 'classes'],
  '/sexy-reggaeton': ['pages', 'classes'],
  '/sexy-style': ['pages', 'classes'],
  '/hip-hop-reggaeton': ['pages', 'classes'],
  '/contemporaneo': ['pages', 'classes'],
  '/femmology': ['pages', 'classes'],
  '/bachata': ['pages', 'classes'],
  '/hip-hop': ['pages', 'classes'],
  '/afrobeats': ['pages', 'classes'],
  '/afro-jazz': ['pages', 'classes'],
  '/salsa-cubana': ['pages', 'classes'],
  '/ballet': ['pages', 'classes'],
  '/afro-contemporaneo': ['pages', 'classes'],
  '/jornada-puertas-abiertas': ['pages', 'classes'],

  // Legal pages (minimal namespaces needed)
  '/terminos-y-condiciones': [],
  '/aviso-legal': [],
  '/politica-privacidad': [],
  '/politica-cookies': [],
};

/**
 * Preload namespaces for a given route
 *
 * @param path - The path without locale prefix (e.g., '/clases/dancehall-barcelona')
 * @returns Promise that resolves when namespaces are loaded
 */
export const preloadNamespaces = async (path: string): Promise<void> => {
  // Normalize path
  const normalizedPath = path === '' ? '/' : path;

  // Find exact match first
  let namespaces = ROUTE_NAMESPACES[normalizedPath];

  // If no exact match, try partial matching for dynamic routes
  if (!namespaces) {
    // Handle blog article pages
    if (normalizedPath.startsWith('/blog/')) {
      namespaces = ['blog'];
    }
    // Handle class pages as fallback
    else if (normalizedPath.startsWith('/clases/')) {
      namespaces = ['classes', 'pages'];
    }
    // Default: no extra namespaces needed
    else {
      namespaces = [];
    }
  }

  // Filter out namespaces that are already loaded
  const missing = namespaces.filter(ns => !i18n.hasResourceBundle(i18n.language, ns));

  if (missing.length > 0) {
    await i18n.loadNamespaces(missing);
  }
};

/**
 * Preload specific namespaces directly
 *
 * @param namespaces - Array of namespace names to load
 * @returns Promise that resolves when namespaces are loaded
 */
export const loadNamespaces = async (namespaces: Namespace[]): Promise<void> => {
  const missing = namespaces.filter(ns => !i18n.hasResourceBundle(i18n.language, ns));

  if (missing.length > 0) {
    await i18n.loadNamespaces(missing);
  }
};

/**
 * Check if a namespace is loaded for the current language
 */
export const isNamespaceLoaded = (namespace: Namespace): boolean => {
  return i18n.hasResourceBundle(i18n.language, namespace);
};

export default preloadNamespaces;
