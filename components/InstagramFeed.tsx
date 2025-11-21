import React from 'react';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';

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

const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.316 1.363.364 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.316-2.427.364-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.316-1.363-.364-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049 1.064.218 1.791.465 2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.316 2.427-.364C9.793 2.013 10.147 2 12.315 2zm-1.161 1.545c-1.04.042-1.675.2-2.227.412a3.397 3.397 0 00-1.228.803 3.397 3.397 0 00-.803 1.228c-.212.552-.37 1.187-.412 2.227-.043 1.024-.054 1.35-.054 3.785s.011 2.76.054 3.785c.042 1.04.2 1.675.412 2.227a3.397 3.397 0 00.803 1.228 3.397 3.397 0 001.228.803c.552.212 1.187.37 2.227.412 1.024.043 1.35.054 3.785.054s2.76-.011 3.785-.054c1.04-.042 1.675-.2 2.227-.412a3.397 3.397 0 001.228-.803 3.397 3.397 0 00.803-1.228c.212-.552.37-1.187.412-2.227.043-1.024.054-1.35.054-3.785s-.011-2.76-.054-3.785c-.042-1.04-.2-1.675-.412-2.227a3.397 3.397 0 00-.803-1.228 3.397 3.397 0 00-1.228-.803c-.552-.212-1.187-.37-2.227-.412C15.075 3.555 14.75 3.545 12.315 3.545zm.036 8.242a3.178 3.178 0 100 6.356 3.178 3.178 0 000-6.356zM12 15.75a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4.94-6.335a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z"
      clipRule="evenodd"
    ></path>
  </svg>
);

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
