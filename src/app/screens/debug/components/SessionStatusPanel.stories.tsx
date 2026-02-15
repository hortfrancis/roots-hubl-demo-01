import type { Meta, StoryObj } from '@storybook/react-vite';
import SessionStatusPanel from './SessionStatusPanel';

const meta: Meta<typeof SessionStatusPanel> = {
  component: SessionStatusPanel,
  title: 'Screens/Debug Screen/SessionStatusPanel',
  decorators: [
    (Story) => (
      <div className="w-full max-w-[400px] p-4 bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SessionStatusPanel>;

export const Connected: Story = {
  args: {
    status: 'idle',
    connectionStatus: 'connected',
    historyCount: 5,
    usage: { requests: 3, inputTokens: 890, outputTokens: 412, totalTokens: 1302 },
    defaultOpen: true,
  },
};

export const Listening: Story = {
  args: {
    status: 'listening',
    connectionStatus: 'connected',
    historyCount: 2,
    usage: { requests: 1, inputTokens: 200, outputTokens: 100, totalTokens: 300 },
    defaultOpen: true,
  },
};

export const Connecting: Story = {
  args: {
    status: 'idle',
    connectionStatus: 'connecting',
    historyCount: 0,
    usage: { requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    defaultOpen: true,
  },
};
