import React from 'react';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';
import { Link } from 'react-router-dom';

/**
 * Enterprise Teacher Card Data
 * Source of truth: constants/profesores-page-data.ts
 * Order: Yunaisy → Daniel → Alejandro → Iroel (formación cubana destacada)
 */
interface FeaturedTeacher {
  id: string;
  name: string;
  imageBasePath: string;
  specialtyKey: string;
  bioKey: string;
  styles: string[];
  isDirector?: boolean;
}

const FEATURED_TEACHERS: FeaturedTeacher[] = [
  {
    id: 'yunaisy-farray',
    name: 'Yunaisy Farray',
    imageBasePath: '/images/teachers/img/maestra-yunaisy-farray',
    specialtyKey: 'teacher.yunaisyFarray.specialty',
    bioKey: 'teacher.yunaisyFarray.bio',
    styles: ['Afro Jazz', 'Salsa Lady Style', 'Bachata Lady Style', 'Afro Contemporáneo'],
    isDirector: true,
  },
  {
    id: 'daniel-sene',
    name: 'Daniel Sené',
    imageBasePath: '/images/teachers/img/profesor-daniel-sen-',
    specialtyKey: 'teacher.danielSene.specialty',
    bioKey: 'teacher.danielSene.bio',
    styles: ['Ballet Clásico', 'Contemporáneo', 'Yoga', 'Stretching'],
  },
  {
    id: 'alejandro-minoso',
    name: 'Alejandro Miñoso',
    imageBasePath: '/images/teachers/img/profesor-alejandro-mi-oso',
    specialtyKey: 'teacher.alejandroMinoso.specialty',
    bioKey: 'teacher.alejandroMinoso.bio',
    styles: ['Ballet', 'Modern Jazz', 'Afro Jazz', 'Contemporáneo'],
  },
  {
    id: 'iroel-bastarreche',
    name: 'Iroel Bastarreche',
    imageBasePath: '/images/teachers/img/profesor-iroel-bastarreche',
    specialtyKey: 'teacher.iroelBastarreche.specialty',
    bioKey: 'teacher.iroelBastarreche.bio',
    styles: ['Folklore Cubano', 'Afro Contemporáneo'],
  },
];

/**
 * Responsive Teacher Image Component
 * Uses picture element with avif/webp/jpg fallback and srcset for optimal loading
 */
const TeacherImage: React.FC<{ basePath: string; name: string }> = ({ basePath, name }) => {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${basePath}_320.avif 320w, ${basePath}_640.avif 640w, ${basePath}_960.avif 960w`}
        sizes="(max-width: 768px) 128px, 160px"
      />
      <source
        type="image/webp"
        srcSet={`${basePath}_320.webp 320w, ${basePath}_640.webp 640w, ${basePath}_960.webp 960w`}
        sizes="(max-width: 768px) 128px, 160px"
      />
      <img
        src={`${basePath}_320.jpg`}
        srcSet={`${basePath}_320.jpg 320w, ${basePath}_640.jpg 640w, ${basePath}_960.jpg 960w`}
        sizes="(max-width: 768px) 128px, 160px"
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        width={160}
        height={160}
      />
    </picture>
  );
};

/**
 * Style Badge Component
 * Displays teacher specialties as compact badges
 */
const StyleBadge: React.FC<{ style: string }> = ({ style }) => (
  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary-accent/20 text-primary-accent rounded-full border border-primary-accent/30">
    {style}
  </span>
);

const Teachers: React.FC = () => {
  const { t, locale } = useI18n();

  return (
    <section id="teachers" className="py-12 md:py-16 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text">
              {t('teachersTitle')}
            </h2>
            <p className="mt-4 text-neutral/70 text-lg max-w-2xl mx-auto">
              {t('teachersSubtitle')}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="relative flex flex-col items-center gap-6 md:gap-8 max-w-5xl mx-auto">
          {FEATURED_TEACHERS.map((teacher, index) => (
            <AnimateOnScroll
              key={teacher.id}
              delay={index * 100}
              className="w-full [perspective:1000px]"
              style={{ zIndex: index }}
            >
              <article
                className={`group bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border rounded-2xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.01)] hover:shadow-accent-glow p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 ${
                  teacher.isDirector
                    ? 'border-primary-accent/70 hover:border-primary-accent'
                    : 'border-primary-dark/50 hover:border-primary-accent/70'
                }`}
              >
                {/* Teacher Image */}
                <div
                  className={`relative flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden transition-all duration-500 group-hover:scale-105 ${
                    teacher.isDirector
                      ? 'border-4 border-primary-accent ring-4 ring-primary-accent/30'
                      : 'border-4 border-primary-accent/50 group-hover:border-primary-accent'
                  }`}
                >
                  <TeacherImage basePath={teacher.imageBasePath} name={teacher.name} />
                  {teacher.isDirector && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary-accent text-white text-xs font-bold rounded-full whitespace-nowrap">
                      Directora
                    </div>
                  )}
                </div>

                {/* Teacher Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-neutral group-hover:text-white transition-colors duration-300">
                    {teacher.name}
                  </h3>
                  <p className="text-primary-accent font-semibold text-base md:text-lg mb-2 transition-colors duration-300">
                    {t(teacher.specialtyKey)}
                  </p>

                  {/* Style Badges */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mb-3">
                    {teacher.styles.slice(0, 4).map(style => (
                      <StyleBadge key={style} style={style} />
                    ))}
                  </div>

                  <p className="text-neutral/80 text-sm md:text-base leading-relaxed line-clamp-3 group-hover:text-neutral/90 transition-colors duration-300">
                    {t(teacher.bioKey)}
                  </p>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 md:mt-16 text-center">
          <AnimateOnScroll delay={FEATURED_TEACHERS.length * 100}>
            <Link
              to={`/${locale}/profesores-baile-barcelona`}
              className="inline-flex items-center gap-2 bg-primary-accent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-white hover:text-primary-accent shadow-lg hover:shadow-accent-glow hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
            >
              {t('teachersCTA')}
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default Teachers;
