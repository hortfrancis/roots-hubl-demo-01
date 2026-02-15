import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Provider } from '../../data/providers';
import AppLayout from '../../components/AppLayout';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ConvoStatus from '../../components/ConvoStatus';
import type { ConvoStatusValue } from '../../components/ConvoStatus';
import PressToSpeak from '../../components/PressToSpeak';
import ProviderList from './components/ProviderList';

// ── Mock data ───────────────────────────────────────────────────────────

const sampleProviders: Provider[] = [
  {
    id: 'english-exchange',
    name: 'English Exchange at the Millennium Library',
    region: 'norwich',
    description: 'Free conversational groups.',
    shortDescription: 'Free conversational groups at the library \u2014 drop-in, no restrictions.',
    location: 'Millennium Library, Norwich',
    contactPhone: '0344 800 8020',
    website: 'https://example.com',
    isAccredited: false,
    isFree: true,
    isDropIn: true,
    isOnline: false,
    schedule: 'Mondays 14:00-15:00',
    tags: ['free', 'drop-in'],
  },
  {
    id: 'nile',
    name: 'NILE',
    region: 'norwich',
    description: 'Free online English lessons.',
    shortDescription: 'Free online English lessons \u2014 grammar, pronunciation, conversation.',
    location: 'Online',
    contactEmail: 'erin@nile-elt.com',
    website: 'https://example.com',
    isAccredited: false,
    isFree: true,
    isDropIn: false,
    isOnline: true,
    tags: ['free', 'online'],
  },
];

// ── Interactive wrapper ─────────────────────────────────────────────────

function HelpSupportStory({
  providers = [],
}: {
  providers?: Provider[];
}) {
  const [status, setStatus] = useState<ConvoStatusValue>('idle');
  const [pressed, setPressed] = useState(false);

  return (
    <AppLayout
      header={
        <Header
          title="Help & Support"
          action={<button className="text-sm text-gray-600 bg-transparent border-none cursor-pointer">End Session</button>}
        />
      }
      main={
        <div className="flex flex-col h-full px-4 py-4 overflow-y-auto gap-4">
          <ProviderList providers={providers} headerText="English classes near you" />
          {providers.length === 0 && (
            <div className="text-center text-sm text-stone-400 py-8">
              Ask about finding English classes to see providers here.
            </div>
          )}
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

const meta: Meta<typeof HelpSupportStory> = {
  component: HelpSupportStory,
  title: 'Screens/Help & Support',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof HelpSupportStory>;

export const Default: Story = {};

export const WithProviders: Story = {
  args: {
    providers: sampleProviders,
  },
};
