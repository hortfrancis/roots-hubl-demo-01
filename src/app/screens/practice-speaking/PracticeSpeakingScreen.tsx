import { useMemo, useState, useEffect } from 'react';
import type { LanguageConfig } from '../../data/languages';
import type { PhraseOutput } from '../../tools/displayPhrase';
import { useManualVoiceSession } from '../../hooks';
import {
  createDisplayPhraseTool,
  createRatePronunciationTool,
  createProvidePronunciationFeedbackTool,
} from '../../tools';
import { PRACTICE_INSTRUCTIONS, type VoiceSessionConfig } from '../../agent/config';
import AppLayout from '../../components/AppLayout';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ConvoStatus from '../../components/ConvoStatus';
import PressToSpeak from '../../components/PressToSpeak';
import PhraseCard from './components/PhraseCard';
import PronunciationRating from './components/PronunciationRating';
import PronunciationFeedback from './components/PronunciationFeedback';

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

  const {
    status,
    isPressed,
    handlePressStart,
    handlePressEnd,
    speakDisabled,
  } = useManualVoiceSession({
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
    <AppLayout
      header={
        <Header
          title={ui.practiceSpeaking}
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
        <div className="flex flex-col items-center gap-6 px-4 py-6" dir={direction}>
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
