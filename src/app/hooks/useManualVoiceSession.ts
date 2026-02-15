import { useEffect, useRef, useState, useCallback } from 'react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';
import type { RealtimeItem } from '@openai/agents/realtime';
import { logSessionHistory } from '../utils';
import {
  ASSISTANT_VOICE,
  buildAudioInputConfig,
  type VoiceSessionConfig,
} from '../agent/config';
import type { ConvoStatusValue } from '../components/ConvoStatus';
import type { WorkerAPIResponseData } from '../../types';

// ── Reused types (same shape as useRealtimeAgent) ───────────────────────

export type RealtimeAgentTools = ConstructorParameters<typeof RealtimeAgent>[0]['tools'];

export type ConnectionStatus = 'connecting' | 'connected' | 'error';

export interface EventLogEntry {
  time: string;
  event: string;
  detail?: string;
}

export interface SessionUsage {
  requests: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

// ── Hook interface ──────────────────────────────────────────────────────

interface UseManualVoiceSessionOptions {
  tools: RealtimeAgentTools;
  instructions: string;
  voiceConfig: VoiceSessionConfig;
  initialMessage: string;
}

interface UseManualVoiceSessionReturn {
  status: ConvoStatusValue;
  connectionStatus: ConnectionStatus;
  isPressed: boolean;
  handlePressStart: () => void;
  handlePressEnd: () => void;
  speakDisabled: boolean;
  feedback: string | null;
  history: RealtimeItem[];
  eventLog: EventLogEntry[];
  isMuted: boolean;
  usage: SessionUsage;
  updateVoiceConfig: (config: VoiceSessionConfig) => void;
}

// ── Hook implementation ─────────────────────────────────────────────────

function useManualVoiceSession(options: UseManualVoiceSessionOptions): UseManualVoiceSessionReturn {
  const { tools, instructions, voiceConfig, initialMessage } = options;

  // Session ref
  const sessionRef = useRef<RealtimeSession | null>(null);

  // Connection state
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  // Conversation state
  const [history, setHistory] = useState<RealtimeItem[]>([]);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const [usage, setUsage] = useState<SessionUsage>({ requests: 0, inputTokens: 0, outputTokens: 0, totalTokens: 0 });

  // Manual voice-note state machine
  const [status, setStatus] = useState<ConvoStatusValue>('idle');
  const [isPressed, setIsPressed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Ref to track whether the current response included audio output
  const hadAudioInResponseRef = useRef(false);
  // Ref to track current status inside event callbacks (avoids stale closures)
  const statusRef = useRef<ConvoStatusValue>('idle');
  statusRef.current = status;

  // ── Event log helper ──────────────────────────────────────────────────

  const addEvent = useCallback((event: string, detail?: string) => {
    const time = new Date().toLocaleTimeString('en-GB', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setEventLog(prev => [{ time, event, detail }, ...prev].slice(0, 200));
  }, []);

  // ── Usage tracking ───────────────────────────────────────────────────

  const refreshUsage = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    try {
      const u = session.usage;
      setUsage({
        requests: u.requests,
        inputTokens: u.inputTokens,
        outputTokens: u.outputTokens,
        totalTokens: u.totalTokens,
      });
    } catch {
      // usage may not be available yet
    }
  }, []);

  // ── Config update ───────────────────────────────────────────────────

  const updateVoiceConfig = useCallback((config: VoiceSessionConfig) => {
    const session = sessionRef.current;
    if (!session) return;
    const audioInput = buildAudioInputConfig(config);
    session.transport.sendEvent({
      type: 'session.update',
      session: {
        input_audio_transcription: { model: 'gpt-4o-mini-transcribe' },
        turn_detection: null, // always keep VAD disabled in manual mode
        ...(audioInput.noiseReduction ? { input_audio_noise_reduction: audioInput.noiseReduction } : {}),
      },
    });
    addEvent('config_updated', `noise_reduction: ${config.noiseReductionType}`);
  }, [addEvent]);

  // ── Button handlers ───────────────────────────────────────────────────

  const handlePressStart = useCallback(() => {
    const session = sessionRef.current;
    if (!session || connectionStatus !== 'connected') return;

    setFeedback(null);

    // Interrupt assistant if currently speaking
    if (statusRef.current === 'speaking') {
      session.interrupt();
      addEvent('user_interrupt');
    }

    // Unmute — audio starts flowing to server input buffer
    session.mute(false);
    setStatus('listening');
    setIsPressed(true);
    addEvent('press_start', 'unmuted, listening');
  }, [connectionStatus, addEvent]);

  const handlePressEnd = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;

    setIsPressed(false);

    // Only commit if we were actually listening
    if (statusRef.current !== 'listening') return;

    // Mute — stop audio flow
    session.mute(true);
    setStatus('thinking');
    addEvent('press_end', 'muted, committing');

    // Commit the accumulated audio buffer, then request a response
    session.transport.sendEvent({ type: 'input_audio_buffer.commit' });
    session.transport.sendEvent({ type: 'response.create' });
  }, [addEvent]);

  // ── Session lifecycle ─────────────────────────────────────────────────

  useEffect(() => {
    const agent = new RealtimeAgent({
      name: 'Roots',
      instructions,
      tools,
      voice: ASSISTANT_VOICE,
    });

    const audioInput = buildAudioInputConfig(voiceConfig);

    const session = new RealtimeSession(agent, {
      config: {
        audio: {
          input: audioInput,
        },
      },
    });
    sessionRef.current = session;
    setConnectionStatus('connecting');
    addEvent('session_created', `voice: ${ASSISTANT_VOICE}`);

    const connectSession = async () => {
      try {
        const response = await fetch('/api/ephemeral-key');
        const result: WorkerAPIResponseData = await response.json();
        if (result.error || !result.data) {
          throw new Error(result.error || 'No data in response');
        }
        await session.connect({ apiKey: result.data.value });
        setConnectionStatus('connected');
        addEvent('connected');

        // ── Manual mode setup ──
        // 1. Start muted so entering the screen doesn't trigger listening
        session.mute(true);
        addEvent('muted_on_connect');

        // 2. Disable VAD via raw event (SDK's updateSessionConfig can't send null)
        session.transport.sendEvent({
          type: 'session.update',
          session: {
            input_audio_transcription: { model: 'gpt-4o-mini-transcribe' },
            turn_detection: null,
          },
        });
        addEvent('vad_disabled', 'turn_detection: null');
      } catch (error) {
        console.error('Failed to connect session:', error);
        setConnectionStatus('error');
        addEvent('connection_error', error instanceof Error ? error.message : 'Unknown');
      }
    };

    connectSession().then(() => {
      session.sendMessage(initialMessage);
      addEvent('initial_message_sent');
    });

    // ── SDK-level event listeners ───────────────────────────────────────

    session.on('history_updated', (h) => {
      logSessionHistory(h);
      setHistory([...h]);
      refreshUsage();
    });

    session.on('agent_tool_start', (_ctx, _agent, tool) => {
      addEvent('agent_tool_start', tool.name);
    });

    session.on('agent_tool_end', (_ctx, _agent, tool, result) => {
      const short = typeof result === 'string' ? result.slice(0, 80) : '';
      addEvent('agent_tool_end', `${tool.name}: ${short}`);
    });

    session.on('error', (err) => {
      addEvent('error', JSON.stringify(err));
    });

    // ── Transport events → status state machine ────────────────────────

    session.on('transport_event', (event) => {
      const type = (event as { type?: string }).type ?? 'unknown';

      // Skip noisy delta events for the log
      if (type.includes('.delta')) return;

      // Extract useful detail for certain event types
      let detail: string | undefined;
      const e = event as Record<string, unknown>;

      if (type === 'input_audio_buffer.speech_started' && typeof e.audio_start_ms === 'number') {
        detail = `at ${e.audio_start_ms}ms`;
      } else if (type === 'input_audio_buffer.speech_stopped' && typeof e.audio_end_ms === 'number') {
        detail = `at ${e.audio_end_ms}ms`;
      } else if (type === 'response.done' || type === 'response.created') {
        detail = e.response && typeof (e.response as Record<string, unknown>).id === 'string'
          ? (e.response as Record<string, unknown>).id as string
          : undefined;
      }

      addEvent(type, detail);
      refreshUsage();

      // ── State machine transitions ─────────────────────────────────────

      if (type === 'response.created') {
        hadAudioInResponseRef.current = false;
      }

      if (type === 'output_audio_buffer.started') {
        hadAudioInResponseRef.current = true;
        setStatus('speaking');
      }

      if (type === 'response.done') {
        setStatus(prev => {
          if (prev === 'thinking' && !hadAudioInResponseRef.current) {
            // Response completed without any audio output
            setFeedback("Didn't catch that. Hold to speak again.");
          }
          return 'idle';
        });
      }
    });

    return () => {
      session.close();
      addEvent('session_closed');
    };
  }, [tools, instructions, initialMessage, voiceConfig, addEvent, refreshUsage]);

  // ── Derived state ─────────────────────────────────────────────────────

  const speakDisabled = connectionStatus !== 'connected' || status === 'thinking';
  const isMuted = status !== 'listening';

  return {
    status,
    connectionStatus,
    isPressed,
    handlePressStart,
    handlePressEnd,
    speakDisabled,
    feedback,
    history,
    eventLog,
    isMuted,
    usage,
    updateVoiceConfig,
  };
}

export default useManualVoiceSession;
