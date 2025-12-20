/**
 * Bachata Sensual Page Data Configuration
 * ========================================
 * Datos base para la página /clases/bachata-barcelona
 * Enfoque: Bachata Sensual como keyword principal
 * SEO: No canibalizar página legacy que posiciona para "bachata social" y "bachata fusion"
 */
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Bachata Sensual page (10 FAQs SEO-optimized)
// Estrategia: Mencionar bachata social/fusion en FAQs para mantener autoridad semántica
export const BACHATA_FAQS_CONFIG: FAQ[] = [
  {
    id: 'bachata-1',
    questionKey: 'bachataV3FaqQ1',
    answerKey: 'bachataV3FaqA1',
  },
  {
    id: 'bachata-2',
    questionKey: 'bachataV3FaqQ2',
    answerKey: 'bachataV3FaqA2',
  },
  {
    id: 'bachata-3',
    questionKey: 'bachataV3FaqQ3',
    answerKey: 'bachataV3FaqA3',
  },
  {
    id: 'bachata-4',
    questionKey: 'bachataV3FaqQ4',
    answerKey: 'bachataV3FaqA4',
  },
  {
    id: 'bachata-5',
    questionKey: 'bachataV3FaqQ5',
    answerKey: 'bachataV3FaqA5',
  },
  {
    id: 'bachata-6',
    questionKey: 'bachataV3FaqQ6',
    answerKey: 'bachataV3FaqA6',
  },
  {
    id: 'bachata-7',
    questionKey: 'bachataV3FaqQ7',
    answerKey: 'bachataV3FaqA7',
  },
  {
    id: 'bachata-8',
    questionKey: 'bachataV3FaqQ8',
    answerKey: 'bachataV3FaqA8',
  },
  {
    id: 'bachata-9',
    questionKey: 'bachataV3FaqQ9',
    answerKey: 'bachataV3FaqA9',
  },
  {
    id: 'bachata-10',
    questionKey: 'bachataV3FaqQ10',
    answerKey: 'bachataV3FaqA10',
  },
];

// Testimonials for Bachata Sensual page (4 testimonials for 4-column grid)
// Incluye testimonios técnicos (Océano Rojo) y emocionales (Océano Azul)
export const BACHATA_TESTIMONIALS: Testimonial[] = [
  // Testimonio de pareja - Océano Azul (conexión)
  {
    id: 1,
    name: 'Laura y Marc',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: "We started bachata to do something different together. Now it's our weekly ritual. The connection you feel when dancing sensual bachata is something you can't explain, you have to experience it.",
      es: 'Empezamos bachata para hacer algo diferente juntos. Ahora es nuestro ritual semanal. La conexión que sientes al bailar bachata sensual es algo que no se puede explicar, hay que vivirlo.',
      ca: 'Vam començar bachata per fer alguna cosa diferent junts. Ara és el nostre ritual setmanal. La connexió que sents quan balles bachata sensual és quelcom que no es pot explicar, cal viure-ho.',
      fr: "Nous avons commencé la bachata pour faire quelque chose de différent ensemble. Maintenant c'est notre rituel hebdomadaire. La connexion que tu ressens en dansant la bachata sensuelle est quelque chose qu'on ne peut pas expliquer, il faut le vivre.",
    },
  },
  // Testimonio técnico - Océano Rojo (mejora técnica)
  {
    id: 2,
    name: 'Pablo R.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Mathias and Eugenia are world champions and it shows. They teach you to lead with the body, not with force. In 6 months I went from not knowing how to dance to feeling comfortable at any party.',
      es: 'Mathias y Eugenia son campeones mundiales y se nota. Te enseñan a guiar con el cuerpo, no con fuerza. En 6 meses pasé de no saber bailar a sentirme cómodo en cualquier fiesta.',
      ca: "Mathias i Eugenia són campions mundials i es nota. T'ensenyen a guiar amb el cos, no amb força. En 6 mesos vaig passar de no saber ballar a sentir-me còmode a qualsevol festa.",
      fr: "Mathias et Eugenia sont champions du monde et ça se voit. Ils t'apprennent à guider avec le corps, pas avec la force. En 6 mois je suis passé de ne pas savoir danser à me sentir à l'aise à n'importe quelle fête.",
    },
  },
  // Testimonio emocional - Océano Azul (comunidad)
  {
    id: 3,
    name: 'Sandra M.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: "Carlos and Noemí have an incredible energy. Their beginners class is perfect to lose your fear. Now I go to socials every weekend and I've made friends for life.",
      es: 'Carlos y Noemí tienen una energía increíble. Su clase de principiantes es perfecta para perder el miedo. Ahora voy a sociales cada fin de semana y he hecho amigos para toda la vida.',
      ca: 'Carlos i Noemí tenen una energia increïble. La seva classe de principiants és perfecta per perdre la por. Ara vaig a socials cada cap de setmana i he fet amics per a tota la vida.',
      fr: 'Carlos et Noemí ont une énergie incroyable. Leur cours de débutants est parfait pour perdre la peur. Maintenant je vais aux socials chaque week-end et je me suis fait des amis pour la vie.',
    },
  },
  // Testimonio principiante - Nivel 0
  {
    id: 4,
    name: 'Adrián G.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: "I thought sensual bachata was only for experts. Wrong! They teach you from scratch with patience. In 3 months I was already doing waves and dips that I didn't think I could ever do.",
      es: 'Pensaba que la bachata sensual era solo para expertos. ¡Error! Te enseñan desde cero con paciencia. En 3 meses ya hacía ondas y dips que no pensaba que podría hacer jamás.',
      ca: "Pensava que la bachata sensual era només per a experts. Error! T'ensenyen des de zero amb paciència. En 3 mesos ja feia ones i dips que no pensava que podria fer mai.",
      fr: "Je pensais que la bachata sensuelle était seulement pour les experts. Faux ! Ils t'enseignent depuis zéro avec patience. En 3 mois je faisais déjà des vagues et des dips que je ne pensais jamais pouvoir faire.",
    },
  },
];

