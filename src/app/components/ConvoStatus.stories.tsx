import type { Meta, StoryObj } from '@storybook/react-vite';
import ConvoStatus from './ConvoStatus';

const meta: Meta<typeof ConvoStatus> = {
  component: ConvoStatus,
  title: 'ConvoScreen/ConvoStatus',
  argTypes: {
    status: {
      control: 'select',
      options: ['idle', 'listening', 'thinking', 'speaking'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[200px] h-[200px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ConvoStatus>;

export const Idle: Story = { args: { status: 'idle' } };
export const Listening: Story = { args: { status: 'listening' } };
export const Thinking: Story = { args: { status: 'thinking' } };
export const Speaking: Story = { args: { status: 'speaking' } };
