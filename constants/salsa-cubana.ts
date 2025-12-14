import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Salsa Cubana page (15 FAQs for comprehensive SEO)
export const SALSA_CUBANA_FAQS_CONFIG: FAQ[] = [
  {
    id: 'salsa-cubana-1',
    questionKey: 'salsaCubanaFaqQ1',
    answerKey: 'salsaCubanaFaqA1',
  },
  {
    id: 'salsa-cubana-2',
    questionKey: 'salsaCubanaFaqQ2',
    answerKey: 'salsaCubanaFaqA2',
  },
  {
    id: 'salsa-cubana-3',
    questionKey: 'salsaCubanaFaqQ3',
    answerKey: 'salsaCubanaFaqA3',
  },
  {
    id: 'salsa-cubana-4',
    questionKey: 'salsaCubanaFaqQ4',
    answerKey: 'salsaCubanaFaqA4',
  },
  {
    id: 'salsa-cubana-5',
    questionKey: 'salsaCubanaFaqQ5',
    answerKey: 'salsaCubanaFaqA5',
  },
  {
    id: 'salsa-cubana-6',
    questionKey: 'salsaCubanaFaqQ6',
    answerKey: 'salsaCubanaFaqA6',
  },
  {
    id: 'salsa-cubana-7',
    questionKey: 'salsaCubanaFaqQ7',
    answerKey: 'salsaCubanaFaqA7',
  },
  {
    id: 'salsa-cubana-8',
    questionKey: 'salsaCubanaFaqQ8',
    answerKey: 'salsaCubanaFaqA8',
  },
  {
    id: 'salsa-cubana-9',
    questionKey: 'salsaCubanaFaqQ9',
    answerKey: 'salsaCubanaFaqA9',
  },
  {
    id: 'salsa-cubana-10',
    questionKey: 'salsaCubanaFaqQ10',
    answerKey: 'salsaCubanaFaqA10',
  },
  {
    id: 'salsa-cubana-11',
    questionKey: 'salsaCubanaFaqQ11',
    answerKey: 'salsaCubanaFaqA11',
  },
  {
    id: 'salsa-cubana-12',
    questionKey: 'salsaCubanaFaqQ12',
    answerKey: 'salsaCubanaFaqA12',
  },
  {
    id: 'salsa-cubana-13',
    questionKey: 'salsaCubanaFaqQ13',
    answerKey: 'salsaCubanaFaqA13',
  },
  {
    id: 'salsa-cubana-14',
    questionKey: 'salsaCubanaFaqQ14',
    answerKey: 'salsaCubanaFaqA14',
  },
  {
    id: 'salsa-cubana-15',
    questionKey: 'salsaCubanaFaqQ15',
    answerKey: 'salsaCubanaFaqA15',
  },
];

