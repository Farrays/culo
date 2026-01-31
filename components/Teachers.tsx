import React from 'react';
import { useTranslation } from 'react-i18next';
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
    styles: ['Afro Jazz', 'Salsa Lady Style', 'Afro Contemporáneo', 'Salsa', 'Heels'],
    isDirector: true,
  },
  {
    id: 'daniel-sene',
    name: 'Daniel Sené',
    imageBasePath: '/images/teachers/img/profesor-daniel-sene',
    specialtyKey: 'teacher.danielSene.specialty',
    bioKey: 'teacher.danielSene.bio',
    styles: ['Ballet Clásico', 'Contemporáneo', 'Yoga', 'Stretching'],
  },
  {
    id: 'alejandro-minoso',
    name: 'Alejandro Miñoso',
    imageBasePath: '/images/teachers/img/profesor-alejandro-minoso',
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
    styles: ['Salsa Cubana'],
  },
];

/**
 * Responsive Teacher Image Component
 * Uses picture element with avif/webp/jpg fallback and srcset for optimal loading
 */
const TeacherImage: React.FC<{ basePath: string; name: string }> = ({ basePath, name }) => {
  const { t } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);

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
        alt={t('teacher_photo_alt', { name })}
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
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
  const { t, i18n } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);
  const locale = i18n.language;

  return (
    <section id="teachers" className="py-12 md:py-16 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <h2
              id="teachers-title"
              className="text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text"
              data-speakable="true"
            >
              {t('teachersTitle')}
            </h2>
            <p
              id="teachers-intro"
              className="mt-4 text-neutral/70 text-lg max-w-2xl mx-auto"
              data-speakable="true"
            >
              {t('teachersSubtitle')}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="relative flex flex-col items-center gap-8 max-w-6xl mx-auto">
          {FEATURED_TEACHERS.map((teacher, index) => (
            <AnimateOnScroll
              key={teacher.id}
              delay={index * 150}
              className="w-full max-w-4xl"
              style={{ zIndex: index }}
            >
              <article
                className={`group bg-black/50 backdrop-blur-md border rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:!z-50 hover:border-primary-accent hover:shadow-accent-glow p-8 flex flex-col md:flex-row items-center gap-8 ${
                  teacher.isDirector ? 'border-primary-accent/70' : 'border-primary-dark/50'
                }`}
              >
                {/* Teacher Image */}
                <div className="flex-shrink-0 [perspective:1000px]">
                  <div
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 transition-all duration-500 ease-in-out [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow ${
                      teacher.isDirector
                        ? 'border-primary-accent'
                        : 'border-primary-accent/50 group-hover:border-primary-accent'
                    }`}
                  >
                    <TeacherImage basePath={teacher.imageBasePath} name={teacher.name} />
                  </div>
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
                    {teacher.styles.slice(0, 6).map(style => (
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
              className="group inline-flex items-center gap-3 bg-primary-accent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
            >
              <span>{t('teachersCTA')}</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
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
