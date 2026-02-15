import type { Meta, StoryObj } from '@storybook/react-vite';
import LanguageButton from './LanguageButton';

const meta: Meta<typeof LanguageButton> = {
  component: LanguageButton,
  title: 'Screens/Language Select/LanguageButton',
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm p-4 bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof LanguageButton>;

export const Arabic: Story = {
  args: {
    flag: '\u{1F1F8}\u{1F1E6}',
    name: 'Arabic',
    nativeName: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629',
    onClick: () => {},
  },
};

export const French: Story = {
  args: {
    flag: '\u{1F1EB}\u{1F1F7}',
    name: 'French',
    nativeName: 'Fran\u00E7ais',
    onClick: () => {},
  },
};

export const German: Story = {
  args: {
    flag: '\u{1F1E9}\u{1F1EA}',
    name: 'German',
    nativeName: 'Deutsch',
    onClick: () => {},
  },
};
