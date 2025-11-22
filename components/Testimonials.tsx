import React from 'react';
import { useI18n } from '../hooks/useI18n';
import type { Testimonial } from '../types';
import AnimateOnScroll from './AnimateOnScroll';

const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: 'Anna K.',
    image: '/images/testimonials/anna-k.jpg',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'FIDC transformed not just my dancing, but my confidence. Yunaisy is a true inspiration!',
      es: 'FIDC transformó no solo mi baile, sino mi confianza. ¡Yunaisy es una verdadera inspiración!',
      ca: 'FIDC va transformar no només el meu ball, sinó la meva confiança. La Yunaisy és una veritable inspiració!',
      fr: 'FIDC a transformé non seulement ma danse, mais aussi ma confiance. Yunaisy est une véritable inspiration !',
    },
  },
  {
    id: 2,
    name: 'David L.',
    image: '/images/testimonials/david-l.jpg',
    rating: 5,
    city: {
      en: 'London, UK',
      es: 'Londres, Reino Unido',
      ca: 'Londres, Regne Unit',
      fr: 'Londres, Royaume-Uni',
    },
    quote: {
      en: 'The level of professionalism and the sense of community here are unmatched in Barcelona.',
      es: 'El nivel de profesionalismo y el sentido de comunidad aquí son inigualables en Barcelona.',
      ca: 'El nivell de professionalitat i el sentit de comunitat aquí són inigualables a Barcelona.',
      fr: 'Le niveau de professionnalisme et le sens de la communauté ici sont inégalés à Barcelone.',
    },
  },
  {
    id: 3,
    name: 'Sophie M.',
    image: '/images/testimonials/sophie-m.jpg',
    rating: 5,
    city: { en: 'Paris, France', es: 'París, Francia', ca: 'París, França', fr: 'Paris, France' },
    quote: {
      en: "The 'Método Farray®' is challenging but incredibly rewarding. I've grown so much as a dancer.",
      es: "El 'Método Farray®' es desafiante pero increíblemente gratificante. He crecido mucho como bailarina.",
      ca: "El 'Mètode Farray®' és desafiador però increïblement gratificant. He crescut molt com a ballarina.",
      fr: "La 'Méthode Farray®' est exigeante mais incroyablement enrichissante. J'ai tellement grandi en tant que danseuse.",
    },
  },
  {
    id: 4,
    name: 'Maria G.',
    image: '/images/testimonials/maria-g.jpg',
    rating: 5,
    city: {
      en: 'New York, USA',
      es: 'Nueva York, EE. UU.',
      ca: 'Nova York, EUA',
      fr: 'New York, États-Unis',
    },
    quote: {
      en: 'Coming from an international background, I was looking for a school with a global vision. FIDC exceeded all my expectations. World-class.',
      es: 'Viniendo de un entorno internacional, buscaba una escuela con una visión global. FIDC superó todas mis expectativas. De clase mundial.',
      ca: "Venint d'un entorn internacional, buscava una escola amb una visió global. FIDC va superar totes les meves expectatives. De classe mundial.",
      fr: "Venant d'un milieu international, je cherchais une école avec une vision globale. FIDC a dépassé toutes mes attentes. De classe mondiale.",
    },
  },
  {
    id: 5,
    name: 'Carlos R.',
    image: '/images/testimonials/carlos-r.jpg',
    rating: 5,
    city: { en: 'Miami, USA', es: 'Miami, EE. UU.', ca: 'Miami, EUA', fr: 'Miami, États-Unis' },
    quote: {
      en: "The energy at FIDC is contagious. It's more than a dance school; it's a family that pushes you to be your best.",
      es: 'La energía en FIDC es contagiosa. Es más que una escuela de baile; es una familia que te impulsa a ser tu mejor versión.',
      ca: "L'energia a FIDC és contagiosa. És més que una escola de ball; és una família que t'impulsa a ser la teva millor versió.",
      fr: "L'énergie à FIDC est contagieuse. C'est plus qu'une école de danse ; c'est une famille qui vous pousse à donner le meilleur de vous-même.",
    },
  },
];

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 16.535l-5.223 2.745.998-5.816L.99 8.28l5.838-.848L10 2l2.174 5.432 5.838.848-4.785 4.184.998 5.816L10 16.535z"
      clipRule="evenodd"
    />
  </svg>
);

const Testimonials: React.FC = () => {
  const { t, locale } = useI18n();

  return (
    <section
      id="testimonials"
      className="py-20 md:py-32 bg-primary-dark/10 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <h2
              id="testimonials-heading"
              className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
            >
              {t('testimonialsTitle')}
            </h2>
            {/* Google Reviews Badge */}
            <a
              href="https://g.page/r/CWBvYu8J9aJAEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-accent/50 rounded-2xl p-4"
              aria-label="Ver reseñas en Google"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-neutral">EXCELENTE</div>
                <div className="flex" role="img" aria-label="5 de 5 estrellas">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-6 h-6 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="text-neutral/70 text-sm">
                A base de <span className="font-semibold">505 reseñas</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-neutral/70 font-semibold text-sm">Google</span>
              </div>
            </a>
          </div>
        </AnimateOnScroll>
        <div className="flex flex-col items-center max-w-6xl mx-auto gap-8">
          {testimonialData.map((testimonial, index) => (
            <AnimateOnScroll
              key={testimonial.id}
              delay={index * 150}
              className="w-full max-w-3xl"
              style={{ zIndex: index }}
            >
              <div className="flex flex-col h-full p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-300 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-2 hover:!z-50">
                <div
                  className="flex mb-4"
                  role="img"
                  aria-label={t('ratingAriaLabel').replace(
                    '{rating}',
                    testimonial.rating.toString()
                  )}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-primary-accent" />
                  ))}
                </div>
                <blockquote className="flex-grow text-neutral/90 italic mb-6">
                  <p className="text-lg">&ldquo;{testimonial.quote[locale]}&rdquo;</p>
                </blockquote>
                <div className="flex items-center space-x-4 mt-auto">
                  <img
                    src={testimonial.image}
                    alt={`Foto de perfil de ${testimonial.name}`}
                    width="56"
                    height="56"
                    loading="lazy"
                    className="w-14 h-14 rounded-full border-2 border-primary-accent object-cover"
                  />
                  <div>
                    <cite className="font-bold text-lg text-neutral not-italic">
                      {testimonial.name}
                    </cite>
                    <p className="text-sm text-neutral/75">{testimonial.city[locale]}</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
