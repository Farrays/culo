import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Ballet page (17 FAQs for comprehensive SEO)
// Q16 (benefits) and Q17 (how it works) are placed first as most important
export const BALLET_FAQS_CONFIG: FAQ[] = [
  { id: 'ballet-16', questionKey: 'balletFaqQ16', answerKey: 'balletFaqA16' },
  { id: 'ballet-17', questionKey: 'balletFaqQ17', answerKey: 'balletFaqA17' },
  { id: 'ballet-1', questionKey: 'balletFaqQ1', answerKey: 'balletFaqA1' },
  { id: 'ballet-2', questionKey: 'balletFaqQ2', answerKey: 'balletFaqA2' },
  { id: 'ballet-3', questionKey: 'balletFaqQ3', answerKey: 'balletFaqA3' },
  { id: 'ballet-4', questionKey: 'balletFaqQ4', answerKey: 'balletFaqA4' },
  { id: 'ballet-5', questionKey: 'balletFaqQ5', answerKey: 'balletFaqA5' },
  { id: 'ballet-6', questionKey: 'balletFaqQ6', answerKey: 'balletFaqA6' },
  { id: 'ballet-7', questionKey: 'balletFaqQ7', answerKey: 'balletFaqA7' },
  { id: 'ballet-8', questionKey: 'balletFaqQ8', answerKey: 'balletFaqA8' },
  { id: 'ballet-9', questionKey: 'balletFaqQ9', answerKey: 'balletFaqA9' },
  { id: 'ballet-10', questionKey: 'balletFaqQ10', answerKey: 'balletFaqA10' },
  { id: 'ballet-11', questionKey: 'balletFaqQ11', answerKey: 'balletFaqA11' },
  { id: 'ballet-12', questionKey: 'balletFaqQ12', answerKey: 'balletFaqA12' },
  { id: 'ballet-13', questionKey: 'balletFaqQ13', answerKey: 'balletFaqA13' },
  { id: 'ballet-14', questionKey: 'balletFaqQ14', answerKey: 'balletFaqA14' },
  { id: 'ballet-15', questionKey: 'balletFaqQ15', answerKey: 'balletFaqA15' },
  { id: 'ballet-18', questionKey: 'balletFaqQ18', answerKey: 'balletFaqA18' },
];

// Testimonials for Ballet page (extends Google reviews with specific testimonials)
export const BALLET_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Elena M.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'I started ballet at 35 thinking it was too late. After 6 months with Daniel and Alejandro, my posture has completely transformed. The discipline of ballet has improved every aspect of my life.',
      es: 'Empecé ballet a los 35 pensando que era demasiado tarde. Después de 6 meses con Daniel y Alejandro, mi postura se ha transformado por completo. La disciplina del ballet ha mejorado cada aspecto de mi vida.',
      ca: "Vaig començar ballet als 35 pensant que era massa tard. Després de 6 mesos amb Daniel i Alejandro, la meva postura s'ha transformat completament. La disciplina del ballet ha millorat cada aspecte de la meva vida.",
      fr: "J'ai commencé le ballet à 35 ans en pensant qu'il était trop tard. Après 6 mois avec Daniel et Alejandro, ma posture s'est complètement transformée. La discipline du ballet a amélioré chaque aspect de ma vie.",
    },
  },
  {
    id: 5,
    name: 'Patricia L.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: "The quality of instruction at Farray's is exceptional. As a former dancer returning after years, I found the perfect balance between technical rigor and supportive environment.",
      es: "La calidad de la enseñanza en Farray's es excepcional. Como ex bailarina que vuelve después de años, encontré el equilibrio perfecto entre rigor técnico y un ambiente de apoyo.",
      ca: "La qualitat de l'ensenyament a Farray's és excepcional. Com a ex ballarina que torna després d'anys, vaig trobar l'equilibri perfecte entre rigor tècnic i un ambient de suport.",
      fr: "La qualité de l'enseignement chez Farray's est exceptionnelle. En tant qu'ancienne danseuse qui revient après des années, j'ai trouvé l'équilibre parfait entre rigueur technique et environnement bienveillant.",
    },
  },
  {
    id: 6,
    name: 'Marcos T.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'As a man taking ballet, I was nervous at first. The teachers made me feel completely welcome and the technical training has improved my dancing in every other style I practice.',
      es: 'Como hombre haciendo ballet, estaba nervioso al principio. Los profesores me hicieron sentir completamente bienvenido y el entrenamiento técnico ha mejorado mi baile en todos los demás estilos que practico.',
      ca: "Com a home fent ballet, estava nerviós al principi. Els professors em van fer sentir completament benvingut i l'entrenament tècnic ha millorat el meu ball en tots els altres estils que practico.",
      fr: "En tant qu'homme faisant du ballet, j'étais nerveux au début. Les professeurs m'ont fait me sentir complètement bienvenu et l'entraînement technique a amélioré ma danse dans tous les autres styles que je pratique.",
    },
  },
  {
    id: 7,
    name: 'Ana B.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: "The CID-UNESCO certification shows in the quality. My flexibility and coordination have improved dramatically. Ballet at Farray's is the foundation every dancer needs.",
      es: "La certificación CID-UNESCO se nota en la calidad. Mi flexibilidad y coordinación han mejorado drásticamente. El ballet en Farray's es la base que todo bailarín necesita.",
      ca: "La certificació CID-UNESCO es nota en la qualitat. La meva flexibilitat i coordinació han millorat dràsticament. El ballet a Farray's és la base que tot ballarí necessita.",
      fr: "La certification CID-UNESCO se voit dans la qualité. Ma flexibilité et ma coordination se sont considérablement améliorées. Le ballet chez Farray's est la base dont chaque danseur a besoin.",
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const BALLET_COURSE_CONFIG = {
  teaches:
    'Ballet clásico, danza clásica, técnica de ballet, posiciones de ballet, flexibilidad, postura, coordinación, expresión corporal',
  prerequisites: 'Ninguno',
  lessons: '2 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Ballet classes
export const BALLET_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Ballet Intermedio',
    time: '20:00 - 21:00',
    teacher: 'Daniel Sene',
    levelKey: 'intermediateLevel',
  },
  {
    id: '2',
    dayKey: 'thursday',
    className: 'Ballet Principiantes',
    time: '11:00 - 12:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicLevel',
  },
];

// Breadcrumb custom keys for Ballet (4 levels: Home > Classes > Dance > Current)
export const BALLET_BREADCRUMB_KEYS = {
  home: 'balletBreadcrumbHome',
  classes: 'balletBreadcrumbClasses',
  dance: 'balletBreadcrumbDance',
  current: 'balletBreadcrumbCurrent',
};

// YouTube video ID for the page (can be updated when a video is available)
export const BALLET_VIDEO_ID = '';
