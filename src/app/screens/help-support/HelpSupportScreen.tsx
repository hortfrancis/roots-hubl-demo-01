import { useMemo, useState } from 'react';
import type { LanguageConfig } from '../../data/languages';
import type { Provider } from '../../data/providers';
import { useManualVoiceSession } from '../../hooks';
import { createCheckLocalProvidersTool } from '../../tools';
import { HELP_INSTRUCTIONS, type VoiceSessionConfig } from '../../agent/config';
import ConvoScreenLayout from '../../components/ConvoScreenLayout';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ConvoStatus from '../../components/ConvoStatus';
import PressToSpeak from '../../components/PressToSpeak';
import ProviderList from './components/ProviderList';

interface HelpSupportScreenProps {
  language: LanguageConfig;
  voiceConfig: VoiceSessionConfig;
  onBack: () => void;
}

export default function HelpSupportScreen({ language, voiceConfig, onBack }: HelpSupportScreenProps) {
  const { ui } = language;

  const [providers, setProviders] = useState<Provider[]>([]);

  const instructions = useMemo(
    () => HELP_INSTRUCTIONS(language.name, language.code),
    [language.name, language.code]
  );

  const tools = useMemo(
    () => [createCheckLocalProvidersTool(setProviders)],
    []
  );

  const {
    status,
    connectionStatus,
    isPressed,
    handlePressStart,
    handlePressEnd,
    speakDisabled,
    feedback,
  } = useManualVoiceSession({
    tools,
    instructions,
    voiceConfig,
    initialMessage: `[System Message] Conversation started. The user speaks ${language.name}. Greet them in ${language.name} and ask how you can help them find English classes or support services.`,
  });

  return (
    <ConvoScreenLayout
      header={
        <Header
          title={ui.helpSupport ?? 'Help & Support'}
          action={
            <button
              onClick={onBack}
              className="text-sm text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer"
            >
              {ui.endSession}
            </button>
          }
        />
      }
      main={
        <div className="flex flex-col h-full px-4 py-4 overflow-y-auto gap-4">
          {connectionStatus === 'connecting' && (
            <div className="text-center text-sm text-gray-400 py-8">
              {ui.connecting}
            </div>
          )}
          {connectionStatus === 'error' && (
            <div className="text-center text-sm text-red-500 py-8">
              Connection error. Please try again.
            </div>
          )}

          {feedback && (
            <div className="text-center text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              {feedback}
            </div>
          )}

          <ProviderList
            providers={providers}
            headerText={ui.localProviders}
          />
        </div>
      }
      footer={
        <Footer
          statusPanel={<ConvoStatus status={status} />}
          actionPanel={
            <PressToSpeak
              isPressed={isPressed}
              onPressStart={handlePressStart}
              onPressEnd={handlePressEnd}
              disabled={speakDisabled}
            />
          }
        />
      }
    />
  );
}
