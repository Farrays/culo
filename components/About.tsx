import React from 'react';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';
import MethodInfographic from './MethodInfographic';
import VideoWithSchema from './VideoWithSchema';
import { imageUrls } from '../utils/imageConfig';

const About: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="about" className="relative py-20 md:py-32 bg-black overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <VideoWithSchema
          name="Yunaisy Farray Performance at Farray's International Dance Center"
          description="World-renowned dancer Yunaisy Farray performing at her international dance center in Barcelona, showcasing the exclusive Farray Method®"
          thumbnailUrl={imageUrls.videoPosters.yunaisyPerformance}
          uploadDate="2024-01-15"
          duration="PT45S"
          contentUrl="https://www.farrayscenter.com/videos/yunaisy-farray-performance.mp4"
          className="absolute top-0 left-0 w-full h-full object-cover"
          poster={imageUrls.videoPosters.yunaisyPerformance}
          src="/videos/yunaisy-farray-performance.mp4"
          title="Performance by Yunaisy Farray"
        >
          <track
            kind="captions"
            src="/videos/captions/captions_en.vtt"
            srcLang="en"
            label="English"
          />
          <track
            kind="captions"
            src="/videos/captions/captions_es.vtt"
            srcLang="es"
            label="Español"
          />
          <track
            kind="captions"
            src="/videos/captions/captions_ca.vtt"
            srcLang="ca"
            label="Català"
          />
          <track
            kind="captions"
            src="/videos/captions/captions_fr.vtt"
            srcLang="fr"
            label="Français"
          />
        </VideoWithSchema>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <AnimateOnScroll>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-2 holographic-text">
                {t('aboutTitle')}
              </h2>
              <p className="text-2xl md:text-3xl font-medium text-primary-accent holographic-text">
                {t('aboutSubtitle')}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <div className="text-lg text-neutral/90 leading-relaxed space-y-4">
                {t('aboutBio')
                  .split('\n\n')
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll delay={400}>
            <div className="space-y-8 p-8 bg-black/50 backdrop-blur-md border border-primary-accent/20 rounded-lg shadow-2xl">
              <h3 className="text-3xl font-bold text-primary-accent holographic-text">
                {t('aboutMethodTitle')}
              </h3>
              <MethodInfographic />
              <a
                href="#legacy"
                className="inline-block bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
              >
                {t('aboutMethodCTA')}
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default About;
