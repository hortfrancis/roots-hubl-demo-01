import { useState } from 'react';
import type { LanguageConfig } from '../../data/languages';
import { DEFAULT_VOICE_CONFIG, type VoiceSessionConfig } from '../../agent/config';
import AppLayout from '../../components/AppLayout';
import SettingSelect from './components/SettingSelect';

// ─── Main Settings Screen ────────────────────────────────────────────────

interface SettingsScreenProps {
  language: LanguageConfig;
  savedConfig: VoiceSessionConfig;
  onSave: (config: VoiceSessionConfig) => void;
  onResetDefaults: () => void;
  onBack: () => void;
}

export default function SettingsScreen({
  language,
  savedConfig,
  onSave,
  onResetDefaults,
  onBack,
}: SettingsScreenProps) {
  const { ui, direction } = language;

  // Local editing state, initialised from saved config
  const [localConfig, setLocalConfig] = useState<VoiceSessionConfig>({ ...savedConfig });
  const [saved, setSaved] = useState(false);

  const hasChanges =
    localConfig.noiseReductionType !== savedConfig.noiseReductionType;

  const isFactoryDefaults =
    localConfig.noiseReductionType === DEFAULT_VOICE_CONFIG.noiseReductionType;

  const handleSave = () => {
    onSave(localConfig);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleReset = () => {
    const defaults = { ...DEFAULT_VOICE_CONFIG };
    setLocalConfig(defaults);
    onResetDefaults();
  };

  return (
    <AppLayout
      header={
        <div className="flex items-center justify-between h-full px-4" dir={direction}>
          <button
            onClick={onBack}
            className="text-sm text-stone-500 hover:text-stone-700 bg-transparent border-none cursor-pointer"
          >
            &larr; {ui.back}
          </button>
          <h1 className="text-lg font-bold text-stone-800">{ui.settings}</h1>
          <span className="text-sm text-stone-400">{language.flag}</span>
        </div>
      }
      main={
        <div className="flex flex-col px-4 py-6" dir={direction}>
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-sm font-semibold text-stone-600 mb-3 uppercase tracking-wider">
              {ui.voiceSettings}
            </h2>

            <div className="bg-white border border-stone-200 rounded-xl px-4">
              <SettingSelect
                label={ui.noiseReduction}
                value={localConfig.noiseReductionType}
                options={[
                  { value: 'near_field', label: 'Near Field' },
                  { value: 'far_field', label: 'Far Field' },
                  { value: 'off', label: 'Off' },
                ]}
                onChange={(v) =>
                  setLocalConfig((c) => ({
                    ...c,
                    noiseReductionType: v as VoiceSessionConfig['noiseReductionType'],
                  }))
                }
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`w-full py-3 text-sm font-semibold rounded-xl border-none cursor-pointer transition-colors ${
                  saved
                    ? 'bg-emerald-100 text-emerald-700'
                    : hasChanges
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                }`}
              >
                {saved ? '\u2713 Saved' : ui.saveSettings}
              </button>
              <button
                onClick={handleReset}
                disabled={isFactoryDefaults}
                className={`w-full py-3 text-sm font-medium rounded-xl border-none cursor-pointer transition-colors ${
                  isFactoryDefaults
                    ? 'bg-stone-50 text-stone-300 cursor-not-allowed'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {ui.resetDefaults}
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
}
