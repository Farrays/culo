import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

interface ClassSchedule {
  id: string;
  day: string;
  className: string;
  time: string;
  teacher: string;
  level: string;
}

interface ScheduleSectionProps {
  titleKey: string;
  subtitleKey: string;
  schedules: ClassSchedule[];
  t: (_key: string) => string;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  titleKey,
  subtitleKey,
  schedules,
  t,
}) => {
  return (
    <section id="schedule" className="py-20 md:py-32 bg-primary-dark/10">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t(titleKey)}
            </h2>
            <p className="text-lg text-neutral/90">{t(subtitleKey)}</p>
          </div>
        </AnimateOnScroll>

        <div className="max-w-5xl mx-auto grid gap-4">
          {schedules.map((schedule, index) => (
            <AnimateOnScroll key={schedule.id} delay={index * 80}>
              <div className="group p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-xl transition-all duration-300 hover:shadow-accent-glow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-primary-accent/20 flex items-center justify-center border-2 border-primary-accent">
                      <span className="text-sm font-black text-primary-accent text-center leading-tight">
                        {schedule.day}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral mb-1">{schedule.className}</h3>
                      <p className="text-sm text-neutral/75">{schedule.level}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-1">
                    <span className="text-2xl font-bold holographic-text">{schedule.time}</span>
                    <span className="text-sm text-neutral/90">{schedule.teacher}</span>
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

export default ScheduleSection;
