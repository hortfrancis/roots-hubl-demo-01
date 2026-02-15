import type { Meta, StoryObj } from '@storybook/react-vite';
import SettingSelect from './SettingSelect';

const meta: Meta<typeof SettingSelect> = {
  component: SettingSelect,
  title: 'Screens/Settings/SettingSelect',
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-4 bg-white">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SettingSelect>;

export const Default: Story = {
  args: {
    label: 'Noise Reduction',
    value: 'far_field',
    options: [
      { value: 'near_field', label: 'Near Field' },
      { value: 'far_field', label: 'Far Field' },
      { value: 'off', label: 'Off' },
    ],
    onChange: () => {},
  },
};

export const WithSelectedValue: Story = {
  args: {
    label: 'Noise Reduction',
    value: 'near_field',
    options: [
      { value: 'near_field', label: 'Near Field' },
      { value: 'far_field', label: 'Far Field' },
      { value: 'off', label: 'Off' },
    ],
    onChange: () => {},
  },
};
