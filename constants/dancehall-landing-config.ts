/**
 * Dancehall Landing Page Configuration
 *
 * Landing optimizada para Facebook Ads - Captación de leads para clase de prueba VIP
 * Objetivo: Entrar en el funnel -> Reservar clase de prueba -> Conocernos en persona
 */

// Video de Vimeo para la landing (clase real)
export const DANCEHALL_LANDING_VIMEO_ID = '1000399455'; // TODO: Cambiar por video de Dancehall cuando esté disponible

// Value Stack - Lo que incluye la experiencia VIP
export const DANCEHALL_VALUE_STACK = [
  { key: 'dhLandingValueItem1', price: 20, priceKey: 'dhLandingValuePrice1' }, // Clase Dancehall (valor real)
  { key: 'dhLandingValueItem2', price: 0, priceKey: 'dhLandingValueIncluded' }, // Bienvenida VIP personalizada
  { key: 'dhLandingValueItem3', price: 0, priceKey: 'dhLandingValueIncluded' }, // Grupo reducido
  { key: 'dhLandingValueItem4', price: 0, priceKey: 'dhLandingValueIncluded' }, // Confirmación WhatsApp
  { key: 'dhLandingValueItem5', price: 0, priceKey: 'dhLandingValueIncluded' }, // Oferta exclusiva si te apuntas
];

// Por qué Farray's - Cards con título + descripción (reducido a 4 para mejor conversión)
export const DANCEHALL_WHY_FARRAYS = [
  { titleKey: 'dhLandingWhyTitle1', descKey: 'dhLandingWhyDesc1' }, // Academia CID UNESCO
  { titleKey: 'dhLandingWhyTitle2', descKey: 'dhLandingWhyDesc2' }, // Profesoras raíces jamaicanas
  { titleKey: 'dhLandingWhyTitle4', descKey: 'dhLandingWhyDesc4' }, // Ambiente familiar profesional
  { titleKey: 'dhLandingWhyTitle3', descKey: 'dhLandingWhyDesc3' }, // Ubicación inmejorable
];

// FAQs enfocadas en objeciones (solo 4 para no saturar)
export const DANCEHALL_OBJECTION_FAQS = [
  { id: 'dh-obj-1', questionKey: 'dhLandingObjQ1', answerKey: 'dhLandingObjA1' }, // Nunca he bailado
  { id: 'dh-obj-2', questionKey: 'dhLandingObjQ2', answerKey: 'dhLandingObjA2' }, // No estoy en forma
  { id: 'dh-obj-3', questionKey: 'dhLandingObjQ3', answerKey: 'dhLandingObjA3' }, // Qué debo llevar
  { id: 'dh-obj-4', questionKey: 'dhLandingObjQ4', answerKey: 'dhLandingObjA4' }, // Puedo ir solo/a
];

// Items de preparación (versión corta para landing)
export const DANCEHALL_PREPARE_ITEMS = [
  'dhLandingPrepare1', // Ropa cómoda
  'dhLandingPrepare2', // Zapatillas deportivas
  'dhLandingPrepare3', // Botella de agua
  'dhLandingPrepare4', // Muchas ganas de pasarlo bien
];

// Testimoniales (solo 3 para la landing)
export const DANCEHALL_TESTIMONIALS = [
  {
    id: 1,
    name: 'Marta C.',
    quote: 'dhLandingTestimonial1',
  },
  {
    id: 2,
    name: 'Laura S.',
    quote: 'dhLandingTestimonial2',
  },
  {
    id: 3,
    name: 'Paula G.',
    quote: 'dhLandingTestimonial3',
  },
];

// Horarios disponibles para la clase de prueba
export const DANCEHALL_LANDING_SCHEDULE = [
  {
    id: '1',
    dayKey: 'monday',
    time: '22:00 - 23:00',
    levelKey: 'beginnerLevel',
    className: 'Dancehall Female',
    teacher: 'Sandra',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    time: '12:00 - 13:00',
    levelKey: 'beginnerLevel',
    className: 'Dancehall Female',
    teacher: 'Isabel',
  },
  {
    id: '3',
    dayKey: 'wednesday',
    time: '21:00 - 22:00',
    levelKey: 'intermediateLevel',
    className: 'Dancehall Twerk',
    teacher: 'Isabel',
  },
  {
    id: '4',
    dayKey: 'thursday',
    time: '21:00 - 22:00',
    levelKey: 'beginnerLevel',
    className: 'Dancehall Female',
    teacher: 'Isabel',
  },
  {
    id: '5',
    dayKey: 'thursday',
    time: '22:00 - 23:00',
    levelKey: 'basicLevel',
    className: 'Dancehall Female',
    teacher: 'Sandra',
  },
  {
    id: '6',
    dayKey: 'friday',
    time: '18:00 - 19:00',
    levelKey: 'beginnerLevel',
    className: 'Dancehall Twerk',
    teacher: 'Isabel',
  },
];

// Colores del tema (Jamaica: verde, amarillo, negro)
export const DANCEHALL_LANDING_THEME = {
  primary: 'emerald', // Verde Jamaica
  accent: 'yellow', // Amarillo Jamaica
  gradient: 'from-emerald-900/40 via-black to-yellow-900/30',
} as const;
