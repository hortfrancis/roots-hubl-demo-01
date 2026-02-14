import { useState } from 'react';
import { DEFAULT_VOICE_CONFIG, type VoiceSessionConfig } from '../agent/config';

const STORAGE_KEY = 'roots-voice-settings';

function readFromStorage(): VoiceSessionConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_VOICE_CONFIG };
    return { ...DEFAULT_VOICE_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_VOICE_CONFIG };
  }
}

function useVoiceSettings() {
  const [savedConfig, setSavedConfig] = useState<VoiceSessionConfig>(readFromStorage);

  const saveConfig = (config: VoiceSessionConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSavedConfig(config);
  };

  const resetToFactoryDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedConfig({ ...DEFAULT_VOICE_CONFIG });
  };

  return { savedConfig, saveConfig, resetToFactoryDefaults };
}

export default useVoiceSettings;
