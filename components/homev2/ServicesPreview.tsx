import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';
import {
  KeyIcon,
  CameraIcon,
  SparklesIcon,
  UserIcon,
  HeartIcon,
  CalendarDaysIcon,
} from '../../lib/icons';

interface ServicePreview {
  id: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  titleKey: string;
  descKey: string;
  href: string;
}

const servicesPreviewData: ServicePreview[] = [
  {
    id: 'rental',
    Icon: KeyIcon,
    titleKey: 'serviceRentalTitle',
    descKey: 'serviceRentalDesc',
    href: '/alquiler-salas-barcelona',
  },
  {
    id: 'private',
    Icon: UserIcon,
    titleKey: 'servicePrivateTitle',
    descKey: 'servicePrivateDesc',
    href: '/clases-particulares-baile-barcelona',
  },
  {
    id: 'photo',
    Icon: CameraIcon,
    titleKey: 'servicePhotoTitle',
    descKey: 'servicePhotoDesc',
    href: '/servicios',
  },
  {
    id: 'parties',
    Icon: SparklesIcon,
    titleKey: 'servicePartiesTitle',
    descKey: 'servicePartiesDesc',
    href: '/servicios',
  },
  {
    id: 'gift',
    Icon: HeartIcon,
    titleKey: 'serviceGiftTitle',
    descKey: 'serviceGiftDesc',
    href: '/servicios',
  },
  {
    id: 'events',
    Icon: CalendarDaysIcon,
    titleKey: 'serviceEventsTitle',
    descKey: 'serviceEventsDesc',
    href: '/servicios',
  },
];

/**
 * ServicesPreview - Preview de Servicios
 *
 * Muestra los servicios principales con CTA para ver todos.
 * Usa el estilo visual de Services.tsx (WhyFIDC cards).
 */
const ServicesPreview: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;

  return (
    <section id="services-preview" className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-6">
        {/* Header */}
        <AnimateOnScroll>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t('homev2_services_title')}
            </h2>
            <p className="text-lg text-neutral/90">{t('homev2_services_subtitle')}</p>
          </div>
        </AnimateOnScroll>

        {/* Services Grid */}
        <div className="flex flex-wrap justify-center -m-4 mb-12">
          {servicesPreviewData.map((service, index) => (
            <div key={service.id} className="w-full md:w-1/2 lg:w-1/3 p-4 [perspective:1000px]">
              <AnimateOnScroll delay={index * 100} className="h-full">
                <Link to={`/${locale}${service.href}`} className="group block h-full">
                  <div className="p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:border-primary-accent hover:shadow-accent-glow h-full flex flex-col">
                    {/* Icono */}
                    <div className="mb-6">
                      <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <service.Icon className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110" />
                      </div>
                    </div>

                    {/* Título */}
                    <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t(service.titleKey)}
                    </h3>

                    {/* Descripción */}
                    <p className="text-neutral/90 leading-relaxed flex-grow mb-4">
                      {t(service.descKey)}
                    </p>

                    {/* CTA */}
                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-2 font-bold text-primary-accent group-hover:text-white transition-all duration-300">
                        <span>{t('homev2_services_learn_more')}</span>
                        <span className="inline-block transition-all duration-300 group-hover:translate-x-2">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            </div>
          ))}
        </div>

        {/* CTA Ver Todos */}
        <AnimateOnScroll delay={700}>
          <div className="text-center">
            <Link
              to={`/${locale}/servicios`}
              className="inline-block bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
            >
              {t('homev2_services_cta')}
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ServicesPreview;
