import { useState } from 'react';
import type { VoiceSessionConfig } from '../../../agent/config';

interface AudioConfigPanelProps {
  localConfig: VoiceSessionConfig;
  onConfigChange: (config: VoiceSessionConfig) => void;
  onApplyToSession: () => void;
  onResetToSaved: () => void;
  onSaveAsDefaults: () => void;
  savedFeedback: boolean;
  defaultOpen?: boolean;
}

export default function AudioConfigPanel({
  localConfig,
  onConfigChange,
  onApplyToSession,
  onResetToSaved,
  onSaveAsDefaults,
  savedFeedback,
  defaultOpen = true,
}: AudioConfigPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 bg-stone-100 text-xs font-bold text-stone-600 flex justify-between items-center cursor-pointer border-none"
      >
        Audio Config
        <span>{open ? '\u25BC' : '\u25B6'}</span>
      </button>
      {open && (
        <div className="px-3 py-3 space-y-3 bg-white">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs text-stone-600 shrink-0">Noise Reduction</label>
            <select
              value={localConfig.noiseReductionType}
              onChange={(e) => onConfigChange({ ...localConfig, noiseReductionType: e.target.value as VoiceSessionConfig['noiseReductionType'] })}
              className="text-xs bg-white border border-stone-200 rounded px-2 py-1 min-w-[100px]"
            >
              <option value="near_field">Near Field</option>
              <option value="far_field">Far Field</option>
              <option value="off">Off</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 pt-2">
            <button
              onClick={onApplyToSession}
              className="w-full py-1.5 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 border-none cursor-pointer"
            >
              Apply to Session
            </button>
            <div className="flex gap-1.5">
              <button
                onClick={onResetToSaved}
                className="flex-1 py-1.5 text-xs font-medium bg-stone-200 text-stone-600 rounded hover:bg-stone-300 border-none cursor-pointer"
              >
                Reset to Saved
              </button>
              <button
                onClick={onSaveAsDefaults}
                className={`flex-1 py-1.5 text-xs font-medium rounded border-none cursor-pointer ${
                  savedFeedback
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                {savedFeedback ? '\u2713 Saved' : 'Save as Defaults'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
