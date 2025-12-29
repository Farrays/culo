import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

interface Feature {
  id: string;
  titleKey: string;
  descKey: string;
  icon: 'floor' | 'mirror' | 'ac' | 'barre' | 'fitness' | 'audio';
}

interface FacilityFeatureListProps {
  features: Feature[];
  t: (key: string) => string;
}

const iconComponents = {
  floor: (
    <svg className="w-6 h-6 text-primary-accent" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
    </svg>
  ),
  mirror: (
    <svg className="w-6 h-6 text-primary-accent" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm7 16a6 6 0 100-12 6 6 0 000 12z" />
    </svg>
  ),
  ac: (
    <svg className="w-6 h-6 text-primary-accent" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.5 8a.5.5 0 01.5.5V10h10V8.5a.5.5 0 011 0V10h1a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8a1 1 0 011-1h1V8.5a.5.5 0 01.5-.5zM5 12v7h14v-7H5z" />
    </svg>
  ),
  barre: (
    <svg className="w-6 h-6 text-primary-accent" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 4h16v2H4V4zm0 14h16v2H4v-2zm0-7h16v2H4v-2z" />
    </svg>
  ),
  fitness: (
    <svg className="w-6 h-6 text-primary-accent" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
    </svg>
  ),
  audio: (
    <svg className="w-6 h-6 text-primary-accent" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  ),
};

const FacilityFeatureList: React.FC<FacilityFeatureListProps> = ({ features, t }) => {
  return (
    <section className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t('facilitiesEquipmentTitle')}
            </h2>
            <p className="text-xl text-neutral/70 max-w-3xl mx-auto">
              {t('facilitiesEquipmentSubtitle')}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <AnimateOnScroll key={feature.id} delay={index * 100} className="[perspective:1000px]">
              <div className="group h-full p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                    {iconComponents[feature.icon]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral mb-2">{t(feature.titleKey)}</h3>
                    <p className="text-neutral/90 text-sm leading-relaxed">{t(feature.descKey)}</p>
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

export default FacilityFeatureList;
