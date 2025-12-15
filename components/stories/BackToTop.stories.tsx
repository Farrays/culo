import type { Meta, StoryObj } from '@storybook/react-vite';
import BackToTop from '../BackToTop';

const meta = {
  title: 'UI/BackToTop',
  component: BackToTop,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BackToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-[200vh] bg-black p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Scroll Down</h1>
        <p className="text-neutral/80 mb-8">
          Scroll down to see the Back to Top button appear in the bottom-right corner.
        </p>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-neutral/60 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
      <BackToTop />
    </div>
  ),
};
