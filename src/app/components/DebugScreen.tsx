import { useMemo, useState } from 'react';
import type { RealtimeItem } from '@openai/agents/realtime';
import { useRealtimeAgent } from '../hooks';
import {
  createDisplayPhraseTool,
  createRatePronunciationTool,
  createProvidePronunciationFeedbackTool,
} from '../tools';
import {
  DEBUG_INSTRUCTIONS,
  type VoiceSessionConfig,
} from '../agent/config';
import type { LanguageConfig } from '../data/languages';
import type { PhraseOutput } from '../tools/displayPhrase';
import VoiceStatus from './VoiceStatus';
import MicMuteButton from './MicMuteButton';
import SendButton from './SendButton';

// ─── Sub-components ──────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">{children}</h3>;
}

function ConfigSelect({
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
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-stone-600 shrink-0">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs bg-white border border-stone-200 rounded px-2 py-1 min-w-[100px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function ConfigSlider({
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
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-xs text-stone-600">{label}</label>
        <span className="text-xs font-mono text-stone-500">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
      />
    </div>
  );
}

function ConfigToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-xs text-stone-600 shrink-0">{label}</label>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer border-none ${
          checked ? 'bg-emerald-500' : 'bg-stone-300'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
    </div>
  );
}

function HistoryItem({ item }: { item: RealtimeItem }) {
  if (item.type === 'message') {
    const role = item.role;
    const text = item.content?.[0]
      ? ('transcript' in item.content[0] ? item.content[0].transcript : null)
        ?? ('text' in item.content[0] ? item.content[0].text : null)
        ?? '...'
      : '...';

    const bgColor = role === 'user' ? 'bg-blue-50 border-blue-200' : 'bg-stone-50 border-stone-200';
    const label = role === 'user' ? 'You' : 'Roots';

    return (
      <div className={`p-2 rounded border ${bgColor} text-xs`}>
        <span className="font-semibold text-stone-600">{label}:</span>{' '}
        <span className="text-stone-700">{text}</span>
        {'status' in item && item.status === 'in_progress' && <span className="text-amber-500 ml-1">...</span>}
      </div>
    );
  }

  if (item.type === 'function_call') {
    return (
      <div className="p-2 rounded border border-purple-200 bg-purple-50 text-xs font-mono">
        <span className="font-semibold text-purple-600">tool: {item.name}</span>
        <div className="text-purple-500 mt-0.5 break-all">{item.arguments?.slice(0, 120)}</div>
        {item.output && (
          <div className="text-purple-400 mt-0.5 break-all">→ {item.output.slice(0, 80)}</div>
        )}
      </div>
    );
  }

  return null;
}

// ─── Main Debug Screen ──────────────────────────────────────────────────

interface DebugScreenProps {
  language: LanguageConfig;
  savedConfig: VoiceSessionConfig;
  onSaveConfig: (config: VoiceSessionConfig) => void;
  onBack: () => void;
}

