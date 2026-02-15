import type { Meta, StoryObj } from '@storybook/react-vite';
import EventLogPanel from './EventLogPanel';

const meta: Meta<typeof EventLogPanel> = {
  component: EventLogPanel,
  title: 'Screens/Debug Screen/EventLogPanel',
  decorators: [
    (Story) => (
      <div className="w-full max-w-[400px] p-4 bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof EventLogPanel>;

export const Empty: Story = {
  args: {
    eventLog: [],
    defaultOpen: true,
  },
};

export const WithEvents: Story = {
  args: {
    eventLog: [
      { time: '14:32:01', event: 'session_created', detail: 'voice: coral' },
      { time: '14:32:02', event: 'connected' },
      { time: '14:32:02', event: 'muted_on_connect' },
      { time: '14:32:02', event: 'vad_disabled', detail: 'turn_detection: null' },
      { time: '14:32:03', event: 'initial_message_sent' },
      { time: '14:32:04', event: 'response.created', detail: 'resp_abc123' },
      { time: '14:32:05', event: 'output_audio_buffer.started' },
      { time: '14:32:08', event: 'response.done', detail: 'resp_abc123' },
      { time: '14:32:10', event: 'press_start', detail: 'unmuted, listening' },
      { time: '14:32:12', event: 'press_end', detail: 'muted, committing' },
    ],
    defaultOpen: true,
  },
};
