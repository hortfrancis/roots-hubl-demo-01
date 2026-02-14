import { useMemo, useState, useEffect } from 'react';
import type { LanguageConfig } from '../data/languages';
import type { PhraseOutput } from '../tools/displayPhrase';
import { useRealtimeAgent } from '../hooks';
import {
  createDisplayPhraseTool,
  createRatePronunciationTool,
  createProvidePronunciationFeedbackTool,
} from '../tools';
import { PRACTICE_INSTRUCTIONS, type VoiceSessionConfig } from '../agent/config';
import VoiceStatus from './VoiceStatus';
import MicMuteButton from './MicMuteButton';
import PhraseCard from './PhraseCard';
import PronunciationRating from './PronunciationRating';
import PronunciationFeedback from './PronunciationFeedback';

interface PracticeSpeakingScreenProps {
  language: LanguageConfig;
  voiceConfig: VoiceSessionConfig;
  onBack: () => void;
}

export default function PracticeSpeakingScreen({ language, voiceConfig, onBack }: PracticeSpeakingScreenProps) {
  const { ui, direction } = language;

  const [phrase, setPhrase] = useState<PhraseOutput>({
    englishText: '',
    phoneticText: '',
    nativeText: '',
  });
  const [pronunciationRating, setPronunciationRating] = useState(0);
  const [pronunciationFeedback, setPronunciationFeedback] = useState('');

  const instructions = useMemo(
    () => PRACTICE_INSTRUCTIONS(language.name, language.code),
    [language.name, language.code]
  );

  const tools = useMemo(
    () => [
      createDisplayPhraseTool(setPhrase, language.name),
      createRatePronunciationTool(setPronunciationRating),
      createProvidePronunciationFeedbackTool(setPronunciationFeedback),
    ],
    [language.name]
  );

  const { isMuted, toggleMute, connectionStatus } = useRealtimeAgent({
    tools,
    instructions,
    voiceConfig,
    initialMessage: `[System Message] Conversation started. The user speaks ${language.name}. Greet them in ${language.name}, then begin teaching English phrases.`,
  });

  // Clear feedback when phrase changes
  useEffect(() => {
    setPronunciationFeedback('');
    setPronunciationRating(0);
  }, [phrase]);

  // Clear feedback when rating is perfect
  useEffect(() => {
    if (pronunciationRating === 3) {
      setPronunciationFeedback('');
    }
  }, [pronunciationRating]);

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

        <PhraseCard
          englishText={phrase.englishText}
          phoneticText={phrase.phoneticText}
          nativeText={phrase.nativeText}
          nativeLanguageLabel={language.nativeName}
          direction={direction}
        />

        <PronunciationRating rating={pronunciationRating} />
        <PronunciationFeedback feedbackText={pronunciationFeedback} />
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
