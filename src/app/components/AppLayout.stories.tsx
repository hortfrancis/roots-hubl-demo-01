import type { Meta, StoryObj } from '@storybook/react-vite';
import AppLayout from './AppLayout';

const meta: Meta<typeof AppLayout> = {
  component: AppLayout,
  title: 'Components/AppLayout',
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center h-screen bg-black">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AppLayout>;

export const WithFooter: Story = {
  args: {
    header: (
      <div className="flex items-center justify-between h-full px-4 bg-gray-200">
        <span className="font-bold text-stone-700">Screen Title</span>
        <button className="text-sm text-stone-500">Action</button>
      </div>
    ),
    main: (
      <div className="p-4 space-y-4">
        <p className="text-sm text-stone-600">Main content area — scrollable when content overflows.</p>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="p-3 bg-stone-50 border border-stone-200 rounded text-xs text-stone-500">
            Content block {i + 1}
          </div>
        ))}
      </div>
    ),
    footer: (
      <>
        <div className="col-span-2 flex items-center justify-center bg-stone-100 text-xs text-stone-500">
          Status panel
        </div>
        <div className="col-span-2 flex items-center justify-center bg-stone-200 text-xs text-stone-500">
          Action panel
        </div>
      </>
    ),
  },
};

export const WithoutFooter: Story = {
  args: {
    header: (
      <div className="flex items-center justify-between h-full px-4 bg-gray-200">
        <span className="font-bold text-stone-700">Simple Screen</span>
      </div>
    ),
    main: (
      <div className="p-4 space-y-4">
        <p className="text-sm text-stone-600">
          Main content fills the entire area below the header when no footer is provided.
        </p>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="p-3 bg-stone-50 border border-stone-200 rounded text-xs text-stone-500">
            Content block {i + 1}
          </div>
        ))}
      </div>
    ),
  },
};
