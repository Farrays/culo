import type { Meta, StoryObj } from '@storybook/react-vite';
import FAQSection from '../FAQSection';

const meta = {
  title: 'Sections/FAQSection',
  component: FAQSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FAQSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleFaqs = [
  {
    id: '1',
    question: '¿Necesito experiencia previa para empezar?',
    answer:
      'No, tenemos clases para todos los niveles, desde principiantes absolutos hasta avanzados. Nuestros profesores adaptan las clases al nivel de cada alumno.',
  },
  {
    id: '2',
    question: '¿Qué debo llevar a clase?',
    answer:
      'Ropa cómoda y <strong>zapatillas deportivas</strong>. Para estilos como Heels o Femmology, puedes traer tacones si los tienes.',
  },
  {
    id: '3',
    question: '¿Puedo hacer una clase de prueba?',
    answer:
      'Sí, ofrecemos clases de prueba para que puedas conocer nuestro método y a nuestros profesores antes de comprometerte.',
  },
  {
    id: '4',
    question: '¿Cuántas personas hay por clase?',
    answer:
      'Nuestras clases tienen un máximo de 15-20 personas para garantizar una atención personalizada.',
  },
];

export const Default: Story = {
  args: {
    title: 'Preguntas Frecuentes',
    faqs: sampleFaqs,
  },
};

export const DancehallFAQs: Story = {
  args: {
    title: 'FAQ - Dancehall',
    faqs: [
      {
        id: '1',
        question: '¿Qué es el Dancehall?',
        answer:
          'El Dancehall es un género musical y estilo de baile originario de Jamaica. Se caracteriza por movimientos enérgicos, expresivos y muy conectados con el ritmo.',
      },
      {
        id: '2',
        question: '¿Necesito ser flexible para bailar Dancehall?',
        answer:
          'No necesitas ser flexible para empezar. La flexibilidad se va desarrollando con la práctica. Lo más importante es disfrutar y dejarse llevar por la música.',
      },
      {
        id: '3',
        question: '¿Qué movimientos aprenderé?',
        answer:
          'Aprenderás pasos básicos como el <em>Bogle</em>, <em>Willie Bounce</em>, <em>Gully Creepa</em> y muchos más. También trabajaremos coreografías completas.',
      },
    ],
  },
};

export const MinimalFAQs: Story = {
  args: {
    title: 'FAQ',
    faqs: [
      {
        id: '1',
        question: '¿Dónde están ubicados?',
        answer: 'Estamos en Barcelona, cerca de la estación de metro Verdaguer.',
      },
    ],
  },
};
