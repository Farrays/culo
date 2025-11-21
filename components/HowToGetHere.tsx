import React from 'react';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';
import type { TransportOption } from '../types';

const transportData: TransportOption[] = [
  { id: 'metro', titleKey: 'metroTitle', options: ['metroLine1', 'metroLine2'] },
  { id: 'train', titleKey: 'trainTitle', options: ['trainStop1', 'trainStop2'] },
  { id: 'bus', titleKey: 'busTitle', options: ['busStop1', 'busStop2'] },
  { id: 'bike', titleKey: 'bikeTitle', options: ['bikeInfo1', 'bikeInfo2'] },
  { id: 'car', titleKey: 'carTitle', options: ['carInfo1', 'carInfo2'] },
];

const HowToGetHere: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="how-to-get-here" className="py-20 md:py-32 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t('howToGetHereTitle')}
            </h2>
            <p className="text-lg text-neutral/90">{t('howToGetHereIntro')}</p>
          </div>
        </AnimateOnScroll>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
          {/* Left Side: Cards */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-8">
              {transportData.map((transport, index) => (
                <AnimateOnScroll key={transport.id} delay={index * 100}>
                  <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg p-8 h-full">
                    <h3 className="text-3xl font-bold text-neutral mb-4 holographic-text">
                      {t(transport.titleKey)}
                    </h3>
                    <div className="space-y-3 text-neutral/90 text-lg leading-relaxed">
                      {transport.options.map(optionKey => (
                        <p key={optionKey}>{t(optionKey)}</p>
                      ))}
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>

          {/* Right Side: Map */}
          <div className="w-full lg:w-1/2 h-[450px] lg:h-[500px] lg:sticky lg:top-24">
            <AnimateOnScroll delay={300} className="h-full">
              <div className="overflow-hidden rounded-2xl border-2 border-primary-dark/50 shadow-lg h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.7083603486235!2d2.148014315104171!3d41.38042057926481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a49882fa7aaaa9%3A0x47a79ab582164caf!2sFarray%E2%80%99s+International+Dance+Center+-+Escuela+de+Salsa+Cubana%2C+Bailes+Sociales+y+Danza!5e1!3m2!1ses!2ses!4v1504633190526"
                  className="w-full h-full border-0"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Farray's International Dance Center Location Map"
                ></iframe>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToGetHere;
