import type { Meta, StoryObj } from '@storybook/react-vite';
import ConvoScreenWireframe from './ConvoScreenWireframe';

const meta: Meta<typeof ConvoScreenWireframe> = {
  component: ConvoScreenWireframe,
  title: 'ConvoScreenWireframe',
};
export default meta;  

type Story = StoryObj<typeof ConvoScreenWireframe>;

export const Default: Story = {};