// Testimonials for Salsa Cubana page (extends Google reviews with specific testimonials)
// Incluye testimonios técnicos (Océano Rojo) y emocionales (Océano Azul)
export const SALSA_CUBANA_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  // Testimonio técnico - Océano Rojo
  {
    id: 4,
    name: 'Carlos M.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'The Farray Method transformed my dancing completely. Now I lead with confidence and dance on time. After years stuck in other schools, here I finally understood what Cuban salsa really is.',
      es: 'El Método Farray transformó mi baile por completo. Ahora guío con confianza y bailo a tiempo. Después de años estancado en otras escuelas, aquí por fin entendí lo que es la salsa cubana de verdad.',
      ca: "El Mètode Farray va transformar el meu ball completament. Ara guio amb confiança i ballo a temps. Després d'anys estancat en altres escoles, aquí per fi vaig entendre què és la salsa cubana de veritat.",
      fr: "La Méthode Farray a complètement transformé ma danse. Maintenant je guide avec confiance et je danse en rythme. Après des années de stagnation dans d'autres écoles, j'ai enfin compris ce qu'est vraiment la salsa cubaine.",
    },
  },
  // Testimonios emocionales - Océano Azul
  {
    id: 5,
    name: 'Laura T.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: "I came looking for an activity to disconnect from work. I'm taking home friends, confidence and a new passion. It's the best thing I've done for myself in years.",
      es: 'Vine buscando una actividad para desconectar del trabajo. Me llevo amigos, confianza y una pasión nueva. Es lo mejor que he hecho por mí en años.',
      ca: "Vaig venir buscant una activitat per desconnectar de la feina. M'emporto amics, confiança i una passió nova. És el millor que he fet per mi en anys.",
      fr: "Je suis venue chercher une activité pour déconnecter du travail. J'emporte des amis, de la confiance et une nouvelle passion. C'est la meilleure chose que j'ai faite pour moi depuis des années.",
    },
  },
  {
    id: 6,
    name: 'David y Maria',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: "We'd spent years not doing anything together except watching TV series. Salsa brought back the laughter and the eye contact. Thank you Farray's.",
      es: "Llevábamos años sin hacer nada juntos que no fuera ver series. La salsa nos devolvió las risas y las miradas. Gracias Farray's.",
      ca: "Portàvem anys sense fer res junts que no fos veure sèries. La salsa ens va tornar els riures i les mirades. Gràcies Farray's.",
      fr: "Nous passions des années sans rien faire ensemble à part regarder des séries. La salsa nous a redonné les rires et les regards. Merci Farray's.",
    },
  },
  {
    id: 7,
    name: 'Jordi P.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'I always said I had two left feet. In 3 months I was dancing at my first party. Level 0 is pure magic.',
      es: 'Siempre dije que tenía dos pies izquierdos. En 3 meses estaba bailando en mi primera fiesta. El Nivel 0 es magia pura.',
      ca: 'Sempre vaig dir que tenia dos peus esquerres. En 3 mesos estava ballant a la meva primera festa. El Nivell 0 és màgia pura.',
      fr: "J'ai toujours dit que j'avais deux pieds gauches. En 3 mois, je dansais à ma première fête. Le Niveau 0, c'est de la magie pure.",
    },
  },
  {
    id: 8,
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
      en: "I met my current partner here. But even if that hadn't happened, it would have been worth it just for what I learned and the people I met.",
      es: 'Conocí a mi actual pareja aquí. Pero aunque no hubiera pasado eso, habría valido la pena solo por lo que aprendí y la gente que conocí.',
      ca: 'Vaig conèixer la meva parella actual aquí. Però encara que no hagués passat això, hauria valgut la pena només pel que vaig aprendre i la gent que vaig conèixer.',
      fr: "J'ai rencontré mon partenaire actuel ici. Mais même si cela n'était pas arrivé, ça aurait valu la peine rien que pour ce que j'ai appris et les gens que j'ai rencontrés.",
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const SALSA_CUBANA_COURSE_CONFIG = {
  teaches:
    'Salsa Cubana, Casino, Rueda de Casino, guía y seguimiento, técnica de pareja, musicalidad cubana, Método Farray',
  prerequisites: 'Ninguno - clases para todos los niveles desde principiante absoluto',
  lessons: 'Clases semanales con progresión por niveles',
  duration: 'PT1H',
};

// Schedule data for Salsa Cubana classes - Sistema de niveles progresivo
export const SALSA_CUBANA_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Salsa Cubana Nivel 0',
    time: '20:00 - 21:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'level0',
  },
  {
    id: '2',
    dayKey: 'tuesday',
    className: 'Salsa Cubana Básico I',
    time: '20:00 - 21:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'basicLevel1',
  },
  {
    id: '3',
    dayKey: 'wednesday',
    className: 'Salsa Cubana Básico II-III',
    time: '20:00 - 21:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'basicLevel2_3',
  },
  {
    id: '4',
    dayKey: 'thursday',
    className: 'Salsa Cubana Intermedio',
    time: '20:00 - 21:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'intermediateLevel',
  },
  {
    id: '5',
    dayKey: 'friday',
    className: 'Salsa Cubana Avanzado',
    time: '20:00 - 21:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'advancedLevel',
  },
];

