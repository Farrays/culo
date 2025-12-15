import React from 'react';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';
import { InstagramIcon } from '../lib/icons';

const mockPosts = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1542103749-8ef59b94f475?w=500&h=500&fit=crop&q=80',
    link: 'https://www.instagram.com/farrays_centerbcn/',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1577801622434-d575519098d3?w=500&h=500&fit=crop&q=80',
    link: 'https://www.instagram.com/farrays_centerbcn/',
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1547153761-20dd464535DD?w=500&h=500&fit=crop&q=80',
    link: 'https://www.instagram.com/farrays_centerbcn/',
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1550614831-a8a56a5965ac?w=500&h=500&fit=crop&q=80',
    link: 'https://www.instagram.com/farrays_centerbcn/',
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1549481498-357a784ba635?w=500&h=500&fit=crop&q=80',
    link: 'https://www.instagram.com/farrays_centerbcn/',
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1522881193457-33ae84c20488?w=500&h=500&fit=crop&q=80',
    link: 'https://www.instagram.com/farrays_centerbcn/',
  },
  {
    id: 7,
    img: 'https://images.unsplash.com/photo-1545127553-23835de3865c?w=500&h=500&fit=crop&q=80',
    link: 'https://www.instagram.com/farrays_centerbcn/',
  },
  {
    id: 8,
    img: 'https://images.unsplash.com/photo-1549633391-a189115e5b61?w=500&h=500&fit=crop&q=80',
    link: 'https://www.instagram.com/farrays_centerbcn/',
  },
];

const InstagramFeed: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      id="instagram"
      className="py-20 md:py-32 bg-primary-dark/10 overflow-hidden"
      aria-labelledby="instagram-heading"
    >
      <div className="container mx-auto">
        <AnimateOnScroll className="px-6">
          <div className="text-center mb-12">
            <h2
              id="instagram-heading"
              className="text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text"
            >
              {t('instagramTitle')}
            </h2>
            <a
              href="https://www.instagram.com/farrays_centerbcn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-primary-accent hover:text-white transition-colors duration-300 mt-2 inline-block"
            >
              {t('instagramHandle')}
            </a>
          </div>
        </AnimateOnScroll>

        <div className="relative">
          <div className="flex space-x-6 overflow-x-auto pb-8 px-6 no-scrollbar">
            {mockPosts.map((post, index) => (
              <AnimateOnScroll
                key={post.id}
                delay={index * 100}
                className="flex-shrink-0 w-64 h-64 md:w-80 md:h-80"
              >
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-full h-full bg-black rounded-lg shadow-lg overflow-hidden relative"
                >
                  <img
                    src={post.img}
                    alt={`Bailarines en Instagram - Farray's Dance Center`}
                    width="400"
                    height="400"
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <InstagramIcon className="w-12 h-12 text-white opacity-90" />
                  </div>
                </a>
              </AnimateOnScroll>
            ))}
          </div>
          {/* Gradients for fading effect on edges */}
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-primary-dark/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-primary-dark/10 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
