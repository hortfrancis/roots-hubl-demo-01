import { useMemo, useState } from 'react';
import type { LanguageConfig } from '../data/languages';
import type { Provider } from '../data/providers';
import { useRealtimeAgent } from '../hooks';
import { createCheckLocalProvidersTool } from '../tools';
import { HELP_INSTRUCTIONS } from '../agent/config';
import VoiceStatus from './VoiceStatus';
import MicMuteButton from './MicMuteButton';
import ProviderList from './ProviderList';

interface HelpSupportScreenProps {
  language: LanguageConfig;
  onBack: () => void;
}

export default function HelpSupportScreen({ language, onBack }: HelpSupportScreenProps) {
  const { ui, direction } = language;

  const [providers, setProviders] = useState<Provider[]>([]);

  const instructions = useMemo(
    () => HELP_INSTRUCTIONS(language.name, language.code),
    [language.name, language.code]
  );

  const tools = useMemo(
    () => [createCheckLocalProvidersTool(setProviders)],
    []
  );

  const { isMuted, toggleMute, connectionStatus } = useRealtimeAgent({
    tools,
    instructions,
    initialMessage: `[System Message] Conversation started. The user speaks ${language.name}. Greet them in ${language.name} and ask how you can help them find English classes or support services.`,
  });

  return (
    <div className="flex flex-col min-h-dvh px-4 py-6" dir={direction}>
      <button
        onClick={onBack}
        className="self-start text-sm text-stone-500 hover:text-stone-700 mb-4 bg-transparent border-none cursor-pointer"
      >
        ← {ui.back}
      </button>

      <div className="flex flex-col items-center gap-6 flex-1">
        <VoiceStatus
          status={connectionStatus}
          labels={{ connecting: ui.connecting, listening: ui.listening }}
        />

        <MicMuteButton
          isMuted={isMuted}
          onToggle={toggleMute}
          labels={{ muted: ui.micMuted, unmuted: ui.micUnmuted }}
        />

        <ProviderList
          providers={providers}
          headerText={ui.localProviders}
        />
      </div>

      <button
        onClick={onBack}
        className="mt-6 w-full py-3 text-sm font-medium text-stone-500 bg-stone-100 hover:bg-stone-200 rounded-xl border-none cursor-pointer transition-colors"
      >
        {ui.endSession}
      </button>
    </div>
  );
}
