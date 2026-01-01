import React, { memo } from 'react';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';
import type { Testimonial } from '../types';

interface TestimonialsSectionProps {
  titleKey: string;
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = memo(function TestimonialsSection({
  titleKey,
  testimonials,
}) {
  const { t, locale } = useI18n();

  return (
    <section className="py-10 md:py-14 bg-black">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t(titleKey)}
            </h2>
            <div className="inline-block">
              <div className="mb-4 text-3xl font-black text-neutral">{t('excellent')}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-8 h-8 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-neutral/70">
                {t('basedOnReviews').replace('{count}', '505')}
              </div>
              <div className="mt-2 text-xs text-neutral/70">Google</div>
            </div>
          </div>
        </AnimateOnScroll>

        <div
          className={`grid gap-6 sm:gap-8 mx-auto ${
            testimonials.length === 1
              ? 'grid-cols-1 max-w-lg'
              : testimonials.length === 2
                ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl'
                : testimonials.length === 3
                  ? 'grid-cols-1 md:grid-cols-3 max-w-5xl'
                  : testimonials.length === 4
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl'
                    : testimonials.length === 5
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl'
          }`}
        >
          {testimonials.map((testimonial, index) => (
            <AnimateOnScroll key={testimonial.id} delay={index * 100}>
              <div className="flex flex-col h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl shadow-lg transition-all duration-300 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-2">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="flex-grow text-neutral/90 mb-4">
                  <p className="text-sm leading-relaxed">
                    &ldquo;{testimonial.quote[locale]}&rdquo;
                  </p>
                </blockquote>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-primary-dark/30">
                  <div>
                    <cite className="font-bold text-neutral not-italic text-sm">
                      {testimonial.name}
                    </cite>
                    <p className="text-xs text-neutral/75">{testimonial.city[locale]}</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
});

export default TestimonialsSection;
