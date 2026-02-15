import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AppLayout from '../../components/AppLayout';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ConvoStatus from '../../components/ConvoStatus';
import type { ConvoStatusValue } from '../../components/ConvoStatus';
import PressToSpeak from '../../components/PressToSpeak';
import PhraseCard from './components/PhraseCard';
import PronunciationRating from './components/PronunciationRating';
import PronunciationFeedback from './components/PronunciationFeedback';

// ── Interactive wrapper ─────────────────────────────────────────────────

function PracticeSpeakingStory({
  showPhrase = false,
  showRating = false,
}: {
  showPhrase?: boolean;
  showRating?: boolean;
}) {
  const [status, setStatus] = useState<ConvoStatusValue>('idle');
  const [pressed, setPressed] = useState(false);

  return (
    <AppLayout
      header={
        <Header
          title="Practice Speaking"
          action={<button className="text-sm text-gray-600 bg-transparent border-none cursor-pointer">End Session</button>}
        />
      }
      main={
        <div className="flex flex-col items-center gap-6 px-4 py-6">
          {showPhrase && (
            <PhraseCard
              englishText="How much does this cost?"
              phoneticText="haw much daz dhis kost?"
              nativeText="\u0643\u0645 \u062A\u0643\u0644\u0641\u0629 \u0647\u0630\u0627\u061F"
              nativeLanguageLabel="\u0627\u0644\u0639\u0631\u0628\u064A\u0629"
            />
          )}
          {showRating && <PronunciationRating rating={2} />}
          {showRating && (
            <PronunciationFeedback
              feedbackText="Haw <improve>much</improve> daz dhis <improve>kost</improve>?"
            />
          )}
          {!showPhrase && (
            <div className="text-center text-sm text-stone-400 py-8">
              Waiting for the tutor to introduce a phrase...
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

const meta: Meta<typeof PracticeSpeakingStory> = {
  component: PracticeSpeakingStory,
  title: 'Screens/Practice Speaking',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PracticeSpeakingStory>;

export const Default: Story = {};

export const WithPhrase: Story = {
  args: {
    showPhrase: true,
  },
};

export const WithRating: Story = {
  args: {
    showPhrase: true,
    showRating: true,
  },
};
