import type { Meta, StoryObj } from '@storybook/react-vite';
import PronunciationFeedback from './PronunciationFeedback';

const meta: Meta<typeof PronunciationFeedback> = {
  component: PronunciationFeedback,
  title: 'Screens/Practice Speaking/PronunciationFeedback',
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm p-4 bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PronunciationFeedback>;

export const WithFeedback: Story = {
  args: {
    feedbackText: 'Haw <improve>much</improve> daz dhis <improve>kost</improve>?',
  },
};

export const Empty: Story = {
  args: {
    feedbackText: '',
  },
};
