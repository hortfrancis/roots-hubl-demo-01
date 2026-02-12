import { tool } from '@openai/agents/realtime';
import { z } from 'zod';
import { PROVIDERS, type Provider } from '../data/providers';

const createCheckLocalProvidersTool = (
  setProviders: (providers: Provider[]) => void
) => {
  return tool({
    name: 'check_local_providers',
    description: "Search for English language class providers in the local area. Returns providers in Norwich or Great Yarmouth. Use this when the user asks about finding English classes or local support.",
    parameters: z.object({
      region: z.enum(['norwich', 'yarmouth', 'all']).describe("The region to search. Use 'norwich' for Norwich providers, 'yarmouth' for Great Yarmouth, or 'all' for both."),
    }),
    async execute({ region }) {
      const filtered = region === 'all'
        ? PROVIDERS
        : PROVIDERS.filter(p => p.region === region);
      setProviders(filtered);

      const summary = filtered.map(p =>
        `- ${p.name} (${p.region}): ${p.shortDescription}. Contact: ${p.contactEmail || p.contactPhone || 'see website'}. ${p.isFree ? 'FREE.' : ''} ${p.isAccredited ? 'Accredited.' : ''} ${p.isDropIn ? 'Drop-in welcome.' : ''}`
      ).join('\n');

      return `Found ${filtered.length} providers:\n${summary}`;
    },
  });
};

export default createCheckLocalProvidersTool;
