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
      { time: '14:32:01', source: 'client' as const, event: 'session_created', detail: 'voice: coral' },
      { time: '14:32:02', source: 'client' as const, event: 'connected' },
      { time: '14:32:02', source: 'client' as const, event: 'muted_on_connect' },
      { time: '14:32:02', source: 'client' as const, event: 'vad_disabled', detail: 'turn_detection: null' },
      { time: '14:32:03', source: 'client' as const, event: 'initial_message_sent' },
      { time: '14:32:04', source: 'server' as const, event: 'response.created', detail: 'resp_abc123' },
      { time: '14:32:05', source: 'server' as const, event: 'output_audio_buffer.started' },
      { time: '14:32:08', source: 'server' as const, event: 'response.done', detail: 'resp_abc123' },
      { time: '14:32:10', source: 'client' as const, event: 'press_start', detail: 'unmuted, listening' },
      { time: '14:32:12', source: 'client' as const, event: 'press_end', detail: 'buffering tail audio' },
    ],
    defaultOpen: true,
  },
};

export const WithUnknownSource: Story = {
  args: {
    eventLog: [
      { time: '14:32:01', source: 'client' as const, event: 'session_created', detail: 'voice: coral' },
      { time: '14:32:02', source: 'server' as const, event: 'response.created', detail: 'resp_abc123' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { time: '14:32:03', source: 'oops' as any, event: 'mystery_event', detail: 'something unexpected' },
      { time: '14:32:04', source: 'client' as const, event: 'press_start', detail: 'unmuted, listening' },
    ],
    defaultOpen: true,
  },
};
