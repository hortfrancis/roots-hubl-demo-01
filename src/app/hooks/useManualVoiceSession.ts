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

// ── Types ────────────────────────────────────────────────────────────────

export type RealtimeAgentTools = ConstructorParameters<typeof RealtimeAgent>[0]['tools'];

export type ConnectionStatus = 'connecting' | 'connected' | 'error';

export interface EventLogEntry {
  time: string;
  source: 'client' | 'server';
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
  // Ref to track commit delay config (avoids stale closures in setTimeout)
  const commitDelayRef = useRef(voiceConfig.commitDelayMs);
  commitDelayRef.current = voiceConfig.commitDelayMs;
  // Guard ref to prevent double-fire of handlePressEnd (pointer events can
  // fire both pointerup and pointerleave on the same gesture)
  const pressEndFiredRef = useRef(false);

  // ── Event log helper ──────────────────────────────────────────────────

  const addEvent = useCallback((event: string, detail: string | undefined, source: 'client' | 'server') => {
    const time = new Date().toLocaleTimeString('en-GB', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setEventLog(prev => [{ time, source, event, detail }, ...prev].slice(0, 200));
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
        type: 'realtime', // required by GA API
        audio: {
          input: {
            transcription: { model: 'gpt-4o-mini-transcribe' },
            turn_detection: null, // always keep VAD disabled in manual mode
            ...(audioInput.noiseReduction ? { noise_reduction: audioInput.noiseReduction } : {}),
          },
        },
      },
    });
    addEvent('config_updated', `noise_reduction: ${config.noiseReductionType}`, 'client');
  }, [addEvent]);

  // ── Button handlers ───────────────────────────────────────────────────

  const handlePressStart = useCallback(() => {
    const session = sessionRef.current;
    if (!session || connectionStatus !== 'connected') return;

    setFeedback(null);
    pressEndFiredRef.current = false; // reset guard for new press

    // Interrupt assistant if currently speaking
    if (statusRef.current === 'speaking') {
      session.interrupt();
      addEvent('user_interrupt', undefined, 'client');
    }

    // Unmute — audio starts flowing to server input buffer
    session.mute(false);
    setStatus('listening');
    setIsPressed(true);
    addEvent('press_start', 'unmuted, listening', 'client');
  }, [connectionStatus, addEvent]);

  const handlePressEnd = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;

    setIsPressed(false);

    // Only commit if we were actually listening
    if (statusRef.current !== 'listening') return;

    // Guard against double-fire (pointerup + pointerleave on same gesture)
    if (pressEndFiredRef.current) return;
    pressEndFiredRef.current = true;

    addEvent('press_end', 'buffering tail audio', 'client');

    // Short delay to let trailing WebRTC audio reach the server buffer
    // before we mute and commit — prevents clipping the end of speech
    setTimeout(() => {
      if (!sessionRef.current) return;
      sessionRef.current.mute(true);
      setStatus('thinking');
      addEvent('commit', 'muted, committing', 'client');

      sessionRef.current.transport.sendEvent({ type: 'input_audio_buffer.commit' });
      sessionRef.current.transport.sendEvent({ type: 'response.create' });
    }, commitDelayRef.current);
  }, [addEvent]);

  // ── Session lifecycle ─────────────────────────────────────────────────

  useEffect(() => {
    const agent = new RealtimeAgent({
      name: 'Roots',
      instructions,
      tools,
      voice: ASSISTANT_VOICE,
    });

    const session = new RealtimeSession(agent, {
      config: {
        audio: {
          input: {
            // Only pass noise reduction — do NOT pass turnDetection here.
            // The SDK's internal updateSessionConfig() during connect() would
            // send any turnDetection config to the server, re-enabling VAD.
            // We disable VAD explicitly via raw transport event after connect.
            noiseReduction: voiceConfig.noiseReductionType === 'off'
              ? null
              : { type: voiceConfig.noiseReductionType },
          },
        },
      },
    });
    sessionRef.current = session;
    setConnectionStatus('connecting');
    addEvent('session_created', `voice: ${ASSISTANT_VOICE}`, 'client');

    const connectSession = async () => {
      try {
        const response = await fetch('/api/ephemeral-key');
        const result: WorkerAPIResponseData = await response.json();
        if (result.error || !result.data) {
          throw new Error(result.error || 'No data in response');
        }
        await session.connect({ apiKey: result.data.value });
        setConnectionStatus('connected');
        addEvent('connected', undefined, 'client');

        // ── Manual mode setup ──
        // 1. Start muted so entering the screen doesn't trigger listening
        session.mute(true);
        addEvent('muted_on_connect', undefined, 'client');

        // 2. Disable VAD via raw event (SDK's updateSessionConfig can't send null)
        session.transport.sendEvent({
          type: 'session.update',
          session: {
            type: 'realtime', // required by GA API
            audio: {
              input: {
                transcription: { model: 'gpt-4o-mini-transcribe' },
                turn_detection: null,
              },
            },
          },
        });
        addEvent('vad_disabled', 'turn_detection: null', 'client');
      } catch (error) {
        console.error('Failed to connect session:', error);
        setConnectionStatus('error');
        addEvent('connection_error', error instanceof Error ? error.message : 'Unknown', 'client');
      }
    };

    connectSession().then(() => {
      session.sendMessage(initialMessage);
      addEvent('initial_message_sent', undefined, 'client');
    });

    // ── SDK-level event listeners ───────────────────────────────────────

    session.on('history_updated', (h) => {
      logSessionHistory(h);
      setHistory([...h]);
      refreshUsage();
    });

    session.on('agent_tool_start', (_ctx, _agent, tool) => {
      addEvent('agent_tool_start', tool.name, 'server');
    });

    session.on('agent_tool_end', (_ctx, _agent, tool, result) => {
      const short = typeof result === 'string' ? result.slice(0, 80) : '';
      addEvent('agent_tool_end', `${tool.name}: ${short}`, 'server');
    });

    session.on('error', (err) => {
      addEvent('error', JSON.stringify(err), 'server');
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

      addEvent(type, detail, 'server');
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
      addEvent('session_closed', undefined, 'client');
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
