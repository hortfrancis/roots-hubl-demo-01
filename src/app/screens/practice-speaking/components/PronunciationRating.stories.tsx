import type { Meta, StoryObj } from '@storybook/react-vite';
import PronunciationRating from './PronunciationRating';

const meta: Meta<typeof PronunciationRating> = {
  component: PronunciationRating,
  title: 'Screens/Practice Speaking/PronunciationRating',
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm p-4 bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PronunciationRating>;

export const OneStar: Story = {
  args: { rating: 1 },
};

export const TwoStars: Story = {
  args: { rating: 2 },
};

export const ThreeStars: Story = {
  args: { rating: 3 },
};

export const Empty: Story = {
  args: { rating: 0 },
};
