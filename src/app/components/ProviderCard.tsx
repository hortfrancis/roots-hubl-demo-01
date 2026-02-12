import type { Provider } from '../data/providers';

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-2">
      <h3 className="font-semibold text-stone-800">{provider.name}</h3>
      <p className="text-sm text-stone-600">{provider.shortDescription}</p>

      <div className="flex flex-wrap gap-1.5">
        {provider.isFree && (
          <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">Free</span>
        )}
        {provider.isAccredited && (
          <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Accredited</span>
        )}
        {provider.isDropIn && (
          <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">Drop-in</span>
        )}
        {provider.isOnline && (
          <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">Online</span>
        )}
        <span className="px-2 py-0.5 text-xs bg-stone-100 text-stone-500 rounded-full capitalize">{provider.region}</span>
      </div>

      {provider.schedule && (
        <p className="text-xs text-stone-500">
          <span className="font-medium">Schedule:</span> {provider.schedule}
        </p>
      )}

      <div className="text-xs text-stone-500 space-y-0.5">
        {provider.contactEmail && <p>Email: {provider.contactEmail}</p>}
        {provider.contactPhone && <p>Phone: {provider.contactPhone}</p>}
      </div>
    </div>
  );
}
