import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

interface Amenity {
  id: string;
  titleKey: string;
  descKey: string;
  icon: 'bar' | 'locker' | 'wifi';
}

interface SocialAmenitiesProps {
  amenities: Amenity[];
  t: (key: string) => string;
}

const iconComponents = {
  bar: (
    <svg className="w-16 h-16 holographic-text" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7L5.66 5h12.69l-1.78 2H7.43z" />
    </svg>
  ),
  locker: (
    <svg className="w-16 h-16 holographic-text" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
    </svg>
  ),
  wifi: (
    <svg className="w-16 h-16 holographic-text" fill="currentColor" viewBox="0 0 24 24">
      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
    </svg>
  ),
};

const SocialAmenities: React.FC<SocialAmenitiesProps> = ({ amenities, t }) => {
  return (
    <section className="py-12 md:py-16 bg-primary-dark/10">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t('facilitiesAmenitiesTitle')}
            </h2>
            <p className="text-xl text-neutral/70 max-w-3xl mx-auto">
              {t('facilitiesAmenitiesSubtitle')}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {amenities.map((amenity, index) => (
            <AnimateOnScroll key={amenity.id} delay={index * 100} className="[perspective:1000px]">
              <div className="group h-full p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                <div className="mb-6 flex justify-center">{iconComponents[amenity.icon]}</div>
                <h3 className="text-2xl font-bold text-neutral mb-4 text-center">
                  {t(amenity.titleKey)}
                </h3>
                <p className="text-neutral/90 leading-relaxed text-center">{t(amenity.descKey)}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialAmenities;
