import type { Testimonial } from '../types';

// Google Reviews testimonials - centralized to avoid duplication across pages
// Note: images are empty as we use InitialsAvatar for rendering
export const GOOGLE_REVIEWS_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Ana Cid',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: '5 stars and because there are no more. Spectacular, from the minute you step into reception, to the teachers, the quality and the good vibes.',
      es: '5 estrellas y porque no hay más. Espectacular, desde el minuto en el que pisas recepción, hasta los profesores, la calidad y el buen rollo.',
      ca: "5 estrelles i perquè no n'hi ha més. Espectacular, des del minut en què trepitges recepció, fins als professors, la qualitat i el bon rotllo.",
      fr: "5 étoiles et parce qu'il n'y en a pas plus. Spectaculaire, dès la minute où vous entrez à la réception, jusqu'aux professeurs, la qualité et la bonne ambiance.",
    },
  },
  {
    id: 2,
    name: 'Marina Martínez',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'I love the classes and everything very professional. Money well spent.',
      es: 'Me encantan las clases y todo muy profesional. Dinero bien invertido.',
      ca: "M'encanten les classes i tot molt professional. Diners ben invertits.",
      fr: "J'adore les cours et tout est très professionnel. Argent bien investi.",
    },
  },
  {
    id: 3,
    name: 'Olga Folque Sanz',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'The classes are super fun. The teachers have a great ability to teach and make you have a great time. And Augusto, the receptionist, a 10.',
      es: 'Las clases son súper divertidas. Los profes tienen una gran capacidad para enseñar y hacer que te lo pases genial. Y Augusto, el recepcionista, un 10.',
      ca: 'Les classes són súper divertides. Els profes tenen una gran capacitat per ensenyar i fer que te la passis genial. I Augusto, el recepcionista, un 10.',
      fr: 'Les cours sont super amusants. Les professeurs ont une grande capacité à enseigner et à faire en sorte que vous passiez un bon moment. Et Augusto, le réceptionniste, un 10.',
    },
  },
];
