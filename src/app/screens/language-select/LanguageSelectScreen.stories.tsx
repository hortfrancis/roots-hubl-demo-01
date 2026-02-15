import type { Meta, StoryObj } from '@storybook/react-vite';
import LanguageSelectScreen from './LanguageSelectScreen';

const meta: Meta<typeof LanguageSelectScreen> = {
  component: LanguageSelectScreen,
  title: 'Screens/Language Select',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof LanguageSelectScreen>;

export const Default: Story = {
  args: {
    onSelectLanguage: () => {},
  },
};
