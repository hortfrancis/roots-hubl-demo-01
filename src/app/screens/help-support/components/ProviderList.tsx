import type { Provider } from '../../../data/providers';
import ProviderCard from './ProviderCard';

interface ProviderListProps {
  providers: Provider[];
  headerText: string;
}

export default function ProviderList({ providers, headerText }: ProviderListProps) {
  if (providers.length === 0) {
    return null;
  }

  return (
    <section className="w-full space-y-3">
      <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider">{headerText}</h2>
      <div className="flex flex-col gap-3">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </section>
  );
}
