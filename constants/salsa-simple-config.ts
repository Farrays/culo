/**
 * =============================================================================
 * SALSA SIMPLE CONFIG - Minimalista (2026 Style)
 * =============================================================================
 *
 * La frase central:
 * "Para adultos que se sienten incómodos en fiestas porque no saben bailar
 *  → aprender salsa en 8 semanas → reservar plaza ahora"
 *
 * RUTA: /:locale/salsa-test
 */

import { getTheme } from './landing-themes';
import type { SimpleSaleConfig } from '../components/landing/SimpleSaleLanding';

export const SALSA_SIMPLE_CONFIG: SimpleSaleConfig = {
  id: 'salsa-simple',
  slug: 'salsa-test',

  theme: {
    classes: getTheme('brand'),
  },

  // LA FRASE CENTRAL
  core: {
    problem: '¿Te quedas sentado mientras todos bailan en las fiestas?',
    audience: 'Para adultos sin experiencia previa',
    promise: 'Aprende a bailar salsa en 8 semanas',
    subheadline: 'Sin pareja. Sin experiencia. Con Yunaisy Farray (Street Dance 2).',
  },

  // Imagen
  heroImage: '/images/classes/Salsa/img/clases-salsa-barcelona_1024.webp',
  heroImageAlt: 'Clases de Salsa en Barcelona',

  // Oferta clara
  pricing: {
    firstMonth: 37.5,
    normalPrice: 50,
    savings: 72.5, // Incluye inscripción gratis
  },

  // Social proof mínimo
  socialProof: {
    rating: 4.9,
    reviewCount: 508,
    studentCount: '+15.000',
  },

  // 3 beneficios máximo (no más)
  benefits: [
    'Grupos reducidos de máximo 16 personas',
    'Recupera clases en otro horario si faltas',
    'Sin permanencia, cancela cuando quieras',
  ],

  // CTA
  ctaText: 'RESERVAR PLAZA',
  ctaUrl: 'https://momence.com/Farrays-Center/class/salsa-iniciacion',

  // Garantía (1 línea)
  guarantee: 'Si no te gusta la primera clase, te devolvemos el dinero. Sin preguntas.',

  // Contacto
  whatsapp: '+34644066456',
};
