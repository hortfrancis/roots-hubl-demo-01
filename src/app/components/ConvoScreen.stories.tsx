import type { Meta, StoryObj } from '@storybook/react-vite';
import ConvoScreen from './ConvoScreen';

const meta: Meta<typeof ConvoScreen> = {
  component: ConvoScreen,
  title: 'ConvoScreen/ConvoScreen',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ConvoScreen>;

export const Default: Story = {};
