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

    // PAS (Problem-Agitation-Solution) Section
    pas_title: '¿Te Suena Familiar?',
    pas_subtitle: 'Si alguna de estas frases resuena contigo, no estás solo.',
    pas_problem1: 'Llevas años queriendo aprender a bailar pero nunca das el paso.',
    pas_problem2: 'Probaste otras escuelas y te sentiste un número más, sin atención real.',
    pas_problem3: 'Los horarios nunca cuadran con tu vida y acabas dejándolo.',
    pas_problem4: 'Sientes que "no tienes ritmo" o que "ya es muy tarde" para empezar.',
    pas_agitation1: 'Cada día que pasa es un día menos para disfrutar bailando.',
    pas_agitation2: 'Y la verdad es que el problema nunca fuiste tú...',
    pas_solution1: 'El problema era no encontrar EL MÉTODO correcto.',
    pas_solution2: "En Farray's, hemos creado algo diferente.",
    pas_cta: 'Descubre el Método Farray®',

    // Offer Section
    offer_badge: 'Oferta Especial',
    offer_title: 'Puertas Abiertas',
    offer_subtitle: 'Tu oportunidad de probar sin compromiso',
    offer_benefit1: '1 Clase de Bienvenida',
    offer_value1: 'valor 20€',
    offer_benefit2: 'Tour por las instalaciones de 700m²',
    offer_value2: 'valor 15€',
    offer_benefit3: 'Asesoría personalizada de nivel',
    offer_value3: 'valor 25€',
    offer_benefit4: 'Acceso al grupo de WhatsApp de la comunidad',
    offer_value4: 'exclusivo',
    offer_benefit5: '10% descuento si te matriculas hoy',
    offer_value5: 'oferta limitada',
    offer_urgency: 'Plazas limitadas: Quedan {spots} plazas esta semana',
    offer_cta: 'Reservar Mi Plaza',
    offer_trust1: 'Sin compromiso',
    offer_trust2: 'Cancelación gratuita',

    // Video Testimonials
    videotestimonials_title: 'Ellos Tampoco Creían Que Podían Bailar',
    videotestimonials_subtitle: 'Personas reales. Transformaciones reales. Sin filtros.',
    videotestimonials_reviews: 'opiniones',
    testimonial1_name: 'María García',
    testimonial1_role: 'Oficinista, 34 años',
    testimonial1_quote:
      'Pensaba que no tenía ritmo. Después de 3 meses, estoy preparando mi primera coreografía para un showcase. El método funciona.',
    testimonial2_name: 'Carlos Rodríguez',
    testimonial2_role: '+50 años, jubilado',
    testimonial2_quote:
      'A mi edad pensé que era imposible. Aquí me demostraron que el límite estaba solo en mi cabeza. Ahora bailo salsa mejor que muchos jóvenes.',
    testimonial3_name: 'Anna Kowalski',
    testimonial3_role: 'Diseñadora, 28 años',
    testimonial3_quote:
      'Probé 3 academias antes. Ninguna me hizo sentir tan bienvenida ni me enseñó tan bien. La diferencia es brutal.',

    // Instructors
    instructor1_name: 'Yunaisy Farray',
    instructor1_role: 'Fundadora & Directora Artística',
    instructor1_bio:
      '+25 años de experiencia internacional. Formada en la Escuela Nacional de Arte de Cuba. Ha trabajado con artistas como Madonna y participado en Street Dance 2.',
    instructor1_quote: 'Mi misión es que cada alumno descubra el bailarín que lleva dentro.',
    instructor2_name: 'Joni Pila',
    instructor2_role: 'Director de Danzas Urbanas',
    instructor2_bio:
      'Especialista en Hip Hop, Dancehall y Afrobeat. Coreógrafo de videoclips y eventos internacionales.',
    instructor2_quote: 'El baile urbano no es solo técnica, es actitud y expresión.',
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

    // Salsa Cubana Prepare Section
    salsaCubanaPrepareTitle: 'Prepara tu Primera Clase',
    salsaCubanaPrepareSubtitle: 'Todo lo que necesitas saber para tu primera experiencia',
    salsaCubanaPrepareWhatToBring: 'Qué traer',
    salsaCubanaPrepareItem1: 'Ropa cómoda y ligera',
    salsaCubanaPrepareItem2: 'Bambas o zapatos cómodos',
    salsaCubanaPrepareItem3: 'Para chicas: zapatos de tacón con sujeción en el tobillo (opcional)',
    salsaCubanaPrepareItem4: 'Cambio de ropa y toalla si quieres ducharte',
    salsaCubanaPrepareBefore: 'Antes de llegar',
    salsaCubanaPrepareBeforeItem1: 'Llega 10 minutos antes para registrarte',
    salsaCubanaPrepareBeforeItem2: 'Ven con la mente abierta a aprender',
    salsaCubanaPrepareBeforeItem3: 'No necesitas traer pareja',
    salsaCubanaPrepareAvoid: 'Evita:',
    salsaCubanaPrepareAvoidItem1: 'Joyas que puedan engancharse durante el baile en pareja',
    salsaCubanaPrepareAvoidItem2: 'Perfumes muy fuertes (estarás cerca de tu pareja)',
    salsaCubanaPrepareAvoidItem3: 'Miedo a equivocarte - aquí todos aprendemos juntos',
    salsaCubanaPrepareNote: 'Nota importante',
    salsaCubanaPrepareNoteDesc:
      'No te preocupes si nunca has bailado. El Nivel 0 está diseñado específicamente para principiantes absolutos. Rotamos las parejas durante la clase para que todos practiquen.',
    salsaCubanaPrepareTeacherTip: 'Consejo de Yunaisy:',
    salsaCubanaPrepareTeacherQuote:
      'La salsa cubana es diversión pura. Ven con ganas de pasártelo bien y de contagiarte del espíritu cubano. El resto viene solo.',
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
