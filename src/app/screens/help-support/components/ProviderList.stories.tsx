import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Provider } from '../../../data/providers';
import ProviderList from './ProviderList';

const meta: Meta<typeof ProviderList> = {
  component: ProviderList,
  title: 'Screens/Help & Support/ProviderList',
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ProviderList>;

const sampleProviders: Provider[] = [
  {
    id: 'english-exchange',
    name: 'English Exchange at the Millennium Library',
    region: 'norwich',
    description: 'Free conversational groups.',
    shortDescription: 'Free conversational groups at the library \u2014 drop-in, no restrictions.',
    location: 'Millennium Library, Norwich',
    contactPhone: '0344 800 8020',
    website: 'https://example.com',
    isAccredited: false,
    isFree: true,
    isDropIn: true,
    isOnline: false,
    schedule: 'Mondays 14:00-15:00',
    tags: ['free', 'drop-in'],
  },
  {
    id: 'ccn',
    name: 'City College Norwich',
    region: 'norwich',
    description: 'Accredited ESOL.',
    shortDescription: 'Accredited ESOL classes from entry level 1 to Level 2.',
    location: 'City College Norwich',
    contactEmail: 'international@ccn.ac.uk',
    website: 'https://example.com',
    isAccredited: true,
    isFree: false,
    isDropIn: false,
    isOnline: false,
    tags: ['accredited'],
  },
];

export const WithProviders: Story = {
  args: {
    providers: sampleProviders,
    headerText: 'English classes near you',
  },
};

export const Empty: Story = {
  args: {
    providers: [],
    headerText: 'English classes near you',
  },
};
