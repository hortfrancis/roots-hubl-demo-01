import type { Meta, StoryObj } from '@storybook/react-vite';
import ConvoScreenLayout from './ConvoScreenLayout';

const meta: Meta<typeof ConvoScreenLayout> = {
  component: ConvoScreenLayout,
  title: 'ConvoScreen/Layout',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ConvoScreenLayout>;

export const Default: Story = {
  args: {
    header: (
      <div className="bg-gray-200 h-full flex items-center justify-center text-gray-500">
        [Header]
      </div>
    ),
    main: (
      <div className="bg-gray-100 h-full flex items-center justify-center text-gray-400">
        [Main Content]
      </div>
    ),
    footer: (
      <>
        <div className="col-span-2 bg-gray-200 flex items-center justify-center text-gray-500">
          [Status]
        </div>
        <div className="col-span-2 bg-gray-300 flex items-center justify-center text-gray-500">
          [Action]
        </div>
      </>
    ),
  },
};
