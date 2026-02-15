import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Provider } from '../../../data/providers';
import ProviderCard from './ProviderCard';

const meta: Meta<typeof ProviderCard> = {
  component: ProviderCard,
  title: 'Screens/Help & Support/ProviderCard',
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ProviderCard>;

const freeDropInProvider: Provider = {
  id: 'english-exchange',
  name: 'English Exchange at the Millennium Library',
  region: 'norwich',
  description: 'Free conversational groups at the library.',
  shortDescription: 'Free conversational groups at the library \u2014 drop-in, no restrictions, practical topics.',
  location: 'Norfolk and Norwich Millennium Library at the Forum',
  contactEmail: 'migrantsupport@norfolk.gov.uk',
  contactPhone: '0344 800 8020',
  website: 'https://www.norfolk.gov.uk/43947',
  isAccredited: false,
  isFree: true,
  isDropIn: true,
  isOnline: false,
  schedule: 'Mondays 14:00-15:00, Wednesdays 17:30-18:30',
  tags: ['free', 'drop-in', 'conversation'],
};

const accreditedProvider: Provider = {
  id: 'ccn',
  name: 'City College Norwich',
  region: 'norwich',
  description: 'Accredited ESOL classes.',
  shortDescription: 'Accredited ESOL classes from entry level 1 to Level 2, with progression to vocational courses.',
  location: 'City College Norwich, Ipswich Rd, Norwich, NR2 2LJ',
  contactEmail: 'international@ccn.ac.uk',
  website: 'https://www.ccn.ac.uk',
  isAccredited: true,
  isFree: false,
  isDropIn: false,
  isOnline: false,
  tags: ['accredited', 'college'],
};

const allBadgesProvider: Provider = {
  id: 'all-badges',
  name: 'Example Provider with All Features',
  region: 'yarmouth',
  description: 'A provider with every badge enabled.',
  shortDescription: 'Free, accredited, drop-in, online \u2014 all badges active for testing.',
  location: 'Great Yarmouth',
  contactEmail: 'test@example.com',
  contactPhone: '01234 567890',
  website: 'https://example.com',
  isAccredited: true,
  isFree: true,
  isDropIn: true,
  isOnline: true,
  schedule: 'Every day 09:00-17:00',
  tags: ['all'],
};

export const FreeDropIn: Story = {
  args: { provider: freeDropInProvider },
};

export const Accredited: Story = {
  args: { provider: accreditedProvider },
};

export const AllBadges: Story = {
  args: { provider: allBadgesProvider },
};
