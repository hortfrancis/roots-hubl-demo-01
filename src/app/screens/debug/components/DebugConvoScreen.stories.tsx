import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { RealtimeItem } from '@openai/agents/realtime';
import AppLayout from '../../../components/AppLayout';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ConvoStatus from '../../../components/ConvoStatus';
import type { ConvoStatusValue } from '../../../components/ConvoStatus';
import PressToSpeak from '../../../components/PressToSpeak';
import AudioConfigPanel from './AudioConfigPanel';
import SessionStatusPanel from './SessionStatusPanel';
import EventLogPanel from './EventLogPanel';
import ConversationHistoryPanel from './ConversationHistoryPanel';
import { DEFAULT_VOICE_CONFIG, type VoiceSessionConfig } from '../../../agent/config';
import type { EventLogEntry, SessionUsage } from '../../../hooks/useManualVoiceSession';

// ── Mock data ───────────────────────────────────────────────────────────

const sampleUsage: SessionUsage = {
  requests: 3,
  inputTokens: 890,
  outputTokens: 412,
  totalTokens: 1302,
};

const sampleEventLog: EventLogEntry[] = [
  { time: '14:32:01', source: 'client', event: 'session_created', detail: 'voice: coral' },
  { time: '14:32:02', source: 'client', event: 'connected' },
  { time: '14:32:02', source: 'client', event: 'muted_on_connect' },
  { time: '14:32:02', source: 'client', event: 'vad_disabled', detail: 'turn_detection: null' },
  { time: '14:32:03', source: 'client', event: 'initial_message_sent' },
  { time: '14:32:05', source: 'server', event: 'response.done', detail: 'resp_abc123' },
];

const sampleHistory: RealtimeItem[] = [
  {
    type: 'message',
    role: 'assistant',
    id: 'msg_1',
    content: [{ type: 'text', text: 'Hi! Debug session is ready. What would you like to test?' }],
    status: 'completed',
  } as RealtimeItem,
  {
    type: 'message',
    role: 'user',
    id: 'msg_2',
    content: [{ type: 'input_text', transcript: 'Test the phrase tool please.' }],
    status: 'completed',
  } as RealtimeItem,
];

const noopFn = () => {};

// ── Interactive wrapper ─────────────────────────────────────────────────

function DebugConvoScreen({ status: initialStatus = 'idle', isPressed: initialPressed = false }: {
  status?: ConvoStatusValue;
  isPressed?: boolean;
}) {
  const [config, setConfig] = useState<VoiceSessionConfig>({ ...DEFAULT_VOICE_CONFIG });
  const [status, setStatus] = useState<ConvoStatusValue>(initialStatus);
  const [pressed, setPressed] = useState(initialPressed);

  return (
    <AppLayout
      header={<Header title="Debug Console" />}
      main={
        <div className="flex flex-col gap-2 px-3 py-3">
          <AudioConfigPanel
            localConfig={config}
            onConfigChange={setConfig}
            onApplyToSession={noopFn}
            onResetToSaved={() => setConfig({ ...DEFAULT_VOICE_CONFIG })}
            onSaveAsDefaults={noopFn}
            savedFeedback={false}
            defaultOpen
          />
          <SessionStatusPanel
            status={status}
            connectionStatus="connected"
            historyCount={sampleHistory.length}
            usage={sampleUsage}
          />
          <EventLogPanel eventLog={sampleEventLog} />
          <ConversationHistoryPanel history={sampleHistory} />
        </div>
      }
      footer={
        <Footer
          statusPanel={<ConvoStatus status={status} />}
          actionPanel={
            <PressToSpeak
              isPressed={pressed}
              onPressStart={() => { setPressed(true); setStatus('listening'); }}
              onPressEnd={() => { setPressed(false); setStatus('thinking'); setTimeout(() => setStatus('idle'), 1500); }}
            />
          }
        />
      }
    />
  );
}

// ── Meta ─────────────────────────────────────────────────────────────────

const meta: Meta<typeof DebugConvoScreen> = {
  component: DebugConvoScreen,
  title: 'Screens/Debug Screen',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DebugConvoScreen>;

export const Default: Story = {};

export const Listening: Story = {
  args: {
    status: 'listening',
    isPressed: true,
  },
};
