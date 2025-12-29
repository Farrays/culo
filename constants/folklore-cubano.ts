import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Folklore Cubano page
export const FOLKLORE_CUBANO_FAQS_CONFIG: FAQ[] = [
  { id: 'folklore-1', questionKey: 'folkloreFaqQ1', answerKey: 'folkloreFaqA1' },
  { id: 'folklore-2', questionKey: 'folkloreFaqQ2', answerKey: 'folkloreFaqA2' },
  { id: 'folklore-3', questionKey: 'folkloreFaqQ3', answerKey: 'folkloreFaqA3' },
  { id: 'folklore-4', questionKey: 'folkloreFaqQ4', answerKey: 'folkloreFaqA4' },
  { id: 'folklore-5', questionKey: 'folkloreFaqQ5', answerKey: 'folkloreFaqA5' },
  { id: 'folklore-6', questionKey: 'folkloreFaqQ6', answerKey: 'folkloreFaqA6' },
  { id: 'folklore-7', questionKey: 'folkloreFaqQ7', answerKey: 'folkloreFaqA7' },
  { id: 'folklore-8', questionKey: 'folkloreFaqQ8', answerKey: 'folkloreFaqA8' },
  { id: 'folklore-9', questionKey: 'folkloreFaqQ9', answerKey: 'folkloreFaqA9' },
  { id: 'folklore-10', questionKey: 'folkloreFaqQ10', answerKey: 'folkloreFaqA10' },
  // SEO FAQs for Afro Cubano, Afro Barcelona, Danzas Africanas keywords
  { id: 'folklore-11', questionKey: 'folkloreFaqQ11', answerKey: 'folkloreFaqA11' },
  { id: 'folklore-12', questionKey: 'folkloreFaqQ12', answerKey: 'folkloreFaqA12' },
  { id: 'folklore-13', questionKey: 'folkloreFaqQ13', answerKey: 'folkloreFaqA13' },
  { id: 'folklore-14', questionKey: 'folkloreFaqQ14', answerKey: 'folkloreFaqA14' },
];

// Testimonials for Folklore Cubano page - only 3 specific testimonials
export const FOLKLORE_CUBANO_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Carmen Rodríguez',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'The folklore classes are incredible. Grechén teaches you not just the steps, but the history and soul of each Orisha dance. A true master.',
      es: 'Las clases de folklore son increíbles. Grechén te enseña no solo los pasos, sino la historia y el alma de cada danza a los Orishas. Una verdadera maestra.',
      ca: "Les classes de folklore són increïbles. Grechén t'ensenya no només els passos, sinó la història i l'ànima de cada dansa als Orishas. Una veritable mestra.",
      fr: "Les cours de folklore sont incroyables. Grechén vous enseigne non seulement les pas, mais aussi l'histoire et l'âme de chaque danse aux Orishas. Une vraie maître.",
    },
  },
  {
    id: 2,
    name: 'María Elena Torres',
    image: '',
    rating: 5,
    city: {
      en: 'Madrid, Spain',
      es: 'Madrid, España',
      ca: 'Madrid, Espanya',
      fr: 'Madrid, Espagne',
    },
    quote: {
      en: 'After trying several academies, I found here the authenticity I was looking for. The connection with the African roots and Orishas is genuine.',
      es: 'Después de probar varias academias, aquí encontré la autenticidad que buscaba. La conexión con las raíces africanas y los Orishas es genuina.',
      ca: "Després de provar diverses acadèmies, aquí vaig trobar l'autenticitat que buscava. La connexió amb les arrels africanes i els Orishas és genuïna.",
      fr: "Après avoir essayé plusieurs académies, j'ai trouvé ici l'authenticité que je cherchais. La connexion avec les racines africaines et les Orishas est authentique.",
    },
  },
  {
    id: 3,
    name: 'Lucía Fernández',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'As a dancer, this class has transformed my understanding of Cuban music. Now I feel the rhythms in a completely different way.',
      es: 'Como bailarina, esta clase ha transformado mi comprensión de la música cubana. Ahora siento los ritmos de una forma completamente diferente.',
      ca: "Com a ballarina, aquesta classe ha transformat la meva comprensió de la música cubana. Ara sento els ritmes d'una manera completament diferent.",
      fr: "En tant que danseuse, ce cours a transformé ma compréhension de la musique cubaine. Maintenant je ressens les rythmes d'une façon complètement différente.",
    },
  },
];

// Schedule data for Folklore Cubano classes - Only Tuesday at 20:30h
export const FOLKLORE_CUBANO_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'tuesday',
    className: 'Folklore Cubano Open Level',
    time: '20:30 - 21:30',
    teacher: 'Grechén Méndez',
    levelKey: 'openLevel',
  },
];

// Level descriptions for cards - Only open level for Folklore Cubano
export const FOLKLORE_CUBANO_LEVELS = [
  {
    id: 'abierto',
    levelKey: 'allLevelsLevel',
    titleKey: 'folkloreLevelOpenTitle',
    descKey: 'folkloreLevelOpenDesc',
    duration: 'Todos los niveles',
    color: 'amber' as const,
  },
];

import { getTeacherQuoteInfo } from './teacher-images';

// Prepare class configuration
export const FOLKLORE_CUBANO_PREPARE_CONFIG = {
  prefix: 'folklorePrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: getTeacherQuoteInfo(
    'grechen-mendez',
    'Maestra Internacional de Danzas Afrocubanas | ISA Cuba'
  ),
};