export default function DebugScreen({ language, savedConfig, onSaveConfig, onBack }: DebugScreenProps) {
  // Local config state — initialised from user's saved settings (not factory defaults)
  const [localConfig, setLocalConfig] = useState<VoiceSessionConfig>({ ...savedConfig });
  const [copiedEvents, setCopiedEvents] = useState(false);
  const [copiedHistory, setCopiedHistory] = useState(false);

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
    isMuted,
    toggleMute,
    connectionStatus,
    history,
    eventLog,
    usage,
    updateVoiceConfig,
    commitAudioAndRespond,
  } = useRealtimeAgent({
    tools,
    instructions: DEBUG_INSTRUCTIONS,
    voiceConfig: savedConfig,
    initialMessage: `[System Message] Debug session started. Say hi and let the developer know you're ready for testing.`,
  });

  // Which panels are expanded (multiple can be open at once)
  const [openPanels, setOpenPanels] = useState<Set<string>>(() => new Set(['config']));

  const togglePanel = (panel: string) => {
    setOpenPanels(prev => {
      const next = new Set(prev);
      if (next.has(panel)) {
        next.delete(panel);
      } else {
        next.add(panel);
      }
      return next;
    });
  };

  const [savedFeedback, setSavedFeedback] = useState(false);

  // Apply current sliders to the live session (temporary override)
  const handleApplyToSession = () => {
    updateVoiceConfig(localConfig);
  };

  // Reset sliders back to what's saved in localStorage
  const handleResetToSaved = () => {
    setLocalConfig({ ...savedConfig });
    updateVoiceConfig(savedConfig);
  };

  // Persist current sliders as the new user defaults
  const handleSaveAsDefaults = () => {
    onSaveConfig(localConfig);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  return (
    <div className="flex flex-col min-h-dvh px-3 py-4 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-xs text-stone-500 hover:text-stone-700 bg-transparent border-none cursor-pointer">
          ← Back
        </button>
        <h1 className="text-sm font-bold text-stone-700">Debug Console</h1>
        <span className="text-xs text-stone-400">{language.flag} {language.code.toUpperCase()}</span>
      </div>

      {/* Voice status + mute + send */}
      <div className="flex items-center justify-between gap-3 mb-4 px-2">
        <VoiceStatus
          status={connectionStatus}
          labels={{ connecting: 'Connecting...', listening: 'Listening' }}
          pressToSendLabel={localConfig.pressToSend ? 'Speak, then tap Send' : undefined}
        />
        <div className="flex items-center gap-2">
          <MicMuteButton
            isMuted={isMuted}
            onToggle={toggleMute}
            labels={{ muted: 'Muted', unmuted: 'Live' }}
          />
          {localConfig.pressToSend && (
            <SendButton
              onSend={commitAudioAndRespond}
              label="Send"
              disabled={connectionStatus !== 'connected'}
            />
          )}
        </div>
      </div>

      {/* Live phrase display (compact) */}
      {phrase.englishText && (
        <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded text-xs">
          <strong>{phrase.englishText}</strong>
          <span className="text-stone-500 ml-2">{phrase.phoneticText}</span>
          {pronunciationRating > 0 && (
            <span className="ml-2 text-amber-600">{'★'.repeat(pronunciationRating)}</span>
          )}
          {pronunciationFeedback && (
            <div className="text-stone-500 mt-0.5">{pronunciationFeedback}</div>
          )}
        </div>
      )}

      {/* Accordion panels */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">

        {/* ── Config Panel ──────────────────────────────────────── */}
        <div className="border border-stone-200 rounded-lg overflow-hidden">
          <button
            onClick={() => togglePanel('config')}
            className="w-full text-left px-3 py-2 bg-stone-100 text-xs font-bold text-stone-600 flex justify-between items-center cursor-pointer border-none"
          >
            Voice Config
            <span>{openPanels.has('config') ? '▼' : '▶'}</span>
          </button>
          {openPanels.has('config') && (
            <div className="px-3 py-3 space-y-3 bg-white">
              <ConfigToggle
                label="Press to Send"
                checked={localConfig.pressToSend}
                onChange={(v) => setLocalConfig(c => ({ ...c, pressToSend: v }))}
              />
              {/* VAD controls — dimmed when Press to Send is on */}
              <div className={localConfig.pressToSend ? 'opacity-40 pointer-events-none space-y-3' : 'space-y-3'}>
                <ConfigSelect
                  label="Turn Detection"
                  value={localConfig.turnDetectionType}
                  options={[
                    { value: 'server_vad', label: 'Server VAD' },
                    { value: 'semantic_vad', label: 'Semantic VAD' },
                  ]}
                  onChange={(v) => setLocalConfig(c => ({ ...c, turnDetectionType: v as VoiceSessionConfig['turnDetectionType'] }))}
                />
                <ConfigSelect
                  label="Eagerness"
                  value={localConfig.eagerness}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'auto', label: 'Auto' },
                  ]}
                  onChange={(v) => setLocalConfig(c => ({ ...c, eagerness: v as VoiceSessionConfig['eagerness'] }))}
                />
                <ConfigSlider
                  label="Silence Duration"
                  value={localConfig.silenceDurationMs}
                  min={200}
                  max={2000}
                  step={50}
                  unit="ms"
                  onChange={(v) => setLocalConfig(c => ({ ...c, silenceDurationMs: v }))}
                />
                <ConfigSlider
                  label="Prefix Padding"
                  value={localConfig.prefixPaddingMs}
                  min={100}
                  max={1000}
                  step={50}
                  unit="ms"
                  onChange={(v) => setLocalConfig(c => ({ ...c, prefixPaddingMs: v }))}
                />
                <ConfigSlider
                  label="Threshold"
                  value={localConfig.threshold}
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  unit=""
                  onChange={(v) => setLocalConfig(c => ({ ...c, threshold: v }))}
                />
              </div>
              {/* Noise reduction stays active in manual mode */}
              <ConfigSelect
                label="Noise Reduction"
                value={localConfig.noiseReductionType}
                options={[
                  { value: 'near_field', label: 'Near Field' },
                  { value: 'far_field', label: 'Far Field' },
                  { value: 'off', label: 'Off' },
                ]}
                onChange={(v) => setLocalConfig(c => ({ ...c, noiseReductionType: v as VoiceSessionConfig['noiseReductionType'] }))}
              />
              <div className="flex flex-col gap-1.5 pt-2">
                <button
                  onClick={handleApplyToSession}
                  className="w-full py-1.5 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 border-none cursor-pointer"
                >
                  Apply to Session
                </button>
                <div className="flex gap-1.5">
                  <button
                    onClick={handleResetToSaved}
                    className="flex-1 py-1.5 text-xs font-medium bg-stone-200 text-stone-600 rounded hover:bg-stone-300 border-none cursor-pointer"
                  >
                    Reset to Saved
                  </button>
                  <button
                    onClick={handleSaveAsDefaults}
                    className={`flex-1 py-1.5 text-xs font-medium rounded border-none cursor-pointer ${
                      savedFeedback
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    {savedFeedback ? '✓ Saved' : 'Save as Defaults'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Status Panel ──────────────────────────────────────── */}
        <div className="border border-stone-200 rounded-lg overflow-hidden">
          <button
            onClick={() => togglePanel('status')}
            className="w-full text-left px-3 py-2 bg-stone-100 text-xs font-bold text-stone-600 flex justify-between items-center cursor-pointer border-none"
          >
            Session Status
            <span>{openPanels.has('status') ? '▼' : '▶'}</span>
          </button>
          {openPanels.has('status') && (
            <div className="px-3 py-3 space-y-2 bg-white text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Connection</span>
                <span className="font-mono">{connectionStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Muted</span>
                <span className={`font-mono ${isMuted ? 'text-red-500' : 'text-emerald-600'}`}>
                  {isMuted ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">History items</span>
                <span className="font-mono">{history.length}</span>
              </div>
              <hr className="border-stone-100" />
              <SectionHeader>Token Usage</SectionHeader>
              <div className="flex justify-between">
                <span className="text-stone-500">Requests</span>
                <span className="font-mono">{usage.requests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Input</span>
                <span className="font-mono">{usage.inputTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Output</span>
                <span className="font-mono">{usage.outputTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-stone-500">Total</span>
                <span className="font-mono">{usage.totalTokens.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Event Log Panel ──────────────────────────────────── */}
        <div className="border border-stone-200 rounded-lg overflow-hidden">
          <button
            onClick={() => togglePanel('events')}
            className="w-full text-left px-3 py-2 bg-stone-100 text-xs font-bold text-stone-600 flex justify-between items-center cursor-pointer border-none"
          >
            Event Log ({eventLog.length})
            <span>{openPanels.has('events') ? '▼' : '▶'}</span>
          </button>
          {openPanels.has('events') && (
            <div>
              <div className="flex justify-end px-2 py-1 bg-stone-800">
                <button
                  onClick={() => {
                    const text = eventLog
                      .map(e => `${e.time} ${e.event}${e.detail ? ' ' + e.detail : ''}`)
                      .join('\n');
                    navigator.clipboard.writeText(text).then(() => {
                      setCopiedEvents(true);
                      setTimeout(() => setCopiedEvents(false), 1500);
                    });
                  }}
                  className="text-[10px] text-stone-400 hover:text-green-400 bg-transparent border-none cursor-pointer"
                >
                  {copiedEvents ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="bg-stone-900 text-green-400 font-mono text-[10px] leading-tight max-h-64 overflow-y-auto p-2">
                {eventLog.length === 0 && (
                  <div className="text-stone-500 italic">No events yet...</div>
                )}
                {eventLog.map((entry, i) => (
                  <div key={i} className="py-0.5">
                    <span className="text-stone-500">{entry.time}</span>{' '}
                    <span className="text-yellow-300">{entry.event}</span>
                    {entry.detail && (
                      <span className="text-green-300 ml-1">{entry.detail.slice(0, 100)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── History Panel ────────────────────────────────────── */}
        <div className="border border-stone-200 rounded-lg overflow-hidden">
          <button
            onClick={() => togglePanel('history')}
            className="w-full text-left px-3 py-2 bg-stone-100 text-xs font-bold text-stone-600 flex justify-between items-center cursor-pointer border-none"
          >
            Conversation History ({history.length})
            <span>{openPanels.has('history') ? '▼' : '▶'}</span>
          </button>
          {openPanels.has('history') && (
            <div>
              <div className="flex justify-end px-2 py-1 bg-stone-50 border-b border-stone-200">
                <button
                  onClick={() => {
                    const text = history.map(item => {
                      if (item.type === 'message') {
                        const role = item.role === 'user' ? 'You' : item.role === 'assistant' ? 'Roots' : 'System';
                        const content = item.content?.[0]
                          ? ('transcript' in item.content[0] ? item.content[0].transcript : null)
                            ?? ('text' in item.content[0] ? item.content[0].text : null)
                            ?? ''
                          : '';
                        return `[${role}] ${content}`;
                      }
                      if (item.type === 'function_call') {
                        return `[Tool: ${item.name}] args: ${item.arguments ?? ''} → ${item.output ?? ''}`;
                      }
                      return `[${item.type}]`;
                    }).join('\n');
                    navigator.clipboard.writeText(text).then(() => {
                      setCopiedHistory(true);
                      setTimeout(() => setCopiedHistory(false), 1500);
                    });
                  }}
                  className="text-[10px] text-stone-400 hover:text-stone-600 bg-transparent border-none cursor-pointer"
                >
                  {copiedHistory ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2 bg-white space-y-1.5">
                {history.length === 0 && (
                  <div className="text-xs text-stone-400 italic">No history yet...</div>
                )}
                {history.map((item, i) => (
                  <HistoryItem key={i} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