// Level descriptions for cards after schedule - Sistema progresivo Método Farray (simplified to 4 levels)
export const SALSA_CUBANA_LEVELS = [
  {
    id: 'nivel-0',
    levelKey: 'beginnerLevel',
    titleKey: 'salsaCubanaLevel0Title',
    descKey: 'salsaCubanaLevel0Desc',
    duration: '0-2 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'basico',
    levelKey: 'basicLevel',
    titleKey: 'salsaCubanaLevelBasicTitle',
    descKey: 'salsaCubanaLevelBasicDesc',
    duration: '2-12 meses',
    color: 'primary-dark-mid' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'salsaCubanaLevelIntermediateTitle',
    descKey: 'salsaCubanaLevelIntermediateDesc',
    duration: '12-24 meses',
    color: 'primary-accent-light' as const,
  },
  {
    id: 'avanzado',
    levelKey: 'advancedLevel',
    titleKey: 'salsaCubanaLevelAdvancedTitle',
    descKey: 'salsaCubanaLevelAdvancedDesc',
    duration: '+24 meses',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration
export const SALSA_CUBANA_PREPARE_CONFIG = {
  prefix: 'salsaCubanaPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Yunaisy Farray',
    credential: "Directora de Farray's Center",
    image: '/images/teachers/img/yunaisy-farray-directora_320.webp',
  },
};

// Nearby neighborhoods for local SEO
export const SALSA_CUBANA_NEARBY_AREAS = [
  { name: 'Plaza Espana', time: '5 min andando' },
  { name: 'Hostafrancs', time: '5 min andando' },
  { name: 'Sants Estacio', time: '10 min andando' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
];

// Breadcrumb custom keys for Salsa Cubana (4 levels: Home > Classes > Latin > Current)
export const SALSA_CUBANA_BREADCRUMB_KEYS = {
  home: 'salsaCubanaBreadcrumbHome',
  classes: 'salsaCubanaBreadcrumbClasses',
  latin: 'salsaCubanaBreadcrumbLatin',
  current: 'salsaCubanaBreadcrumbCurrent',
};

// YouTube video ID for the page
export const SALSA_CUBANA_VIDEO_ID = 'YOUR_YOUTUBE_VIDEO_ID'; // TODO: Añadir ID real del video

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const SALSA_CUBANA_GEO_KEYS = {
  definicion: 'salsaCubanaCitableDefinicion', // Definición oficial salsa cubana/casino
  origin: 'salsaCubanaCitableOrigen', // Origen histórico Cuba años 50
  metodoFarray: 'salsaCubanaCitableMetodoFarray', // Metodología única Farray
  guiaYSeguimiento: 'salsaCubanaCitableGuiaSeguimiento', // Técnica guía/seguimiento
  musicalidad: 'salsaCubanaCitableMusicalidad', // Importancia del ritmo y tiempo
  statistics: 'salsaCubanaStatistics', // Estadísticas DCC
  globalEvolution: 'salsaCubanaCitableEvolucionGlobal', // Expansión mundial
  ruedaDeCasino: 'salsaCubanaCitableRueda', // Rueda de Casino explicación
  fact1: 'salsaCubanaCitableFact1', // Calorías: 300-500/hora
  fact2: 'salsaCubanaCitableFact2', // Método Farray único en el mundo
  fact3: 'salsaCubanaCitableFact3', // Farray's DCC CID-UNESCO
  legado: 'salsaCubanaCitableLegado', // Legado cubano auténtico
};

// Hero Stats configuration (for AnimatedCounter)
export const SALSA_CUBANA_HERO_STATS = {
  minutes: 60, // Clases de 60 minutos
  calories: 400, // Calorías quemadas por clase
  funPercent: 100,
};

// What makes Método Farray unique - 6 pillars
export const SALSA_CUBANA_METODO_PILLARS = [
  {
    id: 1,
    titleKey: 'salsaCubanaMetodoPillar1Title',
    descKey: 'salsaCubanaMetodoPillar1Desc',
    icon: 'guide', // Guía perfecta
  },
  {
    id: 2,
    titleKey: 'salsaCubanaMetodoPillar2Title',
    descKey: 'salsaCubanaMetodoPillar2Desc',
    icon: 'follow', // Seguimiento técnico
  },
  {
    id: 3,
    titleKey: 'salsaCubanaMetodoPillar3Title',
    descKey: 'salsaCubanaMetodoPillar3Desc',
    icon: 'music', // Musicalidad
  },
  {
    id: 4,
    titleKey: 'salsaCubanaMetodoPillar4Title',
    descKey: 'salsaCubanaMetodoPillar4Desc',
    icon: 'connection', // Conexión pareja
  },
  {
    id: 5,
    titleKey: 'salsaCubanaMetodoPillar5Title',
    descKey: 'salsaCubanaMetodoPillar5Desc',
    icon: 'technique', // Técnica corporal
  },
  {
    id: 6,
    titleKey: 'salsaCubanaMetodoPillar6Title',
    descKey: 'salsaCubanaMetodoPillar6Desc',
    icon: 'culture', // Cultura cubana
  },
];
