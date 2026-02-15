import type { Meta, StoryObj } from '@storybook/react-vite';
import { LANGUAGES } from '../../data/languages';
import { DEFAULT_VOICE_CONFIG } from '../../agent/config';
import SettingsScreen from './SettingsScreen';

const arabic = LANGUAGES.find(l => l.code === 'ar')!;

const meta: Meta<typeof SettingsScreen> = {
  component: SettingsScreen,
  title: 'Screens/Settings',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SettingsScreen>;

export const Default: Story = {
  args: {
    language: arabic,
    savedConfig: { ...DEFAULT_VOICE_CONFIG },
    onSave: () => {},
    onResetDefaults: () => {},
    onBack: () => {},
  },
};

export const WithChanges: Story = {
  args: {
    language: arabic,
    savedConfig: { ...DEFAULT_VOICE_CONFIG },
    onSave: () => {},
    onResetDefaults: () => {},
    onBack: () => {},
  },
};

export const WithNonDefaultVoice: Story = {
  args: {
    language: arabic,
    savedConfig: { ...DEFAULT_VOICE_CONFIG, voice: 'sage' },
    onSave: () => {},
    onResetDefaults: () => {},
    onBack: () => {},
  },
};
