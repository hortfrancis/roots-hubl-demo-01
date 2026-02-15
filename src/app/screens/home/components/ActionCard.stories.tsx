import type { Meta, StoryObj } from '@storybook/react-vite';
import ActionCard from './ActionCard';

const meta: Meta<typeof ActionCard> = {
  component: ActionCard,
  title: 'Screens/Home/ActionCard',
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm p-4 bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ActionCard>;

export const Default: Story = {
  args: {
    icon: '\u{1F5E3}\u{FE0F}',
    title: 'Practice Speaking',
    description: 'Practise pronunciation and conversation with your AI tutor',
    onClick: () => {},
  },
};

export const LongDescription: Story = {
  args: {
    icon: '\u{1F198}',
    title: 'Help & Support',
    description: 'Find English language classes and local support services near you in Norwich and Great Yarmouth',
    onClick: () => {},
  },
};
