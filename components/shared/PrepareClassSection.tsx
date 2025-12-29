import AnimateOnScroll from '../AnimateOnScroll';
import { CheckIcon, ClockIcon } from '../../lib/icons';
import { useI18n } from '../../hooks/useI18n';

export interface PrepareConfig {
  // Translation key prefix for items (e.g., 'dancehallPrepare' -> dancehallPrepareItem1, dancehallPrepareItem2...)
  prefix: string;
  // Number of "what to bring" items
  whatToBringCount: number;
  // Number of "before arriving" items
  beforeCount: number;
  // Number of "avoid" items
  avoidCount: number;
  // Teacher info for quote
  teacher: {
    name: string;
    credential: string;
    image?: string; // Optional teacher image URL (WebP base)
    imageSrcSet?: string; // WebP srcSet for responsive images
    imageSrcSetAvif?: string; // AVIF srcSet for modern browsers
    objectPosition?: string; // CSS object-position for face focus (default: 'center 20%')
  };
}

interface PrepareClassSectionProps {
  id?: string;
  titleKey: string;
  subtitleKey: string;
  config: PrepareConfig;
  className?: string;
}

/**
 * Premium Prepare Class Section with glass effect cards and teacher quote
 * Based on SalsaLadyStylePage design for visual consistency across all dance pages
 */
const PrepareClassSection: React.FC<PrepareClassSectionProps> = ({
  id = 'prepare',
  titleKey,
  subtitleKey,
  config,
  className = '',
}) => {
  const { t } = useI18n();
  const { prefix, whatToBringCount, beforeCount, avoidCount, teacher } = config;

  return (
    <section id={id} className={`py-12 md:py-16 bg-black relative overflow-hidden ${className}`}>
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/5 via-transparent to-primary-dark/5"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-accent/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <AnimateOnScroll>
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                {t(titleKey)}
              </h3>
              <p className="text-lg text-neutral/70 max-w-2xl mx-auto">{t(subtitleKey)}</p>
            </div>

            {/* Cards Grid con efecto glass y 3D */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {/* Qué traer - Card */}
              <AnimateOnScroll delay={0} className="[perspective:1000px]">
                <div className="group h-full p-6 sm:p-8 bg-black/60 backdrop-blur-xl border border-primary-accent/40 rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)_rotateY(5deg)_rotateX(2deg)] hover:shadow-accent-glow relative overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl bg-primary-accent/20"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-accent/30 to-primary-accent/10 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-primary-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-neutral">
                        {t(`${prefix}WhatToBring`)}
                      </h4>
                    </div>
                    <ul className="space-y-3">
                      {Array.from({ length: whatToBringCount }, (_, i) => i + 1).map(num => (
                        <li key={num} className="flex items-start gap-3 text-neutral/80">
                          <div className="w-5 h-5 rounded-full bg-primary-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckIcon className="w-3 h-3 text-primary-accent" />
                          </div>
                          <span className="text-sm leading-relaxed">
                            {t(`${prefix}Item${num}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Antes de llegar - Card */}
              <AnimateOnScroll delay={100} className="[perspective:1000px]">
                <div className="group h-full p-6 sm:p-8 bg-black/60 backdrop-blur-xl border border-primary-dark/50 rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)_rotateY(5deg)_rotateX(2deg)] hover:shadow-accent-glow hover:border-primary-accent/30 relative overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl bg-primary-dark/25"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-dark/50 to-primary-dark/20 flex items-center justify-center">
                        <ClockIcon className="w-6 h-6 text-primary-accent" />
                      </div>
                      <h4 className="text-xl font-bold text-neutral">{t(`${prefix}Before`)}</h4>
                    </div>
                    <ul className="space-y-3">
                      {Array.from({ length: beforeCount }, (_, i) => i + 1).map(num => (
                        <li key={num} className="flex items-start gap-3 text-neutral/80">
                          <div className="w-5 h-5 rounded-full bg-primary-dark/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-neutral font-bold">{num}</span>
                          </div>
                          <span className="text-sm leading-relaxed">
                            {t(`${prefix}BeforeItem${num}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Evita - Card */}
              <AnimateOnScroll delay={200} className="[perspective:1000px]">
                <div className="group h-full p-6 sm:p-8 bg-black/60 backdrop-blur-xl border border-neutral/30 rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)_rotateY(5deg)_rotateX(2deg)] hover:shadow-accent-glow hover:border-primary-accent/30 relative overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl bg-neutral/15"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral/20 to-neutral/5 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-primary-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-neutral">{t(`${prefix}Avoid`)}</h4>
                    </div>
                    <ul className="space-y-3">
                      {Array.from({ length: avoidCount }, (_, i) => i + 1).map(num => (
                        <li key={num} className="flex items-start gap-3 text-neutral/80">
                          <div className="w-5 h-5 rounded-full bg-neutral/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-neutral/60">✕</span>
                          </div>
                          <span className="text-sm leading-relaxed">
                            {t(`${prefix}AvoidItem${num}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Quote del profesor - Premium Style con 3D */}
            <AnimateOnScroll delay={300} className="[perspective:1000px]">
              <div className="group relative p-8 sm:p-10 bg-gradient-to-r from-primary-accent/15 via-black/80 to-primary-accent/15 backdrop-blur-xl rounded-3xl border border-primary-accent/30 overflow-hidden transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)_rotateY(3deg)_rotateX(2deg)] hover:shadow-accent-glow hover:border-primary-accent/50">
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl bg-primary-accent/15"></div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-accent/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-dark/20 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                  {/* Avatar del profesor - Enterprise with AVIF/WebP support */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-primary-accent/50 shadow-accent-glow">
                      {teacher.image ? (
                        <picture>
                          {/* AVIF: Best compression, modern browsers */}
                          {teacher.imageSrcSetAvif && (
                            <source
                              type="image/avif"
                              srcSet={teacher.imageSrcSetAvif}
                              sizes="80px"
                            />
                          )}
                          {/* WebP: Good compression, wide support */}
                          {teacher.imageSrcSet && (
                            <source type="image/webp" srcSet={teacher.imageSrcSet} sizes="80px" />
                          )}
                          <img
                            src={teacher.image}
                            alt={`Foto de ${teacher.name}`}
                            width="80"
                            height="80"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: teacher.objectPosition || 'center 20%' }}
                          />
                        </picture>
                      ) : (
                        <div
                          role="img"
                          aria-label={`Avatar de ${teacher.name}`}
                          className="w-full h-full bg-gradient-to-br from-primary-accent/30 to-primary-dark/50 flex items-center justify-center"
                        >
                          <span
                            className="text-2xl font-black text-primary-accent/60"
                            aria-hidden="true"
                          >
                            {teacher.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <svg
                        className="w-5 h-5 text-primary-accent"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <span className="text-sm font-bold text-primary-accent uppercase tracking-wider">
                        {t(`${prefix}TeacherTip`)}
                      </span>
                    </div>
                    <blockquote className="text-lg sm:text-xl text-neutral italic leading-relaxed mb-3">
                      {t(`${prefix}TeacherQuote`)}
                    </blockquote>
                    <cite className="text-sm text-neutral/70 not-italic">
                      — {teacher.name}, {teacher.credential}
                    </cite>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default PrepareClassSection;
