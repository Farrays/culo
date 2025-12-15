import type { Meta, StoryObj } from '@storybook/react-vite';
import AnimateOnScroll from '../AnimateOnScroll';

const meta = {
  title: 'UI/AnimateOnScroll',
  component: AnimateOnScroll,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    delay: {
      control: { type: 'number', min: 0, max: 2000, step: 50 },
      description: 'Delay in ms before animation starts',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'span'],
      description: 'HTML element type to render',
    },
  },
} satisfies Meta<typeof AnimateOnScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    delay: 0,
    className: '',
    children: (
      <div className="p-8 bg-primary-dark/50 rounded-xl border border-white/20">
        <h3 className="text-2xl font-bold text-white mb-2">Animated Card</h3>
        <p className="text-neutral/80">This content fades in when scrolled into view.</p>
      </div>
    ),
  },
};

export const WithDelay: Story = {
  args: {
    delay: 300,
    children: (
      <div className="p-8 bg-primary-accent/20 rounded-xl border border-primary-accent/50">
        <h3 className="text-2xl font-bold text-white mb-2">Delayed Animation</h3>
        <p className="text-neutral/80">This appears 300ms after entering viewport.</p>
      </div>
    ),
  },
};

export const AsSection: Story = {
  args: {
    as: 'section',
    delay: 0,
    className: 'w-full max-w-md',
    children: (
      <div className="p-8 bg-gradient-to-r from-primary-dark to-black rounded-xl">
        <h2 className="text-3xl font-black text-white mb-4">Section Element</h2>
        <p className="text-neutral/80">Rendered as a semantic section element.</p>
      </div>
    ),
  },
};

export const StaggeredCards: Story = {
  args: {
    children: <div>Card 1</div>,
  },
  render: () => (
    <div className="flex gap-4">
      {[0, 100, 200, 300].map((delay, i) => (
        <AnimateOnScroll key={i} delay={delay}>
          <div className="p-6 bg-black/50 rounded-lg border border-white/10 w-32 h-32 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{i + 1}</span>
          </div>
        </AnimateOnScroll>
      ))}
    </div>
  ),
};
