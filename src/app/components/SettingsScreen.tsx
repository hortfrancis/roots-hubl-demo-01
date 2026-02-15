import { useState } from 'react';
import type { LanguageConfig } from '../data/languages';
import { DEFAULT_VOICE_CONFIG, type VoiceSessionConfig } from '../agent/config';

// ─── Sub-components ──────────────────────────────────────────────────────

function SettingSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-stone-100 last:border-b-0">
      <label className="text-sm text-stone-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm bg-white border border-stone-200 rounded-lg px-3 py-1.5 min-w-[120px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function SettingSlider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="py-3 border-b border-stone-100 last:border-b-0 space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-stone-700">{label}</label>
        <span className="text-sm font-mono text-stone-500">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />
    </div>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-stone-100 last:border-b-0">
      <div>
        <label className="text-sm text-stone-700">{label}</label>
        {description && (
          <p className="text-xs text-stone-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer border-none shrink-0 ${
          checked ? 'bg-emerald-500' : 'bg-stone-300'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );
}

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
    localConfig.pressToSend !== savedConfig.pressToSend ||
    localConfig.turnDetectionType !== savedConfig.turnDetectionType ||
    localConfig.eagerness !== savedConfig.eagerness ||
    localConfig.silenceDurationMs !== savedConfig.silenceDurationMs ||
    localConfig.prefixPaddingMs !== savedConfig.prefixPaddingMs ||
    localConfig.threshold !== savedConfig.threshold ||
    localConfig.noiseReductionType !== savedConfig.noiseReductionType;

  const isFactoryDefaults =
    localConfig.pressToSend === DEFAULT_VOICE_CONFIG.pressToSend &&
    localConfig.turnDetectionType === DEFAULT_VOICE_CONFIG.turnDetectionType &&
    localConfig.eagerness === DEFAULT_VOICE_CONFIG.eagerness &&
    localConfig.silenceDurationMs === DEFAULT_VOICE_CONFIG.silenceDurationMs &&
    localConfig.prefixPaddingMs === DEFAULT_VOICE_CONFIG.prefixPaddingMs &&
    localConfig.threshold === DEFAULT_VOICE_CONFIG.threshold &&
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
    <div className="flex flex-col min-h-dvh px-4 py-6" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-sm text-stone-500 hover:text-stone-700 bg-transparent border-none cursor-pointer"
        >
          ← {ui.back}
        </button>
        <h1 className="text-lg font-bold text-stone-800">{ui.settings}</h1>
        <span className="text-sm text-stone-400">{language.flag}</span>
      </div>

      {/* Voice Settings Section */}
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-sm font-semibold text-stone-600 mb-3 uppercase tracking-wider">
          {ui.voiceSettings}
        </h2>

        <div className="bg-white border border-stone-200 rounded-xl px-4">
          <SettingToggle
            label={ui.pressToSend}
            description={ui.pressToSendDesc}
            checked={localConfig.pressToSend}
            onChange={(v) => setLocalConfig((c) => ({ ...c, pressToSend: v }))}
          />
          {/* VAD controls — dimmed when Press to Send is on (VAD is disabled) */}
          <div className={localConfig.pressToSend ? 'opacity-40 pointer-events-none' : ''}>
            <SettingSelect
              label={ui.turnDetection}
              value={localConfig.turnDetectionType}
              options={[
                { value: 'server_vad', label: 'Server VAD' },
                { value: 'semantic_vad', label: 'Semantic VAD' },
              ]}
              onChange={(v) =>
                setLocalConfig((c) => ({
                  ...c,
                  turnDetectionType: v as VoiceSessionConfig['turnDetectionType'],
                }))
              }
            />
            <SettingSelect
              label={ui.eagerness}
              value={localConfig.eagerness}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'auto', label: 'Auto' },
              ]}
              onChange={(v) =>
                setLocalConfig((c) => ({
                  ...c,
                  eagerness: v as VoiceSessionConfig['eagerness'],
                }))
              }
            />
            <SettingSlider
              label={ui.silenceDuration}
              value={localConfig.silenceDurationMs}
              min={200}
              max={2000}
              step={50}
              unit="ms"
              onChange={(v) => setLocalConfig((c) => ({ ...c, silenceDurationMs: v }))}
            />
            <SettingSlider
              label={ui.prefixPadding}
              value={localConfig.prefixPaddingMs}
              min={100}
              max={1000}
              step={50}
              unit="ms"
              onChange={(v) => setLocalConfig((c) => ({ ...c, prefixPaddingMs: v }))}
            />
            <SettingSlider
              label={ui.threshold}
              value={localConfig.threshold}
              min={0.1}
              max={1.0}
              step={0.05}
              unit=""
              onChange={(v) => setLocalConfig((c) => ({ ...c, threshold: v }))}
            />
          </div>
          {/* Noise reduction stays active — still useful in manual mode */}
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
            {saved ? '✓ Saved' : ui.saveSettings}
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
  );
}
