import type { Meta, StoryObj } from '@storybook/react-vite';
import type { RealtimeItem } from '@openai/agents/realtime';
import ConversationHistoryPanel from './ConversationHistoryPanel';

const meta: Meta<typeof ConversationHistoryPanel> = {
  component: ConversationHistoryPanel,
  title: 'Screens/Debug Screen/ConversationHistoryPanel',
  decorators: [
    (Story) => (
      <div className="w-full max-w-[400px] p-4 bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ConversationHistoryPanel>;

const sampleHistory: RealtimeItem[] = [
  {
    type: 'message',
    role: 'assistant',
    id: 'msg_1',
    content: [{ type: 'text', text: 'Hello! I am ready for testing.' }],
    status: 'completed',
  } as RealtimeItem,
  {
    type: 'message',
    role: 'user',
    id: 'msg_2',
    content: [{ type: 'input_text', transcript: 'Can you test the display phrase tool?' }],
    status: 'completed',
  } as RealtimeItem,
  {
    type: 'function_call',
    id: 'fc_1',
    name: 'display_phrase',
    callId: 'call_1',
    arguments: '{"englishText":"Hello","phoneticText":"heh-LOH","nativeText":"Bonjour"}',
    output: 'Displayed phrase: Hello',
    status: 'completed',
  } as RealtimeItem,
  {
    type: 'message',
    role: 'assistant',
    id: 'msg_3',
    content: [{ type: 'text', text: 'I\'ve displayed the phrase "Hello" for you. Try saying it!' }],
    status: 'completed',
  } as RealtimeItem,
];

export const Empty: Story = {
  args: {
    history: [],
    defaultOpen: true,
  },
};

export const WithMessages: Story = {
  args: {
    history: sampleHistory,
    defaultOpen: true,
  },
};
