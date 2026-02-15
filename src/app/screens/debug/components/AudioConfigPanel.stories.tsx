import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import AudioConfigPanel from './AudioConfigPanel';
import { DEFAULT_VOICE_CONFIG, type VoiceSessionConfig } from '../../../agent/config';

function AudioConfigPanelWithState(props: React.ComponentProps<typeof AudioConfigPanel>) {
  const [config, setConfig] = useState<VoiceSessionConfig>(props.localConfig);
  return <AudioConfigPanel {...props} localConfig={config} onConfigChange={setConfig} />;
}

const meta: Meta<typeof AudioConfigPanel> = {
  component: AudioConfigPanel,
  title: 'Screens/Debug Screen/AudioConfigPanel',
  decorators: [
    (Story) => (
      <div className="w-full max-w-[400px] p-4 bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AudioConfigPanel>;

const noopFn = () => {};

export const Default: Story = {
  render: () => (
    <AudioConfigPanelWithState
      localConfig={{ ...DEFAULT_VOICE_CONFIG }}
      onConfigChange={noopFn}
      onApplyToSession={noopFn}
      onResetToSaved={noopFn}
      onSaveAsDefaults={noopFn}
      savedFeedback={false}
      defaultOpen
    />
  ),
};

export const Saved: Story = {
  render: () => (
    <AudioConfigPanelWithState
      localConfig={{ ...DEFAULT_VOICE_CONFIG }}
      onConfigChange={noopFn}
      onApplyToSession={noopFn}
      onResetToSaved={noopFn}
      onSaveAsDefaults={noopFn}
      savedFeedback={true}
      defaultOpen
    />
  ),
};

export const WithNonDefaultVoice: Story = {
  render: () => (
    <AudioConfigPanelWithState
      localConfig={{ ...DEFAULT_VOICE_CONFIG, voice: 'shimmer' }}
      onConfigChange={noopFn}
      onApplyToSession={noopFn}
      onResetToSaved={noopFn}
      onSaveAsDefaults={noopFn}
      savedFeedback={false}
      defaultOpen
    />
  ),
};
