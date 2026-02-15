import type { Meta, StoryObj } from '@storybook/react-vite';
import { LANGUAGES } from '../../data/languages';
import HomeScreen from './HomeScreen';

const arabic = LANGUAGES.find(l => l.code === 'ar')!;
const french = LANGUAGES.find(l => l.code === 'fr')!;
const german = LANGUAGES.find(l => l.code === 'de')!;

const meta: Meta<typeof HomeScreen> = {
  component: HomeScreen,
  title: 'Screens/Home',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof HomeScreen>;

export const Arabic: Story = {
  args: {
    language: arabic,
    onNavigate: () => {},
    onChangeLanguage: () => {},
  },
};

export const French: Story = {
  args: {
    language: french,
    onNavigate: () => {},
    onChangeLanguage: () => {},
  },
};

export const German: Story = {
  args: {
    language: german,
    onNavigate: () => {},
    onChangeLanguage: () => {},
  },
};