// Schedule data for Bachata Sensual classes - Horarios confirmados
export const BACHATA_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'thursday',
    className: 'Bachata Sensual Principiantes',
    time: '20:00 - 21:00',
    teacher: 'Carlos & Noemí',
    levelKey: 'beginnerLevel',
  },
  {
    id: '2',
    dayKey: 'monday',
    className: 'Bachata Sensual Básico',
    time: '22:00 - 23:00',
    teacher: 'Mathias & Eugenia',
    levelKey: 'basicLevel',
  },
  {
    id: '3',
    dayKey: 'tuesday',
    className: 'Bachata Sensual Intermedio',
    time: '20:00 - 21:00',
    teacher: 'Mathias & Eugenia',
    levelKey: 'intermediateLevel',
  },
  {
    id: '4',
    dayKey: 'friday',
    className: 'Bachata Sensual Intermedio',
    time: '19:00 - 20:00',
    teacher: 'Eugenia & Juan Álvarez',
    levelKey: 'intermediateLevel',
  },
  {
    id: '5',
    dayKey: 'tuesday',
    className: 'Bachata Sensual Avanzado',
    time: '21:30 - 22:30',
    teacher: 'Mathias & Eugenia',
    levelKey: 'advancedLevel',
  },
];

// Level descriptions for cards after schedule - Sistema progresivo (4 niveles)
export const BACHATA_LEVELS = [
  {
    id: 'principiantes',
    levelKey: 'beginnerLevel',
    titleKey: 'bachataV3LevelBeginnerTitle',
    descKey: 'bachataV3LevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'basico',
    levelKey: 'basicLevel',
    titleKey: 'bachataV3LevelBasicTitle',
    descKey: 'bachataV3LevelBasicDesc',
    duration: '3-6 meses',
    color: 'primary-dark-mid' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'bachataV3LevelIntermediateTitle',
    descKey: 'bachataV3LevelIntermediateDesc',
    duration: '6-18 meses',
    color: 'primary-accent-light' as const,
  },
  {
    id: 'avanzado',
    levelKey: 'advancedLevel',
    titleKey: 'bachataV3LevelAdvancedTitle',
    descKey: 'bachataV3LevelAdvancedDesc',
    duration: '+18 meses',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration
export const BACHATA_PREPARE_CONFIG = {
  prefix: 'bachataV3Prepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Mathias Font & Eugenia Trujillo',
    credential: 'Campeones Mundiales de Salsa LA',
    image: '/images/teachers/eugenia-trujillo_256.webp',
  },
};

// Nearby neighborhoods for local SEO
export const BACHATA_NEARBY_AREAS = [
  { name: 'Plaza España', time: '5 min andando' },
  { name: 'Hostafrancs', time: '5 min andando' },
  { name: 'Sants Estació', time: '10 min andando' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
];

// Course schema configuration (optimized for SEO with keywords)
export const BACHATA_COURSE_CONFIG = {
  teaches:
    'Bachata Sensual, ondulaciones, conexión en pareja, musicalidad, dips, waves, body movement, técnica de guía y seguimiento',
  prerequisites: 'Ninguno - clases para todos los niveles desde principiante absoluto',
  lessons: 'Clases semanales con progresión por niveles',
  duration: 'PT1H',
};

// Hero Stats configuration (for AnimatedCounter)
export const BACHATA_HERO_STATS = {
  minutes: 60, // Clases de 60 minutos
  calories: 350, // Calorías quemadas por clase
  funPercent: 100,
};

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const BACHATA_GEO_KEYS = {
  definicion: 'bachataV3CitableDefinicion', // Definición oficial bachata sensual
  origen: 'bachataV3CitableOrigen', // Origen República Dominicana
  sensualVsDominicana: 'bachataV3CitableSensualVsDominicana', // Diferencia estilos
  conexion: 'bachataV3CitableConexion', // Importancia conexión en pareja
  metodologia: 'bachataV3CitableMetodologia', // Metodología Farray's
  fact1: 'bachataV3CitableFact1', // Calorías: 300-400/hora
  fact2: 'bachataV3CitableFact2', // Campeones mundiales como profesores
  fact3: 'bachataV3CitableFact3', // Farray's DCC CID-UNESCO
};
