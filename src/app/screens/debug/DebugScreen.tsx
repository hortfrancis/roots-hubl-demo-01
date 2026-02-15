import { useMemo, useState } from 'react';
import { useManualVoiceSession } from '../../hooks';
import {
  createDisplayPhraseTool,
  createRatePronunciationTool,
  createProvidePronunciationFeedbackTool,
} from '../../tools';
import {
  DEBUG_INSTRUCTIONS,
  type VoiceSessionConfig,
} from '../../agent/config';
import type { LanguageConfig } from '../../data/languages';
import type { PhraseOutput } from '../../tools/displayPhrase';
import ConvoScreenLayout from '../../components/ConvoScreenLayout';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ConvoStatus from '../../components/ConvoStatus';
import PressToSpeak from '../../components/PressToSpeak';
import AudioConfigPanel from './components/AudioConfigPanel';
import SessionStatusPanel from './components/SessionStatusPanel';
import EventLogPanel from './components/EventLogPanel';
import ConversationHistoryPanel from './components/ConversationHistoryPanel';

interface DebugScreenProps {
  language: LanguageConfig;
  savedConfig: VoiceSessionConfig;
  onSaveConfig: (config: VoiceSessionConfig) => void;
  onBack: () => void;
}

export default function DebugScreen({ language, savedConfig, onSaveConfig, onBack }: DebugScreenProps) {
  // Local config state — initialised from user's saved settings
  const [localConfig, setLocalConfig] = useState<VoiceSessionConfig>({ ...savedConfig });
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Practice mode tools + state (for testing the full flow)
  const [phrase, setPhrase] = useState<PhraseOutput>({ englishText: '', phoneticText: '', nativeText: '' });
  const [pronunciationRating, setPronunciationRating] = useState(0);
  const [pronunciationFeedback, setPronunciationFeedback] = useState('');

  const tools = useMemo(
    () => [
      createDisplayPhraseTool(setPhrase, language.name),
      createRatePronunciationTool(setPronunciationRating),
      createProvidePronunciationFeedbackTool(setPronunciationFeedback),
    ],
    [language.name]
  );

  const {
    status,
    connectionStatus,
    isPressed,
    handlePressStart,
    handlePressEnd,
    speakDisabled,
    history,
    eventLog,
    usage,
    updateVoiceConfig,
  } = useManualVoiceSession({
    tools,
    instructions: DEBUG_INSTRUCTIONS,
    voiceConfig: savedConfig,
    initialMessage: `[System Message] Debug session started. Say hi and let the developer know you're ready for testing.`,
  });

  const handleApplyToSession = () => {
    updateVoiceConfig(localConfig);
  };

  const handleResetToSaved = () => {
    setLocalConfig({ ...savedConfig });
    updateVoiceConfig(savedConfig);
  };

  const handleSaveAsDefaults = () => {
    onSaveConfig(localConfig);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  return (
    <ConvoScreenLayout
      header={
        <Header
          title="Debug Console"
          action={
            <button
              onClick={onBack}
              className="text-sm text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer"
            >
              End Session
            </button>
          }
        />
      }
      main={
        <div className="flex flex-col gap-2 px-3 py-3">
          {phrase.englishText && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs">
              <strong>{phrase.englishText}</strong>
              <span className="text-stone-500 ml-2">{phrase.phoneticText}</span>
              {pronunciationRating > 0 && (
                <span className="ml-2 text-amber-600">{'\u2605'.repeat(pronunciationRating)}</span>
              )}
              {pronunciationFeedback && (
                <div className="text-stone-500 mt-0.5">{pronunciationFeedback}</div>
              )}
            </div>
          )}
          <AudioConfigPanel
            localConfig={localConfig}
            onConfigChange={setLocalConfig}
            onApplyToSession={handleApplyToSession}
            onResetToSaved={handleResetToSaved}
            onSaveAsDefaults={handleSaveAsDefaults}
            savedFeedback={savedFeedback}
            defaultOpen
          />
          <SessionStatusPanel
            status={status}
            connectionStatus={connectionStatus}
            historyCount={history.length}
            usage={usage}
          />
          <EventLogPanel eventLog={eventLog} />
          <ConversationHistoryPanel history={history} />
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
