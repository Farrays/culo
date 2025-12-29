import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import AnimateOnScroll from '../AnimateOnScroll';

interface Instructor {
  id: string;
  nameKey: string;
  roleKey: string;
  bioKey: string;
  quoteKey: string;
  specialties: string[];
  imageUrl?: string;
  avatarInitials: string;
  avatarColor: string;
}

/**
 * InstructorsSection - Carrusel de Instructores Estrella
 *
 * Humaniza la marca mostrando:
 * - Foto profesional
 * - Credenciales
 * - Especialidades
 * - Quote personal
 */
const InstructorsSection: React.FC = () => {
  const { t, locale } = useI18n();

  const instructors: Instructor[] = [
    {
      id: 'yunaisy',
      nameKey: 'instructor1_name',
      roleKey: 'instructor1_role',
      bioKey: 'instructor1_bio',
      quoteKey: 'instructor1_quote',
      specialties: ['Salsa Cubana', 'Rumba', 'Son'],
      imageUrl: '/images/instructors/yunaisy.jpg',
      avatarInitials: 'YF',
      avatarColor: 'from-primary-accent to-yellow-500',
    },
    {
      id: 'joni',
      nameKey: 'instructor2_name',
      roleKey: 'instructor2_role',
      bioKey: 'instructor2_bio',
      quoteKey: 'instructor2_quote',
      specialties: ['Hip Hop', 'Dancehall', 'Afrobeat'],
      imageUrl: '/images/instructors/joni.jpg',
      avatarInitials: 'JP',
      avatarColor: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'elena',
      nameKey: 'instructor3_name',
      roleKey: 'instructor3_role',
      bioKey: 'instructor3_bio',
      quoteKey: 'instructor3_quote',
      specialties: ['Ballet', 'Contemporáneo', 'Jazz'],
      imageUrl: '/images/instructors/elena.jpg',
      avatarInitials: 'EP',
      avatarColor: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-primary-dark/10">
      <div className="container mx-auto px-6">
        {/* Header */}
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t('instructors_title')}
            </h2>
            <p className="text-xl text-neutral/70 max-w-2xl mx-auto">{t('instructors_subtitle')}</p>
          </div>
        </AnimateOnScroll>

        {/* Instructors grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {instructors.map((instructor, index) => (
            <AnimateOnScroll key={instructor.id} delay={100 + index * 100}>
              <div className="group relative bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl overflow-hidden hover:border-primary-accent/50 transition-all duration-500 hover:shadow-accent-glow hover:-translate-y-2">
                {/* Image/Avatar area */}
                <div className="relative h-64 bg-gradient-to-br from-primary-dark/50 to-black overflow-hidden">
                  {instructor.imageUrl ? (
                    <img
                      src={instructor.imageUrl}
                      alt={t(instructor.nameKey)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-32 h-32 rounded-full bg-gradient-to-br ${instructor.avatarColor} flex items-center justify-center text-white text-4xl font-bold shadow-2xl`}
                      >
                        {instructor.avatarInitials}
                      </div>
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Name and role */}
                  <h3 className="text-2xl font-bold text-neutral group-hover:text-white transition-colors duration-300">
                    {t(instructor.nameKey)}
                  </h3>
                  <p className="text-primary-accent font-medium mb-4">{t(instructor.roleKey)}</p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {instructor.specialties.map(specialty => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-primary-dark/30 text-neutral/70 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Bio snippet */}
                  <p className="text-neutral/70 text-sm leading-relaxed mb-4 line-clamp-2">
                    {t(instructor.bioKey)}
                  </p>

                  {/* Quote */}
                  <blockquote className="border-l-2 border-primary-accent pl-4 italic text-neutral/80">
                    &ldquo;{t(instructor.quoteKey)}&rdquo;
                  </blockquote>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* CTA */}
        <AnimateOnScroll delay={400}>
          <div className="text-center">
            <Link
              to={`/${locale}/profesores-baile-barcelona`}
              className="inline-flex items-center gap-2 font-bold text-primary-accent hover:text-white transition-all duration-300 group"
            >
              <span>{t('instructors_viewall')}</span>
              <span className="inline-block transition-all duration-300 group-hover:translate-x-2">
                →
              </span>
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default InstructorsSection;
