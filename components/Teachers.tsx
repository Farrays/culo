import React from 'react';
import { useI18n } from '../hooks/useI18n';
import type { Teacher } from '../types';
import AnimateOnScroll from './AnimateOnScroll';

// Avatar colors for initials
const avatarColors = [
  'from-primary-accent to-primary-dark',
  'from-purple-500 to-purple-800',
  'from-pink-500 to-pink-800',
];

// InitialsAvatar component for teachers without photos
const InitialsAvatar: React.FC<{ name: string; index: number }> = ({ name, index }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center`}
    >
      <span className="text-white font-bold text-4xl md:text-5xl">{initials}</span>
    </div>
  );
};

const teacherData: Teacher[] = [
  {
    id: 1,
    name: 'Yunaisy Farray',
    image: '',
    specialtyKey: 'teacher1Specialty',
    bioKey: 'teacher1Bio',
  },
  {
    id: 2,
    name: 'Joni Pila',
    image: '',
    specialtyKey: 'teacher2Specialty',
    bioKey: 'teacher2Bio',
  },
  {
    id: 3,
    name: 'Elena Petrova',
    image: '',
    specialtyKey: 'teacher3Specialty',
    bioKey: 'teacher3Bio',
  },
];

const Teachers: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="teachers" className="py-12 md:py-16 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text">
              {t('teachersTitle')}
            </h2>
          </div>
        </AnimateOnScroll>
        <div className="relative flex flex-col items-center gap-8 max-w-6xl mx-auto">
          {teacherData.map((teacher, index) => (
            <AnimateOnScroll
              key={teacher.id}
              delay={index * 150}
              className="w-full max-w-4xl"
              style={{ zIndex: index }}
            >
              <div className="group bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] hover:!z-50 p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <InitialsAvatar name={teacher.name} index={index} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-bold text-neutral group-hover:text-white transition-colors duration-300">
                    {teacher.name}
                  </h3>
                  <p className="text-primary-accent font-semibold text-lg mb-3 transition-colors duration-300 group-hover:text-white">
                    {t(teacher.specialtyKey)}
                  </p>
                  <p className="text-neutral/90 leading-relaxed group-hover:text-neutral/90 transition-colors duration-300">
                    {t(teacher.bioKey)}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
        <div className="mt-16 text-center">
          <AnimateOnScroll delay={teacherData.length * 150}>
            <a
              href="#all-teachers"
              className="inline-block bg-primary-accent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-white hover:text-primary-accent shadow-lg hover:shadow-accent-glow hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
            >
              {t('teachersCTA')}
            </a>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default Teachers;
