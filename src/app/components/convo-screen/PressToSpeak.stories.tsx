import type { Meta, StoryObj } from '@storybook/react-vite';
import PressToSpeak from './PressToSpeak';

const meta: Meta<typeof PressToSpeak> = {
  component: PressToSpeak,
  title: 'ConvoScreen/PressToSpeak',
  decorators: [
    (Story) => (
      <div className="w-[200px] h-[200px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PressToSpeak>;

export const Default: Story = {};

export const Pressed: Story = {
  args: { isPressed: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
