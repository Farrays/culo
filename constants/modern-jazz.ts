import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Modern Jazz page (17 FAQs for comprehensive SEO)
// Q16 (benefits) and Q17 (how it works) are placed first as most important
export const MODERN_JAZZ_FAQS_CONFIG: FAQ[] = [
  { id: 'modern-jazz-16', questionKey: 'modernjazzFaqQ16', answerKey: 'modernjazzFaqA16' },
  { id: 'modern-jazz-17', questionKey: 'modernjazzFaqQ17', answerKey: 'modernjazzFaqA17' },
  { id: 'modern-jazz-1', questionKey: 'modernjazzFaqQ1', answerKey: 'modernjazzFaqA1' },
  { id: 'modern-jazz-2', questionKey: 'modernjazzFaqQ2', answerKey: 'modernjazzFaqA2' },
  { id: 'modern-jazz-3', questionKey: 'modernjazzFaqQ3', answerKey: 'modernjazzFaqA3' },
  { id: 'modern-jazz-4', questionKey: 'modernjazzFaqQ4', answerKey: 'modernjazzFaqA4' },
  { id: 'modern-jazz-5', questionKey: 'modernjazzFaqQ5', answerKey: 'modernjazzFaqA5' },
  { id: 'modern-jazz-6', questionKey: 'modernjazzFaqQ6', answerKey: 'modernjazzFaqA6' },
  { id: 'modern-jazz-7', questionKey: 'modernjazzFaqQ7', answerKey: 'modernjazzFaqA7' },
  { id: 'modern-jazz-8', questionKey: 'modernjazzFaqQ8', answerKey: 'modernjazzFaqA8' },
  { id: 'modern-jazz-9', questionKey: 'modernjazzFaqQ9', answerKey: 'modernjazzFaqA9' },
  { id: 'modern-jazz-10', questionKey: 'modernjazzFaqQ10', answerKey: 'modernjazzFaqA10' },
  { id: 'modern-jazz-11', questionKey: 'modernjazzFaqQ11', answerKey: 'modernjazzFaqA11' },
  { id: 'modern-jazz-12', questionKey: 'modernjazzFaqQ12', answerKey: 'modernjazzFaqA12' },
  { id: 'modern-jazz-13', questionKey: 'modernjazzFaqQ13', answerKey: 'modernjazzFaqA13' },
  { id: 'modern-jazz-14', questionKey: 'modernjazzFaqQ14', answerKey: 'modernjazzFaqA14' },
  { id: 'modern-jazz-15', questionKey: 'modernjazzFaqQ15', answerKey: 'modernjazzFaqA15' },
];

// Testimonials for Modern Jazz page (extends Google reviews with specific testimonials)
export const MODERN_JAZZ_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Carmen R.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Modern Jazz classes with Alejandro have taken my technique to another level. His way of teaching combines discipline with passion, and you leave each class feeling like a better dancer.',
      es: 'Las clases de Modern Jazz con Alejandro han llevado mi técnica a otro nivel. Su forma de enseñar combina disciplina con pasión, y sales de cada clase sintiendo que eres mejor bailarín.',
      ca: "Les classes de Modern Jazz amb Alejandro han portat la meva tècnica a un altre nivell. La seva manera d'ensenyar combina disciplina amb passió, i surts de cada classe sentint que ets millor ballarí.",
      fr: "Les cours de Modern Jazz avec Alejandro ont amené ma technique à un autre niveau. Sa façon d'enseigner combine discipline et passion, et tu sors de chaque cours en te sentant meilleur danseur.",
    },
  },
  {
    id: 5,
    name: 'Laura M.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'I came without any dance experience and Alejandro made me feel comfortable from day one. The technique you learn is incredible, and the atmosphere in class is super motivating.',
      es: 'Vine sin ninguna experiencia en danza y Alejandro me hizo sentir cómoda desde el primer día. La técnica que aprendes es increíble, y el ambiente en clase es súper motivador.',
      ca: "Vaig venir sense cap experiència en dansa i Alejandro em va fer sentir còmoda des del primer dia. La tècnica que aprens és increïble, i l'ambient a classe és súper motivador.",
      fr: "Je suis venue sans aucune expérience en danse et Alejandro m'a fait me sentir à l'aise dès le premier jour. La technique qu'on apprend est incroyable, et l'ambiance en cours est super motivante.",
    },
  },
  {
    id: 6,
    name: 'David P.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'The best decision I made was signing up for Modern Jazz. The mix of ballet technique with modern music makes every class exciting. Alejandro is an excellent teacher.',
      es: 'La mejor decisión que tomé fue apuntarme a Modern Jazz. La mezcla de técnica de ballet con música actual hace que cada clase sea emocionante. Alejandro es un profesor excelente.',
      ca: 'La millor decisió que vaig prendre va ser apuntar-me a Modern Jazz. La barreja de tècnica de ballet amb música actual fa que cada classe sigui emocionant. Alejandro és un professor excel·lent.',
      fr: "La meilleure décision que j'ai prise a été de m'inscrire au Modern Jazz. Le mélange de technique de ballet avec de la musique actuelle rend chaque cours passionnant. Alejandro est un excellent professeur.",
    },
  },
  {
    id: 7,
    name: 'Marta S.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'After years of hip-hop, I wanted to learn something more technical. Modern Jazz at Farrays has given me the discipline and elegance I was looking for. The facilities are also top-notch.',
      es: 'Después de años de hip-hop, quería aprender algo más técnico. El Modern Jazz en Farrays me ha dado la disciplina y la elegancia que buscaba. Las instalaciones también son de primera.',
      ca: "Després d'anys de hip-hop, volia aprendre alguna cosa més tècnica. El Modern Jazz a Farrays m'ha donat la disciplina i l'elegància que buscava. Les instal·lacions també són de primera.",
      fr: "Après des années de hip-hop, je voulais apprendre quelque chose de plus technique. Le Modern Jazz chez Farrays m'a donné la discipline et l'élégance que je cherchais. Les installations sont également de premier ordre.",
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const MODERN_JAZZ_COURSE_CONFIG = {
  teaches:
    'Modern Jazz, técnica de danza, musicalidad, expresión corporal, giros, saltos, flexibilidad, Broadway',
  prerequisites: 'Ninguno',
  lessons: '1 clase semanal',
  duration: 'PT1H',
};

// Schedule data for Modern Jazz classes
export const MODERN_JAZZ_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'tuesday',
    className: 'Modern Jazz',
    time: '18:00 - 19:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicLevel',
  },
];

// Breadcrumb custom keys for Modern Jazz (4 levels: Home > Classes > Dance > Current)
export const MODERN_JAZZ_BREADCRUMB_KEYS = {
  home: 'modernjazzBreadcrumbHome',
  classes: 'modernjazzBreadcrumbClasses',
  dance: 'modernjazzBreadcrumbDance',
  current: 'modernjazzBreadcrumbCurrent',
};

// YouTube video ID for the page
export const MODERN_JAZZ_VIDEO_ID = '-O59_XWMt2Q';
