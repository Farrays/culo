/**
 * i18next Configuration for Testing Environment
 * Enterprise-grade test setup for i18next integration
 *
 * This configuration:
 * - Loads translations synchronously (required for tests)
 * - Provides minimal but complete translation coverage
 * - Matches production i18next configuration structure
 * - Enables fast test execution without async loading
 *
 * @see i18n/i18n.ts - Production configuration
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ============================================================================
// MOCK TRANSLATIONS - Minimal but Complete
// ============================================================================
// These translations cover the most commonly tested strings
// Add more as needed when tests fail due to missing keys

const mockTranslations = {
  common: {
    // Navigation
    navHome: 'Inicio',
    navClasses: 'Clases',
    navSchedule: 'Horarios',
    navAbout: 'Nosotros',
    navContact: 'Contacto',
    navProfessors: 'Profesores',
    skipToMainContent: 'Saltar al contenido principal',

    // CTAs
    enrollNow: 'Hazte Socio',
    learnMore: 'Más información',
    seeMore: 'Ver más',
    viewAll: 'Ver todos',
    close: 'Cerrar',

    // Teachers (basic - extend as needed)
    teachersTitle: 'Nuestro Equipo de Maestros',
    teachersSubtitle: 'Profesionales formados en las mejores escuelas del mundo',
    teachersCTA: 'Conoce a todo el equipo',

    // Common UI
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
  },

  home: {
    // Hero
    heroTitle: 'Centro Internacional de Danza',
    heroSubtitle: 'Academia de élite de danza en Barcelona',
    heroCTA: 'Empieza a Bailar',

    // Social Proof
    socialProofTitle: 'Confianza de bailarines de todo el mundo',

    // Problem/Solution
    problemTitle: 'Desafíos Comunes de Danza',
    solutionTitle: 'Nuestra Solución',

    // Method
    methodTitle: 'El Método Farray®',
    methodSubtitle: 'Sistema de formación profesional',

    // Trust Bar
    trustBarStat1: '+15.000 alumnos',
    trustBarStat2: '+25 años de experiencia',
    trustBarStat3: 'Maestros de clase mundial',

    // Final CTA
    finalCTATitle: '¿Listo para empezar a bailar?',
    finalCTACTA: 'Reserva tu Primera Clase',

    // Mini FAQ
    miniFAQTitle: 'Preguntas Frecuentes',
  },

  pages: {
    // Services
    servicesTitle: 'Nuestros Servicios',
    servicesIntro: 'Servicios integrales de danza',
    servicesRentalTitle: 'Alquiler de Salas',
    servicesRentalDesc: 'Alquila nuestros estudios profesionales',
    servicesRentalCTA: 'Más información sobre alquiler',
    servicesCorporateTitle: 'Clases Corporativas',
    servicesCorporateDesc: 'Team building a través de la danza',
    servicesCorporateCTA: 'Info corporativa',
    servicesGiftTitle: 'Tarjetas Regalo',
    servicesGiftDesc: 'El regalo perfecto para bailarines',
    servicesGiftCTA: 'Comprar tarjeta regalo',
    servicesViewAll: 'Ver todos los servicios',

    // Back to Top
    backToTop: 'Volver arriba',

    // Contact Page
    contactTitle: 'Contáctanos',
    contact_breadcrumb_home: 'Inicio',
    contact_breadcrumb_current: 'Contacto',
    contact_hero_title: 'Ponte en Contacto',
    contact_hero_subtitle:
      'Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes posible.',
    contact_info_title: 'Información de Contacto',
    contact_address_title: 'Dirección',
    contact_address_text: 'Calle Entença nº 100, Barcelona',
    contact_phone_title: 'Teléfono',
    contact_email_title: 'Email',
    contact_form_title: 'Envíanos un mensaje',
    contact_form_firstName: 'Nombre',
    contact_form_lastName: 'Apellidos',
    contact_form_name: 'Nombre',
    contact_form_email: 'Email',
    contact_form_phone: 'Teléfono',
    contact_form_message: 'Mensaje',
    contact_form_submit: 'Enviar Mensaje',

    // Not Found Page
    '404_title': 'Página no encontrada',
    '404_message': 'La página que buscas no existe',
    '404_home': 'Volver al inicio',

    // Dance Classes Page
    danceClassesTitle: 'Clases de Baile en Barcelona',
    danceClassesHeroTitle: 'Descubre Nuestras Clases de Baile',

    // FAQ Page
    faqTitle: 'Preguntas Frecuentes',
    faqHeroTitle: 'Resuelve tus dudas',

    // Footer
    footerAbout: 'Sobre Nosotros',
    footerClasses: 'Clases',
    footerContact: 'Contacto',
    footerPrivacy: 'Política de Privacidad',
    footerTerms: 'Términos y Condiciones',
  },

  booking: {
    // Social Proof Ticker
    recentBooking: 'Alguien acaba de reservar una clase',
    timeAgo: 'Hace {time}',

    // Booking Form
    selectClass: 'Selecciona una clase',
    selectDate: 'Selecciona una fecha',
    selectTime: 'Selecciona una hora',
    confirmBooking: 'Confirmar reserva',
  },

  schedule: {
    // Schedule Card
    viewSchedule: 'Ver horarios',
    bookClass: 'Reservar clase',
    classLevel: 'Nivel: {level}',

    // Sticky CTA
    sticky_cta: 'Reserva tu clase',
    sticky_trust1: 'Prueba gratuita',
    sticky_trust2: 'Sin compromiso',
    sticky_trust3: 'Cancela cuando quieras',
  },

  classes: {
    // Level Cards
    levelCardTitle: 'Niveles de Clase',
    levelCardSubtitle: 'Encuentra tu nivel perfecto',

    // Prepare Section
    prepareTitle: 'Prepárate para tu Primera Clase',
    prepareSubtitle: 'Todo lo que necesitas saber',
    prepareWhatToBring: 'Qué traer',
    prepareBefore: 'Antes de llegar',
    prepareAvoid: 'Qué evitar',
    testPrepareWhatToBring: 'Qué traer',
    testPrepareItem1: 'Elemento 1',
    testPrepareItem2: 'Elemento 2',
    testPrepareItem3: 'Elemento 3',
    testPrepareItem4: 'Elemento 4',
    testPrepareItem5: 'Elemento 5',
    testPrepareBeforeItem1: 'Antes item 1',
    testPrepareBeforeItem2: 'Antes item 2',
    testPrepareBeforeItem3: 'Antes item 3',
    testPrepareAvoidItem1: 'Evitar item 1',
    testPrepareAvoidItem2: 'Evitar item 2',
    testPrepareAvoidItem3: 'Evitar item 3',
    testPrepareBefore: 'Antes de llegar',
    testPrepareAvoid: 'Qué evitar',
    teacherQuoteTitle: 'Consejo del profesor',
    teacherQuoteText: 'La práctica hace al maestro',
  },
};

// ============================================================================
// i18next TEST CONFIGURATION
// ============================================================================

i18n.use(initReactI18next).init({
  // Use 'es' as default for tests (matches production and test expectations)
  lng: 'es',
  fallbackLng: 'es',
  supportedLngs: ['es', 'ca', 'en', 'fr'],

  // Namespace configuration matching production
  defaultNS: 'common',
  ns: [
    'common',
    'home',
    'pages',
    'booking',
    'schedule',
    'calendar',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
  ],

  // Fallback to search in all namespaces if key not found
  fallbackNS: [
    'home',
    'pages',
    'classes',
    'booking',
    'schedule',
    'calendar',
    'blog',
    'faq',
    'about',
    'contact',
  ],

  // Load resources synchronously (critical for tests)
  resources: {
    en: mockTranslations,
    es: mockTranslations, // Use same translations for all languages in tests
    ca: mockTranslations,
    fr: mockTranslations,
  },

  // React integration
  react: {
    useSuspense: false, // Disable suspense for synchronous tests
  },

  // Interpolation
  interpolation: {
    escapeValue: false, // React already escapes
  },

  // Testing-specific settings
  debug: false, // Set to true to debug i18n issues in tests
  initImmediate: false, // Load synchronously for tests

  // Return key as fallback (helps identify missing translations in tests)
  returnEmptyString: false,
  returnNull: false,
});

export default i18n;
