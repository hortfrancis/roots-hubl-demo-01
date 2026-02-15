import type { Meta, StoryObj } from '@storybook/react-vite';
import { GearSix } from '@phosphor-icons/react';
import Header from './Header';

const meta: Meta<typeof Header> = {
  component: Header,
  title: 'ConvoScreen/Header',
  decorators: [
    (Story) => (
      <div className="w-[400px] h-[100px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: <button type="button" aria-label="Settings"><GearSix size={24} /></button>,
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Practice Speaking',
  },
};
