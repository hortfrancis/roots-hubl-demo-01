import type { Meta, StoryObj } from '@storybook/react-vite';
import PhraseCard from './PhraseCard';

const meta: Meta<typeof PhraseCard> = {
  component: PhraseCard,
  title: 'Screens/Practice Speaking/PhraseCard',
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm p-4 bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PhraseCard>;

export const Default: Story = {
  args: {
    englishText: 'How much does this cost?',
    phoneticText: 'haw much daz dhis kost?',
    nativeText: '\u0643\u0645 \u062A\u0643\u0644\u0641\u0629 \u0647\u0630\u0627\u061F',
    nativeLanguageLabel: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629',
    direction: 'ltr',
  },
};

export const RTL: Story = {
  args: {
    englishText: 'Where is the bus stop?',
    phoneticText: 'wer iz dha bas stop?',
    nativeText: '\u0623\u064A\u0646 \u0645\u0648\u0642\u0641 \u0627\u0644\u062D\u0627\u0641\u0644\u0629\u061F',
    nativeLanguageLabel: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629',
    direction: 'rtl',
  },
};

export const Empty: Story = {
  args: {
    englishText: '',
    phoneticText: '',
    nativeText: '',
    nativeLanguageLabel: 'Arabic',
  },
};
