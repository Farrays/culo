import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Timba page (covers both Timba en Pareja and Lady Timba)
export const TIMBA_FAQS_CONFIG: FAQ[] = [
  { id: 'timba-1', questionKey: 'timbaFaqQ1', answerKey: 'timbaFaqA1' },
  { id: 'timba-2', questionKey: 'timbaFaqQ2', answerKey: 'timbaFaqA2' },
  { id: 'timba-3', questionKey: 'timbaFaqQ3', answerKey: 'timbaFaqA3' },
  { id: 'timba-4', questionKey: 'timbaFaqQ4', answerKey: 'timbaFaqA4' },
  { id: 'timba-5', questionKey: 'timbaFaqQ5', answerKey: 'timbaFaqA5' },
  { id: 'timba-6', questionKey: 'timbaFaqQ6', answerKey: 'timbaFaqA6' },
  { id: 'timba-7', questionKey: 'timbaFaqQ7', answerKey: 'timbaFaqA7' },
  { id: 'timba-8', questionKey: 'timbaFaqQ8', answerKey: 'timbaFaqA8' },
  { id: 'timba-9', questionKey: 'timbaFaqQ9', answerKey: 'timbaFaqA9' },
  { id: 'timba-10', questionKey: 'timbaFaqQ10', answerKey: 'timbaFaqA10' },
  // Lady Timba specific FAQs
  { id: 'timba-11', questionKey: 'timbaFaqQ11', answerKey: 'timbaFaqA11' },
  { id: 'timba-12', questionKey: 'timbaFaqQ12', answerKey: 'timbaFaqA12' },
];

// Testimonials for Timba page
export const TIMBA_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Patricia Sánchez',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Timba changed how I dance salsa. Now when my partner lets go, I feel free and confident. I no longer stand there like a statue!',
      es: 'La Timba cambió mi forma de bailar salsa. Ahora cuando mi pareja me suelta, me siento libre y segura. ¡Ya no me quedo como una estatua!',
      ca: 'La Timba va canviar la meva forma de ballar salsa. Ara quan la meva parella em deixa anar, em sento lliure i segura. Ja no em quedo com una estàtua!',
      fr: 'La Timba a changé ma façon de danser la salsa. Maintenant quand mon partenaire me lâche, je me sens libre et confiante. Je ne reste plus comme une statue!',
    },
  },
  {
    id: 2,
    name: 'Laura Martínez',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Lady Timba with Yunaisy is incredible. I feel more feminine, sexier and with so many more resources when dancing. Totally recommended!',
      es: 'Lady Timba con Yunaisy es increíble. Me siento más femenina, más sexy y con muchos más recursos al bailar. ¡Totalmente recomendado!',
      ca: 'Lady Timba amb Yunaisy és increïble. Em sento més femenina, més sexy i amb molts més recursos en ballar. Totalment recomanat!',
      fr: 'Lady Timba avec Yunaisy est incroyable. Je me sens plus féminine, plus sexy et avec beaucoup plus de ressources en dansant. Totalement recommandé!',
    },
  },
  {
    id: 3,
    name: 'Carlos y María',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: "The Timba class with Grechén took our salsa to another level. Now we have incredible complicity when dancing and we're never bored.",
      es: 'La clase de Timba con Grechén llevó nuestra salsa a otro nivel. Ahora tenemos una complicidad increíble al bailar y nunca nos aburrimos.',
      ca: 'La classe de Timba amb Grechén va portar la nostra salsa a un altre nivell. Ara tenim una complicitat increïble en ballar i mai ens avorrim.',
      fr: "Le cours de Timba avec Grechén a amené notre salsa à un autre niveau. Maintenant nous avons une complicité incroyable en dansant et on ne s'ennuie jamais.",
    },
  },
  {
    id: 4,
    name: 'Andrea López',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'I started with basic Lady Timba with Lia and now I understand Cuban music completely differently. Looking forward to moving up to the intermediate level!',
      es: 'Empecé con Lady Timba Básico con Lia y ahora entiendo la música cubana de forma completamente diferente. ¡Deseando pasar al nivel intermedio!',
      ca: 'Vaig començar amb Lady Timba Bàsic amb Lia i ara entenc la música cubana de forma completament diferent. Desitjant passar al nivell intermedi!',
      fr: "J'ai commencé avec Lady Timba Basique avec Lia et maintenant je comprends la musique cubaine de façon complètement différente. J'ai hâte de passer au niveau intermédiaire!",
    },
  },
];

// Schedule data for Timba classes - All 3 classes
export const TIMBA_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'tuesday',
    className: 'Timba Cubana Básico',
    time: '21:30 - 22:30',
    teacher: 'Grechén Méndez',
    levelKey: 'basicLevel',
  },
  {
    id: '2',
    dayKey: 'thursday',
    className: 'Salsa Ladies Styling Timba Fusión Intermedio/Avanzado',
    time: '20:30 - 21:30',
    teacher: 'Yunaisy Farray',
    levelKey: 'intermediateAdvancedLevel',
  },
  {
    id: '3',
    dayKey: 'friday',
    className: 'Salsa Ladies Styling Timba Fusión Básico',
    time: '19:00 - 20:00',
    teacher: 'Lía Valdes',
    levelKey: 'basicLevel',
  },
];

// Level descriptions for cards
export const TIMBA_LEVELS = [
  {
    id: 'basico',
    levelKey: 'basicLevel',
    titleKey: 'timbaLevelBasicTitle',
    descKey: 'timbaLevelBasicDesc',
    duration: '6-12 meses salsa',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio-avanzado',
    levelKey: 'intermediateAdvancedLevel',
    titleKey: 'timbaLevelIntermediateTitle',
    descKey: 'timbaLevelIntermediateDesc',
    duration: '+12 meses salsa',
    color: 'amber' as const,
  },
];

// Prepare class configuration
export const TIMBA_PREPARE_CONFIG = {
  prefix: 'timbaPrepare',
  whatToBringCount: 4,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Yunaisy Farray',
    credential: 'Directora | Miembro CID-UNESCO',
    image: '/images/teachers/img/yunaisy-farray-directora_320.webp',
  },
};

// Nearby areas for local SEO
export const TIMBA_NEARBY_AREAS = [
  { name: 'Plaza Espana', time: '5 min andando' },
  { name: 'Hostafrancs', time: '5 min andando' },
  { name: 'Sants Estacio', time: '10 min andando' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
];
