import type { Meta, StoryObj } from '@storybook/react-vite';
import AnimatedCounter from '../AnimatedCounter';

const meta = {
  title: 'UI/AnimatedCounter',
  component: AnimatedCounter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    target: {
      control: { type: 'number', min: 0, max: 10000 },
      description: 'Target number to count up to',
    },
    duration: {
      control: { type: 'number', min: 500, max: 5000, step: 100 },
      description: 'Animation duration in milliseconds',
    },
    suffix: {
      control: 'text',
      description: 'Suffix to display after the number',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof AnimatedCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    target: 100,
    duration: 2000,
    suffix: '',
    className: 'text-4xl font-bold text-white',
  },
};

export const WithPlusSuffix: Story = {
  args: {
    target: 500,
    duration: 2000,
    suffix: '+',
    className: 'text-5xl font-black text-primary-accent',
  },
};

export const Percentage: Story = {
  args: {
    target: 98,
    duration: 1500,
    suffix: '%',
    className: 'text-6xl font-bold text-green-500',
  },
};

export const LargeNumber: Story = {
  args: {
    target: 15000,
    duration: 3000,
    suffix: '',
    className: 'text-4xl font-bold text-neutral',
  },
};

export const FastAnimation: Story = {
  args: {
    target: 50,
    duration: 500,
    suffix: '',
    className: 'text-3xl font-semibold text-white',
  },
};
