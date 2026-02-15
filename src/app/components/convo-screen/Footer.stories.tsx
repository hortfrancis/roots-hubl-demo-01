import type { Meta, StoryObj } from '@storybook/react-vite';
import Footer from './Footer';
import ConvoStatus from './ConvoStatus';
import PressToSpeak from './PressToSpeak';

const meta: Meta<typeof Footer> = {
  component: Footer,
  title: 'ConvoScreen/Footer',
  decorators: [
    (Story) => (
      <div className="grid grid-cols-4 w-[400px] h-[200px]">
        <div className="col-span-4 grid grid-cols-subgrid">
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    statusPanel: <ConvoStatus status="idle" />,
    actionPanel: <PressToSpeak />,
  },
};

export const Listening: Story = {
  args: {
    statusPanel: <ConvoStatus status="listening" />,
    actionPanel: <PressToSpeak isPressed />,
  },
};
